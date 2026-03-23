import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';
import User from '../models/User.js';

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

    // Use requested params or fallback to user profile
    const fitnessGoal = req.body.goal || user.fitnessGoal || 'general fitness';
    const experienceLevel = req.body.level || user.experienceLevel || 'beginner';

    // Advanced Realistic Generation Engine
    let warmupExercises = [];
    let mainExercises = [];
    let finisherExercises = [];

    // Core mapping dictionaries
    const cardioDB = [
      { name: 'Jump Rope', sets: '1', reps: '3 mins', muscleGroup: 'full body' },
      { name: 'Jumping Jacks', sets: '2', reps: '30s', muscleGroup: 'cardio' },
      { name: 'High Knees', sets: '2', reps: '30s', muscleGroup: 'cardio' },
      { name: 'Dynamic Stretching', sets: '1', reps: '5 mins', muscleGroup: 'full body' },
      { name: 'Arm Circles', sets: '2', reps: '15 forward, 15 back', muscleGroup: 'shoulders' }
    ];

    const strengthDB = [
      { name: 'Pushups', sets: '3', reps: '10-15', muscleGroup: 'chest' },
      { name: 'Pull-ups', sets: '3', reps: '8-12', muscleGroup: 'back' },
      { name: 'Squats', sets: '4', reps: '15', muscleGroup: 'legs' },
      { name: 'Lunges', sets: '3', reps: '12 per leg', muscleGroup: 'legs' },
      { name: 'Bench Press', sets: '4', reps: '8-10', muscleGroup: 'chest' },
      { name: 'Deadlift', sets: '4', reps: '6-8', muscleGroup: 'back' },
      { name: 'Bicep Curls', sets: '3', reps: '12', muscleGroup: 'arms' },
      { name: 'Tricep Dips', sets: '3', reps: '12', muscleGroup: 'arms' }
    ];

    const coreDB = [
      { name: 'Plank', sets: '3', reps: '45s', muscleGroup: 'core' },
      { name: 'Russian Twists', sets: '3', reps: '20', muscleGroup: 'core' },
      { name: 'Mountain Climbers', sets: '3', reps: '30s', muscleGroup: 'core' },
      { name: 'Leg Raises', sets: '3', reps: '15', muscleGroup: 'core' }
    ];

    const finisherDB = [
      { name: 'Burpees', sets: '3', reps: '45s AMRAP', muscleGroup: 'full body' },
      { name: 'Kettlebell Swings', sets: '3', reps: '20', muscleGroup: 'full body' },
      { name: 'Sprint Intervals', sets: '4', reps: '20s on, 10s off', muscleGroup: 'cardio' },
      { name: 'Box Jumps', sets: '3', reps: '10', muscleGroup: 'legs' }
    ];

    const shuffle = (array) => array.sort(() => 0.5 - Math.random());

    // 1. WARMUP (2 exercises)
    warmupExercises = shuffle([...cardioDB]).slice(0, 2).map(ex => ({ ...ex, phase: 'Warmup', difficulty: experienceLevel, completed: false }));

    // 2. MAIN WORKOUT (3-5 exercises depending on goal/level)
    let mainSelection = [];
    if (fitnessGoal === 'fat loss' || fitnessGoal === 'endurance') {
      mainSelection = shuffle([...strengthDB.slice(0, 4), ...coreDB]).slice(0, 4);
    } else { // Muscle gain / Strength / General
      mainSelection = shuffle([...strengthDB]).slice(0, 5);
    }
    mainExercises = mainSelection.map(ex => ({ ...ex, phase: 'Main Workout', difficulty: experienceLevel, completed: false }));

    // 3. FINISHER (1-2 exercises)
    const finisherCount = experienceLevel === 'advanced' ? 2 : 1;
    finisherExercises = shuffle([...finisherDB]).slice(0, finisherCount).map(ex => ({ ...ex, phase: 'Finisher', difficulty: experienceLevel, completed: false }));

    // Compile Plan
    const selectedExercises = [...warmupExercises, ...mainExercises, ...finisherExercises];

    const workout = await Workout.create({
      userId: req.user._id,
      difficulty: experienceLevel,
      exercises: selectedExercises,
      date: Date.now()
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
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
