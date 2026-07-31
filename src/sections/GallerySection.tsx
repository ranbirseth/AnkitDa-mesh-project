'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as UIimage } from '@/components/ui/image';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Reveal } from '@/components/Reveal';
import {
  ChevronsLeft as ChevronLeftIcon,
  ChevronsRight as ChevronRightIcon,
  ZoomIn as ZoomInIcon,
  Grid3X3 as GridIcon,
  SlidersHorizontal as SliderIcon,
  X as CloseIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Images as ImagesIcon,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules';
import { cn } from '@/lib/cn';
import type { GalleryCategory, GalleryItem } from '@/types';
import { galleryService, type IGalleryService } from '@/services';
import { GALLERY_CATEGORIES, type GalleryCategoryId } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Number of items to show initially in the masonry grid
const INITIAL_GRID_COUNT = 4;
// Number of items to show in the featured slider
const SLIDER_COUNT = 5;

export function GallerySection(): React.ReactElement {
  const [items, setItems] = React.useState<ReadonlyArray<GalleryItem>>([]);
  const [category, setCategory] = React.useState<GalleryCategory>('all');
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  // Fetch
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    void (async (): Promise<void> => {
      const result = await (galleryService as IGalleryService).getGallery(undefined, 50);
      if (mounted && result.success && result.data) {
        setItems(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset expansion when category changes
  React.useEffect(() => {
    setExpanded(false);
  }, [category]);

  const filtered = React.useMemo(() => {
    if (category === 'all') return items;
    return items.filter((i) => i.category === category);
  }, [items, category]);

  // Slider: top SLIDER_COUNT featured items first
  const sliderItems = React.useMemo(
    () =>
      filtered
        .filter((i) => i.featured)
        .concat(filtered.filter((i) => !i.featured))
        .slice(0, SLIDER_COUNT),
    [filtered],
  );

  // Grid: initially show INITIAL_GRID_COUNT, expand to all
  const visibleGridItems = React.useMemo(
    () => (expanded ? filtered : filtered.slice(0, INITIAL_GRID_COUNT)),
    [filtered, expanded],
  );

  const hasMore = filtered.length > INITIAL_GRID_COUNT;
  const hiddenCount = filtered.length - INITIAL_GRID_COUNT;

  // Lightbox state — works on visibleGridItems
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const openAt = (idx: number): void => setLightboxIndex(idx);
  const close = (): void => setLightboxIndex(null);
  const next = (): void => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % visibleGridItems.length);
  };
  const prev = (): void => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + visibleGridItems.length) % visibleGridItems.length);
  };
  const current = lightboxIndex !== null ? visibleGridItems[lightboxIndex] : null;

  // Keyboard nav for lightbox
  React.useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % visibleGridItems.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + visibleGridItems.length) % visibleGridItems.length));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, visibleGridItems.length]);

  return (
    <SectionWrapper
      id="gallery"
      padding="md"
      eyebrow="Gallery"
      heading={
        <span>
          Discover Our <span className="text-gold-600">Beautiful Spaces</span>
        </span>
      }
      subheading="A glimpse of every corner — curated rooms, common areas, rooftop terrace and kitchen."
      headerActions={
        <div className="inline-flex items-center gap-2">
          <ViewToggle />
        </div>
      }
    >
      {/* Filters */}
      <Reveal variant="fadeUp" className="mb-8 md:mb-10">
        <GalleryFilters category={category} onChange={setCategory} reduced={reduced} />
      </Reveal>

      {/* Featured Slider — top 5 images */}
      <Reveal variant="fadeUp" className="mb-14 md:mb-16">
        <FeaturedGlassSlider
          items={sliderItems}
          onOpen={(idx) => {
            // Open in lightbox — map to filtered index
            const item = sliderItems[idx];
            if (!item) return;
            const filteredIdx = visibleGridItems.findIndex((g) => g.id === item.id);
            if (filteredIdx !== -1) openAt(filteredIdx);
            else openAt(0);
          }}
          reduced={reduced}
          loading={loading}
        />
      </Reveal>

      {/* Masonry Grid — limited initially */}
      {loading ? (
        <GalleryMasonrySkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <GridIcon className="h-10 w-10 text-ink-400" />
          <p className="font-display text-xl text-forest-800">No photos in this category</p>
          <p className="text-sm text-ink-600">Check back soon — we are adding more photos.</p>
        </div>
      ) : (
        <>
          <GalleryMasonry
            items={visibleGridItems}
            onOpen={openAt}
            reduced={reduced}
          />

          {/* View Full Gallery / Show Less button */}
          {hasMore && (
            <Reveal variant="fadeUp" className="mt-10 flex flex-col items-center gap-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={expanded ? 'less' : 'more'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Button
                    variant={expanded ? 'outline' : 'forest'}
                    size="lg"
                    onClick={() => setExpanded((v) => !v)}
                    className="min-w-[200px]"
                  >
                    {expanded ? (
                      <>
                        <ChevronUpIcon className="h-4 w-4" aria-hidden />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ImagesIcon className="h-4 w-4" aria-hidden />
                        View Full Gallery
                        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums">
                          +{hiddenCount}
                        </span>
                      </>
                    )}
                  </Button>
                  {!expanded && (
                    <p className="text-sm text-ink-500">
                      {hiddenCount} more photo{hiddenCount !== 1 ? 's' : ''} available
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </Reveal>
          )}
        </>
      )}

      {/* Lightbox */}
      <Dialog open={current !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent
          size="full"
          showClose={false}
          className="!bg-forest-950/80 !p-0 !border-white/10 backdrop-blur-xl"
        >
          {current ? (
            <LightboxContent
              item={current}
              index={lightboxIndex!}
              total={visibleGridItems.length}
              onPrev={prev}
              onNext={next}
              onClose={close}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}

// ---------------- Filters ----------------
function GalleryFilters({
  category,
  onChange,
  reduced,
}: {
  readonly category: GalleryCategory;
  readonly onChange: (c: GalleryCategory) => void;
  readonly reduced: boolean;
}): React.ReactElement {
  return (
    <div role="tablist" aria-label="Gallery category filters" className="flex flex-wrap gap-2">
      {GALLERY_CATEGORIES.map((c) => {
        const active = category === c.id;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.id as GalleryCategoryId)}
            className={cn(
              'group relative inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
              active
                ? 'bg-forest-800 border-forest-700 text-gold-400 shadow-soft'
                : 'border-forest-900/10 bg-white/60 text-forest-800 hover:border-forest-700/20 hover:bg-white',
            )}
            style={!reduced && active ? { transform: 'translateY(0)' } : undefined}
          >
            <SliderIcon
              aria-hidden
              className={cn('mr-1.5 h-3.5 w-3.5', active ? 'text-gold-400' : 'text-ink-500')}
            />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Featured Glass Slider ----------------
function FeaturedGlassSlider({
  items,
  onOpen,
  reduced,
  loading,
}: {
  readonly items: ReadonlyArray<GalleryItem>;
  readonly onOpen: (idx: number) => void;
  readonly reduced: boolean;
  readonly loading: boolean;
}): React.ReactElement {
  if (loading || items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton aspect={4 / 5} className="h-72 md:h-96 rounded-2xl bg-cream-200/60" />
        <Skeleton aspect={4 / 5} className="hidden md:block h-72 md:h-96 rounded-2xl bg-cream-200/60" />
        <Skeleton aspect={4 / 5} className="hidden md:block h-72 md:h-96 rounded-2xl bg-cream-200/60" />
      </div>
    );
  }
  return (
    <div className="swiper-gallery group/slider relative mx-auto w-full max-w-6xl">
      <Swiper
        modules={[EffectCreative, Autoplay, Pagination, Navigation, Keyboard]}
        effect="creative"
        grabCursor
        loop={items.length >= 3}
        centeredSlides
        speed={reduced ? 0 : 700}
        slidesPerView="auto"
        keyboard={{ enabled: true, onlyInViewport: true }}
        creativeEffect={{
          prev: {
            translate: ['-70%', 0, -300],
            opacity: 0.55,
            rotate: [0, 0, -7],
            scale: 0.85,
          },
          next: {
            translate: ['70%', 0, -300],
            opacity: 0.55,
            rotate: [0, 0, 7],
            scale: 0.85,
          },
        }}
        breakpoints={{
          0: { spaceBetween: 16, slidesPerView: 1.15 },
          640: { spaceBetween: 24, slidesPerView: 2 },
          1024: { spaceBetween: 28, slidesPerView: 3 },
        }}
        autoplay={reduced ? false : { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true, el: '.gal-pagination' }}
        navigation={{
          nextEl: '.gal-next',
          prevEl: '.gal-prev',
        }}
        className="!py-6 !px-2 !overflow-visible"
      >
        {items.map((item, i) => (
          <SwiperSlide
            key={item.id}
            className="!w-[78%] sm:!w-[62%] md:!w-[50%] lg:!w-[42%] !h-auto"
          >
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="group/card relative block w-full overflow-hidden rounded-3xl border border-white/60 bg-forest-950/30 shadow-card-hover text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/50"
              aria-label={`Open image — ${item.title}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-forest-950/60 pointer-events-none z-[1]" />
              <UIimage
                src={item.image.url}
                alt={item.alt}
                aspect="4/5"
                sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 42vw"
                zoomOnHover
                rounded="2xl"
                classNameWrap="!rounded-[inherit]"
                quality={80}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between p-5 sm:p-6">
                <div className="flex flex-col gap-1.5 text-left">
                  <Badge variant="glass" size="sm" className="w-fit">
                    {labelForCategory(item.category)}
                  </Badge>
                  <h3 className="font-display text-lg sm:text-xl leading-tight text-cream-50 drop-shadow-md">
                    {item.title}
                  </h3>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-cream-50 border border-white/15 backdrop-blur-md transition group-hover/card:bg-gold-500 group-hover/card:text-forest-900 group-hover/card:border-gold-300">
                  <ZoomInIcon className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="gal-pagination mt-6 flex items-center justify-center [&>.swiper-pagination-bullet]:h-2.5 [&>.swiper-pagination-bullet]:w-2.5 [&>.swiper-pagination-bullet-active]:!w-7 [&>.swiper-pagination-bullet-active]:!rounded-full [&>.swiper-pagination-bullet-active]:!bg-gold-500 [&>.swiper-pagination-bullet]:!bg-forest-900/20 [&>.swiper-pagination-bullet]:!opacity-100" />

      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 inset-x-0 z-20 justify-between px-2 md:px-0 pointer-events-none">
        <Button
          type="button"
          variant="glass"
          size="icon"
          aria-label="Previous slide"
          className="gal-prev pointer-events-auto !bg-cream-50/90 !border-forest-900/10 !text-forest-800 shadow-elevate hover:!bg-gold-500 hover:!text-forest-900 hover:!border-gold-500"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="glass"
          size="icon"
          aria-label="Next slide"
          className="gal-next pointer-events-auto !bg-cream-50/90 !border-forest-900/10 !text-forest-800 shadow-elevate hover:!bg-gold-500 hover:!text-forest-900 hover:!border-gold-500"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

// ---------------- Masonry ----------------
function GalleryMasonry({
  items,
  onOpen,
  reduced,
}: {
  readonly items: ReadonlyArray<GalleryItem>;
  readonly onOpen: (absoluteIndex: number) => void;
  readonly reduced: boolean;
}): React.ReactElement {
  return (
    <AnimatePresence initial={false}>
      <Reveal
        variant="fadeUp"
        staggerChildren={reduced ? 0 : 0.04}
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]"
      >
        {items.map((item, idx) => {
          const heights = ['4/5', '3/4', '1/1', '5/6'] as const;
          const aspect = heights[(idx * 3 + item.id.length) % heights.length] ?? '4/5';
          return (
            <motion.button
              key={item.id}
              layout={!reduced}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              type="button"
              onClick={() => onOpen(idx)}
              className="group/masonry relative mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-forest-900/8 bg-cream-100 shadow-soft text-left transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/50"
              aria-label={`Open ${item.title} — ${labelForCategory(item.category)}`}
            >
              <UIimage
                src={item.image.url}
                alt={item.alt}
                aspect={aspect}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                zoomOnHover
                rounded="2xl"
                classNameWrap="!rounded-[inherit]"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 opacity-0 transition-opacity duration-300 group-hover/masonry:opacity-100">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="glass-dark" size="sm">
                    {labelForCategory(item.category)}
                  </Badge>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-800 backdrop-blur-md shadow-soft">
                    <ZoomInIcon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <div className="rounded-xl bg-forest-900/65 p-3 backdrop-blur-md">
                  <p className="font-display text-[0.95rem] leading-tight text-cream-50">{item.title}</p>
                  {item.caption ? (
                    <p className="mt-1 text-xs text-cream-100/85 line-clamp-2">{item.caption}</p>
                  ) : null}
                </div>
              </div>
            </motion.button>
          );
        })}
      </Reveal>
    </AnimatePresence>
  );
}

function GalleryMasonrySkeleton(): React.ReactElement {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-4 inline-block w-full break-inside-avoid">
          <Skeleton aspect={i % 2 === 0 ? 4 / 5 : 3 / 4} className="rounded-2xl bg-cream-200/60" />
        </div>
      ))}
    </div>
  );
}

// ---------------- Lightbox ----------------
function LightboxContent({
  item,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  readonly item: GalleryItem;
  readonly index: number;
  readonly total: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onClose: () => void;
}): React.ReactElement {
  return (
    <div className="relative flex min-h-[80vh] w-full flex-col gap-4 p-4 md:p-6 lg:p-8">
      <DialogTitle className="sr-only">{item.title}</DialogTitle>
      <DialogDescription className="sr-only">{item.alt}</DialogDescription>

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1 text-cream-50">
          <Badge variant="glass" size="sm">
            {labelForCategory(item.category)}
          </Badge>
          <h3 className="font-display text-xl md:text-2xl">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="glass" size="sm" aria-label={`Image ${index + 1} of ${total}`}>
            {index + 1} / {total}
          </Badge>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-cream-50 backdrop-blur hover:bg-white/14"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div className="relative flex-1 min-h-[60vh] overflow-hidden rounded-2xl border border-white/10">
        <UIimage
          src={item.image.url}
          alt={item.alt}
          aspect="auto"
          fill
          priority
          quality={90}
          rounded="2xl"
          sizes="92vw"
          classNameWrap="!rounded-[inherit] !bg-forest-900/60"
          className="!absolute object-contain"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="glass"
          size="md"
          onClick={onPrev}
          aria-label="Previous image"
          disabled={total <= 1}
          className="!border-white/12"
        >
          <ChevronLeftIcon className="h-4 w-4" /> Previous
        </Button>
        <p className="max-w-xl truncate text-sm text-cream-100/80">{item.caption ?? item.alt}</p>
        <Button
          type="button"
          variant="glass"
          size="md"
          onClick={onNext}
          aria-label="Next image"
          disabled={total <= 1}
          className="!border-white/12"
        >
          Next <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ---------------- Utils ----------------
function ViewToggle(): React.ReactElement {
  return (
    <div className="hidden sm:inline-flex items-center rounded-full border border-forest-900/10 bg-white/70 p-1">
      <button
        type="button"
        aria-pressed
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-forest-800 text-gold-300 shadow-soft"
      >
        <GridIcon className="h-3.5 w-3.5" /> Grid
      </button>
      <button
        type="button"
        aria-pressed={false}
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-forest-800 opacity-80 hover:opacity-100"
      >
        <SliderIcon className="h-3.5 w-3.5" /> Slider
      </button>
    </div>
  );
}

function labelForCategory(c: Exclude<GalleryCategory, 'all'>): string {
  return (
    {
      rooms: 'Rooms',
      building: 'Building',
      kitchen: 'Kitchen',
      terrace: 'Terrace',
      bathroom: 'Bathroom',
    } as const
  )[c];
}
