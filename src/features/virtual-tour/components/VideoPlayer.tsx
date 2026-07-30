'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Image as UIImage } from '@/components/ui/image';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

interface VideoPlayerProps {
  readonly posterUrl: string;
  readonly posterAlt: string;
  readonly videoUrl?: string;
  readonly posterWidth?: number;
  readonly posterHeight?: number;
}

export function VideoPlayer({
  posterUrl,
  posterAlt,
  videoUrl,
}: VideoPlayerProps): React.ReactElement {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasEnded, setHasEnded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  const handlePlay = React.useCallback(() => {
    if (!videoUrl) return;
    setIsPlaying(true);
    setHasEnded(false);
    if (videoRef.current) {
      void videoRef.current.play();
    }
  }, [videoUrl]);

  const handleReplay = React.useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setHasEnded(false);
      setIsPlaying(true);
      void videoRef.current.play();
    }
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasEnded) {
          handleReplay();
        } else if (!isPlaying) {
          handlePlay();
        }
      }
    },
    [hasEnded, isPlaying, handlePlay, handleReplay],
  );

  const handleVideoEnded = React.useCallback(() => {
    setHasEnded(true);
  }, []);

  const hasVideo = Boolean(videoUrl);
  const showPoster = !isPlaying || hasEnded;

  const PlayButtonIcon = LucideIcons.Play;
  const ReplayIcon = LucideIcons.RotateCcw;

  const playerContent = (
    <button
      type="button"
      aria-label={
        !hasVideo
          ? 'Video coming soon'
          : hasEnded
            ? 'Replay virtual tour video'
            : isPlaying
              ? 'Virtual tour video playing'
              : 'Play virtual tour video'
      }
      onClick={hasEnded ? handleReplay : handlePlay}
      onKeyDown={handleKeyDown}
      disabled={!hasVideo}
      className={cn(
        'relative block aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-elevate bg-forest-900',
        !hasVideo && 'cursor-default',
      )}
    >
      {showPoster && (
        <UIImage
          src={posterUrl}
          alt={posterAlt}
          aspect="16/9"
          rounded="2xl"
          zoomOnHover={false}
          grayscaleFadeIn
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 36vw, 480px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {isPlaying && !hasEnded && (
        <video
          ref={videoRef}
          muted
          controls
          playsInline
          preload="metadata"
          poster={posterUrl}
          src={videoUrl}
          onEnded={handleVideoEnded}
          className="absolute inset-0 h-full w-full object-cover rounded-2xl"
          autoPlay
        />
      )}

      {(!isPlaying || hasEnded) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden
            className={cn(
              'rounded-full w-20 h-20 md:w-24 md:h-24 backdrop-blur-xl ring-1 ring-white/20 flex items-center justify-center transition-all duration-200 ease-out-expo',
              hasVideo && !reduced
                ? 'bg-gold-500/80 hover:bg-gold-400 shadow-gold hover:scale-105 cursor-pointer'
                : 'bg-forest-900/70 shadow-soft cursor-default',
            )}
          >
            {hasEnded ? (
              <ReplayIcon className="w-9 h-9 md:w-10 md:h-10 text-cream-50" aria-hidden />
            ) : (
              <PlayButtonIcon
                className="w-9 h-9 md:w-10 md:h-10 text-forest-950 pl-1 fill-forest-900"
                aria-hidden
              />
            )}
          </span>
        </div>
      )}

      {hasEnded && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-900/80 backdrop-blur-md px-4 py-2 text-xs text-cream-100 border border-white/10">
            <ReplayIcon className="h-3.5 w-3.5" aria-hidden />
            Video ended. Click to replay.
          </span>
        </div>
      )}
    </button>
  );

  if (!hasVideo) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{playerContent}</TooltipTrigger>
        <TooltipContent>
          <p>Video coming soon</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return playerContent;
}
