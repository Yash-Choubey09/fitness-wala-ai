import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, User, Zap, RotateCcw,
  Dumbbell, Salad, Activity, Moon,
  Loader2, Copy, Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Quick prompts ────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  { icon: <Dumbbell className="w-3.5 h-3.5" />, label: 'Best chest workout', color: 'text-neonCyan',   bg: 'bg-neonCyan/10',   border: 'border-neonCyan/20' },
  { icon: <Salad className="w-3.5 h-3.5" />,    label: 'Fat loss diet plan', color: 'text-neonGreen',  bg: 'bg-neonGreen/10',  border: 'border-neonGreen/20' },
  { icon: <Activity className="w-3.5 h-3.5" />, label: 'Build muscle fast',  color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { icon: <Moon className="w-3.5 h-3.5" />,     label: 'Recovery tips',      color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
];

// ─── Message bubble ───────────────────────────────────────────────────────────

const MessageBubble = ({ msg, isLast }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const copyText = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format AI response: convert **bold** and bullet lines
  const formatText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 items-start my-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neonCyan mt-2 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^[*-]\s/, '') }} />
          </div>
        );
      }
      if (!line.trim()) return <div key={i} className="h-2" />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg mt-1 ${
        isUser
          ? 'bg-neonPurple/20 border border-neonPurple/40'
          : 'bg-neonCyan/10 border border-neonCyan/25 shadow-[0_0_15px_rgba(0,224,255,0.15)]'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-neonPurple" />
          : <Bot className="w-4 h-4 text-neonCyan" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] group relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed font-light ${
          isUser
            ? 'bg-gradient-to-br from-neonPurple/25 to-neonPurple/8 border border-neonPurple/30 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(138,43,226,0.1)]'
            : 'bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
        }`}>
          {isUser ? msg.text : formatText(msg.text)}
        </div>

        {/* Copy button on AI messages */}
        {!isUser && (
          <button
            onClick={copyText}
            className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? <Check className="w-3 h-3 text-neonGreen" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-3"
  >
    <div className="w-9 h-9 rounded-xl bg-neonCyan/10 border border-neonCyan/25 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,224,255,0.1)]">
      <Bot className="w-4 h-4 text-neonCyan" />
    </div>
    <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-neonCyan"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Chatbot Page ─────────────────────────────────────────────────────────────

export const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => [{
    role: 'ai',
    text: `Hello${user?.name ? ` ${user.name.split(' ')[0]}` : ' Athlete'}! 👋 I'm **FitWala AI** — your autonomous fitness coach.\n\nI can help you with:\n* 🏋️ Personalized workout plans\n* 🥗 Diet & nutrition strategies\n* 💪 Muscle gain protocols\n* 🔥 Fat loss tactics\n* 😴 Recovery & sleep optimization\n\nWhat's your fitness goal today? Let's build something great together.`,
  }]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput]             = useState('');
  const [isThinking, setIsThinking]   = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const sendMessage = async (text = input) => {
    const messageText = text.trim();
    if (!messageText || isThinking) return;

    const userMsg = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Enrich message with user context for personalized AI responses
      const userContext = user
        ? `[User Profile: Goal=${user.fitnessGoal || 'general fitness'}, Level=${user.experienceLevel || 'beginner'}] `
        : '';
      const enrichedMessage = `${userContext}${messageText}`;

      const res = await fetch('http://localhost:5000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: enrichedMessage }),
      });

      const data = await res.json();
      
      // Always use data.reply from backend (Robust backend handles fallbacks)
      const aiReply = data.reply || "I'm having a bit of trouble connecting to my AI core! Try asking again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: '⚠️ Network Error: Please check if the backend server is running.',
      }]);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      text: "Chat cleared! 🔄 Ready for a fresh start. What fitness question can I help you with?",
    }]);
    setChatHistory([]);
    setInput('');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16 h-[calc(100vh-80px)] flex flex-col relative z-10">

        {/* Ambient glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neonCyan/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neonPurple/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ boxShadow: ['0 0 15px rgba(0,224,255,0.3)', '0 0 30px rgba(0,224,255,0.6)', '0 0 15px rgba(0,224,255,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center border border-neonCyan/30"
            >
              <Bot className="w-7 h-7 text-neonCyan" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white font-syncopate uppercase tracking-widest">
                FitWala <span className="text-neonCyan">AI</span>
              </h1>
              <p className="text-xs text-neonCyan flex items-center gap-2 font-bold uppercase tracking-widest mt-0.5">
                <span className="w-2 h-2 rounded-full bg-neonGreen shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse" />
                Powered by Google Gemini
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        {/* Chat container */}
        <div
          className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(20px)' }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isThinking && <TypingIndicator />}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-5 pt-3 border-t border-white/6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p.label)}
                  disabled={isThinking}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest border transition-all hover:scale-105 disabled:opacity-40 ${p.color} ${p.bg} ${p.border}`}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-black/40 border-t border-white/6">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about workouts, diet, fat loss, recovery…"
                disabled={isThinking}
                className="flex-1 rounded-xl px-5 py-3 bg-white/5 border border-white/10 focus:border-neonCyan/50 focus:outline-none focus:shadow-[0_0_15px_rgba(0,224,255,0.1)] text-white text-sm placeholder-gray-600 transition-all font-light disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isThinking}
                whileHover={!isThinking && input.trim() ? { scale: 1.05 } : {}}
                whileTap={!isThinking && input.trim() ? { scale: 0.95 } : {}}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-neonCyan to-neonGreen flex items-center justify-center shrink-0 text-black font-bold shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_30px_rgba(0,224,255,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isThinking
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <Send className="w-5 h-5" />
                }
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
