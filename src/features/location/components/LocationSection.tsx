'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { locationService, type ILocationService } from '@/services';
import type { LocationData } from '@/types';
import { GoogleMapEmbed } from '@/features/location/components/GoogleMapEmbed';
import { NearbyPlaces } from '@/features/location/components/NearbyPlaces';

export function LocationSection(): React.ReactElement {
  const [location, setLocation] = React.useState<LocationData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (locationService as ILocationService).getLocation();
      if (mounted && result.success && result.data) {
        setLocation(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const buildAddress = (loc: LocationData): string => {
    const parts: string[] = [];
    if (loc.addressLine1) parts.push(loc.addressLine1);
    if (loc.addressLine2) parts.push(loc.addressLine2);
    const cityLine = [loc.city, loc.state].filter(Boolean).join(', ');
    const postalPart = loc.postalCode ? ` ${loc.postalCode}` : '';
    if (cityLine) parts.push(cityLine + postalPart);
    return parts.join(', ');
  };

  return (
    <section
      id="location"
      className={cn(
        'scroll-mt-28 w-full rounded-3xl bg-cream-50/90 backdrop-blur-sm border border-cream-200 shadow-soft p-5 sm:p-6 md:p-7 lg:p-8 mx-auto max-w-full',
      )}
    >
      {loading ? (
        <LocationSkeleton />
      ) : !location ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <LucideIcons.MapPin className="h-10 w-10 text-ink-400" />
          <p className="font-display text-xl text-forest-800">Location details coming soon</p>
        </div>
      ) : (
        <Reveal variant="fadeUp" className="w-full">
          <div className="flex flex-col gap-0 w-full">
            <div className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-700">
              <span aria-hidden className="inline-block h-px w-8 bg-gold-500" />
              PRIME LOCATION
            </div>
            <h2 className="font-display text-h3 md:text-h2 text-forest-900 mt-1 mb-2">
              {location.heading ?? 'Located in the Heart of Durgapur'}
            </h2>
            <span aria-hidden className="block w-14 h-0.5 bg-gold-500 rounded-full" />

            <div className="flex items-start gap-2 mt-2 mb-7">
              <LucideIcons.MapPin
                className="w-5 h-5 text-gold-600 shrink-0 mt-0.5"
                aria-hidden
              />
              <p className="text-ink-700 text-sm md:text-base leading-relaxed">
                {buildAddress(location)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6 w-full">
            <div className="lg:col-span-3 flex flex-col">
              <GoogleMapEmbed
                embedUrl={location.googleMapsEmbedUrl}
                mapLink={location.mapLink}
                title={`${location.addressLine1} ${location.city} map`}
                className="w-full"
              />
              <div className="flex flex-wrap gap-2 sm:gap-3 items-center mt-4 sm:mt-5 md:mt-6">
                <Button asChild variant="gold" size="sm">
                  <a href={location.mapLink} target="_blank" rel="noopener noreferrer">
                    View on Google Maps
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <NearbyPlaces places={location.nearbyPlaces ?? []} />
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}

function LocationSkeleton(): React.ReactElement {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-0">
        <Skeleton className="h-3 w-32 rounded-full bg-cream-200/70" />
        <Skeleton className="h-8 w-72 sm:h-10 sm:w-96 rounded-full bg-cream-200/70 mt-2" />
        <Skeleton className="h-1 w-16 rounded-full bg-cream-200/70 mt-3" />
        <div className="flex items-start gap-2 mt-4">
          <Skeleton className="w-5 h-5 rounded-full bg-cream-200/70 shrink-0 mt-0.5" />
          <Skeleton shape="text" lines={2} className="flex-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6 w-full">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <Skeleton aspect={4 / 3} className="w-full rounded-2xl bg-cream-200/70" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-40 rounded-full bg-cream-200/70" />
            <Skeleton className="h-9 w-36 rounded-full bg-cream-100" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white/80 border border-cream-200 shadow-soft p-4 sm:p-5 h-full">
            <Skeleton className="h-6 w-32 rounded-full bg-cream-200/70 mb-4" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-3 border-t first:border-t-0 border-ink-100 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-lg bg-cream-200/70 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-40 rounded-full bg-cream-200/70" />
                      <Skeleton className="h-3 w-20 rounded-full bg-cream-100" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-5 w-14 rounded-full bg-cream-100" />
                    <Skeleton className="h-3 w-16 rounded-full bg-cream-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
