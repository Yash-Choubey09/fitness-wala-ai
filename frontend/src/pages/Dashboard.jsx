import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Flame, Target, Activity, Save, Check, X, Edit3, ChevronDown, Salad, ArrowRight, Dumbbell, User, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Stat Card (with mini sparkline + trend) ─────────────────────────────────
const MOCK_SPARK = [3,5,4,7,6,8,7];
const StatCard = ({ title, value, sub, icon, color = '#00E0FF', trend, sparkData }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="h-full"
  >
    <Card className="p-5 glass-card group relative h-full transition-all duration-300 overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
            trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-flat'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-black text-white mb-0.5 font-heading" style={{ color: 'white' }}>{value}</h3>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</p>
      {sub && <p className="text-[11px] text-gray-600 leading-snug mb-3">{sub}</p>}

      {/* Mini sparkline */}
      {sparkData && (
        <div className="flex items-end gap-0.5 h-8 mt-auto">
          {(sparkData || MOCK_SPARK).map((v, i, arr) => (
            <div key={i}
              className="flex-1 rounded-sm transition-all duration-300"
              style={{
                height: `${(v / Math.max(...arr)) * 100}%`,
                background: i === arr.length - 1 ? color : `${color}30`,
              }}
            />
          ))}
        </div>
      )}
    </Card>
  </motion.div>
);

// ─── Profile Editor (Modal) ───────────────────────────────────────────────────
const ProfileEditor = ({ user, onSave }) => {
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState(null);
  const [form, setForm] = useState({
    weight: user?.weight || '',
    targetWeight: user?.targetWeight || '',
    height: user?.height || '',
    age: user?.age || '',
    dailyCalorieTarget: user?.dailyCalorieTarget || '',
    workoutDaysPerWeek: user?.workoutDaysPerWeek || '',
    fitnessGoal: user?.fitnessGoal || 'general fitness',
    experienceLevel: user?.experienceLevel || 'beginner',
    dietPreference: user?.dietPreference || 'non vegetarian',
  });

  // Sync form when user data loads
  useEffect(() => {
    if (user) {
      setForm({
        weight: user.weight || '',
        targetWeight: user.targetWeight || '',
        height: user.height || '',
        age: user.age || '',
        dailyCalorieTarget: user.dailyCalorieTarget || 2200,
        workoutDaysPerWeek: user.workoutDaysPerWeek || 4,
        fitnessGoal: user.fitnessGoal || 'general fitness',
        experienceLevel: user.experienceLevel || 'beginner',
        dietPreference: user.dietPreference || 'non vegetarian',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const payload = { ...form };
    
    // Safely parse numbers, fall back to undefined if empty
    const parseNum = (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };
    
    payload.weight = parseNum(payload.weight);
    payload.targetWeight = parseNum(payload.targetWeight);
    payload.height = parseNum(payload.height);
    payload.age = parseNum(payload.age);
    payload.dailyCalorieTarget = parseNum(payload.dailyCalorieTarget);
    payload.workoutDaysPerWeek = parseNum(payload.workoutDaysPerWeek);

    console.log('[Dashboard] Saving payload:', payload);

    const result = await onSave(payload);
    setSaving(false);
    
    if (result?.success) {
      console.log('[Dashboard] Save successful');
      setSaved(true);
      setTimeout(() => { setSaved(false); setOpen(false); }, 1400);
    } else {
      console.error('[Dashboard] Save failed:', result?.error);
      setError(result?.error || 'Failed to update profile');
    }
  };

  const iCls = 'w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E0FF]/50 transition-all text-sm placeholder-gray-600';
  const sCls = iCls + ' appearance-none';

  const FIELDS = [
    { label: 'Current Weight (kg)', name: 'weight',             type: 'number', placeholder: 'e.g. 72' },
    { label: 'Target Weight (kg)',  name: 'targetWeight',       type: 'number', placeholder: 'e.g. 65' },
    { label: 'Height (cm)',         name: 'height',             type: 'number', placeholder: 'e.g. 175' },
    { label: 'Age',                 name: 'age',                type: 'number', placeholder: 'e.g. 25' },
    { label: 'Daily Calorie Target',name: 'dailyCalorieTarget', type: 'number', placeholder: 'e.g. 2200' },
    { label: 'Workout Days / Week', name: 'workoutDaysPerWeek', type: 'number', placeholder: '1–7' },
  ];

  return (
    <>
      {/* Trigger button */}
      <Card className="glass-card p-5 mb-8 border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,224,255,0.08)', border: '1px solid rgba(0,224,255,0.15)' }}>
              <User className="w-5 h-5 text-[#00E0FF]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Fitness Profile</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {user?.weight ? `${user.weight}kg · ${user.fitnessGoal || 'No goal set'}` : 'Set up your profile to personalize your experience'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white border border-white/10 hover:border-[#00E0FF]/40 hover:bg-[#00E0FF]/5 transition-all"
          >
            <Edit3 className="w-4 h-4 text-[#00E0FF]" />
            Update Profile
          </button>
        </div>

        {/* Mini stats preview */}
        {user?.weight && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
            {[
              { label: 'Weight', val: `${user.weight} kg` },
              { label: 'Target', val: user.targetWeight ? `${user.targetWeight} kg` : '—' },
              { label: 'Goal', val: user.fitnessGoal || '—' },
              { label: 'Level', val: user.experienceLevel || '—' },
            ].map((s, i) => (
              <div key={i} className="px-3 py-2 rounded-xl bg-white/3 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.label}</p>
                <p className="text-white text-sm font-bold capitalize mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto pt-[8vh]"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-xl rounded-3xl overflow-hidden"
              style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,224,255,0.1)', border: '1px solid rgba(0,224,255,0.2)' }}>
                    <TrendingUp className="w-4 h-4 text-[#00E0FF]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Update Fitness Profile</p>
                    <p className="text-gray-500 text-xs">Changes update your weight progression chart</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2 mb-2">
                    <X className="w-3.5 h-3.5" /> {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {FIELDS.map(f => (
                    <div key={f.name}>
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">{f.label}</label>
                      <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                        min="1" max={f.name === 'workoutDaysPerWeek' ? "7" : "500"}
                        placeholder={f.placeholder} className={iCls} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">Fitness Goal</label>
                    <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} className={sCls}>
                      <option value="fat loss">Fat Loss</option>
                      <option value="muscle gain">Muscle Gain</option>
                      <option value="strength">Strength Focus</option>
                      <option value="stamina">Stamina / Endurance</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="general fitness">General Fitness</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">Experience Level</label>
                    <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className={sCls}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">Diet Preference</label>
                    <select name="dietPreference" value={form.dietPreference} onChange={handleChange} className={sCls}>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 pt-3 border-t border-white/8">
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    saved
                      ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30'
                      : 'text-black hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,224,255,0.3)]'
                  }`}
                  style={!saved ? { background: 'linear-gradient(135deg, #00E0FF, #39FF14)' } : {}}
                >
                  {saved
                    ? <><Check className="w-4 h-4" /> Profile Updated!</>
                    : saving
                      ? <><Save className="w-4 h-4 animate-spin" /> Saving…</>
                      : <><Save className="w-4 h-4" /> Save &amp; Update Chart</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Weekly Tracker (heatmap style) ──────────────────────────────────────────
const WeeklyTracker = ({ tracker, onToggle }) => {
  if (!tracker || !tracker.days) return null;
  const workoutCount = tracker.days.filter(d => d.workoutDone).length;
  const dietCount    = tracker.days.filter(d => d.dietFollowed).length;
  const consistency  = Math.round(((workoutCount + dietCount) / 14) * 100);

  return (
    <Card className="glass-card p-6 border-white/[0.05]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2.5 font-syncopate uppercase tracking-widest">
          <Activity className="w-5 h-5 text-neonCyan" /> Weekly Tracker
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(0,224,255,0.5)' }} /> Workout
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(57,255,20,0.5)' }} /> Diet
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full badge badge-cyan">
            {consistency}% Consistent
          </span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max">
          {tracker.days.map(d => (
            <div key={d.day} className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">{d.day.slice(0,3)}</span>
              {/* Workout cell */}
              <button
                onClick={() => onToggle(d.day, 'workoutDone', !d.workoutDone)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border"
                style={d.workoutDone
                  ? { background: 'rgba(0,224,255,0.2)', borderColor: 'rgba(0,224,255,0.4)', boxShadow: '0 0 12px rgba(0,224,255,0.15)' }
                  : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                title={`Workout ${d.workoutDone ? 'done' : 'pending'}`}
              >
                {d.workoutDone
                  ? <Check className="w-4 h-4 text-neonCyan" />
                  : <Dumbbell className="w-3.5 h-3.5 text-gray-600" />}
              </button>
              {/* Diet cell */}
              <button
                onClick={() => onToggle(d.day, 'dietFollowed', !d.dietFollowed)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border"
                style={d.dietFollowed
                  ? { background: 'rgba(57,255,20,0.15)', borderColor: 'rgba(57,255,20,0.35)', boxShadow: '0 0 12px rgba(57,255,20,0.10)' }
                  : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                title={`Diet ${d.dietFollowed ? 'followed' : 'pending'}`}
              >
                {d.dietFollowed
                  ? <Check className="w-4 h-4 text-neonGreen" />
                  : <Salad className="w-3.5 h-3.5 text-gray-600" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5 pt-4 border-t border-white/[0.05]">
        <div className="flex justify-between text-[11px] text-gray-500 mb-2">
          <span>Weekly Completion</span>
          <span className="text-white font-bold">{consistency}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00E0FF, #8A2BE2, #39FF14)' }}
            initial={{ width: 0 }}
            animate={{ width: `${consistency}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </Card>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [tracker, setTracker]       = useState(null);
  const [streak, setStreak]         = useState(0);
  const [workouts, setWorkouts]     = useState([]);
  const [diets, setDiets]           = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [loading, setLoading]       = useState(true);

  const token = localStorage.getItem('token');

  const fetchAll = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [trackerRes, streakRes, workoutRes, dietRes, progressRes] = await Promise.all([
        fetch(`${API}/api/tracker`, { headers }),
        fetch(`${API}/api/tracker/streak`, { headers }),
        fetch(`${API}/api/workouts`, { headers }),
        fetch(`${API}/api/diet/user/${user?._id || localStorage.getItem('userId')}`, { headers }),
        fetch(`${API}/api/progress/${user?._id || localStorage.getItem('userId')}`, { headers }),
      ]);

      if (trackerRes.ok) setTracker(await trackerRes.json());
      if (streakRes.ok) { const s = await streakRes.json(); setStreak(s.streak || 0); }
      if (workoutRes.ok) setWorkouts(await workoutRes.json());
      if (dietRes.ok) setDiets(await dietRes.json());
      if (progressRes.ok) setProgressLogs(await progressRes.json());
    } catch (err) { console.error('Dashboard fetch error:', err); }
    finally { setLoading(false); }
  }, [token, user?._id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleToggle = async (day, field, value) => {
    try {
      const res = await fetch(`${API}/api/tracker/${day}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) setTracker(await res.json());
    } catch (err) { console.error(err); }
  };

  // ── Computed stats ──
  const currentWeight = user?.weight || '—';
  const targetWeight = user?.targetWeight || '—';
  const calorieTarget = user?.dailyCalorieTarget || 2200;
  
  // Latest saved diet plan totals (for stat card)
  const latestDiet = diets[0];
  const latestDietCals = latestDiet ? Number(latestDiet.calories) || 0 : 0;
  const isToday = latestDiet && new Date(latestDiet.date).toDateString() === new Date().toDateString();
  const currentIntake = latestDietCals > 0 ? latestDietCals : 0;

  const workoutConsistency = tracker?.days
    ? Math.round((tracker.days.filter(d => d.workoutDone).length / 7) * 100)
    : 0;

  const latestWorkout = workouts[0];
  const totalSavedWorkouts = workouts.length;

  // ── Chart data from saved workouts ──
  const last7Workouts = workouts.slice(0, 7).reverse();
  const chartLabels = last7Workouts.length > 0
    ? last7Workouts.map(w => new Date(w.date).toLocaleDateString([], { month: 'short', day: 'numeric' }))
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartExercises = last7Workouts.length > 0
    ? last7Workouts.map(w => w.exercises?.length || 0)
    : [0, 0, 0, 0, 0, 0, 0];

  const barChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Exercises',
      data: chartExercises,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      hoverBackgroundColor: '#ffffff',
      borderRadius: 8,
      barThickness: 16,
    }]
  };

  // ── Chart data from progress logs ──
  // Display the last 14 entries for weight progression
  const lastProgressLogs = [...progressLogs].slice(-14);
  let weightChartLabels = lastProgressLogs.length > 0
    ? lastProgressLogs.map(p => new Date(p.date).toLocaleDateString([], { month: 'short', day: 'numeric' }))
    : ['Today'];
  let weightChartDataValues = lastProgressLogs.length > 0
    ? lastProgressLogs.map(p => p.weight)
    : [currentWeight !== '—' ? currentWeight : 0];

  if (weightChartDataValues.length === 1 && currentWeight !== '—') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    weightChartLabels.unshift(yesterday.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    weightChartDataValues.unshift(weightChartDataValues[0]);
  }

  const weightChartData = {
    labels: weightChartLabels,
    datasets: [{
      label: 'Weight (kg)',
      data: weightChartDataValues,
      borderColor: '#00E0FF',
      backgroundColor: 'rgba(0, 224, 255, 0.1)',
      borderWidth: 3,
      fill: true,
      pointBackgroundColor: '#00E0FF',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.9)', titleColor:'#fff', bodyColor:'#e2e8f0', borderColor:'rgba(0,240,255,0.3)', borderWidth:1, padding:14, displayColors:false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 12 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 12 } } }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-16 animate-fade-in relative">

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(0,224,255,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* ── Premium header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500 font-bold">Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight leading-tight">
                {user?.name
                  ? <><span className="text-white">{user.name.split(' ')[0]}'s</span>{' '}
                      <span className="text-transparent" style={{ backgroundClip:'text', WebkitBackgroundClip:'text', backgroundImage:'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}>Overview</span>
                    </>
                  : <><span className="text-white">Command</span>{' '}
                      <span className="text-transparent" style={{ backgroundClip:'text', WebkitBackgroundClip:'text', backgroundImage:'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}>Center</span>
                    </>
                }
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {user?.fitnessGoal
                  ? <>Goal: <span className="text-neonCyan capitalize font-semibold">{user.fitnessGoal}</span> · Track your real progress.</>  
                  : 'Set up your profile to personalize this dashboard.'}
              </p>
            </div>
            {/* Date chip */}
            <div className="flex-shrink-0 text-right">
              <p className="text-[11px] text-gray-600 uppercase tracking-widest">Today</p>
              <p className="text-white font-semibold text-sm">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions Dock ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { to: '/workouts', icon: Dumbbell, label: 'Generate',   sub: 'Workout',   color: '#00E0FF' },
            { to: '/diet',     icon: Salad,    label: 'Generate',   sub: 'Diet Plan', color: '#39FF14' },
            { to: '/chat',     icon: TrendingUp, label: 'Ask',      sub: 'AI Coach',  color: '#8A2BE2' },
            { to: '#profile',  icon: User,     label: 'Update',     sub: 'Profile',   color: '#F97316', action: true },
          ].map(({ to, icon: Icon, label, sub, color }) => (
            <Link key={sub} to={to}
              className="flex items-center gap-3.5 px-4 py-4 rounded-2xl transition-all duration-300 group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.background = `${color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest">{label}</p>
                <p className="text-white text-sm font-semibold">{sub}</p>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Profile Editor */}
        <ProfileEditor user={user} onSave={async (payload) => {
          const token = localStorage.getItem('token');
          if (!token) return { success: false, error: 'No session' };
          try {
            const res = await fetch(`${API}/api/auth/profile`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) { await fetchAll(); if (updateProfile) await updateProfile(payload); return { success: true, data }; }
            return { success: false, error: data.message || 'Update failed' };
          } catch (err) { return { success: false, error: 'Network error. Backend down?' }; }
        }} />

        {/* ── Stat Cards ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
        >
          <StatCard
            title="Current Weight" value={`${currentWeight} kg`}
            sub={targetWeight !== '—' ? `Target: ${targetWeight} kg` : 'Set a target'}
            icon={<Target className="w-5 h-5" style={{ color: '#00E0FF' }} />}
            color="#00E0FF" trend="flat"
            sparkData={weightChartDataValues.slice(-7).map(Number)}
          />
          <StatCard
            title="Active Streak" value={`${streak} Days`}
            sub="Workout consistency"
            icon={<Flame className="w-5 h-5" style={{ color: '#F97316' }} />}
            color="#F97316" trend={streak > 3 ? 'up' : 'flat'}
            sparkData={[1,2,3,4,5,6,streak > 0 ? streak : 1]}
          />
          <StatCard
            title="Weekly Goal" value={`${workoutConsistency}%`}
            sub="Completion rate"
            icon={<Activity className="w-5 h-5" style={{ color: '#39FF14' }} />}
            color="#39FF14" trend={workoutConsistency >= 70 ? 'up' : 'down'}
            sparkData={[40,55,50,65,60,70,workoutConsistency]}
          />
          <StatCard
            title="Calorie Intake" value={latestDietCals > 0 ? `${currentIntake}` : '—'}
            sub={latestDietCals > 0 ? `Target: ${calorieTarget} kcal` : `Target: ${calorieTarget} kcal`}
            icon={<Salad className="w-5 h-5" style={{ color: '#39FF14' }} />}
            color="#8A2BE2" trend={latestDietCals > 0 ? 'up' : 'flat'}
            sparkData={[1800,2100,1900,2200,2000,2400,latestDietCals || calorieTarget]}
          />
        </motion.div>

        {/* ── Weekly Tracker ── */}
        <div className="mb-8">
          <WeeklyTracker tracker={tracker} onToggle={handleToggle} />
        </div>

        {/* ── Charts + Snapshots ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* Workout Activity Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card p-6 h-[380px] flex flex-col border-white/[0.05]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2.5 uppercase tracking-widest">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  Workout Activity
                </h3>
                <span className="badge">Recent</span>
              </div>
              <div className="flex-1 w-full relative">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </Card>
          </motion.div>

          {/* Weight Progression */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}>
            <Card className="glass-card p-6 h-[380px] flex flex-col border-white/[0.05]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2.5 uppercase tracking-widest">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,224,255,0.08)' }}>
                    <Target className="w-3.5 h-3.5 text-neonCyan" />
                  </div>
                  Weight Progress
                </h3>
                <span className="badge badge-cyan">Historical</span>
              </div>
              <div className="flex-1 w-full relative">
                {progressLogs.length > 0
                  ? <Line data={weightChartData} options={chartOptions} />
                  : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Target className="w-8 h-8 text-gray-700" />
                      <p className="text-gray-600 text-sm text-center">Update your profile weight<br />to start tracking progress.</p>
                    </div>
                }
              </div>
            </Card>
          </motion.div>

          {/* Workout snapshot */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card p-6 h-[380px] flex flex-col border-white/[0.05]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5 uppercase tracking-widest mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,224,255,0.08)' }}>
                  <Dumbbell className="w-3.5 h-3.5 text-neonCyan" />
                </div>
                Workout Snapshot
              </h3>
              <div className="flex-1 flex flex-col justify-center text-center px-2">
                <p className="text-5xl font-black text-white font-heading mb-1">{totalSavedWorkouts}</p>
                <p className="text-[11px] text-gray-600 uppercase tracking-widest mb-6">Saved workouts</p>
                {latestWorkout ? (
                  <div className="rounded-2xl p-4 text-left mb-4" style={{ background: 'rgba(0,224,255,0.05)', border: '1px solid rgba(0,224,255,0.12)' }}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Latest Session</p>
                    <p className="text-white text-sm font-semibold">
                      {latestWorkout.exercises?.length || 0} exercises ·{' '}
                      <span className="capitalize text-neonCyan/90">{latestWorkout.difficulty || 'beginner'}</span>
                    </p>
                    <p className="text-gray-600 text-xs mt-1">{new Date(latestWorkout.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm mb-6">Save a plan from Workouts to see it here.</p>
                )}
                <Link to="/workouts"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-black transition-all hover:shadow-[0_0_20px_rgba(0,224,255,0.2)]"
                  style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}
                >
                  Open Workouts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Overall Progress */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}>
            <Card className="glass-card p-6 h-[380px] flex flex-col border-white/[0.05]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5 uppercase tracking-widest mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(138,43,226,0.1)' }}>
                  <Activity className="w-3.5 h-3.5 text-neonPurple" />
                </div>
                Overall Progress
              </h3>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-4 flex flex-col justify-center items-center text-center transition-all hover:scale-105 duration-300"
                  style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(249,115,22,0.12)' }}>
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-heading">{progressLogs.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Total Kcal Burned</p>
                </div>
                <div className="rounded-2xl p-4 flex flex-col justify-center items-center text-center transition-all hover:scale-105 duration-300"
                  style={{ background: 'rgba(0,224,255,0.05)', border: '1px solid rgba(0,224,255,0.12)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(0,224,255,0.10)' }}>
                    <Check className="w-5 h-5 text-neonCyan" />
                  </div>
                  <p className="text-3xl font-black text-white font-heading">{progressLogs.reduce((acc, curr) => acc + (curr.workoutsCompleted || 0), 0)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Workouts Logged</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ── Saved Workouts ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="mt-6">
          <Card className="glass-card p-6 border-white/[0.05]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5 uppercase tracking-widest">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,224,255,0.08)' }}>
                  <Dumbbell className="w-3.5 h-3.5 text-neonCyan" />
                </div>
                Saved Workouts
              </h3>
              <Link to="/workouts" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neonCyan hover:text-neonGreen transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {workouts.length === 0 ? (
                <div className="md:col-span-2 xl:col-span-3 text-center py-12 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                  <Dumbbell className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">No saved workouts yet.</p>
                  <Link to="/workouts" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-black transition-all" style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}>
                    <Dumbbell className="w-4 h-4" /> Generate a Workout
                  </Link>
                </div>
              ) : (
                workouts.slice(0, 9).map((w, i) => {
                  const n = w.exercises?.length || 0;
                  const names = (w.exercises || []).slice(0, 3).map(ex => ex.name).filter(Boolean);
                  const preview = names.length ? names.join(' · ') : 'Custom protocol';
                  return (
                    <div key={w._id || i}
                      className="rounded-2xl px-4 py-4 transition-all duration-300 group"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,224,255,0.2)'; e.currentTarget.style.background = 'rgba(0,224,255,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-sm font-semibold">{n} exercises</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(0,224,255,0.1)', color: '#00E0FF', border: '1px solid rgba(0,224,255,0.2)' }}>{w.difficulty || 'beginner'}</span>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2">{preview}</p>
                      <p className="text-gray-700 text-[11px] mt-2">{new Date(w.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{w.completed && <span className="ml-2 text-neonGreen">· Done ✓</span>}</p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </motion.div>

        {/* ── Saved Diet Plans ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-6 mb-12">
          <Card className="glass-card p-6 border-white/[0.05]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5 uppercase tracking-widest">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.08)' }}>
                  <Salad className="w-3.5 h-3.5 text-neonGreen" />
                </div>
                Saved Diet Plans
              </h3>
              <Link to="/diet" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neonGreen hover:text-neonCyan transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {diets.length === 0 ? (
                <div className="md:col-span-2 xl:col-span-3 text-center py-12 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                  <Salad className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">No saved nutrition plans yet.</p>
                  <Link to="/diet" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-black transition-all" style={{ background: 'linear-gradient(135deg, #39FF14, #00E0FF)' }}>
                    <Salad className="w-4 h-4" /> Generate a Plan
                  </Link>
                </div>
              ) : (
                diets.slice(0, 9).map((d, i) => {
                  const cals = Number(d.calories) || 0;
                  const p = Number(d.protein) || 0;
                  const c = Number(d.carbs) || 0;
                  const f = Number(d.fat) || 0;
                  const title = d.planName || `${d.goal || 'nutrition'} protocol`;
                  return (
                    <div key={d._id || i}
                      className="rounded-2xl px-4 py-4 transition-all duration-300"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.2)'; e.currentTarget.style.background = 'rgba(57,255,20,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-sm font-semibold capitalize line-clamp-1">{title}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(57,255,20,0.1)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.2)' }}>{d.goal || '—'}</span>
                      </div>
                      <p className="text-gray-700 text-[11px] mb-3">{new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>{cals} kcal</span>
                        <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>P {p}g</span>
                        <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>C {c}g</span>
                        <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>F {f}g</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};
