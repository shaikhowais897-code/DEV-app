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

describe('GET /api/v1/movies', () => {
  it('should list movies (public)', async () => {
    await createTestMovie({ slug: 'movie-a', title: 'Movie A' });
    await createTestMovie({ slug: 'movie-b', title: 'Movie B' });

    const res = await request.get('/api/v1/movies').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.total).toBe(2);
  });

  it('should filter by genre', async () => {
    await createTestMovie({ slug: 'action-1', genre: ['Action'] });
    await createTestMovie({ slug: 'horror-1', genre: ['Horror'] });

    const res = await request.get('/api/v1/movies?genre=Horror').expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe('horror-1');
  });

  it('should filter by accessLevel', async () => {
    await createTestMovie({ slug: 'free-1', accessLevel: 'free' });
    await createTestMovie({ slug: 'prem-1', accessLevel: 'premium' });

    const res = await request.get('/api/v1/movies?accessLevel=premium').expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].accessLevel).toBe('premium');
  });

  it('should search by title', async () => {
    await createTestMovie({ slug: 'cyber-1', title: 'Cyber Warriors' });
    await createTestMovie({ slug: 'love-1', title: 'Love Story' });

    const res = await request.get('/api/v1/movies?search=Cyber').expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Cyber Warriors');
  });

  it('should paginate', async () => {
    for (let i = 0; i < 5; i++) {
      await createTestMovie({ slug: `page-${i}`, title: `Page Movie ${i}` });
    }

    const res = await request.get('/api/v1/movies?page=1&limit=2').expect(200);

    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.total).toBe(5);
    expect(res.body.pagination.pages).toBe(3);
  });
});

describe('GET /api/v1/movies/:id', () => {
  it('should return movie by slug', async () => {
    const movie = await createTestMovie({ slug: 'detail-test' });

    const res = await request.get('/api/v1/movies/detail-test').expect(200);

    expect(res.body.data.id).toBe('detail-test');
    expect(res.body.data.title).toBe(movie.title);
  });

  it('should return 404 for non-existent movie', async () => {
    const res = await request.get('/api/v1/movies/no-such-movie').expect(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});

describe('POST /api/v1/movies (Admin)', () => {
  it('should create a movie as admin', async () => {
    const { token } = await createTestAdmin();

    const res = await request
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Admin Movie',
        synopsis: 'Created by admin',
        year: 2025,
        duration: '1h 30m',
        durationSeconds: 5400,
        genre: ['Drama'],
        director: 'Admin Director',
        accessLevel: 'premium',
      })
      .expect(201);

    expect(res.body.data.title).toBe('New Admin Movie');
    expect(res.body.data.id).toBe('new-admin-movie');
  });

  it('should reject movie creation by regular user', async () => {
    const { token } = await createTestUser();

    const res = await request
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Forbidden Movie',
        synopsis: 'Should fail',
        year: 2025,
        duration: '1h',
        durationSeconds: 3600,
        genre: ['Action'],
        director: 'Nobody',
      })
      .expect(403);

    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('should reject movie creation without auth', async () => {
    await request
      .post('/api/v1/movies')
      .send({ title: 'No Auth', synopsis: 'x', year: 2025, duration: '1h', durationSeconds: 3600, genre: ['Action'], director: 'X' })
      .expect(401);
  });

  it('should reject invalid movie data', async () => {
    const { token } = await createTestAdmin();

    const res = await request
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' }) // missing required fields
      .expect(422);

    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

describe('DELETE /api/v1/movies/:id (Admin)', () => {
  it('should delete a movie as admin', async () => {
    const { token } = await createTestAdmin();
    await createTestMovie({ slug: 'to-delete' });

    await request
      .delete('/api/v1/movies/to-delete')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Verify deleted
    await request.get('/api/v1/movies/to-delete').expect(404);
  });
});

describe('PATCH /api/v1/movies/:id/feature (Admin)', () => {
  it('should toggle featured status', async () => {
    const { token } = await createTestAdmin();
    await createTestMovie({ slug: 'feat-test', isFeatured: false });

    const res = await request
      .patch('/api/v1/movies/feat-test/feature')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.isFeatured).toBe(true);

    // Toggle again
    const res2 = await request
      .patch('/api/v1/movies/feat-test/feature')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res2.body.data.isFeatured).toBe(false);
  });
});

describe('GET /api/v1/movies/featured', () => {
  it('should return only featured movies', async () => {
    await createTestMovie({ slug: 'featured-1', isFeatured: true });
    await createTestMovie({ slug: 'normal-1', isFeatured: false });

    const res = await request.get('/api/v1/movies/featured').expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe('featured-1');
  });
});
