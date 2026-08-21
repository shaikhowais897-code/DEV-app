# Whoosh Streaming — Requirements

## REQ-001
**Description**: Users can register with name, email, password, and optional plan  
**Priority**: High  
**Backend Impact**: Auth API + User model  
**Status**: Complete

## REQ-002
**Description**: Users can log in with email/password and receive JWT tokens  
**Priority**: High  
**Backend Impact**: Auth API, JWT generation  
**Status**: Complete

## REQ-003
**Description**: Users can view and update their profile preferences (quality, audio, subtitles, autoplay)  
**Priority**: High  
**Backend Impact**: Auth GET/PATCH /me endpoints  
**Status**: Complete

## REQ-004
**Description**: Browse movie catalog with search, genre filter, access tier filter (Free/Premium/4K), and sorting  
**Priority**: High  
**Backend Impact**: Movies API with query params  
**Status**: Complete

## REQ-005
**Description**: View movie detail with full metadata, cast, rating breakdown  
**Priority**: High  
**Backend Impact**: GET /movies/:id endpoint  
**Status**: Complete

## REQ-006
**Description**: Featured movies displayed in hero carousel  
**Priority**: Medium  
**Backend Impact**: GET /movies/featured endpoint  
**Status**: Complete

## REQ-007
**Description**: Users can add/remove movies to/from watchlist  
**Priority**: High  
**Backend Impact**: Watchlist CRUD + model  
**Status**: Complete

## REQ-008
**Description**: Users can rate movies (1-5 stars) with community aggregate  
**Priority**: High  
**Backend Impact**: Rating model + aggregate recalculation  
**Status**: Complete

## REQ-009
**Description**: Track and display watch progress (continue watching)  
**Priority**: Medium  
**Backend Impact**: WatchProgress model + API  
**Status**: Complete

## REQ-010
**Description**: Admin can add, edit, delete movies and toggle featured status  
**Priority**: High  
**Backend Impact**: Admin-protected movie CRUD  
**Status**: Complete

## REQ-011
**Description**: Admin can manage users (view, update role/plan, delete)  
**Priority**: Medium  
**Backend Impact**: Admin user management API  
**Status**: Complete

## REQ-012
**Description**: Audit logging for admin operations  
**Priority**: Medium  
**Backend Impact**: AuditLog model + auto-logging in admin controller  
**Status**: Complete

## REQ-013
**Description**: Admin dashboard statistics  
**Priority**: Low  
**Backend Impact**: GET /admin/stats  
**Status**: Complete

## REQ-014 — ASSUMPTION
**Description**: Genre categories served as static data  
**Priority**: Low  
**Backend Impact**: GET /categories returns static array  
**Status**: Complete

## REQ-015 — ASSUMPTION
**Description**: Subscription plans managed as metadata (no payment integration)  
**Priority**: Low  
**Backend Impact**: Plan field on User model, admin can update  
**Status**: Complete
