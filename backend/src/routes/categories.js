import { Router } from 'express';
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/', categoryController.listCategories);

export default router;
