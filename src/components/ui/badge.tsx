import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem] font-semibold leading-none transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-forest-900 text-cream-50',
        gold: 'border-gold-500/40 bg-gold-500/12 text-gold-700',
        'gold-solid': 'border-transparent bg-gold-500 text-forest-900',
        outline: 'border-forest-900/15 text-forest-800 bg-transparent',
        available: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700',
        filled: 'border-rose-500/30 bg-rose-500/12 text-rose-700',
        maintenance: 'border-amber-500/30 bg-amber-500/12 text-amber-700',
        glass: 'border-white/15 bg-white/8 text-cream-50 backdrop-blur',
        'glass-dark':
          'border-forest-900/25 bg-glass-dark text-cream-50 backdrop-blur-md shadow-soft',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-[0.65rem]',
        md: 'px-3 py-1 text-[0.72rem]',
        lg: 'px-4 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
