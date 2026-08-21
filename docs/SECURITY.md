# Whoosh Streaming — Security

## Authentication
- JWT access + refresh tokens
- Access token in Authorization: Bearer header
- Refresh token rotation (old refresh token invalidated on refresh)
- bcrypt password hashing (12 salt rounds)

## Authorization
- Role-based: `admin` and `user`
- `authenticate` middleware verifies JWT and attaches `req.user`
- `authorize('admin')` middleware checks role
- userId for watchlist/ratings/progress derived from JWT, never from client input

## Password Security
- Minimum 8 characters (enforced by validation)
- Hashed with bcrypt before storage
- `passwordHash` field has `select: false` — never returned in queries
- Never logged

## Token Security
- JWT_SECRET and JWT_REFRESH_SECRET are environment variables
- Required in production (server won't start without them)
- refreshToken field has `select: false` on User model

## Input Validation
- All endpoints validated with express-validator
- Centralized validate middleware converts errors to consistent format
- Body size limited to 10MB

## Security Headers
- Helmet.js for standard security headers (CSP, HSTS, X-Frame-Options, etc.)

## CORS
- Configured to allow only the frontend origin (CORS_ORIGIN env var)
- Credentials enabled

## Rate Limiting
- Default: 100 requests per 15 minutes per IP on all /api/ routes
- 429 response with consistent error format

## Error Information
- Stack traces only shown in development
- Production errors return generic messages without implementation details
- MongoDB validation errors normalized to consistent format

## Sensitive Data Handling
- No secrets in codebase (all via environment variables)
- `.env` files excluded from git
- `toJSON` transforms strip passwordHash, refreshToken, __v from responses
- Audit logs never contain passwords or tokens

## Object-Level Authorization
- Watchlist/rating/progress operations scoped to authenticated user's ID
- Admin cannot delete their own account
- Profile updates whitelisted to prevent role/plan self-modification
