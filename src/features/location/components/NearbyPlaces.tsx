'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/ui/badge';
import type { NearbyPlace } from '@/types';

interface NearbyPlacesProps {
  readonly places: ReadonlyArray<NearbyPlace>;
}

export function NearbyPlaces({ places }: NearbyPlacesProps): React.ReactElement {
  const sortedPlaces = React.useMemo(
    () => [...places].sort((a, b) => a.distanceKm - b.distanceKm),
    [places],
  );

  return (
    <div className="rounded-2xl bg-white/80 border border-cream-200 shadow-soft p-4 sm:p-5 backdrop-blur-sm h-full">
      <h3 className="font-display text-xl text-forest-900 mb-4 pl-1 flex items-center gap-2">
        <LucideIcons.Compass className="w-5 h-5 text-gold-600" aria-hidden />
        Nearby Places
      </h3>

      <Reveal variant="fadeUp" staggerChildren={0.05} delay={0.1} className="w-full">
        <ul role="list" className="divide-y divide-ink-100">
          {sortedPlaces.map((place) => (
            <Reveal key={place.id} variant="fadeUp">
              <li className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center text-forest-700 shrink-0">
                    {(() => {
                      const IconComponent =
                        (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[place.iconKey] ??
                        LucideIcons.MapPin;
                      return <IconComponent className="w-4 h-4" aria-hidden />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-forest-900 text-sm truncate">{place.name}</p>
                    <p className="text-xs text-ink-500 capitalize">{place.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <Badge variant="outline" size="sm" className="text-gold-700 px-2 py-0.5 rounded-full">
                    {place.distanceKm} km
                  </Badge>
                  <p className="text-xs text-ink-500">{place.walkingMinutes} min walk</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
