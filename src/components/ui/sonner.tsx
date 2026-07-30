'use client';

import * as React from 'react';
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from 'sonner';
import { cn } from '@/lib/cn';

export const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(function Toaster(
  { className, ...props },
  ref,
) {
  return (
    <Sonner
      ref={ref}
      position="top-right"
      theme="light"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'group group/toast pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-forest-900/8 bg-cream-50 p-4 pr-6 shadow-elevate',
          title: 'font-semibold text-forest-900 text-sm',
          description: 'text-xs text-ink-600 mt-0.5',
          success:
            '!bg-emerald-50/90 !border-emerald-500/30 [&_[data-icon]]:!text-emerald-600',
          error:
            '!bg-rose-50/90 !border-rose-500/30 [&_[data-icon]]:!text-rose-600',
          warning:
            '!bg-amber-50/90 !border-amber-500/30 [&_[data-icon]]:!text-amber-600',
          info:
            '!bg-forest-50/90 !border-forest-500/25 [&_[data-icon]]:!text-forest-700',
          closeButton:
            'left-auto right-2 top-2 hover:bg-forest-900/5 rounded-full border-forest-900/10 border',
        },
      }}
      className={cn('pointer-events-none select-none', className)}
      {...props}
    />
  );
});

export const toast = sonnerToast;
