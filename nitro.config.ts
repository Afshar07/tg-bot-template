import { fileURLToPath } from "node:url";
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  alias: {
    "~": fileURLToPath(new URL("./", import.meta.url)),
  },
  preset: "vercel",
  compatibilityDate: "2026-09-22",
  runtimeConfig: {
    telegramBotToken: "",
    telegramWebhookSecret: "",
  },
});
