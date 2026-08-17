'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FEATURES, Feature } from '@/data/features';

// ── Card ─────────────────────────────────────────────────────────────────────

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const isDark = feature.bg === '#141e2e' || feature.bg === '#0d1224';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.5, ease: 'easeOut' }}
      style={{
        backgroundColor: feature.bg,
        borderRadius: 20,
        padding: '1.5rem',
        marginBottom: '0.875rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle inner glow for dark cards */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(100,180,200,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top row: emoji + NEW badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>{feature.emoji}</span>
        {feature.isNew && (
          <span
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: 99,
              border: `1px solid ${feature.subColor}`,
              color: feature.subColor,
              opacity: 0.85,
            }}
          >
            nuevo
          </span>
        )}
      </div>

      {/* Title */}
      <p
        style={{
          fontSize: '0.9375rem',
          fontWeight: 400,
          color: feature.titleColor,
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {feature.title}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: '0.8125rem',
          fontWeight: 300,
          color: feature.subColor,
          margin: '0.5rem 0 0',
          lineHeight: 1.7,
        }}
      >
        {feature.description}
      </p>

      {/* Date */}
      <p
        style={{
          fontSize: '0.6875rem',
          letterSpacing: '0.08em',
          color: feature.subColor,
          opacity: 0.6,
          margin: '1rem 0 0',
        }}
      >
        {feature.date}
      </p>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NovedadesPage() {
  const newCount = FEATURES.filter((f) => f.isNew).length;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: '0 0 6rem',
        minHeight: '100vh',
        backgroundColor: '#fdfaf6',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header style={{ padding: '3.5rem 1.5rem 0' }}>
        {/* Brand link */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '1.1rem',
              fontWeight: 200,
              letterSpacing: '0.2em',
              color: '#b8b0a4',
              display: 'block',
            }}
          >
            bloom
          </motion.span>
        </Link>

        {/* Page title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontSize: '1.75rem',
            fontWeight: 300,
            color: '#2d2d2d',
            margin: '0.35rem 0 0',
            letterSpacing: '-0.01em',
          }}
        >
          novedades
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: '0.875rem',
            fontWeight: 300,
            color: '#9c9489',
            margin: '0.4rem 0 0',
          }}
        >
          Un jardín que mejora despacio.
        </motion.p>

        {/* Stats pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.25rem',
            marginBottom: '1.75rem',
            padding: '5px 12px',
            borderRadius: 99,
            backgroundColor: '#f0ece6',
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            color: '#b8b0a4',
          }}
        >
          <span>{FEATURES.length} features</span>
          <span style={{ opacity: 0.4 }}>·</span>
          {newCount > 0 && (
            <>
              <span style={{ color: '#7ca48c' }}>{newCount} nuevas</span>
              <span style={{ opacity: 0.4 }}>·</span>
            </>
          )}
          <span>agosto 2025</span>
        </motion.div>
      </header>

      {/* ── Feature cards ────────────────────────────────────────────────── */}
      <main style={{ padding: '0 1rem' }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.id} feature={f} index={i} />
        ))}
      </main>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * FEATURES.length + 0.3, duration: 0.5 }}
        style={{ padding: '0.5rem 1rem 0' }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
          <div
            style={{
              backgroundColor: '#7cb87a',
              borderRadius: 20,
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '0.25rem',
                }}
              >
                Empieza tu jardín
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Gratis · Sin registro · En tu teléfono
              </div>
            </div>
            <span style={{ fontSize: '1.5rem' }}>🌱</span>
          </div>
        </Link>
      </motion.div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * FEATURES.length + 0.6, duration: 0.5 }}
        style={{
          padding: '2rem 1.5rem 0',
          textAlign: 'center',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          color: '#ccc5bc',
        }}
      >
        <p>bloom · tu jardín digital</p>
      </motion.footer>
    </div>
  );
}
