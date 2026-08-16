import {
  GardenState,
  GrowthStage,
  PassiveElement,
  PassiveElementType,
  Puddle,
  SecondaryPlant,
  TreeMaturity,
  STAGE_ORDER,
  STAGE_THRESHOLDS,
} from '@/types/garden';

export function createInitialGarden(name = 'Mi planta'): GardenState {
  const today = Math.floor(Date.now() / 86_400_000);
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
    dailyWateringCount: 0,
    lastWateringDay: today,
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

// ─── Tree maturity ──────────────────────────────────────────────────────────

export function getTreeMaturity(wateringCount: number): TreeMaturity {
  if (wateringCount >= 500) return 'centenarian';
  if (wateringCount >= 365) return 'old';
  if (wateringCount >= 200) return 'mature';
  if (wateringCount >= 100) return 'adult';
  return 'young';
}

export const TREE_MATURITY_LABELS: Record<TreeMaturity, string> = {
  young:       'Árbol joven',
  adult:       'Árbol adulto',
  mature:      'Árbol maduro',
  old:         'Árbol viejo',
  centenarian: 'Árbol centenario',
};

// ─── Passive growth ────────────────────────────────────────────────────────

const ALL_TYPES: PassiveElementType[] = [
  'leaf', 'flower', 'butterfly', 'bird', 'stone', 'mushroom', 'dewdrop',
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

// ─── Garden age ─────────────────────────────────────────────────────────────

/**
 * Human-readable age of the garden since createdAt.
 * Returns phrases like "recién nacido", "3 semanas", "2 meses", "1 año".
 */
export function getGardenAgeLabel(createdAt: number): string {
  const days = Math.floor((Date.now() - createdAt) / 86_400_000);
  if (days <= 0)  return 'recién nacido';
  if (days === 1) return '1 día';
  if (days <  7)  return `${days} días`;
  if (days < 14)  return '1 semana';
  if (days < 30)  return `${Math.floor(days / 7)} semanas`;
  if (days < 60)  return '1 mes';
  if (days < 365) return `${Math.floor(days / 30)} meses`;
  if (days < 730) return '1 año';
  return `${Math.floor(days / 365)} años`;
}

// ─── Seasons lived ────────────────────────────────────────────────────────────

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

const SEASON_ES: Record<SeasonKey, string> = {
  spring: 'primavera',
  summer: 'verano',
  autumn: 'otoño',
  winter: 'invierno',
};

function seasonKeyAt(ts: number): SeasonKey {
  const d   = new Date(ts);
  const m   = d.getMonth();  // 0-11
  const day = d.getDate();
  if (m < 2  || (m === 2  && day < 20)) return 'winter';
  if (m < 5  || (m === 5  && day < 21)) return 'spring';
  if (m < 8  || (m === 8  && day < 23)) return 'summer';
  if (m < 11 || (m === 11 && day < 21)) return 'autumn';
  return 'winter';
}

/**
 * Returns a phrase describing how many seasons the garden has experienced
 * AFTER its birth season, e.g. "ha vivido 1 otoño" or "ha visto 3 estaciones".
 * Returns null if still in the same season as when it was born.
 */
export function getSeasonsLivedLabel(createdAt: number): string | null {
  const now      = Date.now();
  const birthKey = `${new Date(createdAt).getFullYear()}-${seasonKeyAt(createdAt)}`;

  // Walk in 15-day steps to catch every season boundary
  const seen    = new Set<string>([birthKey]);
  const entered: SeasonKey[] = [];

  let cursor = createdAt + 15 * 86_400_000;
  while (cursor <= now) {
    const d   = new Date(cursor);
    const key = `${d.getFullYear()}-${seasonKeyAt(cursor)}`;
    if (!seen.has(key)) {
      seen.add(key);
      entered.push(seasonKeyAt(cursor));
    }
    cursor += 15 * 86_400_000;
  }
  // Ensure the current moment is covered
  const nowD   = new Date(now);
  const nowKey = `${nowD.getFullYear()}-${seasonKeyAt(now)}`;
  if (!seen.has(nowKey)) entered.push(seasonKeyAt(now));

  const n = entered.length;
  if (n === 0) return null;
  if (n === 1) return `ha vivido 1 ${SEASON_ES[entered[0]]}`;
  if (n < 4)   return `ha vivido ${n} estaciones`;
  return 'ha visto todas las estaciones';
}

// ─── Daily rhythm ───────────────────────────────────────────────────────────

/** How many times the garden has been watered today (0–5). Day-rollover safe. */
export function getDailyWateringCount(state: GardenState): number {
  const today = Math.floor(Date.now() / 86_400_000);
  if ((state.lastWateringDay ?? 0) < today) return 0;
  return state.dailyWateringCount ?? 0;
}

/** True if there is still room for more waterings today (< 5). */
export function canWaterMore(state: GardenState): boolean {
  return getDailyWateringCount(state) < 5;
}

/** True if the garden has been watered at least once today. */
export function wateredToday(state: GardenState): boolean {
  return getDailyWateringCount(state) > 0;
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
  const day = Math.floor(Date.now() / 86_400_000);
  return phrases[day % phrases.length];
}

/** How long a puddle lasts depends on the time of day (sun evaporates it). */
function getPuddleLifeMs(): number {
  const h = new Date().getHours();
  if (h >= 8 && h < 18) return 3 * 3_600_000;  // daytime — 3 hours
  if (h >= 18 && h < 22) return 5 * 3_600_000; // evening — 5 hours
  return 8 * 3_600_000;                          // night — 8 hours
}

// ─── State transitions ──────────────────────────────────────────────────────

export function processWatering(state: GardenState): GardenState {
  const now   = Date.now();
  const today = Math.floor(now / 86_400_000);

  // Detect day rollover
  const isNewDay    = (state.lastWateringDay ?? 0) < today;
  const dailyCount  = isNewDay ? 0 : (state.dailyWateringCount ?? 0);

  // Hard cap: 5 waterings per day
  if (dailyCount >= 5) return state;

  const newDailyCount = dailyCount + 1;

  // ── Growth: only the first watering of the day advances the plant ──────────
  let newCount      = state.wateringCount;
  let newStage      = state.stage;
  let newStreak     = state.streakDays;
  let secondaryPlant: SecondaryPlant | undefined = state.secondaryPlant;

  if (dailyCount === 0) {
    newCount = state.wateringCount + 1;
    newStage = getStageFromCount(newCount);

    if (state.lastWatered) {
      const daysSince = (now - state.lastWatered) / 86_400_000;
      if (daysSince >= 2)      newStreak = 1;
      else if (daysSince >= 1) newStreak = state.streakDays + 1;
      // else: same day — streak unchanged (shouldn't happen with new system)
    } else {
      newStreak = 1;
    }

    if (newStage === 'tree') {
      secondaryPlant = !secondaryPlant
        ? { wateringCount: 0, appearedAt: now }
        : { ...secondaryPlant, wateringCount: secondaryPlant.wateringCount + 1 };
    }
  }

  // ── Puddle: forms on the 5th watering, evaporates naturally ────────────────
  let puddle: Puddle | undefined = state.puddle;
  if (puddle && now > puddle.evaporatesAt) puddle = undefined;
  if (newDailyCount === 5) {
    puddle = { formedAt: now, evaporatesAt: now + getPuddleLifeMs() };
  }

  return {
    ...state,
    wateringCount:       newCount,
    stage:               newStage,
    lastWatered:         now,
    streakDays:          newStreak,
    dailyWateringCount:  newDailyCount,
    lastWateringDay:     today,
    newPassiveElements:  [],
    secondaryPlant,
    puddle,
  };
}

export function processReturn(state: GardenState): {
  updatedState: GardenState;
  hoursAway: number;
} {
  const now    = Date.now();
  const today  = Math.floor(now / 86_400_000);
  const hoursAway = (now - state.lastOpenedAt) / 3_600_000;

  const newElements  = generatePassiveElements(hoursAway);
  const allElements  = [...state.passiveElements, ...newElements].slice(-8);

  // Evaporate puddle if time has passed
  let puddle = state.puddle;
  if (puddle && now > puddle.evaporatesAt) puddle = undefined;

  // Reset daily count on new day
  const isNewDay           = (state.lastWateringDay ?? 0) < today;
  const dailyWateringCount = isNewDay ? 0 : (state.dailyWateringCount ?? 0);
  const lastWateringDay    = isNewDay ? today : (state.lastWateringDay ?? today);

  return {
    updatedState: {
      ...state,
      lastOpenedAt:        now,
      passiveElements:     allElements,
      newPassiveElements:  newElements,
      puddle,
      dailyWateringCount,
      lastWateringDay,
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
  if (m < 1)  return 'Justo ahora';
  if (m < 60) return `Hace ${m} min`;
  if (h < 24) return `Hace ${h}h`;
  if (d === 1) return 'Ayer';
  return `Hace ${d} días`;
}
