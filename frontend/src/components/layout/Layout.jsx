import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

export const Layout = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen flex flex-col pt-20 bg-transparent relative z-10"
    >
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <footer className="border-t border-white/5 bg-transparent mt-auto py-8 text-center text-gray-400 backdrop-blur-md">
        <p className="font-light">&copy; {new Date().getFullYear()} FITNESS WALA <span className="text-gray-400 font-bold tracking-widest">AI</span>. All rights reserved.</p>
        <p className="text-[10px] mt-3 text-gray-600 font-syncopate uppercase tracking-widest">Platform Telemetry Systems</p>
      </footer>
    </motion.div>
  );
};
