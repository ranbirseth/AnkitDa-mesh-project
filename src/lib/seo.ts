import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ankitdamess.in';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Ankit Da Mess';
const DEFAULT_OG = `${SITE_URL}/og/default-og.png`;

export interface BuildMetadataInput {
  readonly title?: string;
  readonly description?: string;
  readonly path?: string;
  readonly image?: string;
  readonly keywords?: ReadonlyArray<string>;
  readonly type?: 'website' | 'article';
}

const DEFAULT_DESCRIPTION =
  'Ankit Da Mess — Premium PG & Guest House in Durgapur for students and working professionals. Spacious rooms, modern amenities, home-style food, and 24/7 safety.';

const DEFAULT_KEYWORDS: readonly string[] = [
  'PG in Durgapur',
  'Guest House Durgapur',
  'Ankit Da Mess',
  'Monthly Room Rent',
  'Student Accommodation',
  'Working Professionals PG',
  'Luxury PG West Bengal',
];

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_OG,
  keywords,
  type = 'website',
}: BuildMetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} | Premium PG & Guest House in Durgapur`;
  const url = new URL(path, SITE_URL).toString();
  const ogImage = new URL(image, SITE_URL).toString();

  const keywordsList: string[] = keywords?.length
    ? Array.isArray(keywords)
      ? [...keywords]
      : [keywords as unknown as string]
    : [...DEFAULT_KEYWORDS];

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    keywords: keywordsList,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@ankitdamess',
      site: '@ankitdamess',
    },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      shortcut: '/icon.svg',
    },
    manifest: '/favicons/site.webmanifest',
  };
}
