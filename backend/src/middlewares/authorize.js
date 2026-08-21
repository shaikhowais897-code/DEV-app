import ApiError from '../utils/ApiError.js';

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticate middleware.
 *
 * Usage: authorize('admin') or authorize('admin', 'user')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Role '${req.user.role}' is not authorized for this action`)
      );
    }

    next();
  };
};

export default authorize;
