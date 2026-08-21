import { Router } from 'express';
import progressController from '../controllers/progressController.js';
import { authenticate } from '../middlewares/auth.js';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';

const router = Router();

router.use(authenticate);

const updateProgressRules = [
  body('progressPercent')
    .notEmpty()
    .withMessage('Progress percent is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('lastPositionSeconds')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),
];

router.get('/', progressController.getContinueWatching);
router.put('/:movieId', updateProgressRules, validate, progressController.updateProgress);

export default router;
