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
  return h >= start || h < end; // Wraps midnight
}

// ── Core selection logic ─────────────────────────────────────────────────────

function selectBloomMessage(
  garden: GardenState,
  hoursAway: number,
  state: MessageStorageState
): BloomMessage | null {
  const isReturn = hoursAway >= 3;
  const sessionsSinceLast = garden.wateringCount - state.lastShownAt;

  // Cooldown: require at least 2 waterings between messages (skip for returns)
  if (!isReturn && sessionsSinceLast < 2) return null;

  // Probability gate
  const probability = isReturn ? 0.75 : 0.20;
  if (Math.random() > probability) return null;

  // Category weights
  const weights: Record<MessageCategory, number> = isReturn
    ? { garden: 0.85, pause: 0.10, personal: 0.00, ambient: 0.05 }
    : { garden: 0.55, pause: 0.30, personal: 0.10, ambient: 0.05 };

  // Never show personal twice in a row
  if (state.lastWasPersonal) {
    weights.personal = 0;
    weights.garden += 0.07;
    weights.pause  += 0.03;
  }

  const category = pickCategory(weights);

  // Build candidate pool — exclude recently shown IDs
  let pool = MESSAGES.filter(m => {
    if (m.category !== category) return false;
    if (state.recentIds.includes(m.id)) return false;
    if (m.category === 'ambient') return isAmbientActive(m.timeRange);
    return true;
  });

  // Fallback: if the chosen category is exhausted, try garden
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
 * Computed once per GardenScreen mount (= once per visit after watering or app open).
 * Persists selection history in localStorage to avoid repetition.
 */
export function useBloomMessage(
  garden: GardenState | null,
  hoursAway: number
): string | null {
  // Computed once — stored in ref so it doesn't change on re-renders
  const resolved = useRef<string | null>(undefined as unknown as string | null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Run only once per mount
    if (resolved.current !== undefined) return;

    if (!garden) {
      resolved.current = null;
      return;
    }

    const state = loadMessageState();
    const selected = selectBloomMessage(garden, hoursAway, state);
    resolved.current = selected?.text ?? null;

    if (selected) {
      saveMessageState(selected, garden.wateringCount);
    }

    setMessage(resolved.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return message;
}
