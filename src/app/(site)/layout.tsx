import type { Metadata } from 'next';
import { Navbar } from '@/sections/Navbar';
import { Footer } from '@/features/footer/components/Footer';
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
      <Footer />
    </>
  );
}
