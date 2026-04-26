import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, ArrowRight, Zap, Activity, Apple, Check, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// ── Left brand panel ───────────────────────────────────────────────────────────
const BrandPanel = ({ isLogin }) => {
  const BULLETS = [
    { icon: Zap,      color: '#00E0FF', label: 'AI-Generated Workouts',   sub: 'Personalized protocols in seconds' },
    { icon: Apple,    color: '#39FF14', label: 'Smart Nutrition Plans',    sub: 'Macro-precise meal guides' },
    { icon: Activity, color: '#8A2BE2', label: 'Real-Time Progress',       sub: 'Charts, streaks & weekly logs' },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 xl:p-14 relative overflow-hidden bg-black"
      style={{ background: 'linear-gradient(145deg, #060608 0%, #0c0c12 60%, #0a0612 100%)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #00E0FF 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,224,255,0.2), rgba(138,43,226,0.2))', border: '1px solid rgba(0,224,255,0.3)' }}>
          <Zap className="w-4.5 h-4.5 text-[#00E0FF]" />
        </div>
        <span className="text-white font-black font-heading text-xl">
          FitWala <span className="text-[#00E0FF]">AI</span>
        </span>
      </div>

      {/* Main copy */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#00E0FF]/70 mb-4">
            {isLogin ? 'Welcome back, athlete' : 'Begin your journey'}
          </p>
          <h2 className="text-4xl xl:text-5xl font-black font-heading tracking-tight leading-[1.05] text-white mb-6">
            {isLogin ? (
              <>Your training<br />
                <span className="text-transparent" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}>
                  awaits you.
                </span>
              </>
            ) : (
              <>Transform with<br />
                <span className="text-transparent" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #00E0FF, #39FF14)' }}>
                  AI precision.
                </span>
              </>
            )}
          </h2>

          {/* Feature bullets */}
          <div className="flex flex-col gap-4 mt-8">
            {BULLETS.map(({ icon: Icon, color, label, sub }) => (
              <div key={label} className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating metric card */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">AI Coach</p>
            <p className="text-white font-black text-lg font-heading">Weekly Protocol</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[11px] text-[#39FF14] font-bold">Live</span>
          </div>
        </div>
        <div className="flex gap-1.5 items-end h-10">
          {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm transition-all duration-500"
              style={{ height: `${h}%`, background: i === 5 ? '#00E0FF' : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          {[{label:'Streak', val:'14 Days', color:'#39FF14'}, {label:'Protein', val:'182g', color:'#00E0FF'}, {label:'Kcal', val:'2,840', color:'#8A2BE2'}].map(s => (
            <div key={s.label} className="flex-1 rounded-xl px-2 py-1.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-sm font-black font-heading" style={{ color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ── Auth form ──────────────────────────────────────────────────────────────────
export const Auth = () => {
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [showPass, setShowPass] = useState(false);
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    fitnessGoal: 'general fitness', experienceLevel: 'beginner',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API}/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) { login({ token: data.token, user: data }); navigate('/dashboard'); }
      else setError(data.message || 'Authentication failed');
    } catch {
      setError('Network error. Is the server running?');
    } finally { setLoading(false); }
  };

  const iCls = 'w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-200 placeholder-[#52525b]';
  const iStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const iFocus = 'focus:border-[#00E0FF]/40 focus:ring-2 focus:ring-[#00E0FF]/08';

  return (
    <div className="min-h-screen flex bg-black">
      {/* ── Left brand panel ── */}
      <div className="lg:w-[48%] xl:w-[44%] flex-shrink-0">
        <BrandPanel isLogin={isLogin} />
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050508 0%, #080810 100%)' }}>

        {/* Subtle glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,224,255,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* ── Tab switcher ── */}
          <div className="flex gap-1 p-1 rounded-xl mb-8 w-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {[{ label: 'Sign In', val: true }, { label: 'Create Account', val: false }].map(({ label, val }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setIsLogin(val); setError(null); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isLogin === val ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={isLogin === val ? { background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Header ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'li' : 'si'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,224,255,0.1)', border: '1px solid rgba(0,224,255,0.2)' }}>
                  <Dumbbell className="w-5 h-5 text-[#00E0FF]" />
                </div>
                <h1 className="text-2xl font-black font-heading text-white">
                  {isLogin ? 'Welcome back' : 'Get started free'}
                </h1>
              </div>
              <p className="text-gray-500 text-sm">
                {isLogin ? 'Sign in to your FitWala AI account.' : 'Create your account and begin training smarter.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ── Error state ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3.5 rounded-xl mb-5 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3.5 overflow-hidden"
                >
                  {/* Full name */}
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-widest font-bold block mb-1.5">Full Name</label>
                    <input name="name" type="text" placeholder="e.g. Alex Johnson" required
                      onChange={handleChange}
                      className={`${iCls} ${iFocus}`} style={iStyle} />
                  </div>

                  {/* Fitness Goal + Level */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-500 uppercase tracking-widest font-bold block mb-1.5">Goal</label>
                      <select name="fitnessGoal" onChange={handleChange}
                        className={`${iCls} ${iFocus} appearance-none`} style={iStyle}>
                        <option value="fat loss">Fat Loss</option>
                        <option value="muscle gain">Muscle Gain</option>
                        <option value="general fitness">General</option>
                        <option value="strength">Strength</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-500 uppercase tracking-widest font-bold block mb-1.5">Level</label>
                      <select name="experienceLevel" onChange={handleChange}
                        className={`${iCls} ${iFocus} appearance-none`} style={iStyle}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-widest font-bold block mb-1.5">Email</label>
              <input name="email" type="email" placeholder="you@email.com" required
                onChange={handleChange}
                className={`${iCls} ${iFocus}`} style={iStyle} />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-widest font-bold block mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" required
                  onChange={handleChange}
                  className={`${iCls} ${iFocus} pr-11`} style={iStyle} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="relative mt-2 w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all overflow-hidden disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2)', color: '#000' }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing…</>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-gray-600 text-xs uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* ── Switch mode link ── */}
          <p className="text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-[#00E0FF] font-semibold hover:text-white transition-colors">
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1.5">
              ← Back to FitWala AI
            </Link>
          </div>

          {!isLogin && (
            <p className="mt-4 text-center text-[11px] text-gray-600 leading-relaxed">
              By creating an account you agree to our{' '}
              <span className="text-gray-400 cursor-pointer hover:text-white transition-colors">Terms</span>{' '}
              and{' '}
              <span className="text-gray-400 cursor-pointer hover:text-white transition-colors">Privacy Policy</span>.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
