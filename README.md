# tutorial-pdf-video-generator

> Convierte tutoriales Markdown en PDFs profesionales y videos MP4 (144fps) con portada, índice auto-generado e imágenes embebidas.

---

## ✨ Features

- 📄 **Markdown → PDF** con portada profesional (tema shadcn dark)
- 🎥 **Markdown → MP4** video con slides animados a 144fps
- 🖼️ **Imágenes embebidas** como base64 (PDF auto-contenido)
- 📑 **Índice auto-generado** desde los encabezados H2/H3
- 🎨 **Temas intercambiables** (incluye `shadcn-dark`, extensible)
- ⚙️ **Configurable por proyecto** via `tutorial.config.js`
- 🖨️ **Header y footer** personalizados con numeración de páginas
- 🔄 **Transiciones** crossfade, fade-black o corte directo
- 🎵 **Audio de fondo** opcional para videos

## 📦 Instalación

```bash
# Global
npm install -g tutorial-pdf-video-generator

# O como dev dependency en tu proyecto
npm install -D tutorial-pdf-video-generator

# Instalar navegadores de Playwright (primera vez)
npx playwright install chromium
```

## 🚀 Uso Rápido

### 1. Crear configuración

En la carpeta de tu proyecto (por ejemplo `MI-PROYECTO-more/`):

```bash
# Copiar el ejemplo
cp node_modules/tutorial-pdf-video-generator/tutorial.config.example.js ./tutorial.config.js
```

### 2. Editar `tutorial.config.js`

```javascript
export default {
  input: './TUTORIAL-MI-PROYECTO.md',
  output: './TUTORIAL-MI-PROYECTO.pdf',
  imagesDir: './SS',

  cover: {
    logo: './SS/logo.png',
    title: 'Tutorial de Uso\nMi Aplicación',
    subtitle: 'Guía completa del sistema',
    version: '1.0 · Enero 2026',
    classification: 'Uso interno',
    footer: 'Mi Empresa S.A.',
  },

  header: 'Mi Empresa S.A. · Mi Aplicación',
  theme: 'shadcn-dark',
};
```

### 3. Generar PDF

```bash
# Solo PDF (default)
npx tutorial-pdf --config ./tutorial.config.js

# Solo Video
npx tutorial-pdf --config ./tutorial.config.js --video

# Ambos
npx tutorial-pdf --config ./tutorial.config.js --pdf --video
```

## ⚙️ Configuración Completa

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `input` | `string` | — | Ruta al Markdown (relativa al config) |
| `output` | `string` | — | Ruta del PDF generado |
| `imagesDir` | `string` | `dirname(input)` | Carpeta de screenshots |
| `cover.logo` | `string` | — | Ruta a imagen del logo |
| `cover.logoText` | `string` | — | Texto alternativo si no hay logo |
| `cover.title` | `string` | `'Tutorial'` | Título principal |
| `cover.subtitle` | `string` | — | Descripción corta |
| `cover.version` | `string` | — | Etiqueta de versión |
| `cover.classification` | `string` | — | Nivel de clasificación |
| `cover.footer` | `string` | — | Texto bajo la portada |
| `cover.date` | `string` | Auto (mes+año) | Fecha explícita |
| `cover.meta` | `object` | — | Filas extra `{label: value}` |
| `header` | `string` | — | Texto en header de cada página |
| `theme` | `string` | `'shadcn-dark'` | Tema built-in o ruta a `.mjs`/`.css` |
| `tocTitle` | `string` | `'Índice de Contenidos'` | Título del TOC |
| `format` | `string` | `'A4'` | Tamaño de papel |
| `margins` | `object` | `{top:20,right:18,...}` | Márgenes en mm |
| `lang` | `string` | `'es'` | Atributo `lang` del HTML |

### Opciones de Video (`video.*`)

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `video.output` | `string` | `*.mp4` | Ruta del video generado |
| `video.resolution` | `object` | `{width:1920,height:1080}` | Resolución del video |
| `video.fps` | `number` | `144` | Frames por segundo |
| `video.slideDuration` | `number` | `6` | Segundos por slide |
| `video.coverDuration` | `number` | `8` | Segundos en portada |
| `video.sectionTitleDuration` | `number` | `4` | Segundos en título de sección |
| `video.transition` | `string` | `'crossfade'` | `crossfade` \| `fade-black` \| `cut` |
| `video.transitionDuration` | `number` | `0.5` | Segundos de transición |
| `video.backgroundMusic` | `string` | — | Ruta a `.mp3` de fondo |

## 🎨 Temas

### Built-in: `shadcn-dark`

- Portada: fondo zinc-950, card con bordes zinc-800
- Cuerpo: fondo blanco, tipografía slate
- Código: fondo dark con fuente monospace
- Tablas: headers oscuros, filas alternadas

### Tema personalizado

```javascript
// mi-tema.mjs
const CSS = `
  body { font-family: Georgia, serif; }
  .cover { background: #1a1a2e; }
  /* ... */
`;
export default CSS;
```

```javascript
// tutorial.config.js
export default {
  theme: './mi-tema.mjs',
  // ...
};
```

## 📁 Estructura Recomendada

```
MI-PROYECTO-more/
├── TUTORIAL-MI-PROYECTO.md     ← Markdown del tutorial
├── TUTORIAL-MI-PROYECTO.pdf    ← PDF generado
├── TUTORIAL-MI-PROYECTO.mp4    ← Video generado
├── tutorial.config.js          ← Config del generador
├── SS/                         ← Screenshots
│   ├── logo.png
│   ├── 01-login.png
│   ├── 02-dashboard.png
│   └── ...
└── SCRIPT/                     ← Scripts específicos (opcional)
    └── capture-tutorial.mjs
```

## 📖 Uso como Módulo

```javascript
import { exportTutorialToPDF } from 'tutorial-pdf-video-generator';
import { exportTutorialToVideo } from 'tutorial-pdf-video-generator/video';

// Generar PDF
await exportTutorialToPDF(config);

// Generar Video
await exportTutorialToVideo(config);
```

## 📘 Guía de Metodología

Ver [Skills/TUTORIAL_GUIDE.md](Skills/TUTORIAL_GUIDE.md) para la guía completa de cómo estructurar tutoriales, convenciones de screenshots, estilo de escritura y checklist de publicación.

## 📄 Licencia

MIT © [CamiloIncba](https://github.com/CamiloIncba)