'use server';

import { connectDB } from '@/lib/db';
import { RoomModel } from '@/models/Room';
import { GalleryModel } from '@/models/Gallery';
import { AmenityModel } from '@/models/Amenity';
import { TestimonialModel } from '@/models/Testimonial';
import { SiteSettingsModel } from '@/models/SiteSettings';
import type { GalleryCategory } from '@/types';

export async function fetchHeroFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'hero' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}

export async function fetchGalleryFromDB(category?: GalleryCategory, limit = 50) {
  await connectDB();
  const query = category && category !== 'all' ? { category } : {};
  const items = await GalleryModel.find(query).sort({ createdAt: -1 }).limit(limit);
  if (items.length > 0) {
    const data = items.map(doc => { const item = doc.toObject(); item.id = item._id.toString(); return item; });
    return { data: JSON.parse(JSON.stringify(data)), total: await GalleryModel.countDocuments(query) };
  }
  return null;
}

export async function fetchRoomsFromDB(featuredOnly = false, limit = 12) {
  await connectDB();
  const query = featuredOnly ? { featured: true } : {};
  const items = await RoomModel.find(query).sort({ createdAt: -1 }).limit(limit);
  if (items.length > 0) {
    const data = items.map(doc => { const item = doc.toObject(); item.id = item._id.toString(); return item; });
    return { data: JSON.parse(JSON.stringify(data)), total: await RoomModel.countDocuments(query) };
  }
  return null;
}

export async function fetchVirtualTourFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'virtual-tour' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}

export async function fetchWhyChooseUsFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'why-choose-us' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}

export async function fetchAmenitiesFromDB(activeOnly = true, limit = 50) {
  await connectDB();
  const query = activeOnly ? { active: true } : {};
  const items = await AmenityModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).limit(limit);
  if (items.length > 0) {
    const data = items.map(doc => { const item = doc.toObject(); item.id = item._id.toString(); return item; });
    return { data: JSON.parse(JSON.stringify(data)), total: await AmenityModel.countDocuments(query) };
  }
  return null;
}

export async function fetchLocationFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'location' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}

export async function fetchTestimonialsFromDB(activeOnly = true, limit = 20) {
  await connectDB();
  const query = activeOnly ? { active: true } : {};
  const items = await TestimonialModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).limit(limit);
  
  const settings = await SiteSettingsModel.findOne({ type: 'testimonials' });
  
  if (items.length > 0 || settings?.data) {
    let data: any = {
      id: 'testimonials-main',
      heading: 'What Our Residents Say',
      eyebrow: 'TESTIMONIALS',
      subheading: 'Real stories from students and professionals who call Ankit Da Mess home.',
      items: [],
    };
    if (settings?.data) data = { ...data, ...settings.data };
    data.items = JSON.parse(JSON.stringify(items.map(doc => { const item = doc.toObject(); item.id = item._id.toString(); return item; })));
    return { data, total: await TestimonialModel.countDocuments(query) };
  }
  return null;
}

export async function fetchContactInfoFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'contact' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}

export async function fetchCTAFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'cta' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}

export async function fetchFooterFromDB() {
  await connectDB();
  const settings = await SiteSettingsModel.findOne({ type: 'footer' });
  return settings?.data ? JSON.parse(JSON.stringify(settings.data)) : null;
}
