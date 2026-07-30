import * as React from 'react';
import { cn } from '@/lib/cn';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly ratio: number | `${number}/${number}`;
}

/**
 * CLS-safe aspect ratio box. Uses CSS aspect-ratio with a ResizeObserver-less
 * approach (native in all modern browsers since 2021). Also accepts explicit
 * number for backwards compat (e.g. 16 / 9).
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio, className, style, children, ...rest },
  ref,
) {
  const computed = typeof ratio === 'number' ? String(ratio) : ratio;
  return (
    <div
      ref={ref}
      className={cn('relative block w-full overflow-hidden', className)}
      style={{ aspectRatio: computed, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
});
