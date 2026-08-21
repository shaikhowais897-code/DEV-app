import { Router } from 'express';
import movieController from '../controllers/movieController.js';
import { authenticate } from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';
import validate from '../middlewares/validate.js';
import { createMovieRules, updateMovieRules } from '../validators/movieValidator.js';

const router = Router();

// Public routes
router.get('/', movieController.listMovies);
router.get('/featured', movieController.getFeaturedMovies);
router.get('/:id', movieController.getMovie);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), createMovieRules, validate, movieController.createMovie);
router.patch('/:id', authenticate, authorize('admin'), updateMovieRules, validate, movieController.updateMovie);
router.delete('/:id', authenticate, authorize('admin'), movieController.deleteMovie);
router.patch('/:id/feature', authenticate, authorize('admin'), movieController.toggleFeatured);

export default router;
