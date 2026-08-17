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
    detail: 'Primavera, otoño e invierno',
  },
  dewdrop: {
    emoji: '💧',
    name: 'La gota de rocío',
    desc: 'Se formó durante la noche, cuando el aire enfría y la humedad se condensa sobre las hojas. Ahora que el sol sube tiene pocas horas. Pero mientras está, refleja el jardín entero dentro de ella.',
    detail: 'Solo al amanecer — entre las 5h y las 8h',
  },
  butterfly: {
    emoji: '🦋',
    name: 'La mariposa',
    desc: 'Las mariposas visitan siempre los mismos jardines. Esta conoce cada hoja de tu árbol mejor que tú. Aterriza unos minutos, descansa, y sigue. Mañana volverá.',
    detail: 'Solo de día — primavera y verano',
  },
  bird: {
    emoji: '🐦',
    name: 'El pájaro',
    desc: 'Llegó buscando algo entre las raíces. Los pájaros visitan los jardines que huelen bien — a tierra húmeda, a savia fresca. El tuyo lo atrae desde lejos.',
    detail: 'De día — nunca de noche',
  },
  snail: {
    emoji: '🐌',
    name: 'El caracol',
    desc: 'Va a su ritmo. Siempre ha ido a su ritmo. Y siempre llega. Esta mañana cruzó de una piedra a la raíz del árbol — unos cuarenta centímetros que le llevaron casi una hora. Lo hizo sin prisa.',
    detail: 'Primavera y otoño',
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
    detail: 'Solo de noche — entre las 21h y las 5h',
  },
  lizard: {
    emoji: '🦎',
    name: 'El lagarto',
    desc: 'Necesita sol para moverse. Por eso se queda quieto durante mucho tiempo, tomando el calor en la piedra o en el tronco. No está dormido — está pensando a su propia velocidad.',
    detail: 'Solo de día, en verano',
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
  bee: {
    emoji: '🐝',
    name: 'La abeja',
    desc: 'Visita tu jardín porque algo aquí vale la pena. Las abejas recuerdan exactamente dónde han encontrado néctar antes. Esta ha vuelto. No lo hace si no tiene razón.',
    detail: 'Primavera y verano, de día',
  },
  ladybug: {
    emoji: '🐞',
    name: 'La mariquita',
    desc: 'Los puntos negros no dicen la edad — dicen la especie. Esta tiene siete, que es el número más común. Come pulgones. Sin saberlo, protege las plantas de lo que las consume por dentro.',
    detail: 'Primavera, de día',
  },
  ant: {
    emoji: '🐜',
    name: 'La hormiga',
    desc: 'No está perdida. Sigue un rastro invisible de feromonas que otras hormigas dejaron antes. Cada camino que ves fue diseñado por miles de decisiones colectivas. No hay jefa — solo la lógica del grupo.',
    detail: 'Primavera y verano',
  },
  feather: {
    emoji: '🪶',
    name: 'La pluma',
    desc: 'El pájaro ya se fue. Esta pluma se soltó mientras descansaba en el árbol — un proceso continuo que mantiene el vuelo en buen estado. Es lo más liviano que puede dejar algo que pesa.',
    detail: 'El pájaro estuvo aquí',
  },
  spiderweb: {
    emoji: '🕸️',
    name: 'La telaraña',
    desc: 'La tejió antes de que amaneciera. Cada hilo tiene una función: los radiales no pegan, los espirales sí. La araña sabe cuál es cuál sin mirar. La tela entera pesa menos que una gota de agua.',
    detail: 'Otoño e invierno, visible al amanecer',
  },
  caterpillar: {
    emoji: '🐛',
    name: 'La oruga',
    desc: 'Come casi sin parar. No porque sea glotona — necesita acumular todo lo que será después. En unas semanas va a deshacerse por completo y reorganizarse en algo completamente distinto. Lo sabe, aunque no lo sepa.',
    detail: 'Primavera, de día',
  },
  moss: {
    emoji: '🌿',
    name: 'El musgo',
    desc: 'Lleva aquí más tiempo que el árbol. El musgo no tiene raíces — absorbe el agua directamente por la superficie. Es uno de los primeros seres vivos que colonizaron la tierra firme, hace cuatrocientos millones de años. Sigue haciendo lo mismo.',
    detail: 'Otoño e invierno, árboles con historia',
  },
  berries: {
    emoji: '🫐',
    name: 'Las bayas',
    desc: 'Las produce el árbol para que alguien se las coma. El animal come, se va, y en algún otro lugar deposita la semilla dentro de un fertilizante natural. El árbol lleva siglos usando a los pájaros para viajar.',
    detail: 'Otoño, en árboles maduros',
  },
  bat: {
    emoji: '🦇',
    name: 'El murciélago',
    desc: 'Sale cuando cae la noche. Usa el sonido para ver — emite pulsos ultrasónicos y escucha el eco. En una hora puede cazar más de mil insectos. No es ciego: tiene ojos funcionales, pero de noche el oído le da más información.',
    detail: 'Noche y anochecer, todo el año',
  },
  beetle: {
    emoji: '🪲',
    name: 'El escarabajo',
    desc: 'Sale de noche porque de día tiene demasiados depredadores. Las alas externas son escudos — no vuelan con ellas, las protegen. Debajo hay unas alas plegadas con precisión. El escarabajo lleva este diseño sin cambiar desde hace ciento ochenta millones de años.',
    detail: 'Noche y anochecer — primavera, verano y otoño',
  },
  spider: {
    emoji: '🕷️',
    name: 'La araña',
    desc: 'De noche sale a cazar. Tiene ocho ojos pero no ve bien — lo que percibe es vibración. Cuando algo toca la tela, sabe exactamente en qué punto está sin necesidad de mirar. Esta araña construyó la telaraña del jardín antes de que amaneciera.',
    detail: 'Solo de noche — otoño e invierno',
  },
  frog: {
    emoji: '🐸',
    name: 'La rana',
    desc: 'Llegó cuando olió el agua. Las ranas detectan la lluvia y los charcos antes de verlos — a través de receptores en la piel. Este charco lleva pocas horas y ya está aquí. Cuando el agua desaparezca, ella también se irá.',
    detail: 'Solo aparece cuando hay charco',
  },
  turtle: {
    emoji: '🐢',
    name: 'La tortuga',
    desc: 'Ha venido a beber. Las tortugas llevan doscientos veinte millones de años con el mismo diseño: caparazón, cuatro patas, mucha paciencia. La evolución lo intentó de otras formas. Siempre volvió a esta.',
    detail: 'Solo aparece cuando hay charco — no tiene prisa',
  },
  owl: {
    emoji: '🦉',
    name: 'El búho',
    desc: 'Llegó cuando ya no había nadie mirando. Los búhos cazan sin hacer ruido porque sus plumas tienen una estructura especial que absorbe el sonido. Este lleva un rato en el árbol. No sabes cuánto tiempo más se quedará.',
    detail: 'Solo de noche — aparece y se va',
  },
  rabbit: {
    emoji: '🐇',
    name: 'El conejo',
    desc: 'Apareció de la nada, como hacen siempre. Los conejos tienen casi trescientos grados de campo visual — ven casi todo a su alrededor sin mover la cabeza. Ahora mismo sabe perfectamente que estás aquí.',
    detail: 'Solo al amanecer o al anochecer',
  },
  firefly: {
    emoji: '✨',
    name: 'La luciérnaga',
    desc: 'La luz que produce no es calor — es una reacción química casi perfecta. Los humanos llevan décadas intentando replicarla sin conseguirlo del todo. Aquí, en el jardín, ocurre sola, de noche, en verano.',
    detail: 'Solo en noches de verano — no dura mucho',
  },
  fox: {
    emoji: '🦊',
    name: 'El zorro',
    desc: 'Es raro verlo. Los zorros son nocturnos y prefieren los jardines viejos, los que huelen a tiempo acumulado. Este recorre su territorio cada noche siguiendo siempre el mismo camino. Esta noche de invierno pasó por aquí.',
    detail: 'Noches de invierno — solo en árboles viejos',
  },
  squirrel: {
    emoji: '🐿️',
    name: 'La ardilla',
    desc: 'Vino por las bellotas. Las ardillas esconden comida en otoño y la recuperan en invierno, pero olvidan el diez por ciento de los escondites. De ese olvido nacen árboles. La ardilla es, sin quererlo, jardinera.',
    detail: 'Otoño, cuando hay bellotas — pasa rápido',
  },
  cricket: {
    emoji: '🦗',
    name: 'El grillo',
    desc: 'El sonido lo producen frotando las alas, no las patas. La velocidad del chirrido depende de la temperatura — hay una fórmula que convierte el número de chirridos por minuto en grados. Este grillo está siendo un termómetro.',
    detail: 'Noches y atardeceres de verano',
  },
  rainbow: {
    emoji: '🌈',
    name: 'El arcoíris',
    desc: 'Siempre está ahí, en el aire, pero solo se ve cuando el sol está detrás y la lluvia delante. El rojo es el que más se dobla, el violeta el menos. Este duró exactamente lo que tenía que durar.',
    detail: 'Rarísimo — aparece y desaparece en minutos',
  },
  eagle: {
    emoji: '🦅',
    name: 'El águila',
    desc: 'Pasó volando. Las águilas ven cuatro veces mejor que los humanos — desde aquí arriba, tu jardín entero es perfectamente nítido para ella. Te vio. No se detuvo. Pero te vio.',
    detail: 'Muy raro — pasa en unos minutos',
  },
  shooting_star: {
    emoji: '🌠',
    name: 'La estrella fugaz',
    desc: 'No es una estrella. Es un fragmento de roca del tamaño de un guijarro que entró en la atmósfera a sesenta kilómetros por segundo y se incendió a cien kilómetros de altura. Todo el espectáculo duró menos de dos segundos. Y lo viste.',
    detail: 'Solo de noche — rarísima, desaparece en minutos',
  },
  pawprints: {
    emoji: '🐾',
    name: 'Las huellas',
    desc: 'Alguien pasó por aquí de noche. No sabes quién. Podrían ser del erizo, o del zorro, o de algo que todavía no has visto. Las huellas desaparecen cuando el sol seca la tierra. Antes de que eso pase, son la única prueba de que ocurrió.',
    detail: 'Solo al amanecer — rastro de la noche',
  },
};
