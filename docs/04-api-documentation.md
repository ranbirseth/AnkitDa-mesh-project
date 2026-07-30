# API Documentation v1.0
## Ankit Da Mess — Next.js Route Handlers (`app/api/*/route.ts`)

> **Base URL**: `https://{siteUrl}/api`  
> **Conventions**: All responses JSON (`application/json`). CamelCase for JSON keys. UTC ISO-8601 timestamps. Pagination via `?page=&limit=`.  
> **Caching**: Public GET endpoints use Next.js `fetch` tags (`hero`, `rooms`, `gallery`, etc.) + ISR `revalidate = 60`. Mutations call `/api/revalidate` to purge.

---

## 1. Envelope & Error Format

### 1.1 Success Envelope
```jsonc
// GET /api/public/hero → 200
{
  "success": true,
  "data": { /* resource */ },
  "message": "OK",
  "meta": { "fetchedAt": "2026-07-29T12:00:00Z" }
}
```

### 1.2 Paginated List Envelope
```jsonc
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "OK"
}
```

### 1.3 Error Envelope
```jsonc
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",          // machine-readable
    "message": "Invalid input",          // human-readable
    "details": [                         // Zod issues, optional
      { "path": ["email"], "message": "Required" }
    ],
    "traceId": "req_abc123"              // for support
  }
}
```

### 1.4 HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 OK | Success (GET/PUT) |
| 201 Created | Resource created (POST) |
| 204 No Content | DELETE succeeded |
| 400 Bad Request | Validation / malformed |
| 401 Unauthorized | Missing / invalid JWT |
| 403 Forbidden | Authenticated but no permission |
| 404 Not Found | Resource doesn't exist |
| 409 Conflict | Duplicate unique key |
| 413 Payload Too Large | Upload too big |
| 415 Unsupported Media Type | Bad file MIME |
| 422 Unprocessable Entity | Semantic validation (Zod) |
| 429 Too Many Requests | Rate limited |
| 500 Internal Server | Unexpected error (no stack leaked) |

---

## 2. Public Endpoints — No Auth

All endpoints under `/api/public/*` and `/api/contact` are unauthenticated but rate-limited (100 req/min/IP).

---

### 2.1 Hero
```http
GET /api/public/hero
Cache-Tags: hero
```
**Response 200**
```jsonc
{
  "success": true,
  "data": {
    "headline": "Luxury Living in the Heart of the City",
    "subHeadline": "Premium PG & Guest House for Students & Professionals",
    "primaryCTA": { "text": "Book a Tour", "href": "/contact#form" },
    "secondaryCTA": { "text": "View Rooms", "href": "/rooms" },
    "video": { "url": "https://res.cloudinary.com/.../hero.mp4", "poster": "https://res.cloudinary.com/.../poster.jpg" },
    "fallbackImage": { "url": "https://res.cloudinary.com/.../hero-fallback.jpg", "alt": "..." },
    "images": [
      { "url": "https://res.cloudinary.com/.../hero-1.jpg", "alt": "..." }
    ],
    "kenBurnsEnabled": true
  }
}
```

---

### 2.2 Rooms
```http
GET /api/public/rooms?featured=true&availability=available&page=1&limit=9
Cache-Tags: rooms
```
**Query Params**: `featured?`, `availability?`(available|filled|maintenance), `page`=1, `limit`=9, `sortBy`(priceAsc|priceDesc|sortOrder)=sortOrder

```http
GET /api/public/rooms/:slug
Cache-Tags: rooms
```
**Response 200** (single room):
```jsonc
{
  "id": "60a...",
  "slug": "deluxe-single",
  "name": "Deluxe Single",
  "shortDescription": "Spacious single room with AC & work desk.",
  "description": "<p>Sanitized HTML...</p>",
  "featured": true,
  "status": "available",
  "availability": true,
  "priceMonthly": 14000,
  "priceQuarterly": 38000,
  "securityDeposit": 7000,
  "capacityAdults": 1,
  "bedType": "single",
  "roomSizeSqFt": 180,
  "floorNumber": 2,
  "primaryImage": { "url": "...", "alt": "..." },
  "images": [ { "url": "...", "alt": "..." } ],
  "amenities": [
    { "id": "...", "name": "WiFi", "iconKey": "FiWifi" }
  ],
  "roomNumber": "201"
}
```

---

### 2.3 Gallery
```http
GET /api/public/gallery?category=kitchen&page=1&limit=30
Cache-Tags: gallery
```
**Query Params**: `category`?(rooms|building|kitchen|terrace|bathroom), `featured`?

**Response 200**: Paginated list of `{ id, title, alt, caption, category, image: {url,width,height}, relatedRoomId, sortOrder, featured }`.

---

### 2.4 Amenities
```http
GET /api/public/amenities?category=property
Cache-Tags: amenities
```
**Response 200**: Sorted by `sortOrder`. Array of `{ id, name, slug, description, iconKey, customIcon, category }`.

---

### 2.5 Testimonials
```http
GET /api/public/testimonials?featured=true&limit=10
Cache-Tags: testimonials
```

---

### 2.6 Location / Contact / CTA / Footer / Settings
All follow the same singleton pattern:
```http
GET /api/public/location     Cache-Tags: location
GET /api/public/contact      Cache-Tags: contact
GET /api/public/cta          Cache-Tags: cta
GET /api/public/footer       Cache-Tags: footer
GET /api/public/settings     Cache-Tags: settings
```

---

### 2.7 Contact Form Submit
```http
POST /api/contact
Content-Type: application/json
Rate-Limit: 5 req/hr/IP
```
**Request Body** (validated by Zod):
```jsonc
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+919876543210",
  "subject": "Room Inquiry",
  "message": "Do you have single rooms available in August?",
  "roomOfInterestId": "60a...",    // optional
  "checkInDate": "2026-08-01",     // optional ISO
  "sourcePage": "/"
}
```
**Responses**:
- `201` → email queued, copy saved to `contact_submissions`.
- `422` → validation errors.
- `429` → too many submissions.

---

## 3. Admin Auth Endpoints

### 3.1 Login
```http
POST /api/admin/auth/login
Content-Type: application/json
```
**Request**:
```jsonc
{ "email": "owner@ankitdamess.in", "password": "••••••••" }
```
**Response 200**:
```jsonc
{
  "success": true,
  "data": {
    "admin": { "id": "...", "name": "Ankit", "email": "...", "role": "owner" },
    "token": "••••••••"                 // Optional, also set as HttpOnly cookie
  },
  "message": "Login successful"
}
```
**Side effects**:
- Sets `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=7200` cookie named `__Secure-adm_jwt`.
- Increments `loginAttempts`; locks after 5 failed → 423 + `lockoutUntil`.

### 3.2 Logout
```http
POST /api/admin/auth/logout
Cookie: __Secure-adm_jwt=...
```
**Response 204** + clears the cookie.

### 3.3 Current Admin
```http
GET /api/admin/auth/me
Authorization: Bearer <token>  OR  Cookie: __Secure-adm_jwt
```
**Response 200** → admin profile (no password). **401** if expired/missing.

---

## 4. Admin CRUD Endpoints — JWT Required

All endpoints below `/api/admin/*` require:
```
Authorization: Bearer <jwt>
  - OR -
Cookie: __Secure-adm_jwt=<jwt>   (preferred; sent by browser automatically)
```
Return **401** on invalid/missing JWT, **403** if role disallows (editors can't manage admins/settings).

### 4.1 Hero (Singleton)
```http
PUT /api/admin/hero                // upsert, tag revalidate: hero
GET /api/admin/hero                // same shape as public
```
**Body** (multipart/form-data allowed for inline uploads OR send Media IDs already uploaded):
```jsonc
{
  "headline": "...",
  "subHeadline": "...",
  "primaryCTA": { "text": "...", "href": "..." },
  "secondaryCTA": { "text": "...", "href": "..." },
  "videoMediaId": "60a...",
  "fallbackImageMediaId": "60a...",
  "imageMediaIds": [ "60a...", "60b..." ],
  "kenBurnsEnabled": true
}
```

### 4.2 Rooms
```http
GET    /api/admin/rooms?page=1&limit=20&q=deluxe
POST   /api/admin/rooms                      // 201 Created
GET    /api/admin/rooms/:id
PUT    /api/admin/rooms/:id                  // revalidate tags: rooms
DELETE /api/admin/rooms/:id                  // soft-delete; revalidate
```
**POST/PUT Body** → Zod schema matches Room model (see `features/rooms/lib/roomSchema.ts`).

### 4.3 Gallery
```http
GET    /api/admin/gallery?category=rooms&page=1
POST   /api/admin/gallery                    // accepts Media IDs + meta
GET    /api/admin/gallery/:id
PUT    /api/admin/gallery/:id
DELETE /api/admin/gallery/:id                // also purges Cloudinary via service
```

### 4.4 Amenities / Testimonials
Identical CRUD pattern:
- `/api/admin/amenities` and `/api/admin/amenities/:id`
- `/api/admin/testimonials` and `/api/admin/testimonials/:id`

### 4.5 Singletons (same pattern as Hero)
```
PUT /api/admin/location      → tag revalidate: location
PUT /api/admin/contact       → tag revalidate: contact
PUT /api/admin/cta           → tag revalidate: cta
PUT /api/admin/footer        → tag revalidate: footer
PUT /api/admin/settings      → tag revalidate: settings
```

### 4.6 Media
```http
POST /api/admin/media/upload
Content-Type: multipart/form-data
Body: {
  file: <binary>,        // images: max 10MB; video: max 100MB
  folder: "gallery",     // hero | rooms | gallery | amenities | testimonials | virtual-tour
  alt: "Kitchen photo",
  caption?: "...",
  typeHint?: "image"     // or "video"
}
```
**Validation (server-performed, not only client)**:
- Extension allow-list: jpg, jpeg, png, webp, avif, mp4.
- MIME + magic-byte check.
- Filename sanitized to `[a-zA-Z0-9-_.]`.
- Virus-safe assumption: Cloudinary scans.

**201 Response**:
```jsonc
{
  "id": "60a...",
  "url": "https://res.cloudinary.com/.../v1/gallery/abc.jpg",
  "secureUrl": "...",
  "publicId": "ankitda/gallery/abc",
  "format": "jpg",
  "resourceType": "image",
  "width": 2400,
  "height": 1600,
  "bytes": 420000,
  "folder": "gallery"
}
```
```http
GET    /api/admin/media?folder=gallery&page=1&limit=50
DELETE /api/admin/media/:id          // deletes from Cloudinary + DB
```

### 4.7 Revalidation (called by mutations internally)
```http
POST /api/revalidate
Authorization: Bearer <service JWT OR admin JWT>
Body: { "tags": ["hero", "gallery", "rooms"], "paths": ["/", "/rooms/deluxe"] }
```
Internally uses `revalidateTag()` + `revalidatePath()`.

---

## 5. Rate Limiting

Implemented via `server/services/RateLimitService.ts` (in-memory LRU + Upstash Redis fallback for multi-region):

| Endpoint | Limit | Window |
|----------|-------|--------|
| Public GET (all) | 100 req/min | 60s |
| `/api/contact` | 5 req/hr | 3600s |
| `/api/admin/auth/login` | 10 req/min | 60s |
| Admin mutations (POST/PUT/DELETE) | 500 req/min | 60s |

**Response headers** (public routes):
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 94
X-RateLimit-Reset: 1719664800
Retry-After: 37                     (only when 429)
```

---

## 6. Input Validation Strategy

Every handler wraps input through `withValidation(zodSchema)` middleware.

**Validation order**:
1. **Middleware** sanitizes keys (strips `$where`, `__proto__`, etc.).
2. **Zod schema** parse → returns `422` with detailed `error.details[]`.
3. **DOMPurify** on any HTML string fields.
4. **Mongo `validate()`** (final catch before write).

---

## 7. Security Headers

Enforced via `next.config.ts` → applies to the entire site:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-${cryptoRandom}' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';        // Tailwind JIT
  img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com;
  media-src 'self' blob: https://res.cloudinary.com;
  font-src 'self' data:;
  frame-src 'self' https://www.google.com https://www.youtube.com;
  connect-src 'self' https://res.cloudinary.com;
  frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self), interest-cohort=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

**End of API Documentation v1.0**
