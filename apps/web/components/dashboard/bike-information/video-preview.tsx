"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  title: string;
  videoUrl?: string;
  poster?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait";
}

export default function VideoPreview({
  title,
  videoUrl,
  poster,
  alt,
  className,
  aspectRatio = "video", // 4:3 default to match ImagePreview
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Define aspect ratio classes - same as ImagePreview
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-[4/3]",
    wide: "aspect-[16/9]",
    portrait: "aspect-[3/4]",
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  return (
    <div className={cn("group flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-medium text-foreground">
          {title}
        </h3>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Play
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 transition-colors group-hover:border-sky-300/60 dark:group-hover:border-sky-500/30">
        {videoUrl ? (
        <div
          className={cn(
            "relative block overflow-hidden",
            aspectRatioClasses[aspectRatio]
          )}
        >
          {!isPlaying && (
            <div
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/5 transition-colors hover:bg-black/10 dark:bg-black/20"
              onClick={handlePlayClick}
              role="button"
              tabIndex={0}
              aria-label={`Play ${alt}`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handlePlayClick();
                }
              }}
            >
              <div className="rounded-full bg-sky-600/95 p-3.5 text-white shadow-lg shadow-sky-600/25 transition-transform duration-300 hover:scale-110">
                <Play className="h-6 w-6 fill-current" aria-hidden="true" />
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={poster || "/placeholder.svg"}
            preload="metadata"
            controls={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            <p>
              Your browser does not support HTML video. Please{" "}
              <Link href={videoUrl} target="_blank" rel="noopener noreferrer">
                download the video
              </Link>{" "}
              to view it.
            </p>
          </video>
        </div>
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
