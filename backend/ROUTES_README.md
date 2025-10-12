# Backend Routes — Quick Reference

This document summarizes the main backend route files, their endpoints, expected request payloads, and important notes for testing and troubleshooting.

## Files & Endpoints

### authRoutes.js

- POST /auth/register
  - Body (json): { username, email, password, role } (role: "user"|"mentor")
  - Returns: created user and cookie token
- POST /auth/login
  - Body (json): { email, password }
- POST /auth/logout
- GET /auth/profile
  - Auth required (cookie)
- POST /auth/google
  - Body (json): { username, email, role }

Notes: Validation via express-validator. Cookies used for auth token.

---

### mentorRoutes.js

- POST /mentor/complete-profile
  - Auth required
  - multipart/form-data
  - Fields: bio (string), skills (stringified array or comma list), availableSlots (stringified array), fee
  - File: profileImage (image) — field name must be `profileImage`
- PUT /mentor/update-mentor-data
  - Auth required
  - multipart/form-data (optional profileImage)
- GET /mentor/mentorData
  - Auth required
- POST /mentor/send-feedback
  - Body: { from, message } — sends feedback email

Notes:

- Multer is configured to use memoryStorage (backend/middlewares/multer.js).
- Images uploaded to Cloudinary; backend stores and returns secure Cloudinary URLs.

---

### sessionRoutes.js

- POST /session/create-session
  - Body: { userId, mentorId, sessionTime (array), amountInCents }
  - Creates Stripe Checkout session (no auth required for creation endpoint)
- POST /session/verify-payment
  - Body: { sessionId } — verifies Stripe session and saves Session document
- GET /session/all
  - Auth required
  - Returns sessions for the authenticated user
- POST /session/send-mail
  - Auth required
  - Body: { to, from, subject, message } — forwards email via configured transporter
- POST /session/join
  - Body: { sessionId } — toggle/join session
- GET /session/mentor-session
  - Auth required
  - Returns sessions for the mentor associated with the authenticated user

Notes:

- Stripe metadata is used to pass userId/mentorId/sessionTime.
- Session model contains sessionTime array and status.

---

### getMentorRoutes.js

- GET /skills/mentor
  - Auth required
  - Returns mentors matched against the logged-in user's parsed resume skills
- POST /search
  - Auth required
  - Body: { searchTerm } — searches mentors by username/skills

Notes:

- Uses Resume -> extractedSkills and Mentor.skills to compute a simple match score.

---

### resumeRoutes.js

- POST /parse
  - Auth required
  - multipart/form-data
  - File: resume (PDF)
  - Reads PDF, extracts text/skills, uploads PDF to Cloudinary (field `resume`)
- POST /save
  - Auth required
  - Saves parsed resume content (no file required)
- GET /me
  - Auth required
  - Returns stored resume for the user

Notes:

- Current parse flow expects an uploaded file; multer usage in this file uses disk `uploads/` (see router).
- Resume schema expects `originalText` and `extractedSkills`.

## Important Environment Variables

- CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- EMAIL, APP_PASSWORD (Gmail app password) — used by nodemailer
- VITE_API_URL, VITE_IMAGE_URL (frontend)
- CLIENT_URL (redirects for Stripe)
- STRIPE secret key (configured in backend/config/stripe.js)
- NODE_ENV, other standard .env entries

## Client-side Notes / Troubleshooting

- Profile images returned by the backend are Cloudinary secure URLs. Frontend must not prepend server base URL to full Cloudinary URLs. Use a helper:
  - If profileImage starts with `http(s)://` use it as-is; otherwise prepend VITE_IMAGE_URL.
- Multer memoryStorage means uploaded files are in req.file.buffer (no path). uploadOnCloudinary accepts buffer or path.
- Keep file sizes small (<= 5MB) to avoid upload timeouts. Add client-side size checks before uploading.
- For missing images, open browser DevTools → Network/Console and verify the <img> src (should be valid http(s) or server path). Check CORS and mixed-content (HTTP vs HTTPS) issues.

## Testing Tips

- Use Postman or curl for multipart/form-data uploads:
  - Field name for profile photo: `profileImage`
  - Field name for resume: `resume`
- Ensure you are sending cookies for auth-required routes (withCredentials: true in axios or send cookies in Postman).
- For Stripe tests, use Stripe test keys and follow webhook / verify workflow if needed.

## Cron jobs

- sessionReminder.js: Sends email reminders (runs every minute).
- sessionStatusUpdater.js: Updates session statuses (runs every minute).
- Ensure transporter env (EMAIL & APP_PASSWORD) is correct to enable email sending.

## Quick Summary

- Upload fields:
  - profileImage (mentor photo)
  - resume (PDF)
- Auth: cookie-based JWT; routes protected by isAuth middleware
- Image handling: Cloudinary (secure URL returned). Frontend must handle absolute vs relative URLs.
