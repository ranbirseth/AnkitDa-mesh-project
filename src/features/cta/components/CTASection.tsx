'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ctaService, type ICTAService } from '@/services';
import type { CTAData } from '@/types';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

export function CTASection(): React.ReactElement {
  const [data, setData] = React.useState<CTAData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const reduced = usePrefersReducedMotion();
  const { scrollTo } = useSmoothScroll();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (ctaService as ICTAService).getCTA();
      if (mounted && result.success && result.data) {
        setData(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEnquireClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollTo('#contact', { offset: -90 });
    },
    [scrollTo],
  );

  const PhoneIcon = LucideIcons.Phone;
  const MessageCircleIcon = LucideIcons.MessageCircle;
  const AlertCircleIcon = LucideIcons.AlertCircle;

  return (
    <section
      id="cta"
      className="scroll-mt-28 w-full"
    >
      <Reveal variant="fadeUp" className="relative w-full">
        {loading ? (
          <CTASkeleton />
        ) : data ? (
          <div
            className={cn(
              'relative rounded-3xl overflow-hidden bg-cream-50',
              'flex flex-col md:flex-row items-center justify-between',
              'px-6 py-10 md:px-10 md:py-14',
            )}
          >
            <div className="flex flex-col items-start w-full md:max-w-xl mb-8 md:mb-0">
              <Reveal variant="fadeUp" delay={reduced ? 0 : 0.05}>
                <div className="mb-3">
                  <span className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-600">
                    <span aria-hidden className="inline-block w-8 h-px bg-gold-500" />
                    {data.eyebrow || 'GET STARTED'}
                  </span>
                </div>
              </Reveal>

              <Reveal variant="fadeUp" delay={reduced ? 0 : 0.1}>
                <h2 className="font-display text-h3 md:text-h2 text-forest-900 text-balance mb-2">
                  {data.heading || 'Ready to Book Your Room?'}
                </h2>
              </Reveal>

              {data.subheading && (
                <Reveal variant="fadeUp" delay={reduced ? 0 : 0.15}>
                  <p className="text-forest-700/70 max-w-xl mt-2">
                    {data.subheading}
                  </p>
                </Reveal>
              )}
            </div>

            <Reveal variant="fadeUp" delay={reduced ? 0 : 0.2}>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button
                  asChild
                  variant="gold"
                  size="lg"
                >
                  <a
                    href={data.primaryButton.href}
                    aria-label={data.primaryButton.text}
                  >
                    <PhoneIcon className="h-5 w-5" />
                    {data.primaryButton.text}
                  </a>
                </Button>

                <Button
                  asChild
                  variant="forest"
                  size="lg"
                >
                  <a
                    href={data.secondaryButton.href}
                    target={data.secondaryButton.external ? '_blank' : undefined}
                    rel={data.secondaryButton.external ? 'noopener noreferrer' : undefined}
                    aria-label={data.secondaryButton.text}
                  >
                    <MessageCircleIcon className="h-5 w-5" />
                    {data.secondaryButton.text}
                  </a>
                </Button>

                {data.tertiaryButton && (
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                  >
                    <Link
                      href={data.tertiaryButton.href}
                      onClick={handleEnquireClick}
                      aria-label={data.tertiaryButton.text}
                    >
                      {data.tertiaryButton.text}
                    </Link>
                  </Button>
                )}
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center rounded-3xl bg-cream-50">
            <AlertCircleIcon className="h-10 w-10 text-forest-700/40" />
            <p className="font-display text-xl text-forest-900">Unable to load CTA</p>
            <p className="text-sm text-forest-700/60 max-w-md">
              Please refresh the page or try again later.
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}

function CTASkeleton(): React.ReactElement {
  return (
    <div
      className={cn(
        'relative rounded-3xl overflow-hidden bg-cream-50',
        'flex flex-col md:flex-row items-center justify-between',
        'px-6 py-10 md:px-10 md:py-14',
      )}
    >
      <div className="flex flex-col items-start w-full md:max-w-xl mb-8 md:mb-0 gap-4">
        <Skeleton className="h-5 w-44 rounded-full bg-forest-900/8" />
        <Skeleton className="h-10 md:h-14 w-[460px] max-w-full rounded-2xl bg-forest-900/8" />
        <Skeleton className="h-16 w-full max-w-xl rounded-xl bg-forest-900/8" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Skeleton className="h-12 w-full sm:w-44 rounded-full bg-forest-900/8" />
        <Skeleton className="h-12 w-full sm:w-44 rounded-full bg-forest-900/8" />
        <Skeleton className="h-12 w-full sm:w-40 rounded-full bg-forest-900/8" />
      </div>
    </div>
  );
}
