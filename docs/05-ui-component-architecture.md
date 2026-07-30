# UI Component Architecture
## Ankit Da Mess — Design System + Feature Components

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                         App Routes                           │
│  (src/app/(site)/*.tsx, src/app/admin/*.tsx)                 │
│  Thin orchestrators; compose features + UI primitives        │
└──────────────────────────┬───────────────────────────────────┘
                           │ imports
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      Feature Modules                         │
│  src/features/{hero,rooms,gallery,amenities,...,admin}       │
│  ├── components/     Smart business-aware components         │
│  ├── hooks/          Domain-specific hooks                   │
│  ├── lib/            Domain helpers, schemas                 │
│  └── server/         DB queries (Server Components safe)     │
└──────────────────────────┬───────────────────────────────────┘
                           │ uses
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Shared Cross-Feature Layer (features/shared/*)              │
│  ├── SectionWrapper, Container, Reveal, AspectRatio          │
│  ├── useIntersectionObserver, useScrollProgress              │
│  ├── cn(), formatters, seo, fonts, validators                │
│  └── Animation variants, easings                             │
└──────────────────────────┬───────────────────────────────────┘
                           │ uses
                           ▼
┌──────────────────────────────────────────────────────────────┐
│          UI Primitives (src/components/ui)                   │
│  headless, accessible, zero-content, fully typed             │
│  button, input, card, dialog, tabs, tooltip, ...             │
│  Inspired by Radix UI + shadcn/ui patterns                   │
└──────────────────────────┬───────────────────────────────────┘
                           │ composed with
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                Providers (src/components/providers)          │
│  LenisProvider, FramerMotionProvider, GSAPProvider,          │
│  ThemeProvider, ToastProvider                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Design Tokens & Tailwind Theme

Tailwind `theme.extend` in `tailwind.config.ts`:

### 2.1 Color Palette (Luxury Neutral + Gold Accent)
```ts
colors: {
  brand: {
    50:   '#FBF8F2',
    100:  '#F4ECDB',
    200:  '#E7D6B2',
    300:  '#D4B881',      // soft gold
    400:  '#C19A58',      // warm gold
    500:  '#A97C3C',      // PRIMARY gold accent
    600:  '#8E6430',
    700:  '#6F4C26',
    800:  '#52371E',
    900:  '#352315',
  },
  ink: {
    50:   '#FAFAF9',
    100:  '#F3F2EF',      // off-white surface
    200:  '#E6E4DD',
    300:  '#C9C6BB',
    400:  '#9A9585',
    500:  '#6E695B',      // body text light mode
    600:  '#4A473D',
    700:  '#312F28',
    800:  '#1F1E19',      // deep ink
    900:  '#11110E',      // near-black
    950:  '#0A0A08',      // hero dark bg
  },
  glass: {
    light:   'rgba(255,255,255,0.06)',
    DEFAULT: 'rgba(255,255,255,0.08)',
    strong:  'rgba(255,255,255,0.14)',
    border:  'rgba(255,255,255,0.12)',
  },
  status: {
    available: '#10B981',
    filled:    '#EF4444',
    maintenance: '#F59E0B',
  }
}
```

### 2.2 Typography
Font stack (loaded via `next/font/google` as display subsets, preloaded):
```
Headline:    "Playfair Display" serif   — Elegant luxury display
Sub-head:    "Inter" Tight 600          — Crisp modern
Body:        "Inter" 400/500            — Readable UI
Mono:        "JetBrains Mono"           — Admin (prices, IDs)
```
Tailwind typography scale:
```
  h1: 72/80 (mobile: 44/1.15)   tracking: -0.02em
  h2: 56/1.1                    tracking: -0.015em
  h3: 36/1.2
  h4: 28/1.25
  body-lg: 18/28
  body: 16/26
  small: 14/22
  micro: 12/18
```

### 2.3 Spacing (8-pt grid)
Extended spacing for generous premium layout:
```
  '7xl': '9rem'   (144px section top/bottom)
  '8xl': '12rem'  (192px hero top)
```

### 2.4 Radius
```
  sm: 8px, md: 12px, lg: 16px, xl: 24px, 2xl: 32px, pill: 9999px
```

### 2.5 Shadows (Subtle, layered)
```
  'premium-xs':  '0 1px 2px rgba(0,0,0,0.04)'
  'premium-sm':  '0 2px 8px rgba(0,0,0,0.06)'
  'premium-md':  '0 8px 32px -8px rgba(0,0,0,0.12)'
  'premium-lg':  '0 24px 80px -16px rgba(0,0,0,0.22)'
  'glow-gold':   '0 12px 48px -8px rgba(169,124,60,0.35)'
```

### 2.6 Breakpoints
```
  sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px, 3xl: 1920px
```

---

## 3. UI Primitive Inventory (`src/components/ui/*`)

All primitives are headless via Radix UI primitives, wrapped in Tailwind, TypeScript-typed props, no content hardcoded. `forwardRef` + ref passthrough for a11y/forms.

| Component | Props | Behavior / Notes |
|-----------|-------|------------------|
| `button` | variant (primary/secondary/ghost/glass/outline/gold), size (sm/md/lg/xl/icon), asChild, disabled, loading | Ripple-less; focus-visible ring; `aria-disabled` |
| `input` | variant(default/glass), size, error, iconLeft, iconRight | autoComplete, aria-describedby for errors |
| `textarea` | rows, autosize, error | Resize-vertical |
| `select` | options[], placeholder, error | Radix select, custom scroll |
| `checkbox` / `switch` | label, checked, onCheckedChange | Radix + a11y |
| `badge` | variant (status:available/filled/maintenance, outline, soft, gold) | Compact, accessible color contrast |
| `card` | variant(default/glass/elevated/3d), asChild | Glass = backdrop-blur-md + bg-glass + border-glass-border |
| `dialog` | open, onOpenChange, title, description | Radix Dialog, scroll lock, focus trap |
| `drawer` | side(left/right), open, onOpenChange | Mobile menu, mobile filters |
| `tabs` | tabs[{value,label,content}], defaultValue | Radix, keyboard accessible |
| `accordion` | items[] | FAQ-ready, single/multi modes |
| `tooltip` | content, side, delayDuration | Radix, no touch fallback (popover) |
| `popover` | open, onOpenChange, trigger, content | Dropdown-like |
| `dropdown-menu` | items[], onSelect | Radix, admin topbar user menu |
| `separator` | orientation, spacing | hr, decorative |
| `avatar` | src, alt, fallback, size | Next/Image wrapper |
| `image` | src, alt, aspect, priority, blurDataURL, sizes | mandatory aspect; CLS-safe; LQIP blur-up; `sizes` auto-derived from container |
| `scroll-area` | children, maxHeight | Radix scrollbar |
| `progress` | value, max, color, animated | Bar |
| `skeleton` | className, aspect, variant(text/rect/circle) | Shimmer gradient, prefers-reduced-motion |
| `sonner/toast` | | Global toaster; admin save/delete toasts |
| `form` | (react-hook-form + zod) `Field`, `FieldError`, `FormProvider` wrapper | Validation state styles |

---

## 4. Shared Cross-Feature Components (`src/features/shared/components`)

These are **not** design primitives (they are layout wrappers with behavior).

| Component | Props | Purpose |
|-----------|-------|---------|
| `Container` | size (narrow/default/wide/full), as | Max-width centering: `narrow: 960px, default: 1280px, wide: 1536px, full: 100%` |
| `SectionWrapper` | id, eyebrow, heading, subheading, align(center/left), padding(default/sm/none), className, children | Standard section shell + Reveal entrance + `aria-labelledby` semantic anchor target (each section gets id="hero"/"gallery"/"rooms" etc.) |
| `AspectRatio` | ratio(16/9, 4/3, 1/1, 3/4, 2/3, custom) | CSS `aspect-ratio` + ResizeObserver fallback; image/video wrapper — zero CLS |
| `Reveal` | variant(fadeUp/fadeIn/slideInLeft/slideInRight/zoomIn/clipReveal), delay, offsetY, triggerOnce=true, threshold=0.15, margin, disabled | IntersectionObserver wrapper around a Framer Motion `motion.div` — **standard one-shot entrance** for EVERY child in every section. Honors `prefers-reduced-motion` (renders children statically). |
| `BlurFadeImage` | src, alt, aspect, priority, sizes | next/image + placeholder=blur + crossfade on load |

---

## 5. Feature Component Maps

### 5.1 Navbar (`features/navbar`)
- `Navbar.tsx` — Sticky root (`position: sticky; top: 0; z-index: 50`), transparent → glass on scroll (threshold 48px).
- `Logo.tsx` — Inline SVG + wordmark, white on transparent, gold-tinted on glass backdrop.
- `NavLinks.tsx` — Text links with active-section underline (gold, 2px).
- `MobileMenu.tsx` — Drawer (right-side, slide-in + staggered reveal of links + backdrop fade).

### 5.2 Hero (`features/hero`)
- `HeroSection.tsx` — Composes the stack, full-screen min-h-screen with padding-top for navbar.
- `HeroBackground.tsx` — Layered: dark-gradient-overlay → (video autoplay muted loop poster OR Ken Burns image stack).
- `FloatingParticles.tsx` — GSAP-generated 20-40 soft gold particles, transform: translate + opacity, no layout trigger.
- `BuildingTilt3D.tsx` — Container tilt via Framer Motion useMotionValue(0,0) + mouse move (desktop only; pointer-events disabled when reduced-motion).
- `HeroHeadline.tsx` — Sequenced reveal: headline (clip-reveal) → subhead (fadeUp 150ms after) → CTAs (stagger fadeUp after headline completes).
- `HeroCTA.tsx` — Primary (gold) + secondary (glass-outlined) buttons; press micro-interaction.
- `ScrollIndicator.tsx` — Chevron + vertical line animate, onClick → Lenis scrollTo #gallery.

### 5.3 Gallery (`features/gallery`)
- `GallerySection.tsx` — Orchestrates: Filter chip bar → (Masonry grid OR Slider based on screen size).
- `GalleryFilters.tsx` — Pill tab bar (Rooms, Building, Kitchen, Terrace, Bathroom).
- `MasonryGrid.tsx` — 4/3/2/1 column CSS columns layout; items wrap in GalleryCard with stagger reveal.
- `GalleryCard.tsx` — Image + hover: scale(1.03) + gold border accent + caption fade; click opens lightbox.
- `GlassSlider.tsx` — Swiper with `effect: 'creative', grabCursor, loop, centeredSlides, parallax`.
- `Lightbox.tsx` — Modal (Dialog) + next/prev + keyboard esc/←/→ + pinch-zoom (optional).
- `useLightbox.ts` — State: open, index, methods: openAt(idx), close, next, prev.

### 5.4 Rooms (`features/rooms`)
- `RoomsSection.tsx` — Section wrapper → grid 3 → 2 → 1 column.
- `RoomCard.tsx` — Outer 3D perspective shell:
  - on mouse-move → perspective tilt (Room3DHover)
  - Image zoom 1.08 on hover (GPU only)
  - AvailabilityBadge top-right
  - Bottom glass overlay card: name, price, capacity
  - Primary CTA button "View Details" fades in on hover
- `Room3DHover.tsx` — Reusable 3D tilt HOC; sensitivity props, disabled on touch/reduced-motion.
- `AvailabilityBadge.tsx` — Status enum → badge variant + icon.
- `RoomAmenityChip.tsx` — Compact amenity icons.
- `RoomImageZoom.tsx` — Hover zoom wrapper with smooth transform.

### 5.5 Amenities (`features/amenities`)
- `AmenitiesSection.tsx` — Grid 6/4/3/2 with stagger reveal.
- `AmenityCard.tsx` — Icon top, name center, optional desc bottom; on hover: scale(1.02) + `shadow-glow-gold` (ambient gold).

### 5.6 Testimonials (`features/testimonials`)
- `TestimonialsSection.tsx`
- `TestimonialCard.tsx` — Glass variant with soft blur + 5-star rating + quote.
- `TestimonialCarousel.tsx` — Swiper loop, 3 per view on xl, prev/next buttons + dots.

### 5.7 Contact (`features/contact`)
- `ContactSection.tsx` — 2-column layout (map/info + form).
- `ContactForm.tsx` — React Hook Form + Zod. Field-level errors, submit disabled when invalid, toast on success.
- `ContactInfoCard.tsx` — 3 glass cards: Email, Phone, Address.
- `QuickActionButtons.tsx` — Sticky WhatsApp + Call floating buttons (mobile).

### 5.8 Admin Panel (`features/admin`)
- `AdminSidebar.tsx` — Fixed left, collapsible on xl, active-link gold.
- `AdminTopbar.tsx` — Breadcrumbs, search, notifications, user menu.
- `AdminStatCard.tsx` — KPI cards (total rooms, available, filled, messages).
- `DataTable.tsx` — TanStack Table + sort/filter/pagination, bulk delete.
- `FormField.tsx` — Reusable react-hook-form field (label, input, error, description).
- `ImageUploader.tsx` — Drag-drop zone → POST /api/admin/media/upload → progress bar → preview.
- `MediaPicker.tsx` — Modal grid of Media library; multi-select, confirm.
- `SortableList.tsx` — dnd-kit sortable (gallery order, amenity order).
- `ConfirmDialog.tsx` — "Are you sure?" delete confirm (reusable).

---

## 6. Composition Rules (Enforced by ESLint + Code Review)

1. **Single Responsibility**: Each component file = one named export component.
2. **No Business Data in UI Primitives**: `components/ui/*` must never import `features/*` or server code.
3. **Props First**: Component behavior is controlled via typed props (not globals/context unless necessary).
4. **Strict Props**: All props typed via `interface` (no `type` alias) when extending HTMLAttributes; no optional props without sensible defaults.
5. **Forward Refs**: All interactive primitives use `forwardRef<HTMLButtonElement, Props>` etc.
6. **A11y Required**: Every interactive element with invisible text gets `aria-label` prop (ESLint rule `jsx-a11y/control-has-associated-label`).
7. **`prefers-reduced-motion`**: All animated wrappers (`Reveal`, `BuildingTilt3D`, `Room3DHover`) disable non-essential transforms when media query matches.

---

**End of UI Component Architecture v1.0**
