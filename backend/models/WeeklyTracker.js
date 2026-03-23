import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], required: true },
  workoutDone: { type: Boolean, default: false },
  dietFollowed: { type: Boolean, default: false },
});

const trackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true }, // Monday of that week
  days: [daySchema],
}, { timestamps: true });

// Compound index: one tracker per user per week
trackerSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

export default mongoose.model('WeeklyTracker', trackerSchema);
