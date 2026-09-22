import { describe, expect, it } from "vitest";
import { validateTelegramConfig } from "~/server/utils/config.ts";

describe("validateTelegramConfig", () => {
  it("rejects a missing bot token", () => {
    expect(() =>
      validateTelegramConfig({ telegramWebhookSecret: "valid-secret" }),
    ).toThrow("Telegram bot token is not configured.");
  });

  it("rejects a missing webhook secret", () => {
    expect(() => validateTelegramConfig({ telegramBotToken: "token" })).toThrow(
      "Telegram webhook secret is not configured.",
    );
  });

  it("rejects an invalid webhook secret", () => {
    expect(() =>
      validateTelegramConfig({
        telegramBotToken: "token",
        telegramWebhookSecret: "contains spaces",
      }),
    ).toThrow("Telegram webhook secret has an invalid format.");
  });

  it("returns validated private configuration", () => {
    expect(
      validateTelegramConfig({
        telegramBotToken: "token",
        telegramWebhookSecret: "valid-secret_123",
      }),
    ).toEqual({ botToken: "token", webhookSecret: "valid-secret_123" });
  });
});
