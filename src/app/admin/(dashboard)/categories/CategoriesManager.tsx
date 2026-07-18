"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { createCategory, deleteCategory, renameCategory } from "./actions";

type CategoryWithCount = Category & { productCount: number };

export function CategoriesManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
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

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="new-category" className="text-sm font-medium text-foreground">
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
      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {editingId === category.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(category.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40 sm:max-w-xs"
              />
            ) : (
              <div>
                <p className="font-medium text-foreground">{category.name}</p>
                <p className="text-xs text-muted">
                  /{category.slug} — {category.productCount} product
                  {category.productCount === 1 ? "" : "s"}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
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
        ))}
      </div>
      )}
    </div>
  );
}
