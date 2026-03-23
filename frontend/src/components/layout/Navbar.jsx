import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLinks = () => (
    <>
      {[
        { to: '/features',  label: 'Features' },
        { to: '/workouts',  label: 'Workouts' },
        { to: '/diet',      label: 'Diet' },
        { to: '/chat',      label: 'AI Chat' },
      ].map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="nav-link relative text-gray-300 hover:text-white transition-colors font-sans uppercase tracking-widest text-xs font-medium py-1"
          style={{ display: 'inline-block' }}
        >
          {label}
          <span
            className={`nav-underline absolute left-0 bottom-0 h-[1px] bg-neonCyan w-full origin-left transition-transform duration-300 ease-out ${
              isActive(to) ? 'scale-x-100' : 'scale-x-0'
            } group-hover:scale-x-100`}
            aria-hidden="true"
          />
        </Link>
      ))}
    </>
  );

  return (
    <nav
      className={`fixed w-full z-50 top-0 start-0 border-b border-white/5 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-black/40 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4 px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Dumbbell className="w-8 h-8 text-white group-hover:text-neonCyan transition-colors" />
          </motion.div>
          <span className="self-center text-xl md:text-2xl font-bold whitespace-nowrap text-white font-heading tracking-tight">
            FITNESS WALA{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">AI</span>
          </span>
        </Link>

        {/* Right side — auth-aware buttons */}
        <div className="flex md:order-2 items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              {/* User pill */}
              <span className="text-xs text-gray-400 font-semibold tracking-wider border border-white/10 rounded-xl px-3 py-1.5 bg-white/5">
                <User className="w-3 h-3 inline mr-1.5 text-neonCyan" />
                {user?.name?.split(' ')[0] || 'Agent'}
              </span>
              <Link to="/dashboard">
                <Button variant="ghost" className="py-2 px-4 text-xs border border-white/10 hover:border-neonCyan transition-all">
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="py-2 px-4 text-xs border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="primary" className="py-2 px-6 text-xs text-black border border-transparent hover:border-neonCyan transition-all shadow-none">
                <User className="w-4 h-4 mr-2" /> Login
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-neonCyan"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav links */}
        <div className={`items-center justify-between ${isOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col items-center font-medium p-4 md:p-0 mt-4 border border-white/10 rounded-lg bg-black/80 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent w-full group">
            <NavLinks />
            {/* Mobile auth buttons */}
            {isAuthenticated ? (
              <div className="md:hidden mt-4 w-full flex flex-col gap-2">
                <Link to="/dashboard" className="w-full">
                  <Button variant="ghost" className="w-full py-2 text-xs border border-white/10">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="w-full py-2 text-xs border border-red-500/30 text-red-400">
                  <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="md:hidden mt-4 w-full">
                <Button variant="primary" className="w-full py-2 text-xs">Login</Button>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
