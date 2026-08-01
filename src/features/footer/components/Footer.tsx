'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/Container';
import { footerService, type IFooterService } from '@/services';
import type { FooterData } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { SocialIcons } from './SocialIcons';
import { FooterLinks } from './FooterLinks';

function formatTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

function formatMailto(email: string): string {
  return `mailto:${email}`;
}

export function Footer(): React.ReactElement {
  const [data, setData] = React.useState<FooterData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (footerService as IFooterService).getFooter();
      if (mounted && result.success && result.data) {
        setData(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const year = typeof Date !== 'undefined' ? new Date().getFullYear() : 2026;

  const HomeIcon = LucideIcons.Home;
  const PhoneIcon = LucideIcons.Phone;
  const MessageCircleIcon = LucideIcons.MessageCircle;
  const MailIcon = LucideIcons.Mail;
  const MapPinIcon = LucideIcons.MapPin;
  const AlertCircleIcon = LucideIcons.AlertCircle;

  return (
    <footer
      className="relative mt-0 isolate border-t border-gold-500/8 bg-gradient-to-b from-forest-900 to-forest-950 text-cream-100/90"
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container maxWidth="wide" className="py-14">
        {loading ? (
          <FooterSkeleton />
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
            <Reveal variant="fadeUp" delay={reduced ? 0 : 0.05} className="sm:col-span-2 lg:col-span-4">
              <div className="flex flex-col gap-4 max-w-sm">
                <div className="flex items-center gap-3">
                  {data.brandLogoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.brandLogoUrl}
                      alt={`${data.brandName} logo`}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover shadow-soft"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-50 text-forest-900"
                    >
                      <HomeIcon className="h-5 w-5" />
                    </span>
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="font-display text-xl text-cream-50">
                      {data.brandName || 'Ankit Da Mess'}
                    </span>
                    <span className="text-gold-400/80 text-sm">
                      {data.brandTagline}
                    </span>
                  </div>
                </div>
                <p className="text-cream-100/60 max-w-sm">
                  {data.brandDescription}
                </p>
                <SocialIcons socialLinks={data.socialLinks} className="mt-2" />
              </div>
            </Reveal>

            <Reveal variant="fadeUp" delay={reduced ? 0 : 0.1} className="lg:col-span-4">
              <FooterLinks
                title={data.quickLinksTitle || 'Quick Links'}
                quickLinks={data.quickLinks}
              />
            </Reveal>

            <Reveal variant="fadeUp" delay={reduced ? 0 : 0.15} className="lg:col-span-4">
              <div className="flex flex-col">
                <h4 className="font-display text-cream-50 mb-4 text-lg">
                  {data.contactTitle || 'Contact Us'}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <PhoneIcon className="h-4 w-4 text-gold-400/80 mt-1 shrink-0" />
                    <a
                      href={formatTel(data.contact.phonePrimary)}
                      className="text-cream-100/60 text-sm hover:text-gold-400 transition-colors"
                    >
                      {data.contact.phonePrimary}
                    </a>
                  </li>
                  {data.contact.whatsapp && (
                    <li className="flex items-start gap-3">
                      <MessageCircleIcon className="h-4 w-4 text-gold-400/80 mt-1 shrink-0" />
                      <a
                        href={formatWhatsAppLink(data.contact.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cream-100/60 text-sm hover:text-gold-400 transition-colors"
                      >
                        {data.contact.whatsapp}
                      </a>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <MailIcon className="h-4 w-4 text-gold-400/80 mt-1 shrink-0" />
                    <a
                      href={formatMailto(data.contact.email)}
                      className="text-cream-100/60 text-sm hover:text-gold-400 transition-colors break-all"
                    >
                      {data.contact.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="h-4 w-4 text-gold-400/80 mt-1 shrink-0" />
                    {data.contact.address ? (
                      <a
                        href={formatMapLink(data.contact.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cream-100/60 text-sm hover:text-gold-400 transition-colors"
                      >
                        {data.contact.address}
                      </a>
                    ) : (
                      <span className="text-cream-100/60 text-sm">
                        {data.contact.address}
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircleIcon className="h-10 w-10 text-cream-200/50" />
            <p className="font-display text-xl text-cream-100">Unable to load footer</p>
            <p className="text-sm text-cream-200/60 max-w-md">
              Please refresh the page or try again later.
            </p>
          </div>
        )}
      </Container>

      <div className="border-t border-cream-100/5">
        <Container maxWidth="wide" className="pt-6 pb-10">
          <p className="text-center text-cream-200/50 text-xs sm:text-left">
            {data ? (
              <>
                {data.copyrightPrefix.replace(/\u00A9\s*\d{4}/, `\u00A9 ${year}`)}
                {data.copyrightSuffix ? ` ${data.copyrightSuffix}` : ''}
                {data.brandName && !data.copyrightPrefix.includes(data.brandName) && !data.copyrightSuffix?.includes(data.brandName)
                  ? ` ${data.brandName}`
                  : ''}
              </>
            ) : (
              `\u00A9 ${year} Ankit Da Mess. All Rights Reserved.`
            )}
          </p>
        </Container>
      </div>
    </footer>
  );
}

function formatMapLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function FooterSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
      <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-cream-100/10" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-36 rounded-xl bg-cream-100/10" />
            <Skeleton className="h-4 w-32 rounded-full bg-cream-100/10" />
          </div>
        </div>
        <Skeleton shape="text" lines={3} className="!bg-cream-100/10" />
        <div className="flex items-center gap-3 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-full bg-cream-100/10" />
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col">
        <Skeleton className="h-6 w-32 rounded-xl bg-cream-100/10 mb-4" />
        <ul className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-28 rounded-full bg-cream-100/10" />
          ))}
        </ul>
      </div>

      <div className="lg:col-span-4 flex flex-col">
        <Skeleton className="h-6 w-32 rounded-xl bg-cream-100/10 mb-4" />
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 rounded-full bg-cream-100/10 mt-1 shrink-0" />
              <Skeleton className="h-4 w-48 rounded-full bg-cream-100/10" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
