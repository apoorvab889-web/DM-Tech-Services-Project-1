# MongoDB migration notes

This project has been migrated away from Supabase to a MongoDB + Express API.

## What changed
- Replaced Supabase auth/data access in the frontend with a Mongo-compatible API shim.
- Added an Express backend in `server/index.js`.
- Added MongoDB models for:
  - users
  - profiles
  - services
  - blogs
  - leads
  - testimonials
  - newsletter_subscribers
- Removed Google OAuth dependency from login/register and switched auth to email/password.
- Added automatic seed data for services, blog posts, and testimonials.
- The first registered account becomes `admin` automatically.

## Environment variables
Use the `.env` file included in the project:

```env
MONGODB_URI="mongodb://127.0.0.1:27017/dmtech"
JWT_SECRET="change-this-secret"
PORT="4000"
CLIENT_ORIGIN="http://localhost:3000"
VITE_API_URL="http://localhost:4000/api"
```

## Run locally
```bash
npm install
npm run dev:full
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api`

## Important
- You need a running MongoDB instance locally or a hosted MongoDB URI.
- Because this environment does not include a live MongoDB service, I validated the migration by building the frontend successfully after rewiring the data/auth layer. Full API runtime verification requires starting MongoDB and then running `npm run dev:full` on your machine.


## Patch update
- Fixed the first YouTube card so it opens a valid working video URL.
- Fixed blog routing so `/blog/<slug>` now renders the blog post page instead of re-showing the blog index page.
