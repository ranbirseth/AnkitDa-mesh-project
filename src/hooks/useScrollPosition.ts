'use client';

import * as React from 'react';

/**
 * Tracks scroll Y position as Lenis-compatible scroll listener,
 * with throttling via rAF to stay within 60fps budget.
 */
export function useScrollY(enabled = true): number {
  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;
    let raf = 0;
    let latest = 0;
    const onScroll = (): void => {
      latest = window.scrollY || window.pageYOffset || 0;
      if (!raf) {
        raf = window.requestAnimationFrame(() => {
          setY(latest);
          raf = 0;
        });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return y;
}

/**
 * Tracks scroll direction for auto-hiding navbar.
 */
export function useScrollDirection(threshold = 8): 'up' | 'down' | 'none' {
  const [direction, setDirection] = React.useState<'up' | 'down' | 'none'>('none');

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let lastY = window.scrollY || 0;
    let raf = 0;
    const onScroll = (): void => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastY;
        if (Math.abs(delta) >= threshold) {
          setDirection(delta > 0 ? 'down' : 'up');
          lastY = y;
        }
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return direction;
}
