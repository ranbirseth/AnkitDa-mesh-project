import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-white/0 transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        gold:
          'bg-gold-500 text-forest-900 shadow-gold hover:bg-gold-400 hover:shadow-[0_18px_60px_-16px_rgba(198,156,46,0.55)]',
        forest:
          'bg-forest-700 text-cream-50 shadow-soft hover:bg-forest-600 hover:shadow-elevate',
        outline:
          'border border-forest-900/15 bg-transparent text-forest-800 hover:border-forest-700/40 hover:bg-forest-900/5',
        'outline-light':
          'border border-white/20 text-cream-50 hover:border-white/40 hover:bg-white/5',
        ghost:
          'text-forest-800 hover:bg-forest-900/5',
        glass:
          'bg-white/8 backdrop-blur-md border border-white/15 text-cream-50 hover:bg-white/14 hover:border-white/25',
        'glass-gold':
          'bg-gold-500/90 text-forest-900 backdrop-blur-md border border-gold-400/50 hover:bg-gold-400',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-[0.95rem]',
        xl: 'h-14 px-8 text-base',
        icon: 'h-11 w-11 p-0',
        'icon-sm': 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'gold',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
  readonly loading?: boolean;
  readonly loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    asChild = false,
    loading,
    loadingText,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading ? true : undefined}
      {...props}
    >
      {loading ? (
        <>
          <svg
            aria-hidden
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
});
