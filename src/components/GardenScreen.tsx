'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GardenState, STAGE_LABELS, PassiveElement } from '@/types/garden';
import PlantDisplay from './PlantDisplay';
import { formatLastWatered, wateringsUntilNextStage, getStageProgress } from '@/utils/garden';
import { useBloomMessage } from '@/hooks/useBloomMessage';

interface Props {
  garden: GardenState;
  onWater: () => void;
  onOpenRename: () => void;
  hoursAway: number;
}

const PASSIVE_EMOJIS: Record<string, string> = {
  leaf: '🍃',
  flower: '🌸',
  butterfly: '🦋',
  bird: '🐦',
  stone: '🪨',
  mushroom: '🍄',
  dewdrop: '💧',
};

export default function GardenScreen({ garden, onWater, onOpenRename, hoursAway }: Props) {
  const lastText = formatLastWatered(garden.lastWatered);
  const toNext = wateringsUntilNextStage(garden);
  const stageProgress = getStageProgress(garden);
  const isMaxStage = toNext === null;
  const isDefaultName = garden.plantName === 'Mi planta';
  const bloomMessage = useBloomMessage(garden, hoursAway);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#fdf9f5] safe-top safe-bottom"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-14 pb-2">
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-thin tracking-[0.2em] text-gray-600"
        >
          bloom
        </motion.span>

        {/* Plant name — tappable, opens rename modal via page.tsx */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onOpenRename}
          className="flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span
            className={`text-sm tracking-wide transition-colors ${
              isDefaultName
                ? 'text-[#7cb87a] underline underline-offset-2 decoration-dotted'
                : 'text-gray-500'
            }`}
          >
            {garden.plantName}
          </span>
          <motion.span
            className="text-gray-300 text-xs leading-none"
            animate={isDefaultName ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.5 }}
            transition={isDefaultName ? { repeat: Infinity, duration: 2 } : {}}
          >
            ✎
          </motion.span>
        </motion.button>
      </div>

      {/* ── Garden scene ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 relative">
        <div
          className="absolute inset-x-4 top-0 bottom-1/4 rounded-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(232,245,233,0.8) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex items-end justify-center" style={{ minHeight: 260 }}>
          <AnimatePresence>
            {garden.passiveElements.slice(-5).map((el) => (
              <PassiveElementDot key={el.id} element={el} />
            ))}
          </AnimatePresence>

          <div className="plant-float z-10">
            <PlantDisplay stage={garden.stage} size={220} />
          </div>
        </div>

        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#c4956a] to-transparent opacity-20 mt-1" />

        {/* ── Stage info ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col items-center gap-3 w-full max-w-xs"
        >
          <div className="text-xs uppercase tracking-widest text-gray-400">
            {STAGE_LABELS[garden.stage]}
          </div>

          {!isMaxStage && (
            <div className="w-full bg-[#e0d5c5] rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#7cb87a]"
                initial={{ width: 0 }}
                animate={{ width: `${stageProgress * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          )}

          <div className="flex items-center gap-5">
            {garden.streakDays > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>🔥</span>
                <span>{garden.streakDays} {garden.streakDays === 1 ? 'día' : 'días'}</span>
              </div>
            )}
            {garden.lastWatered && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>💧</span>
                <span>{lastText}</span>
              </div>
            )}
            {isMaxStage && (
              <div className="flex items-center gap-1 text-xs text-[#7cb87a]">
                <span>✨</span>
                <span>Árbol completo</span>
              </div>
            )}
          </div>

          {toNext !== null && toNext <= 3 && toNext > 0 && (
            <p className="text-xs text-gray-300">
              {toNext === 1 ? '1 riego más' : `${toNext} riegos más`} para crecer
            </p>
          )}
        </motion.div>

        {/* ── Bloom message ────────────────────────────────── */}
        <AnimatePresence>
          {bloomMessage && (
            <motion.p
              key={bloomMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.0, ease: 'easeInOut' }}
              className="text-xs font-light tracking-wide text-gray-400 text-center px-8 mt-1"
            >
              {bloomMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <div className="px-6 pt-2 pb-10">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onWater}
          className="w-full py-5 bg-[#7cb87a] text-white rounded-2xl text-base font-medium tracking-wide cta-pulse no-select active:scale-95 transition-transform"
        >
          Regar ahora
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-gray-300 mt-3"
        >
          {garden.wateringCount === 0
            ? 'Primera gota de agua'
            : `${garden.wateringCount} ${garden.wateringCount === 1 ? 'riego' : 'riegos'} en total`}
        </motion.p>
      </div>
    </motion.div>
  );
}

function PassiveElementDot({ element }: { element: PassiveElement }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 150 }}
      className="absolute text-xl pointer-events-none"
      style={{
        left: `${element.position.x}%`,
        bottom: `${100 - element.position.y}%`,
        transform: 'translate(-50%, 50%)',
        zIndex: element.type === 'bird' || element.type === 'butterfly' ? 20 : 5,
      }}
    >
      {PASSIVE_EMOJIS[element.type] ?? '🌿'}
    </motion.div>
  );
}
