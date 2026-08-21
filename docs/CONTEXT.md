# Whoosh Streaming — Project Context

## Project
- **Name**: Whoosh Streaming
- **Purpose**: Cinematic movie streaming platform with discovery, adaptive playback, watchlist, and personalized catalogs
- **Target Users**: Movie/series viewers (free + premium tiers) and platform administrators

## Core Modules
- Authentication (JWT)
- Movie Catalog (CRUD, search, filter, featured)
- Watchlist
- Ratings (user + community aggregate)
- Watch Progress (continue watching)
- Admin Panel (user management, audit logs, stats)
- Categories

## Technology Stack
- **Frontend**: React 19 + Vite + TailwindCSS 4 + Framer Motion + Lucide Icons
- **Backend**: Node.js + Express 4 + ES Modules
- **Database**: MongoDB + Mongoose 8
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: winston

## Architecture
- REST API (versioned: `/api/v1/`)
- Layered: Routes → Controllers → Services → Models
- Separate frontend (Vite dev server :3000) and backend (Express :5000)

## Current Status
- Frontend: Complete (AI Studio generated, client-side only)
- Backend: Complete — all modules implemented
- Database: MongoDB with seeder for mock data migration
- Integration: Backend is API-ready; frontend still uses in-memory data

## Constraints
- No real video upload pipeline (external URLs only)
- No payment integration (mock billing status)
- Gemini API key available but not yet integrated
