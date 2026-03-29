"use client";

import { useRef, useState, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  title?: string;
  productSlug: string;
  featureSlug: string;
  version: string;
  onReportVideo?: (videoReference: string) => void;
}

export default function VideoPlayer({
  src,
  title,
  onReportVideo,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReport = useCallback(() => {
    if (onReportVideo) {
      onReportVideo(src);
    }
  }, [onReportVideo, src]);

  return (
    <div
      className="relative my-6 overflow-hidden rounded-lg border border-[#E8E6E1] bg-[#1A1A1A]"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {title && (
        <div className="border-b border-[#333] bg-[#222] px-4 py-2">
          <span className="text-xs text-[#999]">{title}</span>
        </div>
      )}
      <div className="relative cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          className="w-full"
          playsInline
          preload="metadata"
          onEnded={handleEnded}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="ml-1"
              >
                <path d="M5 3l12 7-12 7V3z" fill="#1A1A1A" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {showControls && onReportVideo && (
        <button
          onClick={handleReport}
          className="absolute right-2 top-2 rounded bg-[#1A1A1A]/60 p-1.5 text-white/70 transition-colors hover:bg-[#1A1A1A]/80 hover:text-white"
          title="Report this video"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 1v12M2 1h8l-2 3 2 3H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
