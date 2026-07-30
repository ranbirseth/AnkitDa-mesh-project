'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { amenitiesService, type IAmenitiesService } from '@/services';
import type { Amenity } from '@/types';
import { AmenityCard } from '@/features/amenities/components/AmenityCard';

export function AmenitiesSection(): React.ReactElement {
  const [amenities, setAmenities] = React.useState<ReadonlyArray<Amenity>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (amenitiesService as IAmenitiesService).getAmenities(true, 50);
      if (mounted && result.success && result.data) {
        const sorted = [...result.data]
          .filter((a) => a.active)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setAmenities(sorted);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const displayAmenities = amenities.slice(0, 8);

  return (
    <section
      id="amenities"
      className={cn(
        'scroll-mt-28 w-full rounded-3xl bg-cream-50/90 backdrop-blur-sm border border-cream-200 shadow-soft p-5 sm:p-6 md:p-7',
      )}
    >
      <div className="flex flex-col gap-0">
        <div className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-700">
          <span aria-hidden className="inline-block h-px w-8 bg-gold-500" />
          ALL FACILITIES
        </div>
        <h2 className="font-display text-h3 md:!text-[1.75rem] text-forest-900 mb-2 mt-1">
          Everything You Need
        </h2>
        <span aria-hidden className="block w-12 h-0.5 bg-gold-500 rounded-full mb-5" />
      </div>

      {loading ? (
        <AmenitiesSkeletonGrid />
      ) : displayAmenities.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <LucideIcons.Sparkles className="h-10 w-10 text-ink-400" />
          <p className="font-display text-xl text-forest-800">Amenities coming soon</p>
        </div>
      ) : (
        <Reveal
          variant="fadeUp"
          staggerChildren={0.05}
          delay={0.1}
          className="w-full"
        >
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {displayAmenities.map((amenity) => (
              <Reveal key={amenity.id} variant="fadeUp">
                <AmenityCard amenity={amenity} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}

function AmenitiesSkeletonGrid(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-ink-200/40 bg-white/60 backdrop-blur-sm px-3 py-4 sm:px-4 sm:py-5 shadow-soft"
        >
          <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cream-200/70" />
          <Skeleton className="h-4 w-24 rounded-full bg-cream-200/70" />
          <Skeleton className="h-3 w-32 rounded-full bg-cream-100" />
        </div>
      ))}
    </div>
  );
}
