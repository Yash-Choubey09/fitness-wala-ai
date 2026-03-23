import express from 'express';
import WeeklyTracker from '../models/WeeklyTracker.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Helper: get Monday of current week
function getMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// GET /api/tracker — get current week tracker (auto-creates if missing)
router.get('/', protect, async (req, res) => {
  try {
    const weekStart = getMonday();
    let tracker = await WeeklyTracker.findOne({ userId: req.user._id, weekStart });

    if (!tracker) {
      tracker = await WeeklyTracker.create({
        userId: req.user._id,
        weekStart,
        days: DAY_NAMES.map(day => ({ day, workoutDone: false, dietFollowed: false })),
      });
    }

    res.json(tracker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tracker/:day — toggle a day's workout/diet status
router.put('/:day', protect, async (req, res) => {
  try {
    const { day } = req.params;
    const { workoutDone, dietFollowed } = req.body;
    const weekStart = getMonday();

    let tracker = await WeeklyTracker.findOne({ userId: req.user._id, weekStart });
    if (!tracker) {
      tracker = await WeeklyTracker.create({
        userId: req.user._id,
        weekStart,
        days: DAY_NAMES.map(d => ({ day: d, workoutDone: false, dietFollowed: false })),
      });
    }

    const dayEntry = tracker.days.find(d => d.day === day);
    if (!dayEntry) return res.status(400).json({ message: 'Invalid day' });

    if (typeof workoutDone === 'boolean') dayEntry.workoutDone = workoutDone;
    if (typeof dietFollowed === 'boolean') dayEntry.dietFollowed = dietFollowed;

    await tracker.save();
    res.json(tracker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tracker/streak — calculate workout streak
router.get('/streak', protect, async (req, res) => {
  try {
    const trackers = await WeeklyTracker.find({ userId: req.user._id }).sort({ weekStart: -1 }).limit(8);
    let streak = 0;
    let broken = false;

    for (const tracker of trackers) {
      const sortedDays = [...tracker.days].sort((a, b) => DAY_NAMES.indexOf(b.day) - DAY_NAMES.indexOf(a.day));
      for (const d of sortedDays) {
        if (d.workoutDone) { streak++; }
        else { broken = true; break; }
      }
      if (broken) break;
    }

    res.json({ streak });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
