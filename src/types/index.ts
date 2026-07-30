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

// ================================================================
// Phase 2 — Virtual Tour
// ================================================================

export interface VirtualTourData extends WithId {
  readonly enabled: boolean;
  readonly title: string;
  readonly description: string;
  readonly videoUrl?: string;
  readonly posterUrl: string;
  readonly posterAlt: string;
  readonly posterWidth?: number;
  readonly posterHeight?: number;
  readonly ctaText: string;
  readonly ctaHref: string;
  readonly supportingText?: string;
  readonly panorama?: boolean;
}

export const VirtualTourDataSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(true),
  title: z.string().min(1),
  description: z.string().min(1),
  videoUrl: z.string().url().optional(),
  posterUrl: z.string().url(),
  posterAlt: z.string().min(1),
  posterWidth: z.number().positive().optional(),
  posterHeight: z.number().positive().optional(),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
  supportingText: z.string().optional(),
  panorama: z.boolean().optional(),
});

// ================================================================
// Phase 2 — Why Choose Us
// ================================================================

export interface WhyChooseUsFeature extends WithId {
  readonly iconKey: string;
  readonly title: string;
  readonly description: string;
  readonly sortOrder: number;
  readonly active: boolean;
}

export interface WhyChooseUsData extends WithId {
  readonly heading: string;
  readonly subheading?: string;
  readonly features: ReadonlyArray<WhyChooseUsFeature>;
}

export const WhyChooseUsFeatureSchema = z.object({
  id: z.string().min(1),
  iconKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  sortOrder: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

export const WhyChooseUsDataSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  features: z.array(WhyChooseUsFeatureSchema),
});

// ================================================================
// Phase 2 — Amenities
// ================================================================

export interface Amenity extends WithId {
  readonly name: string;
  readonly iconKey: string;
  readonly description?: string;
  readonly category: 'standard' | 'premium' | 'security' | 'lifestyle';
  readonly sortOrder: number;
  readonly active: boolean;
}

export const AmenitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  iconKey: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['standard', 'premium', 'security', 'lifestyle']),
  sortOrder: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

// ================================================================
// Phase 2 — Location / Nearby Places
// ================================================================

export interface NearbyPlace extends WithId {
  readonly name: string;
  readonly iconKey: string;
  readonly category: 'education' | 'transport' | 'medical' | 'market' | 'other';
  readonly distanceKm: number;
  readonly walkingMinutes: number;
  readonly active: boolean;
}

export interface LocationData extends WithId {
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly googleMapsEmbedUrl?: string;
  readonly mapLink: string;
  readonly nearbyPlaces: ReadonlyArray<NearbyPlace>;
  readonly heading?: string;
  readonly subheading?: string;
}

export const NearbyPlaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  iconKey: z.string().min(1),
  category: z.enum(['education', 'transport', 'medical', 'market', 'other']),
  distanceKm: z.number().nonnegative(),
  walkingMinutes: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

export const LocationDataSchema = z.object({
  id: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  googleMapsEmbedUrl: z.string().url().optional(),
  mapLink: z.string().url(),
  nearbyPlaces: z.array(NearbyPlaceSchema),
  heading: z.string().optional(),
  subheading: z.string().optional(),
});

// ================================================================
// Phase 3 — Testimonials
// ================================================================

export type TestimonialSource = 'direct' | 'google' | 'booking' | 'word-of-mouth';

export interface Testimonial extends WithId {
  readonly reviewerName: string;
  readonly reviewerRole: string;
  readonly reviewerInitials?: string;
  readonly avatarUrl?: string;
  readonly rating: number;
  readonly content: string;
  readonly source?: TestimonialSource;
  readonly createdAt?: string;
  readonly active?: boolean;
  readonly sortOrder?: number;
}

export interface TestimonialsData extends WithId {
  readonly heading: string;
  readonly eyebrow?: string;
  readonly subheading?: string;
  readonly items: ReadonlyArray<Testimonial>;
}

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  reviewerName: z.string().min(1),
  reviewerRole: z.string().min(1),
  reviewerInitials: z.string().min(1).max(4).optional(),
  avatarUrl: z.string().url().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  source: z.enum(['direct', 'google', 'booking', 'word-of-mouth']).optional(),
  createdAt: z.string().optional(),
  active: z.boolean().default(true).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const TestimonialsDataSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  eyebrow: z.string().optional(),
  subheading: z.string().optional(),
  items: z.array(TestimonialSchema),
});

// ================================================================
// Phase 3 — Contact
// ================================================================

export type ContactEnquiryType =
  | 'single-room'
  | 'shared-room'
  | 'balcony-room'
  | 'premium-room'
  | 'long-stay'
  | 'other';

export interface ContactInfoData extends WithId {
  readonly heading: string;
  readonly eyebrow?: string;
  readonly subheading?: string;
  readonly phonePrimary: string;
  readonly phoneSecondary?: string;
  readonly whatsapp: string;
  readonly email: string;
  readonly address: string;
  readonly addressMapLink?: string;
  readonly openHours?: string;
  readonly enquiryTypes: ReadonlyArray<{ id: ContactEnquiryType | 'general'; label: string }>;
}

export interface ContactSubmission {
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly roomType?: ContactEnquiryType | 'general';
  readonly message?: string;
  readonly source?: string;
}

export const ContactInfoDataSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  eyebrow: z.string().optional(),
  subheading: z.string().optional(),
  phonePrimary: z.string().min(1),
  phoneSecondary: z.string().optional(),
  whatsapp: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  addressMapLink: z.string().url().optional(),
  openHours: z.string().optional(),
  enquiryTypes: z.array(
    z.object({
      id: z.enum([
        'single-room',
        'shared-room',
        'balcony-room',
        'premium-room',
        'long-stay',
        'other',
        'general',
      ]),
      label: z.string().min(1),
    }),
  ),
});

export const ContactSubmissionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be at most 80 characters')
    .trim(),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .regex(
      /^[+]?[\d\s().-]{7,20}$/,
      'Please enter a valid phone number',
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .or(z.literal(''))
    .optional(),
  roomType: z
    .enum([
      'single-room',
      'shared-room',
      'balcony-room',
      'premium-room',
      'long-stay',
      'other',
      'general',
    ])
    .optional(),
  message: z
    .string()
    .max(1000, 'Message must be at most 1000 characters')
    .or(z.literal(''))
    .optional(),
  source: z.string().max(64).optional(),
});

export type ContactSubmissionInput = z.input<typeof ContactSubmissionSchema>;
export type ContactSubmissionOutput = z.output<typeof ContactSubmissionSchema>;

// ================================================================
// Phase 3 — CTA
// ================================================================

export interface CTAData extends WithId {
  readonly heading: string;
  readonly subheading?: string;
  readonly primaryButton: LinkCTA;
  readonly secondaryButton: LinkCTA;
  readonly tertiaryButton?: LinkCTA;
  readonly eyebrow?: string;
  readonly backgroundImageUrl?: string;
}

export const CTADataSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  primaryButton: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
    external: z.boolean().optional(),
  }),
  secondaryButton: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
    external: z.boolean().optional(),
  }),
  tertiaryButton: z
    .object({
      text: z.string().min(1),
      href: z.string().min(1),
      external: z.boolean().optional(),
    })
    .optional(),
  eyebrow: z.string().optional(),
  backgroundImageUrl: z.string().url().optional(),
});

// ================================================================
// Phase 3 — Footer
// ================================================================

export interface FooterSocialLink extends WithId {
  readonly platform: 'facebook' | 'instagram' | 'whatsapp' | 'twitter' | 'linkedin' | 'youtube';
  readonly url: string;
  readonly label: string;
}

export interface FooterQuickLink extends WithId {
  readonly label: string;
  readonly href: string;
  readonly isAnchor?: boolean;
  readonly sortOrder: number;
}

export interface FooterContactInfo {
  readonly phonePrimary: string;
  readonly phoneSecondary?: string;
  readonly whatsapp?: string;
  readonly email: string;
  readonly address: string;
}

export interface FooterData extends WithId {
  readonly brandName: string;
  readonly brandTagline: string;
  readonly brandDescription: string;
  readonly brandLogoUrl?: string;
  readonly quickLinksTitle: string;
  readonly quickLinks: ReadonlyArray<FooterQuickLink>;
  readonly contactTitle: string;
  readonly contact: FooterContactInfo;
  readonly socialLinks: ReadonlyArray<FooterSocialLink>;
  readonly copyrightPrefix: string;
  readonly copyrightSuffix?: string;
}

export const FooterSocialLinkSchema = z.object({
  id: z.string().min(1),
  platform: z.enum([
    'facebook',
    'instagram',
    'whatsapp',
    'twitter',
    'linkedin',
    'youtube',
  ]),
  url: z.string().url(),
  label: z.string().min(1),
});

export const FooterQuickLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  isAnchor: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative(),
});

export const FooterContactInfoSchema = z.object({
  phonePrimary: z.string().min(1),
  phoneSecondary: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  address: z.string().min(1),
});

export const FooterDataSchema = z.object({
  id: z.string().min(1),
  brandName: z.string().min(1),
  brandTagline: z.string().min(1),
  brandDescription: z.string().min(1),
  brandLogoUrl: z.string().url().optional(),
  quickLinksTitle: z.string().min(1),
  quickLinks: z.array(FooterQuickLinkSchema),
  contactTitle: z.string().min(1),
  contact: FooterContactInfoSchema,
  socialLinks: z.array(FooterSocialLinkSchema),
  copyrightPrefix: z.string().min(1),
  copyrightSuffix: z.string().optional(),
});

