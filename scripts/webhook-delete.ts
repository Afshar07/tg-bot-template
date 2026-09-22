import "dotenv/config";
import { Bot } from "grammy";
import { validateTelegramConfig } from "../server/utils/config.ts";

async function main(): Promise<void> {
  const config = validateTelegramConfig({
    telegramBotToken: process.env.NITRO_TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.NITRO_TELEGRAM_WEBHOOK_SECRET,
  });
  await new Bot(config.botToken).api.deleteWebhook();
  console.log("Telegram webhook deleted; pending updates were retained.");
}

main().catch(() => {
  console.error("Unable to delete the Telegram webhook.");
  process.exitCode = 1;
});
