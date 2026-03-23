import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Flame, Target, Trophy, Activity, Save, Check, X, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const API = 'http://localhost:5000';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, icon }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="h-full cursor-pointer"
  >
    <Card className="p-6 flex items-center gap-5 glass-card group relative overflow-hidden h-full border-t border-white/10 hover:border-white/30">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-white group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <div className="flex-1 relative z-10">
        <p className="text-sm font-semibold text-gray-400 font-heading uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </Card>
  </motion.div>
);

// ─── Profile Editor ───────────────────────────────────────────────────────────
const ProfileEditor = ({ user, onSave }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    weight: user?.weight || '',
    targetWeight: user?.targetWeight || '',
    dailyCalorieTarget: user?.dailyCalorieTarget || 2200,
    workoutDaysPerWeek: user?.workoutDaysPerWeek || 4,
    fitnessGoal: user?.fitnessGoal || 'general fitness',
    experienceLevel: user?.experienceLevel || 'beginner',
    dietPreference: user?.dietPreference || 'non vegetarian',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    if (payload.weight) payload.weight = Number(payload.weight);
    if (payload.targetWeight) payload.targetWeight = Number(payload.targetWeight);
    if (payload.dailyCalorieTarget) payload.dailyCalorieTarget = Number(payload.dailyCalorieTarget);
    if (payload.workoutDaysPerWeek) payload.workoutDaysPerWeek = Number(payload.workoutDaysPerWeek);
    await onSave(payload);
    setSaving(false);
    setOpen(false);
  };

  const inputCls = 'w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neonCyan/50 transition-all text-sm';
  const selectCls = inputCls + ' appearance-none';

  return (
    <Card className="glass-card p-6 mb-8 border-white/5">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-3">
          <Edit3 className="w-5 h-5 text-neonCyan" />
          <span className="text-white font-bold font-syncopate uppercase text-sm tracking-widest">Fitness Profile</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Current Weight (kg)</label>
                <input name="weight" type="number" value={form.weight} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Target Weight (kg)</label>
                <input name="targetWeight" type="number" value={form.targetWeight} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Daily Calorie Target</label>
                <input name="dailyCalorieTarget" type="number" value={form.dailyCalorieTarget} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Workout Days / Week</label>
                <input name="workoutDaysPerWeek" type="number" min="1" max="7" value={form.workoutDaysPerWeek} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Fitness Goal</label>
                <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} className={selectCls}>
                  <option value="fat loss">Fat Loss</option>
                  <option value="muscle gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="general fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Experience Level</label>
                <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className={selectCls}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 py-3 px-8 rounded-xl font-bold font-syncopate uppercase tracking-wider text-sm text-black bg-gradient-to-r from-neonCyan to-neonGreen hover:shadow-glow-green transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// ─── Weekly Tracker ───────────────────────────────────────────────────────────
const WeeklyTracker = ({ tracker, onToggle }) => {
  if (!tracker || !tracker.days) return null;

  const workoutCount = tracker.days.filter(d => d.workoutDone).length;
  const dietCount = tracker.days.filter(d => d.dietFollowed).length;
  const consistency = Math.round(((workoutCount + dietCount) / 14) * 100);

  return (
    <Card className="glass-card p-6 border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-syncopate uppercase tracking-widest">
          <Activity className="w-5 h-5 text-neonCyan" /> Weekly Tracker
        </h3>
        <span className="text-xs font-bold px-3 py-1.5 bg-neonCyan/10 text-neonCyan rounded-lg border border-neonCyan/20">
          {consistency}% Consistent
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead>
            <tr>
              <th className="py-2 text-gray-500 text-xs uppercase tracking-wider font-medium" />
              {tracker.days.map(d => (
                <th key={d.day} className="py-2 text-gray-400 text-xs uppercase tracking-wider font-medium">{d.day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 text-gray-400 text-xs uppercase tracking-wider pr-4 text-left font-medium">Workout</td>
              {tracker.days.map(d => (
                <td key={d.day} className="py-3">
                  <button
                    onClick={() => onToggle(d.day, 'workoutDone', !d.workoutDone)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all border ${
                      d.workoutDone
                        ? 'bg-neonCyan/20 border-neonCyan/40 text-neonCyan shadow-glow-cyan'
                        : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/30'
                    }`}
                  >
                    {d.workoutDone ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-gray-400 text-xs uppercase tracking-wider pr-4 text-left font-medium">Diet</td>
              {tracker.days.map(d => (
                <td key={d.day} className="py-3">
                  <button
                    onClick={() => onToggle(d.day, 'dietFollowed', !d.dietFollowed)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all border ${
                      d.dietFollowed
                        ? 'bg-neonGreen/20 border-neonGreen/40 text-neonGreen'
                        : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/30'
                    }`}
                  >
                    {d.dietFollowed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
  const [loading, setLoading]       = useState(true);

  const token = localStorage.getItem('token');

  const fetchAll = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [trackerRes, streakRes, workoutRes, dietRes] = await Promise.all([
        fetch(`${API}/api/tracker`, { headers }),
        fetch(`${API}/api/tracker/streak`, { headers }),
        fetch(`${API}/api/workouts`, { headers }),
        fetch(`${API}/api/diet/user/${user?._id || localStorage.getItem('userId')}`, { headers }),
      ]);

      if (trackerRes.ok) setTracker(await trackerRes.json());
      if (streakRes.ok) { const s = await streakRes.json(); setStreak(s.streak || 0); }
      if (workoutRes.ok) setWorkouts(await workoutRes.json());
      if (dietRes.ok) setDiets(await dietRes.json());
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
  
  // Calculate current intake from latest diet plan if it's from today
  const isToday = diets[0] && new Date(diets[0].date).toDateString() === new Date().toDateString();
  const currentIntake = isToday ? (diets[0].calories || 0) : 0;

  const workoutConsistency = tracker?.days
    ? Math.round((tracker.days.filter(d => d.workoutDone).length / 7) * 100)
    : 0;

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
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 animate-fade-in relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase font-syncopate pt-4">
            {user?.name ? <>{user.name.split(' ')[0]}'s <span className="text-gray-400">Dashboard</span></> : <>Command <span className="text-gray-400">Center</span></>}
          </h1>
          <p className="text-gray-400 text-lg font-light">
            {user?.fitnessGoal ? <>Goal: <span className="text-neonCyan capitalize">{user.fitnessGoal}</span> — Track your real progress.</> : 'Your autonomous fitness telemetry.'}
          </p>
        </motion.div>

        {/* Profile Editor */}
        <ProfileEditor user={user} onSave={updateProfile} />

        {/* Stat Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}>
          <StatCard title="Weight Evolution" value={`${currentWeight} kg`} sub={targetWeight !== '—' ? `Target: ${targetWeight} kg` : 'Set a target'} icon={<Target className="w-8 h-8 text-neonCyan" />} />
          <StatCard title="Active Streak" value={`${streak} Days`} sub="Workout consistency" icon={<Flame className="w-8 h-8 text-orange-500" />} />
          <StatCard title="Weekly Target" value={`${workoutConsistency}%`} sub="Consistency protocol" icon={<Activity className="w-8 h-8 text-neonGreen" />} />
          <StatCard title="Calorie Intake" value={`${currentIntake} kcal`} sub={`Target: ${calorieTarget} kcal`} icon={<Trophy className="w-8 h-8 text-amber-500" />} />
        </motion.div>

        {/* Weekly Tracker */}
        <div className="mb-8">
          <WeeklyTracker tracker={tracker} onToggle={handleToggle} />
        </div>

        {/* Charts + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Workout Activity Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card p-6 h-[380px] flex flex-col border-white/5 hover:border-white/20 transition-all duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-syncopate uppercase tracking-widest">
                  <Flame className="w-5 h-5 text-gray-300" /> Workout Activity
                </h3>
                <span className="text-xs font-bold px-3 py-1.5 bg-white/10 text-white rounded-lg border border-white/20 uppercase tracking-wider">Recent</span>
              </div>
              <div className="flex-1 w-full relative">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </Card>
          </motion.div>

          {/* Recent Workouts List */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card p-6 h-[380px] flex flex-col border-white/5 hover:border-white/20 transition-all duration-500">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-syncopate uppercase tracking-widest mb-6">
                <Trophy className="w-5 h-5 text-gray-300" /> Saved Workouts
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {workouts.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center mt-8">No saved workouts yet. Generate one from the Workouts page!</p>
                ) : (
                  workouts.slice(0, 8).map((w, i) => (
                    <div key={w._id || i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:border-white/15 transition-all">
                      <div>
                        <p className="text-white text-sm font-semibold">{w.exercises?.length || 0} Exercises</p>
                        <p className="text-gray-500 text-xs">{new Date(w.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} — {w.difficulty || 'beginner'}</p>
                      </div>
                      {w.completed && <Check className="w-4 h-4 text-neonCyan" />}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
