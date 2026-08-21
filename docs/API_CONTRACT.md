# Whoosh Streaming — API Contract

Base URL: `/api/v1`

## Authentication

### POST /auth/register
**Auth**: Public  
**Request**: `{ name, email, password, plan? }`  
**Response**: `{ success, message, data: { user, accessToken, refreshToken } }`  
**Status**: 201

### POST /auth/login
**Auth**: Public  
**Request**: `{ email, password }`  
**Response**: `{ success, message, data: { user, accessToken, refreshToken } }`

### POST /auth/refresh
**Auth**: Public  
**Request**: `{ refreshToken }`  
**Response**: `{ success, message, data: { user, accessToken, refreshToken } }`

### GET /auth/me
**Auth**: Bearer token  
**Response**: `{ success, data: { user } }`

### PATCH /auth/me
**Auth**: Bearer token  
**Request**: `{ name?, avatar?, preferredQuality?, preferredAudio?, preferredSubtitle?, autoplayNext? }`  
**Response**: `{ success, data: { user } }`

---

## Movies

### GET /movies
**Auth**: Public  
**Query**: `page, limit, genre, accessLevel, search, sort(rating|year|title|matchScore), featured`  
**Response**: `{ success, data: [Movie], pagination }`

### GET /movies/featured
**Auth**: Public  
**Response**: `{ success, data: [Movie] }`

### GET /movies/:id
**Auth**: Public  
**Response**: `{ success, data: Movie }`  
**Note**: `:id` is the movie slug

### POST /movies
**Auth**: Admin  
**Request**: Movie object  
**Response**: `{ success, data: Movie }` — 201

### PATCH /movies/:id
**Auth**: Admin  
**Request**: Partial Movie object  
**Response**: `{ success, data: Movie }`

### DELETE /movies/:id
**Auth**: Admin  
**Response**: `{ success, message }`

### PATCH /movies/:id/feature
**Auth**: Admin  
**Response**: `{ success, data: Movie }`

---

## Ratings

### GET /movies/:id/ratings
**Auth**: Public  
**Response**: `{ success, data: { communityRating, ratingCount, ratingsBreakdown } }`

### POST /movies/:id/rate
**Auth**: Bearer token  
**Request**: `{ rating: 1-5 }`  
**Response**: `{ success, data: Movie }`

### DELETE /movies/:id/rate
**Auth**: Bearer token  
**Response**: `{ success, data: Movie }`

---

## Search

### GET /search
**Auth**: Public  
**Query**: `q, genre, filter(All|4K|Free|Premium), page, limit`  
**Response**: `{ success, data: [Movie], pagination }`

---

## Categories

### GET /categories
**Auth**: Public  
**Response**: `{ success, data: [Category] }`

---

## Watchlist

### GET /watchlist
**Auth**: Bearer token  
**Response**: `{ success, data: [Movie] }`

### POST /watchlist/:movieId
**Auth**: Bearer token  
**Response**: `{ success, data: Movie }` — 201

### DELETE /watchlist/:movieId
**Auth**: Bearer token  
**Response**: `{ success, message }`

---

## Watch Progress

### GET /progress
**Auth**: Bearer token  
**Response**: `{ success, data: [Movie with continueProgress] }`

### PUT /progress/:movieId
**Auth**: Bearer token  
**Request**: `{ progressPercent, lastPositionSeconds? }`  
**Response**: `{ success, data: WatchProgress }`

---

## Admin

### GET /admin/users
**Auth**: Admin  
**Query**: `page, limit, role, search`  
**Response**: `{ success, data: [User], pagination }`

### PATCH /admin/users/:id
**Auth**: Admin  
**Request**: `{ role?, plan?, billingStatus?, monthlyFee?, nextBillingDate? }`  
**Response**: `{ success, data: User }`

### DELETE /admin/users/:id
**Auth**: Admin  
**Response**: `{ success, message }`

### GET /admin/audit-logs
**Auth**: Admin  
**Query**: `page, limit, action`  
**Response**: `{ success, data: [AuditLog], pagination }`

### GET /admin/stats
**Auth**: Admin  
**Response**: `{ success, data: { totalUsers, totalMovies, totalPremiumUsers, totalFreeUsers, totalRatings, featuredCount } }`

---

## Health

### GET /health
**Auth**: Public  
**Response**: `{ success, message, timestamp, environment }`

---

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": []
}
```
