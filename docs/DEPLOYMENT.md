# Whoosh Streaming — Deployment

## Environment Variables
See `backend/.env.example` for all variables.

**Required in production**:
- `JWT_SECRET` — Strong random secret for JWT signing
- `JWT_REFRESH_SECRET` — Separate strong secret for refresh tokens
- `MONGODB_URI` — Production MongoDB connection string
- `CORS_ORIGIN` — Production frontend URL
- `NODE_ENV=production`

## Development
```bash
# Frontend (port 3000)
cd /project-root
npm install
npm run dev

# Backend (port 5000)
cd backend
npm install
cp .env.example .env  # then edit with real values
npm run seed          # populate database with sample data
npm run dev           # start with auto-reload
```

## Production
```bash
cd backend
npm install --production
NODE_ENV=production node src/server.js
```

## Database
- MongoDB 6+ required
- Connection pooling: maxPoolSize=10 (default)
- Indexes created automatically by Mongoose on startup

## Health Check
```
GET /api/v1/health
```

## Logging
- Development: Console output (colorized)
- Production: Console + file logs (logs/error.log, logs/combined.log)
- Log rotation: 5MB max per file, 5 files max

## Security Checklist
- [ ] Set strong JWT_SECRET (min 32 chars random)
- [ ] Set strong JWT_REFRESH_SECRET
- [ ] Set CORS_ORIGIN to production frontend URL only
- [ ] Set NODE_ENV=production
- [ ] Never commit .env files
- [ ] Use HTTPS in production (via reverse proxy)
- [ ] Configure MongoDB authentication
