'use client';

import { useRef, useState, useEffect } from 'react';
import { GardenState } from '@/types/garden';
import { MESSAGES, BloomMessage, MessageCategory } from '@/data/messages';
import { loadMessageState, saveMessageState, MessageStorageState } from '@/utils/storage';

// ── Weighted random category picker ─────────────────────────────────────────

function pickCategory(weights: Record<MessageCategory, number>): MessageCategory {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [cat, w] of Object.entries(weights) as [MessageCategory, number][]) {
    r -= w;
    if (r <= 0) return cat;
  }
  return 'garden';
}

// ── Ambient time check ───────────────────────────────────────────────────────

function isAmbientActive(timeRange?: [number, number]): boolean {
  if (!timeRange) return true;
  const h = new Date().getHours();
  const [start, end] = timeRange;
  if (start < end) return h >= start && h < end;
  return h >= start || h < end; // wraps midnight
}

// ── Core selection logic ─────────────────────────────────────────────────────

function selectBloomMessage(
  garden: GardenState,
  state: MessageStorageState
): BloomMessage | null {
  const isMaxStage = garden.stage === 'tree';

  // Probability gate:
  //   50% when the tree is complete — the message becomes the daily discovery
  //   20% otherwise — rare enough to feel special
  if (Math.random() > (isMaxStage ? 0.50 : 0.20)) return null;

  // Category weights
  const weights: Record<MessageCategory, number> = isMaxStage
    ? { garden: 0.30, pause: 0.15, personal: 0.05, ambient: 0.15, tree: 0.35 }
    : { garden: 0.55, pause: 0.30, personal: 0.10, ambient: 0.05, tree: 0.00 };

  // Never show personal twice in a row
  if (state.lastWasPersonal) {
    weights.personal = 0;
    // Redistribute proportionally to garden + tree (or pause for non-max)
    if (isMaxStage) weights.tree += 0.05;
    else            weights.garden += 0.05;
  }

  const category = pickCategory(weights);

  // Build candidate pool — exclude last 10 shown + time-filter ambient
  let pool = MESSAGES.filter(m => {
    if (m.category !== category) return false;
    if (state.recentIds.includes(m.id)) return false;
    if (m.category === 'ambient') return isAmbientActive(m.timeRange);
    return true;
  });

  // Fallback: if the chosen category pool is empty → try garden
  if (pool.length === 0 && category !== 'garden') {
    pool = MESSAGES.filter(
      m => m.category === 'garden' && !state.recentIds.slice(-5).includes(m.id)
    );
  }

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns a soft ambient message for the current garden session, or null.
 * Computed once per GardenScreen mount.
 * Frequency: 50% at max stage (tree), 20% otherwise.
 * History persisted in localStorage (bloom_msgs_v1) to avoid repetition.
 */
export function useBloomMessage(
  garden: GardenState | null,
  _hoursAway: number
): string | null {
  const resolved = useRef<string | null>(undefined as unknown as string | null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resolved.current !== undefined) return; // run only once per mount

    if (!garden) {
      resolved.current = null;
      return;
    }

    const state = loadMessageState();
    const selected = selectBloomMessage(garden, state);
    resolved.current = selected?.text ?? null;

    if (selected) saveMessageState(selected, garden.wateringCount);

    setMessage(resolved.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return message;
}
