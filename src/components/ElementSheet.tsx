'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PassiveElement } from '@/types/garden';
import { ELEMENT_LORE } from '@/data/elementLore';

interface Props {
  element: PassiveElement | null;
  onClose: () => void;
  dark: boolean;
}

export default function ElementSheet({ element, onClose, dark }: Props) {
  const lore = element ? ELEMENT_LORE[element.type] : null;

  return (
    <AnimatePresence>
      {element && lore && (
        <>
          {/* Dim overlay */}
          <motion.div
            key="el-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: dark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.18)',
              zIndex: 40,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="el-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: dark ? '#1a2a3a' : '#ffffff',
              borderRadius: '24px 24px 0 0',
              padding: '0 28px 44px',
              zIndex: 50,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.14)',
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 36,
              height: 4,
              background: dark ? '#2a4060' : '#ece8e2',
              borderRadius: 2,
              margin: '14px auto 22px',
            }} />

            {/* Emoji */}
            <div style={{ fontSize: '3rem', marginBottom: 12, lineHeight: 1 }}>
              {lore.emoji}
            </div>

            {/* Name */}
            <p style={{
              fontSize: '1rem',
              fontWeight: 400,
              color: dark ? '#c8d8e8' : '#2d2d2d',
              marginBottom: 10,
              letterSpacing: '-0.01em',
            }}>
              {lore.name}
            </p>

            {/* Description */}
            <p style={{
              fontSize: '0.84rem',
              fontWeight: 300,
              color: dark ? '#7a9aaa' : '#6b7280',
              lineHeight: 1.75,
              marginBottom: 18,
            }}>
              {lore.desc}
            </p>

            {/* Fleeting badge */}
            {element.expiresAt && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
                color: '#a06820',
                background: '#fef3e0',
                padding: '4px 11px',
                borderRadius: 99,
                marginBottom: 10,
              }}>
                <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#e09040' }} />
                Solo por unas horas
              </div>
            )}

            {/* Detail pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.7rem',
              letterSpacing: '0.07em',
              color: dark ? '#4a7888' : '#b8b0a4',
              background: dark ? 'rgba(255,255,255,0.05)' : '#f7f4f0',
              padding: '5px 12px',
              borderRadius: 99,
            }}>
              <span style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: dark ? '#4a7888' : '#c4b5a8',
              }} />
              {lore.detail}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
