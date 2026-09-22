import { useRuntimeConfig } from "nitro/runtime-config";

export interface TelegramConfig {
  botToken: string;
  webhookSecret: string;
}

export interface TelegramConfigInput {
  telegramBotToken?: unknown;
  telegramWebhookSecret?: unknown;
}

const telegramSecretPattern = /^[A-Za-z0-9_-]{1,256}$/;

/** Validates the private configuration needed to receive Telegram updates. */
export function validateTelegramConfig(input: TelegramConfigInput): TelegramConfig {
  const botToken = input.telegramBotToken;
  const webhookSecret = input.telegramWebhookSecret;

  if (typeof botToken !== "string" || botToken.trim() === "") {
    throw new Error("Telegram bot token is not configured.");
  }

  if (typeof webhookSecret !== "string" || webhookSecret.trim() === "") {
    throw new Error("Telegram webhook secret is not configured.");
  }

  if (!telegramSecretPattern.test(webhookSecret)) {
    throw new Error("Telegram webhook secret has an invalid format.");
  }

  return { botToken, webhookSecret };
}

/** Reads and validates Nitro's private runtime configuration. */
export function getTelegramConfig(): TelegramConfig {
  return validateTelegramConfig(useRuntimeConfig() as unknown as TelegramConfigInput);
}
