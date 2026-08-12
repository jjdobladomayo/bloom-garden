import { GardenState } from '@/types/garden';
import { BloomMessage } from '@/data/messages';

// ── Message history ──────────────────────────────────────────────────────────

const MSG_KEY = 'bloom_msgs_v1';

export interface MessageStorageState {
  recentIds: number[];      // Last 10 shown IDs (avoid repetition)
  lastShownAt: number;      // wateringCount when last message was shown
  lastWasPersonal: boolean; // Prevent consecutive personal messages
}

const DEFAULT_MSG_STATE: MessageStorageState = {
  recentIds: [],
  lastShownAt: -99,
  lastWasPersonal: false,
};

export function loadMessageState(): MessageStorageState {
  if (typeof window === 'undefined') return DEFAULT_MSG_STATE;
  try {
    const raw = localStorage.getItem(MSG_KEY);
    return raw ? { ...DEFAULT_MSG_STATE, ...JSON.parse(raw) } : DEFAULT_MSG_STATE;
  } catch {
    return DEFAULT_MSG_STATE;
  }
}

export function saveMessageState(message: BloomMessage, wateringCount: number): void {
  if (typeof window === 'undefined') return;
  try {
    const prev = loadMessageState();
    const recentIds = [...prev.recentIds, message.id].slice(-10);
    const next: MessageStorageState = {
      recentIds,
      lastShownAt: wateringCount,
      lastWasPersonal: message.category === 'personal',
    };
    localStorage.setItem(MSG_KEY, JSON.stringify(next));
  } catch { /* fail silently */ }
}

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
