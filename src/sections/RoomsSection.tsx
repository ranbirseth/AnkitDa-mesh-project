'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Image as UIimage } from '@/components/ui/image';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { roomsService, type IRoomsService } from '@/services';
import type { Room, RoomFeature, RoomStatus } from '@/types';
import {
  ChevronsLeft as ChevronLeftIcon,
  ChevronsRight as ChevronRightIcon,
  IndianRupee as RupeeIcon,
  Users as UsersIcon,
  BedDouble as BedIcon,
  Maximize2 as SizeIcon,
  Check as CheckIcon,
  Sparkles as SparklesIcon,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, A11y } from 'swiper/modules';
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/useMediaQuery';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';

// Need to build index barrel for lib; we import here for minimalism across sections.
// This file will be created right after.

export function RoomsSection(): React.ReactElement {
  const [rooms, setRooms] = React.useState<ReadonlyArray<Room>>([]);
  const [loading, setLoading] = React.useState(true);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (roomsService as IRoomsService).getRooms(true, 12);
      if (mounted && result.success && result.data) {
        setRooms(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SectionWrapper
      id="rooms"
      padding="md"
      eyebrow="Our Rooms"
      heading={
        <span>
          Find Your <span className="text-gold-600">Perfect Space</span>
        </span>
      }
      subheading="Comfortable spaces designed for your peace and productivity — single, shared, balcony, and premium ensuite options."
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Previous rooms"
            className="rooms-prev"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Next rooms"
            className="rooms-next"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      {loading ? (
        <RoomsGridSkeleton />
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <SparklesIcon className="h-10 w-10 text-ink-400" />
          <p className="font-display text-xl text-forest-800">Rooms coming soon</p>
          <p className="text-sm text-ink-600">All our rooms are currently filled. Please check back or enquire for waitlist.</p>
        </div>
      ) : (
        <Reveal variant="fadeUp" className="w-full">
          <Swiper
            modules={[Navigation, Keyboard, A11y]}
            spaceBetween={24}
            loop={rooms.length >= 4}
            grabCursor
            keyboard={{ enabled: true, onlyInViewport: true }}
            navigation={{
              nextEl: '.rooms-next',
              prevEl: '.rooms-prev',
            }}
            a11y={{
              prevSlideMessage: 'Previous room',
              nextSlideMessage: 'Next room',
            }}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1.15, spaceBetween: 16 },
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 22 },
              1024: { slidesPerView: 2.5, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 28 },
              1536: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="!overflow-visible [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:!h-auto !pb-6 max-w-full"
          >
            {rooms.map((room, idx) => (
              <SwiperSlide key={room.id} className="!flex !items-stretch">
                <RoomCard room={room} index={idx} reduced={reduced} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      )}
    </SectionWrapper>
  );
}

function RoomCard({
  room,
  index,
  reduced,
}: {
  readonly room: Room;
  readonly index: number;
  readonly reduced: boolean;
}): React.ReactElement {
  return (
    <Reveal variant="zoomIn" delay={reduced ? 0 : 0.06 * index} className="h-full w-full">
      <RoomTilt3D reduced={reduced}>
        <Card
          variant="elevated"
          className="group/card flex h-full w-full flex-col border-forest-900/8 transition-all duration-300"
        >
          {/* Top image + badge */}
          <div className="relative">
            <UIimage
              src={room.primaryImage.url}
              alt={room.primaryImage.alt}
              aspect="4/3"
              rounded="2xl"
              zoomOnHover
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              quality={85}
              classNameWrap="!rounded-none !rounded-t-2xl"
            />
            {/* Status badge */}
            <div className="absolute left-4 top-4 z-[1]">
              <Reveal variant="none" disabled={reduced}>
                <AvailabilityBadge status={room.status} />
              </Reveal>
            </div>
            {/* Featured badge */}
            {room.featured && (
              <div className="absolute right-4 top-4 z-[1]">
                <Badge variant="gold-solid" size="sm">
                  <SparklesIcon className="h-3 w-3" /> Featured
                </Badge>
              </div>
            )}
            {/* Shine sweep on hover (premium shimmer) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden !rounded-none !rounded-t-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            >
              <span className="absolute -top-full -left-1/3 h-full w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/card:animate-[slideShine_1.1s_ease-out_forwards]" />
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl text-forest-900 leading-tight">
                  {room.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-500">
                  {room.capacityAdults && (
                    <span className="inline-flex items-center gap-1.5">
                      <UsersIcon className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                      {room.capacityAdults} Adult{room.capacityAdults !== 1 ? 's' : ''}
                    </span>
                  )}
                  {room.bedType && (
                    <span className="inline-flex items-center gap-1.5">
                      <BedIcon className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                      {room.bedType}
                    </span>
                  )}
                  {room.roomSizeSqFt && (
                    <span className="inline-flex items-center gap-1.5">
                      <SizeIcon className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                      {room.roomSizeSqFt} sq ft
                    </span>
                  )}
                </div>
              </div>
              <RoomPrice price={room.priceMonthly} />
            </div>

            <p className="text-sm leading-relaxed text-ink-600 line-clamp-2">
              {room.shortDescription}
            </p>

            <ul role="list" className="grid grid-cols-1 gap-2">
              {room.features.slice(0, 4).map((f) => (
                <RoomFeatureItem key={f.id} feature={f} />
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <Button asChild variant="forest" size="md" className="group/btn w-full justify-center overflow-hidden">
                <a href={`/rooms/${room.slug}`}>
                  <span className="relative inline-flex items-center gap-2">
                    View Details
                    <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </RoomTilt3D>
    </Reveal>
  );
}

function RoomPrice({ price }: { readonly price: number }): React.ReactElement {
  return (
    <div className="shrink-0 text-right">
      <div className="flex items-baseline justify-end gap-1">
        <span className="text-xs font-semibold text-gold-600 flex items-center">
          <RupeeIcon className="h-3 w-3 mr-0.5" />
        </span>
        <span className="font-display text-[1.4rem] font-bold leading-none text-forest-900">
          {price.toLocaleString('en-IN')}
        </span>
      </div>
      <span className="text-[0.7rem] font-semibold text-ink-500 uppercase tracking-wider">/month</span>
    </div>
  );
}

function AvailabilityBadge({ status }: { readonly status: RoomStatus }): React.ReactElement {
  if (status === 'available') {
    return (
      <Badge variant="available" size="md" className="shadow-soft backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Available
      </Badge>
    );
  }
  if (status === 'filled') {
    return (
      <Badge variant="filled" size="md" className="backdrop-blur">
        Filled
      </Badge>
    );
  }
  return (
    <Badge variant="maintenance" size="md" className="backdrop-blur">
      Maintenance
    </Badge>
  );
}

function RoomFeatureItem({ feature }: { readonly feature: RoomFeature }): React.ReactElement {
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[feature.iconKey] ??
    LucideIcons.Check;
  return (
    <li className="flex items-center gap-2.5 text-[0.82rem] text-forest-900/90">
      <span
        aria-hidden
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/12 text-gold-700"
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
      <span className="flex min-w-0 items-center gap-2 truncate">
        <IconComponent className="h-3.5 w-3.5 text-ink-500 shrink-0" aria-hidden />
        <span className="truncate">{feature.label}</span>
      </span>
    </li>
  );
}

function RoomTilt3D({
  children,
  reduced,
}: {
  readonly children: React.ReactNode;
  readonly reduced: boolean;
}): React.ReactElement {
  const desktop = useIsDesktop();
  const enabled = !reduced && desktop;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);
  const rotateX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg']);

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!enabled) return;
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
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="h-full w-full"
      style={{
        perspective: enabled ? 1200 : undefined,
      }}
    >
      <motion.div
        style={{
          rotateY: enabled ? (rotateY as unknown as string | number) : undefined,
          rotateX: enabled ? (rotateX as unknown as string | number) : undefined,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        whileHover={enabled ? { y: -6, transition: { type: 'spring', stiffness: 260, damping: 22 } } : undefined}
        className="h-full w-full rounded-[inherit] will-change-transform"
      >
        {children}
      </motion.div>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html:
            '@keyframes slideShine { 0% { transform: translateX(0) rotate(-12deg) translateY(0); } 100% { transform: translateX(600%) rotate(-12deg) translateY(0); } }',
        }}
      />
    </motion.div>
  );
}

function RoomsGridSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-2xl border border-forest-900/8 bg-white p-5 shadow-soft">
          <Skeleton aspect={4 / 3} className="w-full rounded-2xl bg-cream-200/70" />
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-40 rounded-full bg-cream-200" />
              <Skeleton className="h-3 w-52 rounded-full bg-cream-100" />
            </div>
            <Skeleton className="h-10 w-20 rounded-xl bg-cream-100" />
          </div>
          <Skeleton shape="text" lines={4} />
          <Skeleton className="mt-auto h-11 w-full rounded-full bg-forest-800/80" />
        </div>
      ))}
    </div>
  );
}
