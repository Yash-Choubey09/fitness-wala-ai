import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { PageTransition } from './components/layout/PageTransition';
import { useLenis } from './hooks/useLenis';
import { CustomCursor } from './components/ui/CustomCursor';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Zap } from 'lucide-react';

// Lazy loaded heavy sections
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Planner   = lazy(() => import('./pages/Planner').then(m => ({ default: m.Planner })));
const Diet      = lazy(() => import('./pages/Diet').then(m => ({ default: m.Diet })));
const Chatbot   = lazy(() => import('./pages/Chatbot').then(m => ({ default: m.Chatbot })));

// ── Scroll progress bar ────────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX, width: '100%' }}
    />
  );
};

// ── Branded page loader ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-5">
    <div className="relative">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,224,255,0.15), rgba(138,43,226,0.15))', border: '1px solid rgba(0,224,255,0.25)' }}>
        <Zap className="w-7 h-7 text-[#00E0FF]" />
      </div>
      <div className="absolute -inset-1 rounded-2xl animate-spin"
        style={{ background: 'conic-gradient(from 0deg, transparent 0%, #00E0FF 20%, transparent 40%)', opacity: 0.4 }} />
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-white font-bold text-sm font-heading">FitWala <span className="text-[#00E0FF]">AI</span></p>
      <p className="text-gray-600 text-[11px] uppercase tracking-widest">Loading…</p>
    </div>
  </div>
);

// ── Protected route ────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/"        element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/features" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/login"   element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/signup"  element={<PageTransition><Auth /></PageTransition>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
          <Route path="/workouts"  element={<ProtectedRoute><PageTransition><Planner /></PageTransition></ProtectedRoute>} />
          <Route path="/diet"      element={<ProtectedRoute><PageTransition><Diet /></PageTransition></ProtectedRoute>} />
          <Route path="/chat"      element={<ProtectedRoute><PageTransition><Chatbot /></PageTransition></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function AppInner() {
  useLenis();
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-neonCyan/30 font-light relative overflow-hidden">
        <ScrollProgress />
        <CustomCursor />
        <BackgroundEffects />
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
