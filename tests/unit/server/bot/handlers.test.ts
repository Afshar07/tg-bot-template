import { describe, expect, it, vi } from "vitest";
import { handleHelp } from "~/server/bot/handlers/help.ts";
import { handleStart } from "~/server/bot/handlers/start.ts";

describe("bot command handlers", () => {
  it("replies to start", async () => {
    const reply = vi.fn(async () => undefined);

    await handleStart({ reply } as never);

    expect(reply).toHaveBeenCalledWith("Welcome! Use /help to see available commands.");
  });

  it("replies to help", async () => {
    const reply = vi.fn(async () => undefined);

    await handleHelp({ reply } as never);

    expect(reply).toHaveBeenCalledWith(
      "Available commands:\n/start - Start the bot\n/help - Show this help message",
    );
  });
});
