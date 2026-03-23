import { useMemo } from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects = () => {
    // Generate random stable particles
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * 10
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
            {/* Static Gradient Blobs - Optimized */}
            <div className="absolute -top-1/4 -left-1/4 w-[40vw] h-[40vw] rounded-full bg-neonPurple/10 blur-[100px]" />
            <div className="absolute top-1/3 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-neonCyan/10 blur-[100px]" />
            <div className="absolute -bottom-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-neonGreen/5 blur-[100px]" />

            {/* Floating Dynamic Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.id % 2 === 0 ? p.size * 2 : p.size,
                        height: p.id % 2 === 0 ? p.size * 2 : p.size,
                        backgroundColor: p.id % 3 === 0 ? 'rgba(0, 240, 255, 0.4)' : p.id % 3 === 1 ? 'rgba(57, 255, 20, 0.4)' : 'rgba(138, 43, 226, 0.4)',
                        boxShadow: p.id % 3 === 0 ? '0 0 15px rgba(0, 240, 255, 0.8)' : p.id % 3 === 1 ? '0 0 15px rgba(57, 255, 20, 0.8)' : '0 0 15px rgba(138, 43, 226, 0.8)'
                    }}
                    animate={{
                        y: [0, -300, 0],
                        x: [0, p.id % 2 === 0 ? 50 : -50, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeOut",
                        times: [0, 0.5, 1]
                    }}
                />
            ))}
            
            {/* Subtle Texture overlay */}
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
        </div>
    );
};
