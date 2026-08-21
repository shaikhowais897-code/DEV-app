# Whoosh Streaming — TODO

## Backend
[x] Project configuration (package.json, env, gitignore)
[x] Database connection (MongoDB + Mongoose)
[x] Models: User, Movie, Watchlist, Rating, WatchProgress, AuditLog
[x] Utility classes (ApiError, ApiResponse)
[x] Logger (winston)
[x] Error handler middleware
[x] Authentication middleware (JWT)
[x] Authorization middleware (role-based)
[x] Validation middleware (express-validator)
[x] Auth service + controller + routes
[x] Movie service + controller + routes
[x] Watchlist service + controller + routes
[x] Rating service + controller + routes
[x] Watch progress service + controller + routes
[x] Admin service + controller + routes
[x] Search endpoint
[x] Category endpoint
[x] Database seeder
[x] Express app bootstrap (cors, helmet, rate limit)
[x] Server entry point (graceful shutdown)
[x] Documentation system (14 /docs files)
[x] Integration tests — 45/45 passing (auth, movies, api)
[x] Refresh token rotation with jti uniqueness guarantee

## Pending
[ ] Frontend API integration (replace DEV-app mock data with API calls)
[ ] Gemini AI recommendation engine integration
[!] Payment integration — waiting for provider decision
[!] Video upload pipeline — waiting for storage decision (S3/GCS)
