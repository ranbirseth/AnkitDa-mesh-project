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
  url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=80',
  alt: 'Ankit Da Mess — exterior night view of a luxury guest house building with warm festive lights',
  width: 2400,
  height: 1600,
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
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'Cozy single occupancy room with study desk, natural light, and single bed',
  ['furnished', 'study', 'cupboard', 'vent'],
  { bedType: 'Single', capacityAdults: 1, roomSizeSqFt: 140 },
);

const SHARED_ROOM = buildRoom(
  'r-shared-01',
  'shared-room',
  'Shared Room',
  2500,
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  'Budget-friendly shared room with two beds, study area and cupboards',
  ['furnished', 'study', 'cupboard', 'vent'],
  { bedType: 'Twin', capacityAdults: 2, roomSizeSqFt: 180 },
);

const BALCONY_ROOM = buildRoom(
  'r-balcony-01',
  'room-with-balcony',
  'Room with Balcony',
  4500,
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'Premium room with private balcony overlooking greenery',
  ['furnished', 'study', 'cupboard', 'vent', 'ac'],
  { bedType: 'Double', capacityAdults: 1, roomSizeSqFt: 200, status: 'available' },
);

const PREMIUM_ROOM = buildRoom(
  'r-premium-01',
  'premium-room',
  'Premium Room',
  5000,
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
  'Top-floor premium ensuite room with attached bathroom and AC',
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
  {
    id: 'g-r-1',
    category: 'rooms',
    title: 'Single Room — Study Corner',
    alt: 'Single room with wooden study desk and chair, ample natural light',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    relatedRoomId: SINGLE_ROOM.id,
    featured: true,
  },
  {
    id: 'g-r-2',
    category: 'rooms',
    title: 'Shared Room Twin Beds',
    alt: 'Shared room with two single beds, clean linen and cupboard',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    relatedRoomId: SHARED_ROOM.id,
  },
  {
    id: 'g-b-1',
    category: 'terrace',
    title: 'Terrace Lounge — Sunset View',
    alt: 'Rooftop terrace seating with plants and evening light',
    url: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'g-b-2',
    category: 'building',
    title: 'Corridor — First Floor',
    alt: 'Bright corridor with terracotta flooring and windows on both sides',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-k-1',
    category: 'kitchen',
    title: 'Common Kitchen — Full Equipped',
    alt: 'Community kitchen with modern stove, storage, and dining area',
    url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-k-2',
    category: 'kitchen',
    title: 'Meal Service Counter',
    alt: 'Home style food service counter with clean utensils',
    url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-bl-1',
    category: 'bathroom',
    title: 'Attached Bathroom — Premium',
    alt: 'Clean and modern attached bathroom with western toilet and shower',
    url: 'https://images.unsplash.com/photo-1604007732959-0367b4cbf68a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-bl-2',
    category: 'bathroom',
    title: 'Common Wash Area',
    alt: 'Common wash area with multiple basins and good ventilation',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-bdg-2',
    category: 'building',
    title: 'Building Facade — Day',
    alt: 'Ankit Da Mess building exterior during the day, welcoming entrance',
    url: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'g-bdg-3',
    category: 'building',
    title: 'Entry & Reception',
    alt: 'Guest house ground floor reception area with seating and plants',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-tr-2',
    category: 'terrace',
    title: 'Evening Terrace Hangout',
    alt: 'Rooftop terrace with string lights for evening relaxation',
    url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'g-r-3',
    category: 'rooms',
    title: 'Premium Room Ensuite',
    alt: 'Premium room interior with double bed and attached bath',
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80',
    relatedRoomId: PREMIUM_ROOM.id,
  },
];

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
    width: 900,
    height: 1200,
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
  href: 'https://wa.me/919823456789?text=Hi%20Ankit%20Da%20Mess%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability',
  external: true,
};
const CALL_CTA: LinkCTA = {
  text: 'Call Now',
  href: 'tel:+919823456789',
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
    'Explore every corner of Ankit Da Mess from the comfort of your home. Premium walkthrough of rooms, common areas, and rooftop.',
  posterUrl:
    'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=1400&q=80',
  posterAlt:
    'Ankit Da Mess front facade — three-story building with balcony, terracotta accents, and green plants on railings',
  posterWidth: 1400,
  posterHeight: 930,
  videoUrl: 'https://cdn.coverr.co/videos/coverr-walking-through-a-hotel-lobby-9657/1080p.mp4',
  ctaText: 'Watch Full Video',
  ctaHref: 'https://www.youtube.com/@ankitdamess',
  supportingText:
    'Explore Ankit Da Mess from the comfort of your home.',
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
  addressLine1: 'Fuljhore,',
  addressLine2: 'Opp. Engineering College More',
  city: 'Durgapur',
  state: 'West Bengal',
  postalCode: '713209',
  country: 'India',
  latitude: 23.5204,
  longitude: 87.3119,
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=23.5204,87.3119&output=embed&z=15',
  mapLink: 'https://maps.google.com/?q=23.5204,87.3119',
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
    'Have a question about availability or pricing? Send us a message.',
  phonePrimary: '+91 98234 56789',
  phoneSecondary: '+91 98234 56790',
  whatsapp: '+91 98234 56789',
  email: 'ankitda.mess@gmail.com',
  address: 'Fuljhore, Durgapur, West Bengal',
  addressMapLink: 'https://maps.google.com/?q=Fuljhore+Durgapur+West+Bengal',
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
    href: 'tel:+919823456789',
    external: false,
  },
  secondaryButton: {
    text: 'WhatsApp Us',
    href: 'https://wa.me/919823456789?text=Hi%20Ankit%20Da%20Mess%2C%20I%27d%20like%20to%20enquire%20about%20rooms',
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
    phonePrimary: '+91 98234 56789',
    phoneSecondary: '+91 98234 56790',
    whatsapp: '+91 98234 56789',
    email: 'ankitda.mess@gmail.com',
    address: 'Fuljhore, Durgapur, West Bengal',
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
      url: 'https://wa.me/919823456789',
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
