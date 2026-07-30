# Authentication Flow
## Ankit Da Mess — JWT + HttpOnly Cookie, Admin-only Auth

> **Scope**: Authentication covers Admin Dashboard users only. Public site visitors are unauthenticated (guest booking inquiries do not require account creation).

---

## 1. Authentication Stack

| Layer | Library / Mechanism | Purpose |
|-------|---------------------|---------|
| Password Hashing | `bcryptjs` (salt rounds = 12) | Store + verify admin passwords |
| Token Issuance | `jsonwebtoken` package (server-only) | Signed JWT access tokens |
| Token Transport | **HttpOnly Cookie** (preferred) + Authorization: Bearer (fallback for scripts) | Defense against XSS token theft |
| CSRF Mitigation | SameSite=Lax cookie + Origin header check on state-changing mutations | Block cross-site forged submissions |
| Session Termination | Server-side: `POST /api/admin/auth/logout` clears cookie; client: delete local auth state | |
| Token Revocation (Stretch) | In-memory LRU `jti` denylist keyed on `logout` + `password change` (future Redis) | Immediate logout propagation |

---

## 2. Token Design

### 2.1 Access Token JWT Claims (2-hour expiry)
```ts
interface AdminJWTPayload {
  sub: string;           // admin._id (ObjectId string)
  role: 'owner' | 'editor';
  name: string;
  email: string;
  jti: string;           // cryptographically random 24-char id
  iat: number;           // issued at (s)
  exp: number;           // iat + 7200 (2h)
  iss: 'ankit-da-mess';
  aud: 'admin-dashboard';
}
```
Signed with `HS512` (HMAC-SHA512) using `JWT_SECRET` min 64 bytes (generated via `crypto.randomBytes(48).toString('hex')`).

### 2.2 Refresh Token (v1 optional; recommended)
If implemented: 7-day sliding expiry; stored as **hashed** value in `admins.refreshTokenHashes[]` array.
On refresh: rotate refresh token (invalidate old, issue new).

---

## 3. Cookie Configuration

```
Name:               __Secure-adm_jwt
Value:              <JWT>
Path:               /api/admin        (minimize cookie scope)
HttpOnly:           true              (JS cannot read)
Secure:             true              (HTTPS only — localhost exempt in dev)
SameSite:           Lax               (blocks POST from cross-site)
Max-Age:            7200              (sync with JWT exp)
```

Dev-only (localhost, non-HTTPS): drops `__Secure-` prefix and `Secure: false` when `NODE_ENV === 'development'`.

---

## 4. Flow Diagrams

### 4.1 Login Flow (Happy Path)

```
┌──────────────┐                    ┌──────────────────┐               ┌───────────────────┐
│  Browser     │                    │  Next.js /api    │               │  MongoDB Atlas    │
│  /admin/login│                    │  /admin/auth/login│               │  (admins coll.)   │
└──────┬───────┘                    └────────┬─────────┘               └────────┬──────────┘
       │ 1. POST JSON {email, password}     │                                │
       │───────────────────────────────────▶│                                │
       │                                     │ 2. Sanitize input, parse with Zod
       │                                     │
       │                                     │ 3. findOne({ email: lowerCase })
       │                                     │───────────────────────────────▶│
       │                                     │                                │
       │                                     │◀──── Admin doc (w/ password hash)
       │                                     │
       │                                     │ 4. bcrypt.compare(password, hash)
       │                                     │
       │                                     │ 5. reset loginAttempts, touch lastLogin
       │                                     │───────────────────────────────▶│ save()
       │                                     │                                │
       │                                     │ 6. jwt.sign(payload, JWT_SECRET, {expiresIn: '2h'})
       │                                     │
       │                                     │ 7. Set-Cookie: __Secure-adm_jwt=...
       │                                     │
       │                                     │ 8. Call RevalidationService.warmTags()
       │                                     │
       │◀──────────── 200 OK { admin:{id,name,email,role} }
       │
       │ 9. Router.push('/admin')
       │    Toast: "Welcome back, Ankit"
```

### 4.2 Login Flow (Error Paths)
| Condition | Server Response | Client UX |
|-----------|-----------------|-----------|
| `email` fails email regex | `422 { code: VALIDATION_ERROR, details:[{path:['email'], msg:'Invalid email'}] }` | Inline field error |
| No admin found with email | `401 { code: INVALID_CREDENTIALS }` | Generic "Invalid email or password" (never leak which) |
| bcrypt mismatch | `401` same generic code + increment `loginAttempts` in DB | Same generic message + shake animation on submit button |
| `loginAttempts >= 5` within 15m window | `423 { code: ACCOUNT_LOCKED, lockoutUntil: ISO }` | Disable submit + show "Locked until X" countdown |

### 4.3 Subsequent Authenticated Request
```
Browser (admin page)                 Next.js Route Handler (e.g. PUT /api/admin/hero)
         │                                            │
         │ 1. Request (cookie auto-sent by browser)   │
         │───────────────────────────────────────────▶│
         │                                            │
         │                                            │ 2. withAuth middleware:
         │                                            │    a) req.cookies['__Secure-adm_jwt']
         │                                            │       OR Authorization: Bearer <token>
         │                                            │    b) jwt.verify(token, JWT_SECRET)
         │                                            │    c) sub (adminId) → findById in DB
         │                                            │    d) check account still exists + not locked
         │                                            │    e) role check (owner only for settings)
         │                                            │    f) attach `req.admin = admin`
         │                                            │
         │                                            │ 3. Handler runs: update hero in DB → revalidate
         │                                            │
         │◀─────────────────────────────────────────── 200 OK {}
```

### 4.4 Middleware Guard (Edge `middleware.ts`)

`src/middleware.ts` runs at the edge **before** any `/admin/*` route handler:
```
IF  pathname matches /admin/(login|logout)  →  skip guard, pass through
ELSE
  IF  cookie __Secure-adm_jwt is present
      →  decode + verify signature + role valid
         valid   → next()
         invalid → clear cookie + 307 redirect /admin/login?reason=expired
  ELSE
      → Store target path in session cookie `__Secure-redirect_to`
      → 307 redirect /admin/login
```

**Note**: Middleware does NOT call DB (edge cold-start friendly). If DB check for disabled admin is needed, do it again in `withAuth` at the API handler level.

### 4.5 Logout Flow
```
  Browser: Click "Logout"
       │  POST /api/admin/auth/logout (empty body)
       │───────────────────────────────────────▶ API Handler
       │                                           │
       │                                           │ 1. Read JWT from cookie
       │                                           │ 2. (stretch) add jti to denylist cache ttl=exp
       │                                           │ 3. Set-Cookie: __Secure-adm_jwt=; Max-Age=0; Path=/api/admin; HttpOnly; Secure
       │                                           │ 4. Set-Cookie: __Secure-redirect_to=; Max-Age=0
       │                                           │
       │◀──────── 204 No Content
  Browser:
       - Clear any in-memory admin state (React context)
       - Router.replace('/admin/login')
       - Toast: "You have been logged out securely"
```

### 4.6 Password Change Flow (Owner in Settings)
```
  Form: Current Password ─ New Password ─ Confirm Password
  Submit → POST /api/admin/auth/change-password
       │  Zod: newPassword min 12 chars, 1 num, 1 special
       │  Server:
       │    a) bcrypt.compare(currentPw, admin.hash)  →  401 if mismatch
       │    b) bcrypt.hash(newPw, 12)                 →  save
       │    c) Invalidate ALL existing sessions (denylist all admin's jti for 7200s)
       │    d) Issue NEW JWT + set cookie             →  200
       │  Client: success toast "Password updated. All other devices logged out."
```

---

## 5. Authorization Matrix

| Feature | Owner | Editor | Guest (public) |
|---------|-------|--------|----------------|
| View public site pages | ✅ | ✅ | ✅ |
| Login to admin dashboard | ✅ | ✅ | ❌ |
| Overview page | ✅ | ✅ | ❌ |
| View / Create / Update Rooms, Gallery, Amenities, Testimonials, Location, Contact, CTA, Footer | ✅ | ✅ | ❌ |
| Delete Rooms / Gallery / Media (single item) | ✅ | ✅ | ❌ |
| **Bulk delete** Gallery / Media | ✅ | ❌ | ❌ |
| **Edit Hero** | ✅ | ✅ | ❌ |
| **Edit Settings** (site name, OG, analytics) | ✅ | ❌ | ❌ |
| **Manage other admins** (invite/remove editor) | ✅ | ❌ | ❌ |
| **Change any admin's password / reset** | ✅ | ❌ (only own) | ❌ |
| **Revalidate tags** manually | ✅ | ✅ | ❌ (API-only) |

Enforced in API handlers after `withAuth`:
```ts
// Inside PUT /api/admin/settings/route.ts
if (req.admin.role !== 'owner') return NextResponse.json({...}, { status: 403 });
```

---

## 6. Security Best Practices (Hardened)

1. **No tokens in localStorage** — HttpOnly cookies are the law.
2. **No secrets in Next client bundle** — `JWT_SECRET`, `MONGODB_URI`, etc. exist only in `.env.local`; validated server-side via `server/lib/env.ts`.
3. **Least-privilege cookies** — `Path=/api/admin` keeps the JWT cookie from being sent on asset requests (`/_next/static/*`, `/images/*`).
4. **Login rate limit**: 10 attempts / min / IP (see API docs §5).
5. **Account lockout**: 5 failures → 15-minute DB-level lock.
6. **Constant-time password compare**: `bcrypt.compare` is constant-time; no timing leaks.
7. **Timing attack mitigation on email enumeration**: Even if `admin` not found, server still performs a dummy bcrypt compare (constant ~200ms latency) so response time doesn't leak which part failed.
8. **Audit log** (stretch v1): Every `POST / PUT / DELETE` in admin logs to `admin_activity_logs` collection.
9. **Secure headers** in `next.config.ts` (CSP nonce, HSTS preload, X-Frame-Options DENY).
10. **First-time seeding**: `npx tsx src/server/scripts/seed.ts`
    - Reads `INITIAL_ADMIN_EMAIL` + `INITIAL_ADMIN_PASSWORD` from `.env.local`
    - **One-shot**: only inserts if `admins.count() === 0`
    - Prints a strong random password to stdout if env var missing (save in vault!)

---

## 7. Environment Variables Required for Auth

| Key | Where Used | Example |
|-----|-----------|---------|
| `JWT_SECRET` | `server/lib/jwt.ts` | 96-char hex (1Password generate) |
| `NODE_ENV` | Next.js auto | `development` / `production` |
| `INITIAL_ADMIN_EMAIL` | seed script | `owner@ankitdamess.in` |
| `INITIAL_ADMIN_PASSWORD` | seed script | min 12 chars |
| `SITE_URL` | cookie issuance + CSP | `https://ankitdamess.in` |

---

**End of Authentication Flow v1.0**
