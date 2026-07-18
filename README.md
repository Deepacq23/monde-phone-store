# Monde Phone Store

Production e-commerce storefront for Monde Phone Store — a phone, PC/laptop,
PlayStation, JBL speaker, and ring light retailer in Kariakoo (Mtaa wa Uhuru),
Dar es Salaam, Tanzania. All orders close via WhatsApp — there is no payment
gateway.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase
(Postgres, Auth, Storage) via `@supabase/ssr`. Deploys to Vercel.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **SQL Editor > New query**, paste the
   entire contents of [`supabase/schema.sql`](./supabase/schema.sql), and run
   it. This creates the `categories`, `products`, and `clicks` tables, sets
   up Row Level Security policies, and seeds 5 categories and 6 sample
   products with realistic TZS prices.
3. Go to **Project Settings > API** and copy the **Project URL** and
   **anon public** key.

## 3. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ALLOWED_ADMIN_EMAILS=you@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **No Supabase yet?** Leave these blank and the site automatically falls
> back to local seed data (`src/lib/seed-data.ts`), so the full design can be
> previewed immediately without a database.

## 4. Set up the admin dashboard

The admin dashboard at `/admin` needs three things beyond the base schema:
authenticated-write RLS policies (already in `supabase/schema.sql` — re-run
it if you set up Supabase before this section existed), a Storage bucket for
product photos, and the two admin user accounts.

### Create the Storage bucket

1. In the Supabase dashboard, go to **Storage > New bucket**.
2. Name it exactly **`product-images`** and mark it **Public**.
3. The bucket's access policies are handled by the RLS policies already in
   `supabase/schema.sql` (on the `storage.objects` table), so no extra setup
   needed there:
   - `anon` and `authenticated` can **read** any object in `product-images`
     (public-read, so product photos load on the storefront for everyone).
   - `authenticated` can **upload** and **delete** objects in
     `product-images` (used by the admin product form's image uploader).

### Create the two admin users

There is no public sign-up — accounts are created manually:

1. In the Supabase dashboard, go to **Authentication > Users > Add user**.
2. Create one user per email in `ALLOWED_ADMIN_EMAILS` (currently
   `mtawamonde@gmail.com` and `dougchaptertz@gmail.com`), set a password, and
   check **Auto Confirm User** (so no email-confirmation step is needed).
3. Optional hardening: under **Authentication > Providers > Email**, disable
   "Allow new users to sign up" — the app never exposes a sign-up form, but
   this closes the Supabase Auth API as a self-registration path too.

Only emails listed in `ALLOWED_ADMIN_EMAILS` can reach `/admin` — anyone else
who somehow signs in is redirected to a "Not Authorized" page (see
`src/middleware.ts` and `src/lib/admin/auth.ts`).

## 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront, or
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin
dashboard.

## 6. Build for production

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel
   project's **Settings > Environment Variables** (set `NEXT_PUBLIC_SITE_URL`
   to the real production domain).
4. Deploy.

## Project structure

```
src/
  app/
    page.tsx                  Landing page
    products/page.tsx         Product listing (category filter + search)
    products/[slug]/page.tsx  Product detail (gallery, price, WhatsApp CTAs)
    api/track-click/route.ts  Logs WhatsApp order clicks to Supabase
    sitemap.ts, robots.ts     SEO
    admin/(auth)/             /admin/login, /admin/not-authorized — no dashboard chrome
    admin/(dashboard)/        /admin, /admin/products, /admin/categories — protected
  components/                 Header, Footer, ProductCard, WhatsApp buttons, etc.
  components/admin/           Shared admin-only UI (StatCard, Toggle)
  lib/
    data.ts                   Data access — reads from Supabase, falls back to seed data
    seed-data.ts               Local fallback data mirroring supabase/schema.sql
    whatsapp.ts                wa.me link + message builders
    supabase/                  Server/browser Supabase clients (@supabase/ssr)
    admin/                     Admin auth (allowlist + requireAdmin), slug generation,
                                Storage upload helpers, overview stats queries
  middleware.ts                Protects /admin/*: requires login + an allowlisted email
supabase/schema.sql            Database schema, RLS policies, and seed data
```

## Admin dashboard

`/admin` is a Supabase Auth–gated dashboard for managing the catalog day to
day, built to be usable entirely from a phone:

- **`/admin/login`** — email + password sign-in (no public sign-up).
- **`/admin`** — overview: total products, products per category, WhatsApp
  clicks in the last 7 days, and the 5 most-clicked products.
- **`/admin/products`** — searchable table with create/edit/delete, a
  "Copy link" button per product (copies the public product URL for sharing
  over WhatsApp), and a form with multi-image upload (previews + delete) to
  the `product-images` Storage bucket. Slugs auto-generate from the product
  name on creation and are never changed on edit, so previously shared links
  keep working even after a rename.
- **`/admin/categories`** — add/rename/delete; deleting a category that
  still has products is blocked with an explanatory error instead of
  silently orphaning or cascading.

Access control is enforced in two places: `src/middleware.ts` redirects
unauthenticated requests to `/admin/login` and non-allowlisted (but
authenticated) users to `/admin/not-authorized`, and every Server Action
that mutates data calls `requireAdmin()` (`src/lib/admin/auth.ts`) again as
defense in depth. The allowlist itself is just `ALLOWED_ADMIN_EMAILS` — see
[Set up the admin dashboard](#4-set-up-the-admin-dashboard) above for how the
underlying Supabase Auth users and Storage bucket get created.

## How WhatsApp ordering works

Every product page has two CTAs that open `https://wa.me/255621069166` with a
pre-filled message (product name, price in TZS, and the product page URL):

- **Agiza kwa WhatsApp** — place an order.
- **Lipa kwa Mkopo — Uliza** — ask about installment payment.

Before the WhatsApp redirect, the click is logged to the `clicks` table via
`POST /api/track-click` (using `navigator.sendBeacon`, so it never blocks or
delays the redirect). If Supabase isn't configured, the endpoint responds
successfully without writing anywhere.
