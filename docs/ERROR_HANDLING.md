# Whoosh Streaming — Error Handling

## Standard Error Response
```json
{
  "success": false,
  "message": "Human-readable error description",
  "code": "ERROR_CODE",
  "errors": []
}
```

## Error Codes
| Code | HTTP Status | Description |
|------|------------|-------------|
| BAD_REQUEST | 400 | Invalid request |
| UNAUTHORIZED | 401 | Missing/invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate resource |
| VALIDATION_ERROR | 422 | Input validation failed |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "Please provide a valid email", "value": "invalid" }
  ]
}
```

## Implementation
- `ApiError` class with static factory methods for each error type
- Centralized `errorHandler` middleware (registered last)
- Mongoose errors auto-converted (ValidationError, CastError, duplicate key)
- JWT errors auto-converted (invalid token, expired token)
- Stack traces only in development
