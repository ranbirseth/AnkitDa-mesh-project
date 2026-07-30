'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/cn';

/**
 * Drawer primitive — slide-in from side. Reused for mobile nav and drawers.
 */
const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-[90] bg-forest-950/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
});

type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

const ENTRY_CLASS: Record<DrawerSide, string> = {
  left: 'data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full left-0 top-0 h-full w-[82vw] max-w-sm',
  right:
    'data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full right-0 top-0 h-full w-[86vw] max-w-sm',
  top: 'data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-top-full top-0 left-0 w-full max-h-[80vh]',
  bottom:
    'data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full bottom-0 left-0 w-full max-h-[85vh]',
};

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  readonly side?: DrawerSide;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent({ className, side = 'right', children, ...props }, ref) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-[91] flex flex-col border border-forest-900/8 bg-cream-50 shadow-card-hover',
          side === 'bottom' ? 'rounded-t-3xl' : side === 'top' ? 'rounded-b-3xl' : 'rounded-l-2xl',
          'duration-300 ease-out-expo data-[state=open]:animate-in data-[state=closed]:animate-out',
          ENTRY_CLASS[side],
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
});

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div
    className={cn('flex items-center justify-between border-b border-forest-900/6 p-5', className)}
    {...props}
  />
);

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div className={cn('flex-1 overflow-y-auto p-5 scrollbar-none', className)} {...props} />
);

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div
    className={cn('mt-auto border-t border-forest-900/6 p-5', className)}
    {...props}
  />
);

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
};
