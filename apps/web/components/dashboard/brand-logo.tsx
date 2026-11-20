"use client";

import { useState } from "react";

import { brands } from "@/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  brand: string;
  className?: string;
  alt?: string;
}

/**
 * Resolves a bike brand name to its logo, falling back to a
 * letter avatar when the brand has no logo or the image fails to load.
 */
export default function BrandLogo({
  brand,
  className,
  alt,
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  const normalized = brand.trim().toLowerCase();
  const match = brands.find(
    (item) => item.name.toLowerCase() === normalized || item.id === normalized
  );

  if (!match?.logo || failed) {
    return (
      <span
        className={cn(
          "flex items-center justify-center text-xs font-bold uppercase",
          className
        )}
        aria-hidden="true"
      >
        {brand.trim().charAt(0) || "?"}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny external favicon, no config needed
    <img
      src={match.logo}
      alt={alt ?? `${match.name} logo`}
      className={cn("object-contain", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
