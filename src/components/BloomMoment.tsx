'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PlantDisplay from './PlantDisplay';
import { GrowthStage } from '@/types/garden';

// Very short, breath-like phrases — different register from garden messages
const MOMENT_MESSAGES = [
  'Algo está creciendo.',
  'El jardín está en calma.',
  'Las raíces siguen trabajando.',
  'Tu planta lo ha notado.',
  'Despacio, pero seguro.',
  'Todo suma.',
  'Crece sin prisa.',
  'Un poco más de vida.',
  'El jardín late.',
  'Cada gota cuenta.',
  'Un segundo de tierra.',
  'Silencio y raíces.',
  'Algo se mueve debajo.',
  'El jardín respira.',
];

const DURATION_MS = 2700;

interface Props {
  stage: GrowthStage;
  onComplete: () => void;
}

export default function BloomMoment({ stage, onComplete }: Props) {
  // Always call the latest onComplete even if it changes during the 2.7s
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Pick message once at mount — 65% show, 35% pure silence
  const message = useRef(
    Math.random() < 0.65
      ? MOMENT_MESSAGES[Math.floor(Math.random() * MOMENT_MESSAGES.length)]
      : null
  ).current;

  useEffect(() => {
    const t = setTimeout(() => onCompleteRef.current(), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center min-h-screen bg-[#fdf9f5] safe-top safe-bottom"
    >
      {/* Plant — gentle breathing scale + float */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], y: [0, -7, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PlantDisplay stage={stage} size={210} />
      </motion.div>

      {/* Water ripple rings radiating from the base */}
      <div className="relative flex items-center justify-center -mt-1 mb-2" style={{ width: 160, height: 20 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 44, height: 10, border: '1px solid rgba(124,184,122,0.4)' }}
            animate={{ scale: [1, 4.2], opacity: [0.45, 0] }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              delay: i * 0.68,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Optional calm phrase */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.0, ease: 'easeInOut' }}
          className="mt-8 text-xs font-light tracking-widest text-gray-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}
