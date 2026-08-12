'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Drop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  opacity: number;
  w: number;
  h: number;
}

export default function RainEffect() {
  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.8,
        duration: 0.7 + Math.random() * 0.7,
        opacity: 0.25 + Math.random() * 0.45,
        w: 1 + Math.random() * 1.5,
        h: 7 + Math.random() * 10,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Subtle blue tint overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            'linear-gradient(180deg, rgba(135,206,235,0.08) 0%, transparent 60%)',
        }}
      />

      {drops.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: 0,
            width: d.w,
            height: d.h,
            background: `rgba(148, 198, 236, ${d.opacity})`,
            rotate: '12deg',
          }}
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: '110vh',
            opacity: [0, d.opacity, d.opacity, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Splash particles near bottom */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`splash-${i}`}
          className="absolute bottom-1/3 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            width: 3,
            height: 3,
            background: 'rgba(148, 198, 236, 0.6)',
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.18 + 0.3,
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        />
      ))}
    </div>
  );
}
