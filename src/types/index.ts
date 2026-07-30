import { z } from 'zod';

// ================================================================
// Shared / Core Domain Types
// ================================================================

export interface WithId {
  readonly id: string;
}

export interface Timestamps {
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MediaAsset extends WithId {
  readonly url: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly caption?: string;
  readonly blurDataURL?: string;
}

export interface LinkCTA {
  readonly text: string;
  readonly href: string;
  readonly external?: boolean;
}

// ================================================================
// Navbar
// ================================================================

export interface NavLinkItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly isAnchor?: boolean;
}

export const NavLinkItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  isAnchor: z.boolean().optional(),
});

// ================================================================
// Hero Section
// ================================================================

export interface HeroData extends WithId {
  readonly eyebrow: string;
  readonly heading: string;
  readonly headingAccent?: string;
  readonly subHeading: string;
  readonly primaryCTA: LinkCTA;
  readonly secondaryCTA: LinkCTA;
  readonly tertiaryCTA?: LinkCTA;
  readonly backgroundMedia: MediaAsset;
  readonly posterImage?: MediaAsset;
  readonly amenitiesStrip: ReadonlyArray<HeroAmenityChip>;
}

export interface HeroAmenityChip {
  readonly id: string;
  readonly iconKey: string;
  readonly title: string;
  readonly subtitle: string;
}

export const HeroAmenityChipSchema = z.object({
  id: z.string().min(1),
  iconKey: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

export const HeroDataSchema = z.object({
  id: z.string().min(1),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  headingAccent: z.string().optional(),
  subHeading: z.string().min(1),
  primaryCTA: z.object({ text: z.string().min(1), href: z.string().min(1), external: z.boolean().optional() }),
  secondaryCTA: z.object({ text: z.string().min(1), href: z.string().min(1), external: z.boolean().optional() }),
  tertiaryCTA: z.object({ text: z.string().min(1), href: z.string().min(1), external: z.boolean().optional() }).optional(),
  backgroundMedia: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    caption: z.string().optional(),
    blurDataURL: z.string().optional(),
  }),
  posterImage: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    blurDataURL: z.string().optional(),
  }).optional(),
  amenitiesStrip: z.array(HeroAmenityChipSchema),
});

// ================================================================
// Gallery
// ================================================================

export type GalleryCategory =
  | 'all'
  | 'rooms'
  | 'building'
  | 'kitchen'
  | 'terrace'
  | 'bathroom';

export interface GalleryItem extends WithId {
  readonly title: string;
  readonly alt: string;
  readonly caption?: string;
  readonly category: Exclude<GalleryCategory, 'all'>;
  readonly image: MediaAsset;
  readonly relatedRoomId?: string;
  readonly featured?: boolean;
}

export const GalleryCategorySchema = z.enum([
  'all',
  'rooms',
  'building',
  'kitchen',
  'terrace',
  'bathroom',
]);

export const GalleryItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  category: z.enum(['rooms', 'building', 'kitchen', 'terrace', 'bathroom']),
  image: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    blurDataURL: z.string().optional(),
  }),
  relatedRoomId: z.string().optional(),
  featured: z.boolean().optional(),
});

// ================================================================
// Rooms
// ================================================================

export type RoomStatus = 'available' | 'filled' | 'maintenance';

export interface RoomFeature {
  readonly id: string;
  readonly iconKey: string;
  readonly label: string;
}

export interface Room extends WithId {
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly description?: string;
  readonly priceMonthly: number;
  readonly currency: string;
  readonly status: RoomStatus;
  readonly featured: boolean;
  readonly primaryImage: MediaAsset;
  readonly gallery?: ReadonlyArray<MediaAsset>;
  readonly features: ReadonlyArray<RoomFeature>;
  readonly capacityAdults?: number;
  readonly bedType?: string;
  readonly roomSizeSqFt?: number;
}

export const RoomFeatureSchema = z.object({
  id: z.string().min(1),
  iconKey: z.string().min(1),
  label: z.string().min(1),
});

export const RoomSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().optional(),
  priceMonthly: z.number().positive().finite(),
  currency: z.string().min(2).max(3),
  status: z.enum(['available', 'filled', 'maintenance']),
  featured: z.boolean(),
  primaryImage: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    blurDataURL: z.string().optional(),
  }),
  gallery: z.array(z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
  })).optional(),
  features: z.array(RoomFeatureSchema),
  capacityAdults: z.number().int().positive().optional(),
  bedType: z.string().optional(),
  roomSizeSqFt: z.number().positive().optional(),
});

// ================================================================
// Service Response Envelope
// ================================================================

export interface ServiceResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface ListResponse<T> {
  readonly items: ReadonlyArray<T>;
  readonly total: number;
}
