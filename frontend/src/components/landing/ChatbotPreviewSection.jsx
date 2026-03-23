import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Bot, User, Sparkles } from 'lucide-react';

const chatHistory = [
  {
    role: 'user',
    message: 'Generate a fat loss workout for today.',
    delay: 0.2
  },
  {
    role: 'bot',
    message: 'Analyzing your telemetry... Generating a high-intensity protocol focused on maximum caloric expenditure. I have structured a 45-minute HIIT circuit targeting your core and lower body. Ready to initialize?',
    delay: 1.0,
    isTyping: true
  },
  {
    role: 'user',
    message: 'Suggest a high protein diet for recovery.',
    delay: 2.5
  },
  {
    role: 'bot',
    message: 'Based on your recent 8,450 kcal burn rate, I recommend a 40/40/20 macro split. I have formulated a post-workout protocol featuring Grilled Salmon, Quinoa, and a Whey isolate shake. Total: 650 Kcal, 55g Protein.',
    delay: 3.2,
    isTyping: true
  }
];

export const ChatbotPreviewSection = () => {
  return (
    <motion.section 
      className="py-[120px] relative bg-darkPrimary z-20 overflow-hidden border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>
      
      {/* Background glow minimized */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neonCyan/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 z-10 relative flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Typography */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest font-heading">24/7 Autonomous Coaching</span>
          </motion.div>
          
          <motion.h2   
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-heading tracking-tight leading-tight text-white"
          >
            Talk to your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-neonPurple to-neonGreen">AI Coach</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg font-light leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
          >
            Ask specific questions, request real-time protocol adjustments, or inquire about biological recovery tactics through a seamless, intelligent conversational interface.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="px-8 py-4 bg-white/5 hover:bg-neonCyan/10 border border-white/10 hover:border-neonCyan/50 text-white hover:text-neonCyan rounded-xl font-heading tracking-wide text-sm font-medium transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:shadow-[0_0_15px_rgba(0,224,255,0.2)] backdrop-blur-md"
          >
            Commence Link
          </motion.button>
        </div>

        {/* Right Chat Interface Preview */}
        <div className="lg:w-1/2 w-full max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className="rounded-3xl overflow-hidden flex flex-col h-[550px]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
            >
              
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
                <div className="w-12 h-12 rounded-full bg-neonCyan/10 border border-neonCyan/20 flex items-center justify-center relative">
                  <Bot className="w-6 h-6 text-neonCyan" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-neonGreen border-2 border-black"></span>
                </div>
                <div>
                  <h3 className="text-white font-heading tracking-wide text-sm font-medium">Fitness Wala AI</h3>
                  <p className="text-neonCyan text-xs font-light tracking-wider">Online • Analyzing</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                {chatHistory.map((chat, i) => (
                  <motion.div 
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: chat.delay + 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                    className={`flex items-end gap-3 max-w-[85%] ${chat.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${chat.role === 'user' ? 'bg-white/10 border-white/20' : 'bg-neonCyan/10 border-neonCyan/30'}`}>
                      {chat.role === 'user' ? <User className="w-4 h-4 text-gray-300" /> : <Bot className="w-4 h-4 text-neonCyan" />}
                    </div>
                    
                    <div className={`relative p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      chat.role === 'user' 
                      ? 'bg-white/10 text-white rounded-br-none border border-white/5' 
                      : 'bg-black/60 border border-white/10 text-gray-300 rounded-bl-none'
                    }`}>
                      {chat.isTyping ? (
                        <motion.div
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={{
                            visible: { transition: { staggerChildren: 0.015, delayChildren: chat.delay + 0.6 } }
                          }}
                        >
                          {chat.message.split("").map((char, index) => (
                            <motion.span
                              key={index}
                              variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 }
                              }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </motion.div>
                      ) : (
                        chat.message
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input Dummy */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
                  <span className="text-gray-500 text-sm font-light">Message Fitness Wala AI...</span>
                  <div className="w-8 h-8 rounded-lg bg-neonCyan/20 flex items-center justify-center">
                    <span className="text-neonCyan text-xs">↵</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
      </div>
    </motion.section>
  );
};
