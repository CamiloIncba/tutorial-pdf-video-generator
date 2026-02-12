/**
 * tutorial.config.js — Example configuration
 *
 * Copy this file to your project's `-more/` folder and customize.
 * Run with: npx tutorial-pdf --config ./tutorial.config.js
 */

export default {
  // ─── Input / Output ───────────────────────────────────────────
  /** Path to the Markdown source file (relative to this config file) */
  input: './TUTORIAL-MY-PROJECT.md',

  /** Path for the generated PDF (relative to this config file) */
  output: './TUTORIAL-MY-PROJECT.pdf',

  /** Directory containing screenshots referenced in Markdown */
  imagesDir: './SS',

  // ─── Cover ────────────────────────────────────────────────────
  cover: {
    /** Path to logo image (PNG, JPG, or SVG). Omit for text-only cover */
    logo: './SS/logo.png',

    /** Fallback: if no logo file, show this text instead */
    // logoText: 'MY APP',

    /** Main title on cover */
    title: 'Tutorial de Uso\nMi Aplicación',

    /** Subtitle / short description (optional) */
    subtitle: 'Guía completa del sistema para usuarios finales',

    /** Version tag shown in cover metadata */
    version: '1.0 · Enero 2026',

    /** Classification label */
    classification: 'Uso interno',

    /** Explicit date string (if omitted, auto-generates month+year) */
    // date: 'Enero 2026',

    /** Small text below cover card */
    footer: 'Mi Empresa S.A.',

    /** Additional meta rows (key → value) */
    // meta: {
    //   'Autor': 'Nombre Apellido',
    //   'Departamento': 'IT',
    // },
  },

  // ─── Header / Footer ─────────────────────────────────────────
  /** Text shown in top-right of every page (small, gray) */
  header: 'Mi Empresa S.A. · Mi Aplicación',

  // ─── Theme ────────────────────────────────────────────────────
  /** Built-in: 'shadcn-dark'. Or path to custom .mjs / .css file */
  theme: 'shadcn-dark',

  // ─── TOC ──────────────────────────────────────────────────────
  /** Title for the table of contents page */
  tocTitle: 'Índice de Contenidos',

  // ─── Page format ──────────────────────────────────────────────
  /** Paper size: 'A4', 'Letter', etc. */
  format: 'A4',

  /** Page margins in mm */
  margins: {
    top: 20,
    right: 18,
    bottom: 22,
    left: 18,
  },

  /** HTML lang attribute */
  lang: 'es',
};
