# Testing & QA Guide
## Ankit Da Mess

This guide turns the current codebase into a practical test plan for validating the application feature-by-feature.

---

## 1. Test Scope

### Public Website
- Homepage sections and navigation
- Room listing and gallery interactions
- Contact form submission flow
- Responsive behavior on desktop/mobile

### Admin Portal
- Admin login screen
- Protected admin routes
- Dashboard shell
- CRUD-related admin pages and route access

### API Layer
- Public data endpoints
- Admin authentication endpoint
- Contact submission endpoint

---

## 2. Recommended Test Environment

### Required
- Node.js 20+ and npm 10+
- A local browser (Chrome/Edge recommended)
- Optional: MongoDB Atlas or local MongoDB for full backend validation

### Suggested local setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

---

## 3. Functional Test Checklist

### 3.1 Homepage
- Open http://localhost:3000
- Confirm navbar renders and is responsive
- Verify hero section appears with heading, CTA buttons, and background media
- Verify rooms, gallery, amenities, location, testimonials, contact, and CTA sections render
- Test scroll behavior and section anchors
- Confirm mobile menu opens and closes correctly

### 3.2 Rooms
- Verify room cards render with price, availability, and room details
- Confirm room links navigate correctly
- Check hover/interaction states on desktop

### 3.3 Gallery
- Confirm category filters work
- Open image lightbox and test keyboard navigation
- Verify gallery remains responsive on smaller screens

### 3.4 Contact Form
- Submit a valid enquiry using test data
- Confirm the API returns success and the submission is accepted
- Verify the UI shows success feedback without breaking
- Test invalid data handling for missing fields

### 3.5 Admin Login
- Open http://localhost:3000/admin/login
- Attempt login with preview-mode credentials:
  - owner@ankitdamess.in
  - admin@ankitdamess.in
- Confirm the login endpoint accepts the credentials and redirects to the dashboard
- Confirm error states render for invalid login attempts

### 3.6 Admin Dashboard
- After login, confirm the dashboard view renders
- Check that protected routes require authentication
- Verify navigation elements appear and route switching works

### 3.7 API Tests
Use the following endpoints:

- GET /api/public/rooms
- GET /api/public/rooms?slug=single-room
- POST /api/contact
- POST /api/admin/login
- POST /api/admin/logout

---

## 4. Suggested Test Data

### Contact Form
```json
{
  "name": "Test User",
  "email": "test.user@example.com",
  "phone": "+919876543210",
  "roomType": "single",
  "roomName": "Single Room",
  "message": "I would like to know the availability for August.",
  "source": "website"
}
```

### Admin Preview Credentials
```json
{
  "email": "owner@ankitdamess.in",
  "password": "any non-empty value"
}
```

> The current login route accepts preview-mode login for emails matching the owner/admin pattern without requiring a real database-backed password.

---

## 5. API Validation Notes

### Public Routes
- GET /api/public/rooms returns a success envelope and room data
- GET /api/public/rooms?slug=single-room returns the matching room

### Contact Route
- Valid submissions return HTTP 201
- Invalid JSON returns HTTP 400
- Validation failures return HTTP 422

### Admin Login Route
- Valid preview-mode credentials return success and set an auth cookie
- Invalid credentials return a 401-style error response

---

## 6. Regression Checklist

Before release, confirm:
- The home page loads without runtime errors
- Navigation works on mobile and desktop
- Contact form submission succeeds
- Admin login redirects correctly
- Environment values are present and do not crash the app

---

## 7. Known Current Notes

- The project currently uses a mock service layer for many public UI sections.
- Some admin features are scaffolded and may need backend wiring for full CRUD behavior.
- The login flow includes a temporary preview-mode bypass for local development.
