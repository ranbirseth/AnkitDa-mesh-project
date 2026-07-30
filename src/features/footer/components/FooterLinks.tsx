'use client';

import * as React from 'react';
import Link from 'next/link';
import type { FooterQuickLink } from '@/types';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { cn } from '@/lib/cn';

interface FooterLinksProps {
  readonly title: string;
  readonly quickLinks: ReadonlyArray<FooterQuickLink>;
  readonly className?: string;
}

export function FooterLinks({ title, quickLinks, className }: FooterLinksProps): React.ReactElement {
  const { scrollTo } = useSmoothScroll();

  const sortedLinks = React.useMemo(() => {
    return [...quickLinks].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [quickLinks]);

  const handleLinkClick = React.useCallback(
    (href: string, isAnchor: boolean | undefined, e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isAnchor || !href.startsWith('#')) return;
      e.preventDefault();
      const id = href.slice(1);
      scrollTo(`#${id}`, { offset: -88 });
    },
    [scrollTo],
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <h4 className="font-display text-cream-50 mb-4 text-lg">{title}</h4>
      <ul className="space-y-2">
        {sortedLinks.map((ql) => (
          <li key={ql.id}>
            <Link
              href={ql.href}
              onClick={(e) => handleLinkClick(ql.href, ql.isAnchor, e)}
              className={cn(
                'text-cream-100/60 text-sm transition-colors duration-200',
                'hover:text-gold-400 hover:underline-offset-4 hover:underline',
              )}
            >
              {ql.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
