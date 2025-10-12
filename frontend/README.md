# SkillMatch.AI — Frontend

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
