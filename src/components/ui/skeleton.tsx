import * as React from 'react';
import { cn } from '@/lib/cn';

type SkeletonShape = 'rect' | 'text' | 'circle';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly shape?: SkeletonShape;
  readonly lines?: number;
  readonly aspect?: number;
}

/**
 * Animated shimmer skeleton. Uses linear gradient (GPU) instead of layout props.
 */
export function Skeleton({
  shape = 'rect',
  lines,
  aspect,
  className,
  style,
  ...rest
}: SkeletonProps): React.ReactElement {
  if (shape === 'text' && lines && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)} {...rest}>
        {Array.from({ length: lines }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'animate-shimmer-bg h-3 rounded-full',
              idx === lines - 1 ? 'w-2/3' : 'w-full',
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'animate-shimmer-bg bg-cream-200/70',
        shape === 'rect' && 'rounded-xl',
        shape === 'circle' && 'rounded-full aspect-square w-full max-w-full',
        shape === 'text' && 'h-3 rounded-full w-full',
        className,
      )}
      style={{ aspectRatio: aspect ? String(aspect) : undefined, ...style }}
      {...rest}
    />
  );
}
