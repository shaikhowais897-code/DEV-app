import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Movie from '../src/models/Movie.js';
import Watchlist from '../src/models/Watchlist.js';
import Rating from '../src/models/Rating.js';
import WatchProgress from '../src/models/WatchProgress.js';
import AuditLog from '../src/models/AuditLog.js';

// Connect to test database
const TEST_DB = process.env.MONGODB_URI
  ? process.env.MONGODB_URI.replace(/\/[^/]+$/, '/whoosh_test')
  : 'mongodb://localhost:27017/whoosh_test';

export async function setupTestDB() {
  await mongoose.connect(TEST_DB);
}

export async function teardownTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

export async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Watchlist.deleteMany({}),
    Rating.deleteMany({}),
    WatchProgress.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);
}

// Create test user and return { user, token }
export async function createTestUser(overrides = {}) {
  const userData = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    passwordHash: 'TestPass123!',
    role: 'user',
    plan: 'Free',
    billingStatus: 'Trial',
    preferredQuality: 'Auto',
    preferredAudio: 'English',
    preferredSubtitle: 'English',
    autoplayNext: true,
    ...overrides,
  };

  const user = await User.create(userData);

  // Login to get token
  const supertest = (await import('supertest')).default;
  const res = await supertest(app)
    .post('/api/v1/auth/login')
    .send({ email: userData.email, password: userData.passwordHash })
    .expect(200);

  return {
    user,
    token: res.body.data.accessToken,
    refreshToken: res.body.data.refreshToken,
  };
}

export async function createTestAdmin() {
  return createTestUser({
    name: 'Test Admin',
    email: `admin-${Date.now()}@example.com`,
    role: 'admin',
    plan: 'Family VIP',
  });
}

export async function createTestMovie(overrides = {}) {
  const slug = `test-movie-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return Movie.create({
    slug,
    title: `Test Movie ${slug}`,
    synopsis: 'A test movie synopsis for integration testing.',
    year: 2024,
    duration: '2h 00m',
    durationSeconds: 7200,
    rating: 4.5,
    genre: ['Action', 'Sci-Fi'],
    director: 'Test Director',
    accessLevel: 'free',
    posterUrl: 'https://example.com/poster.jpg',
    backdropUrl: 'https://example.com/backdrop.jpg',
    ...overrides,
  });
}

export { app };
