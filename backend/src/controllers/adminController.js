import adminService from '../services/adminService.js';
import ApiResponse from '../utils/ApiResponse.js';

class AdminController {
  async listUsers(req, res, next) {
    try {
      const { page, limit, role, search } = req.query;
      const result = await adminService.listUsers({
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 50, 100),
        role,
        search,
      });

      ApiResponse.paginated(res, result.users, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await adminService.updateUser(req.params.id, req.body);

      // Audit log
      await adminService.createAuditEntry({
        actor: req.user.email,
        action: 'UPDATE_USER',
        target: user.email,
        details: JSON.stringify(req.body),
        status: 'Success',
        ip: req.ip,
      });

      ApiResponse.success(res, user, 'User updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await adminService.deleteUser(req.params.id, req.user._id);

      await adminService.createAuditEntry({
        actor: req.user.email,
        action: 'DELETE_USER',
        target: user.email,
        status: 'Success',
        ip: req.ip,
      });

      ApiResponse.success(res, null, 'User deleted');
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const { page, limit, action } = req.query;
      const result = await adminService.getAuditLogs({
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 50, 100),
        action,
      });

      ApiResponse.paginated(res, result.logs, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await adminService.getStats();
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
