import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    fitnessGoal: 'general fitness', experienceLevel: 'beginner'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Use AuthContext login to populate global state
        login({ token: data.token, user: data });
        navigate('/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-neonCyan/5 rounded-full blur-[120px] absolute -top-40 -left-20 animate-pulse-slow"></div>
        <div className="w-[600px] h-[600px] bg-neonPurple/5 rounded-full blur-[120px] absolute bottom-0 right-0 animate-float"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 pb-10 glass-card">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-black/60 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-glow-cyan">
              <Dumbbell className="w-8 h-8 text-neonCyan" />
            </div>
            <h2 className="text-3xl font-black font-syncopate uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonGreen mb-2 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
              {isLogin ? 'Welcome Back' : 'Initialize Session'}
            </h2>
            <p className="text-gray-400 text-sm max-w-[280px] font-light mt-2">
              {isLogin ? 'Access your intelligent biological dashboard.' : 'Configure your autonomous fitness parameters.'}
            </p>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <input 
                  name="name" type="text" placeholder="Full Name" required 
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-neonCyan/50 focus:shadow-glow-cyan transition-all mb-4"
                />
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select 
                    name="fitnessGoal" onChange={handleChange}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-neonCyan/50 focus:shadow-glow-cyan transition-all appearance-none"
                  >
                    <option value="fat loss">Fat Loss</option>
                    <option value="muscle gain">Muscle Gain</option>
                    <option value="general fitness">General Fitness</option>
                  </select>
                  <select 
                    name="experienceLevel" onChange={handleChange}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-neonCyan/50 focus:shadow-glow-cyan transition-all appearance-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </motion.div>
            )}

            <input 
              name="email" type="email" placeholder="Email Address" required 
              onChange={handleChange}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-neonCyan/50 focus:shadow-glow-cyan transition-all"
            />
            <input 
              name="password" type="password" placeholder="Password" required 
              onChange={handleChange}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-neonCyan/50 focus:shadow-glow-cyan transition-all"
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 py-4 rounded-xl font-bold font-syncopate uppercase tracking-wider text-black bg-gradient-to-r from-neonCyan to-neonGreen hover:shadow-glow-green transform hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-neonCyan/50 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Authenticate' : 'Initialize Account')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8 relative z-10 font-light">
            {isLogin ? "System unregistered? " : "Already configured? "}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-neonCyan font-bold tracking-wider hover:text-white transition-colors uppercase text-xs ml-1"
            >
              {isLogin ? 'Create Profile' : 'Access Dashboard'}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
