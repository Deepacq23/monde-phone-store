"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Toggle } from "@/components/admin/Toggle";
import { slugify } from "@/lib/admin/slug";
import { uploadProductImage, deleteProductImageByUrl } from "@/lib/admin/storage";
import type { Category, ProductCondition, ProductWithCategory } from "@/lib/types";
import { createProduct, updateProduct, type ProductInput } from "./actions";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductWithCategory;
}) {
  const router = useRouter();
  const isEditing = Boolean(product);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceTzs, setPriceTzs] = useState(
    product ? String(product.price_tzs) : ""
  );
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? categories[0]?.id ?? ""
  );
  const [condition, setCondition] = useState<ProductCondition>(
    product?.condition ?? "new"
  );
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(product?.image_urls ?? []);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const slugPreview = slugify(name);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError(null);
    setUploadingCount((c) => c + files.length);

    for (const file of files) {
      try {
        const url = await uploadProductImage(file);
        setImages((prev) => [...prev, url]);
      } catch (err) {
        console.error("Image upload failed:", err);
        setError("Failed to upload one or more images.");
      } finally {
        setUploadingCount((c) => c - 1);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
    deleteProductImageByUrl(url).catch(() => {
      // Best-effort cleanup — leaving an orphaned file in storage is harmless.
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Number(priceTzs);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!categoryId) {
      setError("Choose a category.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }

    const input: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price_tzs: Math.round(price),
      category_id: categoryId,
      condition,
      in_stock: inStock,
      featured,
      image_urls: images,
    };

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(product!.id, input)
        : await createProduct(input);

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="iPhone 13 Pro Max 256GB"
          />
          {name.trim() && (
            <p className="text-xs text-muted">
              URL: /products/{isEditing ? product!.slug : slugPreview}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="Condition, storage, warranty, na maelezo mengine..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="price"
              className="text-sm font-medium text-foreground"
            >
              Price (TZS)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step={1000}
              value={priceTzs}
              onChange={(e) => setPriceTzs(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="650000"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="text-sm font-medium text-foreground"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {categories.length === 0 && <option value="">No categories yet</option>}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span id="condition-label" className="text-sm font-medium text-foreground">Condition</span>
          <div role="group" aria-labelledby="condition-label" className="flex gap-2">
            {(["new", "used"] as ProductCondition[]).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={condition === value}
                onClick={() => setCondition(value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
                  condition === value
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <Toggle checked={inStock} onChange={setInStock} label="In Stock" />
          <Toggle checked={featured} onChange={setFeatured} label="Featured" />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
        <span className="text-sm font-medium text-foreground">Images</span>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-[#0F0F10]"
            >
              <Image
                src={url}
                alt=""
                fill
                unoptimized={url.endsWith(".svg")}
                sizes="120px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-foreground transition hover:bg-red-500 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}

          {Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`uploading-${i}`}
              className="flex aspect-square animate-pulse items-center justify-center rounded-xl border border-dashed border-border bg-surface-light text-xs text-muted"
            >
              Uploading...
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted transition hover:border-accent/40 hover:text-accent"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-xs">Add Images</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || uploadingCount > 0}
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
