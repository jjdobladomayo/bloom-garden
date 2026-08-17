'use client';

import { motion } from 'framer-motion';

interface Props {
  text: string;
  dark: boolean;
}

export default function NarrativeCard({ text, dark }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        background: dark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 16,
        padding: '14px 16px',
        marginBottom: 12,
        border: dark
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid rgba(255,255,255,0.88)',
      }}
    >
      {/* Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.6rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: dark ? '#3a6878' : '#9868a8',
        marginBottom: 8,
      }}>
        <span style={{
          display: 'inline-block',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: dark ? '#3a6878' : '#9868a8',
          flexShrink: 0,
        }} />
        Lo que pasó hoy en el jardín
      </div>

      {/* Narrative */}
      <p style={{
        fontSize: '0.8rem',
        fontWeight: 300,
        color: dark ? '#7a9aaa' : '#4a3828',
        lineHeight: 1.72,
        margin: 0,
      }}>
        {text}
      </p>
    </motion.div>
  );
}
