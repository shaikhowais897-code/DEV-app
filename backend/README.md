# Whoosh Streaming — Backend API

Production-ready REST API for the Whoosh Streaming platform.

## Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4
- **Database**: MongoDB + Mongoose 8
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: winston

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (running locally or Atlas)

### Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

### Default Credentials (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | shaikhowais897@gmail.com | WhooshAdmin2026!# |
| User | elena.r@stream.net | Subscriber2026! |
| User | zoe.tanaka@gmail.com | FreeTier2026! |

## API Endpoints

| Module | Method | Endpoint | Auth |
|--------|--------|----------|------|
| Health | GET | `/api/v1/health` | Public |
| Auth | POST | `/api/v1/auth/register` | Public |
| Auth | POST | `/api/v1/auth/login` | Public |
| Auth | POST | `/api/v1/auth/refresh` | Public |
| Auth | GET | `/api/v1/auth/me` | User |
| Auth | PATCH | `/api/v1/auth/me` | User |
| Movies | GET | `/api/v1/movies` | Public |
| Movies | GET | `/api/v1/movies/featured` | Public |
| Movies | GET | `/api/v1/movies/:id` | Public |
| Movies | POST | `/api/v1/movies` | Admin |
| Movies | PATCH | `/api/v1/movies/:id` | Admin |
| Movies | DELETE | `/api/v1/movies/:id` | Admin |
| Movies | PATCH | `/api/v1/movies/:id/feature` | Admin |
| Ratings | GET | `/api/v1/movies/:id/ratings` | Public |
| Ratings | POST | `/api/v1/movies/:id/rate` | User |
| Ratings | DELETE | `/api/v1/movies/:id/rate` | User |
| Search | GET | `/api/v1/search` | Public |
| Categories | GET | `/api/v1/categories` | Public |
| Watchlist | GET | `/api/v1/watchlist` | User |
| Watchlist | POST | `/api/v1/watchlist/:movieId` | User |
| Watchlist | DELETE | `/api/v1/watchlist/:movieId` | User |
| Progress | GET | `/api/v1/progress` | User |
| Progress | PUT | `/api/v1/progress/:movieId` | User |
| Admin | GET | `/api/v1/admin/users` | Admin |
| Admin | PATCH | `/api/v1/admin/users/:id` | Admin |
| Admin | DELETE | `/api/v1/admin/users/:id` | Admin |
| Admin | GET | `/api/v1/admin/audit-logs` | Admin |
| Admin | GET | `/api/v1/admin/stats` | Admin |

## Project Structure
```
backend/
├── src/
│   ├── config/          # Database, env, logger
│   ├── controllers/     # Request/response handling
│   ├── middlewares/      # Auth, authorize, validate, errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── utils/           # ApiError, ApiResponse, seed
│   ├── validators/      # express-validator rules
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Documentation
See `/docs` for complete project documentation:
- `API_CONTRACT.md` — Full API reference
- `DATABASE.md` — Schema and indexes
- `SECURITY.md` — Security measures
- `DECISIONS.md` — Architecture decisions

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with auto-reload |
| `npm start` | Production start |
| `npm run seed` | Seed database with sample data |
| `npm test` | Run tests |
