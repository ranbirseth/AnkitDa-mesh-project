import type { GalleryCategory, NavLinkItem } from '@/types';

// ================================================================
// NAVIGATION
// ================================================================

export const NAV_LINKS: ReadonlyArray<NavLinkItem> = [
  { id: 'home', label: 'Home', href: '#home', isAnchor: true },
  { id: 'rooms', label: 'Rooms', href: '#rooms', isAnchor: true },
  { id: 'amenities', label: 'Amenities', href: '#amenities', isAnchor: true },
  { id: 'gallery', label: 'Gallery', href: '#gallery', isAnchor: true },
  { id: 'location', label: 'Location', href: '#location', isAnchor: true },
  { id: 'reviews', label: 'Reviews', href: '#reviews', isAnchor: true },
  { id: 'contact', label: 'Contact', href: '#contact', isAnchor: true },
] as const;

export const NAV_CTA: NavLinkItem = {
  id: 'enquire-cta',
  label: 'Enquire Now',
  href: '#contact',
  isAnchor: true,
} as const;

export const NAV_CONTACT_WHATSAPP = 'https://wa.me/919823456789?text=Hi%20Ankit%20Da%20Mess%2C%20I%27d%20like%20to%20enquire%20about%20rooms';
export const NAV_CONTACT_PHONE = 'tel:+919823456789';
export const NAV_CONTACT_EMAIL = 'mailto:bookings@ankitdamess.in';

// ================================================================
// GALLERY CATEGORIES
// ================================================================

export const GALLERY_CATEGORIES: ReadonlyArray<{
  readonly id: GalleryCategory;
  readonly label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'terrace', label: 'Terrace' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'building', label: 'Building' },
  { id: 'bathroom', label: 'Bathroom' },
] as const;

export type GalleryCategoryId = (typeof GALLERY_CATEGORIES)[number]['id'];

// ================================================================
// SECTION ANCHOR IDS (Used by Nav scroll-spy)
// ================================================================

export const SECTION_IDS = {
  home: 'home',
  hero: 'home',
  gallery: 'gallery',
  rooms: 'rooms',
} as const;

// ================================================================
// HERO AMENITIES STRIP
// ================================================================

export const HERO_AMENITY_CHIPS = [
  { id: 'space', iconKey: 'BedDouble', title: 'Spacious Rooms', subtitle: 'Single & Shared' },
  { id: 'wifi', iconKey: 'Wifi', title: 'High-Speed WiFi', subtitle: 'Stay Connected' },
  { id: 'food', iconKey: 'UtensilsCrossed', title: 'Home Style Food', subtitle: 'Veg & Non-Veg' },
  { id: 'power', iconKey: 'Zap', title: '24x7 Electricity', subtitle: 'Power Backup' },
  { id: 'water', iconKey: 'Droplets', title: 'Water Supply', subtitle: '24/7 Available' },
  { id: 'study', iconKey: 'GraduationCap', title: 'Peaceful Environment', subtitle: 'Perfect for Study' },
] as const;
