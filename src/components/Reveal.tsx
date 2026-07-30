'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { fadeIn, fadeUp, stagger, zoomIn } from '@/animations/variants';

type RevealVariant = 'fadeUp' | 'fadeIn' | 'zoomIn' | 'none';

const VARIANT_MAP: Record<Exclude<RevealVariant, 'none'>, Variants> = {
  fadeUp: fadeUp(24, 0.6),
  fadeIn: fadeIn(0.5),
  zoomIn: zoomIn(0.96),
};

export interface RevealProps {
  readonly variant?: RevealVariant;
  readonly delay?: number;
  readonly staggerChildren?: number;
  readonly triggerOnce?: boolean;
  readonly disabled?: boolean;
  readonly threshold?: number;
  readonly rootMargin?: string;
  readonly className?: string;
  readonly id?: string;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
  readonly role?: React.AriaRole;
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-hidden'?: boolean | undefined;
}

/**
 * Section-child entrance wrapper.
 * - Observes intersection once (by default).
 * - Honors prefers-reduced-motion (renders the element at final state directly).
 * - Optional stagger for grid/list containers.
 *
 * NOTE: This component exposes only a safe subset of div props. Extend
 * `RevealProps` above if you need additional aria/role/data-* attributes,
 * or wrap Reveal in another element.
 */
export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  props,
  forwardedRef,
) {
  const {
    variant = 'fadeUp',
    delay = 0,
    staggerChildren,
    triggerOnce = true,
    disabled,
    threshold = 0.15,
    rootMargin = '0px 0px -8% 0px',
    className,
    id,
    style,
    children,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': ariaHidden,
  } = props;

  const reduced = usePrefersReducedMotion();
  const forceOff = disabled || reduced;
  const [setRef, inView] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce,
    disabled: forceOff,
  });

  const mergedRef = useMergeRef(setRef, forwardedRef);

  if (forceOff) {
    return (
      <div
        ref={mergedRef as React.Ref<HTMLDivElement>}
        id={id}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-hidden={ariaHidden}
        className={className}
        style={style}
      >
        {children}
      </div>
    );
  }

  const chosenVariants: Variants =
    variant === 'none'
      ? stagger(delay, staggerChildren ?? 0.04)
      : VARIANT_MAP[variant]!;

  const mergedVariants: Variants =
    staggerChildren || delay
      ? mergeVariantsWithStagger(chosenVariants, delay, staggerChildren ?? 0)
      : chosenVariants;

  return (
    <motion.div
      ref={mergedRef}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={ariaHidden}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={mergedVariants}
      className={cn(className)}
      style={style as React.CSSProperties}
    >
      {children}
    </motion.div>
  );
});

function mergeVariantsWithStagger(base: Variants, delayChildren: number, staggerChildren: number): Variants {
  const baseHidden = base.hidden;
  const baseShow = base.show;
  const showTransition =
    baseShow && typeof baseShow === 'object' && 'transition' in baseShow
      ? (baseShow as { transition?: unknown }).transition
      : undefined;

  return {
    ...base,
    hidden: baseHidden,
    show: {
      ...(baseShow as object),
      transition: {
        delayChildren,
        staggerChildren,
        ...(showTransition as object),
      },
    },
  } as Variants;
}

// --- helpers ---
type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T | null> | null | undefined;

function useMergeRef<T>(...refs: ReadonlyArray<ReactRef<T>>): React.RefCallback<T> {
  return React.useCallback<React.RefCallback<T>>(
    (value) => {
      for (const ref of refs) {
        if (ref == null) continue;
        if (typeof ref === 'function') {
          ref(value);
        } else {
          (ref as React.MutableRefObject<T | null>).current = value;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
