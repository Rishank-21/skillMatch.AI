# 🚀 SkillMatch.AI – Intelligent Talent & Mentor Matching Platform

**SkillMatch.AI** is a full-stack MERN application that intelligently connects users with mentors and job opportunities using **AI-powered résumé parsing**, **cosine similarity-based matching**, and **real-time features** like chat and Stripe-powered session booking.

---

## 🧠 Features

### 🔍 AI & Matching
- **AI Résumé Parsing** – Extracts skills, experience, and education automatically using OpenAI/Gemini API.  
- **Cosine Similarity Matching** – Matches users with mentors and jobs based on skill relevance.  
- **Smart Skill Suggestions** – Suggests new skills for improvement or résumé enhancement.  

### 💬 Real-Time Features
- **Socket.io Chat** – Enables instant mentor-user communication.  
- **Session Booking System** – Users can book, reschedule, or cancel sessions.  
- **Stripe Integration** – Secure payment flow for booking mentor sessions with webhook-based updates.

### 🧾 Resume & Portfolio
- **AI Resume Upload** – Upload PDFs and auto-fill data.  
- **Resume Builder** – Generate beautifully styled résumés as PDFs.  
- **Public Portfolio Link** – Share your mentor or user profile online.

### 👩‍🏫 Dashboards
- **User Dashboard** – View mentor suggestions, booked sessions, and chat.  
- **Mentor Dashboard** – Manage available slots, bookings, and chat.  
- **Admin Dashboard** – Monitor user growth, payments, and activity analytics.

---

## 🏗️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React.js, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **AI & Matching** |  Gemini API, Cosine Similarity (NLP-based) |
| **Authentication** | JWT, Google Firebase |
| **Payments** | Stripe API with Webhooks |
| **Real-time** | Socket.io |
| **Cloud Storage** | Cloudinary for profile & resume uploads |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## ⚙️ Project Structure

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

- # SkillMatch.AI — Frontend

Quick guide for local setup, important notes and developer tips for the frontend.

## Overview

This is the React frontend for the SkillMatch.AI project. It communicates with the backend API (cookie-based auth) and integrates Firebase (Google auth), Stripe for payments, and uses environment variables for runtime configuration.

## Prerequisites

- Node.js (16+ recommended)
- npm or pnpm
- A running backend API (see backend ROUTES_README.md)
- Stripe test keys, Firebase project, and Cloudinary credentials if testing uploads

## Install & Run

1. Install dependencies:

   - npm: `npm install`
   - pnpm: `pnpm install`

2. Local development:

   - `npm run dev` (Vite)

3. Build:
   - `npm run build`
   - `npm run preview` (optional)

## Important environment variables

Create a `.env` (or .env.local) with these variables (prefix VITE\_ for Vite):

- VITE_API_URL=https://your-backend.example.com
- VITE_IMAGE_URL=https://your-image-base-or-server
- VITE_FIREBASE_API, VITE_AUTH_DOMAIN, VITE_PROJECT_ID, VITE_STORAGE_BUCKET, VITE_MESSAGING_SENDER_ID, VITE_APP_ID (Firebase)
- VITE_STRIPE_PUBLISHABLE_KEY
- Other keys used by the backend should reside in backend env.

Note: The backend uses CLOUDINARY\_\* and email/stripe secrets — those are configured server-side.

## Key app files & components

- src/App.jsx — routes and protected navigation
- src/components/Nav.jsx — top navigation, shows username and logout
- src/pages/Register.jsx, src/pages/Login.jsx — auth forms + Google sign-in using firebase
- src/components/UploadResume.jsx — drag & drop resume upload and parse
- src/components/FindMentors.jsx — mentor search, list and Stripe booking flow
- src/components/Sessions.jsx, src/components/JoinSession.jsx — session listing and WebRTC join UI
- src/components/MentorDashboard.jsx, MentorComponent.jsx, EditMentorData.jsx — mentor profile flows
- src/redux/\* — Redux slices and store
- src/hooks/useGetCurrentUser.jsx, useGetMentorData.jsx — hooks to fetch authenticated user/mentor

## Auth & cookies

- Backend uses cookie-based JWT. All API calls that require auth must include `{ withCredentials: true }`.
- Ensure your browser and dev tools send cookies on cross-origin requests (CORS + credentials on backend).

## Image URL handling

- Backend returns Cloudinary full URLs or server-relative paths.
- Helper pattern used across components:
  - If profileImage begins with `http(s)://` use as-is.
  - Otherwise prepend `VITE_IMAGE_URL` (strip trailing slash) and normalize slashes.
- Do NOT prepend server base URL for Cloudinary secure URLs.

## File uploads & Multer

- Resume upload field name: `resume` (multipart/form-data)
- Mentor profile image field name: `profileImage`
- Backend may use memoryStorage for multer (req.file.buffer) — upload helper accepts buffers or file paths.
- Keep files reasonably small (< 5–10MB) in local testing.

## Stripe Booking Flow

- Frontend calls backend `POST /session/create-session` to create a Stripe Checkout session. Backend returns a redirect URL (data.url).
- After successful payment Stripe redirects to the frontend `payment-success` route with `?session_id=...`, which triggers `POST /session/verify-payment` on the backend.

## WebRTC & JoinSession

- JoinSession uses socket.io signaling with a local STUN configuration.
- The frontend expects a signaling server (socket.io) at the backend (or a dedicated socket server).
- Browser permissions are required for camera/microphone. Provide guidance to users to enable permissions if access denied.

## Development & debugging tips

- Use the browser DevTools Network tab to inspect API calls and cookies.
- For multipart uploads, Postman or curl is useful. Match field names exactly (`resume`, `profileImage`).
- If images fail to render, check src value — cloud URLs should be absolute (http(s)://).
- For Google sign-in, ensure Firebase config env vars are set and authorized origins include your dev URL.

## Testing

- Use Stripe test keys and test card numbers for payment flows.
- Ensure the backend's email transporter env (EMAIL, APP_PASSWORD) is set correctly to test outgoing emails.

## Troubleshooting

- 401 Unauthorized: verify cookie is returned and included; check backend CORS credentials.
- Upload timeouts: inspect file size and backend upload logic; try smaller files.
- WebRTC connection issues: check socket server URL, STUN server reachability, and network restrictions (NAT/firewall).

## References

- Backend routes quick reference: backend/ROUTES_README.md
- Frontend env example: check vite config or existing env files for variable usage.

If anything else is required (examples, scripts, or additions to README), provide the area to expand.
