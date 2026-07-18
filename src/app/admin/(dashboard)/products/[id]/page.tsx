import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, ProductWithCategory } from "@/lib/types";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [
    { data: product, error: productError },
    { data: categoriesData, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", params.id)
      .maybeSingle(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (productError || categoriesError) {
    const message = (productError ?? categoriesError)?.message;
    throw new Error(`Failed to load product: ${message}`);
  }

  if (!product) {
    notFound();
  }

  const categories = (categoriesData ?? []) as Category[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        Edit Product
      </h1>
      <ProductForm
        categories={categories}
        product={product as unknown as ProductWithCategory}
      />
    </div>
  );
}
