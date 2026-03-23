import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/update', protect, updateProgress);
router.get('/:userId', protect, getProgress);

export default router;
