import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  registerRules,
  loginRules,
  refreshTokenRules,
  updateProfileRules,
} from '../validators/authValidator.js';

const router = Router();

// Public routes
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/refresh', refreshTokenRules, validate, authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, updateProfileRules, validate, authController.updateMe);

export default router;
