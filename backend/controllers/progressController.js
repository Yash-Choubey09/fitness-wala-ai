import Progress from '../models/Progress.js';

export const getProgress = async (req, res) => {
  try {
    const progressLogs = await Progress.find({ userId: req.params.userId || req.user._id }).sort({ date: 1 });
    res.json(progressLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving progress' });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { weight, caloriesBurned, workoutsCompleted } = req.body;
    
    // Check if progress entry exists for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    let progress = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    
    if (progress) {
      if (weight) progress.weight = weight;
      if (caloriesBurned) progress.caloriesBurned += caloriesBurned;
      if (workoutsCompleted) progress.workoutsCompleted += workoutsCompleted;
      
      await progress.save();
    } else {
      // Find latest progress to carry forward streak or weight
      const lastProgress = await Progress.findOne({ userId: req.user._id }).sort({ date: -1 });
      const currentWeight = weight || (lastProgress ? lastProgress.weight : 0);
      let newStreak = lastProgress ? lastProgress.workoutStreak : 0;
      
      if (workoutsCompleted > 0) newStreak += 1;
      
      progress = await Progress.create({
        userId: req.user._id,
        weight: currentWeight,
        caloriesBurned: caloriesBurned || 0,
        workoutsCompleted: workoutsCompleted || 0,
        workoutStreak: newStreak
      });
    }
    
    res.status(201).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving progress' });
  }
};
