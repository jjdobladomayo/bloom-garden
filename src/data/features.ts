export interface Feature {
  id: string;
  emoji: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  /** Background color for the card */
  bg: string;
  /** Title text color */
  titleColor: string;
  /** Description + date color */
  subColor: string;
}

export const FEATURES: Feature[] = [
  {
    id: 'fugaces',
    emoji: '🌠',
    title: 'Algunos solo duran unas horas',
    description:
      'El búho llega de noche y se va antes de que amanezca. El conejo aparece al amanecer y desaparece en media hora. La estrella fugaz dura cinco minutos. Hay cosas en el jardín que solo existen si estás ahí en el momento exacto.',
    date: 'agosto 2025',
    isNew: true,
    bg: '#0d1520',
    titleColor: '#c8d8e8',
    subColor: '#3a6080',
  },
  {
    id: 'noche',
    emoji: '🦇',
    title: 'El jardín de noche es otro jardín',
    description:
      'Treinta y siete habitantes. Murciélagos, arañas, escarabajos, zorros, luciérnagas, grillos. Algunos solo salen de noche. Otros dejan huellas al amanecer — la única prueba de que estuvieron. El jardín no duerme.',
    date: 'agosto 2025',
    isNew: true,
    bg: '#141e2e',
    titleColor: '#8ab8d8',
    subColor: '#2a5070',
  },
  {
    id: 'lupa',
    emoji: '🔍',
    title: 'El jardín es un libro',
    description:
      'Toca cualquier elemento del ecosistema — la seta, el caracol, la mariposa, el erizo — y el jardín te cuenta algo sobre él. Cada criatura tiene su historia, su momento y su razón de estar aquí.',
    date: 'agosto 2025',
    isNew: false,
    bg: '#f5f0eb',
    titleColor: '#3a2810',
    subColor: '#8b7355',
  },
  {
    id: 'narrative',
    emoji: '📖',
    title: 'Lo que pasó hoy',
    description:
      'Cuando has regado los cinco, el jardín te cuenta lo que ocurrió mientras no estabas. Un párrafo distinto cada día, escrito a partir de la hora, la estación y lo que vive en tu árbol. Razón para volver aunque no queden riegos.',
    date: 'agosto 2025',
    isNew: false,
    bg: '#f0edf8',
    titleColor: '#2a1a4a',
    subColor: '#7060b0',
  },
  {
    id: 'memoria-tiempo',
    emoji: '🪺',
    title: 'Memoria y tiempo',
    description:
      'El jardín tiene hitos. El primer nido. El primer búho de noche. Las primeras luciérnagas. El primer invierno. Momentos que solo ocurren una vez y quedan guardados para siempre.',
    date: 'agosto 2025',
    isNew: false,
    bg: '#fef3e6',
    titleColor: '#4a2c0a',
    subColor: '#c4956a',
  },
  {
    id: 'ecosistema',
    emoji: '🌳',
    title: 'Ecosistema vivo',
    description:
      'Cuando el árbol crece, no está solo. Hormigas que trepan por el tronco, mariposas que pasan, un búho que llega de noche, luciérnagas en los árboles más viejos. Todo depende de la madurez y la hora.',
    date: 'agosto 2025',
    isNew: false,
    bg: '#eff9f4',
    titleColor: '#1a3a2a',
    subColor: '#7ca48c',
  },
  {
    id: 'regalos-estacionales',
    emoji: '🍂',
    title: 'Regalos del jardín',
    description:
      'Mientras no estás, el jardín no se queda quieto. Al volver puede haber una seta junto al tronco, un caracol, un copo de nieve o un tulipán de primavera. Cada estación trae sus propias sorpresas.',
    date: 'agosto 2025',
    isNew: false,
    bg: '#f5eef8',
    titleColor: '#4a1a5a',
    subColor: '#9868a8',
  },
  {
    id: 'momentos-dia',
    emoji: '🌙',
    title: 'El jardín tiene momentos',
    description:
      'Amanecer, mañana, tarde, anochecer y noche. Cada momento del día cambia la paleta de colores y el ambiente. La luna también aparece.',
    date: 'julio 2025',
    isNew: false,
    bg: '#141e2e',
    titleColor: '#c8d8e8',
    subColor: '#4a7888',
  },
  {
    id: 'charco',
    emoji: '💦',
    title: 'El charco',
    description:
      'Cinco riegos en un día y el suelo no lo aguanta. Aparece un charco. Hay un pájaro que bebe de él. Desaparece con las horas, antes si hace sol.',
    date: 'julio 2025',
    isNew: false,
    bg: '#eff9f4',
    titleColor: '#1a3a5a',
    subColor: '#4a90b8',
  },
  {
    id: 'segunda-semilla',
    emoji: '🌱',
    title: 'La segunda semilla',
    description:
      'Cuando el árbol alcanza su madurez, algo nuevo empieza a crecer a su lado. El ciclo vuelve a empezar.',
    date: 'julio 2025',
    isNew: false,
    bg: '#eff9f4',
    titleColor: '#2d5a3d',
    subColor: '#7ca48c',
  },
  {
    id: 'instante',
    emoji: '✨',
    title: 'Un instante de silencio',
    description:
      'Después de regar, hay un momento. La planta respira. Solo unos segundos. Después, sigues.',
    date: 'julio 2025',
    isNew: false,
    bg: '#fdf9f5',
    titleColor: '#374151',
    subColor: '#9ca3af',
  },
  {
    id: 'sin-registro',
    emoji: '📱',
    title: 'Solo tuya',
    description:
      'Sin registro. Sin anuncios. Sin datos en servidores ajenos. Se instala desde el navegador como una app. Todo vive en tu teléfono.',
    date: 'julio 2025',
    isNew: false,
    bg: '#fdf9f5',
    titleColor: '#374151',
    subColor: '#9ca3af',
  },
];
