import type { ProductCondition } from "@/lib/types";

export function ConditionBadge({ condition }: { condition: ProductCondition }) {
  const isNew = condition === "new";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
        isNew
          ? "bg-accent/15 text-accent border border-accent/30"
          : "bg-surface-light text-muted border border-border"
      }`}
    >
      {isNew ? "New" : "Used"}
    </span>
  );
}
