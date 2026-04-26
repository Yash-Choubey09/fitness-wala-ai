import { motion } from 'framer-motion';
import { UserCheck, Info } from 'lucide-react';

const bodyTypes = [
  {
    type: "Ectomorph",
    description: "Lean and long, with difficulty building muscle. High metabolic rate.",
    characteristics: ["Narrow shoulders", "Thin limbs", "Low body fat"],
    color: "from-blue-500/20 to-neonCyan/20",
    borderColor: "border-neonCyan/30"
  },
  {
    type: "Mesomorph",
    description: "Muscular and well-built, with a high metabolism and responsive muscle cells.",
    characteristics: ["Wide shoulders", "Narrow waist", "Athletic build"],
    color: "from-purple-500/20 to-neonPurple/20",
    borderColor: "border-neonPurple/30"
  },
  {
    type: "Endomorph",
    description: "Big, high body fat, often pear-shaped, with a tendency to store body fat.",
    characteristics: ["Round physique", "Slow metabolism", "Stocky build"],
    color: "from-green-500/20 to-neonGreen/20",
    borderColor: "border-neonGreen/30"
  }
];

export const BodyTypeSection = () => {
  return (
    <section id="body-type" className="py-24 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 mb-6"
          >
            <UserCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest font-heading">Biological Profiling</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-heading tracking-tight text-white leading-tight">
            Discover Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan via-neonPurple to-neonGreen">Somatotype Profile</span>
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
            Our AI architecture identifies your specific body type to customize hormonal and mechanical tension parameters for your training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bodyTypes.map((body, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-[2rem] border ${body.borderColor} bg-gradient-to-br ${body.color} backdrop-blur-md relative group hover:scale-[1.02] transition-all duration-500`}
            >
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                <Info className="w-5 h-5 text-white" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-4 font-heading tracking-tight uppercase">{body.type}</h3>
              <p className="text-gray-300 text-sm font-light leading-relaxed mb-8">
                {body.description}
              </p>
              
              <div className="space-y-3">
                {body.characteristics.map((char, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{char}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                  className="h-full bg-gradient-to-r from-white/10 to-white/40"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 glass-premium rounded-[2rem] border border-white/5 text-center max-w-4xl mx-auto">
          <p className="text-gray-400 italic font-light italic">
            "Most individuals are a combination of two somatotypes. Our AI performs a 'Hybrid Analysis' to ensure your programming is precisely calibrated to your unique physiology."
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-neonCyan font-bold text-xs uppercase tracking-widest">— Fitness Wala AI Intelligence Unit</span>
          </div>
        </div>
      </div>
    </section>
  );
};
