import supertest from 'supertest';
import {
  setupTestDB,
  teardownTestDB,
  clearCollections,
  createTestUser,
  createTestAdmin,
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

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request
      .post('/api/v1/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        plan: 'Premium 4K HDR',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('John Doe');
    expect(res.body.data.user.email).toBe('john@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.user.plan).toBe('Premium 4K HDR');
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    // Password must NOT be in response
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('should reject duplicate email', async () => {
    await request
      .post('/api/v1/auth/register')
      .send({ name: 'User1', email: 'dup@test.com', password: 'Password123!' });

    const res = await request
      .post('/api/v1/auth/register')
      .send({ name: 'User2', email: 'dup@test.com', password: 'Password456!' })
      .expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('CONFLICT');
  });

  it('should reject missing required fields', async () => {
    const res = await request
      .post('/api/v1/auth/register')
      .send({ name: 'No Email' })
      .expect(422);

    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should reject short password', async () => {
    const res = await request
      .post('/api/v1/auth/register')
      .send({ name: 'Short', email: 'short@test.com', password: '1234' })
      .expect(422);

    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should login with valid credentials', async () => {
    // Register first
    await request
      .post('/api/v1/auth/register')
      .send({ name: 'Login User', email: 'login@test.com', password: 'ValidPass123!' });

    const res = await request
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'ValidPass123!' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('login@test.com');
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject invalid password', async () => {
    await request
      .post('/api/v1/auth/register')
      .send({ name: 'User', email: 'wrong@test.com', password: 'RealPass123!' });

    const res = await request
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@test.com', password: 'WrongPass!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('should reject non-existent email', async () => {
    const res = await request
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@test.com', password: 'Whatever123!' })
      .expect(401);

    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});

describe('GET /api/v1/auth/me', () => {
  it('should return current user profile', async () => {
    const { token } = await createTestUser();

    const res = await request
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('should reject unauthenticated request', async () => {
    const res = await request.get('/api/v1/auth/me').expect(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('should reject invalid token', async () => {
    const res = await request
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401);

    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});

describe('PATCH /api/v1/auth/me', () => {
  it('should update allowed profile fields', async () => {
    const { token } = await createTestUser();

    const res = await request
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', preferredQuality: '4K', autoplayNext: false })
      .expect(200);

    expect(res.body.data.user.name).toBe('Updated Name');
    expect(res.body.data.user.preferredQuality).toBe('4K');
    expect(res.body.data.user.autoplayNext).toBe(false);
  });

  it('should NOT allow role change via profile update', async () => {
    const { token } = await createTestUser();

    await request
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' })
      .expect(200);

    // Verify role didn't change
    const me = await request
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.data.user.role).toBe('user');
  });
});

describe('POST /api/v1/auth/refresh', () => {
  it('should refresh access token', async () => {
    const { refreshToken } = await createTestUser();

    const res = await request
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    // New refresh token should be different (rotation)
    expect(res.body.data.refreshToken).not.toBe(refreshToken);
  });
});
