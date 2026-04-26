import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Bot, Dumbbell, Apple, LineChart, Activity, ArrowRight, Shield, Cpu, X, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    id: 'ai-coach',
    icon: Bot,
    color: '#00E0FF',
    tag: 'AI Core',
    title: 'Neural Fitness Coach',
    description: 'Google Gemini powers your personal coach — answering complex questions about form, recovery, and protocol adaptation in real time.',
    details: 'Ask your AI coach about exercise form, recovery timing, program adjustments, and nutrient timing. Gemini helps you make training decisions backed by science without guesswork.',
    preview: { metric: '14', unit: 'Day Streak', sub: '🔥 Personal best' },
  },
  {
    id: 'workouts',
    icon: Dumbbell,
    color: '#8A2BE2',
    tag: 'Generator',
    title: 'Smart Workout Planner',
    description: 'Hyper-personalized exercise protocols generated from your body metrics, fitness level, and weekly availability.',
    details: 'Our planner uses your height, weight, goals, and available days to build a balanced weekly routine. Each session adapts for volume, recovery, and tool availability.',
    preview: { metric: '48', unit: 'Exercises', sub: '↑ 6 new this week' },
  },
  {
    id: 'nutrition',
    icon: Apple,
    color: '#39FF14',
    tag: 'Nutrition',
    title: 'Adaptive Meal Planning',
    description: 'Calorie-precise, goal-aligned nutrition plans that evolve as your body composition shifts.',
    details: 'Nutrition plans are generated using your metabolic baseline and fitness objective. The system adjusts macros, calories, and meal timing as you progress.',
    preview: { metric: '2,200', unit: 'kcal / day', sub: '✓ On target' },
  },
  {
    id: 'analytics',
    icon: LineChart,
    color: '#00E0FF',
    tag: 'Analytics',
    title: 'Real-Time Progress Tracking',
    description: 'Weight progression graphs, workout streaks, calorie logs — all synthesized into a clean, actionable dashboard.',
    details: 'Track your achievements with daily logs, weekly trends, and performance summaries. Use data-backed insights to keep your training consistent and efficient.',
    preview: { metric: '−4.2kg', unit: 'Lost', sub: '↓ Progress logged' },
  },
  {
    id: 'tracking',
    icon: Activity,
    color: '#F97316',
    tag: 'Performance',
    title: 'Weekly Consistency Engine',
    description: 'Day-by-day tracking of workout completion and diet adherence, with automatic streak calculation.',
    details: 'Stay motivated with streak tracking, completion badges, and weekly summaries. The engine highlights consistency wins and suggests easy course corrections.',
    preview: { metric: '86%', unit: 'Consistency', sub: '↑ +12% this week' },
  },
  {
    id: 'security',
    icon: Shield,
    color: '#8A2BE2',
    tag: 'Infrastructure',
    title: 'Secure & Private by Design',
    description: 'JWT-authenticated, MongoDB-backed data model. Your biometric data is encrypted and never sold.',
    details: 'Data security is built into the platform with token-based authentication, encrypted storage, and strict privacy controls. Your fitness profile stays private and protection-first.',
    preview: { metric: '100%', unit: 'Private', sub: '🔒 Encrypted' },
  },
];

// ── Feature detail preview card ────────────────────────────────────────────────
const FeaturePreviewCard = ({ feature }) => {
  const Icon = feature.icon;
  const bars = [40, 65, 55, 80, 70, 90, 75];

  return (
    <motion.div
      key={feature.id}
      initial={{ opacity: 0, x: 24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -12, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col"
    >
      {/* Top accent */}
      <div className="h-px w-full mb-8"
        style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`, opacity: 0.5 }} />

      {/* Tag + icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}25` }}>
          <Icon className="w-6 h-6" style={{ color: feature.color }} />
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full"
          style={{ color: feature.color, background: `${feature.color}10`, border: `1px solid ${feature.color}20` }}>
          {feature.tag}
        </span>
      </div>

      <h3 className="text-3xl font-black font-heading tracking-tight text-white mb-4">{feature.title}</h3>
      <p className="text-gray-400 font-light leading-relaxed mb-8">{feature.details}</p>

      {/* Mini metric card */}
      <div className="mt-auto rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{feature.tag} · Live Snapshot</p>
            <p className="text-3xl font-black text-white font-heading">{feature.preview.metric}</p>
            <p className="text-sm text-gray-400 mt-0.5">{feature.preview.unit}</p>
          </div>
          <div className="flex items-end gap-1 h-12">
            {bars.map((h, i) => (
              <div key={i} className="w-2 rounded-sm"
                style={{ height: `${h}%`, background: i === 5 ? feature.color : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-white/[0.06]">
          <span className="text-xs font-bold" style={{ color: feature.color }}>{feature.preview.sub}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Features Section ───────────────────────────────────────────────────────────
export const FeaturesSection = () => {
  const [activeId, setActiveId] = useState('ai-coach');
  const [modalFeature, setModalFeature] = useState(null);
  const activeFeature = FEATURES.find(f => f.id === activeId);

  return (
    <section className="relative py-32 bg-black overflow-hidden" id="features">
      {/* Section background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, #00E0FF 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6"
          >
            <Cpu className="w-3.5 h-3.5 text-neonCyan" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Platform Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tighter text-white mb-6 leading-[0.95]"
          >
            Everything you need.
            <br />
            <span className="text-transparent"
              style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}>
              Nothing you don't.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto font-light leading-relaxed"
          >
            A tightly integrated suite of AI-powered fitness tools, purpose-built for serious athletes and beginners alike.
          </motion.p>
        </div>

        {/* ── Desktop: Linear-style sidebar layout ── */}
        <div className="hidden lg:grid grid-cols-[340px_1fr] gap-6 items-start">
          {/* Left: feature tab list */}
          <div className="flex flex-col gap-1 sticky top-28">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = feature.id === activeId;
              return (
                <motion.button
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
                  onClick={() => setActiveId(feature.id)}
                  className={`relative flex items-center gap-3.5 px-4 py-4 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  style={isActive
                    ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }
                    : { background: 'transparent', border: '1px solid transparent' }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="feature-bar"
                      className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                      style={{ background: feature.color }}
                      transition={{ type: 'spring', bounce: 0.2 }}
                    />
                  )}

                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${feature.color}${isActive ? '18' : '0a'}`, border: `1px solid ${feature.color}${isActive ? '30' : '18'}` }}>
                    <Icon className="w-4 h-4" style={{ color: isActive ? feature.color : feature.color + '80' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-widest font-bold mb-0.5 opacity-50">{feature.tag}</p>
                    <p className={`text-sm font-semibold leading-tight truncate ${isActive ? 'text-white' : ''}`}>{feature.title}</p>
                  </div>

                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${isActive ? 'opacity-100 text-gray-300' : 'opacity-0 group-hover:opacity-50'}`} />
                </motion.button>
              );
            })}
          </div>

          {/* Right: feature detail panel */}
          <div className="rounded-3xl p-10 min-h-[520px] relative overflow-hidden"
            style={{ background: 'rgba(10,10,14,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <AnimatePresence mode="wait">
              {activeFeature && <FeaturePreviewCard key={activeFeature.id} feature={activeFeature} />}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile: bento grid ── */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setModalFeature(feature)}
                className="relative group overflow-hidden rounded-3xl border border-white/[0.08] cursor-pointer p-6"
                style={{ background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500 group-hover:opacity-80 opacity-20"
                  style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-black text-white font-heading mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Feature detail modal (mobile) */}
      <AnimatePresence>
        {modalFeature && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={() => setModalFeature(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#07080b] p-8"
            >
              <button type="button" onClick={() => setModalFeature(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition">
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-bold mb-1">{modalFeature.tag}</p>
              <h3 className="text-3xl font-black text-white tracking-tight mb-4">{modalFeature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{modalFeature.details}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
