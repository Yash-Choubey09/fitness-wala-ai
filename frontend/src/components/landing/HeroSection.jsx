import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useMagneticButton } from '../../hooks/useScrollAnimation';
import { Hero3DBackground } from './Hero3DBackground';

// ── Word-split helper for Main Heading ────────────────────────────────────────
const SplitWords = ({ text, className, delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const words = containerRef.current.querySelectorAll('.word-span');
      // Performance: use power2.out, set will-change
      gsap.fromTo(
        words,
        { y: 60, opacity: 0, force3D: true },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.8, delay, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [delay]);

  return (
    <span ref={containerRef} className={className} style={{ display: 'inline' }}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="word-span inline-block"
          style={{ marginRight: '0.3em', overflow: 'hidden', verticalAlign: 'bottom', willChange: 'transform' }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

// ── Subtext GSAP Stagger List ──────────────────────────────────────────────────
const SubtextList = () => {
  const listRef = useRef(null);
  
  const items = [
    "AI-generated workouts.",
    "Adaptive nutrition planning.",
    "Real-time performance analytics."
  ];

  useEffect(() => {
    if (!listRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const pTags = listRef.current.querySelectorAll('.subtext-item');
      gsap.fromTo(
        pTags,
        { y: 20, opacity: 0, force3D: true },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      );
    }, listRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={listRef} className="text-lg md:text-xl xl:text-2xl text-gray-300 font-sans font-light mb-6 space-y-1 opacity-90">
      {items.map((text, i) => (
        <p key={i} className="subtext-item" style={{ willChange: 'transform, opacity' }}>{text}</p>
      ))}
    </div>
  );
};

// ── Gradient Line Animator (Fixes WebKit bg-clip bug on nested blocks) ─────────
const AnimatedGradientLine = ({ text, delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 60, opacity: 0, force3D: true },
        { y: 0, opacity: 1, duration: 0.8, delay, ease: 'power2.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay]);

  return (
    <span
      ref={ref}
      className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-neonPurple to-neonGreen animate-shimmer block mt-1 pb-1"
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {text}
    </span>
  );
};

// ── Magnetic CTA wrapper ───────────────────────────────────────────────────────
const MagneticBtn = ({ children }) => {
  const ref = useRef(null);
  useMagneticButton(ref, { strength: 0.3 });
  return <div ref={ref}>{children}</div>;
};

// ── Main Hero Section ──────────────────────────────────────────────────────────
export const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Very subtle parallax, constrained
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-12 pb-20"
    >
      {/* Background Video — kept simple, low opacity */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
        <video
          autoPlay muted loop playsInline preload="none"
          poster="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/videos/fitness-bg.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Overlays */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)' }}
      />
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-neonCyan/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-neonPurple/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── Content Container (Desktop: Two Columns, Mobile: Single) ──────── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative w-full pt-[20px]"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* ── LEFT: Text block (Perfect vertical & left alignment) ──────── */}
          <div className="lg:w-[55%] text-center lg:text-left flex flex-col justify-center -mt-24">
            
            {/* Adjusted font sizing (prevent overflow on long text) */}
            <h1
              className="font-black font-heading tracking-tighter mb-4 leading-[1.05] text-white"
              style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}
            >
              <SplitWords text="Redefine Your Limits With" className="block" delay={0.1} />
              <AnimatedGradientLine text="Adaptive AI Intelligence" delay={0.6} />
            </h1>

            {/* GSAP Staggered lines */}
            <SubtextList />

            {/* CTA Buttons (Increased size, gap-8) */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            >
              <MagneticBtn>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Link to="/signup">
                    <Button
                      variant="primary"
                      data-cursor="hover"
                      className="w-full sm:w-auto text-lg px-12 py-5 sm:py-6 rounded-full border border-transparent 
                                 shadow-[0_0_20px_rgba(0,224,255,0.2)] hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] 
                                 transition-all duration-300 bg-white text-black font-semibold hover:bg-gray-100"
                    >
                      Start Your AI Plan
                    </Button>
                  </Link>
                </motion.div>
              </MagneticBtn>

              <MagneticBtn>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Link to="/features">
                    <Button
                      variant="outline"
                      data-cursor="hover"
                      className="w-full sm:w-auto text-lg px-12 py-5 sm:py-6 rounded-full border border-white/20 
                                 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 
                                 font-semibold backdrop-blur-md hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    >
                      Explore Workouts
                    </Button>
                  </Link>
                </motion.div>
              </MagneticBtn>
            </motion.div>
          </div>

          {/* ── RIGHT: Interactive Data+Motion Model ────────────────────────  */}
          <motion.div
            className="lg:w-[45%] w-full hidden sm:flex items-center justify-center relative"
            style={{ height: 'clamp(380px, 45vw, 650px)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          >
            <Hero3DBackground />
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
};
