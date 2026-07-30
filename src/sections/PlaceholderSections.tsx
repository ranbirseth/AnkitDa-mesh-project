'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NAV_CONTACT_PHONE, NAV_CONTACT_WHATSAPP, NAV_CONTACT_EMAIL } from '@/constants';
import { Image as UIimage } from '@/components/ui/image';

// ================================================================
// Phase 1 Placeholder Sections
//
// These sections match the NAV_LINKS anchor targets so the navbar
// scroll-spy + nav link clicks have valid destinations.
// Full implementations scheduled for Phase 2 per the roadmap.
// ================================================================

const AMENITY_FEATURES = [
  { iconKey: 'Wifi', title: 'High-Speed WiFi', desc: '500 Mbps fibre leased line with backup 4G dongle.' },
  { iconKey: 'UtensilsCrossed', title: 'Home-Style Mess', desc: 'Veg & non-veg 4x daily menu prepared by in-house cook.' },
  { iconKey: 'Zap', title: '24×7 Power Backup', desc: 'Heavy-duty inverter + genset — never a dark moment.' },
  { iconKey: 'Droplets', title: '24×7 Water', desc: 'Borewell + municipal source, RO drinking water available.' },
  { iconKey: 'ShieldCheck', title: 'CCTV & Security', desc: 'Full campus coverage, biometric entry, caretaker on site.' },
  { iconKey: 'Shirt', title: 'Laundry Facility', desc: 'Washing machines available 24×7 on ground floor.' },
  { iconKey: 'Car', title: 'Bike Parking', desc: 'Covered two-wheeler parking with CCTV.' },
  { iconKey: 'Sun', title: 'Rooftop Terrace', desc: 'Open-air hangout with seating, perfect for studies & breaks.' },
] as const;

export function AmenitiesSection(): React.ReactElement {
  return (
    <SectionWrapper
      id="amenities"
      padding="md"
      eyebrow="Amenities"
      heading={
        <span>
          Everything You <span className="text-gold-600">Need to Live Well</span>
        </span>
      }
      subheading="Handpicked essentials for comfortable, hassle-free living — so you can focus on what matters."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AMENITY_FEATURES.map((f, i) => {
          const Icon =
            (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[f.iconKey] ??
            LucideIcons.CheckCircle2;
          return (
            <Reveal key={f.iconKey} variant="zoomIn" delay={0.05 * i}>
              <Card
                variant="glass"
                className="group/card relative flex h-full flex-col gap-3 overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span
                  aria-hidden
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/12 text-gold-600 transition-colors group-hover/card:bg-gold-500 group-hover/card:text-forest-900"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-[1.05rem] font-semibold text-forest-900 leading-tight">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-600">{f.desc}</p>
                <Badge variant="available" size="sm" className="mt-auto w-fit">
                  <LucideIcons.Check className="h-3 w-3" /> Included
                </Badge>
              </Card>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-10 flex justify-center">
        <Badge variant="gold" size="lg">
          <LucideIcons.Sparkles className="h-3.5 w-3.5" />
          Full amenities list with add-ons — Phase 2
        </Badge>
      </div>
    </SectionWrapper>
  );
}

export function LocationSection(): React.ReactElement {
  return (
    <SectionWrapper
      id="location"
      padding="md"
      eyebrow="Location"
      heading={
        <span>
          In the Heart of <span className="text-gold-600">Durgapur</span>
        </span>
      }
      subheading="Well-connected by road, minutes from colleges, offices, markets and the railway station."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <Reveal variant="fadeUp" className="lg:col-span-5">
          <div className="flex flex-col gap-5">
            <ul role="list" className="flex flex-col gap-4">
              {[
                {
                  iconKey: 'MapPin',
                  title: 'Address',
                  value: 'Ankit Da Mess, Bidhannagar, Durgapur, West Bengal 713212',
                },
                {
                  iconKey: 'TrainFront',
                  title: 'Nearest Railway',
                  value: 'Durgapur Junction (Station Code: DGR) — 5.2 km, 15 min auto',
                },
                {
                  iconKey: 'GraduationCap',
                  title: 'Nearby Colleges',
                  value: 'NIT Durgapur 2.1 km · BCET 1.8 km · Dr. B.C. Roy Engg. 3.4 km',
                },
                {
                  iconKey: 'Store',
                  title: 'Markets & Banks',
                  value: 'Bidhannagar Market 300 m · Axis/SBI/HDFC ATMs within 500 m',
                },
                {
                  iconKey: 'Stethoscope',
                  title: 'Medical Care',
                  value: 'Mission Hospital 1.4 km · Durgapur Lions 2.6 km',
                },
              ].map((row) => {
                const Icon =
                  (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[row.iconKey] ??
                  LucideIcons.MapPin;
                return (
                  <li key={row.title} className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-700/10 text-forest-700"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold-600">
                        {row.title}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-700 leading-relaxed">{row.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                variant="forest"
                size="md"
              >
                <a
                  href="https://maps.google.com/?q=Durgapur+West+Bengal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LucideIcons.Map className="h-4 w-4" /> Open in Google Maps
                </a>
              </Button>
              <Button asChild variant="outline" size="md">
                <a href={NAV_CONTACT_PHONE}>
                  <LucideIcons.Phone className="h-4 w-4" /> Get Directions via Call
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.1} className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-forest-900/8 shadow-elevate">
            <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200">
              <UIimage
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                alt="Aerial view of Durgapur city with green avenues and urban infrastructure"
                aspect="16/9"
                rounded="2xl"
                sizes="(max-width: 1024px) 100vw, 58vw"
                quality={80}
                classNameWrap="!rounded-none"
                className="!object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 sm:p-6">
                <div>
                  <Badge variant="glass-dark" size="sm">
                    <LucideIcons.MapPin className="h-3.5 w-3.5 text-gold-300" /> Bidhannagar · Durgapur
                  </Badge>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl text-cream-50 leading-tight">
                    Peaceful neighbourhood, 2 min from the main road.
                  </h3>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5 text-[0.75rem] font-semibold text-cream-50">
                  <span className="block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Google Maps view · Phase 2 embed
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

const REVIEW_DATA = [
  {
    name: 'Rohit Sharma',
    role: 'NIT Durgapur, B.Tech 3rd Year',
    rating: 5,
    text: 'Stayed for 2 years. Rooms are spacious, food is actually home-style and the caretaker is super helpful. WiFi never dies even during exam season.',
    avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=200&q=80',
    stay: 'Single Room · 2023–25',
  },
  {
    name: 'Priya Das',
    role: 'Software Engineer, TCS Durgapur',
    rating: 5,
    text: 'As a working woman I felt very safe here. CCTV, biometric entry, 24×7 caretaker. The terrace is my happy place after long work days.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    stay: 'Premium Room · 2024–Present',
  },
  {
    name: 'Ayan Choudhury',
    role: 'BCET Final Year',
    rating: 4,
    text: 'Affordable compared to other PGs nearby and way cleaner. Laundry + mess saves so much time. Only wish the gym upgrade comes sooner!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stay: 'Shared Room · 2022–24',
  },
] as const;

export function ReviewsSection(): React.ReactElement {
  return (
    <SectionWrapper
      id="reviews"
      padding="md"
      eyebrow="What Our Residents Say"
      heading={
        <span>
          Loved by <span className="text-gold-600">150+ Students & Professionals</span>
        </span>
      }
      subheading="Real feedback from real residents — over 4.8/5 average rating across Google and local listings."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {REVIEW_DATA.map((r, i) => (
          <Reveal key={r.name} variant="zoomIn" delay={0.06 * i}>
            <Card
              variant="elevated"
              className="relative flex h-full flex-col gap-5 p-6"
            >
              <div aria-hidden className="absolute right-5 top-5 font-display text-[3.5rem] leading-none text-gold-500/15 select-none">
                &ldquo;
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <LucideIcons.Star
                    key={idx}
                    className={idx < r.rating ? 'h-4 w-4 fill-gold-500 text-gold-500' : 'h-4 w-4 text-ink-300'}
                  />
                ))}
              </div>
              <p className="text-[0.95rem] leading-relaxed text-ink-700 text-pretty">
                {r.text}
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-forest-900/6 pt-4">
                <UIimage
                  src={r.avatar}
                  alt={`${r.name} — resident photo`}
                  aspect="1/1"
                  rounded="full"
                  sizes="64px"
                  classNameWrap="h-12 w-12 shrink-0"
                  className="!h-full !w-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[0.95rem] font-semibold text-forest-900 leading-tight truncate">
                    {r.name}
                  </p>
                  <p className="truncate text-[0.72rem] text-ink-500">{r.role}</p>
                  <p className="mt-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-gold-600">
                    {r.stay}
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function ContactSection(): React.ReactElement {
  return (
    <SectionWrapper
      id="contact"
      padding="md"
      eyebrow="Contact & Enquiry"
      heading={
        <span>
          Ready to <span className="text-gold-600">Book Your Room?</span>
        </span>
      }
      subheading="Call, WhatsApp or drop a message. We typically respond within 15 minutes during business hours."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal variant="fadeUp" className="lg:col-span-5 order-2 lg:order-1">
          <div className="glass-cream rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
            <h3 className="font-display text-h3 text-forest-900 leading-tight">
              Reach out directly
            </h3>
            <ul role="list" className="flex flex-col gap-4">
              <li>
                <a
                  href={NAV_CONTACT_PHONE}
                  className="group/c flex items-center gap-4 rounded-2xl border border-forest-900/8 bg-white p-4 transition-colors hover:border-gold-400/40 hover:bg-gold-500/5"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700/10 text-forest-700 transition-colors group-hover/c:bg-forest-700 group-hover/c:text-cream-50"
                  >
                    <LucideIcons.Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold-600">Call Us</p>
                    <p className="mt-0.5 font-display text-[1.1rem] font-semibold text-forest-900 leading-tight">
                      +91 98234 56789
                    </p>
                    <p className="text-xs text-ink-500">Mon – Sun · 7:00 AM – 11:00 PM</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={NAV_CONTACT_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/c flex items-center gap-4 rounded-2xl border border-forest-900/8 bg-white p-4 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/5"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover/c:bg-emerald-500 group-hover/c:text-white"
                  >
                    <LucideIcons.MessageCircle className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-emerald-600">WhatsApp</p>
                    <p className="mt-0.5 font-display text-[1.1rem] font-semibold text-forest-900 leading-tight">
                      Instant chat
                    </p>
                    <p className="text-xs text-ink-500">Preferred — fastest response</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={NAV_CONTACT_EMAIL}
                  className="group/c flex items-center gap-4 rounded-2xl border border-forest-900/8 bg-white p-4 transition-colors hover:border-gold-400/40 hover:bg-gold-500/5"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/12 text-gold-600 transition-colors group-hover/c:bg-gold-500 group-hover/c:text-forest-900"
                  >
                    <LucideIcons.Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold-600">Email</p>
                    <p className="mt-0.5 font-display text-[1.05rem] font-semibold text-forest-900 leading-tight break-all">
                      bookings@ankitdamess.in
                    </p>
                    <p className="text-xs text-ink-500">Full booking form — Phase 3</p>
                  </div>
                </a>
              </li>
            </ul>
            <div className="rounded-2xl border border-forest-900/8 bg-forest-900 p-5 text-cream-100/90">
              <div className="flex items-start gap-3">
                <LucideIcons.Clock className="mt-0.5 h-5 w-5 text-gold-300 shrink-0" />
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold text-cream-50">Visit by appointment</p>
                  <p className="mt-0.5 text-cream-100/80">
                    We offer in-person room tours with our caretaker. Book your slot on WhatsApp — same-day visits available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.1} className="lg:col-span-7 order-1 lg:order-2">
          <Card
            variant="elevated"
            className="relative overflow-hidden p-6 sm:p-8 lg:p-10"
          >
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-forest-600/10 blur-3xl" />
            <div className="relative">
              <Badge variant="gold-solid" size="sm" className="mb-4">
                <LucideIcons.Sparkles className="h-3 w-3" /> Phase 2 Preview
              </Badge>
              <h3 className="font-display text-h3 text-forest-900 leading-tight">
                Quick Enquiry Form
              </h3>
              <p className="mt-2 text-sm text-ink-600">
                This is a preview. The full form will go live in Phase 2 with email + WhatsApp confirmation.
                In the meantime, <a href={NAV_CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-600 hover:underline">message us on WhatsApp →</a>
              </p>

              <form
                onSubmit={(e): void => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.alert('Thanks! Please WhatsApp us instead for the fastest response.');
                  }
                }}
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <Field label="Full Name" placeholder="e.g. Rohit Sharma" />
                <Field label="Phone / WhatsApp" placeholder="+91 ..." />
                <Field label="Preferred Move-in Date" type="date" className="sm:col-span-2" />
                <div className="sm:col-span-2">
                  <label className="block text-[0.8rem] font-semibold text-forest-900 mb-1.5">
                    Interested Room Type
                  </label>
                  <select
                    className="w-full rounded-2xl border border-forest-900/10 bg-white px-4 py-3 text-sm text-forest-900 shadow-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 focus:outline-none transition"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a room…</option>
                    <option>Shared Room (₹2,500 / month)</option>
                    <option>Single Room (₹4,000 / month)</option>
                    <option>Room with Balcony (₹4,500 / month)</option>
                    <option>Premium Ensuite (₹5,000 / month)</option>
                    <option>Not sure / need help choosing</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[0.8rem] font-semibold text-forest-900 mb-1.5">
                    Anything else we should know?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Duration of stay, specific needs, references…"
                    className="w-full resize-none rounded-2xl border border-forest-900/10 bg-white px-4 py-3 text-sm text-forest-900 shadow-sm placeholder:text-ink-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 focus:outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" size="md" onClick={() => window.open(NAV_CONTACT_PHONE, '_self')}>
                    Or Call Instead
                  </Button>
                  <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto shadow-gold">
                    <LucideIcons.Send className="h-4 w-4" /> Send Enquiry (Preview)
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

function Field({
  label,
  placeholder,
  type = 'text',
  className,
}: {
  readonly label: string;
  readonly placeholder?: string;
  readonly type?: string;
  readonly className?: string;
}): React.ReactElement {
  return (
    <label className={className}>
      <span className="block text-[0.8rem] font-semibold text-forest-900 mb-1.5">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-forest-900/10 bg-white px-4 py-3 text-sm text-forest-900 shadow-sm placeholder:text-ink-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 focus:outline-none transition"
      />
    </label>
  );
}
