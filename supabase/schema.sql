-- MONDE PHONE STORE — Supabase schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to re-run: uses "if not exists" / "on conflict" guards where practical.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_tzs integer not null check (price_tzs >= 0),
  category_id uuid not null references categories(id) on delete restrict,
  image_urls text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  condition text not null default 'new' check (condition in ('new', 'used')),
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);
create index if not exists products_featured_idx on products(featured) where featured = true;
create index if not exists products_in_stock_idx on products(in_stock) where in_stock = true;

-- ---------------------------------------------------------------------------
-- clicks — WhatsApp "order" click tracking
-- ---------------------------------------------------------------------------
create table if not exists clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  clicked_at timestamptz not null default now()
);

create index if not exists clicks_product_id_idx on clicks(product_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table clicks enable row level security;

drop policy if exists "Public can view categories" on categories;
create policy "Public can view categories"
  on categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can view products" on products;
create policy "Public can view products"
  on products for select
  to anon, authenticated
  using (true);

-- Anyone (including anonymous storefront visitors) can log a click, but only
-- service_role (server-side, e.g. an admin dashboard) can read click history.
drop policy if exists "Public can log clicks" on clicks;
create policy "Public can log clicks"
  on clicks for insert
  to anon, authenticated
  with check (true);

-- Admin dashboard reads (overview stats, top-clicked products) run as the
-- signed-in Supabase Auth user, which PostgREST sees as the "authenticated" role.
drop policy if exists "Authenticated can view clicks" on clicks;
create policy "Authenticated can view clicks"
  on clicks for select
  to authenticated
  using (true);

-- Admin dashboard writes (product/category CRUD) run as the signed-in
-- Supabase Auth session, which PostgREST also sees as "authenticated". There
-- is no public signup flow in the app, and the only two accounts are created
-- manually in the Supabase dashboard (see README), so scoping these policies
-- to "authenticated" is equivalent in practice to scoping them to the two admins.
drop policy if exists "Authenticated can insert categories" on categories;
create policy "Authenticated can insert categories"
  on categories for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update categories" on categories;
create policy "Authenticated can update categories"
  on categories for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete categories" on categories;
create policy "Authenticated can delete categories"
  on categories for delete
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert products" on products;
create policy "Authenticated can insert products"
  on products for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update products" on products;
create policy "Authenticated can update products"
  on products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete products" on products;
create policy "Authenticated can delete products"
  on products for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage — product images (the bucket itself is created manually, see README)
-- ---------------------------------------------------------------------------
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ---------------------------------------------------------------------------
-- Seed data — 5 categories
-- ---------------------------------------------------------------------------
insert into categories (name, slug) values
  ('Phones', 'simu'),
  ('Laptops & PCs', 'laptop-na-pc'),
  ('PlayStation', 'playstation'),
  ('JBL Speakers', 'jbl-speakers'),
  ('Ring Lights', 'ring-lights')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Seed data — 6 sample products with realistic Kariakoo (Dar es Salaam) TZS prices
-- ---------------------------------------------------------------------------
insert into products (name, slug, description, price_tzs, category_id, image_urls, in_stock, featured, condition)
values
  (
    'iPhone 13 Pro Max 256GB',
    'iphone-13-pro-max-256gb',
    'iPhone 13 Pro Max, 256GB, Grade A (Used). Battery health 88%+, screen na mwili katika hali nzuri. Inakuja na chaja.',
    1850000,
    (select id from categories where slug = 'simu'),
    array['/seed/iphone-13-pro-max.svg'],
    true,
    true,
    'used'
  ),
  (
    'Samsung Galaxy A54 5G',
    'samsung-galaxy-a54-5g',
    'Samsung Galaxy A54 5G, 128GB/8GB RAM. Simu mpya (New, sealed box), na warranty ya mwaka mmoja.',
    650000,
    (select id from categories where slug = 'simu'),
    array['/seed/galaxy-a54.svg'],
    true,
    true,
    'new'
  ),
  (
    'HP Pavilion 15 Core i5 (11th Gen)',
    'hp-pavilion-15-i5',
    'HP Pavilion 15, Intel Core i5 11th Gen, 8GB RAM, 512GB SSD. Laptop ya matumizi ya ofisi, masomo na kazi za kila siku. Used, hali nzuri sana.',
    1350000,
    (select id from categories where slug = 'laptop-na-pc'),
    array['/seed/hp-pavilion-laptop.svg'],
    true,
    false,
    'used'
  ),
  (
    'Sony PlayStation 5 Slim 1TB',
    'playstation-5-slim-1tb',
    'PlayStation 5 Slim, 1TB Digital/Disc Edition. Console mpya kabisa (New, sealed), inakuja na kidude kimoja (controller).',
    1750000,
    (select id from categories where slug = 'playstation'),
    array['/seed/ps5-slim.svg'],
    true,
    true,
    'new'
  ),
  (
    'JBL Charge 5 Portable Speaker',
    'jbl-charge-5',
    'JBL Charge 5, sauti kali yenye Bass nzuri, IP67 waterproof, betri ya masaa 20+. Mpya kabisa na warranty.',
    320000,
    (select id from categories where slug = 'jbl-speakers'),
    array['/seed/jbl-charge-5.svg'],
    true,
    true,
    'new'
  ),
  (
    'Ring Light 18" na Tripod Stand',
    'ring-light-18-inch-tripod',
    'Ring Light ya inchi 18 na tripod stand ya mita 2.1, remote control, na phone holder. Nzuri kwa content creators, TikTok na picha za studio.',
    75000,
    (select id from categories where slug = 'ring-lights'),
    array['/seed/ring-light-18.svg'],
    true,
    false,
    'new'
  )
on conflict (slug) do nothing;
