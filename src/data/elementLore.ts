import { PassiveElementType } from '@/types/garden';

export interface ElementLore {
  emoji: string;
  name: string;
  desc: string;
  detail: string;
}

export const ELEMENT_LORE: Record<PassiveElementType, ElementLore> = {
  leaf: {
    emoji: '🍃',
    name: 'La hoja',
    desc: 'Cayó sola. No es que el árbol esté enfermo — simplemente renueva sus hojas como forma de respirar. Esta estuvo viva varios meses antes de soltarse. Ya cumplió su parte.',
    detail: 'Aparece en cualquier estación',
  },
  flower: {
    emoji: '🌸',
    name: 'La flor silvestre',
    desc: 'No la plantaste. Llegó sola, traída por el viento o por algún insecto. Las flores silvestres no piden permiso para aparecer. Son así.',
    detail: 'Más frecuente en primavera y verano',
  },
  stone: {
    emoji: '🪨',
    name: 'La piedra',
    desc: 'Ha estado aquí mucho antes que el árbol. Los geólogos podrían contarte exactamente cuántos millones de años tiene, pero eso lo haría menos interesante. Mejor que sea simplemente una piedra.',
    detail: 'Siempre ha estado aquí',
  },
  mushroom: {
    emoji: '🍄',
    name: 'La seta',
    desc: 'Creció en una sola noche. Lo que ves es solo la parte visible de algo mucho más grande: un micelio que vive bajo el suelo y conecta las raíces del árbol con todo lo que lo rodea. Las setas no crecen solas.',
    detail: 'Aparece en otoño y días húmedos',
  },
  dewdrop: {
    emoji: '💧',
    name: 'La gota de rocío',
    desc: 'Se formó durante la noche, cuando el aire enfría y la humedad se condensa sobre las hojas. Ahora que el sol sube tiene pocas horas. Pero mientras está, refleja el jardín entero dentro de ella.',
    detail: 'Aparece al amanecer y por las mañanas',
  },
  butterfly: {
    emoji: '🦋',
    name: 'La mariposa',
    desc: 'Las mariposas visitan siempre los mismos jardines. Esta conoce cada hoja de tu árbol mejor que tú. Aterriza unos minutos, descansa, y sigue. Mañana volverá.',
    detail: 'Solo aparece de día',
  },
  bird: {
    emoji: '🐦',
    name: 'El pájaro',
    desc: 'Llegó buscando algo entre las raíces. Los pájaros visitan los jardines que huelen bien — a tierra húmeda, a savia fresca. El tuyo lo atrae desde lejos.',
    detail: 'Por las mañanas y al atardecer',
  },
  snail: {
    emoji: '🐌',
    name: 'El caracol',
    desc: 'Va a su ritmo. Siempre ha ido a su ritmo. Y siempre llega. Esta mañana cruzó de una piedra a la raíz del árbol — unos cuarenta centímetros que le llevaron casi una hora. Lo hizo sin prisa.',
    detail: 'Aparece más cuando hay humedad',
  },
  worm: {
    emoji: '🪱',
    name: 'La lombriz',
    desc: 'Pasa el día abriendo túneles que el agua aprovecha para llegar a las raíces. Cada riego que das, ella lo distribuye. Trabaja sin hacer ruido, sin que nadie le pida nada.',
    detail: 'Señal de que la tierra está viva',
  },
  clover: {
    emoji: '🍀',
    name: 'El trébol',
    desc: 'El trébol de cuatro hojas es una variación genética que ocurre una vez entre diez mil. Pero todos los tréboles, de tres o cuatro hojas, fijan nitrógeno del aire y lo convierten en alimento para el suelo. Algo ordinario que hace algo extraordinario.',
    detail: 'Muy poco frecuente',
  },
  hedgehog: {
    emoji: '🦔',
    name: 'El erizo',
    desc: 'Sale cuando cae la noche. Recorre el jardín buscando insectos y gusanos entre las raíces. Sus púas son pelos modificados — crecen durante toda su vida. Este tiene unos cinco años, a juzgar por el tamaño.',
    detail: 'Solo aparece de noche',
  },
  lizard: {
    emoji: '🦎',
    name: 'El lagarto',
    desc: 'Necesita sol para moverse. Por eso se queda quieto durante mucho tiempo, tomando el calor en la piedra o en el tronco. No está dormido — está pensando a su propia velocidad.',
    detail: 'Aparece cuando hace calor',
  },
  acorn: {
    emoji: '🌰',
    name: 'La bellota',
    desc: 'Cayó del árbol cuando alcanzó su madurez. Una bellota puede convertirse en un roble que viva siglos. O puede quedarse en el suelo, descomponerse y alimentar la tierra. Las dos opciones son igualmente válidas.',
    detail: 'Aparece solo en árboles maduros',
  },
  tulip: {
    emoji: '🌷',
    name: 'El tulipán',
    desc: 'Llegó en primavera, sin previo aviso. Los tulipanes florecen rápido y se van rápido — eso es parte de su sentido. Son un recordatorio de que algunas cosas bonitas duran exactamente lo que tienen que durar.',
    detail: 'Solo en primavera',
  },
  autumn_leaf: {
    emoji: '🍂',
    name: 'La hoja de otoño',
    desc: 'El color rojo y naranja no es la hoja muriendo — es la clorofila retirándose y dejando ver los pigmentos que siempre estuvieron ahí. El árbol lleva el otoño dentro desde el principio.',
    detail: 'Solo en otoño',
  },
  snowflake: {
    emoji: '❄️',
    name: 'El copo de nieve',
    desc: 'Cada copo es diferente porque cada uno cae por un camino distinto a través de las nubes. Las condiciones de temperatura y humedad de ese trayecto determinan su forma. Este tardó unos veinte minutos en llegar hasta aquí.',
    detail: 'Solo en invierno',
  },
};
