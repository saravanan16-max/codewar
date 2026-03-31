# CodeWar Entire System

A full symposium-ready coding battle platform using:
- Next.js App Router
- Supabase (database)
- Local judge for Python, Java, C++
- Admin panel
- Team dashboard
- Finals screen

## Run locally

1. Install:
   - Node.js 20+
   - Python
   - Java JDK
   - g++
2. Create `.env.local` from `.env.example`
3. Run `npm install`
4. Run the SQL from `sql/schema.sql` in Supabase SQL editor
5. Start with `npm run dev`
6. Open `http://localhost:3000`
7. Login as admin with `ADMIN_SECRET`
8. Seed demo data from `/admin`

## Important

This local judge is for a controlled event or LAN setting. Do not expose it publicly on the internet.
