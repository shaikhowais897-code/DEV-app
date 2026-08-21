# Whoosh Streaming — Testing Strategy

## Priority
1. Authentication flow (register → login → access protected route)
2. Authorization (admin-only endpoints reject regular users)
3. Movie CRUD with validation
4. Rating aggregate accuracy
5. Watchlist duplicate prevention
6. Input validation error responses

## Test Types

### Unit Tests
- `authService` — register, login, token refresh
- `movieService` — create, search, filter
- `ratingService` — rate, unrate, aggregate recalculation
- `watchlistService` — add, remove, duplicate handling

### Integration Tests
- Auth flow end-to-end
- Movie CRUD with auth
- Watchlist operations
- Error response format consistency

## Running Tests
```bash
cd backend
npm test
```

## Test Environment
- Use a separate test database (append `_test` to MONGODB_URI)
- Clear collections before each test suite
- Use supertest for HTTP endpoint testing
