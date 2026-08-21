import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import logger from '../config/logger.js';

class AuthService {
  /**
   * Register a new user.
   */
  async register({ name, email, password, plan }) {
    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      plan: plan || 'Free',
      billingStatus: plan === 'Free' ? 'Trial' : 'Active',
      monthlyFee:
        plan === 'Family VIP' ? '$19.99' : plan === 'Premium 4K HDR' ? '$14.99' : '$0.00',
      joinedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }),
    });

    const tokens = this._generateTokens(user);

    // Store refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    logger.info(`User registered: ${user.email}`);

    return { user, ...tokens };
  }

  /**
   * Login with email and password.
   */
  async login({ email, password }) {
    // Find user with password field included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = this._generateTokens(user);

    // Store refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    return { user, ...tokens };
  }

  /**
   * Refresh access token using refresh token.
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokens = this._generateTokens(user);

    // Rotate refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, ...tokens };
  }

  /**
   * Get current user profile.
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Update current user profile/preferences.
   */
  async updateProfile(userId, updates) {
    // Whitelist allowed update fields
    const allowed = [
      'name',
      'avatar',
      'preferredQuality',
      'preferredAudio',
      'preferredSubtitle',
      'autoplayNext',
    ];

    const sanitized = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, sanitized, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  /**
   * Generate access and refresh tokens.
   */
  _generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, jti: crypto.randomUUID() },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
