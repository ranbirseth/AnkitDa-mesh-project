'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import NextImage from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  readonly testimonial: Testimonial;
}

function getInitials(name: string): string {
  const matches = name.match(/\b(\w)/g);
  if (!matches) return name.charAt(0).toUpperCase();
  return matches.slice(0, 2).join('').toUpperCase();
}

export function TestimonialCard({ testimonial }: TestimonialCardProps): React.ReactElement {
  const reduced = usePrefersReducedMotion();
  const StarIcon = LucideIcons.Star;

  const stars: ReadonlyArray<number> = React.useMemo(() => [0, 1, 2, 3, 4], []);
  const initials: string = testimonial.reviewerInitials || getInitials(testimonial.reviewerName);

  return (
    <Card
      variant="glass"
      className={cn(
        'h-full w-full rounded-3xl p-6 sm:p-7 flex flex-col gap-5',
      )}
      style={{
        transitionDuration: reduced ? '0ms' : undefined,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
          {stars.map((idx) => (
            <StarIcon
              key={idx}
              className={cn(
                'h-4 w-4',
                idx < testimonial.rating ? 'text-gold-500 fill-gold-500' : 'text-forest-900/15',
              )}
              aria-hidden={idx < testimonial.rating ? undefined : true}
            />
          ))}
        </div>

        <p className="italic text-forest-800/85 text-pretty leading-relaxed">
          {testimonial.content}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-1">
        {testimonial.avatarUrl ? (
          <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden bg-cream-200/50">
            <NextImage
              src={testimonial.avatarUrl}
              alt={`${testimonial.reviewerName} avatar`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="w-10 h-10 shrink-0 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center font-bold text-sm"
          >
            {initials}
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-forest-900 truncate">
              {testimonial.reviewerName}
            </span>
            {testimonial.source === 'direct' && (
              <Badge variant="outline" size="sm">
                Direct
              </Badge>
            )}
          </div>
          <span className="text-sm text-forest-700/65 truncate">
            {testimonial.reviewerRole}
          </span>
        </div>
      </div>
    </Card>
  );
}
