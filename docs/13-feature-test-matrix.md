# Feature Test Matrix
## Ankit Da Mess

| Area | Feature | Priority | Test Method | Expected Result |
|---|---|---:|---|---|
| Public UI | Homepage loads | P0 | Browser | All sections render without errors |
| Public UI | Navbar mobile menu | P0 | Browser | Menu opens and closes smoothly |
| Public UI | Hero section | P0 | Browser | Heading, CTA buttons, and media appear |
| Public UI | Room cards | P0 | Browser/API | Room cards show pricing and availability |
| Public UI | Gallery filters | P0 | Browser | Filtered images update correctly |
| Public UI | Gallery lightbox | P0 | Browser | Full-screen modal opens and closes |
| Forms | Contact enquiry | P0 | Browser/API | Submission succeeds and returns success response |
| Auth | Admin login | P0 | Browser/API | Preview credentials log in successfully |
| Auth | Protected dashboard | P0 | Browser | Unauthenticated access redirects |
| Admin | Dashboard shell | P1 | Browser | Dashboard cards and sections appear |
| Admin | CRUD route presence | P1 | Browser | Route structure is reachable |
| API | Public rooms API | P0 | Postman/curl | Returns rooms payload |
| API | Contact API | P0 | Postman/curl | Returns 201 for valid data |
| API | Admin login API | P0 | Postman/curl | Returns success for preview credentials |
