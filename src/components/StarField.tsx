'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function StarField() {
  // Positions derived deterministically from index — stable across renders, no hydration mismatch
  const stars = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x:  (i * 73.1 + 17.3) % 100,
        y:  (i * 47.7 +  5.1) % 52,   // top 52% of screen
        size: 1 + (i % 3),             // 1–3 px
        delay:    (i * 0.37) % 4.5,
        duration: 2.2 + (i % 3) * 0.9,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.85, 0.15] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}
