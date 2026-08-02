'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/Reveal';
import { roomsService, type IRoomsService } from '@/services';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { fadeUp } from '@/animations/variants';
import type { Room, RoomStatus } from '@/types';
import { PricingCard3D } from './PricingCard3D';

const STATUS_BADGE_VARIANT: Record<RoomStatus, 'available' | 'filled' | 'maintenance'> = {
  available: 'available',
  filled: 'filled',
  maintenance: 'maintenance',
};

const STATUS_DOT_CLASS: Record<RoomStatus, string> = {
  available: 'bg-emerald-500',
  filled: 'bg-rose-500',
  maintenance: 'bg-amber-500',
};

const fadeUpVariants: Variants = fadeUp(20, 0.5);

export function PricingSection(): React.ReactElement {
  const [rooms, setRooms] = React.useState<ReadonlyArray<Room>>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (roomsService as IRoomsService).getRooms(false, 12);
      if (mounted && result.success && result.data) {
        setRooms(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedRoom: Room | undefined = rooms[selectedIndex];

  const handleSelect = (index: number): void => {
    setSelectedIndex(index);
  };

const RupeeIcon = LucideIcons.IndianRupee;

  return (
    <section
      id="pricing"
      className="scroll-mt-28 w-full"
    >
      <Card
        variant="default"
        className={cn(
          'relative overflow-hidden bg-cream-50 border border-cream-100 rounded-3xl shadow-soft',
          'p-6 sm:p-8 lg:p-10 mx-auto max-w-full',
        )}
      >
        <Reveal variant="fadeUp" className="relative w-full">
          {loading ? (
            <PricingSkeleton />
          ) : rooms.length > 0 ? (
            <div className="flex flex-col items-start w-full">
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-600">
                  <span aria-hidden className="inline-block w-8 h-px bg-gold-500" />
                  ROOMS &amp; PRICING
                </span>
              </div>

              <h2 className="font-display text-h3 md:text-h2 text-forest-900 text-balance mb-2">
                Rooms &amp; Pricing
              </h2>

              <span
                aria-hidden
                className="block w-14 h-0.5 bg-gold-500 rounded-full mb-6"
              />

              <div className="w-full flex flex-col gap-5 md:grid md:grid-cols-12 md:gap-5">
                <div className="md:col-span-4 xl:col-span-5 w-full flex flex-col gap-2.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {rooms.slice(0, 4).map((room, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <motion.button
                          key={room.id}
                          type="button"
                          onClick={() => handleSelect(idx)}
                          aria-pressed={isSelected}
                          aria-label={`Select ${room.name}`}
                          initial={reduced ? false : 'hidden'}
                          animate="show"
                          variants={fadeUpVariants}
                          transition={reduced ? {} : { delay: idx * 0.06 }}
                          whileTap={reduced ? {} : { scale: 0.985 }}
                          className={cn(
                            'w-full rounded-2xl p-3 flex items-center justify-between transition-all duration-250 text-left',
                            isSelected
                              ? 'bg-forest-900 text-cream-50 shadow-soft ring-1 ring-gold-500/20'
                              : 'bg-transparent text-forest-900 hover:bg-forest-900/5',
                          )}
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span
                              aria-hidden
                              className={cn(
                                'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                                isSelected
                                  ? 'bg-gold-500/15 text-gold-400'
                                  : 'bg-forest-900/6 text-forest-700',
                              )}
                            >
                              <LucideIcons.BedDouble className="h-4 w-4" />
                            </span>
                            <span
                              className={cn(
                                'font-display text-sm sm:text-base truncate',
                                isSelected ? 'text-cream-50' : 'text-forest-900',
                              )}
                            >
                              {room.name}
                            </span>
                          </span>
                          <span className="flex items-center gap-2.5 shrink-0 ml-2">
                            <span
                              className={cn(
                                'flex items-baseline gap-0.5 text-xs sm:text-sm font-semibold',
                                isSelected ? 'text-gold-400' : 'text-forest-800',
                              )}
                            >
                              <RupeeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
                              <span>{room.priceMonthly.toLocaleString('en-IN')}</span>
                              <span
                                className={cn(
                                  'hidden sm:inline text-xs font-medium',
                                  isSelected ? 'text-cream-100/60' : 'text-ink-500',
                                )}
                              >
                                /mo
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className={cn(
                                'inline-block h-2 w-2 rounded-full ring-2',
                                STATUS_DOT_CLASS[room.status],
                                isSelected ? 'ring-forest-900/40' : 'ring-cream-50',
                              )}
                            />
                          </span>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className="md:col-span-8 xl:col-span-7 w-full min-h-0">
                  <AnimatePresence mode="wait" initial={false}>
                    {selectedRoom && (
                      <motion.div
                        key={selectedRoom.id}
                        layoutId={reduced ? undefined : 'pricing-selected'}
                        initial={reduced ? false : 'hidden'}
                        animate="show"
                        exit="hidden"
                        variants={fadeUpVariants}
                        className="w-full"
                      >
                        <div className="flex flex-col gap-5">
                          <PricingCard3D room={selectedRoom} />

                          <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-3 justify-between">
                              <h3 className="font-display text-xl sm:text-2xl md:text-h3 text-forest-900 leading-tight">
                                {selectedRoom.name}
                              </h3>
                              <Badge
                                variant={STATUS_BADGE_VARIANT[selectedRoom.status]}
                                size="md"
                              >
                                <span
                                  aria-hidden
                                  className={cn(
                                    'inline-block h-1.5 w-1.5 rounded-full',
                                    STATUS_DOT_CLASS[selectedRoom.status],
                                  )}
                                />
                                {selectedRoom.status.charAt(0).toUpperCase() +
                                  selectedRoom.status.slice(1)}
                              </Badge>
                            </div>

                            <ul
                              role="list"
                              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                            >
                              {selectedRoom.features.map((feature) => {
                                const IconComponent =
                                  (LucideIcons as unknown as Record<
                                    string,
                                    React.ComponentType<{ className?: string }>
                                  >)[feature.iconKey] ?? LucideIcons.Check;
                                return (
                                  <li
                                    key={feature.id}
                                    className="flex items-center gap-3 rounded-xl bg-cream-100/50 border border-cream-100 px-4 py-3 text-forest-800"
                                  >
                                    <span
                                      aria-hidden
                                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-700/10 text-forest-700"
                                    >
                                      <IconComponent className="h-4.5 w-4.5" />
                                    </span>
                                    <span className="text-sm font-medium leading-tight">
                                      {feature.label}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>

                            <Button
                              asChild
                              variant="forest"
                              size="lg"
                              className="mt-1 w-full"
                            >
                              <a href={`/rooms/${selectedRoom.slug}`}>
                                <LucideIcons.ExternalLink className="h-4.5 w-4.5" aria-hidden />
                                View Room Details
                              </a>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center w-full">
              <LucideIcons.AlertCircle className="h-10 w-10 text-ink-400" />
              <p className="font-display text-xl text-forest-900">Unable to load rooms</p>
              <p className="text-sm text-ink-500 max-w-md">
                Please refresh the page or try again later.
              </p>
            </div>
          )}
        </Reveal>
      </Card>
    </section>
  );
}

function PricingSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col items-start w-full gap-4">
      <Skeleton className="h-5 w-44 rounded-full bg-cream-200/70" />
      <Skeleton className="h-10 md:h-14 w-[460px] max-w-full rounded-2xl bg-cream-200/70" />
      <Skeleton className="h-1 w-14 rounded-full bg-gold-500/50" />

      <div className="w-full flex flex-col gap-5 md:grid md:grid-cols-12 md:gap-5 pt-2">
        <div className="md:col-span-4 xl:col-span-5 w-full flex flex-col gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full rounded-2xl p-3 flex items-center justify-between bg-cream-100/60"
            >
              <span className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-5 w-32 rounded-lg" />
              </span>
              <Skeleton className="h-5 w-20 rounded-lg" />
            </div>
          ))}
        </div>

        <div className="md:col-span-8 xl:col-span-7 w-full flex flex-col gap-5">
          <div className="rounded-2xl border border-white/70 bg-cream-50/80 p-4 sm:p-5 shadow-soft">
            <Skeleton className="w-full aspect-[4/3] rounded-2xl mb-4" />
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="h-5 w-5 rounded-md" />
                    <Skeleton className="h-4 w-48 rounded-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-9 w-full rounded-full mt-1" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <Skeleton className="h-8 w-56 rounded-lg" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-cream-100/50 border border-cream-100 px-4 py-3"
                >
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-4 w-40 rounded-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-full mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
