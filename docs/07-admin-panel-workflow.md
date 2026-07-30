# Admin Panel Workflow
## Ankit Da Mess — Content Management & Operations

---

## 1. Admin User Roles

| Role | Permissions | Provisioning |
|------|-------------|--------------|
| **Owner** (role: "owner") | Full access to all modules including Admin user management, Settings, Site-wide destructive actions | Seeded via `server/scripts/seed.ts` (only one owner) |
| **Editor** (role: "editor") | CRUD Rooms, Gallery, Amenities, Testimonials, Location, Contact, CTA, Footer, Media. **Cannot**: manage admins, edit settings, delete media in bulk, purge full cache. | Invited by Owner via email → one-time password setup (Phase 5 stretch; v1 direct DB insert) |

---

## 2. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ┌ AdminSidebar (fixed, 260px, collapsible on <1280px) ─┐   │
│  │  Logo (Ankit Da Mess · Admin)              ^ collapse │   │
│  │  ─────────────────────────────────────────────        │   │
│  │  ● Overview                     (home icon)           │   │
│  │  ○ Hero                         (video icon)          │   │
│  │  ○ Rooms                    3   (bed icon, badge)     │   │
│  │  ○ Gallery                 128  (image grid, badge)   │   │
│  │  ○ Amenities                14   (sparkles icon)      │   │
│  │  ○ Testimonials             22   (quote icon)         │   │
│  │  ○ Location                       (pin icon)          │   │
│  │  ○ Contact                        (envelope icon)     │   │
│  │  ○ CTA                            (megaphone icon)    │   │
│  │  ○ Footer                         (document icon)     │   │
│  │  ○ Settings                       (cog icon)          │   │
│  │  ○ Media Library            472   (folder icon)       │   │
│  │  ─────────────────────────────────────────────        │   │
│  │  ↗ View Live Site              (external link)        │   │
│  │  ↪ Logout                       (door icon)           │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌ AdminTopbar ──────────────────────────────────────────┐   │
│  │  Breadcrumbs: Admin › Rooms › Edit Deluxe Single      │   │
│  │  [🔍 QuickSearch]  [🔔 Notifications (4)]  [👤 Ankit] │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌ Content Area (padded Container size=wide) ─────────────┐  │
│  │  (Routes render here: /admin/rooms, /admin/hero, etc.)│  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Module Workflows (Step-by-Step)

### 3.1 Authentication (Entry Point)
```
  1. Navigate to /admin
     ↓
  2. Middleware (src/middleware.ts):
     - No HttpOnly __Secure-adm_jwt cookie?
       → 307 redirect /admin/login
     - Cookie present? → decode JWT
       - valid + not expired → allow proceed to /admin/overview
       - invalid / expired → clear cookie → /admin/login
  3. /admin/login renders form (2-column split, luxury glass aesthetic)
  4. Submit → POST /api/admin/auth/login
       - Success → cookie set, toast "Welcome back" → /admin
       - Failure → inline error, increment attempt counter, 5 fails → lockout 15min
```

### 3.2 Overview Page (First Screen After Login)
```
  Widget Row 1 (4 Stat Cards):
  ┌────────────┬────────────┬────────────┬────────────┐
  │ Total Rooms│  Available │   Filled   │  Messages  │
  │     12     │     8      │     4      │   27 (new) │
  │ +1 MoM     │  ▲ 2       │  ▼ 1       │  +6 today  │
  └────────────┴────────────┴────────────┴────────────┘

  Row 2 (split 2/3 + 1/3):
  ┌─────────────────────────────┬───────────────────────┐
  │ Recent Contact Submissions  │ Quick Actions         │
  │ (last 10, DataTable)        │ [+ Add Room]          │
  │ Name · Email · Room · Time  │ [+ Add Gallery Photo] │
  │                             │ [Edit Hero]           │
  │                             │ [Bulk Upload Media]   │
  └─────────────────────────────┴───────────────────────┘

  Row 3:
  ┌───────────────────────────────────────────────────┐
  │ Featured Rooms (cards)  —  click → Edit Room      │
  └───────────────────────────────────────────────────┘
```

### 3.3 Hero Editor (Singleton)
```
  Open: Sidebar → Hero
  ┌ Left (Form column 60%) ─────────┬ Right (Live Preview 40%) ─┐
  │ Headline [input]                │  Phone/desktop mock       │
  │ Sub-Headline [textarea 2 rows]  │  Hero composite preview   │
  │ ─ Primary CTA ─                 │  with same animations     │
  │   Text [Book a Tour]            │  (scaled-down iframe?)    │
  │   Href [/contact#form]          │  or rendered component.   │
  │ ─ Secondary CTA ─               │                           │
  │   Text [View Rooms]             │                           │
  │   Href [/rooms]                 │                           │
  │ ─ Media ─                       │                           │
  │   Video  [📁 Upload / ↕ Pick]  │                           │
  │   Fallback Img [📁 Upload]      │                           │
  │   Hero Images (max 6)           │                           │
  │     Drag-drop reorder + delete  │                           │
  │   ☑ Enable Ken Burns on Img     │                           │
  │                                 │                           │
  │ [Cancel]  [Preview Live] [Save] │   Save → toast + revalidate│
  └─────────────────────────────────┴───────────────────────────┘
  Save Flow:
    1. Client-side Zod validate (inline errors)
    2. PUT /api/admin/hero
    3. API → MongoDB upsert
    4. API → POST /api/revalidate?tags=hero
    5. API → 200 success
    6. Toast "Hero updated · live site refreshed in ~5s"
```

### 3.4 Rooms CRUD
```
  Index (/admin/rooms):
  - Toolbar: [+ Add Room] [Search] [Filter: All/Avail/Filled]
  - DataTable columns:
     Thumbnail · Name · Slug · Status Badge · ₹/Mo · Amenities count · Featured ★ · Updated · Actions [Edit · Duplicate · Delete]

  New / Edit (/admin/rooms/new, /admin/rooms/:id):
  (Tabs across top: Details · Media · Amenities · SEO)

  Tab 1 — Details:
    Name, Slug (auto from name, editable),
    Short Desc, Description (rich text or structured — v1 sanitized textarea),
    Status (dropdown: Available, Filled, Maintenance),
    Featured toggle, Price Monthly, Price Quarterly, Security Deposit,
    Capacity Adults, Bed Type, Room Size SqFt, Floor, Room Number.

  Tab 2 — Media:
    Primary Image (single-select from Media)
    Room Gallery (multi-select, drag-drop reorder)

  Tab 3 — Amenities:
    Amenity checkboxes (pulled from Amenities catalog)
    [ + Quick Add Amenity ] → opens mini modal

  Tab 4 — SEO (optional, prefilled defaults):
    SEO Title, SEO Description, OG Image override

  Bottom action bar:
    [Delete ⚠]              [Preview Room]     [Save Draft]    [Publish]

  Delete Flow:
    Click Delete → ConfirmDialog("This action cannot be undone. Related gallery items will have 'relatedRoom' cleared.")
    → DELETE /api/admin/rooms/:id → soft-delete (deletedAt = now)
    → revalidate tags: rooms
    → Redirect /admin/rooms · toast
```

### 3.5 Gallery CRUD
```
  Index (/admin/gallery):
    Top toolbar:
      [📤 Upload Images (max 30 at once)]
      [Filter Category ▾]  [Search caption]

    Gallery Grid View (4 col):
      Each tile: thumbnail, category pill (top-left), check box (top-right select)
      Hover → ⓘ details · ✎ edit · 🗑 delete

    Bulk bar (appears when ≥1 selected):
      [Set Category ▾]  [Delete N selected ⚠]

  Edit (/admin/gallery/:id):
    Title, Alt (REQUIRED, SEO-enforced), Caption,
    Category (Rooms / Building / Kitchen / Terrace / Bathroom),
    Related Room (optional link),
    Sort Order number, Featured toggle

  Upload Flow:
    Drag 22 jpg/webp to dropzone
      → client-side validate (size, type)
      → 22 parallel POST /api/admin/media/upload (chunk to 3 at a time max concurrency)
      → On each success → push to gallery list (category selected in upload modal pre-select)
      → Save all → POST /api/admin/gallery (bulk)
```

### 3.6 Amenities / Testimonials / Location / Contact / CTA / Footer / Settings
All follow the **same CRUD pattern** (Index Table → New/Edit Form → Save → Revalidate tag).

**Highlights:**
- **Amenities**: `iconKey` dropdown (searchable list of ~40 curated react-icons), `Custom Icon` upload fallback.
- **Testimonials**: Rating 1-5 stars UI, date picker, `source` dropdown (Direct/Google), Featured toggle.
- **Location**: Lat/lng auto-populate from Google Place autocomplete, Nearby Places repeatable list (name, icon, category, distance).
- **Footer**: QuickLinks repeatable (label, href, openInNewTab), SocialMedia repeatable (platform from enum, url, icon override).
- **Settings**: Site URL, default OG image, Google Analytics ID, footer copyright template (`{year}` replaced dynamically).

### 3.7 Media Library
```
  /admin/media
  - Toolbar: Upload (image + video) · Folder filter · Search · View [Grid | List]
  - Grid: 5 col thumbnails (click → right-side drawer with: dimensions, bytes, folder, uploader, URL copy, Replace, Delete)
  - Bulk delete: select + confirm + Cloudinary cascade
  - Deleted items → soft archive (UI filter), 30d retention (manual hard delete)
```

### 3.8 View Live Site
Sidebar link opens `siteUrl` in a new tab (target=_blank, rel="noopener").

### 3.9 Logout
Sidebar bottom:
```
  Click Logout
    → POST /api/admin/auth/logout
    → clears HttpOnly cookie
    → 307 redirect /admin/login
    → toast "Logged out securely"
```

---

## 4. Admin UX Rules (Non-Negotiable)

1. **No Lost Work**: Leaving a form with dirty changes → native `beforeunload` + custom dirty-check dialog ("You have unsaved changes. Leave?").
2. **Optimistic Saving**: Save button shows spinner → success → green check; never silently fails.
3. **No Blind Deletes**: Every delete requires 2-step confirm + label the button with the item name ("Delete room 'Deluxe Single'?") to prevent muscle-memory accidents.
4. **URLs are Deep-Linkable**: `/admin/rooms/60a...` directly opens that edit page.
5. **Keyboard Shortcuts** (Admin only):
   - `Ctrl/Cmd + S` → Save current form.
   - `Ctrl/Cmd + K` → QuickSearch (jump to any module / room / media).
   - `Esc` → close modals / drawers.
6. **Instant Preview**: Every singleton editor (Hero/CTA/Footer/Location) has a scaled preview pane; save triggers ISR revalidate + toast with ETA.

---

## 5. Audit Trail

All admin mutations append a log entry to `admin_activity_logs` collection (Phase 5 optimization, stubbed in v1):
```ts
{ who: adminId, what: "rooms.update", target: roomId, diff: patch, ip, ua, ts }
```

---

**End of Admin Panel Workflow v1.0**
