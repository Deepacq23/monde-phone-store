"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category } from "@/lib/types";
import {
  uploadCategoryImage,
  deleteProductImageByUrl,
} from "@/lib/admin/storage";
import {
  createCategory,
  deleteCategory,
  renameCategory,
  setCategoryImage,
} from "./actions";

type CategoryWithCount = Category & { productCount: number };

export function CategoriesManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [pendingImageFor, setPendingImageFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await createCategory(newName);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setNewName("");
      router.refresh();
    });
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
    setError(null);
  }

  function handleRename(id: string) {
    if (!editingName.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await renameCategory(id, editingName);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(category: CategoryWithCount) {
    if (category.productCount > 0) {
      setError(
        `Can't delete "${category.name}" — it still has ${category.productCount} product${category.productCount === 1 ? "" : "s"}.`
      );
      return;
    }
    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function pickImageFor(categoryId: string) {
    setPendingImageFor(categoryId);
    fileInputRef.current?.click();
  }

  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const categoryId = pendingImageFor;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPendingImageFor(null);
    if (!file || !categoryId) return;

    setError(null);
    setUploadingId(categoryId);

    const previous = categories.find((c) => c.id === categoryId)?.image_url;

    try {
      const url = await uploadCategoryImage(file);
      const result = await setCategoryImage(categoryId, url);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (previous) {
        deleteProductImageByUrl(previous).catch(() => {});
      }
      router.refresh();
    } catch (err) {
      console.error("Category image upload failed:", err);
      setError("Failed to upload image. Try a smaller photo (max ~5MB).");
    } finally {
      setUploadingId(null);
    }
  }

  function handleRemoveImage(category: CategoryWithCount) {
    if (!category.image_url) return;
    setError(null);
    const previous = category.image_url;
    startTransition(async () => {
      const result = await setCategoryImage(category.id, null);
      if (result?.error) {
        setError(result.error);
        return;
      }
      deleteProductImageByUrl(previous).catch(() => {});
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden shared file input for per-category image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <label
            htmlFor="new-category"
            className="text-sm font-medium text-foreground"
          >
            New Category
          </label>
          <input
            id="new-category"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Smart Watches"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !newName.trim()}
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Category
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted">
          No categories yet. Add one above to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              {/* Cover image / placeholder */}
              <div className="relative h-32 w-full bg-gradient-to-br from-accent/15 via-surface to-background">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-widest text-muted">
                    No cover image
                  </div>
                )}
                {uploadingId === category.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-medium text-accent backdrop-blur-sm">
                    Uploading…
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4">
                {editingId === category.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(category.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                ) : (
                  <div>
                    <p className="font-medium text-foreground">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted">
                      /{category.slug} — {category.productCount} product
                      {category.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {editingId === category.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRename(category.id)}
                        disabled={isPending}
                        className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-background transition hover:bg-accent-hover disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/40 hover:text-accent"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => pickImageFor(category.id)}
                        disabled={uploadingId !== null}
                        className="rounded-full bg-accent/15 px-3.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/25 disabled:opacity-60"
                      >
                        {category.image_url ? "Change Image" : "Set Image"}
                      </button>
                      {category.image_url && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(category)}
                          disabled={isPending}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-foreground disabled:opacity-60"
                        >
                          Remove Image
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/40 hover:text-accent"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        disabled={isPending}
                        title={
                          category.productCount > 0
                            ? "Move or delete its products first"
                            : undefined
                        }
                        className="rounded-full border border-red-500/30 px-3.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
