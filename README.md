# Tutorializator 2049

> Sistema de documentación para proyectos INCBA. Genera SRS, planes de trabajo, tutoriales y exporta a PDF, DOCX y MP4.

---

## ✨ Features

### 📁 Project Documentation
- **`init`** — Scaffolding de documentación para nuevos proyectos
- **`sync`** — Tracking de progreso y estado de documentación
- **Skills templates** — SRS, PLAN, CLAUDE, README, LOVABLE-PROMPT, ERASER-DSL

### 📄 Export Capabilities
- 📄 **Markdown → PDF** con portada profesional
- 📝 **Markdown → DOCX** compatible con Word
- 🎥 **Markdown → MP4** video con slides animados
- 🖼️ **Imágenes embebidas** como base64
- 📑 **Índice auto-generado** desde H2/H3
- 🎨 **Temas intercambiables** (`shadcn-dark`, `presupuesto-norpan`)

## 📦 Instalación

```bash
# Global
npm install -g tutorializator-2049

# O como dev dependency
npm install -D tutorializator-2049

# Instalar navegadores de Playwright (primera vez)
npx playwright install chromium
```

## 🚀 Uso Rápido

### Inicializar nuevo proyecto

```bash
# Interactivo
npx tutorializator init

# Con parámetros
npx tutorializator init --project TC --client NOR-PAN
```

Esto crea:
```
TC-more/
├── CLAUDE.md           ← Hub central de contexto
├── SRS.md              ← Especificación de requisitos
├── PLAN.md             ← Plan de trabajo
├── LOVABLE-PROMPT.md   ← Prompts para mockups
├── ERASER-DSL.md       ← DSL para diagramas
├── TUTORIAL.md         ← Tutorial de usuario
├── SS/                 ← Screenshots
└── diagrams/           ← Diagramas exportados

project.config.js       ← Configuración del proyecto
```

### Verificar documentación

```bash
# Verificar estado
npx tutorializator sync

# Solo check (sin modificar)
npx tutorializator sync --check
```

### Exportar documentos

```bash
# PDF (default)
npx tutorializator export --config ./tutorial.config.js

# DOCX
npx tutorializator export --config ./tutorial.config.js --docx

# Video MP4
npx tutorializator export --config ./tutorial.config.js --video

# Todos los formatos
npx tutorializator export --pdf --docx --video
```

## 📁 Estructura de Proyecto INCBA

```
C:/Proyectos/
└── CLIENTE/                    # Carpeta del cliente
    └── PROYECTO/               # Nombre del proyecto
        ├── PROYECTO-backend/   # Backend (NestJS/Express)
        ├── PROYECTO-frontend/  # Frontend (React + Vite)
        ├── PROYECTO-more/      # Documentación ← Tutorializator
        │   ├── CLAUDE.md
        │   ├── SRS.md
        │   ├── PLAN.md
        │   ├── TUTORIAL.md
        │   └── SS/
        └── project.config.js   # Config de Tutorializator
```

## 📋 Skills Templates

Los templates en `Skills/` guían la generación de documentos:

| Template | Propósito |
|----------|-----------|
| `SRS_TEMPLATE.md` | Especificación de requisitos (IEEE 830) |
| `PLAN_TEMPLATE.md` | Plan de trabajo con sprints |
| `CLAUDE_TEMPLATE.md` | Hub central de contexto y logs |
| `LOVABLE_PROMPT_TEMPLATE.md` | Prompts para mockups en lovable.dev |
| `ERASER_DSL_TEMPLATE.md` | DSL para diagramas en eraser.io |
| `README_TEMPLATE.md` | README técnico para repos |

## ⚙️ Project Config

El archivo `project.config.js` centraliza la configuración del proyecto:

```javascript
export default {
  project: {
    code: 'TC',
    name: 'Sistema de Cambio de Divisas',
  },
  client: {
    name: 'NOR-PAN S.R.L.',
    folder: 'NOR-PAN',
  },
  team: {
    pm: 'Felipe Rebolledo',
    developer: 'Camilo Acencio',
  },
  progress: {
    requirements: [
      { code: 'RF-001', name: 'Autenticación', progress: 100 },
      { code: 'RF-002', name: 'CRUD Clientes', progress: 80 },
    ],
  },
};
```

Ver `project.config.example.js` para todas las opciones disponibles.

## 📄 Export Config (tutorial.config.js)

Para exportar documentos a PDF/DOCX/Video:

```javascript
export default {
  input: './TUTORIAL.md',
  output: './TUTORIAL.pdf',
  imagesDir: './SS',
  
  cover: {
    logo: './SS/logo.png',
    title: 'Tutorial de Uso',
    subtitle: 'Guía completa',
    version: '1.0',
    footer: 'Mi Empresa',
  },
  
  header: 'Mi Empresa · Mi Sistema',
  theme: 'shadcn-dark',
  
  video: {
    output: './TUTORIAL.mp4',
    fps: 30,
    slideDuration: 6,
    transition: 'crossfade',
  },
};
```

### Opciones principales

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `input` | `string` | Ruta al Markdown |
| `output` | `string` | Ruta del archivo generado |
| `imagesDir` | `string` | Carpeta de screenshots |
| `theme` | `string` | `shadcn-dark` o `presupuesto-norpan` |
| `format` | `string` | `A4` o `Letter` |

## 🎨 Temas

### Built-in: `shadcn-dark`

- Portada: fondo zinc-950, card con bordes zinc-800
- Cuerpo: fondo blanco, tipografía slate
- Código: fondo dark con fuente monospace
- Tablas: headers oscuros, filas alternadas

### Built-in: `presupuesto-norpan`

- Portada: imagen de fondo full-bleed + overlay blanco con títulos Poppins
- Cuerpo: Cambria 11pt (serif) para texto, Calibri Bold para headings
- Formato: US Letter con márgenes de 1 pulgada
- Ideal para: presupuestos, SRS, propuestas, documentos formales

### Tema personalizado

```javascript
// mi-tema.mjs
const CSS = `
  body { font-family: Georgia, serif; }
  .cover { background: #1a1a2e; }
`;
export default CSS;
```

## 📖 Uso como Módulo

```javascript
import { exportTutorialToPDF } from 'tutorializator-2049';
import { exportTutorialToVideo } from 'tutorializator-2049/video';
import { exportToDocx } from 'tutorializator-2049/docx';

await exportTutorialToPDF(config);
await exportTutorialToVideo(config);
await exportToDocx(config);
```

## 🔄 Progress Tracking

El comando `sync` lee `CLAUDE.md` y detecta el progreso de los RFs:

```bash
npx tutorializator sync
```

Output:
```
📊 Documentation Status Report

Documents:
  ✅ CLAUDE.md            Complete
  ✅ SRS.md               Complete
  ⚠️ PLAN.md              Template
  ⬜ TUTORIAL.md          Not created

RF Progress:
  RF-001 Autenticación      ██████████ 100%
  RF-002 CRUD Clientes      ████████░░  80%
  RF-003 Dashboard          ░░░░░░░░░░   0%

  Overall: ████████░░ 60%
```

Cuando todos los RFs llegan al 100%, se muestra:
```
🎉 ALL RFs COMPLETE! Ready for release.
```

## 📘 Documentation Guide

Ver [Skills/TUTORIAL_GUIDE.md](Skills/TUTORIAL_GUIDE.md) para la guía completa de cómo estructurar tutoriales.

## 📄 Licencia

MIT © [CamiloIncba](https://github.com/CamiloIncba)