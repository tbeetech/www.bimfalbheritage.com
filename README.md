Bimfalb Heritage - Cultural Platform
=====================================

Single-service app: Express serves both the MongoDB-backed API and the built React UI.
Posts and all data are stored in **MongoDB Atlas**; images are uploaded to and served from local disk (`backend/uploads`).
Admin session uses cookies (the password can be remembered in `localStorage` for demo speed).

Stack
- Frontend: React (Vite), React Router, Day.js
- Backend: Node.js, Express, express-session, Multer → local disk, dotenv, CORS, Morgan
- Database: MongoDB Atlas (Mongoose ODM)
- File storage: Local disk (`backend/uploads`, served as `/uploads/*`)
- Deployment target: Render (one Web Service)

---

Folder structure
```
.
|- backend/             # Express API + static file server
|  |- src/
|  |  |- config/        # db.js – MongoDB connection
|  |  |- controllers/   # posts + auth handlers
|  |  |- routes/        # API routes
|  |  |- middleware/    # auth + errors
|  |  |- utils/         # Multer + image compression config
|  |  |- data/          # store.js (MongoDB via Mongoose)
|  |  |- seed/          # seed data + writer (seeds to MongoDB)
|  |  |- app.js         # Express app wiring
|  |  |- server.js      # Entrypoint
|  |- .env.example
|  |- package.json
|- frontend/            # Vite React SPA
|  |- public/           # Static assets copied verbatim to build output
|  |  |- .htaccess      # Apache SPA routing rules (copied into public_html/)
|  |- src/components/
|  |- src/pages/        # Home, About, Events, Donations, News, Contact, FAQ, Post, Admin
|  |- src/services/     # Axios helper + fallback
|  |- src/data/         # Local demo posts (fallback)
|  |- .env.example
|  |- package.json
|  |- vite.config.js    # outDir set to ../public_html (TrueHost document root)
|- public_html/         # ← build output / TrueHost document root (git-ignored)
|- .cpanel.yml          # cPanel Git deployment tasks
|- README.md
```

Quick start (local)
1) Copy env: `cp backend/.env.example backend/.env` and fill in:
   - `ADMIN_PASSWORD` (for admin login)
   - `SESSION_SECRET` (any random string)
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `MONGODB_URI_DIRECT` (optional direct-node Atlas URI fallback if SRV DNS lookup is blocked on your host)
   - `CORS_ORIGIN` (e.g. `http://localhost:5173` when hitting the API from Vite dev)
   - `SERVE_FRONTEND=true` (lets the Express server also serve the React build)
2) Install backend deps: `cd backend && npm install`.
3) Build the frontend into `public_html` (once per UI change):  
   `cd ../frontend && npm install && npm run build`
4) Seed demo posts to MongoDB (optional): `cd ../backend && npm run seed`.
5) Run everything: `npm run dev` (or `npm start`) from `backend`. The API and UI share `http://localhost:3000`.

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
- Images are stored on local disk in `backend/uploads/` and served at `/uploads/<filename>`.
- Uploaded images are compressed to JPEG (max 1200 px wide, 80% quality) before saving.

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
   - `MONGODB_URI=<your-mongodb-atlas-connection-string>`
   - `SERVE_FRONTEND=true`  ← tells Express to serve `public_html/` as the static root
5) Express serves `public_html` and the API under `/api/*`; no separate frontend URL needed.
6) Uploaded images are stored in `backend/uploads` on the Render disk and served at `/uploads/*`.

Vercel frontend + Render backend (recommended split setup)
1) Keep backend deployed on Render (`https://bimfalb-heritage.onrender.com`).
2) Keep root `vercel.json` rewrite so `/api/*` is proxied to Render.
3) In Vercel Project → Settings → Environment Variables, set:
   - `VITE_API_URL=` (empty) to use same-origin `/api/*` via `vercel.json` rewrite, or set it explicitly to `https://bimfalb-heritage.onrender.com`.
   - (optional) `VITE_PROD_API_FALLBACK_ORIGIN=` (leave empty unless you intentionally want direct cross-origin API calls)
   - (optional) `VITE_PROD_HOSTNAMES=www.bimfalbheritage.org,bimfalbheritage.org,www.bimfalbheritage.com,bimfalbheritage.com`
4) In Render backend env vars, ensure:
   - `CORS_ORIGIN=https://www.bimfalbheritage.org,https://bimfalbheritage.org,https://www.bimfalbheritage.com,https://bimfalbheritage.com`
   - `MONGODB_URI` and, when DNS SRV lookup is blocked, `MONGODB_URI_DIRECT`.
5) Redeploy both services after saving env vars.

TrueHost Web Hosting deployment (cPanel – Starter plan)
The strategy is a **two-folder split**: the React SPA lives in Apache's document root
(`public_html`), while the Express/Node.js backend lives in a private folder outside
`public_html` (cPanel's "Setup Node.js App" proxies `/api/*` to it via Passenger).

#### Part A – Automated deploy via cPanel Git Version Control
1) In cPanel → **Git™ Version Control**, clone this repository. Set the clone path to
   a private folder, e.g. `~/repos/www.bimfalbheritage.com`.
2) On every `git pull` / **Deploy**, cPanel runs `.cpanel.yml`, which:
   - installs frontend deps and builds the React SPA → outputs to `public_html/` in the
     repo
   - syncs `public_html/` to `~/public_html/` (removes stale files with `rsync --delete`)
   - runs `npm install` for the backend (deps installed in the private folder)
3) `frontend/public/.htaccess` is copied into `~/public_html/` during the build; it
   handles Apache URL rewriting for React Router (`/about`, `/contact`, etc.) while
   letting Apache's Passenger proxy handle `/api/*` requests.

#### Part B – Setup Node.js App (backend API)
1) In cPanel → **Setup Node.js App** → **Create Application**:
   - **Node.js version**: 18 or 20
   - **Application mode**: Production
   - **Application root**: `repos/<your-repo-name>/backend`
   - **Application URL**: `api`  ← this proxies `yourdomain.com/api/*` to Node.js
   - **Application startup file**: `src/server.js`
2) Click **Create**, then click **Run NPM Install** (or it was already done by `.cpanel.yml`).
3) Add **Environment Variables** in the Node.js App interface (do **not** upload `.env`):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<your MongoDB Atlas connection string>`
   - `ADMIN_PASSWORD` = `<your admin password>`
   - `SESSION_SECRET` = `<random string>`
   - `CORS_ORIGIN` = `https://yourdomain.com`
4) Click **Restart**.

#### Part C – MongoDB Atlas
1) Use **MongoDB Atlas** free tier (`cloud.mongodb.com`) — Starter plans cannot host MongoDB locally.
2) In Atlas → **Network Access** → **Add IP Address**: add your **TrueHost Shared IP**
   (found in cPanel → **Server Information**). Without this, the app returns "Connection
   Refused".

#### React Router on Apache (`.htaccess` summary)
The `.htaccess` deployed to `~/public_html/` does three things:
- Passes `/api/*` requests through unchanged (Passenger handles them).
- Serves existing files and directories (JS/CSS bundles, images) directly.
- Rewrites all other URLs to `/index.html` so React Router works client-side.

| Component  | Location on server             | Served by            |
|------------|-------------------------------|----------------------|
| React SPA  | `~/public_html/`              | Apache               |
| Express API| `~/repos/<repo>/backend/`     | Node.js via Passenger|
| MongoDB    | MongoDB Atlas (external)      | Atlas free cluster   |

Demo notes
- Newsletter form is frontend-only.
- Rich text editor supports headers, lists, links, quotes, bold/italic/underline.
- Blog list paginates; if the API is offline, the UI falls back to a built-in dataset.
- Cookie session keeps admin logged in for 4 hours by default; logout is available on the Admin page.
- Post detail pages include one-click sharing intents for WhatsApp, X, Facebook, LinkedIn, and email, plus copy-link support.
- Admin composer includes cooperation metadata and cross-platform publication fields.
- Post detail now supports Reddit-style interactions: upvote/downvote, comment posting, nested replies, and comment voting.
