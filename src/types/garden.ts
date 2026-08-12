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
