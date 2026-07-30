import { HeroSection } from '@/sections/HeroSection';
import { GallerySection } from '@/sections/GallerySection';
import { RoomsSection } from '@/sections/RoomsSection';
import {
  AmenitiesSection,
  LocationSection,
  ReviewsSection,
  ContactSection,
} from '@/sections/PlaceholderSections';

export default function HomePage(): React.ReactElement {
  return (
    <>
      {/* SECTION 1: HERO (also scroll anchor target id="home") */}
      <HeroSection />

      {/* Visual divider strip between hero & rooms: premium cream→cream gradient fade with gold accent */}
      <div
        aria-hidden
        className="relative h-px w-full overflow-hidden bg-cream-100"
      >
        <div className="mx-auto h-px w-2/3 max-w-4xl bg-section-divider opacity-80" />
      </div>

      {/* SECTION 4: OUR ROOMS (comes before gallery to match design reference's layout order) */}
      <RoomsSection />

      {/* SECTION 2: AMENITIES */}
      <div className="relative bg-gradient-to-b from-transparent via-cream-100/60 to-cream-50">
        <AmenitiesSection />
      </div>

      {/* SECTION 3: PHOTO GALLERY */}
      <div className="relative bg-gradient-to-b from-transparent via-cream-100/50 to-cream-100">
        <GallerySection />
      </div>

      {/* SECTION 5: LOCATION */}
      <div className="relative bg-cream-50">
        <LocationSection />
      </div>

      {/* SECTION 6: REVIEWS */}
      <div className="relative bg-gradient-to-b from-cream-50 via-cream-100/50 to-cream-100">
        <ReviewsSection />
      </div>

      {/* SECTION 7: CONTACT */}
      <div className="relative bg-cream-50">
        <ContactSection />
      </div>

      {/* Final soft fade that blends into FooterPlaceholder */}
      <div aria-hidden className="h-12 w-full bg-gradient-to-b from-cream-50 to-forest-950" />
    </>
  );
}
