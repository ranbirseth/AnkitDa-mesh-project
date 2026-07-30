'use client';

import { Button } from '@/components/ui/button';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, MessageCircle as WhatsAppIcon } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NAV_CONTACT_WHATSAPP, NAV_CONTACT_PHONE } from '@/constants';
import { cn } from '@/lib/cn';

/**
 * Footer placeholder for Phase 1.
 *
 * Note: The full footer (quick-links, contact info, socials, legal links, admin-editable content)
 * is built in Phase 3 per the approved roadmap.
 */
export function FooterPlaceholder(): React.ReactElement {
  const year = typeof Date !== 'undefined' ? new Date().getFullYear() : 2026;
  return (
    <footer
      className="relative mt-0 isolate border-t border-forest-900/8 bg-forest-950 text-cream-100/90"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container-page py-10 md:py-14">
        <Reveal
          variant="fadeUp"
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-2 max-w-md">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-forest-900 shadow-gold"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12 12 3l9 9" />
                  <path d="M5 10v10h14V10" />
                  <path d="M10 20v-6h4v6" />
                </svg>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-bold text-cream-50">
                  Ankit <span className="text-gold-400">Da Mess</span>
                </span>
                <span className="text-[0.7rem] uppercase tracking-[0.2em] text-cream-100/60">
                  Guest House &amp; PG
                </span>
              </div>
            </div>
            <p className="text-[0.9rem] leading-relaxed text-cream-100/70">
              Comfortable, safe and affordable living spaces for students and working
              professionals in Durgapur, West Bengal.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="glass" size="sm" className="!border-white/12">
                <a href={NAV_CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                  <WhatsAppIcon className="h-4 w-4 text-emerald-300" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="glass" size="sm" className="!border-white/12">
                <a href={NAV_CONTACT_PHONE} aria-label="Call Ankit Da Mess">
                  Call Now
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <SocialIcon label="Facebook" href="#">
                <FacebookIcon className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon label="Instagram" href="#">
                <InstagramIcon className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon label="WhatsApp" href={NAV_CONTACT_WHATSAPP}>
                <WhatsAppIcon className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="border-t border-white/6">
        <div className="container-page flex flex-col gap-3 py-5 text-[0.78rem] text-cream-100/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} Ankit Da Mess. All rights reserved.</p>
          <p className={cn('opacity-75')}>
            Built with care · Designed for comfort
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  readonly href: string;
  readonly label: string;
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream-100/85 transition-all hover:border-gold-400/40 hover:bg-gold-500/15 hover:text-gold-300"
    >
      {children}
    </a>
  );
}
