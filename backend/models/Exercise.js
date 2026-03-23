import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  youtubeUrl: { type: String },
  muscleGroup: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
}, { timestamps: true });

export default mongoose.model('Exercise', exerciseSchema);
