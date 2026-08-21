# PROJECT MEMORY

## Current State
- Backend: **Complete and fully verified** — all 28 API endpoints implemented, 45/45 integration tests passing
- Database: MongoDB with Mongoose, seeder populates 4 users, 13 movies, audit logs, watchlist, progress
- Server: Starts on port 5000, connects to MongoDB successfully
- Current phase: **Backend complete** — ready for frontend API integration

## Completed
- Express app with helmet, CORS, rate limiting
- 6 Mongoose models: User, Movie, Watchlist, Rating, WatchProgress, AuditLog
- JWT auth with refresh token rotation + bcrypt (12 rounds) + jti for unique refresh tokens
- Role-based authorization (admin/user)
- Movie CRUD + search/filter/pagination + featured
- Watchlist add/remove/list (per-user)
- Rating submit/remove with real-time aggregate recalculation
- Watch progress tracking (continue-watching)
- Admin: user management, audit logs, dashboard stats
- Categories (static), Search (dedicated endpoint)
- Input validation (express-validator) on all endpoints
- Centralized error handling with consistent JSON format
- Database seeder migrating all frontend mock data
- Integration tests: 45/45 passing (auth, movies, api suites)
- 14 documentation files in /docs

## Important Decisions
- MongoDB chosen for document-oriented data (nested arrays)
- Movie slug used as API identifier (not ObjectId) — frontend compatibility
- JWT access + refresh tokens; refresh token includes `jti: crypto.randomUUID()` to guarantee uniqueness on rotation
- Separate backend/ directory with own package.json
- Categories are static (no DB model)
- Rating aggregates recalculated in real-time from individual Rating docs

## Important Constraints
- Frontend has ZERO API calls — entirely client-side mock data (integration is next phase)
- No video upload pipeline (external URLs only)
- No payment integration (mock billing status)
- Gemini API key available but not integrated yet

## Known Issues
- None

## Next Actions
- Frontend API integration (replace DEV-app mock data with real API calls)
- Gemini AI recommendation engine integration (optional)

## Important Files
- `backend/src/app.js` — Express app bootstrap, all routes mounted
- `backend/src/server.js` — Server entry point
- `backend/src/config/env.js` — Environment config with validation
- `backend/src/services/authService.js` — JWT auth with jti refresh rotation
- `backend/src/middlewares/auth.js` — JWT authentication middleware
- `backend/src/middlewares/authorize.js` — Role-based access middleware
- `backend/src/middlewares/errorHandler.js` — Centralized error handling
- `backend/src/utils/seed.js` — Database seeder
- `backend/tests/setup.js` — Test helpers (createTestUser, createTestAdmin, createTestMovie)
- `backend/.env.example` — Environment template
- `docs/API_CONTRACT.md` — Full API reference
