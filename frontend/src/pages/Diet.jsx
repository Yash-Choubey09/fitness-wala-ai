import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, ChevronDown, RotateCcw, Zap,
  UtensilsCrossed, Pizza, Leaf, Moon, Coffee,
  Salad, Cookie, Target, Dumbbell, Activity,
  ChevronRight, Droplets, Plus, Minus, CheckCircle2,
  Apple, TrendingUp, Shield, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Config ───────────────────────────────────────────────────────────────────

const GOAL_OPTIONS = [
  { value: 'fat loss',    label: 'Fat Loss',    icon: <Flame className="w-5 h-5" />,    color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  glow: 'rgba(251,146,60,0.3)',   range: '1800–2200 kcal' },
  { value: 'muscle gain', label: 'Muscle Gain', icon: <Dumbbell className="w-5 h-5" />, color: 'text-neonCyan',    bg: 'bg-neonCyan/10',    border: 'border-neonCyan/30',    glow: 'rgba(0,224,255,0.3)',    range: '2500–3000 kcal' },
  { value: 'maintenance', label: 'Maintenance', icon: <Activity className="w-5 h-5" />, color: 'text-neonGreen',   bg: 'bg-neonGreen/10',   border: 'border-neonGreen/30',   glow: 'rgba(57,255,20,0.3)',    range: '2200–2500 kcal' },
];

const MEAL_CONFIG = {
  breakfast: { label: 'Breakfast', icon: <Coffee className="w-5 h-5" />,         color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  gradient: 'from-orange-500/30 to-amber-600/10',  barProteins: 'bg-orange-400', barCarbs: 'bg-amber-400',  barFat: 'bg-yellow-500', glowColor: 'rgba(251,146,60,0.25)' },
  lunch:     { label: 'Lunch',     icon: <UtensilsCrossed className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', gradient: 'from-emerald-500/30 to-green-600/10', barProteins: 'bg-emerald-400', barCarbs: 'bg-teal-400',   barFat: 'bg-green-500', glowColor: 'rgba(52,211,153,0.25)' },
  dinner:    { label: 'Dinner',    icon: <Moon className="w-5 h-5" />,            color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/30',  gradient: 'from-purple-500/30 to-indigo-600/10', barProteins: 'bg-purple-400', barCarbs: 'bg-indigo-400', barFat: 'bg-violet-400', glowColor: 'rgba(167,139,250,0.25)' },
  snack1:    { label: 'Snack 1',   icon: <Cookie className="w-5 h-5" />,          color: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/30',     gradient: 'from-sky-500/30 to-blue-600/10',     barProteins: 'bg-sky-400',    barCarbs: 'bg-blue-400',  barFat: 'bg-cyan-400', glowColor: 'rgba(56,189,248,0.25)' },
  snack2:    { label: 'Snack 2',   icon: <Leaf className="w-5 h-5" />,            color: 'text-lime-400',    bg: 'bg-lime-400/10',    border: 'border-lime-400/30',    gradient: 'from-lime-500/30 to-green-700/10',   barProteins: 'bg-lime-400',   barCarbs: 'bg-green-400', barFat: 'bg-emerald-500', glowColor: 'rgba(163,230,53,0.25)' },
};

const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];

// ─── Demo plans by goal ───────────────────────────────────────────────────────

const DEMO_PLANS = {
  'fat loss': {
    goal: 'fat loss',
    breakfast: { name: 'Greek Yogurt Parfait',          calories: 320, protein: 28, carbs: 35, fat: 7,  image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80', items: ['200g non-fat Greek yogurt', '1/2 cup blueberries', '2 tbsp granola', '1 tsp honey', 'Chia seeds'] },
    lunch:     { name: 'Grilled Chicken Salad',          calories: 450, protein: 42, carbs: 28, fat: 14, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', items: ['180g grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', '1 tbsp olive oil', 'Lemon juice', 'Avocado slices'] },
    dinner:    { name: 'Baked Salmon & Veggies',         calories: 520, protein: 46, carbs: 22, fat: 18, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', items: ['200g salmon fillet', 'Roasted broccoli', 'Sweet potato', 'Olive oil', 'Garlic & herbs', 'Lemon zest'] },
    snack1:    { name: 'Apple with Almond Butter',        calories: 190, protein: 5,  carbs: 22, fat: 9,  image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80', items: ['1 medium apple', '1.5 tbsp almond butter'] },
    snack2:    { name: 'Hard-Boiled Eggs & Cucumber',    calories: 160, protein: 14, carbs: 4,  fat: 10, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80', items: ['2 hard-boiled eggs', '1 cup sliced cucumber', 'Pinch of salt & pepper'] },
  },
  'muscle gain': {
    goal: 'muscle gain',
    breakfast: { name: 'Protein Oats & Banana',          calories: 580, protein: 38, carbs: 72, fat: 12, image: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=600&q=80', items: ['1 cup oats', '1 scoop whey protein', '1 banana', '1 tbsp peanut butter', '250ml whole milk', 'Mixed berries'] },
    lunch:     { name: 'Beef Rice Bowl',                  calories: 720, protein: 52, carbs: 75, fat: 20, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', items: ['200g ground beef', '1.5 cups white rice', 'Black beans', 'Corn', 'Cheese', 'Sour cream'] },
    dinner:    { name: 'Steak & Potato Mash',             calories: 780, protein: 60, carbs: 60, fat: 24, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', items: ['250g sirloin steak', 'Large baked potato', '2 tbsp butter', 'Steamed broccoli', 'Side salad'] },
    snack1:    { name: 'Cottage Cheese & Pineapple',     calories: 250, protein: 22, carbs: 28, fat: 5,  image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80', items: ['200g cottage cheese', 'Fresh pineapple chunks', '1 tsp honey'] },
    snack2:    { name: 'Mass Gainer Shake',               calories: 480, protein: 40, carbs: 55, fat: 10, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80', items: ['2 scoops mass gainer', '300ml whole milk', '1 banana', '1 tbsp oats'] },
  },
  'maintenance': {
    goal: 'maintenance',
    breakfast: { name: 'Avocado Toast & Eggs',           calories: 420, protein: 22, carbs: 38, fat: 18, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80', items: ['2 slices whole-grain toast', '1 avocado', '2 poached eggs', 'Cherry tomatoes', 'Everything bagel seasoning'] },
    lunch:     { name: 'Turkey Wrap',                     calories: 510, protein: 36, carbs: 48, fat: 16, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80', items: ['Whole wheat wrap', '150g turkey breast', 'Lettuce & tomato', 'Hummus', 'Cucumber strips'] },
    dinner:    { name: 'Chicken Stir-fry with Noodles',  calories: 580, protein: 40, carbs: 58, fat: 16, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80', items: ['180g chicken breast', 'Egg noodles', 'Bell peppers', 'Snap peas', 'Soy sauce', 'Sesame oil'] },
    snack1:    { name: 'Mixed Nuts & Dried Fruit',        calories: 200, protein: 5,  carbs: 18, fat: 13, image: 'https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?w=600&q=80', items: ['30g mixed nuts', '20g dried cranberries'] },
    snack2:    { name: 'Protein Smoothie',                calories: 280, protein: 24, carbs: 30, fat: 6,  image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80', items: ['1 scoop vanilla protein', '200ml almond milk', '1/2 banana', '1 tbsp flaxseed'] },
  },
};

const NUTRITION_TIPS = [
  { icon: <Shield className="w-5 h-5" />,    color: 'text-neonCyan',    bg: 'bg-neonCyan/10',    border: 'border-neonCyan/20',    tip: 'Eat protein with every meal', detail: 'Target 0.8–1g of protein per lb of bodyweight daily to preserve and build muscle mass.' },
  { icon: <Droplets className="w-5 h-5" />,  color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20',    tip: 'Stay hydrated',               detail: 'Drink at least 2.5–3L of water daily. Dehydration reduces performance by up to 20%.' },
  { icon: <TrendingUp className="w-5 h-5" />,color: 'text-neonGreen',   bg: 'bg-neonGreen/10',   border: 'border-neonGreen/20',   tip: 'Time your carbs right',       detail: 'Consume complex carbs before workouts and fast carbs post-workout for optimal recovery.' },
  { icon: <Apple className="w-5 h-5" />,     color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20',  tip: 'Eat whole foods first',       detail: 'Build 80% of your diet from whole, single-ingredient foods for maximum micronutrient density.' },
];

// ─── Macro Bar ────────────────────────────────────────────────────────────────

const MacroBar = ({ label, value, max, colorClass, unit = 'g' }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
        <span className="text-[10px] text-gray-400 font-bold">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ─── Water Tracker ────────────────────────────────────────────────────────────

const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const goal = 8;
  const pct = Math.min((glasses / goal) * 100, 100);
  return (
    <div
      className="rounded-2xl border border-blue-400/20 p-6"
      style={{ background: 'rgba(59,130,246,0.05)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-400/15 border border-blue-400/30 flex items-center justify-center">
          <Droplets className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-black text-white font-heading uppercase tracking-widest">Water Intake</h3>
      </div>

      {/* Ring + count */}
      <div className="flex items-center gap-6 mb-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - pct / 100) }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-black text-white font-heading">{glasses}</span>
            <span className="text-[9px] text-gray-500 uppercase">/{goal}</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-gray-400 text-xs mb-3">
            <span className="text-blue-400 font-bold">{glasses * 250}ml</span> / {goal * 250}ml
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: goal }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                  i < glasses
                    ? 'bg-blue-400/20 border-blue-400/40 text-blue-400'
                    : 'bg-white/3 border-white/10 text-gray-700'
                }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setGlasses(i + 1)}
                style={{ cursor: 'pointer' }}
              >
                <Droplets className="w-3 h-3" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setGlasses(Math.max(0, glasses - 1))}
          className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-1 text-xs font-bold"
        >
          <Minus className="w-3 h-3" /> Remove
        </button>
        <button
          onClick={() => setGlasses(Math.min(goal, glasses + 1))}
          className="flex-1 py-2 rounded-xl bg-blue-400/10 border border-blue-400/30 text-blue-400 hover:bg-blue-400/20 transition-all flex items-center justify-center gap-1 text-xs font-bold"
        >
          <Plus className="w-3 h-3" /> Add Glass
        </button>
      </div>
      {glasses >= goal && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-neonGreen text-xs font-bold mt-3 flex items-center justify-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Daily goal achieved!
        </motion.p>
      )}
    </div>
  );
};

// ─── Button Spinner ───────────────────────────────────────────────────────────

const ButtonSpinner = () => (
  <motion.span
    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
  />
);

// ─── Meal Card ────────────────────────────────────────────────────────────────

const MealCard = ({ type, data, index }) => {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cfg = MEAL_CONFIG[type];

  if (!data) return null;

  const protein  = data.protein || Math.round((data.calories * 0.30) / 4);
  const carbs    = data.carbs   || Math.round((data.calories * 0.45) / 4);
  const fat      = data.fat     || Math.round((data.calories * 0.25) / 9);
  const maxMacro = Math.max(protein, carbs, fat);
  const imgSrc   = data.image   || `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&q=80`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.10, type: 'spring', stiffness: 280, damping: 26 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${cfg.border} hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_${cfg.glowColor}]`}
      style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(14px)' }}
      onClick={() => setExpanded((p) => !p)}
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10 pointer-events-none" />
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} z-5 pointer-events-none opacity-60`} />

        {!imgError ? (
          <img
            src={imgSrc}
            alt={type}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
            <span className="text-5xl opacity-20">🍽️</span>
          </div>
        )}

        {/* Meal label badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.color} border ${cfg.border} text-[10px] font-bold uppercase tracking-widest`}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>

        {/* Expand chevron */}
        <motion.div
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center"
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-white" />
        </motion.div>

        {/* Meal name */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <p className="text-white font-black text-base leading-tight font-heading">{data.name}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${cfg.bg} rounded-lg border ${cfg.border}`}>
          <Flame className={`w-4 h-4 ${cfg.color}`} />
          <span className={`font-black text-sm ${cfg.color}`}>{data.calories}</span>
          <span className="text-gray-600 text-xs uppercase tracking-widest font-bold">kcal</span>
        </div>

        <div className="space-y-2.5">
          <MacroBar label="Protein" value={protein} max={maxMacro} colorClass={cfg.barProteins} />
          <MacroBar label="Carbs"   value={carbs}   max={maxMacro} colorClass={cfg.barCarbs} />
          <MacroBar label="Fat"     value={fat}      max={maxMacro} colorClass={cfg.barFat} />
        </div>
      </div>

      {/* Expanded ingredients */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/8 space-y-3">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${cfg.color} mb-2`}>Ingredients</p>
              <ul className="space-y-2">
                {data.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 font-light">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cfg.barProteins}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { label: 'Protein', value: `${protein}g` },
                  { label: 'Carbs',   value: `${carbs}g` },
                  { label: 'Fat',     value: `${fat}g` },
                ].map(({ label, value }) => (
                  <div key={label} className={`p-2 rounded-xl text-center border ${cfg.border} ${cfg.bg}`}>
                    <p className={`font-black text-sm font-heading ${cfg.color}`}>{value}</p>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Generating Overlay ───────────────────────────────────────────────────────

const GeneratingOverlay = () => (
  <motion.div
    key="gen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center"
  >
    <div className="text-center px-8">
      <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }}  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-t-2 border-r-2 border-neonGreen opacity-60" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} className="absolute inset-3 rounded-full border-b-2 border-l-2 border-neonCyan opacity-60" />
        <motion.div animate={{ rotate: 360 }}  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="absolute inset-6 rounded-full border-t-2 border-orange-400 opacity-40" />
        <div className="w-10 h-10 rounded-full bg-neonGreen/20 flex items-center justify-center border border-neonGreen/40">
          <Salad className="w-5 h-5 text-neonGreen animate-pulse" />
        </div>
      </div>
      <motion.h3
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-black font-syncopate uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-neonCyan mb-3"
      >
        Generating AI Nutrition Plan
      </motion.h3>
      <p className="text-gray-500 text-sm font-light mb-6">Calculating optimal macronutrient ratios…</p>
      <div className="flex justify-center gap-1.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay }} className="w-2 h-2 rounded-full bg-neonGreen" />
        ))}
      </div>
    </div>
  </motion.div>
);

// ─── Diet Page ────────────────────────────────────────────────────────────────

export const Diet = () => {
  const { user, isAuthenticated } = useAuth();
  const [dietPlan, setDietPlan]         = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [goal, setGoal]                 = useState(user?.fitnessGoal || 'fat loss');
  const [saved, setSaved]               = useState(false);
  const [saving, setSaving]             = useState(false);

  // Always show the local demo plan as fallback
  useEffect(() => {
    const fetchPlan = async () => {
      setFetchLoading(true);
      try {
        const token  = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          const res  = await fetch(`http://localhost:5000/api/diet/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.length > 0) {
            const latest = data[0];
            setDietPlan(latest);
            if (latest.goal) {
              const matched = GOAL_OPTIONS.find((g) => g.value === latest.goal);
              if (matched) setGoal(matched.value);
            }
            setFetchLoading(false);
            return;
          }
        }
      } catch { /* fall through to demo */ }
      // Show demo plan immediately
      setDietPlan(DEMO_PLANS['fat loss']);
      setFetchLoading(false);
    };
    fetchPlan();
  }, []);

  const generateDiet = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('http://localhost:5000/api/diet/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ goal }),
        });
        const data = await res.json();
        if (res.ok) { 
          setDietPlan(data); 
          setLoading(false); 
          setSaved(true); 
          return; 
        }
      }
    } catch (err) { console.error(err); }
    // Simulate AI generation with demo data
    await new Promise((r) => setTimeout(r, 1800));
    setDietPlan({ ...DEMO_PLANS[goal], _generated: true, _isDemo: true });
    setLoading(false);
    setSaved(false);
  };

  const saveCurrentPlan = async () => {
    if (!isAuthenticated) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      // The backend /generate endpoint also performs the save. 
      // We call it with the current goal to persist it.
      const res = await fetch('http://localhost:5000/api/diet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ goal }),
      });
      if (res.ok) {
        const data = await res.json();
        setDietPlan(data);
        setSaved(true);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const totalCalories = dietPlan ? MEAL_SLOTS.reduce((s, slot) => s + (dietPlan[slot]?.calories || 0), 0) : 0;
  const totalProtein  = dietPlan ? MEAL_SLOTS.reduce((s, slot) => s + (dietPlan[slot]?.protein  || Math.round(((dietPlan[slot]?.calories || 0) * 0.30) / 4)), 0) : 0;
  const totalCarbs    = dietPlan ? MEAL_SLOTS.reduce((s, slot) => s + (dietPlan[slot]?.carbs    || Math.round(((dietPlan[slot]?.calories || 0) * 0.45) / 4)), 0) : 0;
  const totalFat      = dietPlan ? MEAL_SLOTS.reduce((s, slot) => s + (dietPlan[slot]?.fat      || Math.round(((dietPlan[slot]?.calories || 0) * 0.25) / 9)), 0) : 0;

  const activeMeals         = MEAL_SLOTS.filter((slot) => dietPlan && dietPlan[slot]);
  const selectedGoalConfig  = GOAL_OPTIONS.find((g) => g.value === goal) || GOAL_OPTIONS[0];

  return (
    <Layout>
      <AnimatePresence>
        {loading && <GeneratingOverlay key="overlay" />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 relative z-10">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[500px] bg-neonGreen/4 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-neonCyan/4 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/8 pb-8 relative z-10 gap-6"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neonGreen/10 border border-neonGreen/30 text-neonGreen mb-4"
            >
              <Pizza className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">AI Nutrition Engine</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tighter uppercase font-syncopate">
              Nutrition{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-neonCyan">
                Intelligence
              </span>
            </h1>
            <p className="text-gray-400 font-light text-lg">
              Macronutrient-optimized fuel for your biological engine.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {isAuthenticated && (dietPlan?._isDemo || !dietPlan?._id) && !saved && (
              <motion.button
                onClick={saveCurrentPlan}
                disabled={saving || loading}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-heading uppercase tracking-widest text-sm font-bold border transition-all disabled:opacity-60 text-neonCyan border-neonCyan/30 bg-neonCyan/8 hover:bg-neonCyan/15 hover:border-neonCyan/50 hover:shadow-[0_0_20px_rgba(0,224,255,0.25)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md"
              >
                {saving ? <ButtonSpinner /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Diet Plan'}
              </motion.button>
            )}

            {saved && (
              <div className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-heading uppercase tracking-widest text-sm font-bold border border-neonGreen/30 bg-neonGreen/10 text-neonGreen">
                <CheckCircle2 className="w-4 h-4" />
                Plan Saved!
              </div>
            )}

            <motion.button
              onClick={generateDiet}
              disabled={loading}
              whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-heading uppercase tracking-widest text-sm font-bold border transition-all disabled:opacity-60 text-white/70 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md"
            >
              {loading ? <ButtonSpinner /> : <RotateCcw className="w-4 h-4" />}
              {loading ? 'Synthesizing…' : 'Regenerate Protocol'}
            </motion.button>
          </div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

          {/* ── Left config panel ── */}
          <div className="lg:col-span-3 space-y-5">
            <div
              className="rounded-2xl border border-white/8 p-6 sticky top-24"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-neonGreen/15 border border-neonGreen/30 flex items-center justify-center">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
                    <Zap className="w-4 h-4 text-neonGreen" />
                  </motion.div>
                </div>
                <h2 className="text-sm font-black text-white font-heading uppercase tracking-widest">Nutrition Protocol</h2>
              </div>

              {/* Goal selector */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Fitness Goal</p>
                <div className="space-y-2">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                        goal === g.value
                          ? `${g.bg} ${g.border} ${g.color} shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                          : 'bg-white/3 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={goal === g.value ? g.color : 'text-gray-600'}>{g.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{g.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${goal === g.value ? g.color : 'text-gray-700'}`}>
                        {g.range}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calorie target */}
              <div className={`p-4 rounded-xl border mb-6 ${selectedGoalConfig.border} ${selectedGoalConfig.bg}`}>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Target Range</p>
                <p className={`text-2xl font-black font-heading ${selectedGoalConfig.color}`}>{selectedGoalConfig.range}</p>
                <p className="text-gray-600 text-[10px] mt-1">Daily calorie target</p>
              </div>

              {/* Generate CTA */}
              <motion.button
                onClick={generateDiet}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-heading font-black uppercase tracking-widest text-black text-sm transition-all disabled:opacity-60 bg-gradient-to-r from-neonGreen to-neonCyan hover:shadow-[0_0_30px_rgba(57,255,20,0.35)] flex items-center justify-center gap-2"
              >
                {loading ? <ButtonSpinner /> : <Zap className="w-4 h-4" />}
                {loading ? 'Synthesizing…' : 'Generate Nutrition Plan'}
              </motion.button>
            </div>

            {/* Water Tracker */}
            <WaterTracker />
          </div>

          {/* ── Right output panel ── */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">

              {fetchLoading && (
                <motion.div key="fetching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-32">
                  <div className="w-10 h-10 border-2 border-white/10 border-t-neonGreen rounded-full animate-spin" />
                </motion.div>
              )}

              {dietPlan && !fetchLoading && (
                <motion.div
                  key={dietPlan._id || `plan-${goal}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  {/* Plan active badge */}
                  <div
                    className="p-5 rounded-2xl border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-neonGreen shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse" />
                        <h2 className="text-neonGreen text-xs font-black uppercase tracking-widest font-heading">AI Nutrition Plan Active</h2>
                      </div>
                      <p className="text-white font-bold text-lg capitalize font-heading">{dietPlan.goal || goal} Protocol</p>
                      <p className="text-gray-500 text-xs mt-0.5">{activeMeals.length} meals · {totalCalories} kcal total</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: 'Protein', value: `${totalProtein}g`, color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20' },
                        { label: 'Carbs',   value: `${totalCarbs}g`,   color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                        { label: 'Fat',     value: `${totalFat}g`,     color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/20' },
                      ].map(({ label, value, color, bg, border }) => (
                        <div key={label} className={`px-3 py-1.5 rounded-lg border ${bg} ${border} text-center`}>
                          <p className={`font-black text-sm font-heading ${color}`}>{value}</p>
                          <p className="text-gray-600 text-[9px] uppercase tracking-widest">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meal cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {MEAL_SLOTS.map((slot, i) =>
                      dietPlan[slot] ? <MealCard key={slot} type={slot} data={dietPlan[slot]} index={i} /> : null
                    )}
                  </div>

                  {/* Daily macro summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl border border-neonGreen/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(16px)' }}
                  >
                    <div className="flex-1 w-full">
                      <h3 className="text-xl font-black text-white font-syncopate uppercase tracking-widest mb-1">Daily Energetic Target</h3>
                      <p className="text-gray-400 font-light mb-6">
                        Precision optimized for:{' '}
                        <span className="text-neonGreen font-bold capitalize">{dietPlan.goal || goal}</span>
                      </p>
                      <div className="space-y-3 max-w-sm">
                        <MacroBar label="Total Protein" value={totalProtein} max={250} colorClass="bg-orange-400" unit="g" />
                        <MacroBar label="Total Carbs"   value={totalCarbs}   max={400} colorClass="bg-emerald-400" unit="g" />
                        <MacroBar label="Total Fat"     value={totalFat}     max={120} colorClass="bg-purple-400" unit="g" />
                      </div>
                    </div>

                    <div className="text-center bg-black/80 backdrop-blur-xl px-12 py-8 rounded-2xl border border-neonGreen/30 shadow-[0_0_50px_rgba(57,255,20,0.12)] shrink-0">
                      <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Daily Total</p>
                      <span className="text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-neonGreen to-neonCyan block">
                        {totalCalories}
                      </span>
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">kcal</span>
                    </div>
                  </motion.div>

                  {/* Nutrition Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-px flex-1 bg-white/6" />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Nutrition Intelligence</p>
                      <div className="h-px flex-1 bg-white/6" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {NUTRITION_TIPS.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + i * 0.08 }}
                          className={`flex gap-4 p-4 rounded-2xl border ${tip.border} ${tip.bg}`}
                        >
                          <div className={`w-10 h-10 rounded-xl ${tip.bg} border ${tip.border} flex items-center justify-center shrink-0 ${tip.color}`}>
                            {tip.icon}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${tip.color} mb-1`}>{tip.tip}</p>
                            <p className="text-gray-500 text-xs font-light leading-relaxed">{tip.detail}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};
