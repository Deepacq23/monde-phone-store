import type { Category, ProductWithCategory } from "@/lib/types";

// Local fallback data — mirrors supabase/schema.sql exactly. Used when
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not configured,
// so the storefront design can be previewed immediately without a database.

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-simu", name: "Phones", slug: "simu", created_at: "2026-01-01T00:00:00Z" },
  {
    id: "cat-laptop-na-pc",
    name: "Laptops & PCs",
    slug: "laptop-na-pc",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-playstation",
    name: "PlayStation",
    slug: "playstation",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-jbl-speakers",
    name: "JBL Speakers",
    slug: "jbl-speakers",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-ring-lights",
    name: "Ring Lights",
    slug: "ring-lights",
    created_at: "2026-01-01T00:00:00Z",
  },
];

function category(slug: string): Category {
  const found = SEED_CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown seed category slug: ${slug}`);
  return found;
}

export const SEED_PRODUCTS: ProductWithCategory[] = [
  {
    id: "prod-iphone-13-pro-max-256gb",
    name: "iPhone 13 Pro Max 256GB",
    slug: "iphone-13-pro-max-256gb",
    description:
      "iPhone 13 Pro Max, 256GB, Grade A (Used). Battery health 88%+, screen na mwili katika hali nzuri. Inakuja na chaja.",
    price_tzs: 1850000,
    category_id: "cat-simu",
    category: category("simu"),
    image_urls: ["/seed/iphone-13-pro-max.svg"],
    in_stock: true,
    featured: true,
    condition: "used",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod-samsung-galaxy-a54-5g",
    name: "Samsung Galaxy A54 5G",
    slug: "samsung-galaxy-a54-5g",
    description:
      "Samsung Galaxy A54 5G, 128GB/8GB RAM. Simu mpya (New, sealed box), na warranty ya mwaka mmoja.",
    price_tzs: 650000,
    category_id: "cat-simu",
    category: category("simu"),
    image_urls: ["/seed/galaxy-a54.svg"],
    in_stock: true,
    featured: true,
    condition: "new",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod-hp-pavilion-15-i5",
    name: "HP Pavilion 15 Core i5 (11th Gen)",
    slug: "hp-pavilion-15-i5",
    description:
      "HP Pavilion 15, Intel Core i5 11th Gen, 8GB RAM, 512GB SSD. Laptop ya matumizi ya ofisi, masomo na kazi za kila siku. Used, hali nzuri sana.",
    price_tzs: 1350000,
    category_id: "cat-laptop-na-pc",
    category: category("laptop-na-pc"),
    image_urls: ["/seed/hp-pavilion-laptop.svg"],
    in_stock: true,
    featured: false,
    condition: "used",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod-playstation-5-slim-1tb",
    name: "Sony PlayStation 5 Slim 1TB",
    slug: "playstation-5-slim-1tb",
    description:
      "PlayStation 5 Slim, 1TB Digital/Disc Edition. Console mpya kabisa (New, sealed), inakuja na kidude kimoja (controller).",
    price_tzs: 1750000,
    category_id: "cat-playstation",
    category: category("playstation"),
    image_urls: ["/seed/ps5-slim.svg"],
    in_stock: true,
    featured: true,
    condition: "new",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod-jbl-charge-5",
    name: "JBL Charge 5 Portable Speaker",
    slug: "jbl-charge-5",
    description:
      "JBL Charge 5, sauti kali yenye Bass nzuri, IP67 waterproof, betri ya masaa 20+. Mpya kabisa na warranty.",
    price_tzs: 320000,
    category_id: "cat-jbl-speakers",
    category: category("jbl-speakers"),
    image_urls: ["/seed/jbl-charge-5.svg"],
    in_stock: true,
    featured: true,
    condition: "new",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod-ring-light-18-inch-tripod",
    name: 'Ring Light 18" na Tripod Stand',
    slug: "ring-light-18-inch-tripod",
    description:
      'Ring Light ya inchi 18 na tripod stand ya mita 2.1, remote control, na phone holder. Nzuri kwa content creators, TikTok na picha za studio.',
    price_tzs: 75000,
    category_id: "cat-ring-lights",
    category: category("ring-lights"),
    image_urls: ["/seed/ring-light-18.svg"],
    in_stock: true,
    featured: false,
    condition: "new",
    created_at: "2026-01-01T00:00:00Z",
  },
];
