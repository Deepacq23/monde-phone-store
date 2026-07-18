"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-surface text-muted">
        No Image
      </div>
    );
  }

  const activeImage = gallery[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-[#0F0F10]">
        <Image
          key={activeImage}
          src={activeImage}
          alt={name}
          fill
          priority
          unoptimized={activeImage.endsWith(".svg")}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover animate-fade-in"
        />
      </div>

      {gallery.length > 1 && (
        <div className="scrollbar-thin flex gap-3 overflow-x-auto">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                active === i
                  ? "border-accent"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized={src.endsWith(".svg")}
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
