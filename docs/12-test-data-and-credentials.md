# Test Data & Credentials
## Ankit Da Mess

This document summarizes the sample values and credentials that can be used to exercise the application locally.

---

## 1. Default Environment Values
These values are already documented in .env.example and are safe to use for local preview/testing.

```env
NEXT_PUBLIC_SITE_URL=https://ankitdamess.in
NEXT_PUBLIC_SITE_NAME=Ankit Da Mess
NODE_ENV=development
DB_NAME=ankitdamess_dev
```

---

## 2. Admin Preview Credentials
The current login route supports preview-mode login for the following emails:

- owner@ankitdamess.in
- admin@ankitdamess.in

Password:
- Any non-empty string is accepted in preview mode for these addresses.

Example:
```json
{
  "email": "owner@ankitdamess.in",
  "password": "preview"
}
```

---

## 3. Sample Contact Submission
```json
{
  "name": "Test Visitor",
  "email": "visitor@example.com",
  "phone": "+919876543210",
  "roomType": "single",
  "roomName": "Single Room",
  "message": "Hello, I would like to know availability for next month.",
  "source": "website"
}
```

---

## 4. Sample Room Data
The current app includes mock room data for:
- Single Room
- Shared Room
- Room with Balcony
- Premium Room

These are surfaced by the public rooms service and the public rooms API.

---

## 5. Notes for Full Backend Testing
When MongoDB is configured, the app can also use real admin and enquiry persistence. Until then, preview-mode authentication and mock services keep the UX usable for local testing.
