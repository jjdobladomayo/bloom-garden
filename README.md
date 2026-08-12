# 🌱 Bloom — Tu jardín digital

> *Dedica 5 segundos a ti y ve crecer algo bonito.*

MVP de una Progressive Web App (PWA) minimalista orientada a adultos que buscan un pequeño refugio digital durante el día.

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 15 | Framework (App Router) |
| React 18 | UI |
| TypeScript | Tipos |
| Tailwind CSS | Estilos |
| Framer Motion | Animaciones |
| Web Audio API | Sonido de lluvia (sin archivos externos) |
| Vibration API | Haptics |
| LocalStorage | Persistencia (sin backend) |
| Service Worker | Offline + PWA |

---

## Estructura del proyecto

```
bloom/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/
│       └── icon.svg           # Ícono fuente (SVG)
├── scripts/
│   └── generate-icons.mjs     # Genera PNGs desde el SVG
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout + PWA meta tags
│   │   ├── page.tsx           # Máquina de estados principal
│   │   └── globals.css
│   ├── components/
│   │   ├── WelcomeScreen.tsx  # Pantalla de bienvenida
│   │   ├── WaterScreen.tsx    # Ritual de 5s con lluvia y sonido
│   │   ├── GardenScreen.tsx   # Jardín principal
│   │   ├── GrowthScreen.tsx   # Pantalla post-riego
│   │   ├── PlantDisplay.tsx   # SVGs de las 6 etapas
│   │   ├── RainEffect.tsx     # Gotas animadas
│   │   ├── CircularProgress.tsx # Anillo de progreso
│   │   ├── PassiveGrowthModal.tsx # "Mientras estabas fuera…"
│   │   └── InstallPrompt.tsx  # Prompt de instalación PWA
│   ├── hooks/
│   │   ├── useGarden.ts       # Estado del jardín
│   │   ├── useHaptics.ts      # Vibración
│   │   └── usePWA.ts          # Install prompt
│   ├── types/
│   │   └── garden.ts          # Tipos TypeScript
│   └── utils/
│       ├── garden.ts          # Lógica de negocio
│       └── storage.ts         # LocalStorage helpers
```

---

## Inicio rápido (desarrollo)

```bash
cd bloom
npm install
npm run dev
```

Abre `http://localhost:3000` en tu móvil (o usa las DevTools en modo móvil).

---

## Despliegue en Vercel (1 comando)

### Opción A — desde la CLI de Vercel

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones. Vercel detecta Next.js automáticamente.

### Opción B — desde GitHub

1. Sube el proyecto a un repositorio GitHub.
2. Ve a [vercel.com](https://vercel.com) → **Add New Project**.
3. Importa el repositorio.
4. Haz clic en **Deploy**. ✅

No se necesitan variables de entorno.

---

## Generar íconos PNG (opcional pero recomendado para iOS)

El SVG funciona como ícono en Chrome/Android. Para máxima compatibilidad con iOS:

```bash
npm install sharp --save-dev
npm run generate-icons
```

Esto crea `icon-192.png` e `icon-512.png` en `public/icons/`.

---

## Mecánicas del MVP

### Etapas de crecimiento

| Etapa | Riegos acumulados |
|---|---|
| 🌱 Semilla | 0 |
| 🌿 Brote | 1 |
| 🌿 Planta pequeña | 4 |
| 🌸 Planta mediana | 10 |
| 🌳 Planta grande | 20 |
| 🌲 Árbol joven | 35 |

### Crecimiento pasivo

Cuando el usuario regresa después de **≥ 3 horas**, el jardín genera entre 1 y 3 elementos nuevos de forma aleatoria (hojas, flores, mariposas, pájaros, piedras, hongos, gotas de rocío). Aparece un modal que dice **"Mientras estabas fuera…"**, generando la curiosidad necesaria para el retorno voluntario.

### Ritual de riego

- 5 segundos de pulsación continua
- Lluvia visual animada (Framer Motion)
- Sonido de lluvia generado con Web Audio API (sin archivos externos)
- Vibración suave (Vibration API)
- Barra circular de progreso
- Retroalimentación háptica al completar

---

## Filosofía del producto

**No hay:**
- Monedas, XP, diamantes
- Ranking ni comparación social
- Login obligatorio
- Publicidad
- Notificaciones push agresivas
- Gamificación infantil

**Sí hay:**
- Un pequeño refugio digital para adultos
- Una interacción de 5 segundos que invita a la calma
- Un jardín que crece contigo aunque no estés

---

## Hipótesis a validar

> ¿Los usuarios vuelven voluntariamente para cuidar y observar su jardín?

Señales de éxito (medibles con LocalStorage):
- `streakDays > 3` en más del 30% de usuarios activos
- El usuario regresa tras ver el modal de crecimiento pasivo
- D7 retention > 20%

---

*Hecho con 🌱 para validar una idea simple: a veces 5 segundos son suficientes.*
