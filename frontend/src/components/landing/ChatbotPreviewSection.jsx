import { motion } from 'framer-motion';
import { Bot, User, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PREVIEW_MESSAGES = [
  {
    role: 'ai',
    text: 'Your recovery metrics suggest today is optimal for a high-intensity push session. Want me to generate a full chest protocol?',
    delay: 0.2,
  },
  {
    role: 'user',
    text: 'Yes, and keep it under 45 minutes.',
    delay: 0.5,
  },
  {
    role: 'ai',
    text: "Done. I've generated a 42-min hypertrophy-focused chest routine: Bench Press → Incline DB → Cable Fly → Push-ups. Shall I log it to your planner?",
    delay: 0.8,
  },
];

const ChatBubble = ({ msg, index }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: msg.delay, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUser ? 'bg-white/10 border border-white/15' : 'bg-[#00E0FF]/10 border border-[#00E0FF]/20'
      }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-gray-400" />
          : <Bot className="w-3.5 h-3.5 text-[#00E0FF]" />
        }
      </div>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-light ${
        isUser
          ? 'bg-white/8 text-gray-200 rounded-tr-sm border border-white/8'
          : 'bg-black/50 text-gray-300 rounded-tl-sm border border-white/8'
      }`}>
        {msg.text}
      </div>
    </motion.div>
  );
};

export const ChatbotPreviewSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-black overflow-hidden border-t border-white/5">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #00E0FF 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00E0FF]/20 bg-[#00E0FF]/5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E0FF]" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#00E0FF]">Gemini AI Powered</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white leading-[0.95] mb-6"
            >
              An AI coach
              <br />
              <span className="text-white/30">that never sleeps.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-lg font-light leading-relaxed mb-10 max-w-md"
            >
              Ask anything — form breakdowns, macro adjustments, deload strategies. Your AI coach is always ready with science-backed, personalized answers.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-7 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-neonCyan transition-colors duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,224,255,0.2)]"
            >
              <MessageSquare className="w-4 h-4" />
              Start a Conversation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* RIGHT: Chat window */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,224,255,0.04)',
              }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/8">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                    <span className="text-[11px] text-gray-400 font-medium">FitWala AI — Live</span>
                  </div>
                </div>
                <Bot className="w-4 h-4 text-[#00E0FF]" />
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-4 p-6">
                {PREVIEW_MESSAGES.map((msg, i) => (
                  <ChatBubble key={i} msg={msg} index={i} />
                ))}

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#00E0FF]/10 border border-[#00E0FF]/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#00E0FF]" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/8 bg-black/50 flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-500"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, delay, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Input area (clickable) */}
              <div
                className="p-4 border-t border-white/5 cursor-pointer group"
                onClick={() => navigate('/chat')}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/8 group-hover:border-[#00E0FF]/30 transition-colors duration-300">
                  <span className="flex-1 text-gray-600 text-sm font-light group-hover:text-gray-400 transition-colors">
                    Ask anything about fitness &amp; nutrition…
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#00E0FF]/10 group-hover:bg-[#00E0FF] flex items-center justify-center transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 text-[#00E0FF] group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
