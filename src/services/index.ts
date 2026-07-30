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

// ------------------------------ Public Factory ------------------------------

export const heroService: IHeroService = new MockHeroService();
export const galleryService: IGalleryService = new MockGalleryService();
export const roomsService: IRoomsService = new MockRoomsService();
