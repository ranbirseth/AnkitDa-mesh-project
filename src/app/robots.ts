import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ankitdamess.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/rooms', '/rooms/', '/gallery', '/virtual-tour', '/contact', '/privacy', '/terms'],
        disallow: ['/admin/', '/api/', '/_next/', '/favicon/'],
      },
      { userAgent: 'GPTBot', disallow: ['/admin/'] },
    ],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  };
}
