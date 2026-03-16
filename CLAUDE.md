# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PersonaLink is a personal profile sharing platform (个人信息分享平台) built for classroom/small organization use. It features user profiles, a photo wall with waterfall layout, class management, and synonym-enhanced search.

## Development Commands

### Frontend (run from `PersonaLink/`)
```bash
npm run dev      # Start Vite dev server on port 3000
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
```

### Backend (run from `PersonaLink/backend/`)
```bash
npm run dev   # Start Express server with nodemon (port 3003, hot reload)
npm start     # Start Express server without hot reload
```

### Running the full app locally
Start both servers simultaneously — the Vite dev server proxies `/api` requests to `localhost:3003`.

## Architecture

**Frontend**: Vue 3 + Pinia + Vue Router 4 + Vite, with Axios for HTTP and SCSS for styling.

**Backend**: Node.js + Express on port 3003, using LowDB (file-based JSON at `backend/db.json`) as the database. No migrations — schema changes are handled by backward-compatible logic in `backend/db.js`.

### API URL Resolution (`src/config/api.js`)
- `localhost` / `127.0.0.1` → `http://localhost:3003/api` (dev)
- Other hosts → `${protocol}//${hostname}/api` (production via Nginx reverse proxy)

### Authentication
There is no JWT or session system. User identity is persisted in `localStorage` via the Pinia user store. Admin operations use hardcoded credentials checked server-side in `backend/middleware/adminAuth.js`:
- Admin email: `admin@system.com`, password: `admin123`
- Default demo user: `admin@example.com` / `admin123`

All admin routes expect `{ adminEmail, adminPassword }` in the request body.

### Pinia Stores (`src/stores/`)
- `user.js` — auth (login/register/logout), profile management, user search
- `class.js` — class CRUD (admin)
- `photoWall.js` — fetches and filters users for the photo wall
- `synonym.js` — synonym group CRUD (admin); synonyms expand search queries

### Route Guards (`src/main.js`)
- Unauthenticated users redirect to `/login`
- Non-admin users are blocked from `/classes`, `/synonym-management`, `/user-management`
- Admin status is determined by `userStore.currentUser.isAdmin`

### Backend Routes (`backend/routes/`)
| File | Mount | Key endpoints |
|------|-------|--------------|
| `users.js` | `/api/users` | register, login, search, profile CRUD |
| `classes.js` | `/api/classes` | class CRUD |
| `photowall.js` | `/api/photowall` | users for photo wall, filter by class |
| `synonyms_new.js` | `/api/synonyms` | synonym group CRUD |

### Search
`backend/utils/searchUtils.js` implements synonym-aware search — when a query term matches a synonym group, it expands the search to all synonyms in that group.

### Waterfall Layout
`src/components/WaterfallLayout.vue` implements a responsive masonry grid (2–5 columns). It dynamically calculates column count and item positions; this component is performance-sensitive.

## Deployment

### Local / LAN (original mode)
See `部署指南.md`. Nginx (`nginx.conf`) serves `dist/` and proxies `/api` → port 3003.

### Netlify (full-stack serverless)
`netlify.toml` configures the build and functions. The backend runs as a Netlify Function at `netlify/functions/api.js` using `serverless-http` to wrap the existing Express routes. Data is stored in **Supabase** (cloud PostgreSQL).

Setup steps:
1. Run `supabase-schema.sql` in Supabase Dashboard > SQL Editor (choose Singapore region for China access)
2. In Netlify Dashboard > Site Settings > Environment Variables, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Connect the repo to Netlify — it auto-detects `netlify.toml` and deploys

### GitHub Pages (static frontend only)
`.github/workflows/deploy-pages.yml` builds and deploys the frontend via GitHub Actions.

Setup steps:
1. Enable GitHub Pages in repo Settings > Pages, source = "GitHub Actions"
2. Add repository secret `VITE_API_URL` = `https://your-site.netlify.app/api` (the Netlify backend URL)
3. Add repository variable `VITE_BASE_URL` = `/repo-name/` (if deployed in a subdirectory) or `/`
4. Push to `main` to trigger deployment

### Database switching
`backend/db.js` auto-detects: when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars are set, it delegates to `backend/db-supabase.js`; otherwise falls back to the local `db.json` file.

### China accessibility note
- `*.netlify.app` is blocked in China — a custom domain pointed at Netlify works better
- `*.github.io` is unreliable in China — a custom domain is recommended
- Supabase Singapore region has ~100–200ms latency from mainland China (acceptable)
