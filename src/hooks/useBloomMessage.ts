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

// ── Core selection logic ─────────────────────────────────────────────────────

function selectBloomMessage(
  garden: GardenState,
  state: MessageStorageState
): BloomMessage | null {
  // 20% of all sessions show an ambient message — rarity makes it feel special
  if (Math.random() > 0.20) return null;

  // Category weights: 60 garden / 30 pause / 10 personal (per spec)
  const weights: Record<MessageCategory, number> = {
    garden:   0.60,
    pause:    0.30,
    personal: 0.10,
    ambient:  0.00, // ambient messages kept in data, not selected via weights
  };

  // Never show personal twice in a row
  if (state.lastWasPersonal) {
    weights.personal = 0;
    weights.garden  += 0.07;
    weights.pause   += 0.03;
  }

  const category = pickCategory(weights);

  // Build pool — exclude the last 10 shown IDs to avoid repetition
  let pool = MESSAGES.filter(
    m => m.category === category && !state.recentIds.includes(m.id)
  );

  // Fallback: category pool exhausted → try garden
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
 * History persisted in localStorage (bloom_msgs_v1) to avoid repetition.
 */
export function useBloomMessage(
  garden: GardenState | null,
  _hoursAway: number  // kept for API compatibility; no longer changes probability
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

    if (selected) {
      saveMessageState(selected, garden.wateringCount);
    }

    setMessage(resolved.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return message;
}
