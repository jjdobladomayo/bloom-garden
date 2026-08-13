'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Season } from '@/hooks/useSeasonOfYear';
import { TimeOfDay } from '@/hooks/useTimeOfDay';

// ── Autumn leaves ──────────────────────────────────────────────────────────────

function AutumnLeaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        emoji: i % 3 === 0 ? '🍁' : '🍂',
        startX:   (i * 31.7 + 5) % 90,
        sway:     (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 12),
        rotation: (i % 2 === 0 ? 1 : -1) * (180 + (i % 2) * 120),
        duration: 9 + (i % 4) * 2.5,
        delay:    (i * 1.9) % 8,
        size:     i % 2 === 0 ? '1rem' : '0.875rem',
      })),
    []
  );

  return (
    <>
      {leaves.map(l => (
        <motion.div
          key={l.id}
          className="absolute select-none pointer-events-none"
          style={{ left: `${l.startX}%`, top: 0, fontSize: l.size }}
          animate={{
            y:       ['0vh', '108vh'],
            x:       [0, l.sway],
            rotate:  [0, l.rotation],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: l.duration,
            repeat:   Infinity,
            delay:    l.delay,
            ease:     'linear',
            opacity:  { times: [0, 0.08, 0.92, 1], ease: 'linear' },
          }}
        >
          {l.emoji}
        </motion.div>
      ))}
    </>
  );
}

// ── Winter snowflakes ──────────────────────────────────────────────────────────

function WinterSnow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id:       i,
        startX:   (i * 37.3 + 3)  % 97,
        sway:     (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5),
        size:     2 + (i % 3),
        maxOpacity: 0.40 + (i % 3) * 0.15,
        duration: 7  + (i % 5) * 1.8,
        delay:    (i * 0.8) % 9,
      })),
    []
  );

  return (
    <>
      {flakes.map(f => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${f.startX}%`, top: 0, width: f.size, height: f.size }}
          animate={{
            y:       ['0vh', '105vh'],
            x:       [0, f.sway],
            opacity: [0, f.maxOpacity, f.maxOpacity, 0],
          }}
          transition={{
            duration: f.duration,
            repeat:   Infinity,
            delay:    f.delay,
            ease:     'linear',
            opacity:  { times: [0, 0.05, 0.95, 1], ease: 'linear' },
          }}
        />
      ))}
    </>
  );
}

// ── Spring petals ──────────────────────────────────────────────────────────────

function SpringPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id:       i,
        startX:   (i * 43.1 + 8) % 88,
        sway:     (i % 2 === 0 ? 1 : -1) * (25 + (i % 3) * 15),
        duration: 12 + (i % 3) * 3,
        delay:    (i * 2.3) % 10,
      })),
    []
  );

  return (
    <>
      {petals.map(p => (
        <motion.div
          key={p.id}
          className="absolute text-sm select-none pointer-events-none"
          style={{ left: `${p.startX}%`, top: 0 }}
          animate={{
            y:       ['0vh', '108vh'],
            x:       [0, p.sway, p.sway * 0.6],
            rotate:  [0, 180, 360],
            opacity: [0, 0.80, 0.80, 0],
          }}
          transition={{
            duration: p.duration,
            repeat:   Infinity,
            delay:    p.delay,
            ease:     'linear',
            opacity:  { times: [0, 0.07, 0.93, 1], ease: 'linear' },
          }}
        >
          🌸
        </motion.div>
      ))}
    </>
  );
}

// ── Summer: daytime seeds / golden motes ──────────────────────────────────────

function SummerMotes() {
  const motes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id:       i,
        startX:   10 + (i * 41.7) % 78,
        startY:   35 + (i * 23.1) % 45, // mid-screen float zone
        driftX:   (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 7),
        driftY:   -(18 + (i % 3) * 14),  // float upward
        size:     2 + (i % 2),
        duration: 8 + (i % 4) * 2,
        delay:    (i * 1.1) % 7,
      })),
    []
  );

  return (
    <>
      {motes.map(m => (
        <motion.div
          key={m.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:            `${m.startX}%`,
            top:             `${m.startY}%`,
            width:           m.size,
            height:          m.size,
            backgroundColor: 'rgba(255,210,80,0.65)',
          }}
          animate={{
            x:       [0, m.driftX],
            y:       [0, m.driftY],
            opacity: [0, 0.55, 0.55, 0],
          }}
          transition={{
            duration: m.duration,
            repeat:   Infinity,
            delay:    m.delay,
            ease:     'easeInOut',
            opacity:  { times: [0, 0.15, 0.85, 1], ease: 'linear' },
          }}
        />
      ))}
    </>
  );
}

// ── Summer: night fireflies ────────────────────────────────────────────────────

function SummerFireflies() {
  const flies = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id:           i,
        x:            5  + (i * 43.7) % 85,
        y:            15 + (i * 31.3) % 65,
        blinkDur:     1.4 + (i % 4) * 0.6,
        blinkDelay:   (i * 0.38) % 3.5,
        driftX:       (i % 2 === 0 ? 1 : -1) * (5 + (i % 3) * 4),
        driftY:       (i % 2 === 0 ? 1 : -1) * (3 + (i % 3) * 3),
        driftDur:     4  + (i % 3) * 2.5,
      })),
    []
  );

  return (
    <>
      {flies.map(f => (
        <motion.div
          key={f.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:            `${f.x}%`,
            top:             `${f.y}%`,
            width:           3,
            height:          3,
            backgroundColor: 'rgba(180,230,60,0.9)',
            boxShadow:       '0 0 5px 2px rgba(180,230,60,0.35)',
          }}
          animate={{
            opacity: [0, 0.9, 0, 0.7, 0],
            x:       [0, f.driftX,  0, -f.driftX,  0],
            y:       [0, f.driftY,  f.driftY * 1.8, f.driftY, 0],
          }}
          transition={{
            opacity: { duration: f.blinkDur,  repeat: Infinity, delay: f.blinkDelay, ease: 'easeInOut' },
            x:       { duration: f.driftDur,  repeat: Infinity, ease: 'easeInOut' },
            y:       { duration: f.driftDur * 0.8, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </>
  );
}

// ── Exported component ─────────────────────────────────────────────────────────

interface Props {
  season:    Season;
  timeOfDay: TimeOfDay;
}

export default function SeasonalElements({ season, timeOfDay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {season === 'autumn' && <AutumnLeaves />}
      {season === 'winter' && <WinterSnow />}
      {season === 'spring' && <SpringPetals />}
      {season === 'summer' && timeOfDay === 'night' && <SummerFireflies />}
      {season === 'summer' && timeOfDay !== 'night' && <SummerMotes />}
    </motion.div>
  );
}
