import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
  caloriesBurned: { type: Number, default: 0 },
  workoutsCompleted: { type: Number, default: 0 },
  workoutStreak: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
