import { motion } from 'framer-motion';
import { Brain, Dumbbell, Apple, ArrowRight } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Set Your Profile',
    desc: 'Input your age, weight, height, fitness goal, and experience level. One-time setup that powers everything.',
    icon: Brain,
    color: '#00E0FF',
  },
  {
    num: '02',
    title: 'Generate Protocols',
    desc: 'Our engine builds hyper-personalized workout and nutrition plans optimized for your biological profile.',
    icon: Dumbbell,
    color: '#8A2BE2',
  },
  {
    num: '03',
    title: 'Track & Evolve',
    desc: 'Log your weekly activity, monitor weight progression, and refine with your AI coach — all in real time.',
    icon: Apple,
    color: '#39FF14',
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="relative py-32 bg-black overflow-hidden border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, #8A2BE2 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4"
          >
            Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white leading-[0.95]"
          >
            From zero to optimized.
            <br />
            <span className="text-white/30">In three steps.</span>
          </motion.h2>
        </div>

        {/* Steps - horizontal timeline */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-11 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
            style={{ background: 'linear-gradient(90deg, #00E0FF22, #8A2BE222, #39FF1422)' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center md:items-start text-center md:text-left group"
                >
                  {/* Step icon circle */}
                  <div className="relative mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-0 relative z-10 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${step.color}12`, border: `1px solid ${step.color}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-lg"
                      style={{ background: step.color }} />
                  </div>

                  {/* Step number */}
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: step.color }}>
                    Step {step.num}
                  </p>

                  <h3 className="text-2xl font-black text-white font-heading tracking-tight mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 font-light leading-relaxed text-sm group-hover:text-gray-400 transition-colors">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
