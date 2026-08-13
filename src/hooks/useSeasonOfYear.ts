'use client';

import { useState, useEffect } from 'react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// Meteorological seasons — simpler than astronomical, no exact date needed
function getCurrentSeason(): Season {
  const m = new Date().getMonth(); // 0-11
  if (m >= 2 && m <= 4)  return 'spring';  // Mar–May
  if (m >= 5 && m <= 7)  return 'summer';  // Jun–Aug
  if (m >= 8 && m <= 10) return 'autumn';  // Sep–Nov
  return 'winter';                           // Dec–Feb
}

/**
 * Returns the current meteorological season, re-checked daily.
 * SSR-safe: starts with 'spring', resolves to real season on client.
 */
export function useSeasonOfYear(): Season {
  const [season, setSeason] = useState<Season>('spring');

  useEffect(() => {
    setSeason(getCurrentSeason());
    const t = setInterval(() => setSeason(getCurrentSeason()), 86_400_000); // daily
    return () => clearInterval(t);
  }, []);

  return season;
}
