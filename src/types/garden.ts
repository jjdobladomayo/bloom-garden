export type GrowthStage = 'seed' | 'sprout' | 'small' | 'medium' | 'large' | 'tree';

export type PassiveElementType =
  | 'leaf'
  | 'flower'
  | 'butterfly'
  | 'bird'
  | 'stone'
  | 'mushroom'
  | 'dewdrop';

export interface PassiveElement {
  type: PassiveElementType;
  id: string;
  addedAt: number;
  position: { x: number; y: number };
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
  /** How many times watered today (0–5). Resets each calendar day. */
  dailyWateringCount: number;
  /** UTC day index (Date.now()/86400000 floored) — used to detect day rollover */
  lastWateringDay: number;
  /** Puddle that forms after the 5th watering of the day */
  puddle?: Puddle;
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
