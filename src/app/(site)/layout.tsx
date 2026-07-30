import type { Metadata } from 'next';
import { Navbar } from '@/sections/Navbar';
import { FooterPlaceholder } from '@/sections/FooterPlaceholder';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: undefined,
  description: undefined,
  path: '/',
});

export default function SiteLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="relative isolate">
        {children}
      </main>
      <FooterPlaceholder />
    </>
  );
}
