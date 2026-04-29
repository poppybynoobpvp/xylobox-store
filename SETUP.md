# XyloBox Store — Setup Guide

## Step 1: Create Supabase account (free database)

1. Go to supabase.com → Sign up (free)
2. Create new project → name it "xylobox-store"
3. After project is ready, go to **SQL Editor**
4. Copy everything from `supabase-schema.sql` and run it
5. Go to **Settings → API**
   - Copy **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role** key → this is `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Create Discord Webhook (for order notifications)

1. Open your Discord server → pick a channel (e.g. #orders)
2. Click gear icon → Integrations → Webhooks → New Webhook
3. Copy the webhook URL → this is `DISCORD_WEBHOOK_URL`

## Step 3: Deploy to Vercel (free hosting)

1. Push this project to GitHub:
   - Go to github.com → New repository → name it "xylobox-store"
   - Follow the instructions to push your code

2. Go to vercel.com → Sign up with GitHub
3. Click "Add New Project" → Import your GitHub repo
4. Before deploying, add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (from Supabase) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from Supabase) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (from Supabase) |
   | `DISCORD_WEBHOOK_URL` | (from Discord) |
   | `ADMIN_PASSWORD` | (make your own password) |

5. Click Deploy → done!

## Step 4: Access your store

- Store: `https://your-project.vercel.app`
- Admin panel: `https://your-project.vercel.app/admin`

## Pages

| Page | Description |
|------|-------------|
| `/` | Product listing |
| `/checkout?product=rank-67` | Buy a specific product |
| `/order/[id]` | Order status page |
| `/admin` | Admin panel to confirm orders |

## Later: Enable RCON for auto-delivery

When you're ready to add automatic item delivery (so the website gives items to players automatically):
1. Enable RCON in your server's `server.properties`
2. Set `rcon.port`, `rcon.password`, and `enable-rcon=true`
3. Tell Claude Code and they'll add auto-delivery to the admin panel
