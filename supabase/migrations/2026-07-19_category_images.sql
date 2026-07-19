-- Category cover images (run once in Supabase SQL Editor)
alter table categories add column if not exists image_url text;
