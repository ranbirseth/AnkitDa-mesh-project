'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { contactService, type IContactService } from '@/services';
import type { ContactInfoData } from '@/types';
import { cn } from '@/lib/cn';
import { ContactInfoCard } from './ContactInfoCard';
import { QuickActionButtons } from './QuickActionButtons';
import { ContactForm } from './ContactForm';

export function ContactSection(): React.ReactElement {
  const [data, setData] = React.useState<ContactInfoData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    void (async (): Promise<void> => {
      const result = await (contactService as IContactService).getContactInfo();
      if (mounted && result.success && result.data) {
        setData(result.data);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="contact"
      className="scroll-mt-28 w-full"
    >
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden bg-forest-900 border border-gold-500/8 shadow-elevate',
          'p-6 sm:p-8 lg:p-10 mx-auto max-w-full',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 55% 40% at 100% 0%, rgba(198,156,46,0.12), transparent 60%), radial-gradient(ellipse 50% 35% at 0% 100%, rgba(79,138,88,0.10), transparent 60%)',
          }}
        />

        <Reveal variant="fadeUp" className="relative w-full">
          {loading ? (
            <ContactSkeleton />
          ) : data ? (
            <div className="flex flex-col items-start w-full gap-6">
              <div className="w-full mb-1">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-2 text-eyebrow uppercase text-gold-400">
                    <span aria-hidden className="inline-block w-8 h-px bg-gold-500" />
                    {data.eyebrow ?? 'CONTACT'}
                  </span>
                </div>

                <h2 className="font-display text-h3 md:text-h2 text-cream-50 text-balance mb-2">
                  {data.heading ?? 'Get In Touch'}
                </h2>

                <span
                  aria-hidden
                  className="block w-14 h-0.5 bg-gold-500 rounded-full"
                />

                {data.subheading && (
                  <p className="text-cream-200/70 max-w-2xl mt-3">
                    {data.subheading}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                <div className="md:col-span-5 flex flex-col gap-4 w-full">
                  <ContactInfoCard contactInfo={data} />
                  <QuickActionButtons
                    phone={data.phonePrimary}
                    whatsapp={data.whatsapp}
                  />
                </div>

                <div className="md:col-span-7 w-full">
                  <ContactForm contactInfo={data} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <LucideIcons.AlertCircle className="h-10 w-10 text-cream-200/50" />
              <p className="font-display text-xl text-cream-100">Unable to load contact info</p>
              <p className="text-sm text-cream-200/60 max-w-md">
                Please refresh the page or try again later.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function ContactSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col items-start w-full gap-6">
      <div className="w-full flex flex-col gap-3">
        <Skeleton className="h-5 w-44 rounded-full bg-cream-100/10" />
        <Skeleton className="h-10 md:h-14 w-[460px] max-w-full rounded-2xl bg-cream-100/10" />
        <Skeleton className="h-1 w-14 rounded-full bg-gold-500/50" />
        <Skeleton className="h-16 w-full max-w-2xl rounded-xl bg-cream-100/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        <div className="md:col-span-5 flex flex-col gap-4 w-full">
          <div className="rounded-3xl border border-white/10 bg-forest-900/60 backdrop-blur-md p-6 sm:p-7">
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl bg-cream-100/8" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-3 w-16 rounded-full bg-cream-100/8" />
                    <Skeleton className="h-5 w-48 rounded-lg bg-cream-100/10" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-white/10 my-5" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl bg-cream-100/8" />
              <Skeleton className="h-5 w-28 rounded-lg bg-cream-100/10" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Skeleton className="h-12 flex-1 rounded-full bg-gold-500/30" />
            <Skeleton className="h-12 flex-1 rounded-full bg-cream-100/10" />
          </div>
        </div>

        <div className="md:col-span-7 w-full rounded-3xl border border-white/10 bg-forest-900/60 backdrop-blur-md p-6 sm:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-12 rounded-full bg-cream-100/8" />
              <Skeleton className="h-11 w-full rounded-xl bg-cream-100/8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-12 rounded-full bg-cream-100/8" />
              <Skeleton className="h-11 w-full rounded-xl bg-cream-100/8" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <Skeleton className="h-3 w-12 rounded-full bg-cream-100/8" />
            <Skeleton className="h-11 w-full rounded-xl bg-cream-100/8" />
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <Skeleton className="h-3 w-24 rounded-full bg-cream-100/8" />
            <Skeleton className="h-11 w-full rounded-xl bg-cream-100/8" />
          </div>
          <div className="flex flex-col gap-1.5 mb-6">
            <Skeleton className="h-3 w-16 rounded-full bg-cream-100/8" />
            <Skeleton className="h-28 w-full rounded-xl bg-cream-100/8" />
          </div>
          <Skeleton className="h-12 w-full rounded-full bg-gold-500/30" />
        </div>
      </div>
    </div>
  );
}
