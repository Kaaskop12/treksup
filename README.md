# Treksup — MVP v1

A working Next.js starting point for Treksup: browse curated multi-day hiking
routes, open a route detail page, check off a packing list, save favorites,
and ask a route-specific assistant (rule-based for now, no external API key
needed to run it).

## What actually works right now

- Discover page: search + difficulty filter over the curated route list in `lib/routes.ts`
- Route detail page: stats, elevation chart, huts, transport, packing list, AI assistant, reviews
- Favorites and packing-list progress are saved in the browser (`localStorage`) — they persist on refresh
- Trips page shows your saved routes
- Everything is mobile-sized (max width 430px) so it looks like an app in any browser

## What is NOT built yet (on purpose, for v1)

- No real backend or database — all route data lives in `lib/routes.ts`. Add
  routes by adding objects to that file.
- No user accounts / login
- No real payments or subscriptions
- No live weather, live maps, or GPX file generation — the AI assistant gives
  rule-based answers from the route data, not a live AI model
- "Download GPX" and "Start planning" buttons are placeholders — wire them up
  once you have real GPX files or a booking flow

## Running it locally

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Putting it on a real website (free)

The easiest way is [Vercel](https://vercel.com) (made by the creators of Next.js):

1. Create a free account on vercel.com
2. Push this folder to a new GitHub repository
3. In Vercel, click "Add New Project" and import that repository
4. Leave the default settings and click Deploy

Vercel will give you a live URL (e.g. `treksup.vercel.app`) in about a minute.
You can later connect your own domain name for free in the Vercel project settings.

Alternative: [Netlify](https://netlify.com) works the same way for Next.js apps.

## Next steps to grow this into the full product

1. Add more routes to `lib/routes.ts` (or move that data into a real database
   like Supabase or Postgres once you outgrow a static file)
2. Add real user accounts (Supabase Auth, Clerk, or NextAuth are common free options)
3. Replace the rule-based assistant in `components/AIAssistant.tsx` with a real
   call to an AI API (e.g. the Anthropic API) — the current logic shows you
   exactly where that call would slot in
4. Add a payments provider (Stripe) for the premium subscription tier
5. Wire up a weather API and a real map (Mapbox has a generous free tier)

## Waitlist (email capture)

Visitors can leave their email on the home page and per route ("GPX coming soon").
Rows go to the Supabase `waitlist` table (`supabase/migrations/20260930120000_waitlist.sql`,
already applied to the Treksup project). Anonymous users can only INSERT; read the list in the
Supabase dashboard. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
(see `.env.example`) locally and in Vercel, or signup shows "not configured".

## GPX

Add a real, verified track at `public/gpx/<route-id>.gpx` and set `gpxUrl: '/gpx/<route-id>.gpx'`
on the route in `lib/routes.ts`. The button switches from "GPX coming soon" to a download.

## Revenue funnel

- **Paid guide test (TMB 2027 booking plan, EUR 29)** on `/route/tour-du-mont-blanc`. With
  `NEXT_PUBLIC_PAYLINK_TMB_2027_PLAN` set to a *live* Stripe Payment Link the button goes to
  checkout; without it, the click opens a "checkout opens soon" email form. Test links
  (`buy.stripe.com/test_...`) are ignored unless `NEXT_PUBLIC_ALLOW_TEST_PAYLINKS=1`.
- **Operator offer** at `/partners` (EUR 490 per route per season). Requests land in `partner_leads`.
- **Funnel events** (`page_view`, `cta_click`, `form_submit`) land in `events` with UTM tags. No
  cookies, no device storage, no user id. Link to the site with `?utm_source=email&utm_campaign=<wave>` to attribute.
- `partner_prospects` is a private outreach tracker (not reachable through the public API).

Daily read-out (Supabase SQL editor):

```sql
select * from funnel_daily where day > now() - interval '14 days' order by day desc, n desc;
select source, count(distinct lower(email)) as people from waitlist group by 1 order by 2 desc;
select created_at, company, email, routes from partner_leads order by created_at desc;
select wave, status, count(*) from partner_prospects group by 1, 2 order by 1, 2;
```

## Tests

`npm test` (vitest), `npm run typecheck`.
