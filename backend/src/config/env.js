import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/whoosh_streaming',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  APP_URL: process.env.APP_URL || 'http://localhost:5000',

  isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  isProduction() {
    return this.NODE_ENV === 'production';
  },
};

// Validate required env vars in production
if (env.isProduction()) {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGODB_URI'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Set defaults for development
if (env.isDevelopment()) {
  if (!env.JWT_SECRET) env.JWT_SECRET = 'dev-jwt-secret-do-not-use-in-prod';
  if (!env.JWT_REFRESH_SECRET) env.JWT_REFRESH_SECRET = 'dev-refresh-secret-do-not-use-in-prod';
}

export default env;
