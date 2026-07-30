import { Playfair_Display, Inter } from 'next/font/google';

export const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});
