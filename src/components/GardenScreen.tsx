'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GardenState, STAGE_LABELS, PassiveElement } from '@/types/garden';
import PlantDisplay from './PlantDisplay';
import StarField from './StarField';
import SeasonalElements from './SeasonalElements';
import {
  formatLastWatered,
  wateringsUntilNextStage,
  getStageProgress,
  getStageFromCount,
  wateredToday,
  getDailyWateringCount,
  canWaterMore,
  getTreeMaturity,
  TREE_MATURITY_LABELS,
  getDailyPhrase,
  getGardenAgeLabel,
  getSeasonsLivedLabel,
} from '@/utils/garden';
import { useBloomMessage } from '@/hooks/useBloomMessage';
import { useTimeOfDay, TimeOfDay } from '@/hooks/useTimeOfDay';
import { useSeasonOfYear } from '@/hooks/useSeasonOfYear';

// ── Time-of-day palette ────────────────────────────────────────────────────

interface Palette {
  bg: string;
  glowColor: string;
  isDark: boolean;
  progressBg: string;
  progressFill: string;
  btnBg: string;
  separatorAlpha: number;
  plantGlow: string | null;
}

const PALETTES: Record<TimeOfDay, Palette> = {
  dawn: {
    bg: '#f5eef8',
    glowColor: 'rgba(255,175,200,0.40)',
    isDark: false,
    progressBg: '#e8dced',
    progressFill: '#a07ab8',
    btnBg: '#7cb87a',
    separatorAlpha: 0.18,
    plantGlow: null,
  },
  morning: {
    bg: '#eff9f4',
    glowColor: 'rgba(190,240,208,0.65)',
    isDark: false,
    progressBg: '#cce8d8',
    progressFill: '#5aa870',
    btnBg: '#7cb87a',
    separatorAlpha: 0.18,
    plantGlow: null,
  },
  afternoon: {
    bg: '#fdf9f5',
    glowColor: 'rgba(232,245,233,0.80)',
    isDark: false,
    progressBg: '#e0d5c5',
    progressFill: '#7cb87a',
    btnBg: '#7cb87a',
    separatorAlpha: 0.20,
    plantGlow: null,
  },
  evening: {
    bg: '#fef3e6',
    glowColor: 'rgba(255,192,105,0.45)',
    isDark: false,
    progressBg: '#e8d4b4',
    progressFill: '#c4956a',
    btnBg: '#c4956a',
    separatorAlpha: 0.22,
    plantGlow: null,
  },
  night: {
    bg: '#141e2e',
    glowColor: 'rgba(38,78,128,0.35)',
    isDark: true,
    progressBg: '#1e3048',
    progressFill: '#4a9890',
    btnBg: '#2a6858',
    separatorAlpha: 0.07,
    plantGlow: '0 0 28px rgba(100,200,160,0.20)',
  },
};

const PASSIVE_EMOJIS: Record<string, string> = {
  leaf: '🍃',
  flower: '🌸',
  butterfly: '🦋',
  bird: '🐦',
  stone: '🪨',
  mushroom: '🍄',
  dewdrop: '💧',
};

interface Props {
  garden: GardenState;
  onWater: () => void;
  onOpenRename: () => void;
  hoursAway: number;
  onExploreTree?: () => void;
}

export default function GardenScreen({ garden, onWater, onOpenRename, hoursAway, onExploreTree }: Props) {

  const lastText      = formatLastWatered(garden.lastWatered);
  const toNext        = wateringsUntilNextStage(garden);
  const stageProgress = getStageProgress(garden);
  const isMaxStage    = toNext === null;
  const isDefaultName = garden.plantName === 'Mi planta';
  const bloomMessage  = useBloomMessage(garden, hoursAway);
  const timeOfDay     = useTimeOfDay();
  const season        = useSeasonOfYear();
  const p             = PALETTES[timeOfDay];
  const dark          = p.isDark;

  // ── Daily watering state ──────────────────────────────────────────────────
  const dailyCount      = getDailyWateringCount(garden);
  const alreadyWatered  = wateredToday(garden);              // 1+ waterings today
  const reachedDailyMax = !canWaterMore(garden);             // exactly 5 today
  const dailyPhrase     = alreadyWatered ? getDailyPhrase(season, garden.createdAt ?? garden.lastOpenedAt) : null;

  // ── Tree maturity ──────────────────────────────────────────────────────────
  const treeMaturity  = getTreeMaturity(garden.wateringCount);
  const stageLabel    = garden.stage === 'tree'
    ? TREE_MATURITY_LABELS[treeMaturity]
    : STAGE_LABELS[garden.stage];

  // ── Garden age + seasons ────────────────────────────────────────────────────
  const ageLabel     = getGardenAgeLabel(garden.createdAt ?? garden.lastOpenedAt);
  const seasonsLabel = getSeasonsLivedLabel(garden.createdAt ?? garden.lastOpenedAt);

  // ── Puddle ─────────────────────────────────────────────────────────────────
  const hasPuddle = garden.puddle
    ? Date.now() < garden.puddle.evaporatesAt
    : false;

  // Semantic color shortcuts
  const c = {
    brand:  dark ? '#c8d8e8' : '#6b7280',
    name:   dark ? '#a8bcc8' : '#6b7280',
    label:  dark ? '#8898a8' : '#9ca3af',
    stat:   dark ? '#8898a8' : '#9ca3af',
    muted:  dark ? '#506070' : '#d1d5db',
    green:  dark ? '#4a9890' : '#7cb87a',
    msg:    dark ? '#607888' : '#9ca3af',
  };

  // ── Button behaviour ───────────────────────────────────────────────────────
  const handleButtonPress = () => {
    if (reachedDailyMax) {
      onExploreTree?.();
    } else {
      onWater();
    }
  };

  const buttonLabel = reachedDailyMax
    ? 'Ver crecer 🌿'
    : alreadyWatered
      ? 'Regar de nuevo'
      : 'Regar ahora';

  // Pulse only on the very first daily watering prompt
  const buttonPulse = !alreadyWatered && !reachedDailyMax;

  return (
    <motion.div
      initial={{ opacity: 0, backgroundColor: p.bg }}
      animate={{ opacity: 1, backgroundColor: p.bg }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.4 },
        backgroundColor: { duration: 180, ease: 'linear' },
      }}
      className="flex flex-col min-h-screen safe-top safe-bottom relative overflow-hidden"
    >
      {/* ── Night sky ──────────────────────────────────────── */}
      <AnimatePresence>
        {timeOfDay === 'night' && <StarField key="stars" />}
      </AnimatePresence>

      <AnimatePresence>
        {timeOfDay === 'night' && (
          <motion.div
            key="moon"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 0.70, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className="absolute top-20 right-8 text-2xl pointer-events-none select-none"
            style={{ zIndex: 1 }}
          >
            🌙
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Seasonal particles ─────────────────────────────── */}
      <SeasonalElements season={season} timeOfDay={timeOfDay} />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-14 pb-2" style={{ position: 'relative', zIndex: 2 }}>
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-thin tracking-[0.2em]"
          style={{ color: c.brand }}
        >
          bloom
        </motion.span>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onOpenRename}
          className="flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span
            className="text-sm tracking-wide transition-colors"
            style={{
              color: isDefaultName ? '#7cb87a' : c.name,
              textDecoration: isDefaultName ? 'underline dotted' : 'none',
              textUnderlineOffset: '2px',
            }}
          >
            {garden.plantName}
          </span>
          <motion.span
            style={{ color: dark ? '#3a5060' : '#d1d5db', fontSize: '0.75rem', lineHeight: 1 }}
            animate={isDefaultName ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.5 }}
            transition={isDefaultName ? { repeat: Infinity, duration: 2 } : {}}
          >
            ✎
          </motion.span>
        </motion.button>
      </div>

      {/* ── Garden scene ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 relative" style={{ zIndex: 2 }}>
        {/* Ambient glow */}
        <div
          className="absolute inset-x-4 top-0 bottom-1/4 rounded-3xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top, ${p.glowColor} 0%, transparent 70%)` }}
        />

        <div className="relative flex items-end justify-center w-full" style={{ minHeight: 260 }}>
          <AnimatePresence>
            {garden.passiveElements.slice(-5).map((el) => (
              <PassiveElementDot key={el.id} element={el} />
            ))}
          </AnimatePresence>

          {/* ── Puddle + drinking bird ─────────────────── */}
          <AnimatePresence>
            {hasPuddle && (
              <motion.div
                key="puddle"
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.3 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute pointer-events-none"
                style={{ bottom: 4, left: '50%', transform: 'translateX(-50%)', zIndex: 12 }}
              >
                <svg width="120" height="38" viewBox="0 0 120 38" fill="none">
                  {/* Puddle water */}
                  <ellipse cx="52" cy="28" rx="42" ry="9" fill="#93c5fd" opacity="0.38" />
                  <ellipse cx="52" cy="26" rx="36" ry="7" fill="#bfdbfe" opacity="0.5"  />
                  {/* Water shimmer */}
                  <path d="M30 25 Q38 23 46 25" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                  {/* Bird drinking — simple silhouette */}
                  <circle cx="90" cy="18" r="5" fill="#6b7280" />
                  <ellipse cx="85" cy="22" rx="8" ry="5" fill="#6b7280" transform="rotate(-20 85 22)" />
                  {/* Beak pointing down toward water */}
                  <path d="M90 22 L93 28" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Tail */}
                  <path d="M77 22 Q74 18 72 19" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* Wing hint */}
                  <path d="M82 19 Q84 15 88 17" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secondary seedling */}
          <AnimatePresence>
            {garden.secondaryPlant && (
              <motion.div
                key="secondary-plant"
                initial={{ opacity: 0, scale: 0.3, y: 12 }}
                animate={{ opacity: 0.92, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 2.8, ease: 'easeOut' }}
                className="absolute"
                style={{ right: '7%', bottom: 0, zIndex: 15 }}
              >
                <PlantDisplay
                  stage={getStageFromCount(garden.secondaryPlant.wateringCount)}
                  size={72}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main plant */}
          <div
            className="plant-float z-10"
            style={p.plantGlow ? { filter: `drop-shadow(${p.plantGlow})` } : undefined}
          >
            <PlantDisplay
              stage={garden.stage}
              size={220}
              maturity={treeMaturity}
            />
          </div>
        </div>

        {/* Thin separator */}
        <div
          className="w-full max-w-xs h-px mt-1"
          style={{
            background: `linear-gradient(to right, transparent, rgba(196,149,106,${p.separatorAlpha}), transparent)`,
          }}
        />

        {/* ── Stage info ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col items-center gap-3 w-full max-w-xs"
        >
          <div className="text-xs uppercase tracking-widest" style={{ color: c.label }}>
            {stageLabel}
          </div>

          {!isMaxStage && (
            <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: p.progressBg }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: p.progressFill }}
                initial={{ width: 0 }}
                animate={{ width: `${stageProgress * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          )}

          <div className="flex items-center gap-5 flex-wrap justify-center">
            {/* Garden age — always present */}
            <div className="flex items-center gap-1 text-xs" style={{ color: c.stat }}>
              <span>🌱</span>
              <span>{ageLabel}</span>
            </div>

            {/* Seasons lived — appears after first season change */}
            {seasonsLabel && (
              <div className="flex items-center gap-1 text-xs" style={{ color: c.stat }}>
                <span>🍂</span>
                <span>{seasonsLabel}</span>
              </div>
            )}

            {/* Last watered */}
            {garden.lastWatered && (
              <div className="flex items-center gap-1 text-xs" style={{ color: c.stat }}>
                <span>💧</span>
                <span>{lastText}</span>
              </div>
            )}
          </div>

          {toNext !== null && toNext <= 3 && toNext > 0 && (
            <p className="text-xs" style={{ color: c.muted }}>
              {toNext === 1 ? '1 riego más' : `${toNext} riegos más`} para crecer
            </p>
          )}
        </motion.div>

        {/* ── Daily phrase or bloom message ── */}
        <AnimatePresence mode="wait">
          {dailyPhrase ? (
            <motion.p
              key="daily-phrase"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: 0.3, ease: 'easeInOut' }}
              className="text-sm font-light tracking-wide text-center px-8 mt-3 leading-relaxed"
              style={{ color: c.msg }}
            >
              {dailyPhrase}
            </motion.p>
          ) : bloomMessage ? (
            <motion.p
              key={bloomMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: 1.0, ease: 'easeInOut' }}
              className="text-xs font-light tracking-wide text-center px-8 mt-1"
              style={{ color: c.msg }}
            >
              {bloomMessage}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <div className="px-6 pt-2 pb-10" style={{ position: 'relative', zIndex: 2 }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleButtonPress}
          className={`w-full py-5 text-white rounded-2xl text-base font-medium tracking-wide no-select active:scale-95 transition-all duration-500 ${buttonPulse ? 'cta-pulse' : ''}`}
          style={{
            backgroundColor: reachedDailyMax ? (dark ? '#1a4030' : '#c8e6c0') : p.btnBg,
            color: reachedDailyMax ? (dark ? '#8dc88b' : '#2d6a2d') : '#fff',
            opacity: (alreadyWatered && !reachedDailyMax) ? 0.55 : 1,
          }}
        >
          {buttonLabel}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs mt-3"
          style={{ color: c.muted }}
        >
          {garden.wateringCount === 0
            ? 'Primera gota de agua'
            : `${garden.wateringCount} ${garden.wateringCount === 1 ? 'riego' : 'riegos'} en total`}
          {reachedDailyMax
            ? <span style={{ color: c.green }}> · listos por hoy 🌿</span>
            : alreadyWatered
              ? <span style={{ color: c.green }}> · {dailyCount} hoy</span>
              : null
          }
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
        zIndex: element.type === 'bird' || element.type === 'butterfly' ? 20 : 16,
      }}
    >
      {PASSIVE_EMOJIS[element.type] ?? '🌿'}
    </motion.div>
  );
}
