import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const cardVariants = cva(
  'relative overflow-hidden rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-cream-50 border border-forest-900/8 shadow-soft hover:shadow-elevate',
        elevated:
          'bg-white border border-forest-900/8 shadow-elevate hover:shadow-card-hover',
        glass:
          'bg-white/70 backdrop-blur-xl border border-white/60 shadow-soft',
        'glass-dark':
          'bg-forest-900/55 backdrop-blur-xl border border-white/12 shadow-soft',
        ghost: 'bg-transparent border border-forest-900/8',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
});

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 p-5 md:p-6', className)}
      {...props}
    />
  );
});

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn('font-display text-xl md:text-2xl text-forest-900 leading-tight', className)}
      {...props}
    />
  );
});

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn('text-sm leading-relaxed text-ink-600', className)}
      {...props}
    />
  );
});

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn('p-5 md:p-6 pt-0', className)} {...props} />
  );
});

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-5 md:p-6 pt-0', className)}
      {...props}
    />
  );
});
