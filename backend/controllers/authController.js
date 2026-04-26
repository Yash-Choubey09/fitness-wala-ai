import User from '../models/User.js';
import Progress from '../models/Progress.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, age, height, weight, fitnessGoal, experienceLevel } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      height,
      weight,
      fitnessGoal,
      experienceLevel
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        fitnessGoal: user.fitnessGoal,
        experienceLevel: user.experienceLevel,
        weight: user.weight,
        targetWeight: user.targetWeight,
        dailyCalorieTarget: user.dailyCalorieTarget,
        workoutDaysPerWeek: user.workoutDaysPerWeek,
        dietPreference: user.dietPreference,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        fitnessGoal: user.fitnessGoal,
        experienceLevel: user.experienceLevel,
        weight: user.weight,
        targetWeight: user.targetWeight,
        dailyCalorieTarget: user.dailyCalorieTarget,
        workoutDaysPerWeek: user.workoutDaysPerWeek,
        dietPreference: user.dietPreference,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    console.log(`[AUTH] Direct update for user ${userId}:`, updates);

    const oldUser = await User.findById(userId);
    if (!oldUser) return res.status(404).json({ message: 'User not found' });

    // Sanitize updates
    const allowed = ['name', 'weight', 'targetWeight', 'height', 'age', 'dailyCalorieTarget', 'workoutDaysPerWeek', 'fitnessGoal', 'experienceLevel', 'dietPreference'];
    const filteredUpdates = {};
    allowed.forEach(k => { if (updates[k] !== undefined) filteredUpdates[k] = updates[k]; });

    // Perform direct update
    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true, runValidators: true }).select('-password');

    // Handle weight log separately to keep it clean
    if (updates.weight !== undefined && Number(updates.weight) !== oldUser.weight) {
      console.log(`[AUTH] Weight change detected: ${oldUser.weight} -> ${updates.weight}`);
      const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(); endOfDay.setHours(23,59,59,999);
      
      const todayLog = await Progress.findOne({ userId, date: { $gte: startOfDay, $lte: endOfDay } });
      if (todayLog) {
        todayLog.weight = updates.weight;
        await todayLog.save();
      } else {
        const lastLog = await Progress.findOne({ userId }).sort({ date: -1 });
        await Progress.create({
          userId,
          weight: updates.weight,
          workoutStreak: lastLog ? lastLog.workoutStreak : 0,
          date: new Date()
        });
      }
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error('[AUTH] Profile Update Failure:', error);
    return res.status(500).json({ message: error.message });
  }
};
