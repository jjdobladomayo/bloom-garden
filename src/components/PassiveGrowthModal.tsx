'use client';

import { motion } from 'framer-motion';
import { PassiveElement } from '@/types/garden';

const EMOJIS: Record<string, string> = {
  leaf: '🍃',
  flower: '🌸',
  butterfly: '🦋',
  bird: '🐦',
  stone: '🪨',
  mushroom: '🍄',
  dewdrop: '💧',
};

const NAMES: Record<string, string> = {
  leaf: 'Una nueva hoja',
  flower: 'Una flor',
  butterfly: 'Una mariposa',
  bird: 'Un pájaro',
  stone: 'Una piedra',
  mushroom: 'Un hongo',
  dewdrop: 'Rocío',
};

interface Props {
  elements: PassiveElement[];
  hoursAway: number;
  onDismiss: () => void;
}

export default function PassiveGrowthModal({ elements, hoursAway, onDismiss }: Props) {
  const h = Math.round(hoursAway);
  const timeLabel =
    h < 1
      ? 'un momento'
      : h < 24
      ? `${h} ${h === 1 ? 'hora' : 'horas'}`
      : `${Math.round(h / 24)} ${Math.round(h / 24) === 1 ? 'día' : 'días'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%', transition: { duration: 0.2, ease: 'easeIn' } }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        className="w-full max-w-md bg-[#fdf9f5] rounded-t-3xl px-8 pt-6 pb-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-7" />

        {/* Heading */}
        <div className="text-center mb-2">
          <div className="text-3xl mb-3">🌿</div>
          <h2 className="text-xl font-light text-gray-700">
            Mientras estabas fuera…
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Tu jardín ha seguido creciendo durante {timeLabel}.
          </p>
        </div>

        {/* New elements */}
        <div className="flex justify-center gap-6 mt-7 mb-8">
          {elements.map((el, i) => (
            <motion.div
              key={el.id}
              initial={{ scale: 0, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.14, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="text-4xl">{EMOJIS[el.type] ?? '🌿'}</div>
              <span className="text-xs text-gray-400 text-center">
                {NAMES[el.type] ?? 'Algo nuevo'}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + elements.length * 0.14 }}
          onClick={onDismiss}
          className="w-full py-4 bg-[#7cb87a] text-white rounded-2xl text-base font-medium active:scale-95 transition-transform"
        >
          Ver mi jardín
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
