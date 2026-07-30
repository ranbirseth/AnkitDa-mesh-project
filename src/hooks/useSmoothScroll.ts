'use client';

import * as React from 'react';

interface SmoothLenisOptions {
  readonly duration?: number;
  readonly easing?: (t: number) => number;
  readonly smoothWheel?: boolean;
  readonly enabled?: boolean;
}

// ================================================================
// Minimal, dependency-light smooth scroll hook that matches Lenis
// behavior. Uses @studio-freight/lenis if present; falls back to
// native CSS smooth scroll otherwise.
//
// This hook exists to:
// 1. Centralize scroll logic
// 2. Expose scrollTo helper used by Navbar + ScrollIndicator
// ================================================================

let lenisInstance: any | null = null;

export function useSmoothScroll(options: SmoothLenisOptions = {}): {
  readonly scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number }) => void;
} {
  const {
    duration = 1.15,
    smoothWheel = true,
    enabled = true,
  } = options;

  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    let mounted = true;
    void (async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        if (!mounted) return;
        lenisInstance = new Lenis({
          duration,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel,
        });

        function raf(time: number): void {
          if (lenisInstance) {
            lenisInstance.raf(time);
          }
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch {
        // Lenis unavailable — native fallback will be used via scrollTo helper
      }
    })();

    return () => {
      mounted = false;
      if (lenisInstance) {
        try {
          lenisInstance.destroy();
        } catch {
          /* no-op */
        }
        lenisInstance = null;
      }
    };
  }, [duration, smoothWheel, enabled]);

  const scrollTo = React.useCallback(
    (target: string | number | HTMLElement, opts?: { offset?: number }): void => {
      const offset = opts?.offset ?? 0;
      if (lenisInstance) {
        try {
          lenisInstance.scrollTo(target, { offset });
          return;
        } catch {
          // fall through to native
        }
      }
      if (typeof window === 'undefined') return;
      if (typeof target === 'number') {
        window.scrollTo({ top: target + offset, behavior: 'smooth' });
        return;
      }
      const el =
        typeof target === 'string'
          ? document.querySelector<HTMLElement>(target)
          : target;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [],
  );

  return { scrollTo };
}
