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
