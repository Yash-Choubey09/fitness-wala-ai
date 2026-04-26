import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Lightbulb } from 'lucide-react';
import { useEffect } from 'react';

const getYouTubeId = (exercise) => {
  if (exercise.youtubeId) return exercise.youtubeId;
  if (!exercise.videoUrl) return '';
  const match = exercise.videoUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || '';
};

export const VideoModal = ({ exercise, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!exercise) return null;

  const difficultyColor = {
    beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
  }[(exercise.level || 'beginner').toLowerCase()] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  const youtubeId = getYouTubeId(exercise);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
          style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${exercise.title} Demo`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-t-2xl"
              style={{ border: 'none' }}
            />
          </div>

          {/* Info Panel */}
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-start gap-3 justify-between">
              <div>
                <h2 className="text-2xl font-black text-white font-heading uppercase tracking-wide">{exercise.title}</h2>
                <p className="text-neonCyan text-sm mt-0.5 font-medium">{exercise.musclesTargeted}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border ${difficultyColor}`}>
                {exercise.level}
              </span>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Sets', value: exercise.sets },
                { label: 'Reps', value: exercise.reps },
                { label: 'Calories', value: exercise.caloriesBurned },
                { label: 'Equipment', value: exercise.equipment },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl border border-white/6 bg-white/3 text-center">
                  <p className="text-white font-black text-sm font-heading">{value}</p>
                  <p className="text-gray-600 text-[9px] uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-neonCyan" />
                <p className="text-xs text-neonCyan font-bold uppercase tracking-widest">About This Exercise</p>
              </div>
              <p className="text-gray-300 text-sm font-light leading-relaxed">{exercise.description}</p>
            </div>

            {/* Muscles Worked */}
            <div className="p-4 rounded-xl border border-neonCyan/15 bg-neonCyan/5">
              <p className="text-neonCyan text-xs font-bold uppercase tracking-widest mb-2">Muscles Worked</p>
              <p className="text-white font-semibold text-sm">{exercise.musclesTargeted}</p>
              <p className="text-gray-500 text-xs mt-1">
                Primary: {exercise.musclesTargeted} &nbsp;·&nbsp; Secondary: Core / Stabilizers
              </p>
            </div>

            {/* Tips */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">Pro Tips for Beginners</p>
              </div>
              <div className="space-y-2">
                {(exercise.tips || []).map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400 text-[10px] font-black mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm font-light leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/8">
              <div className="p-3 rounded-xl border border-neonCyan/15 bg-neonCyan/5 text-center">
                <p className="text-neonCyan text-[9px] font-bold uppercase tracking-widest mb-1">Time Under Tension</p>
                <p className="text-white font-black text-sm">{exercise.tut}</p>
              </div>
              <div className="p-3 rounded-xl border border-neonPurple/15 bg-neonPurple/5 text-center">
                <p className="text-neonPurple text-[9px] font-bold uppercase tracking-widest mb-1">RPE Target</p>
                <p className="text-white font-black text-sm">{exercise.rpe} / 10</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
