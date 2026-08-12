'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  const [phase, setPhase] = useState<'intro' | 'seed'>('intro');

  const handleStart = () => {
    setPhase('seed');
    setTimeout(onStart, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-8 text-center safe-top safe-bottom"
      style={{ background: 'linear-gradient(180deg, #f0f9f0 0%, #fdf9f5 60%)' }}
    >
      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
              className="mb-8"
            >
              <LogoMark />
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-thin tracking-[0.25em] text-gray-700 mb-3"
            >
              bloom
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="text-gray-400 text-sm tracking-wide leading-relaxed mb-1"
            >
              Dedica 5 segundos a ti.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-sm tracking-wide leading-relaxed mb-14"
            >
              Ve crecer algo bonito.
            </motion.p>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              onClick={handleStart}
              className="px-12 py-4 bg-[#7cb87a] text-white rounded-full text-base font-medium tracking-wider cta-pulse no-select active:scale-95 transition-transform"
            >
              Empezar
            </motion.button>

            {/* Fine print */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-10 text-xs text-gray-300 tracking-wide"
            >
              Sin registro · Sin anuncios · Solo tú y tu planta
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="seed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Animated seed emoji */}
            <motion.div
              animate={{
                rotate: [0, -8, 8, -4, 4, 0],
                y: [0, -6, 0],
              }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-7xl"
            >
              🌱
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-light text-gray-600"
            >
              Tu jardín comienza hoy.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LogoMark() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      {/* Subtle glow background */}
      <circle cx="44" cy="44" r="42" fill="rgba(124,184,122,0.08)" />
      {/* Soil */}
      <ellipse cx="44" cy="70" rx="22" ry="6" fill="#c4956a" opacity="0.3" />
      {/* Trunk */}
      <path d="M44 67 Q42 56 43 45 Q44 37 44 30" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
      {/* Crown */}
      <ellipse cx="44" cy="24" rx="20" ry="16" fill="#7cb87a" />
      <ellipse cx="44" cy="27" rx="16" ry="12" fill="#4a8c48" />
      <ellipse cx="41" cy="20" rx="10" ry="8" fill="#8dc88b" />
      {/* Flower */}
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={50 + 7 * Math.cos((a * Math.PI) / 180)}
          cy={20 + 7 * Math.sin((a * Math.PI) / 180)}
          rx="3.5"
          ry="2.5"
          fill="#fde8b0"
        />
      ))}
      <circle cx="50" cy="20" r="4" fill="#f5a623" />
    </svg>
  );
}
