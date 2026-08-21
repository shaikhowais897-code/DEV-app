import { Router } from 'express';
import ratingController from '../controllers/ratingController.js';
import { authenticate } from '../middlewares/auth.js';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';

const router = Router();

const rateRules = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

// Public: get rating breakdown
router.get('/:id/ratings', ratingController.getRatingBreakdown);

// Protected: submit/remove rating
router.post('/:id/rate', authenticate, rateRules, validate, ratingController.rateMovie);
router.delete('/:id/rate', authenticate, ratingController.removeRating);

export default router;
