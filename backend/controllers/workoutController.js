import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { EXERCISE_DATABASE } from '../../frontend/src/data/exerciseData.js';

export const getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId || req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const { exercises, difficulty } = req.body;

    const workout = await Workout.create({
      userId: req.user._id,
      exercises,
      difficulty,
      date: Date.now()
    });

    res.status(201).json(workout);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating workout" });
  }
};

export const generateWorkout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const goal = (req.body.goal || user.fitnessGoal || 'fat loss').toLowerCase();
    const level = (req.body.level || user.experienceLevel || 'beginner').toLowerCase();
    const equipment = (req.body.equipment || 'Any').toLowerCase();
    const workoutDuration = Number(req.body.workoutDuration || 30);

    const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());
    const setsByLevel = { beginner: 3, intermediate: 4, advanced: 5 };
    const categoryOrderByGoal = {
      'fat loss': ['Cardio', 'Full Body', 'Legs', 'Core', 'Arms', 'Back', 'Chest'],
      'muscle gain': ['Chest', 'Back', 'Legs', 'Arms', 'Core', 'Full Body', 'Cardio'],
      endurance: ['Cardio', 'Full Body', 'Core', 'Legs', 'Back', 'Arms', 'Chest'],
    };

    let pool = EXERCISE_DATABASE.filter((ex) => {
      const exLevel = (ex.level || ex.difficulty || '').toLowerCase();
      return exLevel === level;
    });

    if (equipment !== 'any') {
      pool = pool.filter((ex) => (ex.equipment || '').toLowerCase() === equipment);
    }
    if (!pool.length) {
      pool = EXERCISE_DATABASE.filter((ex) => (ex.level || ex.difficulty || '').toLowerCase() === level);
    }

    const targetExerciseCount = Math.max(5, Math.min(12, Math.round(workoutDuration / 5)));
    const orderedCategories = categoryOrderByGoal[goal] || categoryOrderByGoal['fat loss'];
    const selectedIds = new Set();
    const selected = [];

    // Phase 1: Structured Selection (Compound movements first)
    for (let i = 0; i < targetExerciseCount; i += 1) {
      const category = orderedCategories[i % orderedCategories.length];
      const choices = pool.filter((ex) => (ex.category || '').toLowerCase() === category.toLowerCase() && !selectedIds.has(ex.id));
      
      if (choices.length > 0) {
        const picked = choices[Math.floor(Math.random() * choices.length)];
        selectedIds.add(picked.id);
        selected.push(picked);
      }
    }

    // Phase 2: Padding (Ensure we meet the duration requirement)
    const paddingPool = shuffle(pool.filter((ex) => !selectedIds.has(ex.id)));
    while (selected.length < targetExerciseCount && paddingPool.length) {
      selected.push(paddingPool.shift());
    }

    const selectedExercises = selected.map((ex) => ({
      ...ex,
      id: ex.id,
      name: ex.title || ex.name,
      title: ex.title || ex.name,
      sets: setsByLevel[level] || 3,
      reps: ex.reps || '10-12',
      duration: ex.duration || '3–4 min',
      youtubeUrl: ex.videoUrl || `https://www.youtube.com/watch?v=${ex.youtubeId}`,
      youtubeId: ex.youtubeId,
      thumbnail: ex.thumbnail || `https://img.youtube.com/vi/${ex.youtubeId}/maxresdefault.jpg`,
      thumbnailFallback: ex.thumbnailFallback || `https://img.youtube.com/vi/${ex.youtubeId}/hqdefault.jpg`,
      muscleGroup: ex.musclesTargeted || ex.muscle || ex.category,
      musclesTargeted: ex.musclesTargeted || ex.muscle || ex.category,
      difficulty: level,
      level: level,
      completed: false,
    }));

    res.status(200).json({
      plan: {
        goal,
        level,
        workoutDuration,
        equipment,
        exercises: selectedExercises,
      },
    });
  } catch (error) {
    console.error('Workout Generation Error:', error);
    res.status(500).json({ message: 'Server error generating workout' });
  }
};

export const updateWorkoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, caloriesBurned } = req.body;
    
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    workout.completed = completed;
    if (caloriesBurned) {
      workout.caloriesBurned = caloriesBurned;
    }
    
    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
