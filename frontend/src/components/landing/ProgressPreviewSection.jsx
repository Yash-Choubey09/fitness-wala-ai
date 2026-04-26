import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { TrendingUp, Flame, Activity } from 'lucide-react';

const WEEKS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];
const DATA = [42, 56, 51, 68, 72, 80, 88, 97]; // performance % values

const StatPill = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-black/40 backdrop-blur-sm"
  >
    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div>
      <p className="text-white text-sm font-black font-heading">{value}</p>
      <p className="text-gray-500 text-[10px] uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const AnimatedBar = ({ height, isHighlight, index, inView }) => (
  <div className="flex-1 flex flex-col items-center gap-2">
    <div className="w-full flex items-end" style={{ height: 140 }}>
      <motion.div
        className="w-full rounded-t-lg"
        style={{
          background: isHighlight
            ? 'linear-gradient(to top, #00E0FF, #8A2BE2)'
            : 'rgba(255,255,255,0.06)',
          boxShadow: isHighlight ? '0 -4px 20px rgba(0,224,255,0.3)' : 'none',
        }}
        initial={{ height: 0 }}
        animate={{ height: inView ? `${height}%` : 0 }}
        transition={{ duration: 0.8, delay: 0.3 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
    <span className="text-[10px] text-gray-600 font-medium">{WEEKS[index]}</span>
  </div>
);

export const ProgressPreviewSection = () => {
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-32 bg-black overflow-hidden border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, #00E0FF 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT: Chart mockup */}
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-3xl overflow-hidden p-8"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Performance Index</p>
                  <p className="text-3xl font-black text-white font-heading">97<span className="text-gray-500 text-lg font-normal"> / 100</span></p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(0,224,255,0.1)', border: '1px solid rgba(0,224,255,0.2)' }}
                >
                  <TrendingUp className="w-6 h-6 text-[#00E0FF]" />
                </motion.div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-2 mb-2">
                {DATA.map((h, i) => (
                  <AnimatedBar
                    key={i}
                    height={h}
                    isHighlight={i === DATA.length - 1}
                    index={i}
                    inView={inView}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(#00E0FF, #8A2BE2)' }} />
                  <span className="text-[11px] text-gray-500">Current Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-white/10" />
                  <span className="text-[11px] text-gray-500">Previous Weeks</span>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-bold text-[#39FF14]">↑ 131% from Week 1</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Copy + stat pills */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4"
            >
              Progress Tracking
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white leading-[0.95] mb-6"
            >
              Watch yourself
              <br />
              <span className="text-white/30">get stronger.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-lg font-light leading-relaxed mb-10 max-w-md"
            >
              Every workout logged, every meal tracked, every kilo shifted — synthesized into clear, motivating progress visualizations on your personal dashboard.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatPill icon={Flame} label="Streak" value="14 Days" color="#F97316" delay={0.3} />
              <StatPill icon={Activity} label="Consistency" value="92%" color="#00E0FF" delay={0.4} />
              <StatPill icon={TrendingUp} label="Performance" value="+131%" color="#39FF14" delay={0.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
