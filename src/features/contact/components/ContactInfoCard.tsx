'use client';

import * as React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ContactInfoData } from '@/types';

export interface ContactInfoCardProps {
  readonly contactInfo: ContactInfoData;
  readonly className?: string;
}

interface InfoRowProps {
  readonly icon: React.ReactElement;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly external?: boolean;
}

function InfoRow({ icon, label, value, href, external }: InfoRowProps): React.ReactElement {
  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<Record<string, unknown>>, {
        className: 'h-5 w-5 text-gold-500',
      })
    : icon;

  const content = (
    <div className="flex items-start gap-4">
      <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-gold-500/10">
        {styledIcon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-cream-50/80 uppercase tracking-wide mb-0.5">
          {label}
        </span>
        <span className="font-semibold text-cream-50 break-words">
          {value}
        </span>
      </div>
    </div>
  );

  if (href) {
    const linkProps = external
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : {};
    return (
      <a
        href={href}
        className="block hover:bg-white/5 rounded-2xl -mx-2 px-2 py-1.5 transition-colors"
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  return content;
}

export function ContactInfoCard({
  contactInfo,
  className,
}: ContactInfoCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'relative rounded-3xl overflow-hidden bg-forest-900 border border-white/10 backdrop-blur-md',
        'p-6 sm:p-7 flex flex-col gap-5',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 50% 40% at 0% 0%, rgba(198,156,46,0.10), transparent 60%)',
        }}
      />

      <div className="relative flex flex-col gap-4">
        <InfoRow
          icon={<Phone aria-hidden />}
          label="Phone"
          value={contactInfo.phonePrimary}
          href={`tel:${contactInfo.phonePrimary}`}
        />

        <InfoRow
          icon={<MessageCircle aria-hidden />}
          label="WhatsApp"
          value={contactInfo.whatsapp}
          href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
          external
        />

        <InfoRow
          icon={<Mail aria-hidden />}
          label="Email"
          value={contactInfo.email}
          href={`mailto:${contactInfo.email}`}
        />

        <InfoRow
          icon={<MapPin aria-hidden />}
          label="Address"
          value={contactInfo.address}
          href={contactInfo.addressMapLink}
          external
        />
      </div>

      <div
        aria-hidden
        className="h-px w-full bg-white/10"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gold-500/10">
          <Clock className="h-5 w-5 text-gold-500" aria-hidden />
        </div>
        <span className="font-semibold text-cream-50">
          {contactInfo.openHours ?? 'Open 24x7'}
        </span>
      </div>
    </div>
  );
}
