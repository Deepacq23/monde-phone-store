import { TRUST_BADGES } from "@/lib/constants";

export function TrustBadges() {
  return (
    <div className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-8xl grid-cols-2 gap-px overflow-hidden sm:grid-cols-4 sm:px-8">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center gap-1 border-border px-4 py-6 text-center sm:border-l sm:first:border-l-0"
          >
            <span className="font-heading text-sm font-bold text-accent sm:text-base">
              {badge.label}
            </span>
            <span className="text-xs text-muted">{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
