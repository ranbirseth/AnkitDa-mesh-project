# Database Schema — ER Diagram & MongoDB Design
## Ankit Da Mess — Scalable Document Model

---

## 1. Entity-Relationship Diagram (Textual ERD)

```
┌───────────────────┐
│     Settings      │  Singleton (1 document)
│  _id: ObjectId    │
│  siteName         │
│  siteUrl          │
│  defaultOGImage   │──────────┐
│  seoTitleTemplate │          │ references Media._id (FK-like)
│  seoDescription   │          │
│  analyticsId      │          │
│  ──────────────── │          │
│  INDEX: _id (PK)  │          ▼
└───────────────────┘   ┌───────────────────┐
                        │       Media       │  Polymorphic asset library
                        │  _id: ObjectId    │◄──── referenced by:
                        │  url              │        Hero, Rooms, Gallery,
                        │  secureUrl        │        Amenities, Testimonials,
                        │  publicId (Cloud) │        Settings, Footer
                        │  format (ext)     │
                        │  resourceType     │  image | video | raw
                        │  width, height    │
                        │  bytes            │
                        │  folder           │  "hero" | "gallery" | "rooms"...
                        │  alt              │
                        │  caption          │
                        │  uploadedBy (FK)  │───────┐
                        │  createdAt        │       │ references Admin._id
                        │  updatedAt        │       │
                        │  deletedAt (soft) │       ▼
                        └───────────────────┘   ┌───────────────────┐
                                                │       Admin       │
┌───────────────────┐                           │  _id: ObjectId    │
│        Hero       │  Singleton (1 doc)        │  email (unique)   │
│  _id: ObjectId    │                           │  password (hash)  │
│  headline         │                           │  name             │
│  subHeadline      │                           │  role             │  "owner" | "editor"
│  primaryCTA {     │                           │  lastLogin        │
│    text, href     │                           │  loginAttempts    │
│  }                │                           │  lockoutUntil     │
│  secondaryCTA {   │                           │  createdAt        │
│    text, href     │                           │  updatedAt        │
│  }                │                           └───────────────────┘
│  video (FK:Media) │
│  fallbackImage (FK)│
│  images[] (FK[])  │───────────────────────────┐
│  kenBurnsEnabled  │                           │
│  createdAt        │                           │
│  updatedAt        │                           │
└───────────────────┘                           │
                                                │
┌───────────────────┐                           │
│      Footer       │ Singleton (1 doc)         │
│  _id: ObjectId    │                           │
│  tagline          │                           │
│  quickLinks[] {   │                           │
│    label, href    │                           │
│  }                │                           │
│  socialMedia[] {  │                           │
│    platform, url, │                           │
│    iconKey        │                           │
│  }                │                           │
│  copyrightText    │                           │
│  logo (FK:Media)  │                           │
│  updatedAt        │                           │
└───────────────────┘                           │
                                                │
┌───────────────────┐                           │
│       CTA         │ Singleton (1 doc)         │
│  _id: ObjectId    │                           │
│  headline         │                           │
│  subHeadline      │                           │
│  primaryCTA {text,href}│                      │
│  secondaryCTA {..}│                           │
│  bgImage (FK)     │                           │
│  updatedAt        │                           │
└───────────────────┘                           │
                                                │
┌───────────────────┐                           │
│    Location       │ Singleton (1 doc)         │
│  _id: ObjectId    │                           │
│  addressLine1     │                           │
│  addressLine2?    │                           │
│  city             │                           │
│  state            │                           │
│  postalCode       │                           │
│  country          │                           │
│  latitude         │───────────────┐           │
│  longitude        │               ▼           │
│  googleMapsEmbedUrl│     ┌───────────────────┐│
│  nearbyPlaces[] { │     │      Contact      ││ Singleton (1 doc)
│    name, icon,    │     │  _id: ObjectId    ││
│    category,      │     │  email            ││
│    distanceKm,    │     │  phone            ││
│    walkingMinutes │     │  whatsapp         ││
│  }                │     │  formRecipient    ││
│  updatedAt        │     │  mapLink          ││
└───────────────────┘     │  officeHours[] {  ││
                          │    day, open,close││
                          │  }                ││
                          │  updatedAt        ││
                          └───────────────────┘│
                                                │
┌───────────────────┐                           │
│      Rooms        │  Multi-doc collection     │
│  _id: ObjectId    │                           │
│  name             │                           │
│  slug (unique)    │ INDEX UNIQUE              │
│  shortDescription │                           │
│  description (HTML sanitized)                 │
│  featured (bool)  │ INDEX                     │
│  status (enum)    │  "available" | "filled" | "maintenance"
│  availability (bool) INDEX (derived from status)
│  priceMonthly     │
│  priceQuarterly?  │
│  securityDeposit? │
│  capacityAdults   │
│  bedType          │  "single" | "double" | "twin"
│  roomSizeSqFt     │
│  floorNumber?     │
│  images[] (FK:Media) │  (primary + gallery)  │
│  primaryImage     │ FK (optimization)        │
│  amenities[] (FK:Amenity[]) │                 │
│  virtualTourUrl?  │                           │
│  roomNumber?      │                           │
│  seoTitle         │                           │
│  seoDescription   │                           │
│  sortOrder        │                           │
│  createdAt        │                           │
│  updatedAt        │                           │
│  deletedAt (soft) │                           │
└───────────────────┘                           │
     │                                          │
     │ hasMany                                  │
     ▼                                          │
┌───────────────────┐                           │
│     Gallery       │  Multi-doc, categorized   │
│  _id: ObjectId    │                           │
│  title            │                           │
│  alt              │ REQUIRED (SEO)            │
│  caption?         │                           │
│  category (enum)  │  INDEX: "rooms"|"building"|"kitchen"|"terrace"|"bathroom"
│  image (FK:Media) │───────────────────────────┘
│  relatedRoom? (FK:Room)
│  sortOrder        │
│  featured         │
│  createdAt        │
│  updatedAt        │
│  deletedAt (soft) │
└───────────────────┘
     INDEX: (category, sortOrder) COMPOUND

┌───────────────────┐
│     Amenities     │  Global amenity catalog
│  _id: ObjectId    │
│  name             │
│  slug (unique)    │
│  description?     │
│  iconKey          │ "wifi" | "ac" | "meals" — React Icons map
│  customIcon? (FK) │ Media
│  category?        │ "room" | "property" | "service"
│  sortOrder        │
│  createdAt        │
│  updatedAt        │
└───────────────────┘
     referencedBy: Rooms[] (FK-array)

┌───────────────────┐
│   Testimonials    │
│  _id: ObjectId    │
│  reviewerName     │
│  reviewerRole     │ "Student" | "Working Pro" | ...
│  reviewerAvatar?  │ FK:Media
│  rating (1..5)    │
│  reviewText       │
│  source?          │ "google" | "direct"
│  sourceProfileUrl?│
│  dateOfStay?      │
│  featured (bool)  │ INDEX
│  sortOrder        │
│  createdAt        │
│  updatedAt        │
└───────────────────┘
     INDEX: (featured, createdAt) COMPOUND

┌──────────────────────┐
│  ContactSubmissions  │  Audit log of all contact form messages
│  _id: ObjectId       │
│  name                │
│  email               │
│  phone?              │
│  subject?            │
│  message             │
│  roomOfInterest? (FK:Room)
│  checkInDate?        │
│  sourcePage          │  "/", "/rooms/deluxe", ...
│  ip                  │  (rate-limit assist)
│  userAgent?          │
│  emailSent (bool)    │  confirmation flag
│  createdAt           │
└──────────────────────┘
     INDEX: (email, createdAt DESC)
     INDEX: (ip, createdAt DESC)
```

---

## 2. Mongoose Schema Rules (Enforced Globally)

1. **Timestamps**: Every schema has `{ timestamps: true }`.
2. **Strict Mode**: All schemas use `{ strict: true }` (reject unknown fields on write).
3. **Type Safety**: All Mongoose schemas are paired with TypeScript interfaces (`@types/mongoose`); no `any` in schema definitions.
4. **Soft Deletes** (collections with destructive edits): `deletedAt: Date | null` with a default query scope `{ deletedAt: null }`.
5. **Indexing**:
   - Unique indexes on `Admin.email`, `Room.slug`, `Amenity.slug`.
   - Compound indexes on high-cardinality + sort columns.
   - Text indexes for search (Phase 2+).
6. **Validation at DB layer** (defense in depth, Zod validates first):
   - `enum` lists for categorical fields.
   - `min`/`max` for numeric values.
   - `match` regex for emails, URLs, slugs.

---

## 3. Collection Index Summary

| Collection | Index | Type | Purpose |
|-----------|-------|------|---------|
| `admins` | `{ email: 1 }` | Unique | Login lookup |
| `rooms` | `{ slug: 1 }` | Unique | Room page routing |
| `rooms` | `{ availability: 1, featured: -1, sortOrder: 1 }` | Compound | Homepage listing |
| `rooms` | `{ priceMonthly: 1 }` | Sparse | Future filtering |
| `gallery` | `{ category: 1, sortOrder: 1 }` | Compound | Gallery filtering + sort |
| `gallery` | `{ relatedRoom: 1 }` | Sparse | Room page gallery |
| `amenities` | `{ sortOrder: 1 }` | Single | Amenity grid order |
| `testimonials` | `{ featured: -1, createdAt: -1 }` | Compound | Homepage carousel |
| `media` | `{ folder: 1, createdAt: -1 }` | Compound | Media library filters |
| `media` | `{ publicId: 1 }` | Unique | Cloudinary dedupe |
| `contact_submissions` | `{ ip: 1, createdAt: -1 }` | Compound | Rate limiting |
| `contact_submissions` | `{ email: 1, createdAt: -1 }` | Compound | History |
| `settings` | `{ _id: 1 }` | Default PK | Singleton |

---

## 4. Singleton vs Multi-Doc Strategy

- **Single-doc collections** (admin edits one "row" at a time):
  `hero`, `settings`, `location`, `contact`, `cta`, `footer`
  → Seeded by `server/scripts/seed.ts` on first run; always use `findOneAndUpdate` with `upsert: true`.
- **Multi-doc collections** (CRUD table in admin):
  `admins`, `rooms`, `gallery`, `amenities`, `testimonials`, `media`, `contact_submissions`

---

## 5. Data Integrity & Reference Handling

- **Referential Integrity**: MongoDB is document-Oriented, so we do NOT enforce FK constraints at DB. Instead:
  - Admin delete UI checks for references before allowing delete.
  - `MediaService.ts` pre-delete check: scan Hero/Rooms/Gallery/Amenities/Testimonials for references.
  - `RoomRepository.ts` on delete: NULL-out all `relatedRoom` references in `Gallery`.
- **Denormalization (for perf)**:
  - `Room.primaryImage` duplicates `Room.images[0]` to save a projection + array-shift on homepage listings.
  - `Settings` caches default OG image URL directly (also stored in Media) so SEO lookups avoid joins.

---

## 6. Security at DB Layer

- **Admin.password**: `bcrypt.hashSync(pw, 12)` — Mongoose pre-save hook; never returned via projection `{ password: 0 }`.
- **Audit**: `Media.uploadedBy` references Admin._id.
- **PII Masking in Logs**: `ContactSubmission.ip` / `email` never written to application logs.

---

## 7. Scaling Considerations

- **Shard Keys (future >50k docs)**:
  - `contact_submissions` → shard on `createdAt` (time-series).
  - `media` → shard on `folder` + `createdAt`.
- **TTL Index**: Consider `contact_submissions` TTL index on `createdAt` (retain 24 months).
- **Caching Strategy**:
  - Public-read documents cached in Next.js ISR (`next: { revalidate: 60, tags: [...] }`).
  - Admin mutations call `/api/revalidate?tag=hero` → Next.js purges tag-based cache.

---

**End of Database Schema v1.0**
