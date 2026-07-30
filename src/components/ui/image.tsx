'use client';

import * as React from 'react';
import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

type AspectPreset = 'auto' | '1/1' | '4/3' | '3/4' | '16/9' | '9/16' | '2/3' | '3/2' | '4/5' | '5/6';

const ASPECT_MAP: Record<AspectPreset, string | undefined> = {
  auto: undefined,
  '1/1': '1 / 1',
  '4/3': '4 / 3',
  '3/4': '3 / 4',
  '16/9': '16 / 9',
  '9/16': '9 / 16',
  '2/3': '2 / 3',
  '3/2': '3 / 2',
  '4/5': '4 / 5',
  '5/6': '5 / 6',
};

export interface ImageProps extends Omit<NextImageProps, 'alt'> {
  readonly alt: string;
  readonly aspect?: AspectPreset;
  readonly rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  readonly zoomOnHover?: boolean;
  readonly grayscaleFadeIn?: boolean;
  readonly classNameWrap?: string;
}

/**
 * next/image wrapper with:
 * - Explicit aspect ratio wrapper → 0 CLS
 * - Blur-up LQIP placeholder by default
 * - Smooth fade-in on load (honors prefers-reduced-motion)
 * - Hover transform scale zoom (GPU-only)
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    aspect = 'auto',
    rounded = 'lg',
    zoomOnHover,
    grayscaleFadeIn,
    classNameWrap,
    className,
    alt,
    fill,
    src,
    ...rest
  },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = React.useState(false);

  const radiusClass = cn(
    rounded !== 'none' && {
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-xl': rounded === 'lg',
      'rounded-2xl': rounded === 'xl',
      'rounded-3xl': rounded === '2xl',
      'rounded-full': rounded === 'full',
    },
  );

  const wrapStyle: React.CSSProperties | undefined =
    aspect !== 'auto' ? { aspectRatio: ASPECT_MAP[aspect] } : undefined;

  const effectiveBlurDataURL =
    rest.blurDataURL && rest.blurDataURL.startsWith('data:image/')
      ? rest.blurDataURL
      : undefined;
  const effectivePlaceholder =
    rest.placeholder ?? (effectiveBlurDataURL ? 'blur' : 'empty');

  return (
    <div
      className={cn(
        'relative block w-full overflow-hidden bg-cream-200/60',
        radiusClass,
        zoomOnHover && 'group/zoom',
        classNameWrap,
      )}
      style={wrapStyle}
    >
      <NextImage
        ref={ref}
        src={src}
        alt={alt}
        fill={fill ?? aspect !== 'auto'}
        sizes={
          rest.sizes ??
          '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw'
        }
        placeholder={effectivePlaceholder}
        blurDataURL={effectiveBlurDataURL}
        onLoadCapture={() => {
          if (!reduced) setLoaded(true);
        }}
        className={cn(
          'object-cover will-change-transform',
          radiusClass,
          'transition-opacity duration-500 ease-out-expo',
          loaded || reduced ? 'opacity-100' : 'opacity-0',
          grayscaleFadeIn &&
            !reduced &&
            'transition-[filter,opacity,transform] duration-700',
          grayscaleFadeIn && !loaded ? 'grayscale scale-[1.02]' : 'grayscale-0',
          zoomOnHover &&
            'duration-700 ease-out-expo group-hover/zoom:scale-[1.08]',
          className,
        )}
        {...rest}
      />
      <noscript>
        {/* SSR fallback: static img element is rendered by Next. Hide skeleton only on load. */}
      </noscript>
    </div>
  );
});
