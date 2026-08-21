import { Router } from 'express';
import watchlistController from '../controllers/watchlistController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// All watchlist routes require authentication
router.use(authenticate);

router.get('/', watchlistController.getWatchlist);
router.post('/:movieId', watchlistController.addToWatchlist);
router.delete('/:movieId', watchlistController.removeFromWatchlist);

export default router;
