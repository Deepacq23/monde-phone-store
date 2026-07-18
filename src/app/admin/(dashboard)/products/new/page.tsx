import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = {
  title: "New Product",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  const categories = (data ?? []) as Category[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        New Product
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
