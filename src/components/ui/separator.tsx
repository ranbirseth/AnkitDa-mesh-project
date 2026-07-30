import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/cn';

type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  readonly orientation?: SeparatorOrientation;
  readonly decorative?: boolean;
}

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator(
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
        'shrink-0 bg-forest-900/10',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
        {...props}
      />
    );
  },
);
