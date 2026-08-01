import * as React from 'react';
import { Container } from '@/components/Container';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/cn';

type SectionAlign = 'left' | 'center';
type PaddingPreset = 'sm' | 'md' | 'lg' | 'none' | 'hero';

const PADDING_MAP: Record<PaddingPreset, string> = {
  none: '',
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24 lg:py-28',
  lg: 'py-24 md:py-32 lg:py-40',
  hero: 'pt-0 pb-16 md:pb-24',
};

export interface SectionWrapperProps {
  readonly id: string;
  readonly eyebrow?: string;
  readonly heading?: React.ReactNode;
  readonly subheading?: React.ReactNode;
  readonly align?: SectionAlign;
  readonly padding?: PaddingPreset;
  readonly accentColor?: 'gold' | 'forest' | 'none';
  readonly maxWidth?: 'default' | 'wide' | 'full' | 'narrow';
  readonly headerClassName?: string;
  readonly headerActions?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly disableReveal?: boolean;
}

export function SectionWrapper({
  id,
  eyebrow,
  heading,
  subheading,
  align = 'left',
  padding = 'md',
  accentColor = 'gold',
  maxWidth = 'default',
  headerClassName,
  headerActions,
  children,
  className,
  disableReveal,
}: SectionWrapperProps): React.ReactElement {
  const showHeader = Boolean(eyebrow || heading || subheading || headerActions);
  const HeadingTag: 'h2' | null = heading ? 'h2' : null;

  return (
    <section
      id={id}
      aria-labelledby={showHeader ? `${id}-heading` : undefined}
      className={cn(
        'relative scroll-mt-28 w-full',
        PADDING_MAP[padding],
        className,
      )}
    >
      <Container maxWidth={maxWidth}>
        {showHeader && (
          <Reveal
            variant="fadeUp"
            className={cn(
              'mb-10 md:mb-14 lg:mb-20 flex flex-col gap-3',
              align === 'center' && 'items-center text-center',
              headerClassName,
            )}
            disabled={disableReveal}
          >
            {eyebrow && (
              <div
                className={cn(
                  'inline-flex items-center gap-2 text-eyebrow uppercase',
                  accentColor === 'gold' && 'text-gold-600',
                  accentColor === 'forest' && 'text-forest-600',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'inline-block h-px w-8',
                    accentColor === 'gold' && 'bg-gold-500',
                    accentColor === 'forest' && 'bg-forest-500',
                  )}
                />
                {eyebrow}
              </div>
            )}
            {heading && HeadingTag && (
              <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 w-full">
                {(() => {
                  const Tag: 'h2' = HeadingTag;
                  return (
                    <Tag
                      id={`${id}-heading`}
                      className={cn(
                        'font-display text-h2 text-forest-900 text-balance',
                        align === 'center' && 'mx-auto',
                      )}
                    >
                      {heading}
                    </Tag>
                  );
                })()}
                {headerActions ? (
                  <div className="hidden md:flex items-center gap-2">{headerActions}</div>
                ) : null}
              </div>
            )}
            {subheading && (
              <p
                className={cn(
                  'max-w-2xl text-lead text-ink-600 text-pretty',
                  align === 'center' && 'mx-auto',
                )}
              >
                {subheading}
              </p>
            )}
            {headerActions && (
              <div className="flex md:hidden items-center gap-2 justify-start">{headerActions}</div>
            )}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
