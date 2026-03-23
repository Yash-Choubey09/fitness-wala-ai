import User from '../models/User.js';
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
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only update allowed fields
    const allowedFields = [
      'name', 'weight', 'targetWeight', 'height', 'age',
      'dailyCalorieTarget', 'workoutDaysPerWeek',
      'fitnessGoal', 'experienceLevel', 'dietPreference'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    const updated = await user.save();
    const { password, ...userObj } = updated.toObject();
    res.json(userObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
