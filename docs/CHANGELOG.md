# Whoosh Streaming — Changelog

## [1.1.0] — 2026-08-21 (Tests & Fixes)
### Fixed
- `tests/setup.js` import paths corrected (`../../src/` → `../src/`)
- Refresh token rotation guaranteed unique via `jti: crypto.randomUUID()` in JWT payload (prevents same-second token collision)

### Tests
- 45/45 integration tests passing across 3 suites (auth, movies, api)
- Covers: register, login, token refresh, profile update, role escalation prevention
- Covers: movie CRUD, featured toggle, genre/access filter, pagination, search
- Covers: watchlist add/remove/duplicate prevention, ratings submit/update/remove/breakdown
- Covers: watch progress, admin stats/protection, categories, 404 handler, health check
- Complete backend API with Express.js + MongoDB
- Authentication module: register, login, token refresh, profile management
- Movie module: full CRUD, search, filter, pagination, featured movies
- Watchlist module: add/remove/list per user
- Rating module: submit/update/remove ratings with community aggregate
- Watch progress module: continue watching with remaining time calculation
- Admin module: user management, audit logs, dashboard statistics
- Category endpoint (static genre list)
- Search endpoint with query, genre, and access level filters
- Database seeder migrating all frontend mock data
- Centralized error handling with consistent response format
- JWT authentication with refresh token rotation
- Role-based authorization (admin/user)
- Input validation on all endpoints (express-validator)
- Security: helmet, CORS, rate limiting, bcrypt
- Structured logging with winston
- Full documentation system (14 context files in /docs)
- Health check endpoint
