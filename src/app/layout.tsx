import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';

import { fontDisplay, fontSans } from '@/lib/fonts';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDF9F0' },
    { media: '(prefers-color-scheme: dark)', color: '#0B2B13' },
  ],
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-cream-50 text-ink-800 font-sans selection:bg-gold-400/30 selection:text-forest-900">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-forest-900"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
