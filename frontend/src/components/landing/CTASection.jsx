import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Star } from 'lucide-react';

// Subtle grid background inside the CTA card
const GridBackground = () => (
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }}
  />
);

const SOCIAL_PROOF = [
  { icon: '🏋️', stat: '10k+', label: 'Athletes' },
  { icon: '⚡', stat: 'Gemini', label: 'AI Powered' },
  { icon: '🔒', stat: '100%', label: 'Private' },
  { icon: '🌍', stat: 'Free', label: 'Always' },
];

export const CTASection = () => (
  <section className="relative py-24 bg-black overflow-hidden">
    {/* Outer glow */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(138,43,226,0.06) 0%, transparent 70%)' }} />

    <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
      {/* ── Full-bleed gradient border card ── */}
      <div className="relative rounded-[2.5rem] overflow-hidden group">
        {/* Animated border beam */}
        <div
          className="absolute -inset-[1px] rounded-[2.5rem] z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,224,255,0.4), rgba(138,43,226,0.4), rgba(57,255,20,0.3), rgba(0,224,255,0.4))',
            backgroundSize: '300% 300%',
            animation: 'gradient-shift 6s ease infinite',
          }}
        />

        {/* Card inner */}
        <div className="relative z-10 m-[1px] rounded-[2.4rem] overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #08080e 0%, #0c0c14 60%, #080a12 100%)' }}>
          <GridBackground />

          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,224,255,0.12) 0%, transparent 70%)' }} />

          <div className="relative z-10 px-8 py-16 sm:px-16 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(0,224,255,0.07)', border: '1px solid rgba(0,224,255,0.2)' }}
            >
              <Zap className="w-3.5 h-3.5 text-[#00E0FF]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00E0FF]/80">Start Today — It's Free</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tighter text-white leading-[0.92] mb-5"
            >
              Your strongest self
              <br />
              <span className="text-transparent"
                style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #00E0FF 0%, #8A2BE2 50%, #39FF14 100%)' }}>
                is one click away.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-xl font-light mb-10 max-w-lg mx-auto leading-relaxed"
            >
              AI-powered workouts and nutrition — built around your body, your goals, your schedule.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                  style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2, #39FF14)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite' }} />
                <Link to="/signup"
                  className="relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest border border-white/10 bg-black text-white hover:text-[#00E0FF] transition-colors duration-300"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <Link to="/login"
                className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all hover:bg-white/[0.04]"
              >
                Already have an account? Sign In
              </Link>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
            >
              {SOCIAL_PROOF.map(({ icon, stat, label }) => (
                <div key={label} className="rounded-2xl px-4 py-4 text-center transition-all duration-300 group hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="text-white font-black text-lg font-heading leading-tight">{stat}</p>
                  <p className="text-gray-500 text-[11px] uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
