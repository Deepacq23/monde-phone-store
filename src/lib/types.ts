export type ProductCondition = "new" | "used";

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_tzs: number;
  category_id: string;
  image_urls: string[];
  in_stock: boolean;
  featured: boolean;
  condition: ProductCondition;
  created_at: string;
};

export type ProductWithCategory = Product & {
  category: Category | null;
};
