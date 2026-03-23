import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Target, Clock, BarChart3, Play } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { useCardTilt } from '../../hooks/useCardTilt';

const difficultyConfig = {
  Beginner:     { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', dots: 1 },
  Intermediate: { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   dots: 2 },
  Advanced:     { color: 'text-red-400',      bg: 'bg-red-400/10',     border: 'border-red-400/30',     dots: 3 },
};

// Fallback colours if image doesn't load
const FALLBACK_GRADIENTS = [
  'from-neonCyan/20 to-blue-900/40',
  'from-neonPurple/20 to-indigo-900/40',
  'from-neonGreen/20 to-emerald-900/40',
  'from-amber-500/20 to-orange-900/40',
];

export const ExerciseCard = ({ exercise, isExpanded, onClick, index = 0, isAiRecommended }) => {
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const diff = difficultyConfig[exercise.difficulty] || difficultyConfig.Beginner;
  const fallback = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const { ref: tiltRef, handlers: tiltHandlers } = useCardTilt({ max: 8, scale: 1.02 });

  const thumbnailSrc = exercise.thumbnail || exercise.gifUrl;

  return (
    <>
      <motion.div
        ref={tiltRef}
        {...tiltHandlers}
        layout
        onClick={onClick}
        className={`exercise-card opacity-0 translate-y-8 tilt-card group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
          isExpanded
            ? 'border-neonCyan/40 shadow-[0_0_40px_rgba(0,224,255,0.1)] z-30'
            : 'border-white/8 hover:border-neonCyan/30 hover:z-20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,224,255,0.08)]'
        }`}
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', transformOrigin: 'center center' }}
        data-cursor="hover"
      >
        {/* ── Thumbnail / GIF Preview ───────────────────────────── */}
        <div className={`relative overflow-hidden bg-black transition-all duration-500 ${isExpanded ? 'h-56' : 'h-44'}`}>
          {/* Gradient overlay always present */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

          {/* Image / fallback gradient */}
          {!imgError && thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={exercise.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            // Stylised gradient fallback — never shows "content unavailable"
            <div className={`w-full h-full bg-gradient-to-br ${fallback} flex items-center justify-center`}>
              <div className="text-6xl opacity-30 select-none">💪</div>
            </div>
          )}

          {/* Muscle group badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-neonCyan text-[9px] rounded-lg font-bold border border-neonCyan/25 uppercase tracking-widest">
              {exercise.muscle}
            </span>
          </div>

          {/* Watch Demo button — stop propagation so it doesn't expand the card */}
          {exercise.youtubeId && (
            <button
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
              className="play-btn-pulse absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-red-600/80 hover:bg-red-600 rounded-lg text-white text-[9px] font-bold uppercase tracking-widest transition-all border border-red-400/40 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
            >
              <Play className="w-2.5 h-2.5 fill-white" />
              Watch
            </button>
          )}

          {/* Expand indicator / AI Badge */}
          {isAiRecommended ? (
            <div className="absolute top-3 right-[85px] z-20 flex items-center gap-1.5 px-2.5 py-1 bg-neonGreen/20 backdrop-blur-md rounded-lg text-neonGreen text-[9px] font-bold uppercase tracking-widest border border-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <Zap className="w-2.5 h-2.5 fill-neonGreen" />
              AI Match
            </div>
          ) : (
            <motion.div
              className={`absolute top-3 right-${exercise.youtubeId ? '[85px]' : '3'} z-20 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center`}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}

          {/* Exercise name overlaid on thumbnail */}
          <div className="absolute bottom-3 left-3 right-3 z-20">
            <h3 className="text-white font-bold font-heading uppercase tracking-wide text-base leading-tight group-hover:text-neonCyan transition-colors truncate">
              {exercise.name}
            </h3>
          </div>
        </div>

        {/* ── Card Body ─────────────────────────────────────────── */}
        <div className="p-4">
          {/* Difficulty + Duration */}
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${diff.color} ${diff.bg} ${diff.border}`}>
              <span className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`w-1 h-2.5 rounded-full ${i < diff.dots ? diff.color.replace('text-', 'bg-') : 'bg-white/15'}`} />
                ))}
              </span>
              {exercise.difficulty}
            </span>
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-widest font-medium">
              <Clock className="w-3 h-3" />
              <span>{exercise.duration}</span>
            </div>
          </div>

          {/* Stats mini-grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: 'Sets', value: exercise.sets },
              { icon: <Target className="w-3.5 h-3.5" />, label: 'Reps', value: exercise.reps },
              { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'Cal', value: exercise.calories },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-black/40 border border-white/6 rounded-xl p-2.5 flex flex-col items-center gap-0.5 group-hover:border-neonCyan/15 transition-colors"
              >
                <span className="text-gray-500 group-hover:text-neonCyan/60 transition-colors">{icon}</span>
                <span className="text-white font-black text-sm font-heading">{value}</span>
                <span className="text-gray-600 text-[9px] uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Expanded Details ──────────────────────────────────── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 border-t border-white/8 pt-4 space-y-4">
                <p className="text-gray-400 text-sm font-light leading-relaxed">{exercise.description}</p>

                <div className="space-y-2">
                  <p className="text-xs text-neonCyan font-bold uppercase tracking-widest mb-2">Pro Tips</p>
                  {exercise.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neonCyan mt-1.5 shrink-0" />
                      <span className="text-gray-400 text-sm font-light">{tip}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-neonCyan/5 border border-neonCyan/20 rounded-xl p-3">
                    <p className="text-neonCyan text-[9px] font-bold uppercase tracking-widest mb-0.5">Time Under Tension</p>
                    <p className="text-white font-black text-sm">{exercise.tut}</p>
                  </div>
                  <div className="bg-neonPurple/5 border border-neonPurple/20 rounded-xl p-3">
                    <p className="text-neonPurple text-[9px] font-bold uppercase tracking-widest mb-0.5">RPE Target</p>
                    <p className="text-white font-black text-sm">{exercise.rpe} / 10</p>
                  </div>
                </div>

                {/* Watch Demo CTA at bottom of expanded */}
                {exercise.youtubeId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-red-300 text-sm font-bold uppercase tracking-widest transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Watch Demo on YouTube
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* YouTube Modal */}
      {modalOpen && (
        <VideoModal exercise={exercise} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
