# Whoosh Streaming — Architecture

## System Overview
```
React Frontend (Vite :3000)
        ↓ HTTP/REST
Express API Server (:5000)
        ↓
   Route → Controller → Service → Model
        ↓
   MongoDB (Mongoose)
```

## Data Flow
```
Client Request
     ↓
CORS + Helmet + Rate Limiter
     ↓
Route (method + path + middleware)
     ↓
Validation (express-validator)
     ↓
Auth Middleware (JWT verify → req.user)
     ↓
Authorize Middleware (role check)
     ↓
Controller (parse request → call service → format response)
     ↓
Service (business logic → call model)
     ↓
Model (Mongoose → MongoDB)
     ↓
Response (ApiResponse wrapper)
```

## Layer Responsibilities
- **Routes**: HTTP method, endpoint, middleware chain, controller mapping
- **Controllers**: Request/response handling, HTTP status codes
- **Services**: Business logic, data validation, orchestration
- **Models**: Schema, indexes, constraints, transforms
- **Middleware**: Auth, authorization, validation, error handling, rate limiting

## Key Infrastructure
- **Error handling**: Centralized errorHandler middleware
- **Logging**: Winston (console in dev, file in prod)
- **Security**: Helmet headers, CORS, rate limiting, bcrypt, JWT
- **Validation**: express-validator with custom validate middleware
