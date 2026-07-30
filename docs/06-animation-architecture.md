# Animation Architecture
## Ankit Da Mess — High-Performance, 60FPS, Elegant Motion System

> **Rule Zero**: Every animation must feel **premium, elegant, and once-only**. Never flashy, never looped decoratively. Respect `prefers-reduced-motion`.

---

## 1. Animation Engine Stack

| Layer | Library | Use Case | Why |
|-------|---------|----------|-----|
| **Smooth Scrolling** | Lenis (`@studio-freight/lenis`) | Global wheel/touch smooth scroll, scroll-to-section | Native inertial feel; passes native events through; GSAP/Framer scrollTrigger-friendly |
| **React Declarative Animations** | Framer Motion | Section Reveals, route transitions, hover micro-interactions, mobile menu, lightbox | Declarative + `useInView`; integrates with React lifecycle |
| **Advanced Timelines / Scroll-Linked** | GSAP (`gsap/ScrollTrigger`) | Hero sequencing, Ken Burns, floating particles, counters, scroll progress bar | Precise timeline control, scrubbed scroll animations |
| **3D Tilt** | Framer Motion `useMotionValue` + CSS `transform: perspective() rotateX/Y` | Hero building tilt, Room cards 3D hover | GPU-accelerated; no R3F cost |
| **Carousels / Sliders** | Swiper + custom pagination | Gallery glass-slider, testimonials carousel | Feature-complete, a11y, touch-optimized |

---

## 2. Global Animation Contract

### 2.1 GPU-Only Properties (Allowed)
```
transform: translate3d, translate, scale, rotate, rotateX/Y/Z, perspective
opacity
filter: blur (use sparingly, small radius)
backdrop-filter: blur() (only for glass surfaces, once per surface)
```

### 2.2 Forbidden Animated Properties (CLS / Layout / Paint Triggers)
- `top`, `left`, `right`, `bottom`, `margin`, `padding` → use `translate*` instead
- `width`, `height` → use `scale` + fixed aspect-ratio boxes
- `font-size`, `line-height` → use `initial-scale` trick if absolutely required
- `box-shadow` → use `will-change: transform` + layered pseudo-shadows
- `background-position` for large images → use wrapper + `transform: scale(1.05)`

### 2.3 Performance Optimizations
1. **`will-change: transform, opacity`** applied only for the duration of active animations (add via IntersectionObserver 200ms before trigger, remove 200ms after).
2. **One-shot entrance animations**: Section children use `Reveal` wrapper with `triggerOnce: true`. Never re-animate on scroll-back.
3. **Stagger with moderation**: Stagger max 40ms, max 8 items per section. Truncate stagger to visible set on large lists.
4. **`transform3d` z=0 hack**: For hero video container, add `transform: translateZ(0)` to force compositor layer.
5. **Lenis Smooth Scroll Lockdown**:
   - `duration: 1.15` (slightly luxe, not floaty)
   - `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (OutExpo-like)
   - `smoothWheel: true`, `smoothTouch: false` (iOS native is smoother)
   - `syncTouchLerp: 0.1`
6. **Target 60 FPS**: Chrome DevTools Performance → CPU 6x slowdown must stay < 8ms/frame.

### 2.4 Accessibility
```ts
// features/shared/hooks/usePrefersReducedMotion.ts
const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
```
- **Honors reduced-motion globally**: `Reveal`, `Room3DHover`, `BuildingTilt3D`, `AnimatedCounter`, `FloatingParticles`, `KenBurns` all short-circuit and render statically if the query matches.
- **Flash mitigation**: All entrance animations start at their final position for SSR HTML, then JS hydrates back to initial state in the same frame (Framer `layoutId` + `initial` keyed by hydration-ready flag).

---

## 3. Animation Inventory — Per Section

### 3.1 Navbar Animations
| Trigger | Animation | Engine | Timing |
|---------|-----------|--------|--------|
| Scroll Y > 48px | Navbar: `y:0 → backdrop-blur-xl, bg-ink-950/60, border-b border-glass-border, paddingY 24→14` | Lenis scroll event → useState → CSS transition | 450ms, easeOutCubic |
| Scroll direction down | Hide (`y:-110%`) when > 300px and direction=down; reveal on direction up | Lenis `userData.direction` → Framer motion | 500ms, spring(0.6 stiffness) |
| Active section change | Underline pill slides horizontally under new active link | Framer AnimatePresence + layoutId | 400ms |
| Mobile open | Drawer: `x:100%→0`, Backdrop: `opacity:0→1`, Links: stagger fadeUp(12px) 50ms each | Framer Motion drawer | 450ms total |
| Hover nav link | `translateY(-1px)` + gold tint letter-spacing +12 | CSS transition | 250ms |

### 3.2 Hero Sequencing (Critical Path — Must Feel Cinematic)
```
TOTAL: 2.4s (plays once, never replays)
TIMELINE (GSAP TimelineLite + ScrollTrigger lock? NO — hero plays on mount)

┌ 0.00s  Video poster image crossfades in (<Image onLoadingComplete>)
│        Simultaneously: Gradient overlay fades in (opacity 0→1, 700ms)
│
├ 0.25s  Floating particles spawn staggered (24 particles; each fadeIn 0→.7 + drift y: -12, 4000ms loop, infinite but low-cost)
│
├ 0.50s  BuildingTilt3D container:
│          initial: scale(.96) rotateY(-4deg) rotateX(6deg) opacity(0)
│          → final: scale(1) rotateY(0) rotateX(0) opacity(1)
│          duration: 1.2s, ease: OutExpo
│
├ 1.30s  Headline (Playfair Display):
│          clip-reveal mask 0→100% y: +24→0
│          800ms, ease: OutCubic
│
├ 1.50s  Sub-headline: fadeUp(+16) 600ms
│
├ 1.80s  CTAs: stagger 90ms, bounce-in (spring stiffness 300 damping 20)
│
├ 2.20s  Scroll indicator: fade-in + infinite subtle bob (translateY 0↔8, ease: inOutSine 2.2s loop)
│
└ ─ Ken Burns image (when video fails to autoplay):
    scale(1) → scale(1.12) over 20s, translateX 0 → -2%, parallax offset tied to scrollY * 0.05
```

### 3.3 Gallery Section
- **Gallery Filters**: Selected pill slides via `layoutId` (like nav underline).
- **Masonry items**: Each wrapped in `Reveal(variant='fadeUp', offsetY=24, stagger=40ms)`. **Only once**.
- **Gallery card hover**: `transform: scale(1.03)` (CSS) + `box-shadow: premium-lg` via layered `::after` opacity 0→1 (avoids paint per frame).
- **Category change**: Outgoing masonry `opacity 1→0` (200ms) + `scale(.985)`; stagger 10ms. Incoming applies reveal fresh.
- **Lightbox open**: `AnimatePresence` → dialog scale(.9) opacity(0) → scale(1) opacity(1); image crossfades.

### 3.4 Rooms Section
- **Card entrance**: `Reveal(variant='zoomIn', offsetY=30, stagger=70ms)`.
- **Room card hover (3D Tilt)**:
  - MouseMove → Framer `useMotionValue` mouse X/Y within element → `perspective(900px) rotateY(x/-30) rotateX(y/30)` max ±7°.
  - Simultaneously: inner image `scale(1.08)` (transform only).
  - Glass info bar lifts `translateY(-4px)` and primary CTA button `opacity:0→1, translateY(8→0)`.
  - Touch fallback: tap → full press animation.
- **Availability badge**: First render → scale(0) spring pop (stiffness 400) once only.

### 3.5 Why Choose Us
- **Counter animation**: IntersectionObserver → `useCountUp` (requestAnimationFrame based, GSAP-less):
  - Ease: OutExpo, duration 1.8s, starts at `0` → DB value.
  - Number formatting: `Intl.NumberFormat` (comma-separated).
  - `+` suffix for "Happy Clients", "Years of Service".
- **Feature cards**: `Reveal(stagger=90ms)`.

### 3.6 Amenities Grid
- `Reveal(stagger=40ms, variant='fadeIn')`.
- Hover: `scale(1.03)` + `box-shadow: glow-gold` via filter:drop-shadow (GPU).

### 3.7 Location
- Map embed: fades in once iframe fires `load` event (wrap in Reveal disabled until then).
- Nearby places list: stagger fadeUp 40ms each.

### 3.8 Pricing
- Card entrance: `Reveal(variant='slideInLeft' for left / 'zoomIn' for middle / 'slideInRight' for right, 120ms offset)`.
- Recommended badge: top-right, 3D lift `translateY(-4)` rotate(4deg) with soft shadow pulse (low-frequency 5s opacity 0.7↔1 loop).
- Hover: `translateY(-6) + scale(1.01)` + `glow-gold`.

### 3.9 Testimonials
- Carousel autoplay 5.4s per slide; Swiper `effect: 'creative'`:
  - prev slide: translate(-90%, 0) rotate(-7deg) scale(.9), opacity 0.
  - next slide: translate(90%, 0) rotate(7deg) scale(.9), opacity 0.
- Glass card backdrop-blur subtly pulses on `swiper.activeIndex` change (opacity 0.06→0.1, 400ms).

### 3.10 Contact
- Form fields: focus → gold border 0→2px thickness (CSS transition).
- Submit button click: loading spinner (icon SVG rotate loop) → success → check icon spring-in.
- Map reveal: fade in on IntersectionObserver.

### 3.11 Footer
- In-view fadeUp for column groups, stagger 60ms.
- Social icons: hover → `translateY(-2)` + `fill: brand-500`.

### 3.12 Admin Panel
- Sidebar mobile toggle: same drawer animation as mobile nav.
- Form saves → `sonner` toast: slideUp + fade 350ms, auto-dismiss 4s.
- Confirm dialog: scale(0.9) → (1) with 100ms backdrop delay.
- Media grid items: load-in stagger fade 20ms.

---

## 4. Shared Animation Primitives (`features/shared/animations/`)

### 4.1 Framer Motion Variants (`variants.ts`)
```ts
const fadeUp = (offsetY = 24, stiffness = 120) => ({
  hidden: { opacity: 0, y: offsetY },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness, damping: 16 } }
});
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: .5 } } };
const slideInLeft  = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0, transition: { duration: .7, ease: [.22,1,.36,1] } } };
const slideInRight = { hidden: { opacity: 0, x:  60 }, show: { opacity: 1, x: 0, transition: { duration: .7, ease: [.22,1,.36,1] } } };
const zoomIn = { hidden: { opacity: 0, scale: .92 }, show: { opacity: 1, scale: 1, transition: { duration: .6, ease: [.22,1,.36,1] } } };
const clipReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show:   { clipPath: 'inset(0 0% 0 0)',  transition: { duration: .9, ease: [.76,0,.24,1] } }
};
const stagger = (delayChildren = 0.06, staggerChildren = 0.04) => ({
  show: { transition: { delayChildren, staggerChildren } }
});
```

### 4.2 Easings (`easings.ts`)
Exported for GSAP + CSS:
```ts
export const EASE_OUT_EXPO   = [0.22, 1, 0.36, 1];   // Hero headline
export const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1];  // Scroll transitions
export const EASE_OUT_BACK   = [0.34, 1.56, 0.64, 1]; // CTA springs
```

### 4.3 Centralized Hook: `Reveal` Component
All sections use this. Contract:
1. Attach `IntersectionObserver` with `rootMargin: -10% 0px`.
2. Fire once.
3. Forward `ref` + child count for stagger.
4. Honor `usePrefersReducedMotion()` hook (skip anim → render children directly).

---

## 5. Animation Budget (Strict Envelope)

| Metric | Budget |
|--------|--------|
| Max concurrent animated elements | ≤ 28 (hero + 1 section in-view) |
| Staggered children per render | ≤ 10 items |
| Scroll-linked GSAP scrub timelines | ≤ 1 per section |
| Backdrop-filter surfaces per viewport | ≤ 3 (navbar + 2 glass cards) |
| Hero particles on-screen | ≤ 40 (only transform + opacity) |
| Animated counters | ≤ 4 in Why Choose Us |

**Over-budget strategy**: If the list has 30 rooms, only stagger first 6; rest fadeIn flat.

---

## 6. Debug Mode

Toggle `NEXT_PUBLIC_ANIM_DEBUG=1` to:
- Outline all animating elements in red.
- Log animation count + FPS to console.
- Force `prefers-reduced-motion: reduce` on click of a secret footer hotspot (double-click logo 5×).

---

**End of Animation Architecture v1.0**
