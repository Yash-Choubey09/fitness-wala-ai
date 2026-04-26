import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onMouseMove={handleMouseMove}
      className={twMerge(
        "bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden group",
        className
      )}
      {...props}
    >
      {/* 
          WORLD CLASS HIGHLIGHT FEATURE: Magnetic Spotlight Effect.
          Inspired by Linear and Vercel. 
          A radial gradient that follows the mouse inside the card.
      */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 224, 255, 0.12),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Interactive Border Highlight Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 224, 255, 0.35),
              transparent 100%
            )
          `,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
