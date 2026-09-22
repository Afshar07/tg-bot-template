import type { Context } from "grammy";

/** Responds to Telegram's standard help command. */
export async function handleHelp(context: Context): Promise<void> {
  await context.reply("Available commands:\n/start - Start the bot\n/help - Show this help message");
}
