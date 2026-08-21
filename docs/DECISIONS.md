# Whoosh Streaming — Architecture Decision Log

## DEC-001
**Decision**: Use MongoDB with Mongoose as the database  
**Why**: Data is document-oriented — movies have nested arrays (cast, episodes, badges, genre). Schema flexibility suits the prototype-stage project.  
**Alternatives**: PostgreSQL with JSONB columns  
**Impact**: All models use Mongoose schemas  
**Date**: 2026-08-21  

## DEC-002
**Decision**: JWT with access + refresh token pattern  
**Why**: Stateless auth for API-first architecture. Refresh token rotation prevents token theft.  
**Alternatives**: Session-based auth with express-session + connect-mongo  
**Impact**: Token stored client-side, refresh endpoint for rotation  
**Date**: 2026-08-21  

## DEC-003
**Decision**: Use movie slug as the primary API identifier instead of MongoDB ObjectId  
**Why**: Frontend uses human-readable IDs (e.g., `interstellar-voyage`). Using slugs maintains frontend compatibility and produces clean URLs.  
**Alternatives**: Use ObjectId and add a separate slug field for URL  
**Impact**: Movie routes use `:id` which maps to slug, not ObjectId  
**Date**: 2026-08-21  

## DEC-004
**Decision**: Separate backend from frontend in its own `/backend` directory with own package.json  
**Why**: Clean separation of concerns. Frontend is a Vite SPA, backend is a Node/Express API. Independent dependency management.  
**Alternatives**: Monorepo with shared root package.json  
**Impact**: Two separate `npm install` and `npm run dev` commands  
**Date**: 2026-08-21  

## DEC-005
**Decision**: Categories served as static data from the controller, not from database  
**Why**: Categories are a fixed genre list that rarely changes. No CRUD needed. Avoids unnecessary database overhead.  
**Alternatives**: Category model in MongoDB  
**Impact**: GET /api/v1/categories returns hardcoded array  
**Date**: 2026-08-21  

## DEC-006
**Decision**: Ratings stored individually with real-time aggregate recalculation  
**Why**: Separate Rating documents allow per-user rating tracking and accurate aggregate computation. Matches frontend's ratingsBreakdown pattern.  
**Alternatives**: Store ratings only as aggregates on the Movie document  
**Impact**: Rating collection + recalculate on every rate/unrate  
**Date**: 2026-08-21  

## DEC-007 — ASSUMPTION
**Decision**: No real video upload/storage pipeline  
**Why**: No PRD requirement for media upload. Frontend uses external sample video URLs. Would require S3/GCS integration.  
**Impact**: Movie videoUrl/posterUrl/backdropUrl are stored as plain URL strings  
**Date**: 2026-08-21  

## DEC-008 — ASSUMPTION
**Decision**: Mock billing status (no payment integration)  
**Why**: No payment provider credentials or PRD requirement for payment. Plans and billing status stored as strings.  
**Impact**: Plan changes are admin-only metadata updates  
**Date**: 2026-08-21  
