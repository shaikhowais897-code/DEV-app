import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './config/logger.js';

// Route imports
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import ratingRoutes from './routes/ratings.js';
import watchlistRoutes from './routes/watchlist.js';
import progressRoutes from './routes/progress.js';
import adminRoutes from './routes/admin.js';
import searchRoutes from './routes/search.js';
import categoryRoutes from './routes/categories.js';

const app = express();

// ─── Security ───────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Rate Limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logging ────────────────────────────────────────
app.use((req, res, next) => {
  if (env.isDevelopment()) {
    logger.debug(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// ─── Health Check ───────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Whoosh Streaming API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/movies', ratingRoutes);    // /api/v1/movies/:id/rate, /api/v1/movies/:id/ratings
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/categories', categoryRoutes);

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
});

// ─── Error Handler (must be last) ───────────────────────────
app.use(errorHandler);

export default app;
