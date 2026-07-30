'use client';

import * as React from 'react';

// ================================================================
// useMediaQuery — matchMedia hook (SSR-safe).
// ================================================================

export function useMediaQuery(query: string): boolean {
  const getMatch = React.useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = React.useState<boolean>(getMatch);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };
    setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export const usePrefersReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1024px)');
export const useIsTablet = (): boolean => useMediaQuery('(min-width: 768px)');
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)');
