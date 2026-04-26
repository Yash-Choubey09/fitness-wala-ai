import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseCard } from '../components/workout/ExerciseCard';
import { EXERCISE_DATABASE } from '../data/exerciseData';
import { 
  Dumbbell, Search, Filter, Zap, Target, Trophy, 
  ChevronRight, BookOpen, RotateCcw, CheckCircle2,
  Flame, Activity, Save
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

// ─── Tab Navigation ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'library', label: 'Exercise Library', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'generator', label: 'AI Generator', icon: <Zap className="w-4 h-4" /> },
];

const MUSCLE_FILTERS = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Arms', 'Cardio', 'Full Body'];
const DIFFICULTY_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const GOAL_OPTIONS = [
  { value: 'fat loss',    label: 'Fat Loss',     icon: <Flame className="w-5 h-5" />,    color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30' },
  { value: 'muscle gain', label: 'Muscle Gain',  icon: <Dumbbell className="w-5 h-5" />, color: 'text-neonCyan',    bg: 'bg-neonCyan/10',    border: 'border-neonCyan/30' },
  { value: 'endurance',   label: 'Endurance',    icon: <Activity className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
];

const LEVEL_OPTIONS = [
  { value: 'beginner',     label: 'Beginner',     dots: 1 },
  { value: 'intermediate', label: 'Intermediate', dots: 2 },
  { value: 'advanced',     label: 'Advanced',     dots: 3 },
];

const EQUIPMENT_OPTIONS = ['Any', 'None', 'Dumbbell', 'Barbell', 'Machine'];
const DURATION_OPTIONS = [20, 30, 40, 50, 60];

// ─── Main Planner Page ────────────────────────────────────────────────────────

export const Planner = () => {
  const libraryRef = useRef(null);
  const [activeTab, setActiveTab] = useState('library');
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const { user, isAuthenticated } = useAuth();

  // Generator state
  const [goal, setGoal] = useState(user?.fitnessGoal || 'fat loss');
  const [level, setLevel] = useState(user?.experienceLevel || 'beginner');
  const [equipPref, setEquipPref] = useState('Any');
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const location = useLocation();

  // Validate Data Source & Auto-Generate on Mount / Switch
  useEffect(() => {
    // strict validation requirement
    EXERCISE_DATABASE.forEach(ex => {
      const hasTitle = ex.title;
      const hasLevel = ex.level;
      const hasVideo = ex.videoUrl || ex.youtubeId || ex.gifUrl;
      if (!hasTitle || !ex.category || !hasLevel || !ex.duration || !hasVideo || !ex.thumbnail || !ex.musclesTargeted || !ex.caloriesBurned || !ex.intensity || !ex.equipment) {
        console.error('Data Validation Error: Missing required fields on exercise', ex.id || hasTitle);
      }
    });

    if (EXERCISE_DATABASE.length > 0 && activeTab === 'generator') {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, activeTab]);

  // Filter exercises for library
  const filtered = EXERCISE_DATABASE.filter((ex) => {
    const matchSearch = ex.title.toLowerCase().includes(search.toLowerCase()) ||
                        ex.musclesTargeted.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = muscleFilter === 'All' || ex.category === muscleFilter;
    const matchDiff = difficultyFilter === 'All' || ex.level === difficultyFilter.toLowerCase();
    return matchSearch && matchMuscle && matchDiff;
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);
    setCompleted(false);
    setSaved(false);
    setSaveError('');

    const generateLocalPlan = () => {
      const pickUniqueByCategory = (pool, category, selectedIds) => {
        const choices = pool.filter((ex) => (ex.category || '').toLowerCase() === category.toLowerCase() && !selectedIds.has(ex.id));
        if (choices.length === 0) return null;
        return choices[Math.floor(Math.random() * choices.length)];
      };
      const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

      let pool = EXERCISE_DATABASE.filter((ex) => (ex.level || '').toLowerCase() === level.toLowerCase());
      if (equipPref !== 'Any') {
        pool = pool.filter((ex) => (ex.equipment || '').toLowerCase() === equipPref.toLowerCase());
      }
      if (!pool.length) pool = EXERCISE_DATABASE.filter((ex) => (ex.level || '').toLowerCase() === level.toLowerCase());

      const targetExerciseCount = Math.max(5, Math.min(12, Math.round(workoutDuration / 5)));
      const categoryOrderByGoal = {
        'fat loss': ['Cardio', 'Full Body', 'Legs', 'Core', 'Arms', 'Back', 'Chest'],
        'muscle gain': ['Chest', 'Back', 'Legs', 'Arms', 'Core', 'Full Body', 'Cardio'],
        endurance: ['Cardio', 'Full Body', 'Core', 'Legs', 'Back', 'Arms', 'Chest'],
      };
      const orderedCategories = categoryOrderByGoal[goal] || categoryOrderByGoal['fat loss'];

      const selectedIds = new Set();
      const selected = [];
      
      // Phase 1: Structured (Compound)
      for (let i = 0; i < targetExerciseCount; i += 1) {
        const category = orderedCategories[i % orderedCategories.length];
        const chosen = pickUniqueByCategory(pool, category, selectedIds);
        if (chosen) {
          selectedIds.add(chosen.id);
          selected.push(chosen);
        }
      }

      // Phase 2: Padding
      const remainder = shuffle(pool.filter((ex) => !selectedIds.has(ex.id)));
      while (selected.length < targetExerciseCount && remainder.length) {
        selected.push(remainder.shift());
      }

      return {
        goal,
        level,
        workoutDuration,
        exercises: selected.map(ex => ({
          ...ex,
          title: ex.title || ex.name,
          youtubeUrl: ex.videoUrl || `https://www.youtube.com/watch?v=${ex.youtubeId}`,
          musclesTargeted: ex.musclesTargeted || ex.muscle || ex.category,
          caloriesBurned: ex.caloriesBurned || ex.calories || '~80 kcal'
        })),
        date: new Date(),
      };
    };

    try {
      const token = localStorage.getItem('token');
      if (isAuthenticated && token) {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/workouts/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ goal, level, equipment: equipPref, workoutDuration }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.plan?.exercises?.length) {
            await new Promise((resolve) => setTimeout(resolve, 900));
            setGeneratedPlan({ ...data.plan, date: new Date() });
            setIsGenerating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Backend generator fallback:', err);
    }

    await new Promise((resolve) => setTimeout(resolve, 900));
    setGeneratedPlan(generateLocalPlan());
    setIsGenerating(false);
  };

  // Removed phases logic as AI now returns 7 explicit exercises

  // GSAP Batch Binding for Library
  useEffect(() => {
    if (activeTab === 'library' && libraryRef.current) {
      const ctx = gsap.context(() => {
        ScrollTrigger.batch('.exercise-card', {
          onEnter: (batch) => {
            gsap.fromTo(batch, 
              { opacity: 0, y: 30, force3D: true },
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power2.out', overwrite: true }
            );
          },
          start: 'top 95%',
        });
      }, libraryRef);
      return () => ctx.revert();
    }
  }, [activeTab, filtered]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 relative">
        {/* Background glow */}
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-neonCyan/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-neonPurple/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan mb-5"
          >
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">AI Fitness Engine v2.0</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black font-syncopate uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-white to-neonGreen mb-4">
            Workout Protocol
          </h1>
          <p className="text-gray-400 font-light text-lg max-w-2xl mx-auto">
            Browse the exercise library or generate a fully personalized AI workout plan in seconds.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 relative z-10">
          <div className="flex p-1.5 rounded-2xl gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {TABS.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold uppercase tracking-widest font-heading transition-all ${
                  activeTab === tab.id
                    ? 'bg-neonCyan/15 text-neonCyan border border-neonCyan/30 shadow-[0_0_20px_rgba(0,224,255,0.1)]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ────────────────────── LIBRARY TAB ────────────────────── */}
          {activeTab === 'library' && (
            <motion.div
              ref={libraryRef}
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search exercises…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder:text-gray-600 outline-none focus:border-neonCyan/40 transition-colors text-sm"
                  />
                </div>

                {/* Muscle filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {MUSCLE_FILTERS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMuscleFilter(m)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                        muscleFilter === m
                          ? 'bg-neonCyan/15 border-neonCyan/40 text-neonCyan'
                          : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty filter dots */}
              <div className="flex gap-3 mb-8">
                {DIFFICULTY_FILTERS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                      difficultyFilter === d
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-transparent border-white/8 text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <span className="ml-auto text-gray-600 text-xs self-center">{filtered.length} exercises</span>
              </div>

              {/* Exercise Grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-24 text-gray-600">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-heading uppercase tracking-widest text-sm">No exercises found</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {filtered.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      isExpanded={expandedExercise === exercise.id}
                      onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ────────────────────── GENERATOR TAB ────────────────────── */}
          {activeTab === 'generator' && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* ── Left Panel: Config ── */}
              <div className="lg:col-span-4">
                <div
                  className="rounded-2xl border border-white/8 p-6 sticky top-24"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-neonCyan/15 border border-neonCyan/30 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-4 h-4 text-neonCyan" />
                      </motion.div>
                    </div>
                    <h2 className="text-sm font-black text-white font-heading uppercase tracking-widest">Configure Protocol</h2>
                  </div>

                  {/* Goal selector */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Fitness Goal</p>
                    <div className="grid grid-cols-2 gap-2">
                      {GOAL_OPTIONS.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => setGoal(g.value)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                            goal === g.value
                              ? `${g.bg} ${g.border} ${g.color} shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                              : 'bg-white/3 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <span className={goal === g.value ? g.color : 'text-gray-600'}>{g.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wider">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level selector */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Experience Level</p>
                    <div className="space-y-2">
                      {LEVEL_OPTIONS.map((l) => (
                        <button
                          key={l.value}
                          onClick={() => setLevel(l.value)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            level === l.value
                              ? 'bg-neonCyan/10 border-neonCyan/30 text-neonCyan'
                              : 'bg-white/3 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">{l.label}</span>
                          <span className="flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <span
                                key={i}
                                className={`w-1.5 h-3 rounded-full ${
                                  i < l.dots
                                    ? level === l.value ? 'bg-neonCyan' : 'bg-gray-500'
                                    : 'bg-white/10'
                                }`}
                              />
                            ))}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Equipment selector */}
                  <div className="mb-8">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Equipment Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {EQUIPMENT_OPTIONS.map((eq) => (
                        <button
                          key={eq}
                          onClick={() => setEquipPref(eq)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                            equipPref === eq
                              ? 'bg-neonCyan/15 border-neonCyan/40 text-neonCyan'
                              : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Workout duration selector */}
                  <div className="mb-8">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Workout Duration</p>
                    <div className="grid grid-cols-5 gap-2">
                      {DURATION_OPTIONS.map((minutes) => (
                        <button
                          key={minutes}
                          onClick={() => setWorkoutDuration(minutes)}
                          className={`py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                            workoutDuration === minutes
                              ? 'bg-neonPurple/15 border-neonPurple/40 text-neonPurple'
                              : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {minutes}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate button */}
                  <motion.button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    whileHover={!isGenerating ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isGenerating ? { scale: 0.98 } : {}}
                    className="w-full py-4 rounded-xl font-heading font-black uppercase tracking-widest text-black text-sm transition-all disabled:opacity-60 bg-gradient-to-r from-neonCyan to-neonGreen hover:shadow-[0_0_30px_rgba(0,224,255,0.3)]"
                  >
                    {isGenerating ? 'Synthesizing…' : '⚡ Generate Protocol'}
                  </motion.button>
                </div>
              </div>

              {/* ── Right Panel: Output ── */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {/* Loading state */}
                  {isGenerating && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="flex flex-col items-center justify-center h-[500px] rounded-2xl border border-white/8"
                      style={{ background: 'rgba(0,0,0,0.6)' }}
                    >
                      {/* Spinning rings */}
                      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-neonCyan opacity-60"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-3 rounded-full border-b-2 border-l-2 border-neonPurple opacity-60"
                        />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-6 rounded-full border-t-2 border-neonGreen opacity-40"
                        />
                        <div className="w-12 h-12 rounded-full bg-neonCyan/20 flex items-center justify-center border border-neonCyan/40">
                          <span className="text-neonCyan text-xl animate-pulse">⚡</span>
                        </div>
                      </div>

                      <motion.h3
                        className="text-xl font-black font-syncopate uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple mb-3"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Synthesizing Protocol
                      </motion.h3>
                      <p className="text-gray-600 text-sm font-light mb-6">Analyzing biometric data and optimizing exercise selection…</p>

                      <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay }}
                            className="w-2 h-2 rounded-full bg-neonCyan"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Generated plan */}
                  {!isGenerating && generatedPlan && (
                    <motion.div
                      key="plan"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Plan header */}
                      <div
                        className="p-5 rounded-2xl border border-white/8 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-neonCyan shadow-[0_0_8px_rgba(0,224,255,0.8)] animate-pulse" />
                            <h2 className="text-neonCyan text-xs font-black uppercase tracking-widest font-heading">AI Protocol Active</h2>
                          </div>
                          <p className="text-white font-bold text-lg capitalize font-heading">{generatedPlan.goal} · {generatedPlan.level}</p>
                          <p className="text-gray-500 text-xs mt-0.5">Generated {generatedPlan.date.toLocaleDateString([], { dateStyle: 'medium' })} · {generatedPlan.workoutDuration} min</p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          {!completed ? (
                            <button
                              onClick={() => setCompleted(true)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neonGreen/10 border border-neonGreen/30 text-neonGreen text-sm font-bold hover:bg-neonGreen/20 transition-all uppercase tracking-widest"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Complete
                            </button>
                          ) : (
                            <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neonGreen/15 border border-neonGreen/30 text-neonGreen text-sm font-bold uppercase tracking-widest">
                              <CheckCircle2 className="w-4 h-4" /> Completed!
                            </span>
                          )}
                          {isAuthenticated && !saved && (
                            <button
                              onClick={async () => {
                                setSaving(true);
                                setSaveError('');
                                try {
                                  const token = localStorage.getItem('token');
                                  const exercises = generatedPlan.exercises.map(ex => ({
                                    name: ex.title || ex.name,
                                    sets: 3,
                                    reps: ex.reps || '10-12',
                                    youtubeUrl: ex.youtubeUrl || ex.videoUrl || `https://www.youtube.com/watch?v=${ex.youtubeId}`,
                                    muscleGroup: ex.musclesTargeted || ex.category || '',
                                    difficulty: ex.level || level,
                                  }));
                                  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/workouts`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                    body: JSON.stringify({ exercises, difficulty: level }),
                                  });
                                  if (res.ok) setSaved(true);
                                  else setSaveError('Save failed. Please login again and retry.');
                                } catch (err) { console.error(err); }
                                finally { setSaving(false); }
                              }}
                              disabled={saving}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neonCyan/10 border border-neonCyan/30 text-neonCyan text-sm font-bold hover:bg-neonCyan/20 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Workout'}
                            </button>
                          )}
                          {saved && (
                            <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neonCyan/15 border border-neonCyan/30 text-neonCyan text-sm font-bold uppercase tracking-widest">
                              <CheckCircle2 className="w-4 h-4" /> Saved!
                            </span>
                          )}
                          <button
                            onClick={handleGenerate}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm font-bold hover:border-white/20 transition-all"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                      {saveError && <p className="text-xs text-red-400 mt-2">{saveError}</p>}

                      {/* Stats bar */}
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        {[
                          { label: 'Total Exercises', value: generatedPlan.exercises.length, color: 'text-neonCyan' },
                          { label: 'Est. Duration', value: `${generatedPlan.workoutDuration} min`, color: 'text-amber-400' },
                          { label: 'Est. Calories', value: `~${generatedPlan.exercises.length * 45} kcal`, color: 'text-neonGreen' },
                        ].map(({ label, value, color }) => (
                          <div
                            key={label}
                            className="p-4 rounded-xl border border-white/6 text-center"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                          >
                            <p className={`font-black text-xl font-heading ${color}`}>{value}</p>
                            <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Exercise list grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {generatedPlan?.exercises?.map((ex, i) => (
                          <ExerciseCard
                            key={ex.id || i}
                            exercise={ex}
                            isExpanded={expandedExercise === (ex.id || i)}
                            onClick={() => setExpandedExercise(expandedExercise === (ex.id || i) ? null : (ex.id || i))}
                            index={i}
                            isAiRecommended={true}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Empty state */}
                  {!isGenerating && !generatedPlan && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[500px] rounded-2xl border border-dashed border-white/10"
                      style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 rounded-full bg-neonCyan/8 border border-neonCyan/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,224,255,0.05)]"
                      >
                        <Zap className="w-10 h-10 text-neonCyan opacity-80" />
                      </motion.div>
                      <h3 className="text-xl font-black text-white font-syncopate uppercase tracking-widest mb-2">Ready to Generate</h3>
                      <p className="text-gray-500 text-sm font-light text-center max-w-xs">
                        Select your fitness goal and experience level, then click Generate Protocol.
                      </p>
                      <button
                        onClick={handleGenerate}
                        className="mt-8 flex items-center gap-2 px-8 py-3 rounded-xl font-heading font-black uppercase tracking-widest text-black text-sm bg-gradient-to-r from-neonCyan to-neonGreen hover:shadow-[0_0_20px_rgba(0,224,255,0.3)] transition-all"
                      >
                        <Zap className="w-4 h-4" /> Generate Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
