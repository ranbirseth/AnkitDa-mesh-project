# Implementation Plan: Phase 4 — Admin Dashboard Recovery

## Overview

Restore full admin dashboard functionality in the Ankit Da Mess Next.js 15 project. Seven root causes block the admin panel in development: mock auth breaks all protected API routes, the rooms edit/delete flow is broken, 11 admin pages are missing, and environment variables are incomplete. Tasks are ordered so each step is independently deployable and testable with mock login (`owner@ankitdamess.in`, any password).

**Design system tokens to use:** `bg-forest-900`, `bg-forest-950`, `border-forest-800`, `text-forest-50`, `text-forest-300`, `text-gold-400`, `bg-gold-500`, `hover:bg-gold-400`, `text-forest-950` (on gold buttons). Match the style in `src/app/admin/(dashboard)/rooms/page.tsx`.

**Existing singleton API:** All content-section reads/writes go through `GET /api/admin/settings/[type]` and `PUT /api/admin/settings/[type]` — no new route files are needed for hero, cta, footer, etc.

---

## Tasks

- [x] 1. Fix `requireAdmin` mock-login compatibility
  - [x] 1.1 Patch `src/lib/adminAuth.ts` to short-circuit DB lookup for the mock user
    - At the top of `requireAdmin`, after reading `userId` and `role` from headers, add a check: if `userId === 'mock-user-id-123'`, immediately return `{ ok: true, admin: { id: userId, email: 'mock@admin.dev', role: 'OWNER' } }` without calling `connectDB()` or `AdminUser.findById()`
    - Keep the existing `options?.ownerOnly` guard working for the mock path too (mock always has role OWNER so it always passes)
    - This unblocks every protected API route in development without needing a real MongoDB connection
    - _No other files should be modified in this task_

- [x] 2. Fix the Rooms edit page and wire the Delete button
  - [x] 2.1 Create `src/app/admin/(dashboard)/rooms/[id]/page.tsx` — server component edit page
    - Fetch the room by calling `GET /api/admin/rooms` (using the existing `roomsService.getRooms`) and find by id, OR call `fetch('/api/admin/rooms')` server-side and filter; the simplest approach is using the existing `roomsService` which already handles mock/DB
    - Pass the found room as `initialData` and the `id` as `roomId` to the existing `<RoomForm>` component
    - If the room is not found, render a "Room not found" message with a back link
    - Route: `src/app/admin/(dashboard)/rooms/[id]/page.tsx`
  - [x] 2.2 Fix the Edit link and wire the Delete button in `src/app/admin/(dashboard)/rooms/page.tsx`
    - Change the Edit button's `href` from `/admin/rooms/${room.id}/edit` to `/admin/rooms/${room.id}` (matches the page created in 2.1)
    - Convert the page to a `'use client'` component (required for delete state and confirmation)
    - Add a `handleDelete(id: string)` async function that: (1) calls `window.confirm('Delete this room? This cannot be undone.')`, (2) on confirm calls `DELETE /api/admin/rooms/${id}`, (3) on success calls `router.refresh()` and shows `toast.success('Room deleted')`, (4) on failure shows `toast.error(...)`
    - Wire the `<Trash2>` button's `onClick` to `handleDelete(room.id)`
    - Import `useRouter` from `next/navigation` and `toast` from `sonner`
  - [x] 2.3 Improve `src/app/admin/(dashboard)/rooms/RoomForm.tsx` — add explicit image URL input
    - Replace the hardcoded Unsplash `defaultValues.primaryImage` with `{ id: '', url: '', alt: '' }`
    - Add a visible "Primary Image URL" text input field wired to `register('primaryImage.url')` and an "Image Alt Text" input wired to `register('primaryImage.alt')`, plus a hidden input for `primaryImage.id` that auto-sets to the same value as the URL (use `watch('primaryImage.url')` as the id if no media picker is available)
    - Show validation errors for the image URL field
    - Remove the placeholder note about media picker — replace it with the actual input fields

- [ ] 3. Create missing admin page files — singleton content sections
  - [x] 3.1 Create `src/app/admin/(dashboard)/hero/page.tsx`
    - `'use client'` component. On mount, fetch `GET /api/admin/settings/hero` and populate the form
    - Form fields: `heading` (text), `subheading` (textarea), `eyebrow` (text), `ctaText` (text), `ctaLink` (text), `secondaryCtaText` (text), `secondaryCtaLink` (text), `backgroundImageUrl` (text), `posterUrl` (text)
    - Save button calls `PUT /api/admin/settings/hero` with the form data as JSON body
    - Show `toast.success('Hero section saved')` on success, `toast.error(...)` on failure
    - Use `react-hook-form` + manual `fetch` (no zod resolver needed for simple flat forms is fine, but adding one is better)
    - Page heading: "Hero Section" in `text-gold-400 font-serif`
  - [x] 3.2 Create `src/app/admin/(dashboard)/virtual-tour/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/virtual-tour` on mount
    - Form fields: `title` (text), `description` (textarea), `videoUrl` (text), `posterUrl` (text), `ctaText` (text), `ctaLink` (text)
    - Save via `PUT /api/admin/settings/virtual-tour`
    - Page heading: "Virtual Tour"
  - [x] 3.3 Create `src/app/admin/(dashboard)/why-choose-us/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/why-choose-us` on mount
    - The data is an object with a `features` array. Each feature has `id`, `iconKey`, `title`, `description`
    - Render each feature as an editable row with inputs. Provide "Add Feature" (appends a blank row) and "Remove" (removes that row) buttons per row
    - Save the entire features array via `PUT /api/admin/settings/why-choose-us` with body `{ features: [...] }`
    - Page heading: "Why Choose Us"
  - [ ] 3.4 Create `src/app/admin/(dashboard)/location/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/location` on mount
    - Form fields: `address` (textarea), `lat` (number), `lng` (number), `mapEmbedUrl` (text), `mapsLink` (text)
    - Below the main form, a "Nearby Places" section: list of `{ name, distance, type }` objects rendered as editable rows with Add/Remove
    - Save via `PUT /api/admin/settings/location`
    - Page heading: "Location"
  - [ ] 3.5 Create `src/app/admin/(dashboard)/contact/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/contact` on mount
    - Form fields: `phone` (text), `whatsapp` (text), `email` (email), `address` (textarea), `hoursWeekday` (text), `hoursWeekend` (text)
    - Save via `PUT /api/admin/settings/contact`
    - Page heading: "Contact Info"
  - [ ] 3.6 Create `src/app/admin/(dashboard)/cta/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/cta` on mount
    - Form fields: `heading` (text), `subheading` (textarea), `primaryCtaText` (text), `primaryCtaLink` (text), `secondaryCtaText` (text), `secondaryCtaLink` (text)
    - Save via `PUT /api/admin/settings/cta`
    - Page heading: "Call to Action"
  - [ ] 3.7 Create `src/app/admin/(dashboard)/footer/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/footer` on mount
    - Form fields: `brandName` (text), `brandTagline` (text), `copyrightText` (text)
    - Below, a "Quick Links" editable list: `{ label, href }` rows with Add/Remove
    - Below, a "Social Links" editable list: `{ platform, url }` rows with Add/Remove
    - Save the entire object via `PUT /api/admin/settings/footer`
    - Page heading: "Footer"
  - [ ] 3.8 Create `src/app/admin/(dashboard)/settings/page.tsx`
    - `'use client'` component. Fetch `GET /api/admin/settings/settings` on mount (this maps to `type='hero'` in the current route as a catch-all — note this in a code comment)
    - Form fields: `siteName` (text), `siteUrl` (text), `seoTitle` (text), `seoDescription` (textarea), `seoKeywords` (text)
    - Save via `PUT /api/admin/settings/settings`
    - **Do NOT expose or display any secret keys, JWT secrets, or API credentials** — only public/SEO metadata
    - Page heading: "Site Settings"

- [ ] 4. Create missing admin page files — collection sections (Gallery, Amenities, Testimonials)
  - [ ] 4.1 Create `src/app/admin/(dashboard)/gallery/page.tsx`
    - `'use client'` component
    - On mount, fetch `GET /api/admin/gallery` and render items in a responsive grid (3–4 columns on desktop) showing the image thumbnail, title, category badge, and featured indicator
    - Add a category filter bar (all / rooms / building / kitchen / terrace / bathroom) that re-fetches with `?category=X`
    - "Add Gallery Item" button opens an inline form (or inline expansion) with fields: `title`, `alt`, `caption`, `category` (select), `image.url` (text input for URL), `image.alt` (text), `featured` (checkbox)
    - Each item has an Edit (inline expand) and Delete (confirm + `DELETE /api/admin/gallery/${id}`) button
    - Use the existing `[id]` route at `src/app/api/admin/gallery/[id]/route.ts` for PUT/DELETE
    - After any mutation, call `router.refresh()` and show a toast
    - Page heading: "Gallery & Media"
  - [ ] 4.2 Create `src/app/admin/(dashboard)/amenities/page.tsx`
    - `'use client'` component
    - On mount, fetch `GET /api/admin/amenities` and render items in a table: name, iconKey, category, sortOrder, active toggle
    - "Add Amenity" button opens an inline form with fields: `name`, `iconKey`, `description`, `category` (select: standard/premium/security/lifestyle), `sortOrder` (number), `active` (checkbox)
    - Each row has an Edit (inline expand) and Delete (confirm + `DELETE /api/admin/amenities/${id}`) button
    - Active toggle calls `PUT /api/admin/amenities/${id}` with `{ active: !current }` immediately on click
    - Use existing `[id]` route at `src/app/api/admin/amenities/[id]/route.ts`
    - Page heading: "Amenities"
  - [ ] 4.3 Create `src/app/admin/(dashboard)/testimonials/page.tsx`
    - `'use client'` component
    - On mount, fetch `GET /api/admin/testimonials` and render items in a table: reviewer name, rating (stars), source badge, active toggle, actions
    - "Add Testimonial" button opens inline form with fields: `reviewerName`, `reviewerRole`, `reviewerInitials` (max 4 chars), `rating` (1–5 number/select), `content` (textarea), `source` (select: direct/google/booking/word-of-mouth), `sortOrder` (number), `active` (checkbox)
    - Edit (inline expand) and Delete (confirm + `DELETE /api/admin/testimonials/${id}`) per row
    - Active toggle calls `PUT /api/admin/testimonials/${id}` with `{ active: !current }` on click
    - Use `src/app/api/admin/testimonials/[id]/route.ts` for PUT/DELETE
    - Page heading: "Testimonials"

- [ ] 5. Create missing admin page files — Media library
  - [ ] 5.1 Create `src/app/admin/(dashboard)/media/page.tsx`
    - `'use client'` component
    - On mount, fetch `GET /api/admin/media` and display items in a masonry-style grid showing image thumbnails (or file icon for non-images), filename, format, and file size in KB
    - "Upload Media" button: renders a `<input type="file" accept="image/*,video/*">` and on change, submits to `POST /api/admin/media` as `multipart/form-data` with field name `file` and optional `altText`; show an upload progress indicator (disable button + "Uploading..." text during upload)
    - Each media item has a "Copy URL" button (copies `item.url` to clipboard with `navigator.clipboard.writeText`) and a "Delete" button (confirm + `DELETE /api/admin/media/${item._id || item.id}`)
    - Show a success toast "URL copied" on copy
    - Note in a code comment: delete will fail if CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not set in `.env.local` — this is expected in dev without those keys
    - Page heading: "Media Library"
    - _Requirements: media upload requires `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env.local`_

- [ ] 6. Fix sidebar navigation links in `src/app/admin/(dashboard)/layout.tsx`
  - [ ] 6.1 Update the `navItems` array to fix broken routes and add missing items
    - Change `href: '/admin/why-choose'` to `href: '/admin/why-choose-us'` (matches the page created in 3.3)
    - Add `{ href: '/admin/cta', icon: Megaphone, label: 'Call to Action' }` — import `Megaphone` from `lucide-react`
    - Add `{ href: '/admin/footer', icon: PanelBottom, label: 'Footer' }` — import `PanelBottom` from `lucide-react`
    - Add `{ href: '/admin/media', icon: FolderOpen, label: 'Media Library' }` after Gallery & Media — import `FolderOpen` from `lucide-react`
    - Reorder so the final nav order is: Dashboard → Hero → Rooms → Gallery → Media Library → Amenities → Testimonials → Virtual Tour → Why Choose Us → Location → Contact → Call to Action → Footer → Settings
    - Change the Gallery nav item label from `'Gallery & Media'` to `'Gallery'` now that Media Library is its own item
    - _No other logic in layout.tsx should be changed_

- [x] 7. Add missing environment variable keys to `.env.local`
  - [x] 7.1 Append required keys to `.env.local`
    - Add `MONGODB_URI=` with a comment: `# Add your MongoDB Atlas connection string here (mongodb+srv://...)`
    - Add `CLOUDINARY_API_KEY=` with comment: `# Required for media delete — find in Cloudinary dashboard`
    - Add `CLOUDINARY_API_SECRET=` with comment: `# Required for media delete — find in Cloudinary dashboard`
    - Do NOT remove or change any existing keys
    - Do NOT add actual secret values — leave them blank with instructional comments
    - These keys are already in `.env.example` if the user needs reference

- [ ] 8. Final checkpoint — verify all routes and TypeScript compile
  - Run `npx tsc --noEmit` in the workspace root and fix any type errors introduced by the new files
  - Confirm that every `href` in `layout.tsx` navItems has a corresponding `page.tsx` file
  - Confirm that `requireAdmin` in `adminAuth.ts` still handles the real MongoDB path correctly (mock bypass only triggers for the exact string `'mock-user-id-123'`)
  - Ensure all tests pass, and ask the user if questions arise

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP (there are none in this plan — all tasks are required to restore full functionality)
- The singleton content API already exists at `GET|PUT /api/admin/settings/[type]` — pages in Task 3 only need to call that endpoint
- The `SiteSettingsModel` schema uses `type` as a unique key and `data` as a flexible `Mixed` field — pages can send any shape of JSON
- Rooms `PUT /api/admin/rooms/[id]` and `DELETE /api/admin/rooms/[id]` already exist — Task 2 only wires the UI
- Mock login bypass in Task 1 is scoped to the exact string `'mock-user-id-123'` set by the login route — it will not affect production where real JWT tokens produce valid MongoDB ObjectIds
- Media delete requires `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` — without them the delete API will error; the media page should surface this gracefully
- All admin pages must use `'use client'` only when they need state or event handlers — server components are fine for pure data-display pages

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "7.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "4.1", "4.2", "4.3", "5.1"] },
    { "id": 2, "tasks": ["6.1"] },
    { "id": 3, "tasks": ["8"] }
  ]
}
```
