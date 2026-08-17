import { GardenState, PassiveElementType } from '@/types/garden';
import { TimeOfDay } from '@/hooks/useTimeOfDay';

// ── Seeded determinism ─────────────────────────────────────────────────────
// Same output all day, different every day. No randomness at runtime.

function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

function todaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// ── Opening sentences — by time of day ────────────────────────────────────

const OPENINGS: Record<TimeOfDay, string[]> = {
  dawn: [
    'El jardín despertó antes que tú.',
    'A esta hora el jardín pertenece a otros.',
    'La luz todavía no ha decidido qué color ser.',
    'Hay cosas en el jardín que solo pasan antes del amanecer.',
  ],
  morning: [
    'Esta mañana el sol llegó despacio.',
    'Hay rocío en las hojas.',
    'Las primeras horas del día son las más tranquilas.',
    'El jardín ya lleva un rato despierto cuando llegas.',
  ],
  afternoon: [
    'La tarde avanza sin prisa.',
    'El sol está alto y el jardín lo sabe.',
    'A esta hora todo parece estar en su sitio.',
    'Hay una quietud particular en las tardes de jardín.',
  ],
  evening: [
    'La luz se está poniendo naranja.',
    'Los colores del jardín cambian a esta hora.',
    'Algo en la tarde invita a quedarse un poco más.',
    'El jardín empieza a prepararse para la noche.',
  ],
  night: [
    'El jardín de noche es distinto al de día.',
    'La oscuridad no vacía el jardín — lo llena de otras cosas.',
    'A esta hora solo algunos se mueven.',
    'El árbol de noche hace cosas que de día no hace.',
  ],
};

// ── Middle sentences — one per element type ────────────────────────────────
// Priority: rarer / more poetic elements go first in ELEMENT_PRIORITY below.

const ELEMENT_SENTENCES: Partial<Record<PassiveElementType, string[]>> = {
  hedgehog: [
    'El erizo pasó antes del amanecer. Casi nadie lo vio.',
    'El erizo recorrió el jardín entero esta noche.',
  ],
  clover: [
    'El trébol creció entre las raíces casi sin que nadie se diera cuenta.',
    'Hay un trébol en el jardín. Eso ya es algo.',
  ],
  butterfly: [
    'La mariposa pasó al menos dos veces hoy. Siempre vuelve al mismo jardín.',
    'Una mariposa estuvo en la hoja de arriba durante casi un minuto.',
  ],
  bird: [
    'Un pájaro encontró algo entre las raíces esta mañana.',
    'El pájaro volvió dos veces al mismo lugar.',
  ],
  mushroom: [
    'La seta que creció ayer ya forma parte del jardín.',
    'Debajo de la seta pasa más de lo que parece.',
  ],
  snail: [
    'El caracol está donde siempre. Va a su ritmo. Siempre llega.',
    'El caracol cruzó el jardín entero esta noche, a su velocidad.',
  ],
  dewdrop: [
    'La gota de rocío reflejó el jardín entero dentro de ella esta mañana.',
    'Había rocío en las hojas. Ya casi ha desaparecido.',
  ],
  tulip: [
    'El tulipán duró poco. Eso también es parte de su sentido.',
    'El tulipán de primavera apareció sin avisar.',
  ],
  snowflake: [
    'Un copo se quedó en una hoja durante diez minutos antes de derretirse.',
    'Los primeros copos siempre llegan cuando menos se esperan.',
  ],
  autumn_leaf: [
    'Las hojas rojas no son la muerte del árbol — son lo que estaba escondido dentro.',
    'El otoño llegó al jardín.',
  ],
  acorn: [
    'La bellota cayó del árbol cuando nadie miraba.',
    'Hay una bellota en el suelo. Podría convertirse en cualquier cosa.',
  ],
  lizard: [
    'El lagarto tomó el sol en la piedra. No estaba dormido — estaba pensando.',
    'El lagarto apareció al mediodía y no se movió durante horas.',
  ],
  worm: [
    'La lombriz abrió caminos para que el agua llegara a las raíces.',
    'La tierra tiene más vida de la que se ve desde arriba.',
  ],
};

// Most interesting elements listed first — the first one found wins
const ELEMENT_PRIORITY: PassiveElementType[] = [
  'hedgehog', 'clover', 'butterfly', 'bird', 'mushroom',
  'snail', 'dewdrop', 'tulip', 'snowflake', 'autumn_leaf',
  'acorn', 'lizard', 'worm', 'flower', 'leaf', 'stone',
];

// ── Closing sentences ──────────────────────────────────────────────────────

const CLOSINGS = [
  'El árbol no tiene prisa. Tú tampoco tienes que tenerla.',
  'El jardín siempre recuerda, aunque no lo parezca.',
  'Mañana será un día distinto, pero el árbol seguirá aquí.',
  'Algunas cosas solo pasan despacio. Este jardín lo sabe.',
  'No hace falta hacer nada más. Ya es suficiente.',
  'El jardín crece también cuando no estás mirando.',
  'El árbol ya es parte del tiempo que pasó.',
  'Estar aquí un momento también cuenta.',
];

// ── Public API ─────────────────────────────────────────────────────────────

export function getDailyNarrative(
  garden: GardenState,
  timeOfDay: TimeOfDay,
): string {
  const seed = todaySeed();
  const presentTypes = new Set(
    (garden.passiveElements ?? []).map((e) => e.type),
  );

  const opening = seededPick(OPENINGS[timeOfDay] ?? OPENINGS.morning, seed);

  // Find the most "interesting" element that has a sentence and is present
  let middle = '';
  for (const type of ELEMENT_PRIORITY) {
    if (presentTypes.has(type)) {
      const sentences = ELEMENT_SENTENCES[type];
      if (sentences && sentences.length > 0) {
        middle = seededPick(sentences, seed + 7);
        break;
      }
    }
  }

  const closing = seededPick(CLOSINGS, seed + 13);

  return [opening, middle, closing].filter(Boolean).join(' ');
}
