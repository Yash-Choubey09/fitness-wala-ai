import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { PageTransition } from './components/layout/PageTransition';
import { useLenis } from './hooks/useLenis';
import { CustomCursor } from './components/ui/CustomCursor';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy loaded heavy sections
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Planner   = lazy(() => import('./pages/Planner').then(m => ({ default: m.Planner })));
const Diet      = lazy(() => import('./pages/Diet').then(m => ({ default: m.Diet })));
const Chatbot   = lazy(() => import('./pages/Chatbot').then(m => ({ default: m.Chatbot })));

// Auth-aware protected route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While session is being restored from localStorage, show spinner
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-white/10 border-t-neonCyan rounded-full animate-spin shadow-glow-cyan" />
    </div>
  );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-16 h-16 border-4 border-white/10 border-t-neonCyan rounded-full animate-spin shadow-glow-cyan" />
  </div>
);

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
