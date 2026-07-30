'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Image as UIImage } from '@/components/ui/image';
import { cn } from '@/lib/cn';

interface VirtualTourPlaceholderProps {
  readonly posterUrl?: string;
  readonly posterAlt?: string;
  readonly className?: string;
}

export function VirtualTourPlaceholder({
  posterUrl,
  posterAlt = 'Virtual tour preview',
  className,
}: VirtualTourPlaceholderProps): React.ReactElement {
  const AlertIcon = LucideIcons.AlertTriangle;

  return (
    <div
      className={cn(
        'relative block aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-elevate bg-forest-900',
        className,
      )}
    >
      {posterUrl ? (
        <UIImage
          src={posterUrl}
          alt={posterAlt}
          aspect="16/9"
          rounded="2xl"
          zoomOnHover={false}
          grayscaleFadeIn
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 36vw, 480px"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-900" />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-forest-950/60 backdrop-blur-sm">
        <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-forest-900/80 border border-white/10 shadow-soft">
          <AlertIcon className="h-7 w-7 text-gold-400" aria-hidden />
        </span>
        <p className="text-sm font-medium text-cream-100 text-center px-4">
          Video temporarily unavailable
        </p>
        <p className="text-xs text-cream-200/60 text-center px-6 max-w-xs">
          Please check back later or contact us for a personal walkthrough.
        </p>
      </div>
    </div>
  );
}
