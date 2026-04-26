import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Activity, Flame, Zap } from 'lucide-react';

export const MaintenanceCalculator = () => {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.375); // Moderate
  const [result, setResult] = useState(null);

  const calculateTDEE = () => {
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const tdee = Math.round(bmr * activity);
    setResult(tdee);
  };

  return (
    <section id="maintenance-calculator" className="py-24 relative overflow-hidden bg-darkPrimary">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neonPurple/10 border border-neonPurple/30 text-neonPurple mb-6"
            >
              <Activity className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest font-heading">Metabolic Engine</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-heading tracking-tight text-white">
              Optimize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonCyan">Caloric Baseline</span>
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg mb-8">
              Your Total Daily Energy Expenditure (TDEE) is the number of calories your body burns in a day. We use this to engineer your dynamic meal plans.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Flame className="w-5 h-5 text-neonPurple mb-2" />
                <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Burn Rate</h4>
                <p className="text-xs text-gray-500">Real-time metabolic tracking integration.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Zap className="w-5 h-5 text-neonCyan mb-2" />
                <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Macro Sync</h4>
                <p className="text-xs text-gray-500">Syncs with your generated diet protocols.</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-premium p-8 rounded-[2.5rem] relative"
            >
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setGender('male')}
                    className={`flex-1 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${gender === 'male' ? 'bg-neonCyan text-black border-neonCyan' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                  >
                    Male
                  </button>
                  <button 
                    onClick={() => setGender('female')}
                    className={`flex-1 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${gender === 'female' ? 'bg-neonPurple text-white border-neonPurple' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                  >
                    Female
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Age</label>
                    <input 
                      type="number" value={age} onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonCyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Height (cm)</label>
                    <input 
                      type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonCyan transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Weight (kg)</label>
                  <input 
                    type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonCyan transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Activity Level</label>
                  <select 
                    value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonCyan transition-colors appearance-none"
                  >
                    <option value="1.2" className="bg-darkCard">Sedentary (Office job)</option>
                    <option value="1.375" className="bg-darkCard">Light (1-2 days/week)</option>
                    <option value="1.55" className="bg-darkCard">Moderate (3-5 days/week)</option>
                    <option value="1.725" className="bg-darkCard">Active (6-7 days/week)</option>
                    <option value="1.9" className="bg-darkCard">Athlete (2x/day)</option>
                  </select>
                </div>

                <Button 
                  onClick={calculateTDEE}
                  variant="secondary" 
                  className="w-full py-6 text-base shadow-glow-purple"
                >
                  Calculate Maintenance
                </Button>

                {result && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="pt-6 border-t border-white/5 text-center"
                  >
                    <p className="text-gray-500 text-sm uppercase tracking-widest mb-1 font-bold">Daily Maintenance</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-black text-white">{result}</span>
                      <span className="text-neonPurple font-bold">kcal/day</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
