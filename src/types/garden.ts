export type GrowthStage = 'seed' | 'sprout' | 'small' | 'medium' | 'large' | 'tree';

export type PassiveElementType =
  // Ground — near trunk (all seasons)
  | 'leaf'       | 'flower'    | 'stone'   | 'mushroom' | 'dewdrop'
  // Aerial (all seasons)
  | 'butterfly'  | 'bird'
  // New ground creatures
  | 'snail'      | 'worm'      | 'clover'  | 'hedgehog' | 'lizard'
  // Stage-gated
  | 'acorn'
  // Seasonal atmosphere
  | 'tulip'      | 'autumn_leaf' | 'snowflake'
  // Spring / summer insects
  | 'bee'        | 'ladybug'    | 'ant'        | 'caterpillar'
  // Autumn / winter atmosphere
  | 'spiderweb'  | 'moss'       | 'berries'
  // Any season
  | 'feather'
  // Nocturnal regular
  | 'bat'        | 'beetle'     | 'spider'
  // Puddle creatures — appear only when puddle is active
  | 'frog'       | 'turtle'
  // ── Fleeting — appear for minutes/hours, then vanish ──────────────────────
  | 'owl'        | 'rabbit'     | 'firefly'    | 'fox'
  | 'squirrel'   | 'cricket'    | 'rainbow'    | 'eagle'
  | 'shooting_star' | 'pawprints';

export interface PassiveElement {
  type: PassiveElementType;
  id: string;
  addedAt: number;
  position: { x: number; y: number };
  /** If set, this is a fleeting element — it disappears at this timestamp. */
  expiresAt?: number;
}

export type TreeMaturity = 'young' | 'adult' | 'mature' | 'old' | 'centenarian';

export interface Puddle {
  /** Timestamp when the puddle formed */
  formedAt: number;
  /** Timestamp when it evaporates (depends on time of day) */
  evaporatesAt: number;
}

export interface SecondaryPlant {
  /** Waterings applied to this seedling since it appeared */
  wateringCount: number;
  /** Timestamp when the seedling first emerged */
  appearedAt: number;
}

export interface GardenState {
  stage: GrowthStage;
  wateringCount: number;
  lastWatered: number | null;
  streakDays: number;
  lastOpenedAt: number;
  passiveElements: PassiveElement[];
  plantName: string;
  createdAt: number;
  newPassiveElements: PassiveElement[];
  /** A new seedling that appears once the main plant becomes a tree */
  secondaryPlant?: SecondaryPlant;
  /** All unlocked milestones, stored permanently */
  milestones?: Milestone[];
  /** How many times watered today (0–5). Resets each calendar day. */
  dailyWateringCount: number;
  /** UTC day index (Date.now()/86400000 floored) — used to detect day rollover */
  lastWateringDay: number;
  /** Puddle that forms after the 5th watering of the day */
  puddle?: Puddle;
  /** How many times the app has been opened today. Resets each calendar day. */
  dailyVisitCount?: number;
}

export const STAGE_LABELS: Record<GrowthStage, string> = {
  seed: 'Semilla',
  sprout: 'Brote',
  small: 'Planta pequeña',
  medium: 'Planta mediana',
  large: 'Planta grande',
  tree: 'Árbol joven',
};

export const STAGE_EMOJIS: Record<GrowthStage, string> = {
  seed: '🌱',
  sprout: '🌿',
  small: '🌿',
  medium: '🌸',
  large: '🌳',
  tree: '🌲',
};

// ─── Milestones ──────────────────────────────────────────────────────────────

export type MilestoneId =
  // Time-based
  | 'week_1' | 'month_1' | 'first_season' | 'first_winter' | 'year_1'
  // Growth
  | 'became_tree'
  | 'first_nest' | 'first_owl' | 'first_squirrel' | 'first_firefly'
  // Passive element firsts
  | 'first_butterfly' | 'first_bird' | 'first_mushroom' | 'first_snail'
  | 'first_hedgehog' | 'first_lizard' | 'first_snowflake' | 'first_tulip' | 'first_acorn'
  // Special events
  | 'first_puddle' | 'secondary_plant' | 'first_night_water' | 'first_dawn_water';

export interface Milestone {
  id: MilestoneId;
  unlockedAt: number;
}

export const STAGE_ORDER: GrowthStage[] = [
  'seed',
  'sprout',
  'small',
  'medium',
  'large',
  'tree',
];

// Cumulative waterings needed to reach each stage
export const STAGE_THRESHOLDS: Record<GrowthStage, number> = {
  seed: 0,
  sprout: 1,
  small: 4,
  medium: 10,
  large: 20,
  tree: 35,
};
