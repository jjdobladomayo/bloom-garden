'use client';

import { motion, AnimatePresence } from 'framer-motion';
import PlantDisplay from './PlantDisplay';
import { GrowthStage, TreeMaturity } from '@/types/garden';
import { useTimeOfDay, TimeOfDay } from '@/hooks/useTimeOfDay';

// ── Background palette (mirrors GardenScreen) ──────────────────────────────

const BG: Record<TimeOfDay, string> = {
  dawn:      '#f5eef8',
  morning:   '#eff9f4',
  afternoon: '#fdf9f5',
  evening:   '#fef3e6',
  night:     '#141e2e',
};

const GROUND_COLOR: Record<TimeOfDay, string> = {
  dawn:      '#e8dced',
  morning:   '#d4ecd8',
  afternoon: '#e0d5c5',
  evening:   '#e8d4b4',
  night:     '#0d1520',
};

const IS_DARK: Record<TimeOfDay, boolean> = {
  dawn: false, morning: false, afternoon: false, evening: false, night: true,
};

// ── Creature type ──────────────────────────────────────────────────────────

interface Creature {
  id: string;
  emoji: string;
  left: string;   // % of overlay width
  top: string;    // % of overlay height
  animY?: number; // vertical bob amplitude px
  animX?: number; // horizontal wobble amplitude px
  delay: number;
  duration: number;
  size?: string;  // css font-size
}

// Creature positions are calibrated for a 300px plant on a 390×844 viewport.
// Plant bottom at ~82% from top, plant top at ~46% from top.
// SVG viewBox is 280×280.
// x_screen% = (45 + svg_x * 300/280) / 390 * 100
// y_screen% = (388 + svg_y * 300/280) / 844 * 100

function getCreatures(
  stage: GrowthStage,
  maturity: TreeMaturity,
  isNight: boolean,
  isEvening: boolean,
): Creature[] {
  const isDay = !isNight && !isEvening;
  const cs: Creature[] = [];

  // ── Seed ──────────────────────────────────────────────────────────────────
  if (stage === 'seed') {
    cs.push({ id: 'worm', emoji: '🐛', left: '50%', top: '82%', animY: 2, delay: 0.5, duration: 4 });
  }

  // ── Sprout ────────────────────────────────────────────────────────────────
  if (stage === 'sprout') {
    cs.push({ id: 'worm',  emoji: '🐛', left: '52%', top: '82%', animY: 2, delay: 0.5, duration: 4 });
    cs.push({ id: 'ant1',  emoji: '🐜', left: '46%', top: '74%', animY: 1, delay: 0.9, duration: 2.8, size: '0.85rem' });
  }

  // ── Small ─────────────────────────────────────────────────────────────────
  if (stage === 'small') {
    cs.push({ id: 'ant1',    emoji: '🐜', left: '45%', top: '73%', animY: 1, delay: 0.7, duration: 2.5, size: '0.85rem' });
    cs.push({ id: 'ant2',    emoji: '🐜', left: '55%', top: '70%', animY: 1, delay: 1.1, duration: 2.8, size: '0.8rem' });
    cs.push({ id: 'ladybug', emoji: '🐞', left: '60%', top: '64%', animY: 3, delay: 1.3, duration: 3.5 });
  }

  // ── Medium ────────────────────────────────────────────────────────────────
  if (stage === 'medium') {
    cs.push({ id: 'caterpillar', emoji: '🐛', left: '57%', top: '63%', animY: 2, delay: 0.6, duration: 4.2 });
    cs.push({ id: 'ant1',       emoji: '🐜', left: '46%', top: '70%', animY: 1, delay: 1.0, duration: 2.8, size: '0.85rem' });
    if (isDay) {
      cs.push({ id: 'butterfly', emoji: '🦋', left: '22%', top: '46%', animY: 12, animX: 7, delay: 1.3, duration: 3.8 });
    }
  }

  // ── Large ─────────────────────────────────────────────────────────────────
  if (stage === 'large') {
    cs.push({ id: 'bird1', emoji: '🐦', left: '67%', top: '56%', animY: 3, delay: 0.5, duration: 4.5 });
    cs.push({ id: 'ant1',  emoji: '🐜', left: '46%', top: '67%', animY: 1, delay: 1.0, duration: 2.8, size: '0.85rem' });
    if (isDay) {
      cs.push({ id: 'butterfly', emoji: '🦋', left: '22%', top: '40%', animY: 12, animX: 8, delay: 0.9, duration: 3.8 });
    }
  }

  // ── Tree ──────────────────────────────────────────────────────────────────
  if (stage === 'tree') {
    // Ants on trunk — always present for any maturity
    cs.push({ id: 'ant1', emoji: '🐜', left: '44%', top: '65%', animY: 1, delay: 1.4, duration: 2.6, size: '0.85rem' });
    cs.push({ id: 'ant2', emoji: '🐜', left: '56%', top: '61%', animY: 1, delay: 1.9, duration: 2.9, size: '0.8rem' });

    if (maturity === 'young') {
      cs.push({ id: 'bird1',     emoji: '🐦', left: '67%', top: '54%', animY: 3, delay: 0.4, duration: 4.5 });
      if (isDay) {
        cs.push({ id: 'butterfly', emoji: '🦋', left: '20%', top: '36%', animY: 12, animX: 8, delay: 0.8, duration: 3.8 });
      }
    }

    if (maturity === 'adult') {
      cs.push({ id: 'bird1', emoji: '🐦', left: '65%', top: '54%', animY: 3,  delay: 0.4, duration: 4.5 });
      cs.push({ id: 'bird2', emoji: '🐦', left: '71%', top: '44%', animY: 4,  delay: 0.7, duration: 5.0 });
      if (isDay) {
        cs.push({ id: 'bee',       emoji: '🐝', left: '26%', top: '28%', animY: 8,  animX: 6, delay: 1.0, duration: 2.5 });
        cs.push({ id: 'butterfly', emoji: '🦋', left: '18%', top: '38%', animY: 10, animX: 8, delay: 1.4, duration: 3.5 });
      }
    }

    if (maturity === 'mature') {
      cs.push({ id: 'bird1', emoji: '🐦', left: '63%', top: '56%', animY: 3, delay: 0.3, duration: 4.5 });
      cs.push({ id: 'bird2', emoji: '🐦', left: '70%', top: '44%', animY: 4, delay: 0.6, duration: 5.0 });
      if (isNight || isEvening) {
        cs.push({ id: 'owl', emoji: '🦉', left: '32%', top: '48%', animY: 3, delay: 0.5, duration: 5.5 });
      } else {
        cs.push({ id: 'butterfly', emoji: '🦋', left: '18%', top: '32%', animY: 12, animX: 8, delay: 0.8, duration: 3.8 });
        cs.push({ id: 'bee1',      emoji: '🐝', left: '78%', top: '26%', animY: 8,  animX: 6, delay: 1.1, duration: 2.6 });
        cs.push({ id: 'bee2',      emoji: '🐝', left: '24%', top: '26%', animY: 6,  animX: 5, delay: 1.7, duration: 2.9 });
      }
    }

    if (maturity === 'old') {
      cs.push({ id: 'bird1',    emoji: '🐦',  left: '61%', top: '56%', animY: 3, delay: 0.3, duration: 4.5 });
      cs.push({ id: 'bird2',    emoji: '🐦',  left: '70%', top: '42%', animY: 4, delay: 0.5, duration: 5.0 });
      cs.push({ id: 'squirrel', emoji: '🐿️', left: '36%', top: '58%', animY: 5, delay: 0.9, duration: 3.8 });
      if (isNight || isEvening) {
        cs.push({ id: 'owl', emoji: '🦉', left: '30%', top: '44%', animY: 3, delay: 0.4, duration: 5.5 });
      } else {
        cs.push({ id: 'butterfly', emoji: '🦋', left: '16%', top: '30%', animY: 14, animX: 10, delay: 0.7, duration: 3.8 });
        cs.push({ id: 'bee',       emoji: '🐝', left: '79%', top: '24%', animY: 8,  animX: 6,  delay: 1.2, duration: 2.6 });
      }
    }

    if (maturity === 'centenarian') {
      cs.push({ id: 'bird1',    emoji: '🐦',  left: '60%', top: '56%', animY: 3, delay: 0.2, duration: 4.5 });
      cs.push({ id: 'bird2',    emoji: '🐦',  left: '68%', top: '43%', animY: 4, delay: 0.4, duration: 5.0 });
      cs.push({ id: 'bird3',    emoji: '🐦',  left: '74%', top: '32%', animY: 5, delay: 0.7, duration: 4.8 });
      cs.push({ id: 'squirrel', emoji: '🐿️', left: '34%', top: '58%', animY: 5, delay: 0.8, duration: 3.8 });
      if (isNight || isEvening) {
        cs.push({ id: 'owl',      emoji: '🦉', left: '28%', top: '45%', animY: 3,  delay: 0.4, duration: 5.5 });
        cs.push({ id: 'firefly1', emoji: '✨', left: '15%', top: '54%', animY: 18, animX: 9,  delay: 0.6, duration: 4.0 });
        cs.push({ id: 'firefly2', emoji: '✨', left: '82%', top: '48%', animY: 14, animX: 7,  delay: 1.1, duration: 3.6 });
        cs.push({ id: 'firefly3', emoji: '✨', left: '20%', top: '36%', animY: 20, animX: 10, delay: 1.6, duration: 4.5 });
      } else {
        cs.push({ id: 'butterfly1', emoji: '🦋', left: '14%', top: '26%', animY: 14, animX: 10, delay: 0.6, duration: 3.8 });
        cs.push({ id: 'butterfly2', emoji: '🦋', left: '82%', top: '36%', animY: 10, animX: 7,  delay: 1.0, duration: 4.2 });
        cs.push({ id: 'bee',        emoji: '🐝', left: '76%', top: '22%', animY: 8,  animX: 6,  delay: 1.3, duration: 2.6 });
      }
    }
  }

  return cs;
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  stage: GrowthStage;
  maturity: TreeMaturity;
  onClose: () => void;
}

export default function TreeEcosystem({ stage, maturity, onClose }: Props) {
  const timeOfDay = useTimeOfDay();
  const bg        = BG[timeOfDay];
  const ground    = GROUND_COLOR[timeOfDay];
  const dark      = IS_DARK[timeOfDay];
  const isNight   = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';

  const creatures = getCreatures(stage, maturity, isNight, isEvening);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: bg }}
      onClick={onClose}
    >
      {/* Ground strip */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: '22%', backgroundColor: ground, opacity: 0.55 }}
      />

      {/* Plant + creatures */}
      <div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: '14%' }}>
        {/* Plant springs in */}
        <motion.div
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          exit={{    scale: 0.7,  opacity: 0 }}
          transition={{ type: 'spring', stiffness: 130, damping: 22, delay: 0.05 }}
          className="plant-float relative"
          style={{ zIndex: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          <PlantDisplay stage={stage} size={300} maturity={maturity} />
        </motion.div>

        {/* Creatures */}
        {creatures.map((c) => (
          <motion.span
            key={c.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: c.animY ? [0, -c.animY, 0] : 0,
              x: c.animX ? [0, c.animX, -(c.animX / 2), 0] : 0,
            }}
            transition={{
              opacity: { delay: c.delay, duration: 0.5 },
              scale:   { delay: c.delay, duration: 0.5, type: 'spring', stiffness: 220 },
              y: c.animY
                ? { delay: c.delay + 0.4, duration: c.duration, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0 },
              x: c.animX
                ? { delay: c.delay + 0.4, duration: c.duration * 1.3, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0 },
            }}
            className="absolute pointer-events-none select-none"
            style={{
              left:      c.left,
              top:       c.top,
              fontSize:  c.size ?? '1.25rem',
              transform: 'translate(-50%, -50%)',
              zIndex:    20,
            }}
          >
            {c.emoji}
          </motion.span>
        ))}
      </div>

      {/* "toca para salir" hint — fades in late, fades out early */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: dark ? 0.28 : 0.35 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 2.0, duration: 1.2 }}
        className="absolute bottom-8 inset-x-0 text-center text-xs tracking-widest pointer-events-none select-none"
        style={{ color: dark ? '#4a6878' : '#a8b4a0' }}
      >
        toca para salir
      </motion.p>
    </motion.div>
  );
}
