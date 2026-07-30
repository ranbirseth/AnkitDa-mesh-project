'use client';

import * as React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export interface ProvidersProps {
  readonly children: React.ReactNode;
  readonly enableLenis?: boolean;
}

/**
 * Global Client-Side Providers.
 * Mounted in the (site) layout group to minimize server component overhead.
 */
export function Providers({ children, enableLenis = true }: ProvidersProps): React.ReactElement {
  useSmoothScroll({ enabled: enableLenis });
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}
