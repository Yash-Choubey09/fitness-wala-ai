import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  targetWeight: { type: Number },
  dailyCalorieTarget: { type: Number, default: 2200 },
  workoutDaysPerWeek: { type: Number, default: 4, min: 1, max: 7 },
  fitnessGoal: { 
    type: String, 
    enum: ['fat loss', 'muscle gain', 'strength', 'stamina', 'general fitness', 'maintenance'],
    default: 'general fitness'
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  dietPreference: {
    type: String,
    enum: ['vegetarian', 'non vegetarian', 'vegan'],
    default: 'non vegetarian'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
