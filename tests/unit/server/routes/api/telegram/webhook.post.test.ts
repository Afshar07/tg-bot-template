import { describe, expect, it, vi } from "vitest";
import { processTelegramWebhook } from "~/server/routes/api/telegram/webhook.post.ts";

const dependencies = {
  config: { botToken: "token", webhookSecret: "expected-secret" },
  handleUpdate: vi.fn(async () => undefined),
};

describe("processTelegramWebhook", () => {
  it("rejects a request with a missing secret without handling the update", async () => {
    const response = await processTelegramWebhook(
      new Request("https://example.test/api/telegram/webhook", {
        method: "POST",
        body: JSON.stringify({ update_id: 1 }),
      }),
      dependencies,
    );

    expect(response.status).toBe(401);
    expect(dependencies.handleUpdate).not.toHaveBeenCalled();
  });

  it("rejects a request with a wrong secret without handling the update", async () => {
    const response = await processTelegramWebhook(
      new Request("https://example.test/api/telegram/webhook", {
        method: "POST",
        headers: { "x-telegram-bot-api-secret-token": "wrong-secret" },
        body: JSON.stringify({ update_id: 1 }),
      }),
      dependencies,
    );

    expect(response.status).toBe(401);
    expect(dependencies.handleUpdate).not.toHaveBeenCalled();
  });

  it("processes a valid request", async () => {
    const handleUpdate = vi.fn(async () => undefined);
    const response = await processTelegramWebhook(
      new Request("https://example.test/api/telegram/webhook", {
        method: "POST",
        headers: { "x-telegram-bot-api-secret-token": "expected-secret" },
        body: JSON.stringify({ update_id: 1 }),
      }),
      { ...dependencies, handleUpdate },
    );

    expect(response.status).toBe(200);
    expect(handleUpdate).toHaveBeenCalledWith({ update_id: 1 });
  });

  it("rejects malformed JSON after a valid secret", async () => {
    const response = await processTelegramWebhook(
      new Request("https://example.test/api/telegram/webhook", {
        method: "POST",
        headers: { "x-telegram-bot-api-secret-token": "expected-secret" },
        body: "{",
      }),
      dependencies,
    );

    expect(response.status).toBe(400);
  });

  it("returns 500 when update processing fails", async () => {
    const handleUpdate = vi.fn(async () => {
      throw new Error("Telegram API failure");
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await processTelegramWebhook(
      new Request("https://example.test/api/telegram/webhook", {
        method: "POST",
        headers: { "x-telegram-bot-api-secret-token": "expected-secret" },
        body: JSON.stringify({ update_id: 99 }),
      }),
      { ...dependencies, handleUpdate },
    );

    expect(response.status).toBe(500);
    expect(error).toHaveBeenCalledWith("Telegram webhook processing failed for update_id=99");
    error.mockRestore();
  });
});
