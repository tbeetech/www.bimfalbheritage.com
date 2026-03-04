Bimfalb Heritage - Cultural Platform
=====================================

Single-service app: Express serves both the Firestore-backed API and the built React UI.
Posts are stored in **Firebase Firestore**; images are uploaded to **Firebase Storage**.
Admin session uses cookies (the password can be remembered in `localStorage` for demo speed).

Stack
- Frontend: React (Vite), React Router, Day.js
- Backend: Node.js, Express, express-session, Multer → Firebase Storage, dotenv, CORS, Morgan
- Database: Firebase Firestore (NoSQL cloud)
- File storage: Firebase Storage (public image URLs)
- Deployment target: Render (one Web Service)

---

Firebase setup (one-time, required)
-------------------------------------
1. Go to https://console.firebase.google.com and create a new project (or use an existing one).
2. **Enable Firestore**
   - In the Firebase Console: Build → Firestore Database → Create database.
   - Start in **production mode** (you can tighten rules later).
   - Choose the region closest to your users.
3. **Enable Storage**
   - In the Firebase Console: Build → Storage → Get started.
   - Accept the default security rules for now.
4. **Create a Service Account key**
   - Go to Project Settings (gear icon) → Service Accounts tab.
   - Click **Generate new private key** → confirm → a `.json` file is downloaded.
5. **Set environment variables** in `backend/.env` (see `backend/.env.example`):
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY=<paste the entire JSON file content as one line>
   FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
   ```
   > Tip: on Render, paste each variable value in the "Environment" section of your Web Service.
6. **Firestore security rules** – once tested, lock down the `posts` collection so only
   your server (service account) can write:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /posts/{postId} {
         allow read: if true;
         allow write: if false;   // writes are only via the Admin SDK (backend)
       }
     }
   }
   ```
7. **Storage CORS** – if the browser needs to load images directly from Storage,
   add a CORS config via `gsutil` or the Google Cloud Console:
   ```json
   [{"origin":["*"],"method":["GET"],"maxAgeSeconds":3600}]
   ```

---

Folder structure
```
.
|- backend/             # Express API + static file server
|  |- src/
|  |  |- config/        # firebase.js – Admin SDK initialisation
|  |  |- controllers/   # posts + auth handlers
|  |  |- routes/        # API routes
|  |  |- middleware/    # auth + errors
|  |  |- utils/         # Multer + Firebase Storage upload config
|  |  |- data/          # store.js (Firestore)
|  |  |- seed/          # seed data + writer (seeds to Firestore)
|  |  |- app.js         # Express app wiring
|  |  |- server.js      # Entrypoint
|  |- .env.example
|  |- package.json
|- frontend/            # Vite React SPA
|  |- src/components/
|  |- src/pages/        # Home, About, Events, Donations, News, Contact, FAQ, Post, Admin
|  |- src/services/     # Axios helper + fallback
|  |- src/data/         # Local demo posts (fallback)
|  |- .env.example
|  |- package.json
|- README.md
```

Quick start (local)
1) Copy env: `cp backend/.env.example backend/.env` and fill in:
   - `ADMIN_PASSWORD` (for admin login)
   - `SESSION_SECRET` (any random string)
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (full JSON from step 4 above)
   - `FIREBASE_STORAGE_BUCKET` (e.g. `my-project.appspot.com`)
   - `CORS_ORIGIN` (e.g. `http://localhost:5173` when hitting the API from Vite dev)
2) Install backend deps: `cd backend && npm install`.
3) Build the frontend into `frontend/dist` (once per UI change):  
   `cd ../frontend && npm install && npm run build`
4) Seed demo posts to Firestore (optional): `cd ../backend && npm run seed`.
5) Run everything: `npm run dev` (or `npm start`) from `backend`. The API and UI share `http://localhost:5000`.

Reference structure clone coverage
- Main menu is aligned to the live reference: `Home`, `About Us`, `Events`, `Donations`, `News`, `Contact Us`, `FAQ`.
- The homepage section order mirrors the reference flow (hero, values, team, artist CTA, goals, events, contact CTA).
- Footer structure mirrors the reference blocks (`About Us`, `Contact Info`, `Newsletter`, `Follow Us`, footer menu links).

API endpoints
- GET `/api/posts` (page, limit)
- GET `/api/posts?contentType=blog|vlog|news|lifestyle|event` (feed filter)
- GET `/api/posts/:id`
- POST `/api/posts` (admin-only, multipart; field name `coverImage`)
- PUT `/api/posts/:id` (admin-only)
- DELETE `/api/posts/:id` (admin-only)
- POST `/api/posts/:id/reactions` with `{ "type": "up" | "down" }`
- GET `/api/posts/:id/comments`
- POST `/api/posts/:id/comments` with `{ "author": "...", "text": "...", "parentId": null | "<comment-id>" }`
- POST `/api/posts/:id/comments/:commentId/reactions` with `{ "type": "up" | "down" }`
- POST `/api/auth/login` (sets cookie session)
- POST `/api/auth/logout`
- GET `/api/auth/status`
- GET `/api/health`

Blog cooperation and sharing fields
- `excerpt`
- `authorName`
- `collaborationPartner`
- `collaborationType`
- `sharePlatforms` (comma-separated list, e.g. `WhatsApp, X, Facebook, LinkedIn`)
- `contentType` (`blog`, `vlog`, `news`, `lifestyle`, `event`)
- `tags` (comma-separated)
- Event setup fields for event posts:
  - `eventTitle`
  - `eventStartDate`
  - `eventEndDate`
  - `eventLocation`
  - `eventExternalUrl`
  - `eventPlatform`

Admin auth
- POST `/api/auth/login` with `{ password: ADMIN_PASSWORD }` to start a session (`bh_session` cookie).
- The Admin UI page does this automatically and can remember the password in `localStorage`.

Uploads
- Images are uploaded to Firebase Storage and served via public `https://storage.googleapis.com/…` URLs.
- `FIREBASE_STORAGE_BUCKET` must be set; otherwise images fall back to local `backend/uploads` (ephemeral on Render).

Frontend-only dev (optional)
- `cd frontend && npm install && npm run dev` (set `VITE_API_URL` if you want to target a remote API; otherwise it uses window origin).

Render deployment (single Web Service)
1) Service root: repository root.
2) Build command:
   ```
   npm install --prefix backend
   npm install --prefix frontend
   npm run build --prefix frontend
   ```
3) Start command:
   ```
   cd backend && npm start
   ```
4) Environment variables on Render:
   - `ADMIN_PASSWORD=<your-password>`
   - `SESSION_SECRET=<random-string>`
   - `NODE_ENV=production`
   - `FIREBASE_SERVICE_ACCOUNT_KEY=<paste the full service account JSON>`
   - `FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com`
5) Express serves `frontend/dist` and the API under `/api/*`; no separate frontend URL needed.
6) The old `backend/uploads` disk is no longer needed since images are stored in Firebase Storage.

Demo notes
- Newsletter form is frontend-only.
- Rich text editor supports headers, lists, links, quotes, bold/italic/underline.
- Blog list paginates; if the API is offline, the UI falls back to a built-in dataset.
- Cookie session keeps admin logged in for 4 hours by default; logout is available on the Admin page.
- Post detail pages include one-click sharing intents for WhatsApp, X, Facebook, LinkedIn, and email, plus copy-link support.
- Admin composer includes cooperation metadata and cross-platform publication fields.
- Post detail now supports Reddit-style interactions: upvote/downvote, comment posting, nested replies, and comment voting.
