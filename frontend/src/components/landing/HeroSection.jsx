import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Activity, TrendingUp, Users } from 'lucide-react';

// ── Animated word reveal ───────────────────────────────────────────────────────
const WordReveal = ({ text, className, delay = 0 }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// ── Aurora background ──────────────────────────────────────────────────────────
const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.13]"
      style={{ background: 'radial-gradient(circle, #00E0FF 0%, transparent 70%)', filter: 'blur(90px)' }} />
    <div className="absolute top-[10%] right-[-15%] w-[600px] h-[600px] rounded-full opacity-[0.10]"
      style={{ background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)', filter: 'blur(90px)' }} />
    <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
      style={{ background: 'radial-gradient(circle, #39FF14 0%, transparent 70%)', filter: 'blur(100px)' }} />

    {/* Grid lines */}
    <div className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

    {/* Bottom fade */}
    <div className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 70%)' }} />
  </div>
);

// ── Animated badge ─────────────────────────────────────────────────────────────
const Badge = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm mb-8"
  >
    <div className="relative flex items-center">
      <span className="w-2 h-2 rounded-full bg-neonGreen" />
      <span className="absolute w-2 h-2 rounded-full bg-neonGreen animate-ping opacity-75" />
    </div>
    <Sparkles className="w-3.5 h-3.5 text-neonCyan" />
    <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
      AI-Powered Fitness Platform
    </span>
  </motion.div>
);

// ── Avatar social proof stack ──────────────────────────────────────────────────
const AvatarStack = () => {
  const AVATARS = ['👤', '👤', '👤', '👤', '👤'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 mt-8"
    >
      <div className="flex -space-x-2">
        {AVATARS.map((a, i) => (
          <div key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 border-black"
            style={{ background: `hsl(${200 + i * 30},60%,25%)`, zIndex: AVATARS.length - i }}>
            {a}
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
        </div>
        <p className="text-gray-500 text-xs mt-0.5">
          <span className="text-white font-semibold">2,400+</span> athletes already training
        </p>
      </div>
    </motion.div>
  );
};

// ── Product visualization ──────────────────────────────────────────────────────
const ProductVisualization = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Central glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[380px] h-[380px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #00E0FF 0%, transparent 60%)', filter: 'blur(60px)' }} />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      className="relative z-20 w-[320px]"
    >
      {/* Main dashboard card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-3xl p-6"
        style={{ background: 'rgba(8,8,12,0.95)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)', boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,224,255,0.08)' }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">AI FITNESS</p>
            <p className="text-lg font-black text-white font-heading">Weekly Protocol</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neonCyan/10 border border-neonCyan/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-neonCyan" />
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-14 mb-5">
          {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
            <motion.div key={i}
              className="flex-1 rounded-sm"
              style={{ background: i === 5 ? 'linear-gradient(to top, #00E0FF, #8A2BE2)' : 'rgba(255,255,255,0.08)', height: `${h}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.05, ease: 'backOut' }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-white font-heading">7 / 7</p>
            <p className="text-xs text-neonGreen font-bold">Days Active ↑</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white font-heading">2,840</p>
            <p className="text-xs text-gray-400 font-medium">kcal burned</p>
          </div>
        </div>

        {/* Macro row */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2">
          {[{label:'Protein', val:'182g', color:'#00E0FF'},{label:'Carbs', val:'240g', color:'#8A2BE2'},{label:'Fat', val:'68g', color:'#39FF14'}].map(m => (
            <div key={m.label} className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{m.label}</p>
              <p className="text-sm font-black font-heading" style={{ color: m.color }}>{m.val}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-16 top-4 rounded-2xl p-3"
        style={{ background: 'rgba(8,8,12,0.95)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)' }}
      >
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Streak</p>
        <p className="text-xl font-black text-white font-heading">14 Days</p>
        <p className="text-[10px] text-neonGreen font-bold">🔥 On Fire</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-14 bottom-12 rounded-2xl p-3"
        style={{ background: 'rgba(8,8,12,0.95)', border: '1px solid rgba(0,224,255,0.20)', backdropFilter: 'blur(16px)' }}
      >
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">AI Coach</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-pulse" />
          <p className="text-[11px] text-white font-bold">Live</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">Gemini 1.5</p>
      </motion.div>
    </motion.div>
  </div>
);

// ── Beam button ────────────────────────────────────────────────────────────────
const BeamButton = ({ children, href, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group">
      {isPrimary && (
        <div className="absolute -inset-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
          style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2, #39FF14)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite' }} />
      )}
      <Link to={href}
        className={`relative flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
          isPrimary
            ? 'bg-black text-white hover:text-neonCyan border border-white/20'
            : 'bg-white/[0.04] text-white/75 border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 backdrop-blur-sm'
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
};

// ── Animated stat item ─────────────────────────────────────────────────────────
const StatItem = ({ num, label, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1.25 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    className={index > 0 ? 'border-l border-white/[0.06] pl-8' : ''}
  >
    <p className="text-2xl font-black text-white font-heading">{num}</p>
    <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">{label}</p>
  </motion.div>
);

// ── Main Hero ──────────────────────────────────────────────────────────────────
export const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black pt-20">
      <AuroraBackground />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 relative"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── LEFT: Copy ── */}
          <div className="lg:w-[54%] text-center lg:text-left flex flex-col items-center lg:items-start">
            <Badge />

            <h1 className="font-black font-heading tracking-tight leading-[1.0] text-white mb-6"
              style={{ fontSize: 'clamp(40px, 5.5vw, 74px)' }}>
              <WordReveal text="Your Personal" className="block text-white" delay={0.1} />
              <span className="relative block mt-1 mb-1">
                <motion.span
                  className="block text-transparent"
                  style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #00E0FF 0%, #8A2BE2 50%, #39FF14 100%)', backgroundSize: '200% auto' }}
                  animate={{ backgroundPosition: ['0% center', '200% center'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
                >
                  <motion.span animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    AI Fitness Coach
                  </motion.span>
                </motion.span>
              </span>
              <WordReveal text="Built for Results." className="block text-white/80" delay={0.6} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 font-light max-w-lg"
            >
              Precision-engineered workout protocols, adaptive nutrition intelligence, and a real-time AI coach — all in one beautifully designed platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <BeamButton href="/signup" variant="primary">
                <span>Start for Free</span>
                <ArrowRight className="w-4 h-4" />
              </BeamButton>
              <a
                href="#features"
                onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.04]"
              >
                Explore Features
              </a>
            </motion.div>

            {/* Avatar social proof */}
            <AvatarStack />

            {/* Stat row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-10 flex items-center gap-8 pt-8 border-t border-white/[0.05] w-full"
            >
              {[
                { num: 'Gemini AI', label: 'Powered By' },
                { num: '100%',      label: 'Personalized' },
                { num: 'Real-time', label: 'Analytics' },
              ].map((s, i) => <StatItem key={i} {...s} index={i} />)}
            </motion.div>
          </div>

          {/* ── RIGHT: Product Visualization ── */}
          <div className="lg:w-[46%] w-full h-[480px] lg:h-[580px] hidden md:block relative">
            <ProductVisualization />
          </div>

        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} />
    </section>
  );
};
