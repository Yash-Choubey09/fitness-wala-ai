import express from 'express';
import { getMyWorkouts, createWorkout, updateWorkoutStatus, generateWorkout } from '../controllers/workoutController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyWorkouts)
  .post(protect, createWorkout);

router.post('/generate', protect, generateWorkout);
router.get('/user/:userId', protect, getMyWorkouts);

router.route('/:id/status')
  .put(protect, updateWorkoutStatus);

export default router;
