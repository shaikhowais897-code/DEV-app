import { Router } from 'express';
import movieController from '../controllers/movieController.js';

const router = Router();

// Search endpoint: GET /api/v1/search?q=...&genre=...&filter=...
router.get('/', movieController.searchMovies);

export default router;
