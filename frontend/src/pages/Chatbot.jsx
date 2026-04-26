import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, RotateCcw, Loader2, Copy, Check, ChevronDown, Zap, Search, MessageSquare, Info, Star, Hash, Bookmark, TrendingUp, Shield, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { getResponse } from '../utils/fitnessIntelligence';

// Safety: Replaced icons that might not exist in old lucide versions
const ShieldCheck = Shield;
const HeartPulse = Activity;

// ───────────────────────────────────────────────────────────────────────────────
// Smart Follow-up Questions Database
// ───────────────────────────────────────────────────────────────────────────────
const FOLLOW_UPS = {
  chest: ['Should I do barbell or dumbbell bench press first?', 'How to target upper chest specifically?', 'Are weighted dips good for chest growth?', 'How often train chest per week?', 'Fix strength imbalance?'],
  back: ['How to stop using biceps?', 'Best exercise for lat width?', 'Are deadlifts necessary?', 'How to improve grip strength?', 'Pull-up vs Chin-up?'],
  leg: ['Squats or leg press first?', 'How to build bigger hamstrings?', 'High reps or low reps for legs?', 'Increase squat depth?', 'Cardio on leg day?'],
  arms: ['Increase bicep peak?', 'Best tricep exercises?', 'Arm volume needs?', 'Train arms separately?', 'Fix skinny wrists?'],
  diet: ['How to stay full in deficit?', 'Cheat meal strategies?', 'Track every calorie?', 'Keto for fat loss?', 'Stop late-night cravings?'],
  muscle: ['Surplus needed?', 'Maingaining vs Bulking?', 'Minimize fat gain?', 'Best strength exercises?', 'Am I overtraining?'],
  supplements: ['Pre-workout worth it?', 'BCAAs effective?', 'Best type of protein?', 'Vitamins with food?', 'Best focus supplement?'],
  creatine: ['Loading phase necessary?', 'Creatine vs Hair loss?', 'Best time to take?', 'Rest day dosage?', 'Extra water needs?'],
  recovery: ['Improve sleep quality?', 'What is a deload?', 'Cold plunging?', 'Massage guns?', 'Treating joint pain?'],
  default: ['Best workout split?', 'Daily water intake?', 'Train every day?', 'Workout duration?', 'Is protein powder needed?']
};

function getFollowUps(text) {
  const m = text.toLowerCase();
  if (m.includes('chest') || m.includes('pec')) return FOLLOW_UPS.chest;
  if (m.includes('back') || m.includes('row')) return FOLLOW_UPS.back;
  if (m.includes('leg') || m.includes('squat')) return FOLLOW_UPS.leg;
  if (m.includes('arm') || m.includes('bicep')) return FOLLOW_UPS.arms;
  if (m.includes('diet') || m.includes('eat') || m.includes('fat')) return FOLLOW_UPS.diet;
  if (m.includes('muscle') || m.includes('bulk')) return FOLLOW_UPS.muscle;
  if (m.includes('supp')) return FOLLOW_UPS.supplements;
  if (m.includes('creatine')) return FOLLOW_UPS.creatine;
  if (m.includes('recover') || m.includes('sleep')) return FOLLOW_UPS.recovery;
  return FOLLOW_UPS.default;
}

const FAQ_PANEL = [
  { q: 'How many days should I train?', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { q: 'Best exercise for chest?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'Should I take creatine daily?', icon: <Bookmark className="w-3.5 h-3.5" /> },
  { q: 'How to lose belly fat fast?', icon: <Search className="w-3.5 h-3.5" /> },
  { q: 'Best post-workout meal?', icon: <Info className="w-3.5 h-3.5" /> },
  { q: 'Fix back pain from squats?', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { q: 'How to build wider shoulders?', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { q: 'Cardio before or after weights?', icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { q: 'What is progressive overload?', icon: <Hash className="w-3.5 h-3.5" /> },
  { q: 'Increase bench press strength?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'Are eggs good for muscle gain?', icon: <Info className="w-3.5 h-3.5" /> },
  { q: 'How to stop sugar cravings?', icon: <Search className="w-3.5 h-3.5" /> },
  { q: 'Is 5 hours of sleep enough?', icon: <Bookmark className="w-3.5 h-3.5" /> },
  { q: 'Full-body or split workouts?', icon: <Hash className="w-3.5 h-3.5" /> },
  { q: 'How to get veins on bicep?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'Vegan protein sources?', icon: <Info className="w-3.5 h-3.5" /> },
  { q: 'How to fix rounded shoulders?', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { q: 'Train with muscle soreness?', icon: <Info className="w-3.5 h-3.5" /> },
  { q: 'How to grow bigger calves?', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { q: 'White rice vs brown rice?', icon: <Info className="w-3.5 h-3.5" /> },
  { q: 'What is the anabolic window?', icon: <Hash className="w-3.5 h-3.5" /> },
  { q: 'How to improve grip strength?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'Are deadlifts dangerous?', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { q: 'How to lose weight without gym?', icon: <Search className="w-3.5 h-3.5" /> },
  { q: 'What is a dirty bulk?', icon: <Hash className="w-3.5 h-3.5" /> },
  { q: 'Stay consistent with training?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'Should I use a lifting belt?', icon: <Bookmark className="w-3.5 h-3.5" /> },
  { q: 'Caffeine and muscle growth?', icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { q: 'Fix knee pain while lunging?', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { q: 'Best stretches for lower back?', icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { q: 'How to increase protein?', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { q: 'What is time under tension?', icon: <Hash className="w-3.5 h-3.5" /> },
  { q: 'Are cheat days necessary?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'Build bigger forearms?', icon: <Star className="w-3.5 h-3.5" /> },
  { q: 'High protein and kidneys?', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { q: 'Improve core stability?', icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/workouts', label: 'Workouts' },
  { to: '/diet',     label: 'Diet'     },
  { to: '/chat',     label: 'AI Chat'  },
];

const GeminiIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <defs>
      <linearGradient id="gi" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E0FF" /><stop offset="50%" stopColor="#8A2BE2" /><stop offset="100%" stopColor="#39FF14" /></linearGradient>
    </defs>
    <path d="M14 2C14 2 16 8 20 12C24 16 28 14 28 14C28 14 22 16 20 20C18 24 14 28 14 28C14 28 12 22 8 18C4 14 0 14 0 14C0 14 6 12 8 8C10 4 14 2 14 2Z" fill="url(#gi)" />
  </svg>
);

function formatText(text) {
  if (!text) return '';
  return text.split('\n').map((line, i) => {
    const html = line.replace(/\*\*(.*?)\*\*/g, '<span style="color:rgba(255,255,255,0.95);font-weight:600">$1</span>');
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '3.5px 0' }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00E0FF', marginTop: 10, flexShrink: 0, display: 'block' }} />
          <span style={{ color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: html.replace(/^[*-]\s/, '') }} />
        </div>
      );
    }
    if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
    return <div key={i} style={{ color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

const MessageBubble = ({ msg, onSuggestionClick }) => {
  const [copied, setCopied] = useState(false);
  if (!msg) return null;
  const isUser = msg.role === 'user';
  const followUps = !isUser ? getFollowUps(msg.text) : [];

  return (
    <div style={{ width: '100%', marginBottom: isUser ? 24 : 40 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        {isUser ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '80%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 4px 20px', padding: '12px 20px', color: '#f3f4f6', fontSize: 15 }}>
              {msg.text}
            </div>
          </div>
        ) : (
          <div className="group" style={{ display: 'flex', gap: 16 }}>
            <div style={{ marginTop: 4, flexShrink: 0 }}><GeminiIcon size={24} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, lineHeight: 1.8 }}>{formatText(msg.text)}</div>
              <button
                onClick={() => { navigator.clipboard.writeText(msg.text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6b7280', fontSize: 11, cursor: 'pointer', marginTop: 12 }}
              >
                {copied ? <Check style={{ width: 12, height: 12, color: '#39FF14' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              {followUps.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <p style={{ color: '#4b5563', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Related Intelligence</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {followUps.map((q, i) => (
                      <button key={i} onClick={() => onSuggestionClick(q)} style={{ padding: '6px 14px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#9ca3af', fontSize: 12, cursor: 'pointer' }}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Chatbot = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput]           = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const messagesRef   = useRef(null);
  const textareaRef   = useRef(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isThinking]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || isThinking) return;
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setInput('');
    setIsThinking(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    let replied = false;
    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) { setMessages(p => [...p, { role: 'ai', text: data.reply }]); replied = true; }
      }
    } catch (_) {}

    if (!replied) {
      await new Promise(r => setTimeout(r, 700));
      setMessages(p => [...p, { role: 'ai', text: getResponse(msg) }]);
    }
    setIsThinking(false);
  }, [input, isThinking]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .chat-layout { height: 100vh; display: flex; background: #070707; overflow: hidden; }
        .chat-sidebar { width: 300px; flex-shrink: 0; background: #0A0A0A; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; }
        .chat-main { flex: 1; display: flex; flex-direction: column; position: relative; }
        .chat-topbar { height: 56px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
        .chat-messages { flex: 1; min-height: 0; overflow-y: auto; scroll-behavior: smooth; padding-top: 20px; }
        .chat-input-container { padding: 16px 24px 24px; background: #070707; }
        .chat-textarea { width: 100%; min-height: 52px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 14px 50px 14px 20px; color: white; resize: none; outline: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .nav-pill { padding: 7px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #6b7280; text-decoration: none; }
        .nav-pill.active { color: white; background: rgba(255,255,255,0.08); }
        .faq-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 14px; color: #9ca3af; font-size: 12.5px; border-radius: 10px; background: transparent; border: none; cursor: pointer; text-align: left; }
        .faq-item:hover { background: rgba(255,255,255,0.04); color: white; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
      <div className="chat-layout">
        <div className="chat-sidebar hidden lg:flex">
          <div style={{ padding: '24px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}><Zap style={{ width: 22, height: 22, color: '#00E0FF' }} /><span style={{ color: 'white', fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif" }}>FitWala AI</span></div>
          </div>
          <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
            {FAQ_PANEL.map((item, idx) => (
              <button key={idx} className="faq-item" onClick={() => sendMessage(item.q)}><span style={{ opacity: 0.6 }}>{item.icon}</span><span className="line-clamp-1">{item.q}</span></button>
            ))}
          </div>
          <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 10px #39FF14' }} />
              <div><p style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{user?.name?.split(' ')[0] || 'Athlete'}</p></div>
            </div>
          </div>
        </div>
        <div className="chat-main">
          <div className="chat-topbar">
            <div style={{ display: 'flex', gap: 4 }}>{NAV_LINKS.map(({ to, label }) => (<Link key={to} to={to} className={`nav-pill${isActive(to) ? ' active' : ''}`}>{label}</Link>))}</div>
            <button onClick={() => setMessages([])} className="nav-pill" style={{ border: '1px solid rgba(255,255,255,0.06)' }}><RotateCcw style={{ width: 13, height: 13 }} /></button>
          </div>
          <div className="chat-messages" ref={messagesRef}>
            {!hasMessages && !isThinking ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
                <GeminiIcon size={64} /><h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, marginTop: 24, textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>Hello, {user?.name?.split(' ')[0] || 'Athlete'}.</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 40, width: '100%', maxWidth: 600 }}>
                  {['Chest routine', 'Is fasting good?', 'Creatine guide', 'Consistency'].map(t => (<button key={t} onClick={() => sendMessage(t)} style={{ padding: '16px 20px', borderRadius: 16, background: '#111', border: '1px solid rgba(255,255,255,0.06)', color: '#9ca3af', textAlign: 'left', fontSize: 13.5 }}>{t}</button>))}
                </div>
              </div>
            ) : (
              <div style={{ paddingBottom: 40 }}>{messages.map((m, i) => <MessageBubble key={i} msg={m} onSuggestionClick={sendMessage} />)}</div>
            )}
          </div>
          <div className="chat-input-container">
            <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask..." className="chat-textarea" rows={1} />
              <button onClick={() => sendMessage()} style={{ position: 'absolute', right: 10, bottom: 10, width: 33, height: 33, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #00E0FF, #8A2BE2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send className="w-3.5 h-3.5 text-black" /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
