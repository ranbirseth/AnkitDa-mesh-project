import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ankitdamess.in';
const TODAY = new Date();

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' as const },
  { path: '/rooms', priority: 0.9, changefreq: 'weekly' as const },
  { path: '/gallery', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/virtual-tour', priority: 0.7, changefreq: 'monthly' as const },
  { path: '/contact', priority: 0.9, changefreq: 'monthly' as const },
  { path: '/privacy', priority: 0.2, changefreq: 'yearly' as const },
  { path: '/terms', priority: 0.2, changefreq: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((r) => ({
    url: new URL(r.path, SITE_URL).toString(),
    lastModified: TODAY,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));
}
