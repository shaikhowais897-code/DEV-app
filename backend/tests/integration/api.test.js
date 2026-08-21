import supertest from 'supertest';
import {
  setupTestDB,
  teardownTestDB,
  clearCollections,
  createTestUser,
  createTestAdmin,
  createTestMovie,
  app,
} from '../setup.js';

const request = supertest(app);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearCollections();
});

describe('Watchlist API', () => {
  it('should add movie to watchlist', async () => {
    const { token } = await createTestUser();
    const movie = await createTestMovie({ slug: 'wl-add' });

    const res = await request
      .post(`/api/v1/watchlist/${movie.slug}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(res.body.success).toBe(true);
  });

  it('should list watchlist', async () => {
    const { token, user } = await createTestUser();
    const m1 = await createTestMovie({ slug: 'wl-list-1' });
    const m2 = await createTestMovie({ slug: 'wl-list-2' });

    await request.post(`/api/v1/watchlist/${m1.slug}`).set('Authorization', `Bearer ${token}`);
    await request.post(`/api/v1/watchlist/${m2.slug}`).set('Authorization', `Bearer ${token}`);

    const res = await request
      .get('/api/v1/watchlist')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.length).toBe(2);
  });

  it('should prevent duplicate watchlist entry', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'wl-dup' });

    await request.post('/api/v1/watchlist/wl-dup').set('Authorization', `Bearer ${token}`).expect(201);

    const res = await request
      .post('/api/v1/watchlist/wl-dup')
      .set('Authorization', `Bearer ${token}`)
      .expect(409);

    expect(res.body.code).toBe('CONFLICT');
  });

  it('should remove from watchlist', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'wl-rm' });

    await request.post('/api/v1/watchlist/wl-rm').set('Authorization', `Bearer ${token}`);

    await request
      .delete('/api/v1/watchlist/wl-rm')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const res = await request.get('/api/v1/watchlist').set('Authorization', `Bearer ${token}`);
    expect(res.body.data.length).toBe(0);
  });

  it('should reject unauthenticated watchlist access', async () => {
    await request.get('/api/v1/watchlist').expect(401);
  });
});

describe('Rating API', () => {
  it('should submit a rating', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'rate-1' });

    const res = await request
      .post('/api/v1/movies/rate-1/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 })
      .expect(200);

    expect(res.body.data.ratingCount).toBe(1);
    expect(res.body.data.communityRating).toBe(5);
  });

  it('should update an existing rating', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'rate-update' });

    await request
      .post('/api/v1/movies/rate-update/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 3 });

    const res = await request
      .post('/api/v1/movies/rate-update/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 })
      .expect(200);

    // Should still be 1 rating, not 2
    expect(res.body.data.ratingCount).toBe(1);
    expect(res.body.data.communityRating).toBe(5);
  });

  it('should remove a rating', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'rate-rm' });

    await request
      .post('/api/v1/movies/rate-rm/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4 });

    await request
      .delete('/api/v1/movies/rate-rm/rate')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const res = await request.get('/api/v1/movies/rate-rm/ratings').expect(200);
    expect(res.body.data.ratingCount).toBe(0);
  });

  it('should reject invalid rating value', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'rate-invalid' });

    await request
      .post('/api/v1/movies/rate-invalid/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 6 })
      .expect(422);
  });

  it('should get rating breakdown (public)', async () => {
    await createTestMovie({ slug: 'rate-pub' });

    const res = await request.get('/api/v1/movies/rate-pub/ratings').expect(200);
    expect(res.body.data.ratingsBreakdown).toBeDefined();
  });
});

describe('Admin API', () => {
  it('should return stats for admin', async () => {
    const { token } = await createTestAdmin();
    await createTestUser();
    await createTestMovie();

    const res = await request
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(2);
    expect(res.body.data.totalMovies).toBeGreaterThanOrEqual(1);
  });

  it('should reject stats for regular user', async () => {
    const { token } = await createTestUser();

    await request
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should prevent admin from deleting themselves', async () => {
    const { token, user } = await createTestAdmin();

    const res = await request
      .delete(`/api/v1/admin/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(res.body.code).toBe('BAD_REQUEST');
  });
});

describe('Categories API', () => {
  it('should return categories (public)', async () => {
    const res = await request.get('/api/v1/categories').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].slug).toBeDefined();
  });
});

describe('Search API', () => {
  it('should search movies', async () => {
    await createTestMovie({ slug: 'search-neon', title: 'Neon Dreams' });
    await createTestMovie({ slug: 'search-dark', title: 'Dark Knight' });

    const res = await request.get('/api/v1/search?q=Neon').expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Neon Dreams');
  });
});

describe('Progress API', () => {
  it('should update and retrieve watch progress', async () => {
    const { token } = await createTestUser();
    await createTestMovie({ slug: 'prog-1', durationSeconds: 7200 });

    await request
      .put('/api/v1/progress/prog-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ progressPercent: 45, lastPositionSeconds: 3240 })
      .expect(200);

    const res = await request
      .get('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].continueProgress).toBe(45);
    expect(res.body.data[0].continueTimeFormatted).toBeDefined();
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request.get('/api/v1/nonexistent').expect(404);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await request.get('/api/v1/health').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.timestamp).toBeDefined();
  });
});
