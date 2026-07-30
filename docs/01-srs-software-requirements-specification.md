# Software Requirements Specification (SRS)
## Ankit Da Mess — Premium Guest House / PG / Room Rental Platform

**Version:** 1.0  
**Date:** 2026-07-29  
**Status:** DRAFT — Pending Client Approval  
**Document Owner:** Senior Full Stack Engineering Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Scope](#2-project-scope)
3. [System Requirements](#3-system-requirements)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Personas](#6-user-personas)
7. [User Stories](#7-user-stories)
8. [Design Constraints](#8-design-constraints)
9. [Acceptance Criteria](#9-acceptance-criteria)
10. [Glossary](#10-glossary)

---

## 1. Executive Summary

### 1.1 Purpose
This document defines the complete software requirements for **Ankit Da Mess**, a production-grade, premium guest house / PG / room rental booking platform. The platform targets students, working professionals, and visitors seeking monthly accommodation, delivering a luxury, hotel-grade digital experience.

### 1.2 Product Vision
Create an Apple / Airbnb / Booking.com-caliber web experience where every scroll, transition, and interaction feels cinematic and elegant, while the backend infrastructure scales to thousands of concurrent users and administrators manage 100% of content dynamically.

### 1.3 Business Objectives
- Increase booking inquiries by 40% within 6 months post-launch
- Achieve 95+ Lighthouse performance scores across all core metrics
- Reduce admin content management time by 70% via the custom Admin Dashboard
- Rank on Page 1 of Google for local guest house / PG search queries
- Achieve < 2s First Contentful Paint on 4G connections

### 1.4 Stakeholders
| Role | Name / Group | Responsibility |
|------|-------------|----------------|
| Business Owner | Ankit Da Mess Management | Vision, content approval, final sign-off |
| End Users | Students, Professionals, Visitors | Book rooms, browse, contact |
| Admin Users | Property Manager | CRUD all site content |
| Engineering Team | Senior Full Stack Team | Design, build, deploy, maintain |

---

## 2. Project Scope

### 2.1 In-Scope

#### Phase 1 (Public Site — Content First)
- **Navbar**: Sticky, glassmorphism, scroll-aware, mobile-animated, active-section indicator
- **Hero Section**: Video background + Ken Burns fallback, dark gradient overlay, floating particles, 3D building tilt, headline/CTA sequencing, scroll indicator
- **Gallery**: 3D glass slider + masonry grid, lightbox, 5 category filters (Rooms, Building, Kitchen, Terrace, Bathroom), lazy-loaded images, smooth transitions
- **Rooms**: 3D hover cards, availability badges, image zoom, animated entrance, admin-editable data

#### Phase 2 (Content Second)
- **Virtual Tour**: Video component, architecture-ready for future interactive 360° tour
- **Why Choose Us**: Animated feature cards, animated counters, premium icons, Google Ratings API integration hooks
- **Amenities**: Animated responsive grid, hover-glow effects
- **Location**: Embedded Google Maps, nearby places list, animated entrance

#### Phase 3 (Conversion + Closing)
- **Pricing**: 3D database-driven cards, tiered display, dynamic editing
- **Testimonials**: Glass-card carousel, Google Reviews API hooks
- **Contact**: Validated form (React Hook Form + Zod), email/WhatsApp/Call CTAs, Google Map embed
- **Call-to-Action (CTA)**: Premium closing section
- **Footer**: Responsive, fully editable, social links, quick nav

#### Phase 4 (Admin Dashboard)
- **Authentication**: JWT + bcrypt secure admin login, protected routes
- **CRUD Operations**: Hero, Rooms, Gallery, Amenities, Testimonials, Location, Contact, CTA, Footer, Settings, Media
- **Media Upload**: Cloudinary integration, drag-and-drop, image optimization, delete confirmation
- **Settings Management**: Global site settings, social links, maps, availability toggles

#### Phase 5 (Optimization & Launch)
- Performance tuning (code splitting, lazy loading, image/video optimization, tree shaking)
- SEO (dynamic metadata, OG/Twitter cards, robots.txt, sitemap.xml, structured data, canonical URLs)
- Accessibility (WCAG 2.1 AA compliance, keyboard nav, ARIA, focus states, color contrast)
- Testing (unit, integration, E2E, cross-browser, responsive)
- Deployment to Vercel + MongoDB Atlas + Cloudinary
- Documentation

### 2.2 Out-of-Scope (Current Release)
- Multi-property / multi-location management
- Multi-language / i18n
- Online payment processing (Phase 2+ candidate)
- User account / booking dashboard for guests (Phase 2+ candidate)
- Real-time availability calendar sync
- Native iOS/Android apps
- Interactive 360° virtual tour (architecture only in Phase 2)

### 2.3 Assumptions
- Client will provide brand assets (logo, hero video, hero images, gallery images, room photos, amenity icons)
- Client has active subscriptions / free-tier accounts for: Vercel, MongoDB Atlas, Cloudinary, Resend / EmailJS, Google Maps (Maps JavaScript API + Places API)
- Client will provide a Google Business Profile API key (optional for reviews integration)
- Admin users will be seeded by engineering team (username/password provisioning out-of-band)

### 2.4 Dependencies
| Dependency | Purpose | Tier |
|-----------|---------|------|
| Next.js 15 | Full-stack React framework | Core |
| React 19 | UI library | Core |
| TypeScript 5+ | Type safety | Core |
| Tailwind CSS 4 | Utility-first CSS | Core |
| Framer Motion | React animations | UI |
| GSAP | Advanced scroll / timeline animations | UI |
| Lenis | Smooth scrolling | UX |
| @react-three/fiber | 3D visualizations (selective use) | UI |
| Swiper | Carousels / sliders | UI |
| React Hook Form | Form state | UI |
| Zod | Schema validation | UI + API |
| React Icons | Icon library | UI |
| MongoDB (Mongoose) | Database + ODM | Backend |
| JWT (jsonwebtoken) | Admin auth | Security |
| bcrypt | Password hashing | Security |
| Cloudinary SDK | Media storage / CDN | Storage |
| Resend / EmailJS | Transactional email | Forms |
| Google Maps APIs | Maps + Places | Location |

---

## 3. System Requirements

### 3.1 Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| End-User Device | 2GB RAM, 1.2GHz dual-core | 4GB RAM, 2GHz+ quad-core |
| Development Workstation | 8GB RAM, 4-core CPU, 20GB SSD | 16GB+ RAM, 8-core, 50GB+ SSD |
| Server (Vercel) | Vercel Hobby / Pro tier auto-scales | Pro tier (for production traffic) |

### 3.2 Software Requirements
- **Browsers (Supported)**:
  - Chrome 2 latest versions
  - Firefox 2 latest versions
  - Safari 2 latest versions
  - Edge 2 latest versions
  - Mobile Safari iOS 15+
  - Chrome Mobile Android 11+
- **Development Environment**:
  - Node.js 20.x LTS or 22.x LTS
  - npm 10+ / pnpm 9+
  - Git 2.40+
  - VS Code (recommended)

### 3.3 Network Requirements
- Minimum 4G / 5Mbps for hero video playback
- Offline: Service Worker + cached shell (Phase 5 stretch goal)

---

## 4. Functional Requirements

### 4.1 Public Frontend (FR-FE)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-FE-001 | Navbar starts transparent; applies blur + glassmorphism after 50px scroll | P0 | 1 |
| FR-FE-002 | Navbar highlights active section as user scrolls | P0 | 1 |
| FR-FE-003 | Mobile hamburger triggers smooth slide-in animated menu | P0 | 1 |
| FR-FE-004 | Hero autoplays muted looping video with fall-back image + Ken Burns | P0 | 1 |
| FR-FE-005 | Hero headline appears after 3D building tilt animation completes | P0 | 1 |
| FR-FE-006 | Scroll indicator animates and, on click, smooth-scrolls to next section | P0 | 1 |
| FR-FE-007 | Gallery supports 5 category filters with smooth transitions | P0 | 1 |
| FR-FE-008 | Gallery images render in masonry grid and open lightbox on click | P0 | 1 |
| FR-FE-009 | Gallery images lazy-load with LQIP / blur-up placeholder | P0 | 1 |
| FR-FE-010 | Room cards apply 3D perspective tilt on hover + image zoom | P0 | 1 |
| FR-FE-011 | Room cards display dynamic "Available / Filled" badge from DB | P0 | 1 |
| FR-FE-012 | Virtual Tour renders optimized MP4 with play/pause + fallback poster | P1 | 2 |
| FR-FE-013 | Why Choose Us counters animate from 0 to value on intersection | P1 | 2 |
| FR-FE-014 | Amenities grid animates staggered entrance on viewport entry | P1 | 2 |
| FR-FE-015 | Location embeds Google Maps with pinned property + nearby POIs | P1 | 2 |
| FR-FE-016 | Pricing cards have 3D hover elevation; highlight recommended tier | P1 | 3 |
| FR-FE-017 | Testimonials carousel auto-advances with pause-on-hover | P1 | 3 |
| FR-FE-018 | Contact form validates with Zod; shows inline error messages | P0 | 3 |
| FR-FE-019 | Contact form submit calls backend API → sends email via Resend/EmailJS | P0 | 3 |
| FR-FE-020 | Contact provides one-tap WhatsApp + Call buttons | P1 | 3 |
| FR-FE-021 | Footer renders editable quick-links, social icons, copyright | P1 | 3 |
| FR-FE-022 | Every section has a one-time entrance animation triggered by IntersectionObserver | P0 | All |

### 4.2 Admin Dashboard (FR-ADM)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-ADM-001 | Admin login page with email + password fields, show/hide password toggle | P0 | 4 |
| FR-ADM-002 | Successful login returns HttpOnly JWT; redirects to dashboard | P0 | 4 |
| FR-ADM-003 | Protected middleware: unauthenticated requests redirect to `/admin/login` | P0 | 4 |
| FR-ADM-004 | Dashboard sidebar nav: Overview, Hero, Rooms, Gallery, Amenities, Testimonials, Location, Contact, CTA, Footer, Settings, Media, Logout | P0 | 4 |
| FR-ADM-005 | Hero editor: upload/swap video, upload/select/reorder hero images, edit headline, sub-headline, primary/secondary CTA text + links | P0 | 4 |
| FR-ADM-006 | Rooms CRUD: name, description, price, capacity, bed count, size, availability status, featured flag, gallery array, amenities list | P0 | 4 |
| FR-ADM-007 | Gallery CRUD: upload image, assign category, caption, alt text, sort order; delete with confirmation; reorder via drag | P0 | 4 |
| FR-ADM-008 | Amenities CRUD: icon (react-icons key + custom upload), name, description, sort order | P1 | 4 |
| FR-ADM-009 | Testimonials CRUD: name, role, avatar, rating, review text, date, featured | P1 | 4 |
| FR-ADM-010 | Location editor: address, lat/lng, Google Maps embed URL, nearby places list | P1 | 4 |
| FR-ADM-011 | Contact editor: email, phone, WhatsApp number, form recipient address, map coordinates | P1 | 4 |
| FR-ADM-012 | CTA editor: heading, subheading, primary/secondary button text + links | P2 | 4 |
| FR-ADM-013 | Footer editor: tagline, quick links, social media links, copyright text | P2 | 4 |
| FR-ADM-014 | Settings: site name, site URL, OG default image, Google API key placeholder note, analytics ID | P2 | 4 |
| FR-ADM-015 | Media Library: grid view, search, bulk select, bulk delete, upload drag-drop, details sidebar (dimensions, size, URL) | P1 | 4 |
| FR-ADM-016 | All delete operations require 2-step confirmation modal | P0 | 4 |
| FR-ADM-017 | All forms show inline validation errors (Zod schema) and success toast on save | P0 | 4 |

### 4.3 Backend / API (FR-API)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-API-001 | All public GET endpoints return cached + revalidated data (Next.js ISR / SWR) | P0 | 1 |
| FR-API-002 | All admin mutations require valid JWT via Authorization header or HttpOnly cookie | P0 | 4 |
| FR-API-003 | Rate limiting: 100 req/min / IP for public endpoints; 500 req/min for admin | P0 | 4 |
| FR-API-004 | Input sanitization: Zod parse + DOMPurify on all text fields before DB write | P0 | 4 |
| FR-API-005 | Auth endpoint: `POST /api/admin/login` → returns JWT + sets HttpOnly cookie | P0 | 4 |
| FR-API-006 | Auth endpoint: `POST /api/admin/logout` → clears cookie | P0 | 4 |
| FR-API-007 | Auth endpoint: `GET /api/admin/me` → returns current admin profile | P0 | 4 |
| FR-API-008 | CRUD endpoints for all collections (see API Documentation v1.0) | P0 | 4 |
| FR-API-009 | Media upload endpoint validates file type (image/jpeg, image/png, image/webp, video/mp4), size (<= 10MB images, <= 100MB video) | P0 | 4 |
| FR-API-010 | Contact form endpoint validates recaptcha (optional), rate-limited to 5 submissions/hr/IP, sends email, stores copy in DB | P0 | 3 |
| FR-API-011 | Structured logging for all API calls; no PII in logs | P1 | 4 |

### 4.4 Database (FR-DB)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-DB-001 | MongoDB Mongoose schemas with type safety + timestamps | P0 | 4 |
| FR-DB-002 | Collections: `admins`, `hero`, `rooms`, `gallery`, `amenities`, `testimonials`, `locations`, `contacts`, `ctas`, `footers`, `settings`, `media`, `contact_submissions` | P0 | 4 |
| FR-DB-003 | Compound indexes: gallery.category + gallery.sortOrder, rooms.availability + rooms.featured, testimonials.featured + testimonials.createdAt | P0 | 4 |
| FR-DB-004 | Text index: rooms.name + rooms.description, gallery.caption | P1 | 4 |
| FR-DB-005 | Admin password stored as bcrypt hash (salt rounds ≥ 12) | P0 | 4 |
| FR-DB-006 | All timestamps (createdAt / updatedAt) auto-managed by Mongoose | P0 | 4 |
| FR-DB-007 | Soft-delete optional flag on media / gallery / rooms (deletedAt) | P2 | 4 |

### 4.5 SEO (FR-SEO)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-SEO-001 | Dynamic `<title>` and `<meta description>` per page from `settings` collection | P0 | 5 |
| FR-SEO-002 | OpenGraph + Twitter Card meta on all pages (with image URL fallback) | P0 | 5 |
| FR-SEO-003 | Canonical URLs on every page (from settings.siteUrl) | P0 | 5 |
| FR-SEO-004 | `robots.txt` dynamic (allow all public, disallow `/admin/*`, `/api/*`) | P0 | 5 |
| FR-SEO-005 | `sitemap.xml` auto-generated from pages + rooms + gallery (Next.js `sitemap.ts`) | P0 | 5 |
| FR-SEO-006 | JSON-LD structured data: `Hotel` schema (name, address, rating, priceRange, amenities, image, url), breadcrumbs | P0 | 5 |
| FR-SEO-007 | All `<img>` tags have non-empty, descriptive `alt` attributes (required in admin forms) | P0 | 4 |
| FR-SEO-008 | Semantic headings (single `<h1>` per page, logical `<h2>`/`<h3>` order) | P0 | All |

### 4.6 Accessibility (FR-A11Y)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-A11Y-001 | WCAG 2.1 AA color-contrast for all text (≥ 4.5:1 body, ≥ 3:1 large text) | P0 | 5 |
| FR-A11Y-002 | Full keyboard navigation; visible `:focus-visible` outline; no focus traps | P0 | All |
| FR-A11Y-003 | All interactive elements have `aria-label` where visible text is absent | P0 | All |
| FR-A11Y-004 | Landmarks: `<header>`, `<nav>`, `<main>`, `<section aria-labelledby>`, `<aside>`, `<footer>` | P0 | All |
| FR-A11Y-005 | Images have descriptive `alt`; decorative images use `alt=""` + `aria-hidden="true"` | P0 | All |
| FR-A11Y-006 | Hero video has `play/pause` accessible button + `aria-live` status | P1 | 1 |
| FR-A11Y-007 | Carousels (gallery, testimonials) have pause/play + prev/next aria-live region | P1 | 1+3 |
| FR-A11Y-008 | Respect `prefers-reduced-motion` — disable decorative animations | P0 | All |

---

## 5. Non-Functional Requirements

### 5.1 Performance (NFR-PERF)
| ID | Requirement | Target | Phase |
|----|-------------|--------|-------|
| NFR-PERF-01 | Google Lighthouse Performance | ≥ 95 | 5 |
| NFR-PERF-02 | First Contentful Paint (FCP) | ≤ 1.8s (4G, mid-tier) | 5 |
| NFR-PERF-03 | Largest Contentful Paint (LCP) | ≤ 2.5s | 5 |
| NFR-PERF-04 | Cumulative Layout Shift (CLS) | ≤ 0.1 | 5 |
| NFR-PERF-05 | First Input Delay (FID) / INP | ≤ 100ms | 5 |
| NFR-PERF-06 | Time to Interactive (TTI) | ≤ 3.5s | 5 |
| NFR-PERF-07 | 60 FPS sustained on scroll / animations (Chrome Performance tab) | < 10ms long tasks | All |
| NFR-PERF-08 | Bundle-size: First-load JS ≤ 120KB gzipped (no admin bundle) | Code-split per route + component | 5 |
| NFR-PERF-09 | Images served in AVIF/WebP with `sizes`/`srcset` via Cloudinary auto-format | — | 5 |
| NFR-PERF-10 | Hero video preload="metadata" + poster image; adaptive bitrate optional | — | 1 |
| NFR-PERF-11 | No layout shift: all images/videos have explicit aspect ratio wrappers | — | All |

### 5.2 Security (NFR-SEC)
| ID | Requirement | Phase |
|----|-------------|-------|
| NFR-SEC-01 | JWT issued with 2h expiry; refresh token 7d (HttpOnly + Secure + SameSite=Lax) | 4 |
| NFR-SEC-02 | Passwords bcrypt (rounds=12); lockout after 5 failed login attempts (15min) | 4 |
| NFR-SEC-03 | CORS: restrict admin API to same-site origin | 4 |
| NFR-SEC-04 | CSRF protection via double-submit cookie or SameSite | 4 |
| NFR-SEC-05 | No `.env` / secrets in client bundle (only `NEXT_PUBLIC_*`) | All |
| NFR-SEC-06 | XSS prevention: Zod + DOMPurify on all user-supplied HTML/text before render | 4 |
| NFR-SEC-07 | NoSQL injection prevention: Mongoose queries + input sanitization (no `$where`) | 4 |
| NFR-SEC-08 | File upload: extension + MIME + magic-byte check; sanitize filenames; no executable MIMEs | 4 |
| NFR-SEC-09 | Secure headers via `next.config.js`: CSP (nonce-based), X-Frame-Options, X-Content-Type, Referrer-Policy, Permissions-Policy | 5 |
| NFR-SEC-10 | Admin session invalidation on password change | 4 |

### 5.3 Scalability (NFR-SCALE)
- Stateless API handlers → Vercel auto-scales horizontally
- MongoDB Atlas cluster tier upgradable (M0 → M10 → M20 as needed)
- Media on Cloudinary CDN (280+ edge PoPs)
- Next.js ISR + edge caching for public pages

### 5.4 Maintainability (NFR-MAIN)
| ID | Requirement |
|----|-------------|
| NFR-MAIN-01 | Strict TypeScript — `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` enabled |
| NFR-MAIN-02 | Feature-based folder architecture; no cross-feature barrel imports |
| NFR-MAIN-03 | ESLint (`@typescript-eslint` + Next.js core rules) + Prettier enforced via pre-commit (Husky + lint-staged) |
| NFR-MAIN-04 | No `console.log` in production (ESLint rule + build error) |
| NFR-MAIN-05 | All shared UI in `@/components/ui` — reusable, typed props, no hardcoded content |
| NFR-MAIN-06 | All env vars typed and validated at app startup (`zod` schema) |

### 5.5 Availability / Reliability
- 99.9% uptime target (SLA covered by Vercel Pro + MongoDB Atlas M10+)
- Automated daily DB backup (Atlas default)
- Cloudinary asset backup enabled

---

## 6. User Personas

### 6.1 Priya Sharma — Student (Age 20)
- **Goal:** Find safe, affordable PG near her college within budget ₹8,000/month
- **Needs:** Clear pricing, photos of kitchen / bathroom, proximity to college, student reviews, WhatsApp inquiry
- **Device:** Mid-range Android, 4G, mobile-first
- **Pain Points:** Confusing sites, hidden fees, old photos, no availability info

### 6.2 Rahul Verma — Working Professional (Age 28)
- **Goal:** Furnished monthly room close to IT park, ₹15,000–₹20,000 budget, WiFi + meals
- **Needs:** High-res photos, 3D tour, amenities grid, availability badge, direct booking via call/WhatsApp
- **Device:** MacBook + iPhone, Wi-Fi 6
- **Pain Points:** Low-quality imagery, lack of nearby places, slow sites

### 6.3 Mrs. Gupta — Visitor / Relocator (Age 45)
- **Goal:** 2–3 months temporary accommodation while her apartment is renovated
- **Needs:** Google Maps location, nearby markets/hospitals, call button, testimonials, pricing clarity
- **Device:** iPad, desktop
- **Pain Points:** Confusing navigation, no clear "contact us"

### 6.4 Ankit (Owner) — Admin User (Age 32)
- **Goal:** Update room prices, swap hero seasonally, upload new gallery without calling a developer
- **Needs:** Intuitive dashboard, drag-drop uploads, instant preview, safe deletes
- **Device:** Desktop + occasional tablet

---

## 7. User Stories

### 7.1 Public Users
- **US-01:** As a Student, I can filter gallery by "Rooms" so I quickly see only bedrooms.
- **US-02:** As a Professional, I can click a room card's "Available" badge and see a WhatsApp pre-filled message.
- **US-03:** As a Visitor, I can click the hero scroll indicator and move smoothly to the Gallery section.
- **US-04:** As a user on mobile, I can tap the hamburger and the menu slides in with an elegant animation.
- **US-05:** As a parent, I can view the Amenities grid to see meals, WiFi, laundry, security before calling.
- **US-06:** As a guest, I can view the Google Map, then tap "Open in Google Maps" for turn-by-turn navigation.

### 7.2 Admin Users
- **US-07:** As Admin, I can log in and upload a new hero video and see it previewed instantly.
- **US-08:** As Admin, I can mark a Room "Filled" and the badge updates on the homepage without developer help.
- **US-09:** As Admin, I can bulk-upload 15 kitchen photos and set their category to Kitchen.
- **US-10:** As Admin, I can accidentally click Delete and a modal asks "Are you sure?" to prevent data loss.
- **US-11:** As Admin, I can edit the Footer social links and they update the live site in <60s (ISR revalidate).

---

## 8. Design Constraints

1. **Exact Design Fidelity:** Layout, spacing, typography hierarchy, color palette, component arrangement, and premium appearance of the uploaded reference design must be preserved pixel-perfect. No redesign.
2. **Design Style Lock:** Premium / Luxury / Modern / Glassmorphism / Minimal / Clean / Professional — no deviation.
3. **Apple-Level Smoothness:** Lenis smooth scrolling + GPU-accelerated transforms only; 60fps non-negotiable.
4. **No Flashy Animation:** All animations elegant, subtle, one-time (on viewport entry), honoring `prefers-reduced-motion`.
5. **No Hardcoded Business Data:** All content (hero text, rooms, gallery, amenities, pricing, testimonials, location, contact, CTA, footer, socials) must originate from MongoDB and be editable via Admin Dashboard.
6. **Performance Lock:** 95+ Lighthouse, lazy loading, dynamic imports, code splitting, tree shaking, no full-library imports.
7. **Accessibility Lock:** WCAG 2.1 AA is the minimum bar.
8. **Phase-Gated Build:** No Phase 2 work before Phase 1 sign-off.

---

## 9. Acceptance Criteria

### 9.1 Phase Exit Criteria
Each phase is marked DONE only when:
- [ ] All functional/non-functional requirements of the phase are implemented
- [ ] ESLint + TS strict: 0 errors, 0 warnings
- [ ] Responsive QA pass on viewports: 320px, 375px, 425px, 768px, 1024px, 1280px, 1440px, 1920px
- [ ] Cross-browser pass: Chrome, Firefox, Safari, Edge latest 2 versions
- [ ] No horizontal overflow on any viewport
- [ ] Animations honor `prefers-reduced-motion`
- [ ] Client demo + written approval received

### 9.2 Final Launch Acceptance
- [ ] Lighthouse ≥ 95 across all 4 categories (Performance, Accessibility, Best Practices, SEO)
- [ ] `npm run build` succeeds with 0 warnings
- [ ] All admin CRUD operations tested end-to-end
- [ ] Contact form delivers email successfully (Resend/EmailJS)
- [ ] Production deployment to Vercel, DB on Atlas, media on Cloudinary
- [ ] SEO: robots.txt, sitemap.xml, OG/Twitter, JSON-LD all validated
- [ ] Client sign-off on final UAT

---

## 10. Glossary

| Term | Definition |
|------|------------|
| PG | Paying Guest accommodation (typically shared, meals included) |
| ISR | Incremental Static Regeneration (Next.js) |
| SWR | Stale-While-Revalidate (Next.js data fetching hook) |
| CLS | Cumulative Layout Shift (Core Web Vital) |
| LCP | Largest Contentful Paint (Core Web Vital) |
| INP | Interaction to Next Paint (Core Web Vital replacing FID) |
| Ken Burns | Slow zoom + pan animation applied to a still image |
| Glassmorphism | Semi-transparent backdrop + blur UI aesthetic |
| LQIP | Low-Quality Image Placeholder (blur-up technique) |
| ISR | Incremental Static Regeneration |
| P0/P1/P2 | Priority: Must-have / Should-have / Nice-to-have |

---

**End of SRS Document v1.0**
