import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

// ─── Image map per meal slot ───────────────────────────────────────────────────
const MEAL_IMAGES = {
  breakfast: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=480&q=80',
  lunch:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&q=80',
  dinner:    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=480&q=80',
  snack1:    'https://images.unsplash.com/photo-1505253468034-514d2507d914?w=480&q=80',
  snack2:    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=480&q=80',
};

// ─── Meal Database ─────────────────────────────────────────────────────────────
// Each meal: { name, items, calories, protein, carbs, fat, tags[] }
// tags: 'veg', 'vegan', 'nonveg'

const MEAL_DB = {
  breakfast: [
    { name: 'Protein Pancakes',      items: ['2 Eggs', 'Banana', '1 scoop Whey', '½ cup Oats'],           calories: 520, protein: 40, carbs: 55, fat: 10, tags: ['nonveg'] },
    { name: 'Greek Yogurt Bowl',     items: ['Greek Yogurt', 'Mixed Berries', 'Granola', 'Honey'],         calories: 380, protein: 24, carbs: 50, fat: 8,  tags: ['veg'] },
    { name: 'Oatmeal with Berries',  items: ['Rolled Oats', 'Almond Milk', 'Blueberries', 'Chia Seeds'],  calories: 340, protein: 12, carbs: 60, fat: 7,  tags: ['vegan', 'veg'] },
    { name: 'Egg & Avocado Toast',   items: ['2 Eggs', 'Whole Wheat Bread', 'Avocado', 'Feta'],           calories: 450, protein: 22, carbs: 38, fat: 22, tags: ['veg'] },
    { name: 'Cottage Cheese Bowl',   items: ['Cottage Cheese', 'Pineapple', 'Walnuts', 'Honey'],          calories: 320, protein: 28, carbs: 30, fat: 9,  tags: ['veg'] },
    { name: 'Smoothie Bowl',         items: ['Frozen Banana', 'Protein Powder', 'Berries', 'Almond Milk'],calories: 380, protein: 30, carbs: 52, fat: 6,  tags: ['vegan', 'veg', 'nonveg'] },
    { name: 'Veggie Omelette',       items: ['3 Eggs', 'Spinach', 'Tomatoes', 'Bell Pepper', 'Cheese'],   calories: 390, protein: 30, carbs: 10, fat: 23, tags: ['veg'] },
    { name: 'High-Protein French Toast', items: ['Whole Wheat Bread', '3 Eggs', 'Protein Powder', 'Cinnamon'], calories: 460, protein: 38, carbs: 44, fat: 12, tags: ['veg'] },
  ],

  lunch: [
    { name: 'Chicken Rice Bowl',     items: ['Grilled Chicken', 'Brown Rice', 'Broccoli', 'Olive Oil'],    calories: 620, protein: 48, carbs: 65, fat: 12, tags: ['nonveg'] },
    { name: 'Salmon & Sweet Potato', items: ['Baked Salmon', 'Sweet Potato', 'Asparagus', 'Lemon'],       calories: 580, protein: 42, carbs: 50, fat: 16, tags: ['nonveg'] },
    { name: 'Quinoa Veg Bowl',       items: ['Quinoa', 'Roasted Veggies', 'Chickpeas', 'Tahini'],         calories: 490, protein: 20, carbs: 68, fat: 14, tags: ['vegan', 'veg'] },
    { name: 'Turkey Sandwich',       items: ['Whole Wheat Wrap', 'Turkey', 'Avocado', 'Lettuce', 'Tomato'], calories: 520, protein: 36, carbs: 48, fat: 14, tags: ['nonveg'] },
    { name: 'Chicken Salad',         items: ['Grilled Chicken', 'Mixed Greens', 'Cherry Tomatoes', 'Olive Oil Dressing'], calories: 420, protein: 40, carbs: 16, fat: 18, tags: ['nonveg'] },
    { name: 'Lentil Soup & Bread',   items: ['Red Lentils', 'Carrots', 'Spinach', 'Whole Wheat Bread'],   calories: 440, protein: 22, carbs: 72, fat: 6,  tags: ['vegan', 'veg'] },
    { name: 'Beef Stir Fry',         items: ['Lean Beef', 'Bell Peppers', 'Broccoli', 'Brown Rice', 'Soy Sauce'], calories: 650, protein: 50, carbs: 58, fat: 16, tags: ['nonveg'] },
    { name: 'Paneer & Rice',         items: ['Paneer', 'Brown Rice', 'Peas', 'Onion', 'Spices'],          calories: 560, protein: 28, carbs: 62, fat: 20, tags: ['veg'] },
  ],

  dinner: [
    { name: 'Baked Salmon & Veg',    items: ['Salmon Fillet', 'Asparagus', 'Cherry Tomatoes', 'Olive Oil'], calories: 520, protein: 44, carbs: 18, fat: 28, tags: ['nonveg'] },
    { name: 'Chicken & Sweet Potato',items: ['Grilled Chicken', 'Sweet Potato Mash', 'Green Beans'],      calories: 550, protein: 46, carbs: 46, fat: 10, tags: ['nonveg'] },
    { name: 'Tofu Stir Fry',         items: ['Firm Tofu', 'Bok Choy', 'Broccoli', 'Sesame Oil', 'Brown Rice'], calories: 460, protein: 24, carbs: 50, fat: 16, tags: ['vegan', 'veg'] },
    { name: 'Beef & Broccoli Bowl',  items: ['Lean Beef', 'Broccoli', 'Garlic', 'Brown Rice', 'Soy Sauce'], calories: 600, protein: 52, carbs: 48, fat: 16, tags: ['nonveg'] },
    { name: 'Quinoa Stuffed Peppers',items: ['Bell Peppers', 'Quinoa', 'Black Beans', 'Corn', 'Cheese'],  calories: 480, protein: 22, carbs: 66, fat: 12, tags: ['veg'] },
    { name: 'Shrimp & Brown Rice',   items: ['Shrimp', 'Brown Rice', 'Garlic', 'Spinach', 'Lemon'],       calories: 490, protein: 40, carbs: 55, fat: 8,  tags: ['nonveg'] },
    { name: 'Lentil & Veggie Curry', items: ['Red Lentils', 'Coconut Milk', 'Spinach', 'Tomatoes', 'Rice'], calories: 510, protein: 20, carbs: 78, fat: 14, tags: ['vegan', 'veg'] },
    { name: 'Turkey Meatballs',      items: ['Ground Turkey', 'Zucchini Noodles', 'Marinara Sauce', 'Parmesan'], calories: 540, protein: 48, carbs: 32, fat: 18, tags: ['nonveg'] },
  ],

  snack: [
    { name: 'Protein Shake',         items: ['Whey Protein', 'Almond Milk', 'Banana', 'Ice'],             calories: 280, protein: 32, carbs: 28, fat: 4,  tags: ['nonveg'] },
    { name: 'Greek Yogurt & Nuts',   items: ['Greek Yogurt', 'Almonds', 'Honey'],                        calories: 240, protein: 18, carbs: 22, fat: 9,  tags: ['veg'] },
    { name: 'Apple & Peanut Butter', items: ['Apple', 'Natural Peanut Butter'],                          calories: 200, protein: 6,  carbs: 28, fat: 10, tags: ['vegan', 'veg', 'nonveg'] },
    { name: 'Hummus & Veggies',      items: ['Hummus', 'Carrots', 'Cucumber', 'Bell Peppers'],            calories: 180, protein: 8,  carbs: 22, fat: 7,  tags: ['vegan', 'veg', 'nonveg'] },
    { name: 'Almonds & Dark Choco',  items: ['Almonds', 'Dark Chocolate (70%)', 'Raisins'],               calories: 220, protein: 6,  carbs: 20, fat: 14, tags: ['vegan', 'veg', 'nonveg'] },
    { name: 'Cottage Cheese Bites',  items: ['Cottage Cheese', 'Cucumber', 'Flaxseed', 'Pepper'],        calories: 160, protein: 18, carbs: 6,  fat: 5,  tags: ['veg'] },
    { name: 'Rice Cakes & Avocado',  items: ['Rice Cakes', 'Avocado', 'Lemon Zest'],                     calories: 200, protein: 4,  carbs: 28, fat: 10, tags: ['vegan', 'veg', 'nonveg'] },
    { name: 'Boiled Eggs',           items: ['2 Hard-Boiled Eggs', 'Salt', 'Pepper', 'Paprika'],         calories: 160, protein: 14, carbs: 2,  fat: 10, tags: ['nonveg'] },
    { name: 'Whey & Oat Bar',        items: ['Oats', 'Whey Protein', 'Honey', 'Peanut Butter'],          calories: 260, protein: 22, carbs: 30, fat: 8,  tags: ['nonveg'] },
    { name: 'Mixed Berries',         items: ['Blueberries', 'Strawberries', 'Raspberries'],               calories: 120, protein: 2,  carbs: 28, fat: 1,  tags: ['vegan', 'veg', 'nonveg'] },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

const pickMeal = (pool, dietPref) => {
  const filtered = pool.filter((m) => {
    if (dietPref === 'vegan') return m.tags.includes('vegan');
    if (dietPref === 'vegetarian') return m.tags.includes('veg');
    return true; // non-veg: all meals
  });
  const source = filtered.length > 0 ? filtered : pool; // fallback if filter too restrictive
  return shuffle(source)[0];
};

const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Controller ────────────────────────────────────────────────────────────────
export const getMyDietPlan = async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.params.userId || req.user._id }).sort({ date: -1 });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Use requested goal or fall back to user profile
    const rawGoal = (req.body.goal || user.fitnessGoal || 'general fitness').toLowerCase();
    const dietPref = (user.dietPreference || 'non vegetarian').toLowerCase();

    // ── Calorie target by goal ──
    let targetCalories;
    let normalizedGoal;

    if (rawGoal === 'fat loss' || rawGoal === 'weight loss') {
      targetCalories = randBetween(1800, 2200);
      normalizedGoal = 'fat loss';
    } else if (rawGoal === 'muscle gain' || rawGoal === 'strength') {
      targetCalories = randBetween(2500, 3000);
      normalizedGoal = 'muscle gain';
    } else {
      // maintenance / general fitness / stamina / endurance
      targetCalories = randBetween(2200, 2500);
      normalizedGoal = 'maintenance';
    }

    // ── Calorie weights per meal slot ──
    // breakfast:15%, lunch:30%, dinner:30%, snack1:12%, snack2:13%
    const weights = { breakfast: 0.15, lunch: 0.30, dinner: 0.30, snack1: 0.12, snack2: 0.13 };

    const targetPerSlot = {
      breakfast: Math.round(targetCalories * weights.breakfast),
      lunch:     Math.round(targetCalories * weights.lunch),
      dinner:    Math.round(targetCalories * weights.dinner),
      snack1:    Math.round(targetCalories * weights.snack1),
      snack2:    Math.round(targetCalories * weights.snack2),
    };

    // ── Pick meals for each slot ──
    // For fat loss → prefer lower-calorie options within the pool
    // For muscle gain → prefer higher-calorie options
    // We achieve this by sorting the pool before picking

    const sortedPool = (pool, preferHigh) => {
      const sorted = [...pool].sort((a, b) => preferHigh ? b.calories - a.calories : a.calories - b.calories);
      return sorted;
    };

    const preferHigh = normalizedGoal === 'muscle gain';

    const breakfast = pickMeal(sortedPool(MEAL_DB.breakfast, preferHigh), dietPref);
    const lunch     = pickMeal(sortedPool(MEAL_DB.lunch, preferHigh),     dietPref);
    const dinner    = pickMeal(sortedPool(MEAL_DB.dinner, preferHigh),    dietPref);
    const snack1    = pickMeal(sortedPool(MEAL_DB.snack, preferHigh),     dietPref);
    // pick a different snack for slot 2
    const snackPool2 = MEAL_DB.snack.filter((s) => s.name !== snack1.name);
    const snack2     = pickMeal(sortedPool(snackPool2, preferHigh), dietPref);

    const attach = (meal, slot) => ({
      ...meal,
      image: MEAL_IMAGES[slot],
    });

    const meals = {
      breakfast: attach(breakfast, 'breakfast'),
      lunch:     attach(lunch,     'lunch'),
      dinner:    attach(dinner,    'dinner'),
      snack1:    attach(snack1,    'snack1'),
      snack2:    attach(snack2,    'snack2'),
    };

    // ── Total macros ──
    const totalCals    = Object.values(meals).reduce((s, m) => s + m.calories, 0);
    const totalProtein = Object.values(meals).reduce((s, m) => s + m.protein,  0);
    const totalCarbs   = Object.values(meals).reduce((s, m) => s + m.carbs,    0);
    const totalFat     = Object.values(meals).reduce((s, m) => s + m.fat,      0);

    const dietPlan = await DietPlan.create({
      userId:    req.user._id,
      goal:      normalizedGoal,
      calories:  totalCals,
      protein:   totalProtein,
      carbs:     totalCarbs,
      fat:       totalFat,
      date:      Date.now(),
      ...meals,
    });

    res.status(201).json(dietPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Diet Generation Failed' });
  }
};
