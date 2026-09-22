import type { Bot } from "grammy";
import { handleHelp } from "./handlers/help.ts";
import { handleStart } from "./handlers/start.ts";

const registeredBots = new WeakSet<object>();

/** Registers the template's command handlers exactly once for each bot. */
export function registerHandlers(bot: Bot): void {
  if (registeredBots.has(bot)) {
    return;
  }

  registeredBots.add(bot);
  bot.command("start", handleStart);
  bot.command("help", handleHelp);
}
