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
      <div aria-hidden className="h-12 w-full bg-gradient-to-b from-cream-100/70 via-forest-950/60 to-forest-950" />
    </>
  );
}
