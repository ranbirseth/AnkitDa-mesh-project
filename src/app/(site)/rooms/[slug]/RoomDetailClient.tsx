'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as UIImage } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/Reveal';
import type { Room } from '@/types';
import { cn } from '@/lib/cn';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const STATUS_BADGE: Record<string, 'available' | 'filled' | 'maintenance'> = {
  available: 'available',
  filled: 'filled',
  maintenance: 'maintenance',
};

export function RoomDetailClient({ room }: { room: Room }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const enquiryRef = useRef<HTMLElement>(null);

  const allImages = [
    room.primaryImage,
    ...(room.gallery || []),
  ].filter((img): img is NonNullable<typeof img> => Boolean(img));

  const scrollToEnquiry = () => {
    enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Back nav */}
      <div className="container-page pt-24 pb-4">
        <Link href="/#rooms" className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-900 transition-colors group">
          <LucideIcons.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Rooms
        </Link>
      </div>

      <div className="container-page pb-16 space-y-10">
        {/* Hero image + gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-3">
            {/* Main slider */}
            <div className="relative">
              <Swiper
                modules={[Navigation, Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                navigation
                loop={allImages.length > 1}
                className="rounded-2xl overflow-hidden shadow-elevate"
              >
                {allImages.map((img, i) => (
                  <SwiperSlide key={img.id || i}>
                    <button
                      type="button"
                      onClick={() => { setLightboxIdx(i); setLightboxOpen(true); }}
                      className="block w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/50"
                      aria-label={`View ${img.alt} fullscreen`}
                    >
                      <UIImage
                        src={img.url}
                        alt={img.alt}
                        aspect="4/3"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={90}
                        priority={i === 0}
                        rounded="2xl"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              <span className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 bg-forest-900/70 backdrop-blur text-cream-50 text-xs px-2.5 py-1 rounded-full">
                <LucideIcons.ZoomIn className="w-3 h-3" /> Click to zoom
              </span>
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <Swiper
                modules={[Thumbs, FreeMode]}
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                className="[&_.swiper-slide-thumb-active]:ring-2 [&_.swiper-slide-thumb-active]:ring-gold-500 [&_.swiper-slide-thumb-active]:rounded-lg"
              >
                {allImages.map((img, i) => (
                  <SwiperSlide key={img.id || i} className="cursor-pointer rounded-lg overflow-hidden">
                    <UIImage src={img.url} alt={img.alt} aspect="4/3" sizes="80px" rounded="lg" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Room info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-eyebrow text-gold-600 uppercase tracking-widest text-xs font-semibold">
                Ankit Da Mess
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge variant={STATUS_BADGE[room.status]} size="md">
                  <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1.5', room.status === 'available' ? 'bg-emerald-500' : room.status === 'filled' ? 'bg-rose-500' : 'bg-amber-500')} />
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </Badge>
                {room.featured && <Badge variant="gold-solid" size="sm"><LucideIcons.Sparkles className="w-3 h-3" /> Featured</Badge>}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 bg-forest-900 rounded-2xl px-6 py-4">
              <span className="text-gold-400 font-semibold text-sm flex items-center"><LucideIcons.IndianRupee className="w-4 h-4" /></span>
              <span className="font-display text-4xl font-bold text-cream-50">{room.priceMonthly.toLocaleString('en-IN')}</span>
              <span className="text-cream-200/60 text-sm">/month</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {room.capacityAdults && (
                <div className="flex flex-col items-center gap-1 rounded-xl bg-cream-100 border border-cream-200 p-3">
                  <LucideIcons.Users className="w-5 h-5 text-gold-600" />
                  <span className="text-xs font-semibold text-forest-800">{room.capacityAdults} Adult{room.capacityAdults !== 1 ? 's' : ''}</span>
                </div>
              )}
              {room.bedType && (
                <div className="flex flex-col items-center gap-1 rounded-xl bg-cream-100 border border-cream-200 p-3">
                  <LucideIcons.BedDouble className="w-5 h-5 text-gold-600" />
                  <span className="text-xs font-semibold text-forest-800">{room.bedType}</span>
                </div>
              )}
              {room.roomSizeSqFt && (
                <div className="flex flex-col items-center gap-1 rounded-xl bg-cream-100 border border-cream-200 p-3">
                  <LucideIcons.Maximize2 className="w-5 h-5 text-gold-600" />
                  <span className="text-xs font-semibold text-forest-800">{room.roomSizeSqFt} sq ft</span>
                </div>
              )}
            </div>

            <p className="text-forest-700 leading-relaxed">{room.shortDescription}</p>
            {room.description && <p className="text-forest-600 text-sm leading-relaxed">{room.description}</p>}

            <Button onClick={scrollToEnquiry} variant="gold" size="lg" className="w-full mt-2 shadow-gold">
              <LucideIcons.MessageSquare className="w-4 h-4" />
              Enquire About This Room
            </Button>
          </div>
        </div>

        {/* Features */}
        {room.features.length > 0 && (
          <Reveal variant="fadeUp">
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-xl text-forest-900 font-semibold mb-5">Room Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {room.features.map(f => {
                  const Icon = (LucideIcons as any)[f.iconKey] ?? LucideIcons.Check;
                  return (
                    <li key={f.id} className="flex items-center gap-3 rounded-xl bg-cream-50 border border-cream-100 px-4 py-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-700/10 text-forest-700">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-medium text-forest-800">{f.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        )}

        {/* Enquiry section */}
        <section
          ref={enquiryRef}
          id="room-enquiry"
          className="scroll-mt-24"
          aria-label="Enquire about this room"
        >
          <Reveal variant="fadeUp">
            <div className="relative rounded-3xl overflow-hidden bg-forest-900 border border-gold-500/10 p-6 sm:p-8 lg:p-10">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(ellipse 55% 40% at 100% 0%, rgba(198,156,46,0.12), transparent 60%)' }} />
              <div className="relative">
                <span className="text-eyebrow text-gold-400 uppercase tracking-widest text-xs font-semibold">Enquiry</span>
                <h2 className="font-display text-2xl sm:text-3xl text-cream-50 font-bold mt-2 mb-2">Interested in {room.name}?</h2>
                <p className="text-cream-200/70 mb-6">Fill out the form below and we&apos;ll get back to you shortly.</p>
                <RoomEnquiryForm room={room} />
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-forest-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <button onClick={() => setLightboxOpen(false)}
                className="absolute -top-12 right-0 text-cream-100/80 hover:text-cream-50 flex items-center gap-2 text-sm">
                <LucideIcons.X className="w-5 h-5" /> Close
              </button>
              <UIImage src={allImages[lightboxIdx]?.url || ''} alt={allImages[lightboxIdx]?.alt || ''}
                aspect="4/3" rounded="2xl" sizes="96vw" quality={90} />
              <div className="flex justify-between mt-3">
                <button onClick={() => setLightboxIdx(i => (i - 1 + allImages.length) % allImages.length)}
                  className="text-cream-100/70 hover:text-cream-50 flex items-center gap-2 text-sm">
                  <LucideIcons.ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-cream-200/50 text-sm">{lightboxIdx + 1} / {allImages.length}</span>
                <button onClick={() => setLightboxIdx(i => (i + 1) % allImages.length)}
                  className="text-cream-100/70 hover:text-cream-50 flex items-center gap-2 text-sm">
                  Next <LucideIcons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoomEnquiryForm({ room }: { room: Room }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          roomType: room.slug,
          message: form.message || undefined,
          source: 'room-detail-page',
          roomId: room.id,
          roomName: room.name,
          roomSlug: room.slug,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setDone(true);
    } catch {
      alert('Failed to send. Please WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <LucideIcons.CheckCircle className="w-8 h-8" />
      </div>
      <h3 className="font-display text-xl text-cream-50">Enquiry Sent!</h3>
      <p className="text-cream-200/70 max-w-md">We received your enquiry about <strong className="text-cream-50">{room.name}</strong>. We&apos;ll contact you within 15 minutes.</p>
      <Link href="/#rooms" className="text-gold-400 hover:text-gold-300 text-sm font-semibold">← Browse more rooms</Link>
    </div>
  );

  const inp = "w-full rounded-xl bg-forest-950/40 border border-white/10 text-cream-50 placeholder:text-cream-200/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500/50 transition-all";

  return (
    <form onSubmit={handle} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-cream-50/80 uppercase tracking-wide mb-1.5">Name *</label>
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inp} placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-cream-50/80 uppercase tracking-wide mb-1.5">Phone *</label>
        <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required className={inp} placeholder="+91 96145 01727" type="tel" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-cream-50/80 uppercase tracking-wide mb-1.5">Email</label>
        <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inp} placeholder="optional" type="email" />
      </div>
      <div className="bg-forest-950/30 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3">
        <LucideIcons.BedDouble className="w-5 h-5 text-gold-400 shrink-0" />
        <div>
          <p className="text-xs text-cream-200/50 uppercase tracking-wider">Selected Room</p>
          <p className="text-cream-50 font-semibold text-sm">{room.name}</p>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-cream-50/80 uppercase tracking-wide mb-1.5">Message</label>
        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className={inp + ' resize-y min-h-[100px]'} placeholder="Any specific requirements..." rows={3} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="gold" size="lg" className="w-full shadow-gold" disabled={submitting}>
          {submitting ? 'Sending...' : <><LucideIcons.Send className="w-4 h-4" /> Send Enquiry</>}
        </Button>
      </div>
    </form>
  );
}
