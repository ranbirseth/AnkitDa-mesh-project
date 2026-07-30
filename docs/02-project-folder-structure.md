# Project Folder Structure
## Ankit Da Mess — Feature-Based Architecture (Next.js 15 App Router)

```
ankit-da-mesh/
├── .husky/                           # Git hooks (pre-commit: lint-staged)
├── .vscode/                          # IDE settings (extensions.json, settings.json)
├── docs/                             # Project documentation (THIS FOLDER)
│   ├── 01-srs-software-requirements-specification.md
│   ├── 02-project-folder-structure.md
│   ├── 03-database-schema.md
│   ├── 04-api-documentation.md
│   ├── 05-ui-component-architecture.md
│   ├── 06-animation-architecture.md
│   ├── 07-admin-panel-workflow.md
│   ├── 08-authentication-flow.md
│   ├── 09-deployment-plan.md
│   └── 10-development-roadmap.md
│
├── public/                           # Static assets (served raw, never import)
│   ├── favicons/                     # Generated via realfavicongenerator.net
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   └── site.webmanifest
│   ├── og/                           # Default OG fallback image (1200x630)
│   │   └── default-og.png
│   ├── videos/                       # Hero fallback MP4 (small, optimized)
│   │   └── hero-fallback.mp4
│   ├── robots.txt                    # Dynamically generated in app/
│   └── sitemap.xml                   # Dynamically generated in app/
│
├── src/
│   │
│   ├── app/                          # ← NEXT.JS 15 APP ROUTER
│   │   ├── (site)/                   # Public site layout group (no /site segment in URL)
│   │   │   ├── layout.tsx            # Site Shell: <html><body>, Navbar+Footer, SEO, Fonts
│   │   │   ├── page.tsx              # Homepage → composes all sections
│   │   │   ├── rooms/
│   │   │   │   ├── page.tsx          # All rooms listing (SEO indexable)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Single room detail page
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx          # Full gallery page
│   │   │   ├── virtual-tour/
│   │   │   │   └── page.tsx          # Virtual tour standalone
│   │   │   ├── contact/
│   │   │   │   └── page.tsx          # Dedicated contact page
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx          # Legal / privacy policy
│   │   │   └── terms/
│   │   │       └── page.tsx          # Terms of service
│   │   │
│   │   ├── admin/                    # Admin dashboard (layout group protected by middleware)
│   │   │   ├── layout.tsx            # Admin shell: sidebar + topbar
│   │   │   ├── page.tsx              # Dashboard overview / analytics
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Unauthenticated login page
│   │   │   ├── hero/
│   │   │   │   └── page.tsx          # Hero editor
│   │   │   ├── rooms/
│   │   │   │   ├── page.tsx          # Rooms list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create room
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Edit room
│   │   │   ├── gallery/
│   │   │   │   ├── page.tsx          # Gallery list + upload
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Edit gallery item
│   │   │   ├── amenities/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── testimonials/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── location/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── cta/
│   │   │   │   └── page.tsx
│   │   │   ├── footer/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── media/
│   │   │       └── page.tsx          # Media library
│   │   │
│   │   ├── api/                      # ← NEXT.JS API ROUTES (Route Handlers)
│   │   │   ├── public/               # Unprotected GET endpoints
│   │   │   │   ├── hero/
│   │   │   │   │   └── route.ts      # GET /api/public/hero
│   │   │   │   ├── rooms/
│   │   │   │   │   ├── route.ts      # GET list
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── route.ts  # GET single
│   │   │   │   ├── gallery/
│   │   │   │   │   └── route.ts      # GET list (category query)
│   │   │   │   ├── amenities/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── testimonials/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── location/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── contact/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── cta/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── footer/
│   │   │   │   │   └── route.ts
│   │   │   │   └── settings/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── contact/
│   │   │   │   └── route.ts          # POST /api/contact — form submit (rate-limited)
│   │   │   │
│   │   │   ├── admin/                # Protected admin mutation endpoints
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/route.ts    # POST
│   │   │   │   │   ├── logout/route.ts   # POST
│   │   │   │   │   └── me/route.ts       # GET
│   │   │   │   ├── hero/
│   │   │   │   │   └── route.ts      # PUT (single doc)
│   │   │   │   ├── rooms/
│   │   │   │   │   ├── route.ts      # POST create, GET list (admin: all)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   │   ├── gallery/
│   │   │   │   │   ├── route.ts      # POST, GET
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   │   ├── amenities/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── testimonials/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── location/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── contact/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── cta/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── footer/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── settings/
│   │   │   │   │   └── route.ts
│   │   │   │   └── media/
│   │   │   │       ├── upload/
│   │   │   │       │   └── route.ts  # POST multipart → Cloudinary
│   │   │   │       ├── route.ts      # GET list
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts  # DELETE (Cloudinary + DB)
│   │   │   │
│   │   │   └── revalidate/
│   │   │       └── route.ts          # POST ?tag=hero,rooms → Next.js revalidateTag
│   │   │
│   │   ├── globals.css               # Tailwind directives + theme vars
│   │   ├── layout.tsx                # Root layout (empty, delegates to groups)
│   │   ├── not-found.tsx             # Global 404
│   │   ├── loading.tsx               # Global Suspense loading
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── robots.ts                 # Dynamic robots.txt
│   │   └── sitemap.ts                # Dynamic sitemap.xml
│   │
│   ├── features/                     # ← FEATURE-BASED MODULES (primary logic bucket)
│   │   │
│   │   ├── shared/                   # Cross-feature building blocks
│   │   │   ├── components/           # Non-UI domain components
│   │   │   │   ├── SectionWrapper.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── AspectRatio.tsx
│   │   │   │   └── Reveal.tsx        # IntersectionObserver one-shot reveal
│   │   │   ├── hooks/                # App-agnostic custom hooks
│   │   │   │   ├── useIntersectionObserver.ts
│   │   │   │   ├── useScrollProgress.ts
│   │   │   │   ├── useMediaQuery.ts
│   │   │   │   ├── useDebouncedCallback.ts
│   │   │   │   ├── useCountUp.ts
│   │   │   │   └── useLocalStorage.ts
│   │   │   ├── lib/                  # Pure helpers
│   │   │   │   ├── cn.ts             # className merge (clsx + tailwind-merge)
│   │   │   │   ├── formatters.ts     # currency, date, number
│   │   │   │   ├── seo.ts            # metadata builders
│   │   │   │   ├── fonts.ts          # Next/font/google config
│   │   │   │   └── validators.ts     # shared Zod schemas (email, phone, slug)
│   │   │   ├── types/
│   │   │   │   └── index.ts          # shared types (ApiResponse, Pagination, etc.)
│   │   │   └── animations/
│   │   │       ├── variants.ts       # Framer Motion variants (fadeUp, stagger, etc.)
│   │   │       └── easings.ts        # GSAP custom easings
│   │   │
│   │   ├── navbar/
│   │   │   ├── components/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── NavLinks.tsx
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   └── Logo.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useActiveSection.ts
│   │   │   │   └── useScrollDirection.ts
│   │   │   └── lib/
│   │   │       └── navConfig.ts      # Section anchor list
│   │   │
│   │   ├── hero/
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HeroBackground.tsx
│   │   │   │   ├── HeroHeadline.tsx
│   │   │   │   ├── HeroCTA.tsx
│   │   │   │   ├── ScrollIndicator.tsx
│   │   │   │   ├── FloatingParticles.tsx
│   │   │   │   └── BuildingTilt3D.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useKenBurns.ts
│   │   │   └── server/
│   │   │       └── getHeroData.ts    # DB query (ISR-cacheable)
│   │   │
│   │   ├── gallery/
│   │   │   ├── components/
│   │   │   │   ├── GallerySection.tsx
│   │   │   │   ├── GalleryFilters.tsx
│   │   │   │   ├── MasonryGrid.tsx
│   │   │   │   ├── GalleryCard.tsx
│   │   │   │   ├── GlassSlider.tsx
│   │   │   │   └── Lightbox.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLightbox.ts
│   │   │   ├── lib/
│   │   │   │   └── categories.ts
│   │   │   └── server/
│   │   │       └── getGalleryData.ts
│   │   │
│   │   ├── rooms/
│   │   │   ├── components/
│   │   │   │   ├── RoomsSection.tsx
│   │   │   │   ├── RoomCard.tsx
│   │   │   │   ├── RoomImageZoom.tsx
│   │   │   │   ├── AvailabilityBadge.tsx
│   │   │   │   ├── RoomAmenityChip.tsx
│   │   │   │   └── Room3DHover.tsx
│   │   │   └── server/
│   │   │       ├── getRooms.ts
│   │   │       └── getRoomBySlug.ts
│   │   │
│   │   ├── virtual-tour/
│   │   │   ├── components/
│   │   │   │   ├── VirtualTourSection.tsx
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   └── VirtualTourPlaceholder.tsx
│   │   │   └── server/
│   │   │       └── getVirtualTourData.ts
│   │   │
│   │   ├── why-choose-us/
│   │   │   ├── components/
│   │   │   │   ├── WhyChooseUsSection.tsx
│   │   │   │   ├── FeatureCard.tsx
│   │   │   │   └── AnimatedCounter.tsx
│   │   │   └── server/
│   │   │       └── getWhyChooseUsData.ts
│   │   │
│   │   ├── amenities/
│   │   │   ├── components/
│   │   │   │   ├── AmenitiesSection.tsx
│   │   │   │   └── AmenityCard.tsx
│   │   │   └── server/
│   │   │       └── getAmenities.ts
│   │   │
│   │   ├── location/
│   │   │   ├── components/
│   │   │   │   ├── LocationSection.tsx
│   │   │   │   ├── GoogleMapEmbed.tsx
│   │   │   │   └── NearbyPlaces.tsx
│   │   │   └── server/
│   │   │       └── getLocationData.ts
│   │   │
│   │   ├── pricing/
│   │   │   ├── components/
│   │   │   │   ├── PricingSection.tsx
│   │   │   │   └── PricingCard3D.tsx
│   │   │   └── server/
│   │   │       └── getPricingData.ts
│   │   │
│   │   ├── testimonials/
│   │   │   ├── components/
│   │   │   │   ├── TestimonialsSection.tsx
│   │   │   │   ├── TestimonialCard.tsx
│   │   │   │   └── TestimonialCarousel.tsx
│   │   │   └── server/
│   │   │       └── getTestimonials.ts
│   │   │
│   │   ├── contact/
│   │   │   ├── components/
│   │   │   │   ├── ContactSection.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── ContactInfoCard.tsx
│   │   │   │   └── QuickActionButtons.tsx   # WhatsApp + Call
│   │   │   ├── lib/
│   │   │   │   └── contactSchema.ts    # Zod form schema
│   │   │   └── server/
│   │   │       ├── getContactData.ts
│   │   │       └── sendContactEmail.ts
│   │   │
│   │   ├── cta/
│   │   │   ├── components/
│   │   │   │   └── CTASection.tsx
│   │   │   └── server/
│   │   │       └── getCTAData.ts
│   │   │
│   │   ├── footer/
│   │   │   ├── components/
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── FooterLinks.tsx
│   │   │   │   └── SocialIcons.tsx
│   │   │   └── server/
│   │   │       └── getFooterData.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── AdminSidebar.tsx
│   │       │   ├── AdminTopbar.tsx
│   │       │   ├── AdminStatCard.tsx
│   │       │   ├── DataTable.tsx
│   │       │   ├── FormField.tsx
│   │       │   ├── ImageUploader.tsx
│   │       │   ├── MediaPicker.tsx
│   │       │   ├── SortableList.tsx
│   │       │   ├── ConfirmDialog.tsx
│   │       │   ├── ToastContainer.tsx
│   │       │   └── ProtectRoute.tsx
│   │       ├── hooks/
│   │       │   ├── useAdminAuth.ts
│   │       │   ├── useToast.ts
│   │       │   └── useCRUD.ts              # Generic CRUD hook
│   │       └── lib/
│   │           └── adminApi.ts           # typed fetch wrapper with JWT cookie
│   │
│   ├── components/                     # ← HEADLESS UI PRIMITIVES (shadcn/ui-style, reusable)
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── image.tsx               # next/image wrapper w/ blur + skeleton
│   │   │   ├── scroll-area.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx              # Toast provider
│   │   │   └── form.tsx                # react-hook-form + zod field wrapper
│   │   └── providers/
│   │       ├── LenisProvider.tsx
│   │       ├── FramerMotionProvider.tsx
│   │       ├── GSAPProvider.tsx
│   │       ├── ThemeProvider.tsx       # Future dark-mode if needed
│   │       └── ToastProvider.tsx
│   │
│   ├── server/                         # ← SERVER-SIDE ONLY (database + secrets)
│   │   ├── db/
│   │   │   ├── connect.ts              # Mongoose singleton connect
│   │   │   └── connection-pool.ts
│   │   ├── models/
│   │   │   ├── Admin.ts
│   │   │   ├── Hero.ts
│   │   │   ├── Room.ts
│   │   │   ├── Gallery.ts
│   │   │   ├── Amenity.ts
│   │   │   ├── Testimonial.ts
│   │   │   ├── Location.ts
│   │   │   ├── Contact.ts
│   │   │   ├── CTA.ts
│   │   │   ├── Footer.ts
│   │   │   ├── Settings.ts
│   │   │   ├── Media.ts
│   │   │   └── ContactSubmission.ts
│   │   ├── repositories/                # Data-access layer (thin wrapper over Mongoose)
│   │   │   ├── AdminRepository.ts
│   │   │   ├── HeroRepository.ts
│   │   │   ├── RoomRepository.ts
│   │   │   ├── GalleryRepository.ts
│   │   │   ├── AmenityRepository.ts
│   │   │   ├── TestimonialRepository.ts
│   │   │   ├── LocationRepository.ts
│   │   │   ├── ContactRepository.ts
│   │   │   ├── CTARepository.ts
│   │   │   ├── FooterRepository.ts
│   │   │   ├── SettingsRepository.ts
│   │   │   └── MediaRepository.ts
│   │   ├── services/                    # Business logic (no DB coupling)
│   │   │   ├── AuthService.ts
│   │   │   ├── MediaUploadService.ts
│   │   │   ├── ContactEmailService.ts
│   │   │   ├── RevalidationService.ts
│   │   │   └── RateLimitService.ts
│   │   ├── middleware/                  # API handlers middleware (composable)
│   │   │   ├── withAuth.ts
│   │   │   ├── withRateLimit.ts
│   │   │   ├── withValidation.ts
│   │   │   └── withErrorHandler.ts
│   │   ├── lib/
│   │   │   ├── jwt.ts
│   │   │   ├── bcrypt.ts
│   │   │   ├── cloudinary.ts
│   │   │   ├── resend.ts
│   │   │   ├── sanitize.ts
│   │   │   └── env.ts                  # Zod-validated process.env
│   │   └── scripts/
│   │       └── seed.ts                 # First-time seed (default admin + base content)
│   │
│   └── middleware.ts                    # Next.js edge middleware (auth guard /admin/* except /admin/login)
│
├── .env.example                        # All required env vars (no secrets)
├── .env.local                          # (gitignored) developer secrets
├── .eslintrc.json                      # @next/eslint + typescript-eslint strict
├── .prettierrc                         # consistent formatting
├── .gitignore
├── next.config.ts                      # Next.js config (images, headers, CSP)
├── tsconfig.json                       # Strict TS — strict, noImplicitAny, noUncheckedIndexedAccess
├── tailwind.config.ts                  # Tailwind v4 theme (colors, fonts, animations)
├── postcss.config.js
├── package.json                        # Dependencies (strictly curated)
└── README.md                           # Quick start + links to docs/
```

---

## Design Principles for this Structure

1. **Feature-First**: Every business concern (hero, rooms, admin...) owns its components, hooks, server queries, lib. No cross-feature imports *except* through `features/shared/*` and `components/ui/*`.
2. **Clean Separation**:
   - `src/app/` = routes only (thin; they import & compose from `features/*`)
   - `src/features/` = the actual logic
   - `src/components/ui/` = design-system primitives (no business content)
   - `src/server/` = DB + secrets + services — MUST NEVER be imported on the client
3. **Server Queries**: `features/<X>/server/get*.ts` files can be called in Server Components (App Router) for maximum cache-ability / ISR.
4. **Typed API**: The entire `src/server/models` surface is TypeScript-strong and exposed to API routes exclusively via `server/repositories`.
5. **Admin Isolation**: Admin routes, components, and hooks live under `src/features/admin/*` — they are never imported by the public site tree, enabling maximum code-splitting.

---

**End of Folder Structure v1.0**
