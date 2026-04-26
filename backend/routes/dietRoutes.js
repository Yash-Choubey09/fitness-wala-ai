import express from 'express';
import { generateDietPlan, getMyDietPlan, saveDietPlan } from '../controllers/dietController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, saveDietPlan);

router.post('/generate', protect, generateDietPlan);
router.get('/user/:userId', protect, getMyDietPlan);

export default router;
