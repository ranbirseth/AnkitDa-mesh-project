'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { virtualTourService, type IVirtualTourService } from '@/services';
import type { VirtualTourData } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { VideoPlayer } from './VideoPlayer';

export function VirtualTourSection(): React.ReactElement {
  const [data, setData] = React.useState<VirtualTourData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (virtualTourService as IVirtualTourService).getVirtualTour();
      if (mounted && result.success && result.data) {
        setData(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const InfoIcon = LucideIcons.Info;
  const ExternalIcon = LucideIcons.ExternalLink;

  return (
    <section
      id="virtual-tour"
      className="scroll-mt-28 w-full"
    >
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden bg-forest-900 border border-gold-500/10 shadow-elevate',
          'p-6 sm:p-7 lg:p-8 mx-auto max-w-full',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(198,156,46,0.15), transparent 60%)',
          }}
        />

        <Reveal variant="fadeUp" className="relative w-full">
          {loading ? (
            <VirtualTourSkeleton />
          ) : data ? (
            <div className="flex flex-col items-start w-full">
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-400">
                  <span aria-hidden className="inline-block w-8 h-px bg-gold-500" />
                  VIRTUAL EXPERIENCE
                </span>
              </div>

              <h2 className="font-display text-h3 md:text-h2 text-cream-50 text-balance mb-2">
                {data.title || 'Take a Virtual Tour'}
              </h2>

              <span
                aria-hidden
                className="block w-12 h-0.5 bg-gold-500 rounded-full mb-4"
              />

              <p className="max-w-xl text-cream-200/80 text-sm md:text-base mb-6">
                {data.description}
              </p>

              <div className="w-full">
                <VideoPlayer
                  posterUrl={data.posterUrl}
                  posterAlt={data.posterAlt}
                  videoUrl={data.videoUrl}
                  posterWidth={data.posterWidth}
                  posterHeight={data.posterHeight}
                />
              </div>

              {data.supportingText && (
                <p className="mt-4 text-cream-200/70 text-center text-sm italic flex items-center justify-center gap-2 w-full">
                  <InfoIcon className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  {data.supportingText}
                </p>
              )}

              {data.ctaHref && (
                <div className="mt-6 w-full flex justify-center">
                  <span className="relative group/ctawrap inline-flex">
                    <span
                      aria-hidden
                      className={cn(
                        'absolute -inset-[2px] rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 opacity-60 blur-[6px]',
                        !reduced && 'animate-pulse',
                      )}
                    />
                    <Button
                      asChild
                      variant="gold"
                      size="md"
                      className="relative"
                    >
                      <a
                        href={data.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative overflow-hidden"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover/ctawrap:opacity-100 transition-opacity duration-500',
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              'absolute -top-full -left-1/3 h-full w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent',
                              !reduced &&
                                'group-hover/ctawrap:animate-[ctaShimmer_1.2s_ease-out_forwards]',
                            )}
                          />
                        </span>
                        <span className="relative inline-flex items-center gap-2">
                          {data.ctaText || 'Watch Full Video'}
                          <ExternalIcon className="h-4 w-4" aria-hidden />
                        </span>
                      </a>
                    </Button>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <LucideIcons.Video className="h-10 w-10 text-cream-200/50" />
              <p className="font-display text-xl text-cream-100">Virtual tour coming soon</p>
              <p className="text-sm text-cream-200/60 max-w-md">
                We&rsquo;re putting the finishing touches on our immersive virtual walkthrough.
              </p>
            </div>
          )}
        </Reveal>

        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              '@keyframes ctaShimmer { 0% { transform: translateX(0) rotate(-12deg) translateY(0); } 100% { transform: translateX(700%) rotate(-12deg) translateY(0); } }',
          }}
        />
      </div>
    </section>
  );
}

function VirtualTourSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col items-start w-full gap-4">
      <Skeleton className="h-5 w-48 rounded-full bg-cream-100/10" />
      <Skeleton className="h-10 md:h-14 w-80 md:w-[420px] rounded-2xl bg-cream-100/10" />
      <Skeleton className="h-1 w-12 rounded-full bg-gold-500/50" />
      <Skeleton className="h-16 w-full max-w-xl rounded-xl bg-cream-100/10" />
      <div className="w-full">
        <div className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-forest-950/70">
          <Skeleton aspect={16 / 9} className="w-full h-full bg-cream-100/8" />
        </div>
      </div>
      <div className="mx-auto">
        <Skeleton className="h-11 w-52 rounded-full bg-gold-500/20" />
      </div>
    </div>
  );
}
