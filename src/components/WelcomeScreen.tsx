'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onStart: (name: string) => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  const [phase, setPhase]         = useState<'intro' | 'seed'>('intro');
  const [plantName, setPlantName] = useState('');

  const trimmed   = plantName.trim();
  const hasName   = trimmed.length > 0;
  const btnLabel  = hasName ? `Plantar a ${trimmed}` : 'Plantar mi primera semilla';
  const seedLabel = hasName ? `${trimmed} comienza a crecer.` : 'Tu jardín comienza hoy.';

  const handleStart = () => {
    setPhase('seed');
    setTimeout(() => onStart(trimmed), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-8 text-center safe-top safe-bottom"
      style={{ background: '#fdf9f5' }}
    >
      <AnimatePresence mode="wait">

        {/* ── Intro phase ─────────────────────────────────────── */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ exit: { duration: 0.3 } }}
            className="flex flex-col items-center"
          >
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
              className="mb-7"
            >
              <LogoMark />
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-5xl font-thin tracking-[0.28em] mb-10"
              style={{ color: '#7cb87a' }}
            >
              bloom
            </motion.h1>

            {/* Copy — three lines revealed sequentially */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm font-light tracking-wide leading-loose mb-1"
              style={{ color: '#9ca3af' }}
            >
              Hay cosas que crecen despacio.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="text-sm font-light tracking-wide leading-loose mb-0.5"
              style={{ color: '#9ca3af' }}
            >
              Un jardín que no te pide nada.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="text-sm font-light tracking-wide leading-loose mb-10"
              style={{ color: '#c4b5a8' }}
            >
              Solo que vuelvas.
            </motion.p>

            {/* Plant name input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mb-8 flex flex-col items-center gap-1"
            >
              <input
                type="text"
                value={plantName}
                onChange={e => setPlantName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
                placeholder="¿Cómo se llamará?"
                maxLength={20}
                className="text-center font-light text-sm tracking-wide outline-none bg-transparent placeholder:text-gray-300"
                style={{
                  borderBottom: '1px solid rgba(196,149,106,0.30)',
                  padding: '6px 8px',
                  width: '190px',
                  color: '#6b7280',
                }}
              />
              <span className="text-xs" style={{ color: '#d1c8bc' }}>
                opcional
              </span>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={handleStart}
              className="px-10 py-4 text-white rounded-2xl text-sm font-medium tracking-wide cta-pulse no-select active:scale-95 transition-all duration-300"
              style={{ backgroundColor: '#7cb87a', minWidth: 220 }}
            >
              {btnLabel}
            </motion.button>

            {/* Fine print */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
              className="mt-8 text-xs tracking-wide"
              style={{ color: '#d1c8bc' }}
            >
              Sin registro · Sin anuncios · Solo tú y tu planta
            </motion.p>

            {/* Novedades link */}
            <motion.a
              href="/novedades"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
              className="mt-4 text-xs tracking-widest no-underline active:opacity-50 transition-opacity"
              style={{ color: '#c4b5a8', textDecoration: 'none' }}
            >
              novedades →
            </motion.a>
          </motion.div>
        )}

        {/* ── Seed phase ──────────────────────────────────────── */}
        {phase === 'seed' && (
          <motion.div
            key="seed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="flex flex-col items-center gap-5"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0], y: [0, -6, 0] }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-7xl"
            >
              🌱
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg font-light"
              style={{ color: '#6b7280' }}
            >
              {seedLabel}
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

// ── Logo mark SVG ────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <svg width="72" height="72" viewBox="0 0 88 88" fill="none">
      <circle cx="44" cy="44" r="42" fill="rgba(124,184,122,0.07)" />
      <ellipse cx="44" cy="70" rx="22" ry="6" fill="#c4956a" opacity="0.28" />
      <path d="M44 67 Q42 56 43 45 Q44 37 44 30" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="44" cy="24" rx="20" ry="16" fill="#7cb87a" />
      <ellipse cx="44" cy="27" rx="16" ry="12" fill="#4a8c48" />
      <ellipse cx="41" cy="20" rx="10" ry="8" fill="#8dc88b" />
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
