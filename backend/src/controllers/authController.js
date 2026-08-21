import authService from '../services/authService.js';
import ApiResponse from '../utils/ApiResponse.js';

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, plan } = req.body;
      const result = await authService.register({ name, email, password, plan });

      ApiResponse.created(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      ApiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      ApiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user._id);

      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);

      ApiResponse.success(res, { user }, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
