'use client';

import { motion } from 'framer-motion';
import { GardenState, STAGE_LABELS } from '@/types/garden';
import PlantDisplay from './PlantDisplay';

interface Props {
  garden: GardenState;
  prevStage: string | null;
  onContinue: () => void;
}

export default function GrowthScreen({ garden, prevStage, onContinue }: Props) {
  const didLevelUp = prevStage !== null && prevStage !== garden.stage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-between min-h-screen px-6 py-16 text-center safe-top safe-bottom"
      style={{ background: 'linear-gradient(180deg, #f0f9f0 0%, #fdf9f5 50%)' }}
    >
      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xs uppercase tracking-widest text-gray-400"
      >
        {STAGE_LABELS[garden.stage]}
      </motion.div>

      {/* Plant — central hero */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 90, damping: 14 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="plant-float">
          <PlantDisplay stage={garden.stage} size={240} />
        </div>

        {/* Confetti dots */}
        {didLevelUp &&
          Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 360;
            const dist = 90 + Math.random() * 50;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 6 + Math.random() * 5,
                  height: 6 + Math.random() * 5,
                  background: ['#7cb87a', '#f5a623', '#fde8b0', '#4a8c48', '#ffd1dc'][i % 5],
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: dist * Math.cos((angle * Math.PI) / 180),
                  y: dist * Math.sin((angle * Math.PI) / 180),
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 0.8],
                }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.9, ease: 'easeOut' }}
              />
            );
          })}
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col items-center gap-3"
      >
        <h2 className="text-2xl font-light text-gray-700">
          {didLevelUp ? '¡Tu planta ha crecido!' : 'Tu planta ha bebido.'}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
          {didLevelUp
            ? `Ha pasado a ser ${STAGE_LABELS[garden.stage].toLowerCase()}. Sigue regando cada día.`
            : 'Cada gota importa. Vuelve mañana para seguir creciendo.'}
        </p>

        {/* Streak badge */}
        {garden.streakDays > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 200 }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-2 mt-1"
          >
            <span className="text-lg">🔥</span>
            <span className="text-sm text-amber-700 font-medium">
              {garden.streakDays} días seguidos
            </span>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          onClick={onContinue}
          className="mt-6 px-10 py-4 bg-[#7cb87a] text-white rounded-full text-base font-medium active:scale-95 transition-transform no-select"
        >
          Ver mi jardín
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
