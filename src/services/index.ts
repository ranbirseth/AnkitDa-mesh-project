import type {
  GalleryCategory,
  GalleryItem,
  HeroAmenityChip,
  HeroData,
  LinkCTA,
  MediaAsset,
  Room,
  RoomFeature,
  ServiceResult,
  VirtualTourData,
  WhyChooseUsData,
  WhyChooseUsFeature,
  Amenity,
  LocationData,
  NearbyPlace,
  TestimonialsData,
  Testimonial,
  ContactInfoData,
  ContactSubmissionOutput,
  CTAData,
  FooterData,
} from '@/types';
import { HERO_AMENITY_CHIPS } from '@/constants';

// ================================================================
// Service Layer — Abstractions for data fetching.
//
// Phase 1: MOCK in-memory implementation (no network required).
// Phase 4: Swap to real REST/MongoDB implementations with same interface.
// ================================================================

export interface IHeroService {
  getHero(): Promise<ServiceResult<HeroData>>;
}
export interface IGalleryService {
  getGallery(category?: GalleryCategory, limit?: number): Promise<ServiceResult<ReadonlyArray<GalleryItem>>>;
}
export interface IRoomsService {
  getRooms(featuredOnly?: boolean, limit?: number): Promise<ServiceResult<ReadonlyArray<Room>>>;
}
export interface IVirtualTourService {
  getVirtualTour(): Promise<ServiceResult<VirtualTourData>>;
}
export interface IWhyChooseUsService {
  getWhyChooseUs(): Promise<ServiceResult<WhyChooseUsData>>;
}
export interface IAmenitiesService {
  getAmenities(activeOnly?: boolean, limit?: number): Promise<ServiceResult<ReadonlyArray<Amenity>>>;
}
export interface ILocationService {
  getLocation(): Promise<ServiceResult<LocationData>>;
}
export interface ITestimonialsService {
  getTestimonials(activeOnly?: boolean, limit?: number): Promise<ServiceResult<TestimonialsData>>;
}
export interface IContactService {
  getContactInfo(): Promise<ServiceResult<ContactInfoData>>;
  submitContact(
    submission: ContactSubmissionOutput,
  ): Promise<ServiceResult<{ submissionId: string }>>;
}
export interface ICTAService {
  getCTA(): Promise<ServiceResult<CTAData>>;
}
export interface IFooterService {
  getFooter(): Promise<ServiceResult<FooterData>>;
}

// ------------------------------ Mock Media ------------------------------

const HERO_BG: MediaAsset = {
  id: 'hero-bg-1',
  url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785466473/ChatGPT_Image_Jul_31_2026_08_23_55_AM_bxyp4o.png',
  alt: 'Ankit Da Mess — guest house building exterior, Fuljhore Rabindra Pally Durgapur',
  width: 1748,
  height: 899,
  blurDataURL:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAASABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD4MhN8g6tQ1/9k=',
};

const ROOM_FEATURE_SET: Record<string, RoomFeature> = {
  furnished: { id: 'f-furn', iconKey: 'Bed', label: 'Furnished Room' },
  study: { id: 'f-study', iconKey: 'BookOpen', label: 'Study Table & Chair' },
  cupboard: { id: 'f-cup', iconKey: 'Archive', label: 'Cupboard' },
  vent: { id: 'f-vent', iconKey: 'Sun', label: 'Natural Light & Ventilation' },
  attached: { id: 'f-bath', iconKey: 'Bath', label: 'Attached Bathroom' },
  ac: { id: 'f-ac', iconKey: 'Wind', label: 'Air Conditioning' },
};

function buildRoom(
  id: string,
  slug: string,
  name: string,
  price: number,
  imageUrl: string,
  imageAlt: string,
  featureKeys: ReadonlyArray<keyof typeof ROOM_FEATURE_SET>,
  extra: Partial<Room> = {},
): Room {
  return {
    id,
    slug,
    name,
    shortDescription: 'Comfortable spaces designed for your peace and productivity.',
    description: extra.description,
    priceMonthly: price,
    currency: 'INR',
    status: extra.status ?? 'available',
    featured: extra.featured ?? true,
    capacityAdults: extra.capacityAdults ?? 1,
    bedType: extra.bedType,
    roomSizeSqFt: extra.roomSizeSqFt ?? 160,
    primaryImage: {
      id: `${id}-img-1`,
      url: imageUrl,
      alt: imageAlt,
      width: 1200,
      height: 800,
    },
    features: featureKeys.map((k) => ROOM_FEATURE_SET[k]!).filter(Boolean),
  };
}

const SINGLE_ROOM = buildRoom(
  'r-single-01',
  'single-room',
  'Single Room',
  4000,
  'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467450/46529ff5-67a3-468f-a642-10ee011c6be4_yl8jrh.png',
  'Single room interior at Ankit Da Mess, Fuljhore Rabindra Pally Durgapur',
  ['furnished', 'study', 'cupboard', 'vent'],
  { bedType: 'Single', capacityAdults: 1, roomSizeSqFt: 140 },
);

const SHARED_ROOM = buildRoom(
  'r-shared-01',
  'shared-room',
  'Shared Room',
  2500,
  'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467561/4d2cb641-df73-4c72-839a-f986bbb28075_jcyplk.png',
  'Shared room at Ankit Da Mess guest house Durgapur',
  ['furnished', 'study', 'cupboard', 'vent'],
  { bedType: 'Twin', capacityAdults: 2, roomSizeSqFt: 180 },
);

const BALCONY_ROOM = buildRoom(
  'r-balcony-01',
  'room-with-balcony',
  'Room with Balcony',
  4500,
  'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467620/b04218a2-42e6-4838-a5dd-00ed18372812_jbngub.png',
  'Room with balcony at Ankit Da Mess guest house Durgapur',
  ['furnished', 'study', 'cupboard', 'vent', 'ac'],
  { bedType: 'Double', capacityAdults: 1, roomSizeSqFt: 200, status: 'available' },
);

const PREMIUM_ROOM = buildRoom(
  'r-premium-01',
  'premium-room',
  'Premium Room',
  5000,
  'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467729/d9267cbc-0277-4dd9-82c1-637bbe3611d8_cc599i.png',
  'Premium room at Ankit Da Mess guest house Durgapur',
  ['furnished', 'study', 'cupboard', 'vent', 'attached', 'ac'],
  { bedType: 'Double', capacityAdults: 2, roomSizeSqFt: 240, status: 'available' },
);

const MOCK_ROOMS: ReadonlyArray<Room> = [
  SINGLE_ROOM,
  SHARED_ROOM,
  BALCONY_ROOM,
  PREMIUM_ROOM,
];

// ------------------------------ Mock Gallery ------------------------------

const GALLERY_IMAGES: ReadonlyArray<{
  id: string;
  category: Exclude<GalleryCategory, 'all'>;
  title: string;
  alt: string;
  url: string;
  featured?: boolean;
  relatedRoomId?: string;
}> = [
  // ---- ROOMS (5 images) ----
  {
    id: 'g-r-1',
    category: 'rooms',
    title: 'Room — View 1',
    alt: 'Room interior at Ankit Da Mess guest house, Fuljhore Rabindra Pally Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467450/46529ff5-67a3-468f-a642-10ee011c6be4_yl8jrh.png',
    relatedRoomId: 'r-single-01',
    featured: true,
  },
  {
    id: 'g-r-2',
    category: 'rooms',
    title: 'Room — View 2',
    alt: 'Comfortable room at Ankit Da Mess PG and guest house Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467561/4d2cb641-df73-4c72-839a-f986bbb28075_jcyplk.png',
    relatedRoomId: 'r-shared-01',
    featured: true,
  },
  {
    id: 'g-r-3',
    category: 'rooms',
    title: 'Room — View 3',
    alt: 'Well-furnished room at Ankit Da Mess Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467620/b04218a2-42e6-4838-a5dd-00ed18372812_jbngub.png',
    relatedRoomId: 'r-balcony-01',
  },
  {
    id: 'g-r-4',
    category: 'rooms',
    title: 'Room — View 4',
    alt: 'Spacious room with natural light at Ankit Da Mess Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467729/d9267cbc-0277-4dd9-82c1-637bbe3611d8_cc599i.png',
    relatedRoomId: 'r-premium-01',
  },
  {
    id: 'g-r-5',
    category: 'rooms',
    title: 'Room — View 5',
    alt: 'Clean and comfortable room at Ankit Da Mess guest house Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467772/b7c45822-9b0c-4189-8e44-4f755345ac09_xjpaiz.png',
    relatedRoomId: 'r-single-01',
  },
  // ---- KITCHEN (1 image) ----
  {
    id: 'g-k-1',
    category: 'kitchen',
    title: 'Kitchen',
    alt: 'Fully equipped kitchen at Ankit Da Mess guest house Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785466943/25dbb07f-9b14-453c-9427-5b06f64664c6_jlyp9k.png',
    featured: true,
  },
  // ---- BATHROOM (1 image) ----
  {
    id: 'g-bt-1',
    category: 'bathroom',
    title: 'Bathroom',
    alt: 'Clean and modern bathroom at Ankit Da Mess guest house Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467134/439eb324-8fec-4d71-8df4-5868c19f5599_l3iwuv.png',
    featured: true,
  },
  // ---- BUILDING (2 images) ----
  {
    id: 'g-b-1',
    category: 'building',
    title: 'Building — Front View',
    alt: 'Ankit Da Mess building exterior — Fuljhore Rabindra Pally Durgapur 713206',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785466819/bb1241e0-e3b1-44b2-b951-06320d537cd6_s6vkov.png',
    featured: true,
  },
  {
    id: 'g-b-2',
    category: 'building',
    title: 'Building — Side View',
    alt: 'Ankit Da Mess guest house building exterior Durgapur West Bengal',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785466698/55943dbb-30b0-4d7d-b225-ebff634c22c2_ynzk8b.png',
  },
  // ---- BUILDING — General (1 image) ----
  {
    id: 'g-b-3',
    category: 'building',
    title: 'Ankit Da Mess — Common Area',
    alt: 'Common area and property of Ankit Da Mess guest house, Fuljhore Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785510272/ankit-da-mess/general/aqmahowmwfbpmy6emw99.png',
    featured: true,
  },
  // ---- TERRACE (3 images) ----
  {
    id: 'g-t-1',
    category: 'terrace',
    title: 'Terrace — View 1',
    alt: 'Rooftop terrace at Ankit Da Mess guest house Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467352/d8e87d31-1c08-4267-bc11-7789addf4e8d_jq9aqx.png',
    featured: true,
  },
  {
    id: 'g-t-2',
    category: 'terrace',
    title: 'Terrace — View 2',
    alt: 'Open terrace area at Ankit Da Mess Durgapur for relaxation',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467308/0ae219a8-afd3-46fa-8207-4d0b9623b77e_gatmks.png',
  },
  {
    id: 'g-t-3',
    category: 'terrace',
    title: 'Terrace — View 3',
    alt: 'Terrace with open sky at Ankit Da Mess guest house Durgapur',
    url: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785467243/79d3d15f-c691-4d2c-9de7-82022155fc8b_sp0vmc.png',
  },
];

const GALLERY_IMAGES_PORTRAIT_IDS = ['g-t-1', 'g-t-2', 'g-t-3'];

const MOCK_GALLERY: ReadonlyArray<GalleryItem> = GALLERY_IMAGES.map((img) => ({
  id: img.id,
  title: img.title,
  alt: img.alt,
  category: img.category,
  featured: img.featured,
  relatedRoomId: img.relatedRoomId,
  image: {
    id: `${img.id}-media`,
    url: img.url,
    alt: img.alt,
    width: GALLERY_IMAGES_PORTRAIT_IDS.includes(img.id) ? 900 : 1200,
    height: GALLERY_IMAGES_PORTRAIT_IDS.includes(img.id) ? 1200 : 900,
  },
}));

// ------------------------------ Mock Hero ------------------------------

const AMENITIES: ReadonlyArray<HeroAmenityChip> = HERO_AMENITY_CHIPS.map((chip) => ({
  id: chip.id,
  iconKey: chip.iconKey,
  title: chip.title,
  subtitle: chip.subtitle,
}));

const PRIMARY_CTA: LinkCTA = {
  text: 'Enquire Now',
  href: '#contact',
  external: false,
};
const WHATSAPP_CTA: LinkCTA = {
  text: 'WhatsApp',
  href: 'https://wa.me/919614501727?text=Hi%20Ankit%20Da%20Mess%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability',
  external: true,
};
const CALL_CTA: LinkCTA = {
  text: 'Call Now',
  href: 'tel:+919614501727',
  external: true,
};

const MOCK_HERO: HeroData = {
  id: 'hero-main',
  eyebrow: 'Comfort  ·  Safety  ·  Affordability',
  heading: 'A Comfortable',
  headingAccent: 'Home Away\nFrom Home',
  subHeading:
    'Spacious rooms, modern amenities and a peaceful environment for students & working professionals.',
  primaryCTA: PRIMARY_CTA,
  secondaryCTA: WHATSAPP_CTA,
  tertiaryCTA: CALL_CTA,
  backgroundMedia: HERO_BG,
  posterImage: HERO_BG,
  amenitiesStrip: AMENITIES,
};

// ------------------------------ Service Implementation ------------------------------

class MockHeroService implements IHeroService {
  async getHero(): Promise<ServiceResult<HeroData>> {
    await delay(60);
    return { success: true, data: MOCK_HERO };
  }
}

class MockGalleryService implements IGalleryService {
  async getGallery(
    category?: GalleryCategory,
    limit = 50,
  ): Promise<ServiceResult<ReadonlyArray<GalleryItem>>> {
    await delay(40);
    let items = MOCK_GALLERY;
    if (category && category !== 'all') {
      items = items.filter((g) => g.category === category);
    }
    return { success: true, data: items.slice(0, limit), meta: { total: items.length } };
  }
}

class MockRoomsService implements IRoomsService {
  async getRooms(
    featuredOnly = false,
    limit = 12,
  ): Promise<ServiceResult<ReadonlyArray<Room>>> {
    await delay(50);
    const items = featuredOnly ? MOCK_ROOMS.filter((r) => r.featured) : MOCK_ROOMS;
    return { success: true, data: items.slice(0, limit), meta: { total: items.length } };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------ Phase 2 MOCK DATA ------------------------------

const MOCK_VIRTUAL_TOUR: VirtualTourData = {
  id: 'vt-main',
  enabled: true,
  title: 'Take a Virtual Tour',
  description:
    'Explore every corner of Ankit Da Mess from the comfort of your home. A real walkthrough of our rooms, common areas, and property.',
  posterUrl:
    'https://res.cloudinary.com/dyc33dchn/image/upload/v1785466473/ChatGPT_Image_Jul_31_2026_08_23_55_AM_bxyp4o.png',
  posterAlt:
    'Ankit Da Mess guest house — Fuljhore, Rabindra Pally, Durgapur',
  posterWidth: 1748,
  posterHeight: 899,
  videoUrl: 'https://res.cloudinary.com/dyc33dchn/video/upload/v1785467893/WhatsApp_Video_2026-07-29_at_9.43.21_AM_dju0lt.mp4',
  ctaText: 'Contact Us',
  ctaHref: '#contact',
  supportingText:
    'Real footage of Ankit Da Mess — Fuljhore, Rabindra Pally, Durgapur 713206.',
  panorama: false,
};

const MOCK_WHY_CHOOSE_FEATURES: ReadonlyArray<WhyChooseUsFeature> = [
  {
    id: 'wcu-1',
    iconKey: 'Wallet2',
    title: 'Affordable Pricing',
    description:
      'Pocket-friendly rates for students and working professionals — no hidden fees, transparent billing every month.',
    sortOrder: 0,
    active: true,
  },
  {
    id: 'wcu-2',
    iconKey: 'ShieldCheck',
    title: 'Trusted & Safe',
    description:
      'A secure and friendly environment you can rely on. CCTV, caretaker on-site, and verified residents only.',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'wcu-3',
    iconKey: 'MapPin',
    title: 'Best Location',
    description:
      'Walking distance from colleges, markets & transport. Durgapur\u2019s most convenient residential spot.',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'wcu-4',
    iconKey: 'Heart',
    title: 'Home Like Comfort',
    description:
      'Homely food, clean rooms and peaceful atmosphere. Every small detail designed to feel like home.',
    sortOrder: 3,
    active: true,
  },
];

const MOCK_WHY_CHOOSE: WhyChooseUsData = {
  id: 'wcu-main',
  heading: 'Why Choose Ankit Da Mess?',
  subheading:
    'More than a PG — a community built for comfort, safety, and productivity.',
  features: MOCK_WHY_CHOOSE_FEATURES,
};

const MOCK_AMENITIES: ReadonlyArray<Amenity> = [
  { id: 'am-1', name: 'High-Speed WiFi', iconKey: 'Wifi', description: 'Fiber broadband, 100+ Mbps', category: 'standard', sortOrder: 0, active: true },
  { id: 'am-2', name: '24×7 Water Supply', iconKey: 'Droplets', description: 'Borewell + municipal backup', category: 'standard', sortOrder: 1, active: true },
  { id: 'am-3', name: 'Electricity Backup', iconKey: 'Zap', description: 'Inverter for lights & fans', category: 'standard', sortOrder: 2, active: true },
  { id: 'am-4', name: 'Home Style Food', iconKey: 'UtensilsCrossed', description: 'Veg & Non-Veg daily menu', category: 'lifestyle', sortOrder: 3, active: true },
  { id: 'am-5', name: 'CCTV Security', iconKey: 'ShieldCheck', description: '24/7 cameras on all floors', category: 'security', sortOrder: 4, active: true },
  { id: 'am-6', name: 'Daily Cleaning', iconKey: 'Sparkles', description: 'Room & common area housekeeping', category: 'standard', sortOrder: 5, active: true },
  { id: 'am-7', name: 'Prime Location', iconKey: 'MapPin', description: 'Near colleges & main road', category: 'lifestyle', sortOrder: 6, active: true },
  { id: 'am-8', name: 'Peaceful Environment', iconKey: 'MoonStar', description: 'Study-friendly, low-noise zone', category: 'lifestyle', sortOrder: 7, active: true },
];

const MOCK_NEARBY: ReadonlyArray<NearbyPlace> = [
  { id: 'np-1', name: 'Durgapur Medical College', iconKey: 'Stethoscope', category: 'medical', distanceKm: 1.2, walkingMinutes: 15, active: true },
  { id: 'np-2', name: 'Engineering College', iconKey: 'GraduationCap', category: 'education', distanceKm: 2.0, walkingMinutes: 25, active: true },
  { id: 'np-3', name: 'Bus Stand', iconKey: 'BusFront', category: 'transport', distanceKm: 1.5, walkingMinutes: 18, active: true },
  { id: 'np-4', name: 'Market', iconKey: 'Store', category: 'market', distanceKm: 0.5, walkingMinutes: 6, active: true },
  { id: 'np-5', name: 'ATM', iconKey: 'Landmark', category: 'other', distanceKm: 0.3, walkingMinutes: 4, active: true },
  { id: 'np-6', name: 'Pharmacy', iconKey: 'Pill', category: 'medical', distanceKm: 0.4, walkingMinutes: 5, active: true },
];

const MOCK_LOCATION: LocationData = {
  id: 'loc-main',
  addressLine1: 'Fuljhore, Rabindra Pally',
  addressLine2: '',
  city: 'Durgapur',
  state: 'West Bengal',
  postalCode: '713206',
  country: 'India',
  latitude: 23.5204,
  longitude: 87.3119,
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=Fuljhore+Rabindra+Pally+Durgapur+713206&output=embed&z=15',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Fuljhore+Rabindra+Pally+Durgapur+713206+West+Bengal',
  nearbyPlaces: MOCK_NEARBY,
  heading: 'Prime Location',
  subheading:
    'Nestled in the heart of Durgapur — minutes from colleges, markets, and everything you need.',
};

// ------------------------------ Phase 2 Mock Classes ------------------------------

class MockVirtualTourService implements IVirtualTourService {
  async getVirtualTour(): Promise<ServiceResult<VirtualTourData>> {
    await delay(55);
    return { success: true, data: MOCK_VIRTUAL_TOUR };
  }
}

class MockWhyChooseUsService implements IWhyChooseUsService {
  async getWhyChooseUs(): Promise<ServiceResult<WhyChooseUsData>> {
    await delay(50);
    return { success: true, data: MOCK_WHY_CHOOSE };
  }
}

class MockAmenitiesService implements IAmenitiesService {
  async getAmenities(
    activeOnly = true,
    limit = 50,
  ): Promise<ServiceResult<ReadonlyArray<Amenity>>> {
    await delay(45);
    const items = activeOnly ? MOCK_AMENITIES.filter((a) => a.active) : MOCK_AMENITIES;
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
    return { success: true, data: sorted.slice(0, limit), meta: { total: sorted.length } };
  }
}

class MockLocationService implements ILocationService {
  async getLocation(): Promise<ServiceResult<LocationData>> {
    await delay(55);
    return { success: true, data: MOCK_LOCATION };
  }
}

// ------------------------------ Mock Testimonials ------------------------------

const MOCK_TESTIMONIALS_ITEMS: ReadonlyArray<Testimonial> = [
  {
    id: 't-1',
    reviewerName: 'Rahul',
    reviewerRole: 'Engineering Student',
    reviewerInitials: 'RS',
    rating: 5,
    content:
      'A perfectly studied friendly environment, good food and helpful management.',
    source: 'direct',
    createdAt: '2026-03-01',
    active: true,
    sortOrder: 0,
  },
  {
    id: 't-2',
    reviewerName: 'Saurav',
    reviewerRole: 'Working Professional',
    reviewerInitials: 'SG',
    rating: 5,
    content:
      'I am staying here for 6 months. Everything is well managed. Feels like home.',
    source: 'direct',
    createdAt: '2026-02-18',
    active: true,
    sortOrder: 1,
  },
  {
    id: 't-3',
    reviewerName: 'Amit',
    reviewerRole: 'B.Tech Student',
    reviewerInitials: 'AK',
    rating: 5,
    content:
      'Clean rooms, hot water and 24x7 electricity. Best PG in this area.',
    source: 'direct',
    createdAt: '2026-01-28',
    active: true,
    sortOrder: 2,
  },
];

const MOCK_TESTIMONIALS: TestimonialsData = {
  id: 'testimonials-main',
  heading: 'What Our Residents Say',
  eyebrow: 'TESTIMONIALS',
  subheading:
    'Real stories from students and professionals who call Ankit Da Mess home.',
  items: MOCK_TESTIMONIALS_ITEMS,
};

class MockTestimonialsService implements ITestimonialsService {
  async getTestimonials(
    activeOnly = true,
    limit = 20,
  ): Promise<ServiceResult<TestimonialsData>> {
    await delay(40);
    const items = [...MOCK_TESTIMONIALS.items]
      .filter((t) => (activeOnly ? t.active !== false : true))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .slice(0, limit);
    return {
      success: true,
      data: { ...MOCK_TESTIMONIALS, items },
      meta: { total: items.length },
    };
  }
}

// ------------------------------ Mock Contact ------------------------------

const MOCK_CONTACT_INFO: ContactInfoData = {
  id: 'contact-main',
  heading: 'Get In Touch',
  eyebrow: 'CONTACT',
  subheading:
    'Have a question about availability or pricing? Send us a message or call us directly.',
  phonePrimary: '+91 96145 01727',
  phoneSecondary: '+91 96145 01727',
  whatsapp: '+919614501727',
  email: 'ap423637@gmail.com',
  address: 'Fuljhore, Rabindra Pally, Durgapur - 713206, West Bengal',
  addressMapLink: 'https://www.google.com/maps/search/?api=1&query=Fuljhore+Rabindra+Pally+Durgapur+713206+West+Bengal',
  openHours: 'Open 24x7',
  enquiryTypes: [
    { id: 'single-room', label: 'Single Room' },
    { id: 'shared-room', label: 'Shared Room' },
    { id: 'balcony-room', label: 'Room with Balcony' },
    { id: 'premium-room', label: 'Premium Room' },
    { id: 'long-stay', label: 'Long Stay / Custom Plan' },
    { id: 'general', label: 'General Enquiry' },
  ],
};

const MOCK_CONTACT_SUBMISSIONS: Array<{
  id: string;
  submission: ContactSubmissionOutput;
  createdAt: string;
}> = [];

class MockContactService implements IContactService {
  async getContactInfo(): Promise<ServiceResult<ContactInfoData>> {
    await delay(35);
    return { success: true, data: MOCK_CONTACT_INFO };
  }

  async submitContact(
    submission: ContactSubmissionOutput,
  ): Promise<ServiceResult<{ submissionId: string }>> {
    await delay(420);
    const submissionId = `sub-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    MOCK_CONTACT_SUBMISSIONS.push({
      id: submissionId,
      submission,
      createdAt: new Date().toISOString(),
    });
    return {
      success: true,
      data: { submissionId },
      meta: { queueLength: MOCK_CONTACT_SUBMISSIONS.length },
    };
  }
}

// ------------------------------ Mock CTA ------------------------------

const MOCK_CTA: CTAData = {
  id: 'cta-main',
  heading: 'Ready to Book Your Room?',
  subheading: 'Contact us today for availability and best offers!',
  primaryButton: {
    text: 'Call Now',
    href: 'tel:+919614501727',
    external: false,
  },
  secondaryButton: {
    text: 'WhatsApp Us',
    href: 'https://wa.me/919614501727?text=Hi%20Ankit%20Da%20Mess%2C%20I%27d%20like%20to%20enquire%20about%20rooms',
    external: true,
  },
  tertiaryButton: {
    text: 'Enquire Now',
    href: '#contact',
    external: false,
  },
};

class MockCTAService implements ICTAService {
  async getCTA(): Promise<ServiceResult<CTAData>> {
    await delay(30);
    return { success: true, data: MOCK_CTA };
  }
}

// ------------------------------ Mock Footer ------------------------------

const MOCK_FOOTER: FooterData = {
  id: 'footer-main',
  brandName: 'Ankit Da Mess',
  brandTagline: 'Guest House & PG',
  brandLogoUrl: 'https://res.cloudinary.com/dyc33dchn/image/upload/v1785510737/ChatGPT_Image_Jul_31_2026_08_27_37_AM_spn3au.png',
  brandDescription:
    'Providing a safe, comfortable and affordable living space for students and working professionals.',
  quickLinksTitle: 'Quick Links',
  quickLinks: [
    { id: 'fl-1', label: 'Home', href: '#home', isAnchor: true, sortOrder: 0 },
    { id: 'fl-2', label: 'Rooms', href: '#rooms', isAnchor: true, sortOrder: 1 },
    { id: 'fl-3', label: 'Gallery', href: '#gallery', isAnchor: true, sortOrder: 2 },
    { id: 'fl-4', label: 'Amenities', href: '#amenities', isAnchor: true, sortOrder: 3 },
    { id: 'fl-5', label: 'Reviews', href: '#testimonials', isAnchor: true, sortOrder: 4 },
    { id: 'fl-6', label: 'Contact', href: '#contact', isAnchor: true, sortOrder: 5 },
  ],
  contactTitle: 'Contact Us',
  contact: {
    phonePrimary: '+91 96145 01727',
    phoneSecondary: '+91 96145 01727',
    whatsapp: '+919614501727',
    email: 'ap423637@gmail.com',
    address: 'Fuljhore, Rabindra Pally, Durgapur - 713206, West Bengal',
  },
  socialLinks: [
    {
      id: 'sl-fb',
      platform: 'facebook',
      url: 'https://www.facebook.com/',
      label: 'Facebook',
    },
    {
      id: 'sl-ig',
      platform: 'instagram',
      url: 'https://www.instagram.com/',
      label: 'Instagram',
    },
    {
      id: 'sl-wa',
      platform: 'whatsapp',
      url: 'https://wa.me/919614501727',
      label: 'WhatsApp',
    },
  ],
  copyrightPrefix: '\u00A9 2026 Ankit Da Mess.',
  copyrightSuffix: 'All Rights Reserved.',
};

class MockFooterService implements IFooterService {
  async getFooter(): Promise<ServiceResult<FooterData>> {
    await delay(25);
    return { success: true, data: MOCK_FOOTER };
  }
}

// ------------------------------ Hybrid Services (DB First, Mock Fallback) ------------------------------

import * as dbActions from './actions';

class HybridHeroService implements IHeroService {
  private mock = new MockHeroService();
  async getHero(): Promise<ServiceResult<HeroData>> {
    try {
      const data = await dbActions.fetchHeroFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getHero();
  }
}

class HybridGalleryService implements IGalleryService {
  private mock = new MockGalleryService();
  async getGallery(category?: GalleryCategory, limit = 50): Promise<ServiceResult<ReadonlyArray<GalleryItem>>> {
    try {
      const result = await dbActions.fetchGalleryFromDB(category, limit);
      if (result) return { success: true, data: result.data, meta: { total: result.total } };
    } catch (e) { /* ignore */ }
    return this.mock.getGallery(category, limit);
  }
}

class HybridRoomsService implements IRoomsService {
  private mock = new MockRoomsService();
  async getRooms(featuredOnly = false, limit = 12): Promise<ServiceResult<ReadonlyArray<Room>>> {
    try {
      const result = await dbActions.fetchRoomsFromDB(featuredOnly, limit);
      if (result) return { success: true, data: result.data, meta: { total: result.total } };
    } catch (e) { /* ignore */ }
    return this.mock.getRooms(featuredOnly, limit);
  }
}

class HybridVirtualTourService implements IVirtualTourService {
  private mock = new MockVirtualTourService();
  async getVirtualTour(): Promise<ServiceResult<VirtualTourData>> {
    try {
      const data = await dbActions.fetchVirtualTourFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getVirtualTour();
  }
}

class HybridWhyChooseUsService implements IWhyChooseUsService {
  private mock = new MockWhyChooseUsService();
  async getWhyChooseUs(): Promise<ServiceResult<WhyChooseUsData>> {
    try {
      const data = await dbActions.fetchWhyChooseUsFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getWhyChooseUs();
  }
}

class HybridAmenitiesService implements IAmenitiesService {
  private mock = new MockAmenitiesService();
  async getAmenities(activeOnly = true, limit = 50): Promise<ServiceResult<ReadonlyArray<Amenity>>> {
    try {
      const result = await dbActions.fetchAmenitiesFromDB(activeOnly, limit);
      if (result) return { success: true, data: result.data, meta: { total: result.total } };
    } catch (e) { /* ignore */ }
    return this.mock.getAmenities(activeOnly, limit);
  }
}

class HybridLocationService implements ILocationService {
  private mock = new MockLocationService();
  async getLocation(): Promise<ServiceResult<LocationData>> {
    try {
      const data = await dbActions.fetchLocationFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getLocation();
  }
}

class HybridTestimonialsService implements ITestimonialsService {
  private mock = new MockTestimonialsService();
  async getTestimonials(activeOnly = true, limit = 20): Promise<ServiceResult<TestimonialsData>> {
    try {
      const result = await dbActions.fetchTestimonialsFromDB(activeOnly, limit);
      if (result) return { success: true, data: result.data as TestimonialsData, meta: { total: result.total } };
    } catch (e) { /* ignore */ }
    return this.mock.getTestimonials(activeOnly, limit);
  }
}

class HybridContactService implements IContactService {
  private mock = new MockContactService();
  async getContactInfo(): Promise<ServiceResult<ContactInfoData>> {
    try {
      const data = await dbActions.fetchContactInfoFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getContactInfo();
  }
  async submitContact(submission: ContactSubmissionOutput): Promise<ServiceResult<{ submissionId: string }>> {
    return this.mock.submitContact(submission);
  }
}

class HybridCTAService implements ICTAService {
  private mock = new MockCTAService();
  async getCTA(): Promise<ServiceResult<CTAData>> {
    try {
      const data = await dbActions.fetchCTAFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getCTA();
  }
}

class HybridFooterService implements IFooterService {
  private mock = new MockFooterService();
  async getFooter(): Promise<ServiceResult<FooterData>> {
    try {
      const data = await dbActions.fetchFooterFromDB();
      if (data) return { success: true, data };
    } catch (e) { /* ignore */ }
    return this.mock.getFooter();
  }
}

export const heroService: IHeroService = new HybridHeroService();
export const galleryService: IGalleryService = new HybridGalleryService();
export const roomsService: IRoomsService = new HybridRoomsService();
export const virtualTourService: IVirtualTourService = new HybridVirtualTourService();
export const whyChooseUsService: IWhyChooseUsService = new HybridWhyChooseUsService();
export const amenitiesService: IAmenitiesService = new HybridAmenitiesService();
export const locationService: ILocationService = new HybridLocationService();
export const testimonialsService: ITestimonialsService = new HybridTestimonialsService();
export const contactService: IContactService = new HybridContactService();
export const ctaService: ICTAService = new HybridCTAService();
export const footerService: IFooterService = new HybridFooterService();
