# Telegram Bot Template

A minimal, webhook-only Telegram bot built with Nitro, TypeScript, grammY, and Vercel. Repositories generated from this template are independent projects.

## Setup

1. Select **Use this template** on GitHub, then clone your new repository.
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token.
4. Copy `.env.example` to `.env`, then set `NITRO_TELEGRAM_BOT_TOKEN` and a random `NITRO_TELEGRAM_WEBHOOK_SECRET`. The secret must be 1-256 characters containing only letters, numbers, `_`, or `-`.
5. Start the server with `pnpm dev`. Telegram needs a public HTTPS endpoint, so expose it with a tunnel such as Cloudflare Tunnel or ngrok. Set `TELEGRAM_WEBHOOK_URL` to the tunnel's complete `/api/telegram/webhook` URL and run:

   ```bash
   pnpm webhook:set
   ```

## Deploy to Vercel

Import the generated repository into Vercel. Configure `NITRO_TELEGRAM_BOT_TOKEN` and `NITRO_TELEGRAM_WEBHOOK_SECRET` in the Vercel project environment, deploy, then set `TELEGRAM_WEBHOOK_URL` locally to the deployed complete webhook URL and run `pnpm webhook:set`.

Webhook operations are intentionally local operational scripts, not public endpoints:

```bash
pnpm webhook:info
pnpm webhook:delete
```

Deleting a webhook retains pending updates by default.

## Add bot behavior

Register commands in `server/bot/register-handlers.ts` and place their implementations in `server/bot/handlers/`. The singleton bot is invoked only by the webhook route: it never starts polling and never changes webhook settings at module import time.

## Checks

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Delivery and retries

Telegram delivers webhooks at least once. This stateless V1 template does not deduplicate updates or provide exactly-once processing. Keep handlers retry-safe. Any irreversible side effect needs persistent idempotency keyed by Telegram's `update_id` before it is performed.
