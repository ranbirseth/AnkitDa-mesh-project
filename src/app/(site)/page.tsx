import { HeroSection } from '@/sections/HeroSection';
import { GallerySection } from '@/sections/GallerySection';
import { RoomsSection } from '@/sections/RoomsSection';
import { VirtualTourSection } from '@/features/virtual-tour/components/VirtualTourSection';
import { WhyChooseUsSection } from '@/features/why-choose-us/components/WhyChooseUsSection';
import { AmenitiesSection } from '@/features/amenities/components/AmenitiesSection';
import { LocationSection } from '@/features/location/components/LocationSection';
import { PricingSection } from '@/features/pricing/components/PricingSection';
import { TestimonialsSection } from '@/features/testimonials/components/TestimonialsSection';
import { ContactSection } from '@/features/contact/components/ContactSection';
import { CTASection } from '@/features/cta/components/CTASection';
import { Container } from '@/components/Container';

export default function HomePage(): React.ReactElement {
  // 🔒 TEMPORARY WEBSITE PAYMENT LOCK
  // Before payment: true
  // After payment: false
  const SITE_LOCKED = false;

  // ===== PAYMENT PENDING PAGE =====
   // ===== PAYMENT PENDING PAGE =====
  if (SITE_LOCKED) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-black px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
              <svg
                className="h-8 w-8 text-amber-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.32 12.67A2 2 0 004.7 19.5h14.6a2 2 0 001.73-2.97L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-400">
              Website Activation
            </p>

            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-white">
              Deployment Payment Pending
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base md:text-lg leading-7 text-white/65">
              cx
            </p>
          </div>

          {/* Payment Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 md:p-7 shadow-2xl backdrop-blur-xl">
            {/* Services */}
            <div className="space-y-3">
              {/* Netlify */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">
                    N
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      Netlify Deployment
                    </h2>
                    <p className="text-sm text-white/45">
                      Website hosting & deployment
                    </p>
                  </div>
                </div>

                <span className="font-semibold text-white">
                  ₹499
                </span>
              </div>

              {/* Render */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">
                    R
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      Render Server
                    </h2>
                    <p className="text-sm text-white/45">
                      Backend & server infrastructure
                    </p>
                  </div>
                </div>

                <span className="font-semibold text-white">
                  ₹499
                </span>
              </div>

              {/* MongoDB */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">
                    M
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      MongoDB Database
                    </h2>
                    <p className="text-sm text-white/45">
                      Database & data infrastructure
                    </p>
                  </div>
                </div>

                <span className="font-semibold text-white">
                  ₹499
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/10" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">
                  Total deployment & infrastructure
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  ₹1,497
                </p>
              </div>

              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2">
                <span className="text-sm font-medium text-amber-300">
                  Payment Required
                </span>
              </div>
            </div>

            {/* Notice */}
            <div className="mt-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
              <p className="text-sm leading-6 text-white/65">
                Once the deployment payment is completed and confirmed,
                website access will be activated and the live website
                will become available.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/35">
            Deployment access is currently restricted until payment
            confirmation.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* ===== PHASE 1 — HERO (full-width, scroll anchor #home) ===== */}
      <HeroSection />

      <div
        aria-hidden
        className="relative h-px w-full overflow-hidden bg-cream-100"
      >
        <div className="mx-auto h-px w-2/3 max-w-4xl bg-section-divider opacity-80" />
      </div>

      {/* ===== PHASE 1 — ROOMS (full-width, scroll anchor #rooms) ===== */}
      <RoomsSection />

      {/* ===== PHASE 1 — GALLERY (full-width, scroll anchor #gallery) ===== */}
      <div className="relative bg-gradient-to-b from-transparent via-cream-100/50 to-cream-50">
        <GallerySection />
      </div>

      {/* ===== PHASE 2 — ASYMMETRIC EDITORIAL GRID ===== */}
      {/* Desktop: 12-col → MAIN (col-span-7 / xl:col-span-8 ≈ 60–66%) stacked
                    Why Choose Us → Location
                    SIDEBAR (col-span-5 / xl:col-span-4 ≈ 34–40%) stacked
                    Virtual Tour → Amenities
          Mobile:  1-col with order-n → VT → WCU → AM → LOC  */}
      <section
        aria-label="Ankit Da Mess features and location"
        id="phase-2"
        className="relative w-full bg-gradient-to-b from-cream-50 via-cream-100/40 to-cream-50 py-12 md:py-20 lg:py-24 scroll-mt-28"
      >
        <Container maxWidth="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
            {/* Mobile order #1 — Virtual Tour | Desktop: right sidebar top */}
            <div className="order-1 lg:order-2 lg:col-span-5 w-full h-auto">
              <VirtualTourSection />
            </div>

            {/* Mobile order #2 — Why Choose Us | Desktop: left main top */}
            <div className="order-2 lg:order-1 lg:col-span-7 lg:row-start-1 w-full">
              <WhyChooseUsSection />
            </div>

            {/* Mobile order #3 — Amenities | Desktop: right sidebar bottom */}
            <div className="order-3 lg:col-span-5 w-full">
              <AmenitiesSection />
            </div>

            {/* Mobile order #4 — Prime Location | Desktop: left main bottom */}
            <div className="order-4 lg:col-span-7 w-full">
              <LocationSection />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== PHASE 3 — ASYMMETRIC EDITORIAL GRID (continued) ===== */}
      {/* Desktop: 12-col → MAIN (col-span-7 / xl:col-span-8 ≈ 60–65%) Testimonials
                    SIDEBAR (col-span-5 / xl:col-span-4 ≈ 35–40%) Pricing → Contact
          Mobile:  single col → Pricing → Testimonials → Contact
          Final page sequence (per spec):
            Rooms → Virtual Tour → Why Choose Us → Amenities → Location →
            Rooms & Pricing → Testimonials → Contact → CTA → Footer
      */}
      <section
        aria-label="Rooms pricing, resident reviews and contact"
        id="phase-3"
        className="relative w-full bg-gradient-to-b from-cream-50 via-cream-100/50 to-cream-50 py-12 md:py-20 lg:py-24 scroll-mt-28"
      >
        <Container maxWidth="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
            {/* Mobile #1 — Rooms & Pricing | Desktop: right sidebar top */}
            <div
              id="pricing"
              className="order-1 lg:order-2 lg:col-span-5 w-full scroll-mt-28"
            >
              <PricingSection />
            </div>

            {/* Mobile #2 — Testimonials | Desktop: left main */}
            <div className="order-2 lg:order-1 lg:col-span-7 lg:row-start-1 w-full space-y-5 sm:space-y-6 lg:space-y-8">
              <TestimonialsSection />
            </div>

            {/* Mobile #3 — Contact | Desktop: right sidebar bottom */}
            <div
              id="contact-col"
              className="order-3 lg:col-span-5 w-full"
            >
              <ContactSection />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== PHASE 3 — FULL-WIDTH CTA ===== */}
      <div className="relative w-full bg-gradient-to-b from-cream-50 to-cream-100/70 pb-16 md:pb-20 lg:pb-24">
        <Container maxWidth="wide">
          <CTASection />
        </Container>
      </div>

      {/* Final soft fade that blends into Footer (in layout) */}
      <div
        aria-hidden
        className="h-12 w-full bg-gradient-to-b from-cream-100/70 via-forest-950/60 to-forest-950"
      />
    </>
  );
}