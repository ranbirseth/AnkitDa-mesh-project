import type { Variants, Transition } from 'framer-motion';

// ================================================================
// Shared Framer Motion Variants
// ================================================================

const EASE_OUT_EXPO: Transition['ease'] = [0.22, 1, 0.36, 1];
const EASE_OUT_BACK: Transition['ease'] = [0.34, 1.56, 0.64, 1];
const EASE_IN_OUT_CUBIC: Transition['ease'] = [0.65, 0, 0.35, 1];

export const EASINGS = {
  outExpo: EASE_OUT_EXPO,
  outBack: EASE_OUT_BACK,
  inOutCubic: EASE_IN_OUT_CUBIC,
  smooth: [0.16, 1, 0.3, 1] as Transition['ease'],
} as const;

export const TRANSITIONS = {
  smoothSpring: {
    type: 'spring' as const,
    stiffness: 140,
    damping: 18,
    mass: 0.8,
  },
  softSpring: {
    type: 'spring' as const,
    stiffness: 90,
    damping: 16,
  },
  base: { duration: 0.55, ease: EASE_OUT_EXPO },
  slow: { duration: 0.9, ease: EASE_OUT_EXPO },
  fast: { duration: 0.3, ease: EASE_OUT_EXPO },
  clip: { duration: 0.95, ease: EASINGS.smooth },
} satisfies Record<string, Transition>;

// ------------- Entrance variants -------------

export const fadeUp = (offsetY = 24, duration = 0.6): Variants => ({
  hidden: { opacity: 0, y: offsetY },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE_OUT_EXPO },
  },
});

export const fadeIn = (duration = 0.55): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, ease: EASE_OUT_EXPO } },
});

export const zoomIn = (scale = 0.94): Variants => ({
  hidden: { opacity: 0, scale },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
});

export const slideInLeft = (offsetX = 64): Variants => ({
  hidden: { opacity: 0, x: -offsetX },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
});

export const slideInRight = (offsetX = 64): Variants => ({
  hidden: { opacity: 0, x: offsetX },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
});

export const clipReveal = (direction: 'lr' | 'rl' | 'tb' = 'lr'): Variants => {
  const insetHidden =
    direction === 'lr'
      ? 'inset(0 100% 0 0)'
      : direction === 'rl'
        ? 'inset(0 0 0 100%)'
        : 'inset(100% 0 0 0)';
  return {
    hidden: { clipPath: insetHidden },
    show: {
      clipPath: 'inset(0 0 0 0)',
      transition: TRANSITIONS.clip,
    },
  };
};

export const stagger = (delayChildren = 0.06, staggerChildren = 0.05): Variants => ({
  hidden: {},
  show: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

export const badgePop = (): Variants => ({
  hidden: { opacity: 0, scale: 0.7 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 18, delay: 0.1 },
  },
});

// ------------- Exit variants -------------

export const fadeOut = (): Variants => ({
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'linear' } },
});
