import { defineHandler } from "nitro";
import type { Update } from "grammy/types";
import { getBot } from "~/server/bot/bot.ts";
import { getTelegramConfig, type TelegramConfig } from "~/server/utils/config.ts";

export interface WebhookProcessorDependencies {
  config: TelegramConfig;
  handleUpdate: (update: Update) => Promise<unknown>;
}

/** Checks the Telegram secret header before an untrusted request body is parsed. */
export function hasValidTelegramSecret(request: Request, secret: string): boolean {
  return request.headers.get("x-telegram-bot-api-secret-token") === secret;
}

/** Processes one Telegram webhook request with explicit HTTP failure semantics. */
export async function processTelegramWebhook(
  request: Request,
  dependencies: WebhookProcessorDependencies,
): Promise<Response> {
  if (!hasValidTelegramSecret(request, dependencies.config.webhookSecret)) {
    return new Response(null, { status: 401 });
  }

  let update: unknown;
  try {
    update = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (
    typeof update !== "object" ||
    update === null ||
    !Number.isInteger((update as { update_id?: unknown }).update_id)
  ) {
    return new Response(null, { status: 400 });
  }

  const updateId = (update as { update_id: number }).update_id;
  try {
    await dependencies.handleUpdate(update as Update);
  } catch {
    console.error(`Telegram webhook processing failed for update_id=${updateId}`);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}

export default defineHandler((event) =>
  processTelegramWebhook(event.req, {
    config: getTelegramConfig(),
    handleUpdate: (update) => getBot().handleUpdate(update),
  }),
);
