import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Calculator, Info } from 'lucide-react';

export const BMICalculator = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = "";
    let color = "";

    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-400"; }
    else if (bmi < 25) { category = "Healthy Weight"; color = "text-neonGreen"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-yellow-400"; }
    else { category = "Obese"; color = "text-red-400"; }

    setResult({ bmi, category, color });
  };

  return (
    <section id="bmi-calculator" className="py-24 relative overflow-hidden bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neonCyan/10 border border-neonCyan/30 text-neonCyan mb-6"
            >
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest font-heading">Biological Metrics</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-heading tracking-tight text-white">
              Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">BMI Analysis</span>
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg mb-8">
              Understand your body mass index in seconds. Our AI-driven platform uses these metrics to calibrate your initial training protocols.
            </p>
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md">
              <Info className="w-5 h-5 text-neonCyan shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400 leading-relaxed">
                BMI is a useful starting point, but our AI also considers body fat percentage and muscle mass for a complete profile.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-premium p-8 rounded-[2.5rem] relative"
            >
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Weight (kg)</label>
                    <span className="text-neonCyan font-mono font-bold">{weight}kg</span>
                  </div>
                  <input 
                    type="range" min="30" max="200" value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neonCyan"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Height (cm)</label>
                    <span className="text-neonPurple font-mono font-bold">{height}cm</span>
                  </div>
                  <input 
                    type="range" min="100" max="250" value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neonPurple"
                  />
                </div>

                <Button 
                  onClick={calculateBMI}
                  variant="primary" 
                  className="w-full py-6 text-base shadow-glow-cyan"
                >
                  Analyze My Metrics
                </Button>

                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8 border-t border-white/5 text-center"
                  >
                    <p className="text-gray-500 text-sm uppercase tracking-widest mb-1 font-bold">Your Result</p>
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-6xl font-black text-white">{result.bmi}</span>
                      <span className={`text-xl font-bold ${result.color}`}>{result.category}</span>
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
