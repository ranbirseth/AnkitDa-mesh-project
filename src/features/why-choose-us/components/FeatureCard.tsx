'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import type { WhyChooseUsFeature } from '@/types';

interface FeatureCardProps {
  readonly feature: WhyChooseUsFeature;
}

export function FeatureCard({ feature }: FeatureCardProps): React.ReactElement {
  const reduced = usePrefersReducedMotion();

  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      feature.iconKey
    ] ?? LucideIcons.Star;

  return (
    <Card
      variant="ghost"
      className={cn(
        'h-full w-full rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-5 sm:p-6 group',
        'transition-all duration-300 ease-out-expo',
        !reduced && [
          'hover:-translate-y-1',
          'hover:shadow-card-hover',
          'hover:border-gold-500/30',
        ],
      )}
    >
      <div className="flex flex-col h-full">
        <span
          aria-hidden
          className={cn(
            'w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4',
            'transition-all duration-300 ease-out-expo',
            !reduced && [
              'group-hover:bg-gold-500',
              'group-hover:shadow-gold',
              'group-hover:scale-105',
            ],
          )}
        >
          <IconComponent
            className={cn(
              'w-6 h-6 text-gold-400 transition-colors duration-300',
              !reduced && 'group-hover:text-forest-950',
            )}
            aria-hidden
          />
        </span>

        <h4 className="font-display text-xl font-semibold text-cream-50 mb-2">
          {feature.title}
        </h4>

        <p className="text-cream-100/70 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </Card>
  );
}
