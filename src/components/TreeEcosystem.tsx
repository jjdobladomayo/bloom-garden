'use client';

import { motion, AnimatePresence } from 'framer-motion';
import PlantDisplay from './PlantDisplay';
import { GrowthStage, PassiveElement, PassiveElementType, Puddle, TreeMaturity } from '@/types/garden';
import { ELEMENT_LORE } from '@/data/elementLore';
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
  left: string;
  top: string;
  animY?: number;
  animX?: number;
  delay: number;
  duration: number;
  size?: string;
}

// ── Hardcoded creatures per stage / time ───────────────────────────────────

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
    cs.push({ id: 'worm', emoji: '🐛', left: '52%', top: '82%', animY: 2, delay: 0.5, duration: 4 });
    cs.push({ id: 'ant1', emoji: '🐜', left: '46%', top: '74%', animY: 1, delay: 0.9, duration: 2.8, size: '0.85rem' });
  }

  // ── Small ─────────────────────────────────────────────────────────────────
  if (stage === 'small') {
    cs.push({ id: 'ant1',    emoji: '🐜', left: '45%', top: '73%', animY: 1, delay: 0.7, duration: 2.5, size: '0.85rem' });
    cs.push({ id: 'ant2',    emoji: '🐜', left: '55%', top: '70%', animY: 1, delay: 1.1, duration: 2.8, size: '0.8rem' });
    cs.push({ id: 'ladybug', emoji: '🐞', left: '60%', top: '64%', animY: 3, delay: 1.3, duration: 3.5 });
    if (isNight || isEvening) {
      cs.push({ id: 'bat', emoji: '🦇', left: '26%', top: '40%', animY: 12, animX: 8, delay: 1.2, duration: 3.8 });
    }
  }

  // ── Medium ────────────────────────────────────────────────────────────────
  if (stage === 'medium') {
    cs.push({ id: 'caterpillar', emoji: '🐛', left: '57%', top: '63%', animY: 2, delay: 0.6, duration: 4.2 });
    cs.push({ id: 'ant1',       emoji: '🐜', left: '46%', top: '70%', animY: 1, delay: 1.0, duration: 2.8, size: '0.85rem' });
    if (isDay) {
      cs.push({ id: 'butterfly', emoji: '🦋', left: '22%', top: '46%', animY: 12, animX: 7, delay: 1.3, duration: 3.8 });
    }
    if (isNight || isEvening) {
      cs.push({ id: 'bat',    emoji: '🦇', left: '24%', top: '38%', animY: 14, animX: 8, delay: 1.1, duration: 3.8 });
      cs.push({ id: 'beetle', emoji: '🪲', left: '62%', top: '83%', animY: 2, delay: 1.6, duration: 4.0 });
    }
  }

  // ── Large ─────────────────────────────────────────────────────────────────
  if (stage === 'large') {
    cs.push({ id: 'bird1', emoji: '🐦', left: '67%', top: '56%', animY: 3, delay: 0.5, duration: 4.5 });
    cs.push({ id: 'ant1',  emoji: '🐜', left: '46%', top: '67%', animY: 1, delay: 1.0, duration: 2.8, size: '0.85rem' });
    if (isDay) {
      cs.push({ id: 'butterfly', emoji: '🦋', left: '22%', top: '40%', animY: 12, animX: 8, delay: 0.9, duration: 3.8 });
    }
    if (isNight || isEvening) {
      cs.push({ id: 'bat',    emoji: '🦇', left: '22%', top: '34%', animY: 15, animX: 9, delay: 0.9, duration: 3.8 });
      cs.push({ id: 'beetle', emoji: '🪲', left: '64%', top: '84%', animY: 2, delay: 1.4, duration: 4.2 });
    }
  }

  // ── Tree ──────────────────────────────────────────────────────────────────
  if (stage === 'tree') {
    // Ants on trunk — always
    cs.push({ id: 'ant1', emoji: '🐜', left: '44%', top: '65%', animY: 1, delay: 1.4, duration: 2.6, size: '0.85rem' });
    cs.push({ id: 'ant2', emoji: '🐜', left: '56%', top: '61%', animY: 1, delay: 1.9, duration: 2.9, size: '0.8rem' });

    if (maturity === 'young') {
      cs.push({ id: 'bird1', emoji: '🐦', left: '67%', top: '54%', animY: 3, delay: 0.4, duration: 4.5 });
      if (isDay) {
        cs.push({ id: 'butterfly', emoji: '🦋', left: '20%', top: '36%', animY: 12, animX: 8, delay: 0.8, duration: 3.8 });
      }
      if (isNight || isEvening) {
        cs.push({ id: 'bat',    emoji: '🦇', left: '22%', top: '33%', animY: 15, animX: 10, delay: 0.9, duration: 3.8 });
        cs.push({ id: 'beetle', emoji: '🪲', left: '63%', top: '83%', animY: 2,  delay: 1.5, duration: 4.2 });
      }
    }

    if (maturity === 'adult') {
      cs.push({ id: 'bird1', emoji: '🐦', left: '65%', top: '54%', animY: 3, delay: 0.4, duration: 4.5 });
      cs.push({ id: 'bird2', emoji: '🐦', left: '71%', top: '44%', animY: 4, delay: 0.7, duration: 5.0 });
      if (isDay) {
        cs.push({ id: 'bee',       emoji: '🐝', left: '26%', top: '28%', animY: 8,  animX: 6, delay: 1.0, duration: 2.5 });
        cs.push({ id: 'butterfly', emoji: '🦋', left: '18%', top: '38%', animY: 10, animX: 8, delay: 1.4, duration: 3.5 });
      }
      if (isNight || isEvening) {
        cs.push({ id: 'bat',      emoji: '🦇', left: '20%', top: '30%', animY: 16, animX: 11, delay: 0.8, duration: 3.6 });
        cs.push({ id: 'beetle',   emoji: '🪲', left: '64%', top: '83%', animY: 2,  delay: 1.3, duration: 4.2 });
        cs.push({ id: 'hedgehog', emoji: '🦔', left: '37%', top: '85%', animY: 3,  delay: 1.9, duration: 5.0 });
      }
    }

    if (maturity === 'mature') {
      cs.push({ id: 'bird1', emoji: '🐦', left: '63%', top: '56%', animY: 3, delay: 0.3, duration: 4.5 });
      cs.push({ id: 'bird2', emoji: '🐦', left: '70%', top: '44%', animY: 4, delay: 0.6, duration: 5.0 });
      if (isNight || isEvening) {
        cs.push({ id: 'owl',    emoji: '🦉', left: '32%', top: '48%', animY: 3,  delay: 0.5, duration: 5.5 });
        cs.push({ id: 'bat',    emoji: '🦇', left: '18%', top: '28%', animY: 16, animX: 12, delay: 1.0, duration: 4.0 });
        cs.push({ id: 'spider', emoji: '🕷️', left: '60%', top: '66%', animY: 3,  delay: 1.6, duration: 4.5 });
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
        cs.push({ id: 'owl',     emoji: '🦉', left: '30%', top: '44%', animY: 3,  delay: 0.4, duration: 5.5 });
        cs.push({ id: 'bat',     emoji: '🦇', left: '16%', top: '26%', animY: 16, animX: 12, delay: 0.9, duration: 4.0 });
        cs.push({ id: 'cricket', emoji: '🦗', left: '58%', top: '84%', animY: 2,  delay: 1.6, duration: 5.0 });
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
        cs.push({ id: 'bat',      emoji: '🦇', left: '75%', top: '25%', animY: 18, animX: 12, delay: 0.8, duration: 3.8 });
        cs.push({ id: 'spider',   emoji: '🕷️', left: '55%', top: '64%', animY: 3,  delay: 1.4, duration: 4.5 });
      } else {
        cs.push({ id: 'butterfly1', emoji: '🦋', left: '14%', top: '26%', animY: 14, animX: 10, delay: 0.6, duration: 3.8 });
        cs.push({ id: 'butterfly2', emoji: '🦋', left: '82%', top: '36%', animY: 10, animX: 7,  delay: 1.0, duration: 4.2 });
        cs.push({ id: 'bee',        emoji: '🐝', left: '76%', top: '22%', animY: 8,  animX: 6,  delay: 1.3, duration: 2.6 });
      }
    }
  }

  return cs;
}

// ── Real elements from the user's garden ───────────────────────────────────
// Types handled by the hardcoded logic above — skip these to avoid duplicates
const ALREADY_HANDLED = new Set<string>([
  'ant', 'worm', 'caterpillar', 'ladybug',
  'butterfly', 'bird', 'bee',
  'owl', 'squirrel', 'firefly',
  'bat', 'beetle', 'hedgehog', 'spider', 'cricket',
]);

// Position offsets for each type in the ecosystem overlay coordinate system.
// `left` is overridden by the element's actual garden x position.
const REAL_ELEMENT_TOP: Partial<Record<PassiveElementType, { top: string; animY?: number; animX?: number }>> = {
  // Ground
  stone:         { top: '88%' },
  mushroom:      { top: '83%', animY: 1 },
  flower:        { top: '80%', animY: 2 },
  dewdrop:       { top: '77%' },
  snail:         { top: '87%', animY: 1 },
  clover:        { top: '81%' },
  acorn:         { top: '85%' },
  tulip:         { top: '79%', animY: 2 },
  moss:          { top: '84%' },
  berries:       { top: '64%', animY: 2 },
  feather:       { top: '85%' },
  pawprints:     { top: '89%' },
  // Mid
  leaf:          { top: '64%', animY: 6, animX: 3 },
  spiderweb:     { top: '54%' },
  lizard:        { top: '72%', animY: 2 },
  // Aerial / atmospheric
  autumn_leaf:   { top: '58%', animY: 8, animX: 5 },
  snowflake:     { top: '42%', animY: 10, animX: 6 },
  // Fleeting specials
  rabbit:        { top: '86%', animY: 4 },
  fox:           { top: '87%', animY: 3 },
  rainbow:       { top: '18%' },
  shooting_star: { top: '10%', animX: 22 },
};

// Priority — rarest / most poetic shown first (max 4 real elements)
const REAL_PRIORITY: PassiveElementType[] = [
  'shooting_star', 'rainbow', 'fox', 'rabbit', 'pawprints',
  'berries', 'spiderweb', 'autumn_leaf', 'snowflake', 'tulip',
  'mushroom', 'clover', 'dewdrop', 'snail', 'lizard',
  'moss', 'feather', 'leaf', 'acorn', 'flower', 'stone',
];

function getRealCreatures(passiveElements: PassiveElement[]): Creature[] {
  const present = new Map(passiveElements.map(e => [e.type, e]));
  const chosen: Creature[] = [];

  for (const type of REAL_PRIORITY) {
    if (chosen.length >= 4) break;
    if (ALREADY_HANDLED.has(type)) continue;
    const el = present.get(type);
    if (!el) continue;
    const pos = REAL_ELEMENT_TOP[type];
    if (!pos) continue;

    // Map garden x (0–100) to screen x (10–90%)
    const screenX = Math.round(10 + el.position.x * 0.80);

    chosen.push({
      id:       `real_${type}`,
      emoji:    ELEMENT_LORE[type]?.emoji ?? '🌿',
      left:     `${screenX}%`,
      top:      pos.top,
      animY:    pos.animY,
      animX:    pos.animX,
      delay:    0.9 + chosen.length * 0.35,
      duration: 3.5 + (chosen.length * 0.4),
    });
  }

  return chosen;
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  stage: GrowthStage;
  maturity: TreeMaturity;
  onClose: () => void;
  passiveElements?: PassiveElement[];
  puddle?: Puddle;
}

export default function TreeEcosystem({ stage, maturity, onClose, passiveElements = [], puddle }: Props) {
  const timeOfDay = useTimeOfDay();
  const bg        = BG[timeOfDay];
  const ground    = GROUND_COLOR[timeOfDay];
  const dark      = IS_DARK[timeOfDay];
  const isNight   = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';

  const hardcoded = getCreatures(stage, maturity, isNight, isEvening);
  const real      = getRealCreatures(passiveElements);

  // Belt-and-suspenders: never render nocturnal creatures outside night/evening,
  // regardless of how they ended up in the array.
  const NOCTURNAL_BASE_IDS = new Set(['bat', 'beetle', 'spider', 'hedgehog', 'cricket', 'owl']);
  const allCreatures = [...hardcoded, ...real].filter(c => {
    if (isNight || isEvening) return true;
    const base = c.id.replace(/^real_/, '').replace(/\d+$/, '');
    return !NOCTURNAL_BASE_IDS.has(base);
  });

  // Puddle creatures — appear when an active puddle exists
  const hasPuddle = !!puddle && puddle.evaporatesAt > Date.now();
  if (hasPuddle) {
    allCreatures.push({ id: 'puddle_frog',   emoji: '🐸', left: '38%', top: '87%', animY: 3, delay: 1.2, duration: 4.0 });
    allCreatures.push({ id: 'puddle_turtle', emoji: '🐢', left: '61%', top: '88%', animY: 2, delay: 1.6, duration: 5.2 });
  }

  const creatures = allCreatures;

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

        {/* Puddle SVG — shown when charco is active */}
        {hasPuddle && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.2 }}
            transition={{ delay: 0.6, duration: 1.4, ease: 'easeOut' }}
            className="absolute pointer-events-none"
            style={{ bottom: '13%', left: '50%', transform: 'translateX(-20%)', zIndex: 8 }}
          >
            <svg width="160" height="48" viewBox="0 0 160 48" fill="none">
              {/* Puddle water */}
              <ellipse cx="68" cy="36" rx="56" ry="11" fill="#93c5fd" opacity="0.4" />
              <ellipse cx="68" cy="33" rx="46" ry="8"  fill="#bfdbfe" opacity="0.55" />
              {/* Shimmer lines */}
              <path d="M38 32 Q50 29 62 32" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <path d="M72 34 Q80 31 88 34" stroke="#e0f2fe" strokeWidth="1.0" strokeLinecap="round" opacity="0.6" />
              {/* Ripple ring */}
              <ellipse cx="68" cy="36" rx="56" ry="11" stroke="#7dd3fc" strokeWidth="0.8" opacity="0.3" fill="none" />
            </svg>
          </motion.div>
        )}

        {/* All creatures */}
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

      {/* "toca para salir" hint */}
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
