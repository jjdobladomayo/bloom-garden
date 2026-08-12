'use client';

import { motion } from 'framer-motion';

interface Props {
  progress: number;   // 0–1
  isActive: boolean;
  isCompleted: boolean;
}

const SIZE = 200;
const STROKE = 6;
const R = (SIZE - STROKE * 2) / 2;
const C = 2 * Math.PI * R;

export default function CircularProgress({ progress, isActive, isCompleted }: Props) {
  const offset = C * (1 - progress);
  const btnColor = isCompleted ? '#4a8c48' : isActive ? '#4a8c48' : '#7cb87a';

  return (
    <div
      className="relative flex items-center justify-center no-select"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Track ring */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute -rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="#e0d5c5"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={btnColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transition={{ duration: 0.04, ease: 'linear' }}
        />
      </svg>

      {/* Pulse ring when active */}
      {isActive && (
        <div
          className="absolute rounded-full pulse-ring"
          style={{
            width: SIZE - 36,
            height: SIZE - 36,
            border: `2px solid ${btnColor}`,
            opacity: 0.4,
          }}
        />
      )}

      {/* Center button */}
      <motion.div
        className="relative rounded-full flex items-center justify-center shadow-md"
        style={{
          width: SIZE - 36,
          height: SIZE - 36,
          backgroundColor: btnColor,
        }}
        animate={{ scale: isActive ? [1, 1.025, 1] : 1 }}
        transition={isActive ? { repeat: Infinity, duration: 1.4 } : {}}
      >
        <span className="text-5xl select-none" role="img">
          {isCompleted ? '🌿' : isActive ? '💧' : '☁️'}
        </span>
      </motion.div>
    </div>
  );
}
