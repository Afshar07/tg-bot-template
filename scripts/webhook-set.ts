import "dotenv/config";
import { Bot } from "grammy";
import { validateTelegramConfig } from "../server/utils/config.ts";

async function main(): Promise<void> {
  const config = validateTelegramConfig({
    telegramBotToken: process.env.NITRO_TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.NITRO_TELEGRAM_WEBHOOK_SECRET,
  });
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

  if (typeof webhookUrl !== "string" || webhookUrl.trim() === "") {
    throw new Error("TELEGRAM_WEBHOOK_URL is not configured.");
  }

  const url = new URL(webhookUrl);
  if (url.protocol !== "https:") {
    throw new Error("TELEGRAM_WEBHOOK_URL must use HTTPS.");
  }

  await new Bot(config.botToken).api.setWebhook(url.toString(), {
    secret_token: config.webhookSecret,
  });
  console.log("Telegram webhook configured.");
}

main().catch(() => {
  console.error("Unable to configure the Telegram webhook.");
  process.exitCode = 1;
});
