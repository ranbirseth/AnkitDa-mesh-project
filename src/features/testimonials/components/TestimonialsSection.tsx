'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { testimonialsService, type ITestimonialsService } from '@/services';
import type { Testimonial, TestimonialsData } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { TestimonialCarousel } from './TestimonialCarousel';

export function TestimonialsSection(): React.ReactElement {
  const [data, setData] = React.useState<TestimonialsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (testimonialsService as ITestimonialsService).getTestimonials();
      if (mounted && result.success && result.data) {
        setData(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const activeItems: ReadonlyArray<Testimonial> = React.useMemo(() => {
    if (!data?.items) return [];
    return [...data.items]
      .filter((t) => t.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [data]);

  const SparklesIcon = LucideIcons.Sparkles;

  return (
    <section
      id="testimonials"
      className="scroll-mt-28 w-full"
    >
      <Card
        variant="glass"
        className={cn(
          'relative rounded-3xl overflow-hidden bg-cream-50 border border-forest-900/6 shadow-soft',
          'p-6 sm:p-8 lg:p-10 mx-auto max-w-full',
        )}
      >
        <Reveal variant="fadeUp" className="relative w-full">
          {loading ? (
            <TestimonialsSkeleton />
          ) : data ? (
            <div className="flex flex-col items-start w-full">
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-600">
                  <span aria-hidden className="inline-block w-8 h-px bg-gold-500" />
                  {data.eyebrow || 'TESTIMONIALS'}
                </span>
              </div>

              <h2 className="font-display text-h3 md:text-h2 text-forest-900 text-balance mb-2">
                {data.heading || 'What Our Residents Say'}
              </h2>

              <span
                aria-hidden
                className="block w-14 h-0.5 bg-gold-500 rounded-full"
              />

              {data.subheading && (
                <p className="text-forest-800/70 max-w-2xl mt-3 mb-8">
                  {data.subheading}
                </p>
              )}

              {activeItems.length > 0 ? (
                <div className="w-full">
                  <Reveal
                    variant="fadeUp"
                    delay={reduced ? 0 : 0.08}
                    className="w-full"
                  >
                    <TestimonialCarousel items={activeItems} />
                  </Reveal>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-16 text-center w-full">
                  <SparklesIcon className="h-10 w-10 text-forest-900/40" />
                  <p className="font-display text-xl text-forest-800">No reviews yet</p>
                  <p className="text-sm text-forest-700/60 max-w-md">
                    Be the first to share your experience at Ankit Da Mess.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <LucideIcons.AlertCircle className="h-10 w-10 text-forest-900/40" />
              <p className="font-display text-xl text-forest-800">Unable to load reviews</p>
              <p className="text-sm text-forest-700/60 max-w-md">
                Please refresh the page or try again later.
              </p>
            </div>
          )}
        </Reveal>
      </Card>
    </section>
  );
}

function TestimonialsSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col items-start w-full gap-4">
      <Skeleton className="h-5 w-44 rounded-full bg-forest-900/8" />
      <Skeleton className="h-10 md:h-14 w-[460px] max-w-full rounded-2xl bg-forest-900/8" />
      <Skeleton className="h-1 w-14 rounded-full bg-gold-500/50" />
      <Skeleton className="h-16 w-full max-w-2xl rounded-xl bg-forest-900/6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-full w-full rounded-3xl border border-forest-900/6 bg-white/70 backdrop-blur-xl p-6 sm:p-7 flex flex-col gap-5 shadow-soft"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Skeleton
                    key={s}
                    className="h-4 w-4 rounded-full bg-forest-900/10"
                  />
                ))}
              </div>
              <Skeleton shape="text" lines={3} />
            </div>
            <div className="flex items-center gap-3 mt-auto pt-1">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-forest-900/10" />
              <div className="flex flex-col min-w-0 flex-1 gap-2">
                <Skeleton className="h-4 w-28 rounded-full bg-forest-900/10" />
                <Skeleton className="h-3 w-36 rounded-full bg-forest-900/8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
