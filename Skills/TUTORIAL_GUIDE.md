# 📘 Guía de Creación de Tutoriales para Aplicaciones Web

> **Skill** — Metodología estándar para documentar aplicaciones web internas con capturas automatizadas y exportación a PDF profesional.

---

## 1. Estructura de Carpetas

Cada proyecto que requiere documentación utiliza una carpeta auxiliar con el sufijo `-more/`:

```
MI-PROYECTO/              ← Código fuente
MI-PROYECTO-more/         ← Documentación
├── TUTORIAL-MI-PROYECTO.md
├── TUTORIAL-MI-PROYECTO.pdf      (generado)
├── tutorial.config.js            (configuración del generador)
├── SS/                           (screenshots)
│   ├── logo.png
│   ├── 01-login.png
│   ├── 02-panel-principal.png
│   ├── 03-crear-registro.png
│   └── ...
├── SCRIPT/                       (scripts específicos del proyecto)
│   ├── capture-tutorial.mjs      (captura automatizada, opcional)
│   └── package.json
└── DIAGRAMAS/                    (opcional)
    ├── CicloDeVida.png
    └── FlujoPrincipal.png
```

### Convenciones de Nombres

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Carpeta doc | `{PROYECTO}-more/` | `APP-PAGOS-more/` |
| Markdown | `TUTORIAL-{PROYECTO}.md` | `TUTORIAL-APP-PAGOS.md` |
| PDF | `TUTORIAL-{PROYECTO}.pdf` | `TUTORIAL-APP-PAGOS.pdf` |
| Screenshots | `NN-descripcion.png` | `07-filtro-estado.png` |
| Config | `tutorial.config.js` | — |

---

## 2. Estructura del Markdown

### 2.1 Encabezado Obligatorio

```markdown
# Tutorial de Uso — Mi Aplicación

**Versión:** 1.0 · Enero 2026
**Clasificación:** Uso interno

---
```

> El generador de PDF reemplaza el H1 con la portada. El encabezado del MD sirve como referencia rápida al leer el archivo directamente.

### 2.2 Índice

```markdown
## Índice de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
...
```

> El generador crea su propio índice con links internos. El índice en el MD se elimina automáticamente del PDF.

### 2.3 Secciones Estándar

Toda aplicación web tiene funcionalidades comunes. Esta es la estructura recomendada (adaptar según el proyecto):

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Introducción** | Qué es la app, para quién, qué problemas resuelve |
| 2 | **Acceso al Sistema** | Login, URL, credenciales, primer acceso |
| 3 | **Panel Principal** | Dashboard, resúmenes, tarjetas, layout general |
| 4 | **CRUD Principal** | Crear, ver, editar, eliminar registros |
| 5 | **Búsqueda y Filtros** | Barra de búsqueda, filtros combinados |
| 6 | **Acciones Especiales** | Workflows (aprobar, autorizar, rechazar) |
| 7 | **Ciclo de Vida** | Estados, transiciones, diagramas |
| 8 | **Funcionalidades Especiales** | Alertas, notificaciones, cálculos |
| 9 | **Exportación** | Descargas, reportes, impresión |
| 10 | **Notificaciones** | Centro de notificaciones, badges |
| 11 | **Gestión de Usuarios** | Roles, permisos, ABM de usuarios |
| 12 | **Integraciones** | Sincronización con ERP, APIs externas |
| 13 | **Historial** | Logs, auditoría, timeline |
| 14 | **Configuración** | Preferencias, ajustes del sistema |
| 15 | **Preguntas Frecuentes** | FAQ, troubleshooting |

> No todas las secciones aplican a todos los proyectos. Omitir las que no correspondan y mantener la numeración continua.

### 2.4 Formato por Sección

```markdown
## N. Título de la Sección

Breve párrafo introductorio explicando el propósito.

### N.1 Subsección

Explicación paso a paso.

1. Hacer clic en **[Botón]**
2. Completar el campo `Campo`
3. Confirmar con **Guardar**

![Descripción de la captura](SS/NN-descripcion.png)

> 💡 **Tip:** Información útil adicional
```

---

## 3. Capturas de Pantalla

### 3.1 Configuración del Viewport

| Parámetro | Valor |
|-----------|-------|
| Ancho | 1440px |
| Alto | 900px |
| Device Scale Factor | 2 (Retina) |
| Formato | PNG |

### 3.2 Nomenclatura

```
{NN}-{descripcion-con-guiones}.png
```

- `NN` = número secuencial con dos dígitos (01, 02, ...)
- `descripcion` = en minúsculas, kebab-case, máximo 4 palabras
- Ejemplos: `01-login.png`, `14-filtro-combinado.png`, `27-notificacion-badge.png`

### 3.3 Buenas Prácticas

- **Una acción por captura**: mostrar el resultado de un solo paso
- **Datos realistas**: usar datos de prueba que parezcan producción
- **Consistencia visual**: mantener el mismo tema (light/dark) en todas
- **Limpiar estados**: reiniciar filtros/formularios entre capturas
- **Resaltar el foco**: si la captura es de un modal, asegurarse de que esté visible y centrado

### 3.4 Captura Automatizada

Para apps con Playwright disponible, crear un script `capture-tutorial.mjs` que:

1. Lance la app en modo desarrollo
2. Navegue por cada pantalla
3. Tome screenshots con nombres consistentes
4. Interactúe con formularios para generar datos
5. Capture modales y estados intermedios

> Cada script de captura es **específico del proyecto** y no se incluye en el generador genérico.

---

## 4. Estilo de Escritura

### 4.1 Tono

- **Formal pero accesible**: evitar jerga técnica innecesaria
- **Directo**: "Haga clic en..." no "El usuario debería hacer clic en..."
- **Consistente**: usar siempre los mismos términos para los mismos conceptos

### 4.2 Convenciones Tipográficas

| Elemento | Formato Markdown | Ejemplo |
|----------|-----------------|---------|
| Botones / acciones | `**negrita**` | **Guardar**, **Eliminar** |
| Campos de formulario | `` `código` `` | `Fecha de Vencimiento` |
| Valores / opciones | `` `código` `` | `Pendiente`, `Autorizado` |
| Rutas de navegación | `→` separador | **Menú → Reportes → Exportar** |
| Tips / notas | `> 💡` blockquote | > 💡 **Tip:** texto |
| Advertencias | `> ⚠️` blockquote | > ⚠️ **Importante:** texto |
| URLs / paths | `` `código` `` | `http://localhost:3000` |

### 4.3 Idioma

- Escribir en **español** (Argentina) para documentación interna
- Mantener términos técnicos en inglés si son de uso común: "dashboard", "login", "deploy"
- Usar "usted" implícito (verbos en imperativo): "Haga clic", "Complete el campo"

---

## 5. Configuración del Generador

### 5.1 Archivo `tutorial.config.js`

Cada proyecto tiene su propio archivo de configuración en la carpeta `-more/`:

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
  format: 'A4',
  lang: 'es',
};
```

### 5.2 Opciones Disponibles

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `input` | string | Ruta al `.md` (relativa al config) |
| `output` | string | Ruta del PDF generado |
| `imagesDir` | string | Carpeta de screenshots |
| `cover.logo` | string | Ruta a imagen del logo |
| `cover.title` | string | Título principal (admite `\n`) |
| `cover.subtitle` | string | Descripción corta |
| `cover.version` | string | Etiqueta de versión |
| `cover.classification` | string | Nivel de clasificación |
| `cover.footer` | string | Texto pequeño bajo la portada |
| `cover.meta` | object | Filas adicionales `{label: value}` |
| `header` | string | Texto en cabecera de cada página |
| `theme` | string | `'shadcn-dark'` o ruta a tema custom |
| `tocTitle` | string | Título del índice |
| `format` | string | `'A4'`, `'Letter'`, etc. |
| `margins` | object | `{top, right, bottom, left}` en mm |
| `lang` | string | Atributo lang del HTML |

---

## 6. Generación del PDF

### 6.1 Comando

```bash
# Desde la carpeta -more/ del proyecto
npx tutorial-pdf --config ./tutorial.config.js
```

### 6.2 Qué Hace el Generador

1. Lee el Markdown y cuenta imágenes disponibles
2. Convierte a HTML con `marked`, embebiendo imágenes como base64
3. Genera portada con el tema elegido (shadcn dark por defecto)
4. Construye tabla de contenidos automática desde los H2/H3
5. Elimina el H1 original y la sección de índice del MD
6. Renderiza en Playwright (Chromium headless)
7. Exporta a PDF con márgenes, header y footer configurados

### 6.3 Resultado Esperado

- PDF con portada profesional (tema oscuro con logo)
- Índice con links clickeables
- Imágenes embebidas (sin dependencias externas)
- Numeración de páginas automática
- Header personalizado en cada página
- Tipografía limpia, tablas con bordes redondeados, código resaltado

---

## 7. Checklist de Publicación

Antes de distribuir el tutorial:

- [ ] Todas las capturas están actualizadas con la última versión de la app
- [ ] No hay screenshots con datos sensibles (contraseñas, tokens, datos reales de clientes)
- [ ] El Markdown no tiene errores de formato (revisar en VS Code Preview)
- [ ] Las imágenes referencidas en el MD existen en `SS/`
- [ ] El PDF se genera sin warnings de imágenes faltantes
- [ ] La versión y fecha están actualizadas en el config y en el MD
- [ ] El índice refleja todas las secciones
- [ ] Revisar el PDF en un visor: portada, índice, imágenes, formato de código

---

## 8. Mantenimiento

### 8.1 Actualización por Cambios en la App

1. Identificar las secciones afectadas por el cambio
2. Re-capturar solo las screenshots que cambiaron
3. Actualizar el texto correspondiente en el MD
4. Incrementar la versión (ej: `1.0` → `1.1`)
5. Regenerar el PDF

### 8.2 Versionado

| Tipo de Cambio | Incremento |
|----------------|------------|
| Corrección de typos | No incrementar |
| Actualización de screenshots | Menor (1.0 → 1.1) |
| Nuevas secciones | Menor (1.1 → 1.2) |
| Rediseño completo | Mayor (1.x → 2.0) |

---

*Documento de referencia para el equipo de desarrollo — Tutorial PDF Video Generator*
