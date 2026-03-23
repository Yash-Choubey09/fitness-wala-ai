import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Activity, Flame, Trophy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// ── Animated stat counter card ─────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, label, end, suffix, hoverColor, hoverGlow, children }) => {
  const numRef = useRef(null);
  // GSAP counter on scroll
  useScrollAnimation(numRef, 'counter', { end, suffix, duration: 2.2 });

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -6, boxShadow: hoverGlow }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="cursor-pointer h-full"
    >
      <div
        className="p-8 rounded-2xl group transition-all duration-300 h-full flex flex-col justify-center"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className={`p-3 ${iconBg} rounded-lg`}>{icon}</div>
          <h3 className="text-gray-400 font-heading tracking-wide font-medium uppercase text-sm">{label}</h3>
        </div>
        <div className="flex items-baseline gap-2">
          {/* GSAP counter target */}
          <span ref={numRef} className={`text-5xl font-black text-white ${hoverColor} transition-colors`}>
            {end.toLocaleString()}
          </span>
          {suffix && (
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{suffix}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ProgressPreviewSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  // Fade-up on chart container
  useScrollAnimation(sectionRef, 'fade-up', { delay: 0.3 });

  const handleAnimationComplete = () => setIsLoaded(true);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#00F0FF',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 240, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#6b7280', font: { family: 'Inter' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { family: 'Inter' } }
      }
    },
    elements: { line: { tension: 0.4 } }
  };

  const weightData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    datasets: [
      {
        fill: true,
        label: 'Weight (lbs)',
        data: isLoaded ? [195, 192, 189, 187, 184, 180] : [195, 195, 195, 195, 195, 195],
        borderColor: '#00F0FF',
        backgroundColor: 'rgba(0, 240, 255, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#0A0A0A',
        pointBorderColor: '#00F0FF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#00F0FF',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  return (
    <motion.section 
      className="py-[120px] relative bg-darkPrimary z-20 border-t border-white/5"
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neonCyan/5 rounded-t-[100%] blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-heading tracking-tight text-white"
          >
            Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">Evolution</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-light"
          >
            Monitor every metric of your physical transformation with precision telemetry.
          </motion.p>
        </div>

        {/* Stat cards — each has its own GSAP counter */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
            <StatCard
              icon={<Activity className="w-5 h-5 text-neonCyan" />}
              iconBg="bg-neonCyan/10"
              label="Active Streak"
              end={12}
              suffix="Days"
              hoverColor="group-hover:text-neonCyan"
              hoverGlow="0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 224, 255, 0.05)"
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
            <StatCard
              icon={<Flame className="w-5 h-5 text-orange-500" />}
              iconBg="bg-orange-500/10"
              label="Calories Burned"
              end={8450}
              suffix="Kcal"
              hoverColor="group-hover:text-orange-500"
              hoverGlow="0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(249, 115, 22, 0.05)"
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
            <StatCard
              icon={<Trophy className="w-5 h-5 text-neonPurple" />}
              iconBg="bg-neonPurple/10"
              label="Weight Lost"
              end={15}
              suffix="Lbs"
              hoverColor="group-hover:text-neonPurple"
              hoverGlow="0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(138, 43, 226, 0.05)"
            />
          </motion.div>
        </motion.div>

        {/* Chart */}
        <motion.div 
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.6 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div 
            className="p-8 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white font-heading uppercase tracking-wide mb-1">Weight Trajectory</h3>
                <p className="text-gray-400 font-light text-sm">6-Week biological mass reduction analysis.</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-neonCyan" />
                <span className="text-neonCyan font-medium uppercase tracking-widest text-xs">Actual</span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600 ml-4" />
                <span className="text-gray-400 font-medium uppercase tracking-widest text-xs">Projected</span>
              </div>
            </div>
            
            <div className="h-[400px] w-full relative">
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-12 h-12 border-2 border-white/10 border-t-neonCyan rounded-full animate-spin" />
                </div>
              )}
              {isLoaded && <Line data={weightData} options={chartOptions} />}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
