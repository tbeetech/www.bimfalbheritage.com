Bimfalb Heritage - Cultural Platform Prototype
==============================================

Single-service demo: Express serves both the JSON-backed API and the built React UI (no MongoDB required). Posts live in a local JSON file; admin session uses cookies (and the password can be remembered in `localStorage` for demo speed).

Stack
- Frontend: React (Vite), React Router, Day.js
- Backend: Node.js, Express, express-session, Multer (local uploads), dotenv, CORS, Morgan
- Storage: `backend/src/data/posts.json` (file-based)
- Deployment target: Render (one Web Service)

Folder structure
```
.
|- backend/             # Express API + static file server
|  |- src/
|  |  |- controllers/   # posts + auth handlers
|  |  |- routes/        # API routes
|  |  |- middleware/    # auth + errors
|  |  |- utils/         # Multer upload config
|  |  |- data/          # posts.json store
|  |  |- seed/          # seed data + writer
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

Quick start (single service)
1) Copy env: `cp backend/.env.example backend/.env` and set:
   - `ADMIN_PASSWORD` (for admin login)
   - `SESSION_SECRET` (any random string)
   - `CORS_ORIGIN` (optional, e.g., `http://localhost:5173` when hitting the API from Vite dev)
2) Install backend deps: `cd backend && npm install`.
3) Build the frontend into `frontend/dist` (once per UI change):  
   `cd ../frontend && npm install && npm run build`
4) Seed demo posts (optional): `cd ../backend && npm run seed`.
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
- Saved to `backend/uploads`, served from `/uploads/<filename>`. On Render they are ephemeral unless you add a persistent disk.

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
4) Environment variables:
   - `ADMIN_PASSWORD=<your-password>`
   - `SESSION_SECRET=<random-string>`
   - `NODE_ENV=production`
5) Express serves `frontend/dist` and the API under `/api/*`; no separate frontend URL needed.
6) Add a Render disk pointing to `backend/uploads` if you want uploaded images to persist across deploys.

Demo notes
- Newsletter form is frontend-only.
- Rich text editor supports headers, lists, links, quotes, bold/italic/underline.
- Blog list paginates; if the API is offline, the UI falls back to a built-in dataset.
- Cookie session keeps admin logged in for 4 hours by default; logout is available on the Admin page.
- Post detail pages include one-click sharing intents for WhatsApp, X, Facebook, LinkedIn, and email, plus copy-link support.
- Admin composer includes cooperation metadata and cross-platform publication fields.
- Post detail now supports Reddit-style interactions: upvote/downvote, comment posting, nested replies, and comment voting.
