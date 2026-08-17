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

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// y: distance from top (0=top, 100=bottom).
// PassiveElementDot uses  bottom: (100 - y)%  → high y = ground, low y = sky.
const TYPE_Y_RANGE: Record<PassiveElementType, [number, number]> = {
  stone:       [82, 92],
  mushroom:    [78, 90],
  flower:      [74, 88],
  dewdrop:     [76, 88],
  leaf:        [60, 82],
  butterfly:   [38, 68],
  bird:        [32, 62],
  snail:       [81, 90],
  worm:        [83, 90],
  clover:      [74, 88],
  hedgehog:    [80, 90],
  lizard:      [70, 80],
  acorn:       [82, 90],
  tulip:       [72, 86],
  autumn_leaf: [60, 82],
  snowflake:   [35, 70],
  bee:         [40, 70],
  ladybug:     [65, 82],
  ant:         [82, 92],
  feather:     [70, 88],
  spiderweb:   [45, 72],
  caterpillar: [68, 82],
  moss:        [80, 90],
  berries:     [62, 80],
  // Nocturnal regular
  bat:         [25, 55],
  beetle:      [82, 92],
  spider:      [58, 78],
  // Puddle creatures (positions overridden in GardenScreen — these are fallbacks)
  frog:        [88, 95],
  turtle:      [86, 93],
  // Regular owl (in tree branches)
  owl:         [36, 56],
  // Fleeting (entries below also cover the fleeting owl when it spawns as PassiveElement)
  rabbit:      [82, 92],
  firefly:     [45, 80],
  fox:         [83, 92],
  squirrel:    [52, 78],
  cricket:     [78, 90],
  rainbow:       [18, 38],
  eagle:         [12, 35],
  shooting_star: [8,  22],
  pawprints:     [83, 92],
};

// x: 0=left, 100=right. Trunk at 50%.
// Ground elements cluster near trunk; aerial ones roam freely.
const TYPE_X_RANGE: Record<PassiveElementType, [number, number]> = {
  stone:       [38, 62],
  mushroom:    [33, 67],
  flower:      [30, 70],
  dewdrop:     [38, 62],
  leaf:        [20, 80],
  butterfly:   [12, 88],
  bird:        [12, 88],
  snail:       [35, 65],
  worm:        [40, 60],
  clover:      [30, 68],
  hedgehog:    [35, 65],
  lizard:      [42, 58],
  acorn:       [38, 62],
  tulip:       [30, 70],
  autumn_leaf: [20, 80],
  snowflake:   [15, 85],
  bee:         [20, 80],
  ladybug:     [30, 70],
  ant:         [38, 62],
  feather:     [28, 72],
  spiderweb:   [25, 75],
  caterpillar: [32, 68],
  moss:        [40, 60],
  berries:     [32, 68],
  // Nocturnal regular
  bat:         [10, 90],
  beetle:      [38, 62],
  spider:      [30, 70],
  // Puddle creatures (positions overridden in GardenScreen)
  frog:        [36, 48],
  turtle:      [52, 64],
  // Fleeting
  owl:         [32, 68],
  rabbit:      [12, 40],
  firefly:     [15, 85],
  fox:         [10, 38],
  squirrel:    [38, 62],
  cricket:     [30, 70],
  rainbow:     [5,  95],
  eagle:       [5,  95],
  shooting_star: [5,  95],
  pawprints:     [15, 50],
};

// Seasonal pools — which types can appear each season.
// Richer in spring/summer; sparser and moodier in autumn/winter.
const SEASONAL_POOL: Record<SeasonKey, PassiveElementType[]> = {
  spring: ['leaf', 'flower', 'butterfly', 'bird', 'dewdrop', 'stone',
           'tulip', 'clover', 'worm', 'snail', 'mushroom',
           'bee', 'ladybug', 'ant', 'caterpillar',
           'bat', 'beetle'],
  summer: ['butterfly', 'bird', 'flower', 'dewdrop', 'stone', 'leaf',
           'lizard', 'worm', 'clover',
           'bee', 'ant',
           'bat', 'beetle'],
  autumn: ['autumn_leaf', 'mushroom', 'stone', 'bird', 'dewdrop',
           'acorn', 'snail', 'hedgehog',
           'spiderweb', 'moss', 'berries', 'feather',
           'bat', 'beetle', 'spider', 'owl'],
  winter: ['stone', 'dewdrop', 'mushroom', 'bird', 'snowflake',
           'spiderweb', 'moss', 'feather',
           'bat', 'spider', 'owl'],
};

// Time-of-day slots: derived from the real clock hour.
export type TimeSlot = 'night' | 'dawn' | 'day' | 'evening';

function timeSlotNow(): TimeSlot {
  const h = new Date().getHours();
  if (h >= 22 || h < 5)  return 'night';   // 22:00 – 04:59
  if (h >= 5  && h < 8)  return 'dawn';    // 05:00 – 07:59
  if (h >= 8  && h < 20) return 'day';     // 08:00 – 19:59
  return 'evening';                         // 20:00 – 21:59  (Spain: real dusk)
}

// Elements restricted to specific time slots.
// Elements NOT listed here can appear at any hour.
// Exported so GardenScreen can filter the visible dots by current time.
export const TIME_RESTRICTIONS: Partial<Record<PassiveElementType, TimeSlot[]>> = {
  hedgehog:    ['night'],                    // nocturnal — only at night
  dewdrop:     ['dawn'],                     // forms overnight, gone by mid-morning
  butterfly:   ['day'],                      // needs warm light
  bird:        ['dawn', 'day', 'evening'],   // never at night
  lizard:      ['day'],                      // cold-blooded, needs full sun
  bee:         ['day'],                      // needs daylight to navigate
  ladybug:     ['day'],                      // needs warmth and light
  ant:         ['dawn', 'day', 'evening'],   // colony active, not deep night
  caterpillar: ['day'],                      // feeds on leaves in daylight
  bat:         ['night', 'evening'],         // emerges at dusk, hunts all night
  beetle:      ['evening', 'night'],         // nocturnal scavenger
  spider:      ['night'],                    // hunts at night when web is active
  owl:         ['night', 'evening'],         // regular owl/lechuza, nocturnal
};

export function generatePassiveElements(
  hoursAway: number,
  stage: GrowthStage = 'seed',
): PassiveElement[] {
  if (hoursAway < 3) return [];
  const count  = Math.min(Math.floor(hoursAway / 4) + 1, 3);
  const season = seasonKeyAt(Date.now());
  const slot   = timeSlotNow();

  // 1. Season filter
  let pool: PassiveElementType[] = [...SEASONAL_POOL[season]];

  // 2. Stage filter
  if (stage !== 'tree')                            pool = pool.filter(t => t !== 'acorn');
  if (!['medium','large','tree'].includes(stage))  pool = pool.filter(t => t !== 'lizard');
  if (!['medium','large','tree'].includes(stage))  pool = pool.filter(t => t !== 'moss');
  if (!['large','tree'].includes(stage))           pool = pool.filter(t => t !== 'berries');
  if (!['large','tree'].includes(stage))           pool = pool.filter(t => t !== 'owl');
  // Puddle creatures are never in the passive pool — only spawned directly in GardenScreen
  pool = pool.filter(t => t !== 'frog' && t !== 'turtle');

  // 3. Time-of-day filter — only keep elements allowed at this hour
  pool = pool.filter(t => {
    const allowed = TIME_RESTRICTIONS[t];
    return !allowed || allowed.includes(slot);
  });

  if (pool.length === 0) pool = ['stone', 'leaf']; // fallback safety

  return Array.from({ length: count }, (_, i) => {
    const type = pool[Math.floor(Math.random() * pool.length)];
    const [yMin, yMax] = TYPE_Y_RANGE[type];
    const [xMin, xMax] = TYPE_X_RANGE[type];
    return {
      type,
      id: `pe_${Date.now()}_${i}`,
      addedAt: Date.now(),
      position: { x: rand(xMin, xMax), y: rand(yMin, yMax) },
    };
  });
}

// ─── Fleeting elements ──────────────────────────────────────────────────────

type FleetingElementType = 'owl' | 'rabbit' | 'firefly' | 'fox' | 'squirrel' | 'cricket' | 'rainbow' | 'eagle' | 'shooting_star' | 'pawprints';

interface FleetingConfig {
  /** Duration range [min, max] in milliseconds */
  durationMs: [number, number];
  /** Base probability per visit (0–1). Multiplied by visit bonus. */
  probability: number;
  seasons?: SeasonKey[];
  timeSlots?: TimeSlot[];
  /** Minimum total wateringCount required */
  minWaterings?: number;
  /** Minimum growth stage required */
  minStage?: GrowthStage;
}

const FLEETING_CONFIGS: Record<FleetingElementType, FleetingConfig> = {
  owl:      { durationMs: [3_600_000, 10_800_000], probability: 0.06, timeSlots: ['night'],                     minStage: 'tree' },
  rabbit:   { durationMs: [1_200_000,  2_700_000], probability: 0.11, timeSlots: ['dawn', 'evening'],           seasons: ['spring', 'autumn'] },
  firefly:  { durationMs: [1_800_000,  3_600_000], probability: 0.09, timeSlots: ['night'],                     seasons: ['summer'] },
  fox:      { durationMs: [3_600_000,  7_200_000], probability: 0.04, timeSlots: ['night'],                     seasons: ['winter'], minWaterings: 100 },
  squirrel: { durationMs: [2_700_000,  5_400_000], probability: 0.14, timeSlots: ['dawn', 'day', 'evening'],    seasons: ['autumn'], minStage: 'large' },
  cricket:  { durationMs: [7_200_000, 14_400_000], probability: 0.13, timeSlots: ['evening', 'night'],          seasons: ['summer', 'spring'] },
  rainbow:  { durationMs: [900_000,   1_800_000],  probability: 0.05, timeSlots: ['day'] },
  eagle:          { durationMs: [300_000,    900_000],   probability: 0.03, timeSlots: ['day'],   minWaterings: 200 },
  shooting_star:  { durationMs: [300_000,    600_000],   probability: 0.03, timeSlots: ['night'] },
  pawprints:      { durationMs: [1_800_000, 3_600_000],  probability: 0.10, timeSlots: ['dawn'] },
};

const STAGE_ORDER_INDEX: Record<GrowthStage, number> = {
  seed: 0, sprout: 1, small: 2, medium: 3, large: 4, tree: 5,
};

/** Roll for one fleeting element based on current conditions. Returns null if no spawn. */
function trySpawnFleeting(
  visitCount: number,
  stage: GrowthStage,
  wateringCount: number,
): PassiveElement | null {
  const season = seasonKeyAt(Date.now());
  const slot   = timeSlotNow();
  const stageIdx = STAGE_ORDER_INDEX[stage];

  // Visit-count multiplier: more visits → higher chance
  const visitMult = visitCount <= 1 ? 1.0
    : visitCount === 2 ? 1.35
    : visitCount === 3 ? 1.70
    : 2.10;

  // Collect eligible types
  const eligible: FleetingElementType[] = (Object.keys(FLEETING_CONFIGS) as FleetingElementType[])
    .filter(type => {
      const cfg = FLEETING_CONFIGS[type];
      if (cfg.seasons && !cfg.seasons.includes(season)) return false;
      if (cfg.timeSlots && !cfg.timeSlots.includes(slot))  return false;
      if (cfg.minWaterings && wateringCount < cfg.minWaterings) return false;
      if (cfg.minStage && stageIdx < STAGE_ORDER_INDEX[cfg.minStage]) return false;
      return true;
    });

  if (eligible.length === 0) return null;

  // Roll each eligible type independently
  for (const type of eligible) {
    const cfg = FLEETING_CONFIGS[type];
    const p   = Math.min(cfg.probability * visitMult, 0.85);
    if (Math.random() < p) {
      const [dMin, dMax] = cfg.durationMs;
      const duration     = dMin + Math.random() * (dMax - dMin);
      const now          = Date.now();
      const [yMin, yMax] = TYPE_Y_RANGE[type];
      const [xMin, xMax] = TYPE_X_RANGE[type];
      return {
        type,
        id: `ft_${now}`,
        addedAt: now,
        expiresAt: now + duration,
        position: { x: rand(xMin, xMax), y: rand(yMin, yMax) },
      };
    }
  }
  return null;
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

export function seasonKeyAt(ts: number): SeasonKey {
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
 * Returns a phrase for today that varies both by calendar day AND by garden,
 * so two users on the same day see different messages.
 * `createdAt` acts as a per-garden seed that shifts the cycle offset.
 */
export function getDailyPhrase(season: Season, createdAt: number): string {
  const phrases   = DAILY_PHRASES[season];
  const day       = Math.floor(Date.now()     / 86_400_000);
  const userShift = Math.floor(createdAt      / 86_400_000) % phrases.length;
  return phrases[(day + userShift) % phrases.length];
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
  const now       = Date.now();
  const today     = Math.floor(now / 86_400_000);
  const hoursAway = (now - state.lastOpenedAt) / 3_600_000;

  // ── 1. New passive elements (time-based) ────────────────────────────────────
  const newElements = generatePassiveElements(hoursAway, state.stage);

  // ── 2. Purge expired fleeting elements ──────────────────────────────────────
  const prevElements    = (state.passiveElements ?? []).filter(
    e => !e.expiresAt || e.expiresAt > now,
  );

  // ── 3. Merge regular elements (cap at 8, preserve fleeting) ─────────────────
  // Also purge regular elements that are no longer valid at the current hour
  // (e.g. bat spawned at night, user opens at morning → remove from state entirely)
  const slot = timeSlotNow();
  const prevRegular = prevElements.filter(e => {
    if (e.expiresAt) return false;                        // fleeting — handled separately
    const allowed = TIME_RESTRICTIONS[e.type];
    return !allowed || allowed.includes(slot);            // purge if out of valid hours
  });
  const prevFleeting = prevElements.filter(e => !!e.expiresAt);
  const allRegular   = [...prevRegular, ...newElements].slice(-8);

  // ── 4. Visit count (resets each calendar day) ────────────────────────────────
  const lastOpenDay  = Math.floor(state.lastOpenedAt / 86_400_000);
  const isFirstToday = lastOpenDay < today;
  const visitCount   = isFirstToday ? 1 : ((state.dailyVisitCount ?? 0) + 1);

  // ── 5. Fleeting spawn — max 2 fleeting at once ───────────────────────────────
  const allFleeting = [...prevFleeting];
  if (allFleeting.length < 2) {
    const spawned = trySpawnFleeting(visitCount, state.stage, state.wateringCount);
    if (spawned) allFleeting.push(spawned);
  }

  const allElements = [...allRegular, ...allFleeting];

  // ── 6. Evaporate puddle if time has passed ──────────────────────────────────
  let puddle = state.puddle;
  if (puddle && now > puddle.evaporatesAt) puddle = undefined;

  // ── 7. Reset daily watering count on new day ────────────────────────────────
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
      dailyVisitCount:     visitCount,
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
