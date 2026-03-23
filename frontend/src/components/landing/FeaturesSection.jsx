import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Bot, Dumbbell, Apple, LineChart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { useCardTilt } from '../../hooks/useCardTilt';

const features = [
  {
    title: 'AI Fitness Guidance',
    description: 'Autonomous agents generate hyper-personalized workout plans based on your age, body metrics, and goals.',
    icon: <Bot className="w-8 h-8 text-neonCyan" />
  },
  {
    title: 'Smart Workout Planner',
    description: 'Dynamic daily and weekly schedules that adapt in real-time to your physical progress and recovery rate.',
    icon: <Dumbbell className="w-8 h-8 text-neonPurple" />
  },
  {
    title: 'Nutrition Intelligence',
    description: 'Receive AI-crafted meal plans tailored to your goal—be it weight loss or muscle gain—with calorie tracking.',
    icon: <Apple className="w-8 h-8 text-neonGreen" />
  },
  {
    title: 'Advanced Analytics',
    description: 'Track your weight, body measurements, calories, and workout streaks directly on your modern dashboard.',
    icon: <LineChart className="w-8 h-8 text-neonCyan" />
  }
];

// ── Individual tiltable feature card ─────────────────────────────────────────
const FeatureCard = ({ opt }) => {
  const { ref, handlers } = useCardTilt({ maxTilt: 8, scale: 1.04, speed: 0.35 });
  return (
    <div
      ref={ref}
      {...handlers}
      data-cursor="hover"
      className="feature-card group tilt-card h-full"
    >
      <div
        className="h-full rounded-2xl p-8 relative overflow-hidden flex flex-col items-start z-10 cursor-pointer transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 blur-2xl rounded-full group-hover:bg-neonCyan/10 transition-colors duration-500" />

        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-black/50 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          whileHover={{ scale: 1.12, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {opt.icon}
        </motion.div>

        <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-300 font-heading tracking-wide leading-tight group-hover:text-neonCyan">
          {opt.title}
        </h3>
        <p className="text-gray-400 leading-relaxed font-light text-sm">{opt.description}</p>
      </div>
    </div>
  );
};

export const FeaturesSection = () => {
  const gridRef = useRef(null);

  // ScrollTrigger.batch for performant staggered grid reveal
  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;
    const cards = gridRef.current.querySelectorAll('.feature-card');
    gsap.set(cards, { y: 40, opacity: 0, force3D: true });
    const batch = ScrollTrigger.batch(cards, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, stagger: 0.12, duration: 0.85, ease: 'power3.out', force3D: true }),
    });
    return () => batch.forEach((t) => t.kill());
  }, []);

  return (
    <motion.section
      className="py-[120px] relative bg-darkPrimary z-20 border-t border-white/5"
      id="features"
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neonPurple/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neonCyan/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-heading tracking-tight text-white"
          >
            Core{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">
              Capabilities
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-light"
          >
            A cohesive intelligence ecosystem designed to biologically optimize your performance through real-time data synthesis.
          </motion.p>
        </div>

        {/* Cards — ScrollTrigger.batch stagger + individual useCardTilt */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((opt, i) => (
            <FeatureCard key={i} opt={opt} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};
