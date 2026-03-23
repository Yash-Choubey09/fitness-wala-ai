import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3.5 font-bold text-white transition-all duration-300 rounded-full overflow-hidden group font-heading uppercase tracking-wider text-sm";
  
  const variants = {
    primary: "bg-neonCyan/10 text-neonCyan border border-neonCyan/30 hover:bg-neonCyan hover:text-darkPrimary shadow-[0_0_10px_rgba(0,224,255,0.1)] hover:shadow-[0_0_20px_rgba(0,224,255,0.4)]",
    secondary: "bg-neonPurple/10 text-neonPurple border border-neonPurple/30 hover:bg-neonPurple hover:text-white shadow-[0_0_10px_rgba(138,43,226,0.1)] hover:shadow-[0_0_20px_rgba(138,43,226,0.4)]",
    outline: "border border-white/10 text-white hover:bg-white hover:text-darkPrimary hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 font-bold">{children}</span>
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.button>
  );
};
