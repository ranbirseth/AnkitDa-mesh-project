'use client';

import * as React from 'react';

// ================================================================
// useIntersectionObserver — track whether an element enters the viewport.
// triggerOnce: only fires the first time (default true for section reveals).
// ================================================================

interface IntersectionOptions extends Omit<IntersectionObserverInit, 'root'> {
  readonly triggerOnce?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: (entry: IntersectionObserverEntry) => void;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: IntersectionOptions = {},
): [React.RefCallback<T>, boolean] {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = true,
    disabled = false,
    onChange,
  } = options;

  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  const setRef = React.useCallback<React.RefCallback<T>>(
    (node) => {
      if (disabled) {
        ref.current = node;
        return;
      }
      ref.current = node;
    },
    [disabled],
  );

  React.useEffect(() => {
    if (disabled) {
      setInView(true);
      return undefined;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        onChange?.(entry);
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, disabled, onChange]);

  return [setRef, inView];
}
