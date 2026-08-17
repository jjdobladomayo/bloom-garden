'use client';

import { useState, useEffect } from 'react';

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

function getCurrentTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5  && h < 8)  return 'dawn';
  if (h >= 8  && h < 13) return 'morning';
  if (h >= 13 && h < 20) return 'afternoon'; // Spain: still light until ~21h in summer
  if (h >= 20 && h < 22) return 'evening';   // proper dusk — nocturnal creatures appear
  return 'night'; // 22–5h
}

/**
 * Returns the current time-of-day period, updated every minute.
 * SSR-safe: starts with 'afternoon' on server, resolves to real value on client.
 */
export function useTimeOfDay(): TimeOfDay {
  const [tod, setTod] = useState<TimeOfDay>('afternoon');

  useEffect(() => {
    setTod(getCurrentTimeOfDay());
    const t = setInterval(() => setTod(getCurrentTimeOfDay()), 60_000);
    return () => clearInterval(t);
  }, []);

  return tod;
}
