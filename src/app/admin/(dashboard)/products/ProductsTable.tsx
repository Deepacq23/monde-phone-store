"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConditionBadge } from "@/components/ConditionBadge";
import { formatTZS } from "@/lib/format";
import { SITE_URL } from "@/lib/constants";
import type { ProductWithCategory } from "@/lib/types";
import { deleteProduct } from "./actions";

export function ProductsTable({
  products,
}: {
  products: ProductWithCategory[];
}) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const term = search.trim().toLowerCase();
  const filtered = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.category?.name ?? "").toLowerCase().includes(term)
      )
    : products;

  function handleCopyLink(product: ProductWithCategory) {
    const url = `${SITE_URL}/products/${product.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(product.id);
      setTimeout(() => {
        setCopiedId((id) => (id === product.id ? null : id));
      }, 2000);
    });
  }

  function handleDelete(product: ProductWithCategory) {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) {
      return;
    }
    setError(null);
    setDeletingId(product.id);
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      setDeletingId(null);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full max-w-sm rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted">
          No products found.
        </p>
      ) : (
        <div className="scrollbar-thin overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const image = product.image_urls[0];
                const isDeleting = isPending && deletingId === product.id;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-[#0F0F10]">
                          {image && (
                            <Image
                              src={image}
                              alt=""
                              fill
                              unoptimized={image.endsWith(".svg")}
                              sizes="44px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {product.name}
                          </p>
                          <ConditionBadge condition={product.condition} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatTZS(product.price_tzs)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={
                            product.in_stock ? "text-accent" : "text-muted"
                          }
                        >
                          {product.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                        {product.featured && (
                          <span className="text-xs text-muted">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(product)}
                          className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/40 hover:text-accent"
                        >
                          {copiedId === product.id ? "Copied!" : "Copy link"}
                        </button>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/40 hover:text-accent"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={isDeleting}
                          className="whitespace-nowrap rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
