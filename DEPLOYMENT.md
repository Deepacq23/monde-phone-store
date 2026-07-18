# Deployment Guide

This covers taking Monde Phone Store from a local checkout to a live
production site on Vercel, plus a handover checklist for whoever runs the
store day to day (not a developer).

For initial Supabase project setup (schema, RLS policies, seed data), see
[`README.md`](./README.md) — this doc assumes that part is already done and
focuses on shipping and handing off.

## 1. Push to GitHub

```bash
git init                       # if this repo isn't already a git repo
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

If the repo already exists on GitHub, just commit and push your changes as
normal.

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Select the repository and click **Import**.
3. Vercel auto-detects Next.js — leave the build command
   (`next build`) and output settings on their defaults.
4. **Before clicking Deploy**, add the environment variables below (or add
   them under **Settings > Environment Variables** afterward and redeploy).

## 3. Environment variables

Set these in the Vercel project (**Settings > Environment Variables**),
applied to Production (and Preview, if you want preview deployments to hit
the same database):

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Same page — use the **anon public** key, never the service role key |
| `ALLOWED_ADMIN_EMAILS` | Comma-separated admin emails | Currently `dougchaptertz@gmail.com,mtawamonde@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://mondephonestore.co.tz` | Used for metadata, Open Graph tags, and the sitemap — without this it silently falls back to a placeholder domain in SEO tags |

If `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` are left unset, the site still
works — it falls back to local seed data automatically (see
`src/lib/data.ts`) — but the real catalog and the `/admin` dashboard won't
be usable, so don't skip these for a real launch.

After adding or changing env vars, trigger a redeploy (Vercel doesn't
hot-reload env vars into already-running deployments).

## 4. Supabase Storage bucket (product photos)

The admin product form uploads photos to a Storage bucket that has to exist
before anyone can add product images:

1. Supabase dashboard → **Storage → New bucket**.
2. Name it exactly `product-images` and mark it **Public**.
3. No further policy setup needed — `supabase/schema.sql` already includes
   the RLS policies on `storage.objects` (public read, authenticated
   upload/delete) for this bucket name.

Without this step, product creation still works but every image upload in
`/admin/products` will fail.

## 5. Verify the deployment

Once deployed:

- Visit the production URL — homepage, `/products`, and a product detail
  page should all load with real catalog data (not the seed placeholders,
  once Supabase is configured).
- Visit `/admin/login` and sign in with an allowlisted admin account (see
  [Client handover](#client-handover-checklist) below for how those
  accounts get created).
- Place a test WhatsApp order from a product page and confirm it opens
  WhatsApp with a pre-filled message.
- Check `/sitemap.xml` and `/robots.txt` resolve correctly.

Run `npm run build` locally first if you want to catch type errors or lint
issues before pushing — Vercel runs the same `next build` and will fail the
deployment on the same errors.

---

## Client handover checklist

Everything below happens at **mondephonestore.co.tz/admin** (or whatever
domain the site is deployed to) — no code, no terminal, just a browser,
ideally usable from a phone.

### Logging in

1. Go to `/admin/login`.
2. Enter your email and password.
3. Only the two emails set up for this store can sign in
   (`dougchaptertz@gmail.com` and `mtawamonde@gmail.com`). If someone else's
   email needs access later, that has to be added in the Supabase dashboard
   under **Authentication → Users**, and to the `ALLOWED_ADMIN_EMAILS`
   environment variable in Vercel — ask your developer for this one.

If you forget your password, use Supabase's password reset — ask your
developer to set this up if it isn't already, since password resets aren't
built into the admin login screen itself.

### Adding a new product

1. After logging in, go to **Products** in the top nav, then
   **+ New Product**.
2. Fill in:
   - **Name** — e.g. "iPhone 13 Pro Max 256GB". The product's web address
     is generated from this automatically and won't change later even if
     you rename the product, so old WhatsApp links keep working.
   - **Description** — condition details, storage, warranty, etc.
   - **Price (TZS)** — numbers only, no commas or "TZS" prefix.
   - **Category** — choose from the existing list (see
     [Categories](#managing-categories) below to add a new one first if
     needed).
   - **Condition** — New or Used.
   - **In Stock** — turn off if you're out of stock; the product stays
     listed but shows "Out of Stock" and customers can still ask about
     availability.
   - **Featured** — see [Deal ya Wiki](#featuring-a-product-deal-ya-wiki)
     below.
3. Click **+ Add Images**, choose one or more photos from your device.
   Wait for each to finish uploading (you'll see "Uploading..." then the
   photo thumbnail) before saving.
4. Click **Create Product**. It appears on the live storefront immediately
   — no separate publish step.

### Editing or removing a product

1. **Products** → find the product (use the search box if the list is
   long) → **Edit**.
2. Change anything and click **Save Changes**, or click **Delete** to
   remove it permanently (this can't be undone — there's a confirmation
   prompt).
3. **Copy link** next to a product copies its public product-page URL, handy
   for sharing a specific item over WhatsApp or social media.

### Featuring a product ("Deal ya Wiki")

The homepage's "Featured Deals" section shows up to 4 products marked
**Featured** — this is what shows the "Deal ya Wiki" badge to customers.

1. Open the product (new or existing) in **Products**.
2. Turn on the **Featured** toggle and save.
3. It'll appear on the homepage the next time someone loads it. If more
   than 4 products are marked Featured, only the 4 most recently
   added/edited featured products show — turn off **Featured** on older
   deals as new ones come in so the homepage stays to exactly the ones you
   want highlighted.

### Managing categories

**Categories** in the top nav → **Add Category** to create a new one (e.g.
"Smart Watches"), **Rename** to change a name (the web address for that
category stays the same even after a rename, so any shared links keep
working), or **Delete** to remove one.

A category can't be deleted while it still has products in it — move or
delete those products first, then delete the category.

### Checking WhatsApp order activity

The **Overview** tab (homepage of `/admin`) shows, at a glance:

- Total products and categories.
- How many times customers tapped a WhatsApp order/installment button in
  the last 7 days.
- Your 5 most-clicked products — useful for deciding what to feature next.

### Signing out

Click **Logout** in the top-right of any admin page.
