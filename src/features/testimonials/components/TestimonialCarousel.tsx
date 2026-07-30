'use client';

import * as React from 'react';
import { ChevronsLeft as ChevronLeftIcon, ChevronsRight as ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  Keyboard,
  FreeMode,
} from 'swiper/modules';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import type { Testimonial } from '@/types';
import { TestimonialCard } from './TestimonialCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

interface TestimonialCarouselProps {
  readonly items: ReadonlyArray<Testimonial>;
  readonly autoplay?: boolean;
}

export function TestimonialCarousel({
  items,
  autoplay = false,
}: TestimonialCarouselProps): React.ReactElement {
  const reduced = usePrefersReducedMotion();
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  const shouldLoop = items.length >= 6;
  const autoplayEnabled = !reduced && autoplay;
  const speed = reduced ? 800 : 500;

  return (
    <div className="relative w-full">
      <div className="hidden md:block">
        <Button
          ref={prevRef}
          type="button"
          variant="glass"
          size="icon"
          aria-label="Previous testimonial"
          className={cn(
            'testimonials-prev',
            'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10',
          )}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <Button
          ref={nextRef}
          type="button"
          variant="glass"
          size="icon"
          aria-label="Next testimonial"
          className={cn(
            'testimonials-next',
            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10',
          )}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, Keyboard, FreeMode]}
        spaceBetween={20}
        loop={shouldLoop}
        slidesPerView={1}
        speed={speed}
        breakpoints={{
          640: { slidesPerView: 1.1, spaceBetween: 18 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 2.8, spaceBetween: 22 },
          1280: { slidesPerView: 3, spaceBetween: 24 },
        }}
        pagination={{
          el: '.testimonial-pagination',
          clickable: true,
          dynamicBullets: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        autoplay={
          autoplayEnabled
            ? {
                delay: 4500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
            : false
        }
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        freeMode={!reduced}
        a11y={{
          prevSlideMessage: 'Previous testimonial',
          nextSlideMessage: 'Next testimonial',
        }}
        className="!overflow-visible [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:!h-auto !pb-14 md:!px-8"
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
      >
        {items.map((testimonial, idx) => (
          <SwiperSlide key={testimonial.id} className="!flex !items-stretch">
            <div
              className={cn(
                'w-full h-full',
                idx === 0 && 'md:ml-1',
                idx === items.length - 1 && 'md:mr-1',
              )}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="testimonial-pagination flex items-center justify-center gap-2 mt-2">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .testimonial-pagination .swiper-pagination-bullet {
                width: 8px;
                height: 8px;
                border-radius: 9999px;
                background: rgba(34, 54, 38, 0.15);
                opacity: 1;
                transition: all 0.3s ease;
              }
              .testimonial-pagination .swiper-pagination-bullet-active {
                background: #C69C2E;
                width: 28px;
              }
              .testimonial-pagination .swiper-pagination-bullet:not(.swiper-pagination-bullet-active) {
                cursor: pointer;
              }
            `,
          }}
        />
      </div>
    </div>
  );
}
