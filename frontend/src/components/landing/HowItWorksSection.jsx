import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Brain, Dumbbell, Apple } from 'lucide-react';
import { useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useCardTilt } from '../../hooks/useCardTilt';

const steps = [
  { 
    title: 'Biometric Analysis', 
    desc: 'Input your raw telemetry and define your absolute physical targets.',
    icon: <Brain className="w-10 h-10 text-neonCyan" />,
    num: '01',
    shadow: 'shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    hoverBorder: 'group-hover:border-neonCyan/50',
    hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]'
  },
  { 
    title: 'Protocol Generation', 
    desc: 'Our engine synthesizes hyper-personalized daily active routines.',
    icon: <Dumbbell className="w-10 h-10 text-neonPurple" />,
    num: '02',
    shadow: 'shadow-[0_0_15px_rgba(138,43,226,0.2)]',
    hoverBorder: 'group-hover:border-neonPurple/50',
    hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(138,43,226,0.4)]'
  },
  { 
    title: 'Nutritional Intelligence', 
    desc: 'Receive exact macronutrient ratios optimized for your biological engine.',
    icon: <Apple className="w-10 h-10 text-neonGreen" />,
    num: '03',
    shadow: 'shadow-[0_0_15px_rgba(57,255,20,0.2)]',
    hoverBorder: 'group-hover:border-neonGreen/50',
    hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]'
  }
];

// ── Individual tiltable step card ─────────────────────────────────────────────
const StepCard = ({ step }) => {
  const { ref, handlers } = useCardTilt({ maxTilt: 7, scale: 1.03, speed: 0.35 });
  return (
    <div ref={ref} {...handlers} data-cursor="hover" className="tilt-card h-full cursor-pointer">
      <Card
        className={`group h-full flex flex-col items-center text-center p-10 bg-darkSecondary/80 backdrop-blur-xl border border-white/10 ${step.shadow} ${step.hoverShadow} ${step.hoverBorder} transition-colors duration-500 relative`}
      >
        <motion.div
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-black border border-white/10 ${step.shadow}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {step.icon}
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4 font-heading text-center uppercase tracking-wider">
          {step.title}
        </h3>
        <p className="text-gray-400 font-light leading-relaxed text-lg">{step.desc}</p>
        <div className="absolute top-4 right-4 text-white/5 font-black font-heading text-6xl pointer-events-none group-hover:text-white/10 transition-colors">
          {step.num}
        </div>
      </Card>
    </div>
  );
};

export const HowItWorksSection = () => {
  const lineRef  = useRef(null);
  const cardsRef = useRef(null);

  useScrollAnimation(lineRef,  'line-draw', { duration: 1.4, ease: 'power3.inOut' });
  useScrollAnimation(cardsRef, 'stagger',   { stagger: 0.18, y: 50, duration: 0.85 });

  return (
    <motion.section
      className="py-32 relative flex flex-col items-center overflow-hidden bg-black border-t border-white/5 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
      <div className="absolute top-1/2 left-1/4 w-[30rem] h-[30rem] bg-neonCyan/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[30rem] h-[30rem] bg-neonPurple/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 z-10 relative w-full">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-syncopate uppercase tracking-tight"
          >
            How Fitness Wala AI{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-neonPurple to-neonGreen drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              Works
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-light"
          >
            A continuous loop of data-driven physical optimization.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative px-4 md:px-0 mt-10">
          {/* GSAP line-draw animation */}
          <div
            ref={lineRef}
            className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-neonCyan via-neonPurple to-neonGreen opacity-20 -translate-y-1/2 -z-10"
            style={{ transformOrigin: 'left center' }}
          />

          {/* GSAP stagger on cards container */}
          <div ref={cardsRef} className="contents">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
