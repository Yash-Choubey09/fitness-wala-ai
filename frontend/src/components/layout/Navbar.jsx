import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, User, LogOut, LayoutDashboard, Dumbbell, Apple, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     icon: Zap },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/diet',     label: 'Diet',     icon: Apple },
  { to: '/chat',     label: 'AI Chat',  icon: Bot },
];

export const Navbar = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full z-50 top-0 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-[60px]">

          {/* Logo + AI Live badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-sm-cyan"
              style={{ background: 'linear-gradient(135deg, rgba(0,224,255,0.15), rgba(138,43,226,0.15))', border: '1px solid rgba(0,224,255,0.25)' }}
            >
              <Zap className="w-4 h-4 text-[#00E0FF]" />
            </div>
            <span className="text-white font-black font-heading tracking-tight text-[17px]">
              FitWala <span className="text-[#00E0FF]">AI</span>
            </span>
            {/* AI Online status pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#39FF14]/20 bg-[#39FF14]/06 text-[#39FF14]/80 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              AI Online
            </span>
          </Link>

          {/* Center nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-1.5 py-1.5 backdrop-blur-sm">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  isActive(to)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive(to) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, rgba(0,224,255,0.18), rgba(138,43,226,0.12))', border: '1px solid rgba(0,224,255,0.20)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right: auth section */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
                  <User className="w-3 h-3 text-[#00E0FF]" />
                  {user?.name?.split(' ')[0] || 'Athlete'}
                </span>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white border border-white/[0.08] hover:border-[#00E0FF]/30 hover:bg-[#00E0FF]/05 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <div className="relative group">
                  <div
                    className="absolute -inset-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                    style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite' }}
                  />
                  <Link
                    to="/signup"
                    className="relative flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-black bg-white hover:bg-[#00E0FF] transition-colors duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/05 transition-all"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[60px] left-4 right-4 z-40 md:hidden rounded-2xl overflow-hidden"
            style={{ background: 'rgba(10,10,15,0.97)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}
          >
            <div className="p-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'text-white bg-white/[0.07] border border-white/[0.08]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#00E0FF] opacity-70" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="px-3 pb-3 pt-1 border-t border-white/[0.06] flex flex-col gap-1.5">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.04]">
                    <LayoutDashboard className="w-4 h-4 text-[#00E0FF]/70" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/[0.07] text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04]">Sign in</Link>
                  <Link to="/signup" className="px-4 py-3 rounded-xl text-sm font-bold text-black text-center rounded-xl" style={{ background: 'linear-gradient(135deg, #00E0FF, #8A2BE2)' }}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
