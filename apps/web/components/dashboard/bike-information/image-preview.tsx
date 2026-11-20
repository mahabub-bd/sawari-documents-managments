"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { getShimmerPlaceholder } from "@/components/ui/shimmer";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  title: string;
  imageUrl?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait";
  priority?: boolean;
}

export default function ImagePreview({
  title,
  imageUrl,
  alt,
  className,
  aspectRatio = "video", // 4:3 default
  priority = false,
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Generate shimmer effect placeholder
  const shimmerPlaceholder = getShimmerPlaceholder();

  // Define aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-[4/3]",
    wide: "aspect-[16/9]",
    portrait: "aspect-[3/4]",
  };

  return (
    <div className={cn("group flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-medium text-foreground">
          {title}
        </h3>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          View
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 transition-colors group-hover:border-emerald-300/60 dark:group-hover:border-emerald-500/30">
        {imageUrl ? (
        <Link
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "relative block overflow-hidden",
            aspectRatioClasses[aspectRatio]
          )}
        >
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center bg-background/40 opacity-0 backdrop-blur-sm transition-opacity duration-300",
              "group-hover:opacity-100"
            )}
          >
            <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm">
              View full image
            </span>
          </div>

          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-300",
              isLoading ? "scale-110 blur-sm" : "scale-100 blur-0",
              "group-hover:scale-105"
            )}
            placeholder="blur"
            blurDataURL={shimmerPlaceholder}
            priority={priority}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </Link>
        ) : (
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/60 bg-muted/20",
              aspectRatioClasses[aspectRatio]
            )}
          >
            <span className="text-xs text-muted-foreground">
              Not available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
