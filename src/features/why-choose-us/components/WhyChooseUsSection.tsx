'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { whyChooseUsService, type IWhyChooseUsService } from '@/services';
import type { WhyChooseUsData, WhyChooseUsFeature } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { FeatureCard } from './FeatureCard';

export function WhyChooseUsSection(): React.ReactElement {
  const [data, setData] = React.useState<WhyChooseUsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (whyChooseUsService as IWhyChooseUsService).getWhyChooseUs();
      if (mounted && result.success && result.data) {
        setData(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const activeFeatures: ReadonlyArray<WhyChooseUsFeature> = React.useMemo(() => {
    if (!data?.features) return [];
    return [...data.features]
      .filter((f) => f.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data]);

  const SparklesIcon = LucideIcons.Sparkles;

  return (
    <section
      id="why-choose-us"
      className="scroll-mt-28 w-full"
    >
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden bg-forest-900 border border-gold-500/8 shadow-elevate',
          'p-6 sm:p-8 lg:p-10 mx-auto max-w-full',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 40% at 100% 0%, rgba(198,156,46,0.12), transparent 60%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(79,138,88,0.12), transparent 60%)',
          }}
        />

        <Reveal variant="fadeUp" className="relative w-full">
          {loading ? (
            <WhyChooseUsSkeleton />
          ) : data ? (
            <div className="flex flex-col items-start w-full">
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-400">
                  <span aria-hidden className="inline-block w-8 h-px bg-gold-500" />
                  WHY CHOOSE US
                </span>
              </div>

              <h2 className="font-display text-h3 md:text-h2 text-cream-50 text-balance mb-2">
                {data.heading || 'Why Choose Ankit Da Mess?'}
              </h2>

              <span
                aria-hidden
                className="block w-14 h-0.5 bg-gold-500 rounded-full"
              />

              {data.subheading && (
                <p className="text-cream-200/70 max-w-2xl mt-3 mb-8">
                  {data.subheading}
                </p>
              )}

              {activeFeatures.length > 0 ? (
                <div
                  className={cn(
                    'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
                    'gap-4 xl:gap-5 w-full',
                  )}
                >
                  {activeFeatures.map((feature, idx) => (
                    <Reveal
                      key={feature.id}
                      variant="fadeUp"
                      delay={reduced ? 0 : 0.08 * idx}
                      className="h-full w-full"
                    >
                      <FeatureCard feature={feature} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-16 text-center w-full">
                  <SparklesIcon className="h-10 w-10 text-cream-200/50" />
                  <p className="font-display text-xl text-cream-100">Features coming soon</p>
                  <p className="text-sm text-cream-200/60 max-w-md">
                    We&rsquo;re hard at work curating the best reasons to choose Ankit Da Mess.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <LucideIcons.AlertCircle className="h-10 w-10 text-cream-200/50" />
              <p className="font-display text-xl text-cream-100">Unable to load features</p>
              <p className="text-sm text-cream-200/60 max-w-md">
                Please refresh the page or try again later.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function WhyChooseUsSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col items-start w-full gap-4">
      <Skeleton className="h-5 w-44 rounded-full bg-cream-100/10" />
      <Skeleton className="h-10 md:h-14 w-[460px] max-w-full rounded-2xl bg-cream-100/10" />
      <Skeleton className="h-1 w-14 rounded-full bg-gold-500/50" />
      <Skeleton className="h-16 w-full max-w-2xl rounded-xl bg-cream-100/10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-full w-full rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-5 sm:p-6"
          >
            <Skeleton className="h-12 w-12 rounded-xl bg-cream-100/8 mb-4" />
            <Skeleton className="h-6 w-40 rounded-lg bg-cream-100/10 mb-3" />
            <Skeleton shape="text" lines={3} />
          </div>
        ))}
      </div>
    </div>
  );
}
