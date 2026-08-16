'use client';

import { motion } from 'framer-motion';
import { TreeMaturity, GrowthStage } from '@/types/garden';
import { useSeasonOfYear } from '@/hooks/useSeasonOfYear';
import { useTimeOfDay, TimeOfDay } from '@/hooks/useTimeOfDay';
import PlantDisplay from './PlantDisplay';

interface Props {
  stage: GrowthStage;
  maturity: TreeMaturity;
  onClose: () => void;
}

// ── Sky backgrounds ────────────────────────────────────────────────────────────
const SKY_COLORS: Record<TimeOfDay, { top: string; mid: string; text: string }> = {
  dawn:      { top: '#f5eef8', mid: '#ffe8f0', text: 'rgba(110,60,130,0.55)' },
  morning:   { top: '#ddf0fb', mid: '#eaf8f0', text: 'rgba(30,90,100,0.55)'  },
  afternoon: { top: '#dceeff', mid: '#e8f5ff', text: 'rgba(30,70,120,0.55)'  },
  evening:   { top: '#ffe8c8', mid: '#fef0df', text: 'rgba(120,60,20,0.55)'  },
  night:     { top: '#0d1b2e', mid: '#141e38', text: 'rgba(140,170,210,0.60)' },
};

// ── Soil palette ───────────────────────────────────────────────────────────────
const SOIL = {
  surface:  '#c8a870',
  shallow:  '#b89058',
  medium:   '#a07840',
  deep:     '#886030',
  stone:    '#706050',
};

export default function VerticalWorld({ stage, maturity, onClose }: Props) {
  const season    = useSeasonOfYear();
  const timeOfDay = useTimeOfDay();
  const sky       = SKY_COLORS[timeOfDay];
  const isDark    = timeOfDay === 'night';

  const isAdult      = ['adult', 'mature', 'old', 'centenarian'].includes(maturity);
  const isDeepRooted = ['mature', 'old', 'centenarian'].includes(maturity);
  const isAncient    = ['old', 'centenarian'].includes(maturity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 overflow-y-auto"
      style={{ background: sky.top, zIndex: 100 }}
    >
      <style>{`
        @keyframes bee-float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25%       { transform: translate(18px, -12px) rotate(8deg); }
          50%       { transform: translate(32px, 4px) rotate(-5deg); }
          75%       { transform: translate(10px, 18px) rotate(10deg); }
        }
        @keyframes bee-float-2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          30%       { transform: translate(-20px, -8px) rotate(-6deg); }
          60%       { transform: translate(-8px, 16px) rotate(4deg); }
        }
        @keyframes worm-wiggle {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          33%       { transform: scaleX(1.08) rotate(3deg); }
          66%       { transform: scaleX(0.94) rotate(-3deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.85; }
        }
        @keyframes snowfall {
          0%   { transform: translateY(-20px) translateX(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(120px) translateX(15px); opacity: 0; }
        }
        @keyframes leaf-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          100% { transform: translateY(140px) rotate(180deg); opacity: 0; }
        }
        @keyframes petal-float {
          0%   { transform: translateY(0px) rotate(0deg) translateX(0px); opacity: 0; }
          5%   { opacity: 0.8; }
          100% { transform: translateY(-160px) rotate(240deg) translateX(30px); opacity: 0; }
        }
      `}</style>

      {/* ── Back button ──────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        className="fixed top-12 left-5 z-50 flex items-center gap-1.5 no-select"
        style={{ color: sky.text }}
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>←</span>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', fontWeight: 400 }}>jardín</span>
      </motion.button>

      {/* ══════════════ SKY ZONE ══════════════ */}
      <div className="relative overflow-hidden" style={{ height: '100svh', minHeight: 600, background: sky.top }}>

        {/* Horizon gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${sky.mid})` }} />

        {/* ── Sun / Moon ── */}
        {!isDark ? (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute"
            style={{ top: '14%', right: '18%' }}
          >
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
              <circle cx="27" cy="27" r="14" fill={timeOfDay === 'evening' ? '#f5a623' : '#fcd34d'} opacity="0.9" />
              <circle cx="27" cy="27" r="10" fill={timeOfDay === 'evening' ? '#fbbf24' : '#fef08a'} />
              {[0,45,90,135,180,225,270,315].map((a) => (
                <line key={a}
                  x1={27 + 16 * Math.cos(a * Math.PI / 180)}
                  y1={27 + 16 * Math.sin(a * Math.PI / 180)}
                  x2={27 + 22 * Math.cos(a * Math.PI / 180)}
                  y2={27 + 22 * Math.sin(a * Math.PI / 180)}
                  stroke={timeOfDay === 'evening' ? '#f5a623' : '#fcd34d'}
                  strokeWidth="2" strokeLinecap="round"
                />
              ))}
            </svg>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute"
            style={{ top: '12%', right: '16%' }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M32 22 Q28 12 18 14 Q24 6 34 10 Q42 18 36 28 Q34 24 32 22Z" fill="#e2e8f0" />
              {/* Stars */}
              {[[10,8],[8,20],[20,6],[14,28],[28,30],[36,14]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.2 : 0.8} fill="#e2e8f0" opacity="0.6" />
              ))}
            </svg>
          </motion.div>
        )}

        {/* ── Clouds ── */}
        <motion.div
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none"
          style={{ top: '22%', left: '8%' }}
        >
          <svg width="90" height="44" viewBox="0 0 90 44" fill="none">
            <ellipse cx="44" cy="32" rx="36" ry="12" fill="white" opacity={isDark ? 0.1 : 0.85} />
            <ellipse cx="52" cy="26" rx="24" ry="14" fill="white" opacity={isDark ? 0.1 : 0.85} />
            <ellipse cx="34" cy="28" rx="18" ry="11" fill="white" opacity={isDark ? 0.1 : 0.85} />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none"
          style={{ top: '30%', right: '10%' }}
        >
          <svg width="68" height="34" viewBox="0 0 68 34" fill="none">
            <ellipse cx="34" cy="24" rx="28" ry="10" fill="white" opacity={isDark ? 0.08 : 0.75} />
            <ellipse cx="40" cy="18" rx="18" ry="12" fill="white" opacity={isDark ? 0.08 : 0.75} />
            <ellipse cx="26" cy="20" rx="14" ry="9" fill="white" opacity={isDark ? 0.08 : 0.75} />
          </svg>
        </motion.div>

        {/* ── Birds (always a pair) ── */}
        <motion.div
          animate={{ x: [-30, 0], opacity: [0, 1] }}
          transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
          className="absolute pointer-events-none"
          style={{ top: '38%', left: '28%' }}
        >
          <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
            <path d="M2 10 Q8 4 14 10"  stroke={isDark ? '#8898a8' : '#6b7280'} strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M14 10 Q20 4 26 10" stroke={isDark ? '#8898a8' : '#6b7280'} strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M32 14 Q37 9 42 14" stroke={isDark ? '#7888a0' : '#9ca3af'} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            <path d="M42 14 Q47 9 52 14" stroke={isDark ? '#7888a0' : '#9ca3af'} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          </svg>
        </motion.div>

        {/* ── Season-specific sky elements ── */}

        {/* SPRING/SUMMER: bees */}
        {(season === 'spring' || season === 'summer') && (
          <>
            <div className="absolute pointer-events-none" style={{ top: '52%', left: '22%', animation: 'bee-float 4s ease-in-out infinite' }}>
              <BeeIcon />
            </div>
            <div className="absolute pointer-events-none" style={{ top: '58%', right: '28%', animation: 'bee-float-2 5.5s ease-in-out infinite' }}>
              <BeeIcon />
            </div>
          </>
        )}

        {/* SPRING: cherry petals floating up */}
        {season === 'spring' && [
          { left: '15%', delay: '0s'   },
          { left: '38%', delay: '1.2s' },
          { left: '62%', delay: '2.4s' },
          { left: '80%', delay: '0.7s' },
        ].map(({ left, delay }, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ bottom: '10%', left, animation: `petal-float 4s ease-in infinite`, animationDelay: delay }}>
            <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
              <ellipse cx="5" cy="3.5" rx="4.5" ry="3" fill="#fda4af" opacity="0.75" />
            </svg>
          </div>
        ))}

        {/* AUTUMN: falling seeds */}
        {season === 'autumn' && [
          { left: '20%', delay: '0s'   },
          { left: '45%', delay: '1.8s' },
          { left: '70%', delay: '0.9s' },
        ].map(({ left, delay }, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ top: '10%', left, animation: `leaf-fall 3.5s ease-in infinite`, animationDelay: delay }}>
            <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
              <ellipse cx="4" cy="6" rx="3.5" ry="5" fill="#c4956a" opacity="0.7" />
              <line x1="4" y1="10" x2="4" y2="16" stroke="#8b5e3c" strokeWidth="1" />
            </svg>
          </div>
        ))}

        {/* WINTER: snowflakes */}
        {season === 'winter' && [
          { left: '12%', delay: '0s'   },
          { left: '32%', delay: '1.4s' },
          { left: '55%', delay: '0.6s' },
          { left: '74%', delay: '2.1s' },
          { left: '88%', delay: '0.3s' },
        ].map(({ left, delay }, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ top: '5%', left, animation: `snowfall 5s linear infinite`, animationDelay: delay }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              {[0, 60, 120].map((a) => (
                <line key={a}
                  x1={5 + 4.5 * Math.cos(a * Math.PI / 180)}
                  y1={5 + 4.5 * Math.sin(a * Math.PI / 180)}
                  x2={5 - 4.5 * Math.cos(a * Math.PI / 180)}
                  y2={5 - 4.5 * Math.sin(a * Math.PI / 180)}
                  stroke={isDark ? '#93c5fd' : '#bfdbfe'} strokeWidth="1.2" strokeLinecap="round" />
              ))}
            </svg>
          </div>
        ))}

        {/* ── Real plant crown — same tree as the garden ── */}
        {/* marginBottom -90 hides the trunk/ground; only the crown peeks above the horizon */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none">
          <div style={{ marginBottom: -90 }}>
            <PlantDisplay stage={stage} size={260} maturity={maturity} />
          </div>
        </div>

        {/* Hint text — positioned above the crown so it's always readable */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-x-0 text-center text-xs pointer-events-none"
          style={{ bottom: '22%', color: sky.text, letterSpacing: '0.1em' }}
        >
          desliza hacia abajo ↓
        </motion.div>
      </div>

      {/* ══════════════ SURFACE TRANSITION ══════════════ */}
      <div className="relative overflow-hidden" style={{ height: '40svh', minHeight: 240, background: '#e8d4b0' }}>

        {/* Sky fade at top */}
        <div className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(232,212,176,0) 0%, #e8d4b0 100%)' }} />

        {/* Trunk visible */}
        <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
          <svg width="80" height="160" viewBox="0 0 80 160" fill="none">
            <path d="M40 0 Q36 40 37 80 Q38 120 40 160" stroke="#8b5e3c" strokeWidth="18" strokeLinecap="round" />
            {/* Root bumps at ground */}
            <path d="M30 140 Q24 154 16 152 Q20 142 30 140" fill="#8b5e3c" opacity="0.45" />
            <path d="M50 140 Q56 154 64 152 Q60 142 50 140" fill="#8b5e3c" opacity="0.45" />
            {/* Adult: extra visible roots */}
            {isAdult && <>
              <path d="M28 145 Q18 156 8 154 Q14 144 28 145"  fill="#7a4e2c" opacity="0.4" />
              <path d="M52 145 Q62 156 72 154 Q66 144 52 145" fill="#7a4e2c" opacity="0.4" />
            </>}
          </svg>
        </div>

        {/* Ground / grass line */}
        <div className="absolute inset-x-0" style={{ bottom: 0 }}>
          <svg width="100%" height="60" viewBox="0 0 390 60" preserveAspectRatio="none" fill="none">
            <path d="M0 30 Q20 10 40 28 Q60 46 80 24 Q100 10 120 30 Q140 50 160 26 Q180 10 200 30 Q220 50 240 22 Q260 10 280 32 Q300 50 320 24 Q340 10 360 30 Q380 48 390 28 L390 60 L0 60Z"
              fill="#c8b888" />
            <path d="M0 38 Q25 20 50 36 Q75 52 100 32 Q125 18 150 38 Q175 56 200 34 Q225 18 250 40 Q275 58 300 34 Q325 18 350 40 Q375 58 390 36 L390 60 L0 60Z"
              fill="#a09060" opacity="0.7" />
          </svg>
        </div>

        {/* Soil fade at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${SOIL.surface})` }} />
      </div>

      {/* ══════════════ SHALLOW UNDERGROUND ══════════════ */}
      <div className="relative overflow-hidden" style={{ height: '100svh', minHeight: 600, background: SOIL.shallow }}>

        {/* Soil texture dots */}
        {[[8,12],[22,8],[45,18],[68,6],[82,14],[15,32],[55,26],[88,35],[30,45],[72,40],
          [10,55],[48,60],[78,52],[20,68],[60,72],[35,80],[85,76],[5,88],[52,84],[90,90]]
          .map(([x, y], i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, width: 3, height: 3,
              background: SOIL.medium, opacity: 0.35 }} />
        ))}

        {/* Thin root network */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <svg width="300" height="100%" viewBox="0 0 300 600" fill="none" style={{ height: '100%' }}>
            {/* Central tap root */}
            <path d="M150 0 Q146 80 148 160 Q149 240 150 360" stroke="#8b5e3c" strokeWidth="4.5" strokeLinecap="round" />
            {/* Lateral roots tier 1 */}
            <path d="M149 80  Q130 96  106 100" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />
            <path d="M149 80  Q168 96  192 100" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />
            {/* Lateral roots tier 2 */}
            <path d="M148 160 Q120 172  92 176" stroke="#8b5e3c" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M148 160 Q176 172 204 176" stroke="#8b5e3c" strokeWidth="2.5" strokeLinecap="round" />
            {/* Fine hair roots */}
            <path d="M106 100 Q98 108  92 112" stroke="#a07040" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M106 100 Q102 114  98 120" stroke="#a07040" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M192 100 Q200 108 208 112" stroke="#a07040" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M192 100 Q198 114 202 120" stroke="#a07040" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M92  176 Q84  184  76 188"  stroke="#a07040" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M204 176 Q212 184 220 188"  stroke="#a07040" strokeWidth="1.2" strokeLinecap="round" />
            {/* Even finer tips */}
            {[
              [92,112,84,120],[98,120,90,130],[208,112,216,120],[202,120,210,130],
              [76,188,68,198],[220,188,228,198],
            ].map(([x1,y1,x2,y2],i) => (
              <path key={i} d={`M${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2*2)/3} ${x2} ${y2}`}
                stroke="#b08050" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            ))}
          </svg>
        </div>

        {/* ── Earthworm 1 ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: '8%', top: '28%', animation: 'worm-wiggle 3s ease-in-out infinite' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <svg width="90" height="18" viewBox="0 0 90 18" fill="none">
            <path d="M6 10 Q16 4 26 10 Q36 16 46 10 Q56 4 66 10 Q76 16 86 10"
              stroke="#b07048" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="6" cy="10" r="4" fill="#986038" />
            <circle cx="5" cy="9" r="1.5" fill="#7a4828" />
          </svg>
        </motion.div>

        {/* ── Earthworm 2 ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ right: '10%', top: '55%', animation: 'worm-wiggle 4s ease-in-out infinite', animationDelay: '1.5s' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <svg width="72" height="16" viewBox="0 0 72 16" fill="none">
            <path d="M6 8 Q14 3 22 8 Q30 13 38 8 Q46 3 54 8 Q62 13 68 8"
              stroke="#b07048" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="8" r="3.5" fill="#986038" />
            <circle cx="69" cy="7" r="1.2" fill="#7a4828" />
          </svg>
        </motion.div>

        {/* ── Larva / grub ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: '38%', top: '68%' }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <svg width="40" height="22" viewBox="0 0 40 22" fill="none">
            <ellipse cx="20" cy="12" rx="16" ry="8" fill="#f0ddb0" />
            <ellipse cx="20" cy="10" rx="14" ry="6" fill="#e8d0a0" />
            {/* segments */}
            {[10,16,22,28].map((x) => (
              <line key={x} x1={x} y1={6} x2={x} y2={16} stroke="#d4b888" strokeWidth="0.8" opacity="0.5" />
            ))}
            {/* head */}
            <circle cx="34" cy="11" r="5.5" fill="#d4b880" />
            <circle cx="36" cy="10" r="1.2" fill="#6b4820" />
          </svg>
        </motion.div>

        {/* ── Season content ── */}
        {season === 'spring' && (
          <motion.div className="absolute pointer-events-none"
            style={{ left: '18%', top: '80%' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}>
            {/* Germinating seed */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <ellipse cx="14" cy="20" rx="7" ry="5" fill="#8b5e3c" opacity="0.8" />
              <path d="M14 16 Q13 10 14 4" stroke="#7cb87a" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="14" cy="4" rx="4" ry="3" fill="#7cb87a" opacity="0.7" />
            </svg>
          </motion.div>
        )}

        {season === 'winter' && (
          <motion.div className="absolute pointer-events-none"
            style={{ right: '20%', top: '45%' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}>
            {/* Frost crystal in soil */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {[0,60,120].map((a) => (
                <line key={a}
                  x1={10 + 9 * Math.cos(a*Math.PI/180)} y1={10 + 9 * Math.sin(a*Math.PI/180)}
                  x2={10 - 9 * Math.cos(a*Math.PI/180)} y2={10 - 9 * Math.sin(a*Math.PI/180)}
                  stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              ))}
              <circle cx="10" cy="10" r="2" fill="#bfdbfe" opacity="0.7" />
            </svg>
          </motion.div>
        )}

        {/* Gradient to deeper zone */}
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${SOIL.medium})` }} />
      </div>

      {/* ══════════════ DEEP UNDERGROUND ══════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: 680, background: SOIL.medium }}>

        {/* Additional soil texture — darker */}
        {[[6,8],[20,4],[42,12],[65,7],[80,16],[12,28],[50,22],[85,30],
          [28,44],[70,38],[8,58],[46,54],[82,50],[22,68],[62,72],[40,82],[88,78]]
          .map(([x, y], i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, width: 4, height: 4,
              background: SOIL.deep, opacity: 0.3 }} />
        ))}

        {/* ── Ancient root system ── */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <svg width="340" height="640" viewBox="0 0 340 640" fill="none">
            {/* Main taproot continues */}
            <path d="M170 0 Q168 80 170 200 Q171 360 170 540"
              stroke="#6b4226" strokeWidth={isAncient ? 9 : isDeepRooted ? 7 : 5}
              strokeLinecap="round" />

            {/* Deep laterals */}
            <path d="M169 60  Q140 76  108 84"  stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
            <path d="M169 60  Q198 76  230 84"  stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
            <path d="M169 140 Q132 160  96 168" stroke="#6b4226" strokeWidth="4" strokeLinecap="round" />
            <path d="M169 140 Q206 160 242 168" stroke="#6b4226" strokeWidth="4" strokeLinecap="round" />

            {/* Extra ancient branches — only for mature+ */}
            {isDeepRooted && <>
              <path d="M108 84  Q84  96  60  94"  stroke="#7a4e2c" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M230 84  Q254 96 280  94"  stroke="#7a4e2c" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M169 220 Q140 234 110 244" stroke="#7a4e2c" strokeWidth="3" strokeLinecap="round" />
              <path d="M169 220 Q198 234 228 244" stroke="#7a4e2c" strokeWidth="3" strokeLinecap="round" />
            </>}

            {/* Centenarian: roots reach the edges, hint of neighboring tree */}
            {isAncient && <>
              <path d="M60  94  Q36 108  12 106" stroke="#7a4e2c" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M280 94  Q304 108 328 106" stroke="#7a4e2c" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M12 106 Q6 118 8 132"  stroke="#7a4e2c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <path d="M328 106 Q334 118 332 132" stroke="#7a4e2c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              {/* Hint of another tree's root system at edges */}
              <path d="M8 132 Q4 148 10 164"  stroke="#6b4226" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              <path d="M332 132 Q336 148 330 164" stroke="#6b4226" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            </>}

            {/* ── Mycelium network ── */}
            {isDeepRooted && <>
              {/* Thin mycelium strands connecting roots */}
              <path d="M60 94 Q80 130 110 144 Q140 156 170 150"
                stroke="#c8a870" strokeWidth="0.8" strokeLinecap="round" opacity="0.55" strokeDasharray="4 4" />
              <path d="M280 94 Q260 130 230 144 Q200 156 170 150"
                stroke="#c8a870" strokeWidth="0.8" strokeLinecap="round" opacity="0.55" strokeDasharray="4 4" />
              <path d="M96 168 Q110 190 130 200 Q150 210 170 208"
                stroke="#c8a870" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" strokeDasharray="3 5" />
              <path d="M242 168 Q228 190 208 200 Q188 210 170 208"
                stroke="#c8a870" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" strokeDasharray="3 5" />
              {/* Mycelium glow nodes */}
              {[[130,150],[208,150],[110,200],[228,200]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#d4a870"
                  opacity="0.6" style={{ animation: 'pulse-glow 3s ease-in-out infinite', animationDelay: `${i * 0.7}s` }} />
              ))}
            </>}
          </svg>
        </div>

        {/* ── Mushroom 1 ── */}
        {isDeepRooted && (
          <motion.div className="absolute pointer-events-none"
            style={{ left: '12%', top: '30%' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}>
            <Mushroom color="#d4956a" />
          </motion.div>
        )}

        {/* ── Mushroom 2 ── */}
        {isDeepRooted && (
          <motion.div className="absolute pointer-events-none"
            style={{ right: '14%', top: '42%' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}>
            <Mushroom color="#c48058" />
          </motion.div>
        )}

        {/* ── Small mushrooms even for young trees ── */}
        {!isDeepRooted && (
          <motion.div className="absolute pointer-events-none"
            style={{ left: '22%', top: '50%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}>
            <Mushroom color="#b07848" />
          </motion.div>
        )}

        {/* ── Beetle ── */}
        <motion.div className="absolute pointer-events-none"
          style={{ left: '42%', top: isDeepRooted ? '52%' : '62%' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}>
          <BeetleIcon />
        </motion.div>

        {/* ── Autumn: extra fungi activity ── */}
        {season === 'autumn' && isDeepRooted && (
          <motion.div className="absolute pointer-events-none"
            style={{ left: '58%', top: '35%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}>
            <Mushroom color="#a86040" />
          </motion.div>
        )}

        {/* ── Stone layer at the bottom ── */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 120 }}>
          <svg width="100%" height="120" viewBox="0 0 390 120" preserveAspectRatio="none" fill="none">
            <path d="M0 40 Q30 20 60 38 Q90 56 120 32 Q150 16 180 40 Q210 60 240 34 Q270 14 300 38 Q330 58 360 34 Q380 22 390 36 L390 120 L0 120Z"
              fill={SOIL.stone} opacity="0.7" />
            <path d="M0 58 Q40 38 80 56 Q120 72 160 50 Q200 34 240 54 Q280 72 320 50 Q360 32 390 52 L390 120 L0 120Z"
              fill={SOIL.stone} opacity="0.9" />
            {/* Pebble shapes */}
            {[[30,80],[90,72],[150,84],[220,76],[290,82],[350,78]].map(([x,y],i) => (
              <ellipse key={i} cx={x} cy={y} rx={18 + i*2} ry={10 + i} fill="#8a7060" opacity="0.5" />
            ))}
          </svg>
          {/* Taproot going through stone */}
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <svg width="20" height="120" viewBox="0 0 20 120" fill="none">
              <path d="M10 0 Q9 50 10 100 L10 120" stroke="#5a3820" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Final message */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-x-0 pointer-events-none text-center text-xs"
          style={{ bottom: 130, color: `rgba(200,170,120,0.65)`, letterSpacing: '0.1em' }}
        >
          las raíces más antiguas llegan hasta aquí
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Small reusable SVG components ────────────────────────────────────────────

function BeeIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <ellipse cx="10" cy="8" rx="7" ry="4.5" fill="#fcd34d" />
      <line x1="7" y1="8" x2="13" y2="8" stroke="#92400e" strokeWidth="0.8" />
      <line x1="8.5" y1="5.5" x2="8.5" y2="10.5" stroke="#92400e" strokeWidth="0.8" />
      <line x1="11.5" y1="5.5" x2="11.5" y2="10.5" stroke="#92400e" strokeWidth="0.8" />
      <circle cx="16" cy="8" r="2.5" fill="#92400e" opacity="0.8" />
      <ellipse cx="7"  cy="4.5" rx="5" ry="2.5" fill="#bfdbfe" opacity="0.7" transform="rotate(-15 7 4.5)" />
      <ellipse cx="13" cy="4.5" rx="5" ry="2.5" fill="#bfdbfe" opacity="0.7" transform="rotate(15 13 4.5)" />
    </svg>
  );
}

function Mushroom({ color }: { color: string }) {
  return (
    <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
      <rect x="13" y="20" width="6" height="14" rx="2" fill="#d4b890" />
      <ellipse cx="16" cy="20" rx="14" ry="8" fill={color} />
      <ellipse cx="16" cy="17" rx="11" ry="7" fill={color} opacity="0.9" />
      {/* spots */}
      <circle cx="10" cy="16" r="2.5" fill="white" opacity="0.35" />
      <circle cx="20" cy="14" r="2"   fill="white" opacity="0.35" />
      <ellipse cx="16" cy="20" rx="2" ry="1.5" fill="white" opacity="0.25" />
    </svg>
  );
}

function BeetleIcon() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
      <ellipse cx="18" cy="16" rx="12" ry="8" fill="#3a2418" />
      <ellipse cx="18" cy="14" rx="10" ry="7" fill="#4a3020" />
      {/* wing split */}
      <line x1="18" y1="8" x2="18" y2="24" stroke="#2a1810" strokeWidth="1" opacity="0.6" />
      {/* head */}
      <circle cx="28" cy="14" r="6" fill="#3a2418" />
      <circle cx="30" cy="12" r="1.5" fill="#8a6040" />
      {/* antennae */}
      <path d="M30 10 Q34 6 36 4" stroke="#3a2418" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M30 10 Q33 5 34 2" stroke="#3a2418" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* legs */}
      <line x1="12" y1="16" x2="6"  y2="22" stroke="#3a2418" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="20" x2="8"  y2="26" stroke="#3a2418" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="16" x2="28" y2="22" stroke="#3a2418" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="20" x2="26" y2="26" stroke="#3a2418" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
