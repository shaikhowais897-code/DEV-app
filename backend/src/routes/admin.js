import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', adminController.listUsers);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/stats', adminController.getStats);

export default router;
