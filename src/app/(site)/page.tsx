import { HeroSection } from '@/sections/HeroSection';
import { GallerySection } from '@/sections/GallerySection';
import { RoomsSection } from '@/sections/RoomsSection';
import { VirtualTourSection } from '@/features/virtual-tour/components/VirtualTourSection';
import { WhyChooseUsSection } from '@/features/why-choose-us/components/WhyChooseUsSection';
import { AmenitiesSection } from '@/features/amenities/components/AmenitiesSection';
import { LocationSection } from '@/features/location/components/LocationSection';
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
      {/* Desktop: 12-col → MAIN (col-span-7 / xl:col-span-8 ≈ 60–66%) stacked with
                    Why Choose Us → Location
                    SIDEBAR (col-span-5 / xl:col-span-4 ≈ 34–40%) stacked with
                    Virtual Tour → Amenities
          Mobile:  1-col with order-n → VT → WCU → AM → LOC  */}
      <section
        aria-label="Ankit Da Mess features and location"
        id="phase-2"
        className="relative w-full bg-gradient-to-b from-cream-50 via-cream-100/40 to-cream-50 py-14 md:py-20 lg:py-24 scroll-mt-28"
      >
        <Container maxWidth="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
            {/* Mobile order #1 — Virtual Tour  (starts on top)
                Desktop order #2 — right sidebar top  */}
            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4 xl:col-start-9 w-full h-auto">
              <VirtualTourSection />
            </div>

            {/* Mobile order #2 — Why Choose Us
                Desktop order #1 — left main top, takes full row-span height next to VT+AM */}
            <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8 xl:col-start-1 w-full">
              <WhyChooseUsSection />
            </div>

            {/* Mobile order #3 — Amenities
                Desktop order #3 — right sidebar bottom, below Virtual Tour */}
            <div className="order-3 lg:order-3 lg:col-span-5 xl:col-span-4 xl:col-start-9 w-full">
              <AmenitiesSection />
            </div>

            {/* Mobile order #4 — Prime Location
                Desktop order #4 — left main bottom, below Why Choose Us */}
            <div className="order-4 lg:order-4 lg:col-span-7 xl:col-span-8 xl:col-start-1 w-full">
              <LocationSection />
            </div>
          </div>
        </Container>
      </section>

      {/* Final soft fade that blends into FooterPlaceholder */}
      <div aria-hidden className="h-12 w-full bg-gradient-to-b from-cream-50 to-forest-950" />
    </>
  );
}
