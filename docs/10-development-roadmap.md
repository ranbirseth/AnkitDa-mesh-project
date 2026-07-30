# Development Roadmap
## Ankit Da Mess — Phase-Gated, Client-Approval Based

**Total Estimated Effort** (Senior team, 1 engineer, focus sessions): **12 – 16 weeks**  
**Total Estimated Effort** (2 senior engineers parallel): **7 – 9 weeks**

> **Rule**: Every Phase has a **Hard Stop → Client Demo → Written Approval → Next Phase** gate. No forward progress in Phase N+1 until Phase N signed off.

---

## Milestone Overview

```
     ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
     │ Phase │   │ Phase │   │ Phase │   │ Phase │   │ Phase │
     │   1   │   │   2   │   │   3   │   │   4   │   │   5   │
     │       │   │       │   │       │   │       │   │       │
     │Navbar │   │V-Tour │   │Pricing│   │ Admin │   │ Opt & │
     │ Hero  │──▶│ Why Us│──▶│Testim.│──▶│ Auth  │──▶│Deploy │
     │Gallery│   │Amenity│   │Contact│   │  CRUD │   │  & QA │
     │ Rooms │   │Location│  │ CTA + │   │ Media │   │       │
     │       │   │       │   │Footer │   │Setting│   │       │
     │ 2 wk  │   │ 2 wk  │   │ 2 wk  │   │ 4 wk  │   │ 2 wk  │
     └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘
         ▼ SIGN-OFF   ▼ SIGN-OFF   ▼ SIGN-OFF   ▼ SIGN-OFF   ▼ LAUNCH
```

---

## 0. Pre-Phase 0 — Project Bootstrap (1 – 2 days)

### Goal
Repo ready; tooling locked; build passes on empty scaffold.

**Deliverables**
- [x] Documents (this `docs/` folder, all 10 files)
- [ ] Initialize Next.js 15 + React 19 + TypeScript strict + Tailwind v4
- [ ] `tsconfig.json` — strict: true, noImplicitAny: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes, noUnusedLocals, noUnusedParameters
- [ ] ESLint + Prettier + Husky pre-commit (lint-staged runs `eslint --fix` + `prettier --write`)
- [ ] `.env.example` — all keys listed (no values)
- [ ] Package.json — strict curated deps (see list below)
- [ ] Feature-based folders scaffolded (empty `index.ts` files per feature)
- [ ] MongoDB Mongoose singleton (`server/db/connect.ts`)
- [ ] Seed script + base singleton documents (hero/footer/cta/settings empty skeletons so public site doesn't 500)
- [ ] Lenis Provider + Framer Motion Providers set up in layout
- [ ] `npm run dev` → running, `npm run build` → 0 warnings/errors on empty shell
- [ ] Vercel + MongoDB Atlas + Cloudinary dev accounts linked

**Dependencies Locked (vetted; no extras added without sign-off)**
```
# Core Framework
next@15     react@19     react-dom@19     typescript@5
# Styling
tailwindcss@4   postcss   autoprefixer   clsx   tailwind-merge
# Animations
framer-motion    gsap    @studio-freight/lenis    swiper
# Forms & Validation
react-hook-form    @hookform/resolvers    zod
# Database + Auth
mongoose    bcryptjs    jsonwebtoken
# Media
cloudinary    next-cloudinary    formidable (or next's built-in formData parser)
# Email
resend    (or @emailjs/browser — Resend preferred)
# Icons
react-icons
# Utilities
nanoid    @radix-ui/react-dialog (and 15+ primitives in §UI architecture)
            NOTE: Radix primitives imported ad-hoc, never the entire @radix-ui package.
# Dev only
eslint   eslint-config-next   @typescript-eslint/eslint-plugin
prettier   husky   lint-staged   @types/node   @types/bcryptjs
@types/jsonwebtoken
```

---

## 1. Phase 1 — Navbar, Hero, Gallery, Rooms (≈ 2 weeks)

**Goal**: Public site "above the fold" is visually pixel-perfect, animated premium, responsive, data-driven (from DB via seed).

### Sub-Phases

#### Week 1 — Foundation + Navbar + Hero
- [ ] Day 1–2: Build all `components/ui/*` primitives used by Phase 1 (button, badge, card, image, dialog, drawer, separator, skeleton, sonner/toast, tooltip, scroll-area).
- [ ] Day 2: Build `features/shared/*` (Container, SectionWrapper, AspectRatio, Reveal, hooks: useIntersectionObserver, useMediaQuery, useScrollProgress, lib/cn, animations/{variants,easings}).
- [ ] Day 3: Navbar feature — transparent→glass, active section scroll-spy, mobile drawer animated menu, logo, nav-config, smooth scroll.
- [ ] Day 4–5: Hero feature — Video bg + Ken Burns fallback, dark gradient overlay, FloatingParticles (GSAP), BuildingTilt3D, HeroHeadline sequenced clip-reveal, CTAs, ScrollIndicator.

#### Week 2 — Gallery + Rooms + Public Data plumbing
- [ ] Day 6: Gallery schema + seed + Gallery Filters / Masonry / Lightbox / GlassSlider (Swiper).
- [ ] Day 7–8: Rooms schema + seed + RoomCard 3D hover, AvailabilityBadge, image zoom, grid entrance reveal.
- [ ] Day 9: API layer — all `/api/public/{hero,rooms,gallery}` endpoints; ISR tags set; middleware skeleton.
- [ ] Day 10:
  - Responsive QA pass 320/375/425/768/1024/1280/1440/1920 — No horizontal overflow.
  - Animations audit: 60FPS on CPU 6× slowdown; no CLS; `prefers-reduced-motion` honored.
  - Lighthouse: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90 (SEO is Phase 5).
  - Fix bugs, polish details.

**Exit Gate — Phase 1 Client Demo**:
- [ ] Deployed to Vercel Preview URL
- [ ] Client walks through on real devices (laptop + mobile)
- [ ] Design fidelity sign-off on Navbar / Hero / Gallery / Rooms layout and motion
- [ ] Responsive + animation sign-off
- [ ] Written approval (email / comment) → proceed to Phase 2

---

## 2. Phase 2 — Virtual Tour, Why Choose Us, Amenities, Location (≈ 2 weeks)

### Week 3 — Sections
- [ ] Day 11: Virtual Tour — VideoPlayer component, controls, poster, lazy loading, placeholder architecture for future 360° tour.
- [ ] Day 12: Why Choose Us — counter animation (useCountUp), animated feature cards, ratings display architecture.
- [ ] Day 13: Amenities schema + seed + Amenities grid, hover-glow, responsive columns, custom icon upload support hooks.
- [ ] Day 14: Location schema + seed + Google Maps embed with API key restriction, nearby places list, animated entrance.

### Week 4 — Polish + QA
- [ ] Day 15: All sections wired to their public API + ISR tags; homepage composes all 8 sections so far.
- [ ] Day 16: Interior scroll smoothing — section anchor targets calibrated so navbar doesn't overlap headings.
- [ ] Day 17–18: Responsive QA across all viewports; animation FPS audit; accessibility (axe scan).
- [ ] Day 19–20: Fix bugs; polish.

**Exit Gate — Phase 2 Demo + Approval** (same checklist as Phase 1 exit for new sections + full scroll-through).

---

## 3. Phase 3 — Pricing, Testimonials, Contact, CTA, Footer (≈ 2 weeks)

### Week 5
- [ ] Day 21: Pricing — 3-tier 3D cards, recommended highlight, database-driven pricing objects.
- [ ] Day 22: Testimonials schema + seed + glass-card Carousel (Swiper), 5-star rating, Google Reviews API hooks.
- [ ] Day 23–24: Contact Section — ContactForm (React Hook Form + Zod), ContactInfoCards, QuickAction WhatsApp+Call floating buttons, Google Map inline.

### Week 6 — Conversion section + Footer
- [ ] Day 25: Contact API route — server-side validation, rate-limited, Resend/EmailJS email send + DB audit row in contact_submissions.
- [ ] Day 26: CTA schema + CTA section; Footer schema + Footer section with dynamic quick links + social icons.
- [ ] Day 27: Homepage finalized (all 13 sections composed). Sub-pages `/rooms`, `/rooms/[slug]`, `/gallery`, `/virtual-tour`, `/contact`, `/privacy`, `/terms` built with dynamic metadata.
- [ ] Day 28: Responsive + A11y + FPS audit. Fix.

**Exit Gate — Phase 3 Demo + Approval**. Public site is VISUALLY COMPLETE. Lighthouse should be ≥ 92 performance at this point.

---

## 4. Phase 4 — Admin Dashboard (≈ 4 weeks) — Longest Phase

**Goal**: 100% of public content is editable by non-technical admin. Zero developer intervention needed after handover.

### Week 7 — Auth + Admin Shell
- [ ] Day 29: Admin login page UI (split-screen, glass, show/hide password toggle).
- [ ] Day 30: AuthService (bcrypt, JWT issue/verify), login/logout/me API routes, `middleware.ts` edge guard.
- [ ] Day 31: Admin layout shell — Sidebar, Topbar, Breadcrumbs, useAdminAuth hook, ProtectRoute wrapper.
- [ ] Day 32: Admin Overview page — 4 stat cards, recent contact submissions table, quick actions.

### Week 8 — Singletons + Media Library
- [ ] Day 33–34: Hero editor — form + live preview pane, ImageUploader + MediaPicker.
- [ ] Day 35–36: Singletons in parallel — Location, Contact, CTA, Footer editors.
- [ ] Day 37: Settings editor.

### Week 9 — CRUD Collections (Rooms, Gallery, Amenities, Testimonials) + Media Library
- [ ] Day 38: Media Library (grid/list view, upload, bulk delete, details drawer, copy URL).
- [ ] Day 39: Rooms CRUD — Table, New/Edit form (tabs: Details/Media/Amenities/SEO), duplicate, delete confirm.
- [ ] Day 40: Gallery CRUD — drag-drop uploads, category bulk-assign, sortable drag list.
- [ ] Day 41: Amenities CRUD + Testimonials CRUD (shared DataTable + FormField components).

### Week 10 — Integration + Admin QA
- [ ] Day 42: All save flows wired → ISR revalidate tag call → site refreshes in <60s.
- [ ] Day 43: End-to-end admin manual test script executed (login, change every field, check live, delete, confirm, recover).
- [ ] Day 44–45: Bug fixes, polish UX (toasts, dirty-form guard, optimistic UI).
- [ ] Day 46: Admin documentation draft written inline in tooltips + help icons.

**Exit Gate — Phase 4 Demo + Approval**:
- Owner performs *every* action in Admin Workflow doc without assistance → edits visible on live site in <60s.
- Security audit: JWT never leaked to console; non-admin user cannot hit `/api/admin/hero` with Postman.

---

## 5. Phase 5 — Optimization, SEO, Accessibility, Testing, Deployment, Documentation (≈ 2 weeks)

### Week 11 — Performance + SEO Hardening
- [ ] Day 47: Performance — bundle analyzer @next/bundle-analyzer → remove any >20KB surprise imports; tree-shake radix; dynamic import React Three Fiber (if used at all); only load Swiper modules we use.
- [ ] Day 48: Image optimization audit — Lighthouse; all `<Image>` components with correct `sizes`; Cloudinary f_auto,q_auto,w_ responsive; LQIP placeholders everywhere.
- [ ] Day 49: SEO implementation — dynamic metadata API; robots.ts; sitemap.ts; JSON-LD Hotel schema; canonical URLs; OG + Twitter cards per page; image alt tags required enforcement via Zod in admin.
- [ ] Day 50: Accessibility pass — axe-core 0 serious/critical; keyboard nav end-to-end test; focus-visible outlines; color contrast checker; reduced-motion honored end-to-end.

### Week 12 — Testing + Deployment + Docs
- [ ] Day 51: Testing —
  - Unit tests: AuthService, ContactEmailService, cn formatter (Vitest)
  - Integration tests: Public API endpoints (happy path + error paths)
  - E2E tests: Playwright scripts — homepage scrolls all sections, admin login creates a room, contact form sends
  - Cross-browser: CBT (Chrome, Firefox, Safari latest, Safari iOS 15+, Chrome Android)
- [ ] Day 52: Go-Live Checklist executed per Deployment Plan §6 — Pre-Go-Live.
- [ ] Day 53: **Launch day execution** (Deployment Plan §6.2) + smoke tests.
- [ ] Day 54–55: Post-launch stabilization; monitor 24h logs; fix any 0-day issues.
- [ ] Day 56:
  - Final documentation handover package (`docs/` + inline).
  - 30-min live walkthrough (Owner + key staff) of Admin Dashboard.
  - **Final Invoice + Client sign-off on UAT**.

---

## Risk Register & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Hero video 8MB+ hurts LCP on 4G | Medium | High | Deliver hero as image stack + Ken Burns FIRST; upgrade to video only via `matchMedia('(min-width: 1024px)')` + Network Information API (avoid video if `effectiveType=2g/3g`) |
| Design revision requests delay approval gates | High | Medium | Single point of contact on client side; 48h turn-around promised; any revision > 30 min of work counted as change order and scoped separately. |
| Admin UX deemed "too technical" by owner | Medium | High | Schedule a mid-Phase-4 "Admin UX preview" demo on Day 37; catch friction early. |
| Google Maps billing surprises | Low | Medium | Set daily API quota limits + billing alerts in Google Cloud Console; restrict API key by HTTP referrer strictly. |
| Vercel Hobby cold starts add latency | Low | Medium | Upgrade to Vercel Pro pre-launch; set ISR revalidate to 3600 to keep lambdas warm. |

---

## Change Control Process

All scope additions or design changes after Phase Approval follow this process:
1. Client submits a written change request (email / Notion card).
2. Engineering team evaluates effort + risk (≤ 4h / ≥ 4h).
3. ≤ 4h: Absorbed in buffer, no extra charge.
4. ≥ 4h: Formal change order with fixed cost + timeline impact; client written approval before work starts.

---

## Definition of DONE (per task)

- [ ] Code written; TS strict passes; no `any`; no `@ts-ignore`
- [ ] ESLint 0 errors, 0 warnings
- [ ] `npm run build` 0 warnings
- [ ] Responsive on 320→1920 (no horizontal scrollbar)
- [ ] Animations 60 FPS; no CLS; reduced-motion honored
- [ ] Accessibility: axe 0 serious, keyboard usable, focus visible
- [ ] Code review by senior engineer (self-reviewed with checklist in solo mode)
- [ ] Merged to main; Preview deployment green; smoke tests pass

---

**End of Development Roadmap v1.0**

---

> ⏭ **Next Step**: Client reviews all 10 documents in `docs/`, requests any adjustments to scope/architecture/timeline. After written approval of docs, engineering kicks off Pre-Phase 0 (Bootstrap) and Phase 1.
