import {
  GardenState,
  GrowthStage,
  PassiveElement,
  PassiveElementType,
  SecondaryPlant,
  STAGE_ORDER,
  STAGE_THRESHOLDS,
} from '@/types/garden';

export function createInitialGarden(name = 'Mi planta'): GardenState {
  return {
    stage: 'seed',
    wateringCount: 0,
    lastWatered: null,
    streakDays: 0,
    lastOpenedAt: Date.now(),
    passiveElements: [],
    plantName: name.trim() || 'Mi planta',
    createdAt: Date.now(),
    newPassiveElements: [],
  };
}

export function getStageFromCount(count: number): GrowthStage {
  let stage: GrowthStage = 'seed';
  for (const s of STAGE_ORDER) {
    if (count >= STAGE_THRESHOLDS[s]) stage = s;
    else break;
  }
  return stage;
}

export function getNextStage(current: GrowthStage): GrowthStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}

export function wateringsUntilNextStage(state: GardenState): number | null {
  const next = getNextStage(state.stage);
  if (!next) return null;
  return STAGE_THRESHOLDS[next] - state.wateringCount;
}

export function getStageProgress(state: GardenState): number {
  const next = getNextStage(state.stage);
  if (!next) return 1;
  const start = STAGE_THRESHOLDS[state.stage];
  const end = STAGE_THRESHOLDS[next];
  return (state.wateringCount - start) / (end - start);
}

// ─── Passive growth ────────────────────────────────────────────────────────

const ALL_TYPES: PassiveElementType[] = [
  'leaf',
  'flower',
  'butterfly',
  'bird',
  'stone',
  'mushroom',
  'dewdrop',
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generatePassiveElements(hoursAway: number): PassiveElement[] {
  if (hoursAway < 3) return [];
  const count = Math.min(Math.floor(hoursAway / 4) + 1, 3);
  return Array.from({ length: count }, (_, i) => ({
    type: ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)],
    id: `pe_${Date.now()}_${i}`,
    addedAt: Date.now(),
    position: { x: rand(15, 85), y: rand(55, 88) },
  }));
}

// ─── State transitions ──────────────────────────────────────────────────────

export function processWatering(state: GardenState): GardenState {
  const now = Date.now();
  const newCount = state.wateringCount + 1;
  const newStage = getStageFromCount(newCount);

  let newStreak = state.streakDays;
  if (state.lastWatered) {
    const daysSince = (now - state.lastWatered) / 86_400_000;
    if (daysSince < 1) {
      // already watered today — streak unchanged
    } else if (daysSince < 2) {
      newStreak = state.streakDays + 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  // ── Secondary seedling ─────────────────────────────────────────────────────
  // When the main plant reaches (or is already at) tree stage, a new seed
  // quietly appears and grows with each subsequent watering.
  let secondaryPlant: SecondaryPlant | undefined = state.secondaryPlant;

  if (newStage === 'tree') {
    if (!secondaryPlant) {
      // Tree just completed (or first watering on an existing tree) — seed emerges
      secondaryPlant = { wateringCount: 0, appearedAt: now };
    } else {
      // Grow the seedling one step (capped — it can also become a tree eventually)
      secondaryPlant = { ...secondaryPlant, wateringCount: secondaryPlant.wateringCount + 1 };
    }
  }

  return {
    ...state,
    wateringCount: newCount,
    stage: newStage,
    lastWatered: now,
    streakDays: newStreak,
    newPassiveElements: [],
    secondaryPlant,
  };
}

export function processReturn(state: GardenState): {
  updatedState: GardenState;
  hoursAway: number;
} {
  const now = Date.now();
  const hoursAway = (now - state.lastOpenedAt) / 3_600_000;
  const newElements = generatePassiveElements(hoursAway);
  const allElements = [...state.passiveElements, ...newElements].slice(-8);

  return {
    updatedState: {
      ...state,
      lastOpenedAt: now,
      passiveElements: allElements,
      newPassiveElements: newElements,
    },
    hoursAway,
  };
}

// ─── Display helpers ────────────────────────────────────────────────────────

export function formatLastWatered(ts: number | null): string {
  if (!ts) return 'Nunca';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return 'Justo ahora';
  if (m < 60) return `Hace ${m} min`;
  if (h < 24) return `Hace ${h}h`;
  if (d === 1) return 'Ayer';
  return `Hace ${d} días`;
}
