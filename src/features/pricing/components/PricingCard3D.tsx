'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as UIImage } from '@/components/ui/image';
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { cn } from '@/lib/cn';
import type { Room, RoomStatus } from '@/types';

interface PricingCard3DProps {
  readonly room: Room;
  readonly className?: string;
}

const STATUS_BADGE_VARIANT: Record<RoomStatus, 'available' | 'filled' | 'maintenance'> = {
  available: 'available',
  filled: 'filled',
  maintenance: 'maintenance',
};

export function PricingCard3D({ room, className }: PricingCard3DProps): React.ReactElement {
  const { scrollTo } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });
  const rotY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);
  const rotX = useTransform(sy, [-0.5, 0.5], ['3deg', '-3deg']);
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

  const handleEnquire = (): void => {
    scrollTo('#contact', { offset: -80 });
  };

  const displayFeatures = room.features.slice(0, 4);
  const RupeeIcon = LucideIcons.IndianRupee;

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className={cn('relative w-full', className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateY: rotY,
          rotateX: rotX,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full"
      >
        <Card variant="glass" className="bg-cream-50/80 backdrop-blur-xl border border-white/70 shadow-soft p-4 sm:p-5">
          <div className="relative mb-4">
            <UIImage
              src={room.primaryImage.url}
              alt={room.primaryImage.alt}
              aspect="4/3"
              rounded="2xl"
              zoomOnHover
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              blurDataURL={room.primaryImage.blurDataURL}
            />
            <Badge
              variant={STATUS_BADGE_VARIANT[room.status]}
              size="sm"
              className="absolute right-3 top-3 backdrop-blur-md"
            >
              <span
                aria-hidden
                className={cn(
                  'inline-block h-1.5 w-1.5 rounded-full',
                  room.status === 'available' && 'bg-emerald-500',
                  room.status === 'filled' && 'bg-rose-500',
                  room.status === 'maintenance' && 'bg-amber-500',
                )}
              />
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-display text-base sm:text-lg text-forest-900 leading-tight">
                {room.name}
              </h4>
              <div className="flex shrink-0 items-baseline gap-0.5 text-forest-900">
                <RupeeIcon className="h-4 w-4" aria-hidden />
                <span className="font-display text-lg sm:text-xl leading-none">
                  {room.priceMonthly.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-ink-500 font-medium">/month</span>
              </div>
            </div>

            <ul role="list" className="grid grid-cols-1 gap-2">
              {displayFeatures.map((feature) => {
                const IconComponent =
                  (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[feature.iconKey] ??
                  LucideIcons.Check;
                return (
                  <li key={feature.id} className="flex items-center gap-2.5 text-sm text-ink-700">
                    <span
                      aria-hidden
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-forest-700/10 text-forest-700"
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate">{feature.label}</span>
                  </li>
                );
              })}
            </ul>

            <Button
              variant="forest"
              size="sm"
              onClick={handleEnquire}
              className="mt-1 w-full"
            >
              <LucideIcons.MessageSquare className="h-3.5 w-3.5" aria-hidden />
              Enquire About This Room
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
