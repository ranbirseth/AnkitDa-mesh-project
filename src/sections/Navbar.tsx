'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Home as HomeIcon,
  Phone as PhoneIcon,
  MessageCircle as WhatsAppIcon,
  BedDouble as RoomsIcon,
  Grid3X3 as GalleryIcon,
  ListChecks as AmenitiesIcon,
  MapPin as LocationIcon,
  Star as TestimonialsIcon,
  Mail as ContactIcon,
} from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/cn';
import { NAV_CTA, NAV_LINKS } from '@/constants';
import { useScrollY, useScrollDirection } from '@/hooks/useScrollPosition';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/useMediaQuery';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { NAV_CONTACT_PHONE, NAV_CONTACT_WHATSAPP } from '@/constants';

const GLASS_THRESHOLD = 48;
const HIDE_THRESHOLD = 320;

const NAV_ICON_MAP: Readonly<Record<string, React.ComponentType<{ className?: string }>>> = {
  home: HomeIcon,
  rooms: RoomsIcon,
  amenities: AmenitiesIcon,
  gallery: GalleryIcon,
  location: LocationIcon,
  pricing: TestimonialsIcon,
  contact: ContactIcon,
};

export function Navbar(): React.ReactElement {
  const scrollY = useScrollY();
  const direction = useScrollDirection(10);
  const { scrollTo } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop();

  const scrolled = scrollY > GLASS_THRESHOLD;
  const hide = direction === 'down' && scrollY > HIDE_THRESHOLD && desktop;

  const [activeId, setActiveId] = React.useState<string>('home');
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Section spy via scroll progress (simple, performant)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const anchorEls = NAV_LINKS
      .filter((l) => l.isAnchor)
      .map((l) => document.getElementById(l.href.replace('#', '')))
      .filter((el): el is HTMLElement => el !== null);
    if (!anchorEls.length) return;

    let raf = 0;
    const onScroll = (): void => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const offset = 160;
        const vhCenter = window.scrollY + offset;
        let current = anchorEls[0]!.id;
        for (const el of anchorEls) {
          if (el.offsetTop <= vhCenter) current = el.id;
        }
        setActiveId(current);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const handleNavClick = React.useCallback(
    (href: string, isAnchor: boolean | undefined, e: React.MouseEvent) => {
      if (!isAnchor || !href.startsWith('#')) return;
      e.preventDefault();
      setMobileOpen(false);
      const id = href.slice(1);
      scrollTo(`#${id}`, { offset: -88 });
    },
    [scrollTo],
  );

  return (
    <motion.header
      initial={reduced ? false : { y: -120, opacity: 0 }}
      animate={{
        y: hide ? -140 : 0,
        opacity: 1,
      }}
      transition={{
        duration: reduced ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'fixed inset-x-0 top-0 z-[80] transition-[padding,background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out-expo',
      )}
      style={{
        WebkitBackdropFilter: scrolled ? 'saturate(1.5) blur(16px)' : 'blur(0px)',
        backdropFilter: scrolled ? 'saturate(1.5) blur(16px)' : 'blur(0px)',
        backgroundColor: scrolled ? 'rgba(11,43,19,0.72)' : 'rgba(11,43,19,0)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 18px 60px -30px rgba(6,25,11,0.45)' : 'none',
      }}
      role="banner"
    >
      <div className="container-page relative z-10 flex h-[72px] md:h-[84px] items-center justify-between gap-4">
        <Logo scrolled={scrolled} />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          <LayoutGroup id="nav-active-indicator">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.href.replace('#', '');
                return (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(link.href, link.isAnchor, e)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative inline-flex items-center rounded-full px-3.5 py-2 text-[0.83rem] font-semibold transition-colors duration-200',
                        scrolled || isActive ? 'text-cream-50' : 'text-cream-100/95',
                        'hover:text-gold-300',
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-400"
                          transition={{
                            type: 'spring',
                            stiffness: 320,
                            damping: 26,
                            mass: 0.7,
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        {/* Desktop CTA + Quick actions */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href={NAV_CONTACT_PHONE}
            aria-label="Call Ankit Da Mess"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream-50 hover:bg-white/10 transition-colors"
          >
            <PhoneIcon className="h-4 w-4" />
          </a>
          <a
            href={NAV_CONTACT_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream-50 hover:bg-white/10 transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
          <Button
            asChild
            size="md"
            variant="gold"
            className="shadow-gold text-forest-900"
          >
            <Link
              href={NAV_CTA.href}
              onClick={(e) => handleNavClick(NAV_CTA.href, NAV_CTA.isAnchor, e)}
            >
              <span className="sr-only">Navigation CTA:</span>
              {NAV_CTA.label}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <a
            href={NAV_CONTACT_PHONE}
            aria-label="Call Ankit Da Mess"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream-50"
          >
            <PhoneIcon className="h-4 w-4" />
          </a>
          <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="glass"
                size="icon-sm"
                aria-label="Open navigation menu"
                className="border-white/15"
              >
                <HamburgerIcon open={mobileOpen} />
              </Button>
            </DrawerTrigger>
            <DrawerContent side="right">
              <DrawerHeader>
                <Logo scrolled />
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Close navigation menu">
                    <span
                      className="block h-5 w-0.5 rotate-45 bg-forest-800"
                      style={{ boxShadow: '0 0 0 1px #0B2B13' }}
                    />
                    <span className="absolute block h-5 w-0.5 -rotate-45 bg-forest-800" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <DrawerBody>
                <nav aria-label="Mobile primary">
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map((link, idx) => {
                      const isActive = activeId === link.href.replace('#', '');
                      const NavIcon = NAV_ICON_MAP[link.id] ?? HomeIcon;
                      return (
                        <motion.li
                          key={link.id}
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: { opacity: 0, x: 24 },
                            show: { opacity: 1, x: 0, transition: { delay: 0.06 * idx, ease: [0.22, 1, 0.36, 1], duration: 0.4 } },
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={(e) => handleNavClick(link.href, link.isAnchor, e)}
                            className={cn(
                              'flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition-colors',
                              isActive
                                ? 'bg-forest-700/10 text-forest-900'
                                : 'text-forest-800 hover:bg-forest-700/6',
                            )}
                          >
                            <span>{link.label}</span>
                            <NavIcon className="h-4 w-4 text-gold-600" aria-hidden />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-3">
                <Button
                  asChild
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  <Link
                    href={NAV_CTA.href}
                    onClick={(e) => handleNavClick(NAV_CTA.href, NAV_CTA.isAnchor, e)}
                  >
                    {NAV_CTA.label}
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" size="md">
                    <a href={NAV_CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="forest" size="md">
                    <a href={NAV_CONTACT_PHONE}>
                      <PhoneIcon className="h-4 w-4" /> Call
                    </a>
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </motion.header>
  );
}

function Logo({ scrolled }: { readonly scrolled?: boolean }): React.ReactElement {
  return (
    <Link
      href="#home"
      onClick={(e) => {
        if (typeof window !== 'undefined') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className="flex items-center gap-2.5 rounded-full py-1 pr-3 group/logo"
      aria-label="Ankit Da Mess — Home"
    >
      <span
        aria-hidden
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden transition-colors',
          scrolled ? 'shadow-gold' : 'shadow-soft',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dyc33dchn/image/upload/v1785510737/ChatGPT_Image_Jul_31_2026_08_27_37_AM_spn3au.png"
          alt="Ankit Da Mess logo"
          width={40}
          height={40}
          className="h-10 w-10 object-cover rounded-xl"
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn('font-display text-lg font-bold', scrolled ? 'text-cream-50' : 'text-cream-50')}>
          Ankit <span className="text-gold-400">Da Mess</span>
        </span>
        <span className={cn('text-[0.65rem] font-semibold tracking-[0.18em] uppercase', scrolled ? 'text-cream-100/75' : 'text-cream-100/80')}>
          Guest House &amp; PG
        </span>
      </span>
    </Link>
  );
}

function HamburgerIcon({ open }: { readonly open: boolean }): React.ReactElement {
  return (
    <span className="relative inline-flex h-4 w-5 items-center justify-center">
      <motion.span
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute block h-0.5 w-5 rounded-full bg-current"
      />
      <motion.span
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute block h-0.5 w-5 rounded-full bg-current"
      />
      <motion.span
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute block h-0.5 w-5 rounded-full bg-current"
      />
    </span>
  );
}
