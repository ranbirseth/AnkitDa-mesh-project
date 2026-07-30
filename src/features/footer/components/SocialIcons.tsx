'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import type { FooterSocialLink } from '@/types';
import { cn } from '@/lib/cn';

interface SocialIconsProps {
  readonly socialLinks: ReadonlyArray<FooterSocialLink>;
  readonly className?: string;
}

const PLATFORM_ICON_MAP: Readonly<Record<FooterSocialLink['platform'], keyof typeof LucideIcons>> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  whatsapp: 'MessageCircle',
  twitter: 'Twitter',
  linkedin: 'Linkedin',
  youtube: 'Youtube',
};

export function SocialIcons({ socialLinks, className }: SocialIconsProps): React.ReactElement {
  const validLinks = React.useMemo(() => {
    return socialLinks.filter((link) => link.url && link.url.trim().length > 0);
  }, [socialLinks]);

  if (validLinks.length === 0) {
    return <div className={cn('flex items-center gap-3', className)} aria-hidden />;
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {validLinks.map((link) => {
        const iconKey = PLATFORM_ICON_MAP[link.platform];
        const IconComponent = LucideIcons[iconKey] as React.ComponentType<{ className?: string }> | undefined;
        if (!IconComponent) return null;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream-100/85 transition-all hover:border-gold-400/40 hover:bg-gold-500/15 hover:text-gold-300"
          >
            <IconComponent className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
