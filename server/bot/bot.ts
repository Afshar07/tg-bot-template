import { Bot } from "grammy";
import { getTelegramConfig } from "~/server/utils/config.ts";
import { registerHandlers } from "./register-handlers.ts";

let bot: Bot | undefined;

/** Returns the process-local bot instance without starting polling or changing webhooks. */
export function getBot(): Bot {
  if (bot === undefined) {
    bot = new Bot(getTelegramConfig().botToken);
    registerHandlers(bot);
  }

  return bot;
}
