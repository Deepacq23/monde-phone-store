# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Monde Phone Store — a production e-commerce storefront for a real electronics
shop in Kariakoo, Dar es Salaam, Tanzania (phones, laptops/PCs, PlayStation,
JBL speakers, ring lights). There is no payment gateway: every order closes
via a pre-filled WhatsApp message to the shop's number. Code, comments, and
admin-facing strings are in English.

**Language convention (deliberate, don't "fix" toward one language):**
English for navigation/structure ("Home", "All Products", "Categories",
"Search products...", section headings, empty states, footer). Swahili is
reserved for purchase actions and trust language: "Agiza kwa WhatsApp"
(primary CTA), "Lipa kwa Mkopo — Uliza" (secondary CTA), the WhatsApp message
bodies built in `src/lib/whatsapp.ts`, and trust badges ("Mkopo", "Cash",
"Exchange"). This mirrors how real Tanzanian tech retailers actually mix the
two languages — don't translate the Swahili CTA/trust strings to English, and
don't translate structural copy to Swahili.

## Project Status

**Milestone 1 — Storefront: COMPLETE, design approved (2026-07-05).**
The emerald-accent / mixed-language design (English navigation + structure,
Swahili purchase/trust language) was reviewed and approved. Landing page,
`/products`, `/products/[slug]`, WhatsApp ordering with click tracking, SEO,
and the local seed-data fallback are all built and verified working
end-to-end in a browser.

**Milestone 2 — Admin dashboard: BUILT (verified 2026-07-18), real Supabase
project wired up via `.env.local`.** All three "next steps" from the prior
version of this doc are done: schema applied, real credentials in place, and
the dashboard itself exists under `src/app/admin/`:

- **Auth** — `(auth)/login` (Supabase email/password `LoginForm`) and
  `(auth)/not-authorized`. `src/middleware.ts` gates every `/admin/:path*`
  request: unauthenticated → login, authenticated-but-not-allowlisted →
  not-authorized, already-logged-in → bounced off `/login`.
  `src/lib/admin/auth.ts` has `isAllowedAdminEmail` (reads
  `ALLOWED_ADMIN_EMAILS`) and a `requireAdmin()` defense-in-depth check that
  every server action re-runs, since middleware alone doesn't cover direct
  Server Action invocation.
- **Overview** (`(dashboard)/page.tsx`) — total products, WhatsApp clicks
  (7 days), category count, products-per-category, top 5 most-clicked
  products. Backed by `src/lib/admin/stats.ts`.
- **Products** (`(dashboard)/products/`) — list/create/edit via
  `ProductsTable.tsx` + `ProductForm.tsx`, CRUD server actions in
  `actions.ts`. Slugs are auto-generated on create (`src/lib/admin/slug.ts`)
  and deliberately **never** regenerated on rename, since slugs are already
  baked into shared WhatsApp links.
- **Categories** (`(dashboard)/categories/`) — `CategoriesManager.tsx` +
  `actions.ts`; deleting a category with existing products is blocked
  rather than orphaning them.
- Both products and categories actions call `revalidatePath` on the
  relevant storefront routes (`/`, `/products`, `/products/[slug]`) so edits
  show up immediately without a rebuild.
- `src/lib/admin/storage.ts` handles product image upload to Supabase
  Storage.

**Not yet confirmed / possible gaps to check before calling Milestone 2
fully done:** image upload UX end-to-end in a browser, and whether the
`clicks` table view mentioned in the original scope is fully represented by
the Overview page's "top 5 clicked" list or needs its own dedicated page.

**Admin emails for `ALLOWED_ADMIN_EMAILS`:**
- `dougchaptertz@gmail.com`
- `mtawamonde@gmail.com` — confirmed spelling

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at localhost:3000
npm run build     # production build (also type-checks)
npm run start     # run the production build
npm run lint      # next lint (eslint)
```

There is no test suite configured.

To verify a change actually works, prefer driving the app in a browser
(e.g. via the `run` skill / Playwright) over trusting `next build` alone —
several bugs here (hydration mismatches, broken WhatsApp links) only show up
at runtime.

## Stack versions — do not casually upgrade

Pinned deliberately to **Next.js 14** (`14.2.35`) with **React 18** and
**Tailwind CSS v3**, per the original project spec. `create-next-app@latest`
will scaffold Next 16 / React 19 / Tailwind v4 by default — that combination
was explicitly downgraded away from for this repo. `npm audit` shows a
handful of advisories against Next 14.2.35 whose fixes only land in Next
15/16; that's a known, accepted tradeoff, not an oversight — don't "fix" it
by bumping the major version without checking with the user first.

## Architecture

### Data layer: Supabase with automatic seed-data fallback

The core architectural pattern to understand is in `src/lib/data.ts`. Every
data-fetching function (`getCategories`, `getProducts`, `getProductBySlug`,
`getFeaturedProducts`, `getRelatedProducts`, `getAllProductSlugs`) follows
the same shape:

1. If `hasSupabaseEnv()` (`src/lib/supabase/env.ts`) is false — no
   `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` set — read straight from
   `src/lib/seed-data.ts` (in-memory, mirrors `supabase/schema.sql` exactly:
   same slugs, categories, and prices).
2. If Supabase *is* configured, query it; on any query/connection **error**,
   log and fall back to the seed data filter logic.
3. A legitimate empty result from Supabase (e.g. a category with no
   products) is *not* an error and is returned as-is — only real failures
   trigger the seed fallback.

This is what lets the site "gracefully fall back to local seed data so the
design previews immediately" with zero configuration. When adding a new data
function, follow the same try-Supabase/catch-to-seed shape, and keep
`seed-data.ts` in sync with `schema.sql` if you touch either.

Supabase clients live in `src/lib/supabase/`: `server.ts` (Server
Components / Route Handlers, cookie-based via `@supabase/ssr`, used by the
admin dashboard's pages and server actions — anything that needs the
signed-in user's session), `public.ts` (anonymous, cookie-free client via
plain `@supabase/supabase-js`, used exclusively by `src/lib/data.ts`'s
public read functions), and `client.ts` (browser-side, used by the admin
product form's image upload). **Don't merge `public.ts` back into
`server.ts`** — `server.ts`'s `createClient()` calls `cookies()`
unconditionally, which forces any route touching it into per-request
dynamic rendering and, worse, makes `next build`'s static-generation pass
throw a `DYNAMIC_SERVER_USAGE` error that `data.ts`'s try/catch
misinterprets as a real Supabase failure — silently baking seed data into
prerendered pages instead of the real catalog. Public storefront reads need
no session, so they get their own client instead.
`ALLOWED_ADMIN_EMAILS` in `.env.local` backs the admin allowlist enforced in
`src/middleware.ts` and `src/lib/admin/auth.ts` — see Project Status above
for the full admin dashboard scope.

### WhatsApp ordering flow

- `src/lib/whatsapp.ts` builds the `wa.me` URL and the pre-filled Swahili
  message (product name, formatted TZS price, product page URL) — keep these
  messages in Swahili per the language convention above. Two intents:
  `"order"` and `"installment"` (different message text).
- `src/components/WhatsAppCTAButtons.tsx` (product detail page) fires
  `navigator.sendBeacon` (with a `fetch(..., {keepalive:true})` fallback) to
  `/api/track-click` on click, then lets the anchor's normal
  `target="_blank"` navigation proceed — tracking never blocks or delays the
  redirect.
- `src/app/api/track-click/route.ts` inserts into the `clicks` table if
  Supabase is configured; otherwise no-ops and still returns success. It
  never throws back to the client — a failed insert must not break checkout.
- The floating WhatsApp button (`src/components/FloatingWhatsApp.tsx`) and
  the header's WhatsApp button are general contact links (no `product_id`)
  and are **not** tracked — only per-product order/installment CTAs are.

### Database

`supabase/schema.sql` is the source of truth: `categories`, `products`,
`clicks` tables, RLS policies (public read on categories/products,
public insert-only on clicks), and the seed rows. It must be run manually in
the Supabase SQL Editor — there's no migration tooling. If you change the
schema, update both this file and `src/lib/seed-data.ts` together.

### Routing / filtering

`/products` filtering (category + search) is done entirely via URL search
params (`?category=slug&search=term`), rendered through plain `<Link>`
(`CategoryFilterTabs`) and a `<form method="GET">` (`SearchBox`) — no client
JS or debouncing, so it works with JS disabled and needs no state
management. `ProductGallery` is the one genuinely interactive (`"use client"`)
piece on the product page, for thumbnail switching.

### Design system

`tailwind.config.ts` defines the palette: a cool near-black
`background`/`surface`, and a single `accent` color (emerald green,
`#10B981` / hover `#059669` — chosen to match the WhatsApp-first buying
flow). There is deliberately only one accent hue in the whole UI — don't
introduce a second color for "variety." Fonts are wired in
`src/app/layout.tsx` via `next/font/google` — Space Grotesk
(`--font-heading`) for headings, Inter (`--font-body`) for everything else —
and consumed through the `font-heading` / `font-sans` Tailwind utilities.

Product images in `public/seed/*.svg` are intentionally neutral grey
line-art placeholders (not accent-colored — they're meant to read as
placeholders, not decoration, and not stock photos either, since
hot-linking external images is fragile for a production site).
`next.config.mjs` enables `dangerouslyAllowSVG` so `next/image` can render
them; components pass `unoptimized` for `.svg` sources specifically. Replace
`image_urls` (via Supabase Storage) with real product photos when the client
provides them.
