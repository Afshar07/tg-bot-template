import type { Context } from "grammy";

/** Responds to Telegram's standard start command. */
export async function handleStart(context: Context): Promise<void> {
  await context.reply("Welcome! Use /help to see available commands.");
}
