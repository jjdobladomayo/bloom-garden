'use client';

import { motion } from 'framer-motion';
import { Milestone } from '@/types/garden';
import {
  MILESTONE_META,
  MILESTONE_STORY_ORDER,
  formatMilestoneDate,
} from '@/utils/milestones';

interface Props {
  milestones: Milestone[];
  onClose: () => void;
}

export default function MemoriasScreen({ milestones, onClose }: Props) {
  // Sort chronologically (oldest first) — tell the story from the beginning
  const sorted = [...milestones].sort((a, b) => a.unlockedAt - b.unlockedAt);
  const unlockedIds = new Set(sorted.map((m) => m.id));

  // Next 2 important milestones not yet unlocked (teaser)
  const teasers = MILESTONE_STORY_ORDER
    .filter((id) => !unlockedIds.has(id) && MILESTONE_META[id].important)
    .slice(0, 2);

  // Category labels
  const CAT_LABEL: Record<string, string> = {
    tiempo:       'Tiempo',
    crecimiento:  'Crecimiento',
    ecosistema:   'Visitantes del árbol',
    visita:       'Visitas al jardín',
    regalo:       'Regalos del jardín',
    estación:     'Estaciones',
    especial:     'Momentos especiales',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col safe-top safe-bottom"
      style={{ backgroundColor: '#fdfaf6' }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 pt-14 pb-4"
        style={{ borderBottom: '0.5px solid #ede8e0' }}
      >
        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: '#b8b0a4' }}
        >
          Memorias
        </span>
        <button
          onClick={onClose}
          className="active:opacity-50 transition-opacity p-1"
          aria-label="Cerrar"
        >
          <span style={{ color: '#b8b0a4', fontSize: '1.1rem' }}>✕</span>
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {sorted.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mt-20 text-center"
          >
            <div className="text-4xl mb-5 opacity-40">🌱</div>
            <p className="text-sm" style={{ color: '#b8b0a4' }}>
              El jardín está empezando.
            </p>
            <p className="text-xs mt-1.5" style={{ color: '#ccc5bc' }}>
              Los recuerdos aparecerán aquí.
            </p>
          </motion.div>
        ) : (
          <div>
            {sorted.map((m, idx) => {
              const meta     = MILESTONE_META[m.id];
              const date     = formatMilestoneDate(m.unlockedAt);
              const prevMeta = idx > 0 ? MILESTONE_META[sorted[idx - 1].id] : null;
              const showCat  = !prevMeta || prevMeta.category !== meta.category;

              return (
                <div key={m.id}>
                  {/* Category divider */}
                  {showCat && (
                    <div
                      className="text-xs uppercase tracking-widest mb-3 mt-5 first:mt-0"
                      style={{ color: '#d4cdc5' }}
                    >
                      {CAT_LABEL[meta.category] ?? meta.category}
                    </div>
                  )}

                  {/* Milestone row */}
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.4 }}
                    className="flex gap-3 items-start mb-5"
                  >
                    {/* Emoji + connector line */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="text-2xl leading-none">{meta.emoji}</div>
                      {idx < sorted.length - 1 && (
                        <div
                          className="w-px flex-1"
                          style={{
                            minHeight: 16,
                            backgroundColor: '#ede8e0',
                          }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className="text-sm"
                          style={{ color: '#4a4540' }}
                        >
                          {meta.title}
                        </span>
                        <span
                          className="text-xs flex-shrink-0"
                          style={{ color: '#c8c0b8', fontSize: '0.65rem' }}
                        >
                          {date}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed mt-0.5 font-light"
                        style={{ color: '#9c9489' }}
                      >
                        {meta.phrase.replace(/\n/g, ' ')}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Future teasers ──────────────────────────────────────────────── */}
        {teasers.length > 0 && (
          <div className="mt-6">
            <div
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#d4cdc5' }}
            >
              Próximos
            </div>
            {teasers.map((id) => {
              const meta = MILESTONE_META[id];
              return (
                <div
                  key={id}
                  className="flex gap-3 items-center mb-4 select-none"
                  style={{ opacity: 0.32 }}
                >
                  <div className="text-2xl leading-none flex-shrink-0">{meta.emoji}</div>
                  <div className="flex-1">
                    <div
                      className="rounded-full h-2"
                      style={{
                        width: '60%',
                        backgroundColor: '#d4cdc5',
                      }}
                    />
                    <div
                      className="rounded-full h-1.5 mt-1.5"
                      style={{
                        width: '40%',
                        backgroundColor: '#e0dbd5',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-16" />
      </div>
    </motion.div>
  );
}
