import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name:     { type: String },
  items:    [{ type: String }],
  calories: { type: Number },
  protein:  { type: Number },
  carbs:    { type: Number },
  fat:      { type: Number },
  image:    { type: String },
});

const dietPlanSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: Date, default: Date.now },
  goal:      { type: String },
  calories:  { type: Number },
  protein:   { type: Number },
  carbs:     { type: Number },
  fat:       { type: Number },
  breakfast: mealSchema,
  lunch:     mealSchema,
  dinner:    mealSchema,
  snacks:    mealSchema,   // kept for backward compat
  snack1:    mealSchema,
  snack2:    mealSchema,
}, { timestamps: true });

export default mongoose.model('DietPlan', dietPlanSchema);
