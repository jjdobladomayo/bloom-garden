'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MilestoneId } from '@/types/garden';
import { MILESTONE_META } from '@/utils/milestones';

const AUTO_DISMISS_MS = 6000;

interface Props {
  milestoneId: MilestoneId;
  unlockedAt?: number;
  onClose: () => void;
}

export default function MilestoneScreen({ milestoneId, unlockedAt, onClose }: Props) {
  const meta       = MILESTONE_META[milestoneId];
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(() => onCloseRef.current(), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, []);

  const isDark  = meta.bg === '#141e2e' || meta.bg === '#0d1224';

  // Format the display date
  const dateLabel = (() => {
    const ts = unlockedAt ?? Date.now();
    const d  = new Date(ts);
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d.getDate()} ${months[d.getMonth()]} · ${d.getFullYear()}`;
  })();

  // Split phrase on \n for multi-line
  const phraseLines = meta.phrase.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center safe-top safe-bottom"
      style={{ backgroundColor: meta.bg }}
      onClick={onClose}
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: meta.hintColor
            ? `radial-gradient(ellipse at 50% 40%, ${meta.hintColor} 0%, transparent 65%)`
            : undefined,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-10 max-w-xs w-full">

        {/* Emoji — springs in */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.1 }}
          className="text-7xl leading-none mb-8 select-none"
          style={{ filter: isDark ? 'drop-shadow(0 0 20px rgba(255,255,255,0.08))' : undefined }}
        >
          {meta.emoji}
        </motion.div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
          className="text-base font-light tracking-wide leading-snug mb-3"
          style={{ color: meta.titleColor }}
        >
          {meta.title}
        </motion.p>

        {/* Phrase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.0, ease: 'easeInOut' }}
          className="text-xs font-light tracking-wide leading-relaxed"
          style={{ color: meta.phraseColor }}
        >
          {phraseLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < phraseLines.length - 1 && <br />}
            </span>
          ))}
        </motion.div>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-xs tracking-widest mt-6"
          style={{ color: meta.phraseColor, fontSize: '0.65rem', letterSpacing: '0.12em' }}
        >
          {dateLabel}
        </motion.p>

        {/* Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex gap-1.5 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 5,
                height: 5,
                backgroundColor: i === 1 ? meta.phraseColor : 'transparent',
                border: `1px solid ${meta.phraseColor}`,
                opacity: i === 1 ? 0.7 : 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* "toca para salir" */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.28 : 0.35 }}
        transition={{ delay: 2.5, duration: 1.2 }}
        className="absolute bottom-10 text-xs tracking-widest pointer-events-none select-none"
        style={{ color: meta.phraseColor }}
      >
        toca para continuar
      </motion.p>
    </motion.div>
  );
}
