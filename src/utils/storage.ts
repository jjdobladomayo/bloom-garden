import { GardenState } from '@/types/garden';

const KEY = 'bloom_garden_v1';

export function loadGarden(): GardenState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GardenState) : null;
  } catch {
    return null;
  }
}

export function saveGarden(state: GardenState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage might be full — fail silently
  }
}

export function clearGarden(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
