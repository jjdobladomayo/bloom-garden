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

// ─── Daily rhythm ───────────────────────────────────────────────────────────

/** True if the garden was already watered today (calendar day, local time). */
export function wateredToday(state: GardenState): boolean {
  if (!state.lastWatered) return false;
  const last = new Date(state.lastWatered);
  const now  = new Date();
  return (
    last.getFullYear() === now.getFullYear() &&
    last.getMonth()    === now.getMonth()    &&
    last.getDate()     === now.getDate()
  );
}

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const DAILY_PHRASES: Record<Season, string[]> = {
  spring: [
    'Debajo de la tierra, algo ya se mueve.',
    'La primavera no llega. Siempre estaba ahí.',
    'Las flores no saben que son bonitas.',
    'Un brote nuevo, aunque no lo veas aún.',
    'La lluvia de primavera no pregunta si es buen momento.',
    'Todo empieza siendo una semilla.',
    'Hay cosas que crecen despacio. Y eso está bien.',
  ],
  summer: [
    'El sol no pide permiso.',
    'En verano, las sombras también crecen.',
    'Hay plantas que florecen solo en el calor.',
    'Tu jardín respira despacio hoy.',
    'Nada florece sin luz. Nada dura sin raíz.',
    'El verano también es silencio entre dos tormentas.',
    'Quedarse quieto también es crecer.',
  ],
  autumn: [
    'Soltar también es una forma de crecer.',
    'Las hojas caen sin miedo.',
    'El otoño no es una despedida.',
    'Lo que se va abona lo que viene.',
    'El viento lleva las semillas lejos. Eso también es crecer.',
    'No todo lo que cae está perdido.',
    'Algunos jardines florecen en silencio.',
  ],
  winter: [
    'Bajo la nieve, las semillas esperan.',
    'El frío también es una estación necesaria.',
    'Los árboles no temen quedarse sin hojas.',
    'El descanso también es crecer.',
    'Hay raíces que solo se forman en invierno.',
    'El silencio de invierno también es jardín.',
    'Lo que descansa, después florece con más fuerza.',
  ],
};

/**
 * Returns the same phrase for every user on a given calendar day.
 * Cycles through the seasonal list on a 7-day rhythm.
 */
export function getDailyPhrase(season: Season): string {
  const phrases = DAILY_PHRASES[season];
  const day = Math.floor(Date.now() / 86_400_000); // UTC day index
  return phrases[day % phrases.length];
}

// ─── State transitions ──────────────────────────────────────────────────────

export function processWatering(state: GardenState): GardenState {
  // Extra waterings after the first of the day don't grow the plant.
  // The ritual is still meaningful; the growth waits for tomorrow.
  if (wateredToday(state)) return state;

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
