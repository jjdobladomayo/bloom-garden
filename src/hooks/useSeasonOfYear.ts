'use client';

import { useState, useEffect } from 'react';
import { seasonKeyAt } from '@/utils/garden';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Returns the current astronomical season using the same equinox-based
 * logic as garden.ts → seasonKeyAt, so spawn logic and visuals always agree.
 * SSR-safe: starts with 'spring', resolves to real season on client.
 * Re-checked every 6 hours (season boundaries can shift mid-day).
 */
export function useSeasonOfYear(): Season {
  const [season, setSeason] = useState<Season>('spring');

  useEffect(() => {
    const update = () => setSeason(seasonKeyAt(Date.now()));
    update();
    const t = setInterval(update, 6 * 3_600_000); // every 6 h
    return () => clearInterval(t);
  }, []);

  return season;
}
