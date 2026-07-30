'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Amenity } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

interface AmenityCardProps {
  readonly amenity: Amenity;
  readonly className?: string;
}

export function AmenityCard({ amenity, className }: AmenityCardProps): React.ReactElement {
  const reduced = usePrefersReducedMotion();
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[amenity.iconKey] ??
    LucideIcons.MapPin;

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-ink-200/40 bg-white/60 backdrop-blur-sm px-3 py-4 sm:px-4 sm:py-5 text-center shadow-soft transition-all duration-300 ease-out-expo',
        !reduced && 'hover:-translate-y-0.5 hover:border-gold-500/30 hover:shadow-card-hover hover:bg-cream-50',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-xl border border-forest-100 bg-forest-50 transition-all duration-300',
          !reduced && 'group-hover:border-transparent group-hover:bg-gold-500 group-hover:shadow-gold',
        )}
      >
        <IconComponent
          className={cn(
            'w-5 h-5 text-forest-700 transition-colors',
            !reduced && 'group-hover:text-forest-950',
          )}
        />
      </div>
      <h3 className="mt-0.5 font-semibold text-sm sm:text-[0.94rem] leading-tight text-forest-900">
        {amenity.name}
      </h3>
      {amenity.description && (
        <p className="mt-0.5 max-w-[9rem] mx-auto text-xs leading-snug text-ink-500">
          {amenity.description}
        </p>
      )}
    </div>
  );
}
