import * as React from 'react';
import { cn } from '@/lib/cn';

type MaxWidth = 'narrow' | 'default' | 'wide' | 'full';

const MAX_WIDTH_MAP: Record<MaxWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-[1440px]',
  wide: 'max-w-[1600px]',
  full: 'max-w-none',
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly as?: React.ElementType;
  readonly maxWidth?: MaxWidth;
  readonly paddingY?: 'none' | 'sm' | 'md' | 'lg';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(function Container(
  {
    as: Tag = 'div',
    maxWidth = 'default',
    paddingY,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        'mx-auto w-full',
        'px-4 sm:px-6 lg:px-8 2xl:px-16',
        MAX_WIDTH_MAP[maxWidth],
        paddingY === 'sm' && 'py-8',
        paddingY === 'md' && 'py-16',
        paddingY === 'lg' && 'py-24 lg:py-32',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});
