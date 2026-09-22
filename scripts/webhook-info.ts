import "dotenv/config";
import { Bot } from "grammy";
import { validateTelegramConfig } from "../server/utils/config.ts";

async function main(): Promise<void> {
  const config = validateTelegramConfig({
    telegramBotToken: process.env.NITRO_TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.NITRO_TELEGRAM_WEBHOOK_SECRET,
  });
  const info = await new Bot(config.botToken).api.getWebhookInfo();
  console.log(JSON.stringify(info, null, 2));
}

main().catch(() => {
  console.error("Unable to get Telegram webhook information.");
  process.exitCode = 1;
});
