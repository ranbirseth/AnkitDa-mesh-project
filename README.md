# 🏡 Ankit Da Mess

> **Luxury Guest House & PG Website · Durgapur, West Bengal**
>
> A premium, glassmorphism, high-performance marketing site for students & working professionals. Built with **Next.js 15 · React 19 · TypeScript · Tailwind · Framer Motion · GSAP · Lenis · SwiperJS · MongoDB (Mongoose) · Cloudinary**.

---

## ⚡ Quick Start (5 minutes)

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ankit-da-mess.git
cd ankit-da-mess

# 2. Install dependencies (requires Node.js ≥ 20.11.0)
npm install

# 3. Set up environment variables
copy .env.example .env.local
#   → Open .env.local — all Phase 1 keys have sensible defaults.
#   → Phase 2+ keys (MONGODB_URI, JWT_SECRET, etc.) are optional right now.

# 4. Start the dev server
npm run dev

# 5. Open in browser
#   → Local:    http://localhost:3000
#   → Network:  http://<your-ip>:3000
```

That's it. The site runs with **mock in-memory data** for Phase 1 so you can preview the full UI without any database or API keys.

---

## ⚙️ Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| **Node.js** | `>= 20.11.0` (LTS recommended) | Required by Next.js 15 engines in [package.json](package.json) |
| **npm** | `>= 10.x` (bundled with Node) | Package manager |
| (Optional) **Git Bash / WSL2** on Windows | Any | Some devs prefer a Unix shell; plain PowerShell works fine |
| (Optional) **MongoDB Atlas account** | Free tier | Only when you reach **Phase 4** (Admin CRUD) |
| (Optional) **Cloudinary account** | Free tier | Only when you reach **Phase 4** (Media Library) |
| (Optional) **Vercel account** | Hobby | Recommended for 1-click deployment |

> Check your Node version:
> ```bash
> node -v   # should print v20.11.x or newer
> npm -v    # should print 10.x or newer
> ```
> If outdated, download Node from [nodejs.org](https://nodejs.org/) or use `nvm` / `nvm-windows`.

---

## 📦 Full Installation Walkthrough (step-by-step)

### A. Get the code

```bash
# Option 1 — HTTPS
git clone https://github.com/your-username/ankit-da-mess.git

# Option 2 — SSH
git clone git@github.com:your-username/ankit-da-mess.git

# Option 3 — Download ZIP (no Git)
#   1. Click Code → Download ZIP on GitHub
#   2. Extract it into a folder

cd ankit-da-mess
```

### B. Install npm dependencies

```powershell
# PowerShell / Windows CMD
npm.cmd install

# macOS / Linux / WSL Bash
npm install
```

You will see:
```
changed 485 packages in 15s
185 packages are looking for funding
```
This is normal. Vulnerabilities (if printed) are **dev-only and acceptable for Phase 1**.

### C. Configure environment

```powershell
# Windows (PowerShell)
copy .env.example .env.local

# macOS / Linux / WSL
cp .env.example .env.local
```

**Phase 1 only:** you do NOT need to change anything. The boot-time env validator logs warnings for missing Phase 3–5 keys, but never breaks the dev server.

**Phase 2+ (later):** open `.env.local` and paste your real keys into the empty fields. All variables are documented inline in [`.env.example`](.env.example).

> **🔒 Never commit `.env.local`** — it is already listed in `.gitignore`.

### D. Run the development server

```bash
npm run dev
```

Expected output:

```
   ▲ Next.js 15.1.7
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 4.4s
 ✓ Compiling /
 ✓ Compiled / in 20.5s (4761 modules)
 GET / 200 in 22442ms
```

Open **http://localhost:3000** in Chrome/Edge/Firefox. The first request takes ~20s (cold compile). Subsequent requests are ~50–200ms.

---

## 🧰 Available Scripts

All commands are defined in [`package.json`](package.json). From the project root:

| Command | What it does | When to use |
|---------|-------------|-------------|
| `npm run dev` | Start **Next.js dev server** with HMR (hot module reload) on `http://localhost:3000`. Save a file → instant browser update. | **Everyday development.** |
| `npm run build` | Run **production build** (server + client bundles). Strictest check of everything. | **Before you deploy** or after big refactors. |
| `npm run start` | Start the **production build** locally (requires `npm run build` to succeed first). Runs on `http://localhost:3000`. | Validate a production build before deploy. |
| `npm run lint` | Run **ESLint** against the whole project using the `next/core-web-vitals` ruleset + custom rules. | After every big edit; required before commit. |
| `npm run typecheck` | Run **`tsc --noEmit`** (TypeScript strict compiler) — catches type bugs without bundling. | After every type/interface change. |
| `npm run format` | Run **Prettier** in write mode — auto-formats all `*.ts, *.tsx, *.css, *.json, *.md` files in `src/`. | Before commit; keeps the codebase consistent. |
| `npm run format:check` | Same as above but **does not write** — only reports files that differ from Prettier style. | Use in CI / pre-commit checks. |
| `npm run prepare` | Auto-run by npm on `npm install`; installs **Husky pre-commit hooks** (if `.git` folder exists). | Never run manually; runs automatically. |

### 🔁 Typical daily dev flow

```bash
git pull origin main            # 1. Pull latest
npm install                     # 2. If package.json changed
npm run typecheck               # 3. (Optional, quick) Type check
npm run lint                    # 4. (Optional) Lint check
npm run dev                     # 5. Start coding — HMR auto-reloads
# --- make your changes ---
npm run typecheck && npm run lint   # 6. Before you commit
npm run format                    # 7. Auto-format
npm run build                     # 8. Before PR/merge (final proof)
```

---

## 📁 Project Structure (High-Level)

```
ankit-da-mess/
├── docs/                           # All architecture & planning docs (10 files)
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
├── src/
│   ├── animations/variants.ts      # Framer Motion shared variants + easings
│   ├── app/                        # Next.js App Router
│   │   ├── (site)/                 # Route group (Navbar + Footer layout)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            # Homepage → all sections composed here
│   │   ├── layout.tsx              # Root: fonts, metadata, SEO, Providers
│   │   ├── providers.tsx           # Lenis scroll + Tooltip + Sonner toaster
│   │   ├── globals.css             # Tailwind layers + custom utilities
│   │   ├── robots.ts               # (shell) SEO — Phase 5
│   │   └── sitemap.ts              # (shell) SEO — Phase 5
│   ├── components/
│   │   ├── ui/                     # 11 shadcn-style Radix primitives
│   │   │   └── (button, badge, card, dialog, drawer, image,
│   │   │         separator, skeleton, sonner, tooltip)
│   │   ├── Container.tsx
│   │   ├── SectionWrapper.tsx      # Standardised section shell
│   │   ├── Reveal.tsx              # IntersectionObserver scroll-in
│   │   └── AspectRatio.tsx
│   ├── constants/index.ts          # NAV_LINKS, GALLERY_CATEGORIES, etc.
│   ├── hooks/                      # Custom React hooks
│   │   ├── useSmoothScroll.ts      # Lenis + native fallback
│   │   ├── useScrollPosition.ts    # scrollY + scroll direction
│   │   ├── useMediaQuery.ts        # SSR-safe matchMedia wrappers
│   │   └── useIntersectionObserver.ts
│   ├── lib/                        # cn(), env.ts, fonts.ts, seo.ts, formatters.ts
│   ├── sections/                   # One file per page-section feature
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── RoomsSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── PlaceholderSections.tsx # Amenities, Location, Reviews, Contact
│   │   └── FooterPlaceholder.tsx
│   ├── services/index.ts           # IHeroService / IRoomsService / IGalleryService
│   │                               #  → Phase 1 = MOCK; Phase 4 = real REST/Mongo
│   └── types/index.ts              # Zod schemas + TS domain types
├── .eslintrc.json                  # ESLint config
├── .prettierrc                     # Prettier config
├── tailwind.config.ts              # Tailwind theme (Forest/Gold/Cream palette)
├── next.config.ts                  # Next.js config (images, headers, package imports)
├── tsconfig.json                   # TypeScript strict config
├── postcss.config.js
├── .env.example                    # Environment variable template
├── .gitignore
├── package.json                    # All scripts + deps
└── package-lock.json
```

**Full, detailed folder architecture** is documented in [docs/02-project-folder-structure.md](docs/02-project-folder-structure.md).

---

## 🎯 Current Status — Phase 1 ✅

Phase 1 of 5 is complete (see [docs/10-development-roadmap.md](docs/10-development-roadmap.md) for the full 5-phase plan).

**Sections Live on the Homepage:**

| # | Section | File | Highlights |
|---|---------|------|------------|
| 1 | **Navbar** | [`Navbar.tsx`](src/sections/Navbar.tsx) | Glassmorphism on-scroll, auto-hide, scroll-spy, active gold underline, mobile drawer with staggered entrance, call/WhatsApp/CTA quick actions |
| 2 | **Hero** | [`HeroSection.tsx`](src/sections/HeroSection.tsx) | Full-viewport Ken Burns background, 28 gold floating particles, clip-reveal heading, staggered CTAs, magnetic hover buttons, 3D tilt building preview card, 6-chip amenities strip, scroll indicator |
| 3 | **Rooms** | [`RoomsSection.tsx`](src/sections/RoomsSection.tsx) | Swiper carousel with responsive breakpoints, 3D tilt cards, shine sweep, availability badges (Available · Filled · Maintenance), featured sparkle badge, ₹ price formatter, 4 feature icons per card |
| 4 | **Amenities** | [`PlaceholderSections.tsx`](src/sections/PlaceholderSections.tsx) | 8 glass cards, hover lift, "Included" badges, Phase 2 banner |
| 5 | **Gallery** | [`GallerySection.tsx`](src/sections/GallerySection.tsx) | Dual-layer: Featured Swiper "creative effect" 3D slider + CSS-columns masonry. 6 category filters, full lightbox with keyboard nav (Esc/←/→), image counter, featured autoplay carousel with pause-on-hover |
| 6 | **Location** | [`PlaceholderSections.tsx`](src/sections/PlaceholderSections.tsx) | Address/Railway/Colleges/Markets/Medical info cards + Durgapur aerial hero image + Google Maps CTA |
| 7 | **Reviews** | [`PlaceholderSections.tsx`](src/sections/PlaceholderSections.tsx) | 3 testimonial cards with avatars, 5-star ratings, stay metadata, decorative quote glyph |
| 8 | **Contact** | [`PlaceholderSections.tsx`](src/sections/PlaceholderSections.tsx) | Call/WhatsApp/Email direct cards, appointment banner, full enquiry form (name, phone, move-in date, room picker, message) with quick actions |
| 9 | **Footer** | [`FooterPlaceholder.tsx`](src/sections/FooterPlaceholder.tsx) | Branding, description, action buttons, socials, copyright |

**Data note:** Phase 1 uses a Mock Service Layer (see [`services/index.ts`](src/services/index.ts)). The interfaces `IHeroService`, `IRoomsService`, `IGalleryService` are preserved 1:1 when you swap to real MongoDB endpoints in Phase 4 — no UI changes needed.

---

## 🏗️ Build for Production

```bash
# 1. TypeScript strict check (catches 90% of bugs before build)
npm run typecheck

# 2. Lint check
npm run lint

# 3. Production build — bundles server + client, optimises images, etc.
npm run build
```

Expected end of `build` output:
```
Route (app)
├─ ○ /
○  (Static)  prerendered as static content

✓ Compiled successfully
```

Then run it locally:
```bash
npm run start
# Open http://localhost:3000
```

**For 1-click deployment** see [docs/09-deployment-plan.md](docs/09-deployment-plan.md) (recommended: **Vercel** — the Next.js team's platform, zero-config).

---

## 📚 Documentation Suite (10 files — `docs/` folder)

Read these to understand the full architecture before making large changes:

| # | Document | Read it if you want to… |
|---|----------|------------------------|
| 01 | [SRS — Software Requirements Specification](docs/01-srs-software-requirements-specification.md) | The "why" — goals, user personas, functional/non-functional requirements |
| 02 | [Project Folder Structure](docs/02-project-folder-structure.md) | The "where do I put this?" — feature-based architecture rules |
| 03 | [Database Schema (ERD)](docs/03-database-schema.md) | Phase 4: Mongoose schemas, collections, relationships |
| 04 | [API Documentation](docs/04-api-documentation.md) | Phase 3–4: REST endpoints, request/response envelopes, error codes |
| 05 | [UI Component Architecture](docs/05-ui-component-architecture.md) | UI primitives, CVA variants, design system tokens |
| 06 | [Animation Architecture](docs/06-animation-architecture.md) | Framer Motion + GSAP + Lenis conventions, GPU-only rules, reduced-motion patterns |
| 07 | [Admin Panel Workflow](docs/07-admin-panel-workflow.md) | Phase 4: Day-in-the-life for the non-technical building owner |
| 08 | [Authentication Flow](docs/08-authentication-flow.md) | Phase 4: JWT via HTTP-only cookies, bcrypt, role guard, middleware edge rules |
| 09 | [Deployment Plan](docs/09-deployment-plan.md) | Vercel + MongoDB Atlas + Cloudinary step-by-step, DNS, launch checklist |
| 10 | [Development Roadmap](docs/10-development-roadmap.md) | 5-phase, 12–16 week plan with hard approval gates between phases |

---

## 🔧 Common Development Tasks

### Add a new homepage section

1. Create `src/sections/YourSection.tsx`. Export a component `YourSection()` that returns a `<section>`.
2. Use `<SectionWrapper id="your-anchor" eyebrow="..." heading="..." subheading="...">` for consistent styling.
3. Register the anchor id in both:
   - `NAV_LINKS` inside [`constants/index.ts`](src/constants/index.ts) so Navbar scroll-spy picks it up
   - The section list inside [`app/(site)/page.tsx`](src/app/(site)/page.tsx) so it renders on the homepage
4. Run `npm run typecheck && npm run lint`.

### Add a new Lucide icon to a feature chip

1. Check the [Lucide icon list](https://lucide.dev/icons) for the exact icon name (no `Lu` prefix — e.g. `Wifi`, `BedDouble`).
2. Put that exact string into the `iconKey` field in your data.
3. The generic lookup pattern `LucideIcons[chip.iconKey] ?? LucideIcons.Home` does the rest — no imports needed.

### Swap mock data → real database (Phase 4 switch)

Edit [`services/index.ts`](src/services/index.ts):

```typescript
// BEFORE (Phase 1)
export const heroService: IHeroService = new MockHeroService();

// AFTER (Phase 4)
export const heroService: IHeroService = new RestHeroService(); // or MongoHeroService()
```

As long as `RestHeroService` implements the same `IHeroService` interface, **0 changes needed in any section file**. This is the core reason for the service layer abstraction.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm.cmd : The term 'npm.cmd' is not recognized` | Add Node.js to your PATH, then restart your terminal. Verify with `Get-Command npm.cmd`. |
| Dev server shows a blank page, console says `net::ERR_ABORTED` | Transient first-request compile issue. **Refresh the page** after you see `✓ Compiled / in …`. It happens only on the very first `GET /`. |
| Tailwind classes not updating (rare) | Stop dev server. Delete `.next/` folder. Run `npm run dev` again. |
| `husky || true` prints `.git can't be found` during `npm install` | Normal if you downloaded as ZIP instead of `git clone`. Pre-commit hooks only work inside a real Git repo. |
| Image URLs fail with 403 / Hotlink protection | Unsplash/Pexels images in mocks are hotlink-allowed in dev. In production always upload real photos to **Cloudinary** (Phase 4) — the `remotePatterns` in [`next.config.ts`](next.config.ts) already whitelist Cloudinary. |
| Build fails with `Type error: Property 'foo' does not exist on type '{}'` | Run `npm run typecheck` locally — 99% of the time it surfaces the same error with a clearer file+line than the build output. |

---

## 🛟 Support & Contributions

This is an internal, phase-gated client project. See the change-control process in [docs/10-development-roadmap.md § Change Control Process](docs/10-development-roadmap.md#change-control-process):

- ≤ 4h of work: absorbed in buffer, free.
- ≥ 4h: written change order required before engineering starts.

---

## 📄 License

© Ankit Da Mess — Proprietary & Confidential. Unauthorized copying, distribution, or commercial use of the code, design assets, or brand identity in this repository is strictly prohibited.

---

**Made with care · Designed for comfort.** 🌿
