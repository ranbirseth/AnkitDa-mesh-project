'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/cn';
import { Image as UIImage } from '@/components/ui/image';
import { Button } from '@/components/ui/button';

interface GoogleMapEmbedProps {
  readonly embedUrl?: string;
  readonly mapLink: string;
  readonly title?: string;
  readonly className?: string;
}

export function GoogleMapEmbed({
  embedUrl,
  mapLink,
  title,
  className,
}: GoogleMapEmbedProps): React.ReactElement {
  const [iframeError, setIframeError] = React.useState(false);
  const showFallback = !embedUrl || iframeError;

  return (
    <div
      className={cn(
        'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100 shadow-soft border border-cream-200 relative',
        className,
      )}
    >
      {!showFallback ? (
        <iframe
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          title={title ?? 'Google Map'}
          allow="fullscreen"
          onError={() => setIframeError(true)}
        />
      ) : (
        <>
          <div className="absolute inset-0">
            <UIImage
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=900&q=70"
              alt="Durgapur city map"
              aspect="4/3"
              rounded="none"
              className="absolute inset-0 object-cover opacity-30"
            />
          </div>
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
            <LucideIcons.MapPin className="w-9 h-9 text-gold-600" aria-hidden />
            <p className="font-medium text-forest-900">Interactive map coming soon</p>
            <Button asChild variant="gold" size="sm">
              <a href={mapLink} target="_blank" rel="noopener noreferrer">
                View on Google Maps
              </a>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
