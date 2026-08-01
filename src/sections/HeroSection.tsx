'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as UIimage } from '@/components/ui/image';
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { heroService, type IHeroService } from '@/services';
import type { HeroAmenityChip, HeroData, MediaAsset } from '@/types';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroSection(): React.ReactElement {
  const [data, setData] = React.useState<HeroData | null>(null);
  const [ready, setReady] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (heroService as IHeroService).getHero();
      if (mounted && result.success && result.data) {
        setData(result.data);
        requestAnimationFrame(() => {
          if (mounted) setReady(true);
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return <HeroSkeleton />;
  }

  return (
    <section
      id="home"
      aria-label="Ankit Da Mess — Home"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-forest-950 text-cream-50"
    >
      {/* Background */}
      <HeroBackground backgroundMedia={data.backgroundMedia} posterImage={data.posterImage} ready={ready} reduced={reduced} />

      {/* Particles overlay */}
      <FloatingParticles reduced={reduced} />

      {/* Foreground content */}
      <div className="relative z-10 min-h-[100svh] flex flex-col justify-end pb-16 sm:pb-20 md:pb-24 lg:pb-28 pt-24 sm:pt-32 md:pt-40">
        <div className="container-page grid w-full grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <motion.div
            className="relative z-10 flex flex-col gap-6 lg:col-span-8"
            initial={reduced ? false : 'hidden'}
            animate={ready ? 'show' : 'hidden'}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.25,
                },
              },
            }}
          >
            {/* Eyebrow */}
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="inline-flex w-fit items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-300"
            >
              <span aria-hidden className="inline-block h-px w-8 bg-gold-400" />
              {data.eyebrow}
            </motion.span>

            {/* Heading */}
            <motion.h1
              variants={{
                hidden: { clipPath: 'inset(0 100% 0 0)' },
                show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="font-display text-display-1 text-balance leading-[1.05] text-cream-50"
            >
              {data.heading}
              {data.headingAccent && (
                <span className="block whitespace-pre-line text-gold-400 drop-shadow-[0_4px_22px_rgba(198,156,46,0.25)]">
                  {data.headingAccent}
                </span>
              )}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="max-w-xl text-lead text-cream-100/85 text-pretty"
            >
              {data.subHeading}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09 } },
              }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <MagneticButtonCta reduced={reduced}>
                <Button
                  asChild
                  variant="gold"
                  size="lg"
                  className="shadow-gold"
                >
                  <a href={data.primaryCTA.href} {...(data.primaryCTA.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <LucideIcons.MessageSquare className="h-4 w-4" aria-hidden />
                    {data.primaryCTA.text}
                  </a>
                </Button>
              </MagneticButtonCta>
              <MagneticButtonCta reduced={reduced}>
                <Button
                  asChild
                  variant="glass"
                  size="lg"
                >
                  <a
                    href={data.secondaryCTA.href}
                    target={data.secondaryCTA.external ? '_blank' : undefined}
                    rel={data.secondaryCTA.external ? 'noopener noreferrer' : undefined}
                  >
                    <LucideIcons.MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden />
                    {data.secondaryCTA.text}
                  </a>
                </Button>
              </MagneticButtonCta>
              {data.tertiaryCTA && (
                <MagneticButtonCta reduced={reduced}>
                  <Button asChild variant="outline-light" size="lg">
                    <a href={data.tertiaryCTA.href} {...(data.tertiaryCTA.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      <LucideIcons.PhoneCall className="h-4 w-4" aria-hidden />
                      {data.tertiaryCTA.text}
                    </a>
                  </Button>
                </MagneticButtonCta>
              )}
            </motion.div>

            {/* Amenities strip */}
            {data.amenitiesStrip && data.amenitiesStrip.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="mt-4 w-full"
              >
                <AmenitiesStrip chips={data.amenitiesStrip} />
              </motion.div>
            )}
          </motion.div>

          {/* 3D Tilt building preview (right visual accent) */}
          <div className="relative hidden lg:block lg:col-span-4">
            <BuildingTilt3D image={data.backgroundMedia} reduced={reduced} />
          </div>
        </div>
      </div>

      {/* Scroll indicator bottom center */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: 'linear' }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center"
      >
        <ScrollIndicator />
      </motion.div>

      {/* Bottom fade to cream-50 transition (visual connector to Gallery section) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-24 bg-gradient-to-b from-transparent via-cream-50/0 to-cream-50"
      />
    </section>
  );
}

// --------------------------- Sub components ---------------------------

function HeroBackground({
  backgroundMedia,
  posterImage,
  ready,
  reduced,
}: {
  readonly backgroundMedia: MediaAsset;
  readonly posterImage?: MediaAsset;
  readonly ready: boolean;
  readonly reduced: boolean;
}): React.ReactElement {
  const posterUrl = posterImage?.url ?? backgroundMedia.url;
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {/* Image with Ken Burns */}
      <motion.div
        className="absolute inset-0 scale-100"
        initial={reduced ? false : { scale: 1 }}
        animate={ready && !reduced ? { scale: 1.12, x: '-1.5%', y: '-1%' } : {}}
        transition={reduced ? {} : { duration: 20, ease: 'linear' }}
      >
        <UIimage
          src={posterUrl || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
          alt=""
          fill
          priority
          quality={85}
          aspect="16/9"
          sizes="100vw"
          classNameWrap="!rounded-none absolute inset-0"
          className="!absolute inset-0 h-full w-full object-cover"
          blurDataURL={posterImage?.blurDataURL ?? backgroundMedia?.blurDataURL}
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-hero-gradient-mobile lg:bg-hero-gradient" />

      {/* Subtle grain / noise layer — tiny SVG */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

function FloatingParticles({ reduced }: { readonly reduced: boolean }): React.ReactElement {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const particles = React.useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const rand = (seed: number): number => {
          const x = Math.sin((i + 1) * (seed + 17.3)) * 10000;
          return x - Math.floor(x);
        };
        return {
          id: i,
          left: rand(1) * 100,
          top: rand(2) * 100,
          size: 2 + rand(3) * 3,
          opacity: 0.18 + rand(4) * 0.35,
          duration: 6 + rand(5) * 10,
          delay: -rand(6) * 10,
          drift: rand(7) * 24 - 12,
        };
      }),
    [],
  );

  if (reduced || !mounted) return <div aria-hidden className="hidden" />;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block rounded-full bg-gold-300"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            filter: 'blur(0.3px)',
            boxShadow: '0 0 12px rgba(228, 195, 93, 0.55)',
          }}
          initial={false}
          animate={{
            y: [0, -p.drift, 0],
            x: [0, p.drift / 2.5, 0],
            opacity: [p.opacity, p.opacity * 1.4, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function AmenitiesStrip({ chips }: { readonly chips: ReadonlyArray<HeroAmenityChip> }): React.ReactElement {
  return (
    <Reveal variant="fadeIn" delay={0.4}>
      <div className="glass-forest rounded-2xl border border-white/10 p-3 sm:p-4">
        <ul
          role="list"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {chips.map((chip) => (
            <AmenityChip key={chip.id} chip={chip} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function AmenityChip({ chip }: { readonly chip: HeroAmenityChip }): React.ReactElement {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[chip.iconKey] ?? LucideIcons.Home;
  return (
    <li className="flex items-center gap-2.5 rounded-xl p-2 sm:p-2.5 transition-colors hover:bg-white/6">
      <span
        aria-hidden
        className="inline-flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300"
      >
        <IconComponent className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      </span>
      <span className="min-w-0 flex flex-col overflow-hidden">
        <span className="truncate text-[0.72rem] sm:text-[0.8rem] font-semibold text-cream-50 leading-tight">{chip.title}</span>
        <span className="truncate text-[0.65rem] sm:text-[0.7rem] text-cream-100/70 leading-tight">{chip.subtitle}</span>
      </span>
    </li>
  );
}

function BuildingTilt3D({ image, reduced }: { readonly image: MediaAsset; readonly reduced: boolean }): React.ReactElement {
  const desktop = useIsDesktop();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });
  const rotY = useTransform(sx, [-0.5, 0.5], ['-6deg', '6deg']);
  const rotX = useTransform(sy, [-0.5, 0.5], ['4deg', '-4deg']);
  const scale = useTransform(sx, [-0.5, 0, 0.5], [1.01, 1, 1.01]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (reduced || !desktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(Math.max(-0.5, Math.min(0.5, px)));
    y.set(Math.max(-0.5, Math.min(0.5, py)));
  };
  const onLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className="relative w-full"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateY: rotY, rotateX: rotX, scale, transformStyle: 'preserve-3d' }}
        className="relative rounded-3xl shadow-card-hover overflow-hidden"
      >
        <div className="relative">
          <UIimage
            src={image.url}
            alt=""
            aspect="4/5"
            priority
            quality={80}
            rounded="2xl"
            sizes="(max-width: 1024px) 100vw, 33vw"
            classNameWrap="shadow-2xl"
          />
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent pointer-events-none" />
          <Badge variant="glass" size="lg" className="absolute left-4 top-4 backdrop-blur-md">
            <LucideIcons.MapPin className="h-3.5 w-3.5 text-gold-300" aria-hidden />
            Durgapur, West Bengal
          </Badge>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MagneticButtonCta({
  children,
  reduced,
}: {
  readonly children: React.ReactNode;
  readonly reduced: boolean;
}): React.ReactElement {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 16 });
  const sy = useSpring(my, { stiffness: 180, damping: 16 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * 10);
    my.set(py * 8);
  };
  const onLeave = (): void => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-flex w-auto"
    >
      {children}
    </motion.div>
  );
}

function ScrollIndicator(): React.ReactElement {
  const { scrollTo } = useSmoothScroll();
  return (
    <button
      type="button"
      aria-label="Scroll to Gallery section"
      onClick={() => scrollTo('#gallery', { offset: -80 })}
      className="group/scroll pointer-events-auto inline-flex flex-col items-center gap-2 rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cream-100/85 transition-colors hover:text-gold-300"
    >
      <span className="relative inline-flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
        <motion.span
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-2 w-1 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(217,174,55,0.7)]"
        />
      </span>
      <span>Scroll</span>
      <LucideIcons.ChevronDown
        aria-hidden
        className="h-4 w-4 animate-bob-vertical text-gold-300"
      />
    </button>
  );
}

function HeroSkeleton(): React.ReactElement {
  return (
    <section
      aria-label="Loading hero content"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-forest-950 text-cream-50"
    >
      <div className="absolute inset-0 bg-forest-900/60" />
      <div className="container-page relative z-10 flex min-h-[100svh] flex-col justify-end pb-20 pt-48">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-3 w-72 rounded-full bg-cream-100/30" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full max-w-xl rounded-2xl bg-cream-100/20" />
            <Skeleton className="h-16 w-2/3 max-w-lg rounded-2xl bg-gold-500/30" />
          </div>
          <Skeleton className="h-5 w-full max-w-xl rounded-full bg-cream-100/25" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-12 w-40 rounded-full bg-gold-500/60" />
            <Skeleton className="h-12 w-40 rounded-full bg-cream-50/10" />
            <Skeleton className="h-12 w-40 rounded-full bg-cream-50/10" />
          </div>
          <Skeleton className="mt-4 h-20 sm:h-24 w-full rounded-2xl bg-cream-100/10" />
        </div>
      </div>
    </section>
  );
}
