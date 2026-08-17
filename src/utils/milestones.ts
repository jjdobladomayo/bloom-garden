import { GardenState, MilestoneId, Milestone, PassiveElementType } from '@/types/garden';
import { seasonKeyAt } from '@/utils/garden';

// ─── Milestone metadata ──────────────────────────────────────────────────────

export interface MilestoneMeta {
  emoji: string;
  title: string;
  phrase: string;
  category: 'tiempo' | 'crecimiento' | 'ecosistema' | 'visita' | 'regalo' | 'estación' | 'especial';
  /** Shows a full MilestoneScreen overlay when unlocked */
  important: boolean;
  /** Background color for the overlay screen */
  bg: string;
  titleColor: string;
  phraseColor: string;
  hintColor: string;
}

export const MILESTONE_META: Record<MilestoneId, MilestoneMeta> = {
  // ── Tiempo ──────────────────────────────────────────────────────────────────
  week_1: {
    emoji: '📅', title: 'Una semana',
    phrase: 'Siete días de agua y espera.',
    category: 'tiempo', important: false,
    bg: '#eff9f4', titleColor: '#2d5a3d', phraseColor: '#7ca48c', hintColor: '',
  },
  month_1: {
    emoji: '🌕', title: 'Un mes',
    phrase: 'Un mes de agua y paciencia.',
    category: 'tiempo', important: false,
    bg: '#eff9f4', titleColor: '#2d5a3d', phraseColor: '#7ca48c', hintColor: '',
  },
  first_season: {
    emoji: '🍂', title: 'Primera estación',
    phrase: 'El jardín ha vivido su primera estación.',
    category: 'tiempo', important: false,
    bg: '#fef3e6', titleColor: '#4a2c0a', phraseColor: '#c4956a', hintColor: '',
  },
  first_winter: {
    emoji: '❄️', title: 'Primer invierno',
    phrase: 'Bajo la nieve, las raíces esperan.',
    category: 'tiempo', important: true,
    bg: '#e8eef4', titleColor: '#2a3a4a', phraseColor: '#6888a8', hintColor: 'rgba(80,120,160,0.3)',
  },
  year_1: {
    emoji: '✨', title: 'Un año',
    phrase: 'Ha visto las cuatro estaciones.\nEl jardín ya tiene historia.',
    category: 'tiempo', important: true,
    bg: '#141e2e', titleColor: '#c8d8e8', phraseColor: '#4a7080', hintColor: 'rgba(74,112,128,0.4)',
  },

  // ── Crecimiento ─────────────────────────────────────────────────────────────
  became_tree: {
    emoji: '🌳', title: 'Es un árbol',
    phrase: 'Lleva tiempo siéndolo, sin que te dieras cuenta.',
    category: 'crecimiento', important: false,
    bg: '#eff9f4', titleColor: '#1a3a2a', phraseColor: '#5a9e70', hintColor: '',
  },
  first_nest: {
    emoji: '🪺', title: 'El primer nido',
    phrase: 'Alguien decidió quedarse.',
    category: 'ecosistema', important: true,
    bg: '#fef3e6', titleColor: '#4a2c0a', phraseColor: '#c4956a', hintColor: 'rgba(196,149,106,0.3)',
  },
  first_owl: {
    emoji: '🦉', title: 'El primer búho',
    phrase: 'Solo visita los árboles\nque llevan tiempo en pie.',
    category: 'ecosistema', important: true,
    bg: '#141e2e', titleColor: '#c8d8e8', phraseColor: '#4a8898', hintColor: 'rgba(74,136,152,0.4)',
  },
  first_squirrel: {
    emoji: '🐿️', title: 'Primera ardilla',
    phrase: 'Se instaló. El árbol ya es hogar.',
    category: 'ecosistema', important: false,
    bg: '#fef3e6', titleColor: '#4a2c0a', phraseColor: '#c4956a', hintColor: '',
  },
  first_firefly: {
    emoji: '✨', title: 'Las primeras luciérnagas',
    phrase: 'Solo aparecen donde el tiempo\nha sido muy generoso.',
    category: 'ecosistema', important: true,
    bg: '#0d1224', titleColor: '#e0ecf8', phraseColor: '#3a7888', hintColor: 'rgba(40,96,128,0.5)',
  },

  // ── Primeros regalos ────────────────────────────────────────────────────────
  first_butterfly: {
    emoji: '🦋', title: 'Primera mariposa',
    phrase: 'Pasó, se quedó un momento y siguió.',
    category: 'visita', important: false,
    bg: '#eff9f4', titleColor: '#2d5a3d', phraseColor: '#7ca48c', hintColor: '',
  },
  first_bird: {
    emoji: '🐦', title: 'El primer pájaro',
    phrase: 'Eligió este árbol entre todos.',
    category: 'visita', important: false,
    bg: '#eff9f4', titleColor: '#2d5a3d', phraseColor: '#7ca48c', hintColor: '',
  },
  first_mushroom: {
    emoji: '🍄', title: 'Primera seta',
    phrase: 'Apareció mientras no estabas. Así crecen las setas.',
    category: 'regalo', important: false,
    bg: '#fdf9f5', titleColor: '#374151', phraseColor: '#9ca3af', hintColor: '',
  },
  first_snail: {
    emoji: '🐌', title: 'Primer caracol',
    phrase: 'Un caracol no tiene prisa. Tiene razón.',
    category: 'visita', important: false,
    bg: '#eff9f4', titleColor: '#2d5a3d', phraseColor: '#7ca48c', hintColor: '',
  },
  first_hedgehog: {
    emoji: '🦔', title: 'Primer erizo',
    phrase: 'Un erizo de noche. El jardín ya tiene secretos.',
    category: 'visita', important: false,
    bg: '#fef3e6', titleColor: '#4a2c0a', phraseColor: '#c4956a', hintColor: '',
  },
  first_lizard: {
    emoji: '🦎', title: 'Primera lagartija',
    phrase: 'Toma el sol en el tronco. Buen criterio.',
    category: 'visita', important: false,
    bg: '#fdf9f5', titleColor: '#374151', phraseColor: '#9ca3af', hintColor: '',
  },
  first_snowflake: {
    emoji: '❄️', title: 'Primer copo de nieve',
    phrase: 'El jardín ha visto su primera nieve.',
    category: 'estación', important: false,
    bg: '#e8eef4', titleColor: '#2a3a4a', phraseColor: '#6888a8', hintColor: '',
  },
  first_tulip: {
    emoji: '🌷', title: 'Primer tulipán',
    phrase: 'La primavera siempre vuelve.',
    category: 'estación', important: false,
    bg: '#f5eef8', titleColor: '#4a1a5a', phraseColor: '#9868a8', hintColor: '',
  },
  first_acorn: {
    emoji: '🌰', title: 'Primera bellota',
    phrase: 'Una bellota del propio árbol. El ciclo continúa.',
    category: 'regalo', important: false,
    bg: '#fef3e6', titleColor: '#4a2c0a', phraseColor: '#c4956a', hintColor: '',
  },

  // ── Especiales ───────────────────────────────────────────────────────────────
  first_puddle: {
    emoji: '💦', title: 'El primer charco',
    phrase: 'Cinco riegos en un día.\nEl suelo no lo olvidará.',
    category: 'especial', important: true,
    bg: '#eff9f4', titleColor: '#1a3a5a', phraseColor: '#4a90b8', hintColor: 'rgba(74,144,184,0.3)',
  },
  secondary_plant: {
    emoji: '🌱', title: 'Una nueva semilla',
    phrase: 'Junto al árbol, algo nuevo empieza.',
    category: 'especial', important: false,
    bg: '#eff9f4', titleColor: '#2d5a3d', phraseColor: '#7ca48c', hintColor: '',
  },
  first_night_water: {
    emoji: '🌙', title: 'Riego de noche',
    phrase: 'Regaste de noche. El jardín tampoco duerme.',
    category: 'especial', important: false,
    bg: '#141e2e', titleColor: '#c8d8e8', phraseColor: '#4a6878', hintColor: '',
  },
  first_dawn_water: {
    emoji: '🌅', title: 'Riego al amanecer',
    phrase: 'Madrugaste para regar. Pocas cosas merecen eso.',
    category: 'especial', important: false,
    bg: '#f5eef8', titleColor: '#4a2a4a', phraseColor: '#9878b8', hintColor: '',
  },
};

// ─── Order for the memories list ─────────────────────────────────────────────

/** Story progression order — used to pick teaser milestones in MemoriasScreen */
export const MILESTONE_STORY_ORDER: MilestoneId[] = [
  'week_1', 'month_1', 'first_butterfly', 'first_bird', 'first_mushroom',
  'first_snail', 'became_tree', 'first_nest', 'first_hedgehog',
  'first_lizard', 'first_owl', 'first_snowflake', 'first_tulip',
  'first_squirrel', 'first_firefly', 'first_acorn',
  'year_1', 'first_winter', 'secondary_plant',
  'first_puddle', 'first_night_water', 'first_dawn_water', 'first_season',
];

// ─── Passive element → milestone mapping ─────────────────────────────────────

const PASSIVE_MILESTONE_MAP: Partial<Record<PassiveElementType, MilestoneId>> = {
  butterfly:   'first_butterfly',
  bird:        'first_bird',
  mushroom:    'first_mushroom',
  snail:       'first_snail',
  hedgehog:    'first_hedgehog',
  lizard:      'first_lizard',
  snowflake:   'first_snowflake',
  tulip:       'first_tulip',
  acorn:       'first_acorn',
};

// ─── Detection ───────────────────────────────────────────────────────────────

/**
 * Compares prev and next states and returns milestone IDs that are
 * newly earned (not in prev.milestones, condition satisfied in next).
 */
export function detectNewMilestones(
  prev: GardenState,
  next: GardenState,
  context: 'watering' | 'return',
): MilestoneId[] {
  const unlocked = new Set((prev.milestones ?? []).map((m) => m.id));
  const results: MilestoneId[] = [];

  function check(id: MilestoneId, cond: boolean) {
    if (!unlocked.has(id) && cond) results.push(id);
  }

  const now  = Date.now();
  const days = (now - (next.createdAt ?? now)) / 86_400_000;

  // ── Time ──────────────────────────────────────────────────────────────────
  check('week_1',  days >= 7);
  check('month_1', days >= 30);
  check('year_1',  days >= 365);

  if (next.createdAt) {
    const birthSeason = seasonKeyAt(next.createdAt);
    const nowSeason   = seasonKeyAt(now);
    check('first_season', nowSeason !== birthSeason);
    // first_winter: fire once garden has been around 30+ days and it's winter
    check('first_winter', nowSeason === 'winter' && days >= 30);
  }

  // ── Growth ────────────────────────────────────────────────────────────────
  // became_tree: only on stage transition
  check('became_tree',    prev.stage !== 'tree' && next.stage === 'tree');
  // Maturity milestones: only cross the threshold upward
  check('first_nest',     prev.wateringCount < 100 && next.wateringCount >= 100);
  check('first_owl',      prev.wateringCount < 200 && next.wateringCount >= 200);
  check('first_squirrel', prev.wateringCount < 365 && next.wateringCount >= 365);
  check('first_firefly',  prev.wateringCount < 500 && next.wateringCount >= 500);

  // ── Passive element firsts (only relevant on return, when newPassiveElements is set) ──
  if (context === 'return') {
    for (const el of (next.newPassiveElements ?? [])) {
      const mid = PASSIVE_MILESTONE_MAP[el.type];
      if (mid) check(mid, true);
    }
  }

  // ── Special events (only on watering) ────────────────────────────────────
  if (context === 'watering') {
    check('first_puddle',     !prev.puddle && !!next.puddle);
    check('secondary_plant',  !prev.secondaryPlant && !!next.secondaryPlant);

    const hour = new Date(now).getHours();
    check('first_night_water', hour >= 0  && hour < 5);
    check('first_dawn_water',  hour >= 5  && hour < 7);
  }

  return results;
}

/**
 * Adds newly detected milestones to the state, returning the updated state.
 */
export function applyMilestones(state: GardenState, ids: MilestoneId[]): GardenState {
  if (ids.length === 0) return state;
  const now  = Date.now();
  const prev = state.milestones ?? [];
  return {
    ...state,
    milestones: [
      ...prev,
      ...ids.map((id) => ({ id, unlockedAt: now } satisfies Milestone)),
    ],
  };
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/** Short human-readable date for memories list: "3 sep", "hoy", etc. */
export function formatMilestoneDate(ts: number): string {
  const now  = Date.now();
  const diff = now - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  const d = new Date(ts);
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
