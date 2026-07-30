# Deployment Plan
## Ankit Da Mess — Vercel (Frontend) + MongoDB Atlas (DB) + Cloudinary (Media)

---

## 1. Production Topology

```
                    ┌─────────────────────────────────────┐
                    │        Cloudflare (optional)        │
                    │  Custom DNS + WAF + CDN + Cache     │
                    │  ankitdamess.in  →  CNAME Vercel    │
                    └──────────────────┬──────────────────┘
                                       │
                      ┌────────────────▼────────────────┐
                      │         Vercel Edge             │
                      │  ┌──────────────────────────┐   │
                      │  │   Global CDN (100+ PoPs) │   │
                      │  │  Static assets + ISR     │   │
                      │  └──────────────────────────┘   │
                      │  ┌──────────────────────────┐   │
                      │  │ Serverless Functions     │   │
                      │  │   /api/** route handlers │   │
                      │  │   middleware.ts          │   │
                      │  │   (us-east-1 + Mumbai)   │   │
                      │  └─────────────┬────────────┘   │
                      └────────────────┼────────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
      ┌─────────▼─────────┐  ┌────────▼────────┐  ┌──────────▼──────────┐
      │  MongoDB Atlas    │  │   Cloudinary     │  │  Resend / EmailJS   │
      │  M10 Cluster      │  │  Free / Paid     │  │  Transactional Email│
      │  (Mumbai ap-south)│  │  CDN 280+ PoPs   │  │  (US/EU endpoints)  │
      │  VPC Peering      │  │  Auto-format     │  │  SMTP + HTTP API    │
      │  + Atlas Search   │  │  Auto-compress   │  │  Open/Click tracking│
      │  Daily Point-in-  │  │  Upload Presets  │  │  Templates          │
      │  Time (7 days)    │  │  Media Library UI│  │  100/day free tier  │
      └───────────────────┘  └─────────────────┘  └─────────────────────┘
```

---

## 2. Environment Provisioning (Pre-Deployment Checklist)

### 2.1 Accounts & Billing
- [ ] **Vercel Pro** (not Hobby) for preview deployments, analytics, and ISR warm-keep
- [ ] **MongoDB Atlas M10** (Mumbai region, ap-south-1) — NOT the free M0 for production
- [ ] **Cloudinary** (Free tier is OK for launch; plan Medium at 25k+ images)
- [ ] **Transactional Email**: Resend (recommended) or EmailJS
- [ ] **Google Cloud**: Project with Maps JavaScript API + Places API enabled; API key restricted via HTTP referrer
- [ ] **Domain Registrar**: ankitdamess.in purchased; DNS nameservers ready to point

### 2.2 Environment Variables (Production)
**Saved in Vercel Project Settings → Environment Variables (encrypt all)**

| Key | Scope | Example | Notes |
|-----|-------|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | All | `https://ankitdamess.in` | Canonical base URL |
| `NEXT_PUBLIC_SITE_NAME` | All | `Ankit Da Mess` | Brand name |
| `NODE_ENV` | All | `production` | Auto-set by Vercel |
| `MONGODB_URI` | Server Only | `mongodb+srv://admin:pwd@cluster0..../ankitdamess?retryWrites=true&w=majority` | **MUST NOT have `NEXT_PUBLIC_` prefix** |
| `DB_NAME` | Server Only | `ankitdamess_prod` | |
| `JWT_SECRET` | Server Only | 96+ char crypto-random hex | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLOUDINARY_CLOUD_NAME` | Server Only | `ankit-da-mesh` | |
| `CLOUDINARY_API_KEY` | Server Only | `987654321098765` | |
| `CLOUDINARY_API_SECRET` | Server Only | `abc123...` | |
| `CLOUDINARY_UPLOAD_PRESET` | Server + Client? | `unsigned_gallery` (signed preferred) | |
| `RESEND_API_KEY` | Server Only | `re_**************` | Resend |
| `CONTACT_FORM_RECIPIENT` | Server Only | `bookings@ankitdamess.in` | Where contact submissions arrive |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Public (restricted referrer) | `AIza...` | MUST be key-restricted in Google Cloud Console to `*.ankitdamess.in/*` + `ankitdamess.in/*` |
| `INITIAL_ADMIN_EMAIL` | Deployment (seed) | `owner@ankitdamess.in` | Used only on first deploy (seed) |
| `INITIAL_ADMIN_PASSWORD` | Deployment (seed) | min 12 chars, 1 num, 1 special | One-time seed |
| `NEXT_PUBLIC_ANALYTICS_ID` | Public | `G-XXXXXXXXXX` | GA4 (optional) |

---

## 3. Deployment Workflow — Git-based (Vercel Automatic)

### 3.1 Git Branch Strategy
```
  main ──────────────────────────────────────────────► Production (ankitdamess.in)
   │
   ├── preview/*  ──► Vercel Preview (auto-URL per PR)
   │    (features, bug-fixes)
   │
   └── staging    (optional dedicated branch for UAT)
         └────► staging-ankitdamess.vercel.app
```

### 3.2 Vercel Project Settings
```
  Framework Preset:  Next.js
  Root Directory:    ./  (package.json at repo root)
  Build Command:     next build  (Vercel auto)
  Install Command:   npm install  (auto)
  Output Directory:  .next  (auto)
  Node.js Version:   20.x (LTS)  (or 22.x once LTS — lock in Settings)

  Git Integration:
    Production Branch: main
    Preview Branches:  all except main

  Ignored Build Step:  Auto (Vercel optimizes)

  Security:
    Password Protection:  ON for preview deployments (share with client only)
    Vercel Authentication: ON for /admin on preview
```

### 3.3 Build Phases (per deploy)
```
Phase 1: Install  (npm ci, cache restored from Vercel Remote Cache ~5s)
Phase 2: Lint     (next lint — fail on any error; no warnings allowed)
Phase 3: TypeCheck (tsc --noEmit — strict mode)
Phase 4: Build    (next build — ISR pages, edge runtime middleware)
Phase 5: Postbuild (validate env via server/lib/env.ts — fail on missing vars)
Phase 6: Deploy   (upload to Edge, invalidate CDN, warm edge lambdas)
Phase 7: Postdeploy Hook (optional):
           ├── curl -X POST /api/revalidate?all → warm all tags
           └── healthcheck curl -I $SITE_URL  (expect 200)
```

---

## 4. Database Deployment (MongoDB Atlas)

### 4.1 Cluster Setup
```
  Cluster Tier:     M10 (2GB RAM, 10GB SSD, replica set 3-nodes)
  Region:           Mumbai (ap-south-1) — lowest latency for Indian audience
  MongoDB Version:  7.x (latest stable)
  Backup:           Point-in-Time Recovery = ON (7-day window)
  Encryption:       Encryption at Rest = ON (default on Atlas paid tiers)
  VPC Peering:      ON (connect Vercel region via AWS PrivateLink / VPC Peering)
```

### 4.2 Network Access
```
  Initially (dev):  Allow 0.0.0.0/0  (Temporary — REMOVE BEFORE GO-LIVE)
  Production:       ONLY allow Vercel's IP list + VPC Peering
                    (Vercel publishes its egress IP ranges; check Vercel docs)
```

### 4.3 Database User
```
  User:             ankitda_app
  Password:         32+ char generated via LastPass
  Built-in Role:    readWrite@ankitdamess_prod
  Auth DB:          admin
  Scram SHA-256:    Yes
```

### 4.4 Index Build
After first seed:
```
  mongosh "mongodb+srv://..." ankitdamess_prod --eval "
    db.rooms.createIndex({ availability: 1, featured: -1, sortOrder: 1 });
    db.rooms.createIndex({ slug: 1 }, { unique: true });
    db.gallery.createIndex({ category: 1, sortOrder: 1 });
    db.testimonials.createIndex({ featured: -1, createdAt: -1 });
    db.media.createIndex({ publicId: 1 }, { unique: true });
    db.admins.createIndex({ email: 1 }, { unique: true });
    db.contact_submissions.createIndex({ ip: 1, createdAt: -1 });
    db.contact_submissions.createIndex({ email: 1, createdAt: -1 });
  "
```

---

## 5. Cloudinary Setup

### 5.1 Account Config
```
  Cloud Name: ankit-da-mesh
  Delivery Type: Authenticated + Public (for web images)
  Upload Presets (Signed Uploads PREFERRED — no unsigned client upload keys):
     preset: "admin_image_upload"
       SigningMode: Signed (server-side via API route)
       AllowedFormats: jpg, jpeg, png, webp, avif, mp4
       MaxFileSize: image=10MB, video=100MB
       Folder: auto-create by parameter
       Incoming Transformations:
         images: f_auto,q_auto,dpr_auto,w_2400  (auto format + quality)
         videos: f_mp4,vc_h265,q_auto,w_1920
```

### 5.2 Delivery URL Settings
```
  CNAME:           media.ankitdamess.in → CNAME res.cloudinary.com
  Secure URLs:     https only, Strict-Transport-Security header
  Lazy-loaded:     ALL images via <Image> component (next/image + Cloudinary loader)
```

---

## 6. Go-Live Runbook (Day of Launch)

### 6.1 Pre-Go-Live (T-Minus 24h)
```
[ ] 1. Run Lighthouse on preview: Performance/Accessibility/Best Practices/SEO ≥ 95
[ ] 2. Validate contact form → email arrives in bookings@ankitdamess.in
[ ] 3. Admin CRUD smoke test:
       [ ] Create room, edit room, delete room (confirm + undo-restore via deletedAt)
       [ ] Upload 3 gallery images, delete one
       [ ] Change hero headline, confirm / displays new headline (<60s via ISR)
[ ] 4. SEO audit:
       [ ] robots.txt accessible → /robots.txt, disallow /admin /api
       [ ] sitemap.xml accessible → /sitemap.xml, contains all public pages
       [ ] curl https://preview -> OG tags rendered (non-JS crawler)
       [ ] Schema.org JSON-LD <script type="application/ld+json"> present on homepage
[ ] 5. A11y: axe-core browser extension audit → 0 critical / 0 serious
[ ] 6. Security:
       [ ] securityheaders.com → A rating
       [ ] HSTS header present (max-age 2y; preload submit to Chrome preload list)
       [ ] No secrets visible in /_next/static/*.js search (JWT, MongoDB)
[ ] 7. Database backup: Manual Atlas snapshot named pre-go-live
[ ] 8. Content audit:
       [ ] Hero video plays, poster fallback works on Safari desktop
       [ ] Gallery categories display correct count
       [ ] Rooms: at least 3 published with status = available
       [ ] Footer links + socials correct
```

### 6.2 Go-Live (T=0)
```
[ ] 1. Verify `main` branch is green, last Preview build 100%
[ ] 2. Click "Promote to Production" in Vercel (or merge to main → triggers auto deploy)
[ ] 3. In Domain Registrar (or Cloudflare):
         APEX @  →  76.76.21.21   (Vercel Anycast)
         www     →  CNAME   cname.vercel-dns.com
         media   →  CNAME   res.cloudinary.com   (if custom media subdomain)
[ ] 4. Vercel: Project → Domains → Add "ankitdamess.in" + "www.ankitdamess.in"
         Vercel auto-provisions Let's Encrypt cert for both + redirect www → @
[ ] 5. Wait for DNS propagation (10-60 min, use whatsmydns.net)
[ ] 6. Smoke test live:
         [ ] Open ankitdamess.in in Incognito Chrome → no console errors
         [ ] Admin login works → cookie set, dashboard loads
         [ ] Submit contact form → email arrives
         [ ] Whatsapp/Call buttons open apps
[ ] 7. Google: Submit property via Google Search Console + request re-indexing
[ ] 8. Set up uptime monitor (BetterUptime / StatusCake):
         HTTPS check every 1 minute, alerts to owner's WhatsApp + email
```

### 6.3 Post-Go-Live (T+24h, T+7d, T+30d)
```
T+24h check:
  [ ] Vercel Analytics → Function executions healthy
  [ ] MongoDB Atlas: Latency < 30ms p95
  [ ] Contact form: at least 1 test submission delivered
  [ ] Lighthouse scan again → numbers stable ≥ 95

T+7d check:
  [ ] Cloudinary: no upload errors in console
  [ ] Google Search Console: impressions > 0
  [ ] Uptime monitor: no downtime blips

T+30d review:
  [ ] Atlas: assess load → scale up to M20 if CPU > 70% peak
  [ ] Vercel: Pro plan usage within allocations (Bandwidth, Build minutes, Function invocations)
  [ ] Review contact inquiries: client happy? adjust CTA?
```

---

## 7. Rollback Plan (If something fails)

**Hot-Rollback (2 minutes)**:
1. Open Vercel Dashboard → Deployments → Previous successful build (the one before last deploy).
2. Click `...` → `Promote to Production`.
3. CDN cuts over in ~60 seconds.

**Warm-Rollback (git-based)**:
- `git revert <commit>` → push to main → triggers clean rebuild.

**Database Rollback**:
- MongoDB Atlas UI → Backup → Restore Snapshot (pre-go-live) to a temporary cluster.
- Validate data in temp cluster, then swap MONGODB_URI env var + redeploy (60s).

---

## 8. Monitoring & Observability (Post-Launch)

| What | Tool | Alert When |
|------|------|------------|
| Site Uptime | BetterUptime | Status ≠ 200 for 2 minutes |
| Function Errors | Vercel Runtime Logs → Slack webhook | Error rate > 1% in 5m window |
| DB Latency | MongoDB Atlas Alerts | p95 latency > 100ms |
| Disk Space | MongoDB Atlas Alerts | Storage < 30% free |
| CDN Cache Hit Ratio | Cloudflare Analytics | < 90% |
| Core Web Vitals | Vercel Analytics + PageSpeed Insights | LCP regresses > 2.8s, CLS > 0.15 |
| 404 Spikes | Vercel Log Drain → Logtail | 4xx / 5xx count up 5× baseline |

---

**End of Deployment Plan v1.0**
