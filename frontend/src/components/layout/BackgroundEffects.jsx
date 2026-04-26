import { useMemo } from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects = () => {
  // Fewer, subtler particles so they don't compete with content
  const particles = useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      duration: Math.random() * 25 + 30,
      delay: Math.random() * 12,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Slow-drifting gradient blobs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[45vw] h-[45vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.12) 0%, transparent 70%)', filter: 'blur(90px)' }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-1/4 w-[50vw] h-[50vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,224,255,0.09) 0%, transparent 70%)', filter: 'blur(90px)' }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 w-[55vw] h-[55vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />

      {/* Subtle floating micro-particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor:
              p.id % 3 === 0 ? 'rgba(0,224,255,0.5)'
              : p.id % 3 === 1 ? 'rgba(57,255,20,0.4)'
              : 'rgba(138,43,226,0.5)',
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, p.id % 2 === 0 ? 30 : -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          }}
        />
      ))}

      {/* Fine dot-grid noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
