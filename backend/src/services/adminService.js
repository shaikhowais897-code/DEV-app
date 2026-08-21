import User from '../models/User.js';
import Movie from '../models/Movie.js';
import AuditLog from '../models/AuditLog.js';
import Rating from '../models/Rating.js';
import Watchlist from '../models/Watchlist.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

class AdminService {
  /**
   * List all users with optional filtering.
   */
  async listUsers({ page = 1, limit = 50, role, search }) {
    const filter = {};

    if (role && ['admin', 'user'].includes(role)) {
      filter.role = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Update a user's role, plan, or billing status (admin only).
   */
  async updateUser(userId, updates) {
    const allowed = ['role', 'plan', 'billingStatus', 'monthlyFee', 'nextBillingDate'];
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

    logger.info(`Admin updated user: ${user.email}`, sanitized);
    return user;
  }

  /**
   * Delete a user (admin only).
   */
  async deleteUser(userId, actorId) {
    if (userId === actorId.toString()) {
      throw ApiError.badRequest('Cannot delete your own account');
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Cleanup related data
    await Promise.all([
      Watchlist.deleteMany({ userId }),
      Rating.deleteMany({ userId }),
    ]);

    logger.info(`Admin deleted user: ${user.email}`);
    return user;
  }

  /**
   * Get audit log entries.
   */
  async getAuditLogs({ page = 1, limit = 50, action }) {
    const filter = {};
    if (action) {
      filter.action = action;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Create an audit log entry.
   */
  async createAuditEntry({ actor, action, target, details, status, ip }) {
    return AuditLog.create({ actor, action, target, details, status, ip });
  }

  /**
   * Get dashboard statistics.
   */
  async getStats() {
    const [
      totalUsers,
      totalMovies,
      totalPremiumUsers,
      totalFreeUsers,
      totalRatings,
      featuredCount,
    ] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      User.countDocuments({ plan: { $ne: 'Free' } }),
      User.countDocuments({ plan: 'Free' }),
      Rating.countDocuments(),
      Movie.countDocuments({ isFeatured: true }),
    ]);

    return {
      totalUsers,
      totalMovies,
      totalPremiumUsers,
      totalFreeUsers,
      totalRatings,
      featuredCount,
    };
  }
}

export default new AdminService();
