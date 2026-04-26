import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Target, Clock, BarChart3, Play } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { useCardTilt } from '../../hooks/useCardTilt';

const difficultyConfig = {
  beginner:     { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', dots: 1, label: 'Beginner' },
  intermediate: { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   dots: 2, label: 'Intermediate' },
  advanced:     { color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30',     dots: 3, label: 'Advanced' },
};

// Fallback colours if image doesn't load
const FALLBACK_GRADIENTS = [
  'from-neonCyan/20 to-blue-900/40',
  'from-neonPurple/20 to-indigo-900/40',
  'from-neonGreen/20 to-emerald-900/40',
  'from-amber-500/20 to-orange-900/40',
];

const getYouTubeId = (exercise) => {
  if (exercise.youtubeId) return exercise.youtubeId;
  if (!exercise.videoUrl) return '';
  const match = exercise.videoUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || '';
};

export const ExerciseCard = ({ exercise, isExpanded, onClick, index = 0, isAiRecommended }) => {
  const [imgError, setImgError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(exercise.thumbnail);
  const [modalOpen, setModalOpen] = useState(false);
  const diff = difficultyConfig[(exercise.level || 'beginner').toLowerCase()] || difficultyConfig.beginner;
  const fallback = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const { ref: tiltRef, handlers: tiltHandlers } = useCardTilt({ max: 8, scale: 1.02 });

  const youtubeId = getYouTubeId(exercise);

  const handleThumbnailError = () => {
    if (thumbnailUrl === exercise.thumbnail && exercise.thumbnailFallback) {
      setThumbnailUrl(exercise.thumbnailFallback);
    } else {
      setImgError(true);
    }
  };

  return (
    <>
      <motion.div
        ref={tiltRef}
        {...tiltHandlers}
        layout
        onClick={onClick}
        className={`exercise-card tilt-card workout-card group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
          isExpanded
            ? 'border-neonCyan/40 shadow-[0_0_40px_rgba(0,224,255,0.1)] z-30'
            : 'border-white/8 hover:border-neonCyan/30 hover:z-20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,224,255,0.08)]'
        }`}
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', transformOrigin: 'center center' }}
        data-cursor="hover"
      >
        {/* ── Thumbnail / GIF Preview ───────────────────────────── */}
        <div className={`relative overflow-hidden bg-black transition-all duration-500 ${isExpanded ? 'h-56' : 'h-48'}`}>
          {/* Gradient overlay always present */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />

          {/* Image / fallback gradient */}
          {!imgError && thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={exercise.title}
              onError={handleThumbnailError}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
            />
          ) : (
            // Stylised gradient fallback
            <div className={`w-full h-full bg-gradient-to-br ${fallback} flex items-center justify-center`}>
              <div className="text-6xl opacity-30 select-none animate-pulse">💪</div>
            </div>
          )}

          {/* Muscle group badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-neonCyan text-[10px] rounded-lg font-black border border-neonCyan/30 uppercase tracking-widest shadow-lg">
              {exercise.musclesTargeted}
            </span>
          </div>

          {/* Watch Demo button — stop propagation so it doesn't expand the card */}
          {youtubeId && (
            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                setModalOpen(true); 
              }}
              className="play-btn-pulse absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-all border border-red-400/40 shadow-[0_0_20px_rgba(255,0,0,0.4)] active:scale-90"
            >
              <Play className="w-3 h-3 fill-white" />
              Watch
            </button>
          )}

          {/* AI Badge fallback if not watching */}
          {isAiRecommended && !youtubeId && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-neonGreen/20 backdrop-blur-md rounded-lg text-neonGreen text-[9px] font-bold uppercase tracking-widest border border-neonGreen/30">
              <Zap className="w-2.5 h-2.5 fill-neonGreen" />
              AI
            </div>
          )}

          {/* Exercise name overlaid on thumbnail with backdrop blur for legibility */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <h3 className="text-white font-black font-heading uppercase tracking-widest text-lg leading-tight group-hover:text-neonCyan group-hover:text-glow-cyan transition-all duration-500">
              {exercise.title || exercise.name || 'Strength Exercise'}
            </h3>
            <p className="text-white/40 text-[10px] uppercase tracking-tighter mt-1 font-medium">
              {exercise.equipment || 'No Equipment'} · {exercise.intensity || 'Medium'} Intensity
            </p>
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
              {diff.label}
            </span>
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-widest font-medium">
              <Clock className="w-3 h-3" />
              <span>{exercise.duration}</span>
            </div>
          </div>

          {/* Stats mini-grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: 'Sets', value: exercise.sets || '3' },
              { icon: <Target className="w-3.5 h-3.5" />, label: 'Reps', value: exercise.reps || '12' },
              { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'Cal', value: exercise.caloriesBurned || exercise.calories || '~50 kcal' },
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
                  {(exercise.tips || []).map((tip, i) => (
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
                {youtubeId && (
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
