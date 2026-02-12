/**
 * ============================================================
 *  export-pdf.mjs — Generic Markdown → PDF engine
 *  tutorial-pdf-video-generator
 * ============================================================
 *
 *  Usage as module:
 *    import { exportTutorialToPDF } from 'tutorial-pdf-video-generator';
 *    await exportTutorialToPDF(config);
 *
 *  Usage from CLI:
 *    npx tutorial-pdf --config ./tutorial.config.js
 *
 * ============================================================
 */

import { chromium } from 'playwright';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, dirname, extname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { marked } from 'marked';

// ─── Load theme ────────────────────────────────────────────────
async function loadThemeCSS(theme) {
  // If theme is a file path, load it
  if (theme && (theme.endsWith('.css') || theme.endsWith('.mjs'))) {
    if (theme.endsWith('.css')) {
      return readFileSync(resolve(theme), 'utf8');
    }
    const mod = await import(pathToFileURL(resolve(theme)).href);
    return mod.default || mod.CSS;
  }

  // Built-in themes
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const themeName = theme || 'shadcn-dark';
  const themePath = join(__dirname, 'themes', `${themeName}.mjs`);

  if (!existsSync(themePath)) {
    console.warn(`  WARN: Theme "${themeName}" not found, using shadcn-dark`);
    const fallback = join(__dirname, 'themes', 'shadcn-dark.mjs');
    const mod = await import(pathToFileURL(fallback).href);
    return mod.default || mod.CSS;
  }

  const mod = await import(pathToFileURL(themePath).href);
  return mod.default || mod.CSS;
}

// ─── Build cover HTML ──────────────────────────────────────────
function buildCover(coverConfig, margins) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
  });

  // Logo
  let logoTag = '';
  if (coverConfig.logo && existsSync(coverConfig.logo)) {
    const ext = extname(coverConfig.logo).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const logoB64 = readFileSync(coverConfig.logo).toString('base64');
    logoTag = `<img src="data:${mime};base64,${logoB64}" alt="${coverConfig.title || ''}" />`;
  } else if (coverConfig.logoText) {
    logoTag = `<span style="font-size:42pt;font-weight:800;color:#fafafa;">${coverConfig.logoText}</span>`;
  }

  // Meta rows
  const metaRows = [];
  if (coverConfig.version) {
    metaRows.push({ label: 'Versión', value: coverConfig.version });
  }
  metaRows.push({ label: 'Fecha', value: coverConfig.date || dateStr });
  if (coverConfig.classification) {
    metaRows.push({ label: 'Clasificación', value: coverConfig.classification });
  }
  // Custom meta entries
  if (coverConfig.meta) {
    for (const [label, value] of Object.entries(coverConfig.meta)) {
      metaRows.push({ label, value });
    }
  }

  const metaHTML = metaRows
    .map(
      (r) => `
        <div class="cover-meta-row">
          <span class="cover-meta-label">${r.label}</span>
          <span class="cover-meta-value">${r.value}</span>
        </div>`
    )
    .join('');

  const m = margins || { top: 20, right: 18, bottom: 22, left: 18 };

  return `
  <div class="cover" style="margin: -${m.top}mm -${m.left}mm -${m.bottom}mm -${m.right || m.left}mm; padding: 40mm 30mm;">
    <div class="cover-card">
      ${logoTag ? `<div class="cover-logo">${logoTag}</div>` : ''}
      <div class="cover-divider"></div>
      <div class="cover-title">${coverConfig.title || 'Tutorial'}</div>
      ${coverConfig.subtitle ? `<div class="cover-desc">${coverConfig.subtitle}</div>` : ''}
      <div class="cover-divider"></div>
      <div class="cover-meta">
        ${metaHTML}
      </div>
    </div>
    ${coverConfig.footer ? `<div class="cover-footer">${coverConfig.footer}</div>` : ''}
  </div>`;
}

// ─── Build TOC ─────────────────────────────────────────────────
function buildTOC(htmlContent, tocTitle) {
  const headingRegex = /<h([23])\s*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const items = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, '');
    items.push({ level, id, text });
  }

  if (items.length === 0) return '';

  const listItems = items
    .map(
      (item) =>
        `<li class="toc-h${item.level}"><a href="#${item.id}">${item.text}</a></li>`
    )
    .join('\n      ');

  return `
  <div class="toc">
    <h2 style="page-break-before: avoid;">${tocTitle || 'Índice de Contenidos'}</h2>
    <ul class="toc-list">
      ${listItems}
    </ul>
  </div>`;
}

// ─── Process Markdown ──────────────────────────────────────────
function processMarkdown(mdContent, imagesDir) {
  marked.use({
    renderer: {
      heading({ text, depth, raw }) {
        const cleanText = raw
          .replace(/[^\w\sáéíóúñü.-]/gi, '')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        const id = `section-${cleanText}`;
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
      image({ href, title, text }) {
        // Try to resolve image relative to imagesDir or as-is
        const candidates = [
          join(imagesDir, href),
          resolve(href),
        ];

        // Also handle SS/ prefix for backward compat
        if (href.startsWith('SS/')) {
          candidates.unshift(join(dirname(imagesDir), href));
        }

        for (const absPath of candidates) {
          if (existsSync(absPath)) {
            const imgBuffer = readFileSync(absPath);
            const b64 = imgBuffer.toString('base64');
            const ext = extname(absPath).toLowerCase();
            const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
              : ext === '.svg' ? 'image/svg+xml'
              : 'image/png';
            const alt = text || title || '';
            return `<img src="data:${mime};base64,${b64}" alt="${alt}" />`;
          }
        }

        console.warn('  WARN: Image not found: ' + href);
        return `<p style="color:#ef4444;font-style:italic;">[Imagen no encontrada: ${href}]</p>`;
      },
    },
  });

  let html = marked.parse(mdContent);

  // Remove first H1 (replaced by cover)
  html = html.replace(/<h1[^>]*>.*?<\/h1>/i, '');

  // Remove inline subtitle if present
  html = html.replace(/<h2[^>]*>Guía completa.*?<\/h2>/i, '');

  // Remove inline TOC from MD (we generate our own)
  const idxMatch = html.match(/<h2[^>]*>.*?[ÍI]ndice.*?<\/h2>/i);
  if (idxMatch) {
    const startPos = html.indexOf(idxMatch[0]);
    const afterToc = html.indexOf('<h2', startPos + idxMatch[0].length);
    if (afterToc > startPos) {
      html = html.substring(0, startPos) + html.substring(afterToc);
    }
  }

  return html;
}

// ─── Build full HTML ───────────────────────────────────────────
function buildFullHTML(config, css, mdContent) {
  const contentHTML = processMarkdown(mdContent, config.imagesDir);
  const cover = config.cover ? buildCover(config.cover, config.margins) : '';
  const toc = buildTOC(contentHTML, config.tocTitle);
  const title = config.cover?.title || 'Tutorial';

  return `<!DOCTYPE html>
<html lang="${config.lang || 'es'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${css}</style>
</head>
<body>
  ${cover}
  ${toc}
  <div class="content">
    ${contentHTML}
  </div>
</body>
</html>`;
}

// ─── Export to PDF ──────────────────────────────────────────────
/**
 * Export a Markdown tutorial to PDF.
 *
 * @param {object} config - Configuration object (from tutorial.config.js)
 * @param {import('playwright').Browser} [existingBrowser] - Optional reusable browser instance
 * @returns {Promise<string|null>} Path to generated PDF or null on error
 */
export async function exportTutorialToPDF(config, existingBrowser = null) {
  console.log('\n========================================');
  console.log('  Exportando Tutorial a PDF');
  console.log('========================================');

  // Validate input
  if (!existsSync(config.input)) {
    console.error('  ❌ Markdown not found: ' + config.input);
    return null;
  }

  console.log('  Origen:  ' + config.input);
  console.log('  Destino: ' + config.output);

  // Read markdown
  const mdContent = readFileSync(config.input, 'utf8');
  console.log('  Markdown: ' + mdContent.split('\n').length + ' líneas');

  // Count images
  const imgRefs = mdContent.match(/!\[.*?\]\([^)]+\)/g) || [];
  const imagesDir = config.imagesDir || dirname(config.input);
  let foundCount = 0;
  for (const ref of imgRefs) {
    const href = ref.match(/\(([^)]+)\)/)?.[1];
    if (href) {
      const candidates = [
        join(imagesDir, href),
        join(dirname(config.input), href),
        resolve(href),
      ];
      if (candidates.some((c) => existsSync(c))) foundCount++;
    }
  }
  console.log(`  Imágenes: ${foundCount}/${imgRefs.length} disponibles`);

  // Load theme CSS
  console.log('  Generando HTML...');
  const css = await loadThemeCSS(config.theme);
  const fullHTML = buildFullHTML(config, css, mdContent);

  // Launch or reuse browser
  const ownBrowser = !existingBrowser;
  const browser = existingBrowser || (await chromium.launch({ headless: true }));
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();

  // Load HTML
  console.log('  Cargando en Playwright...');
  await page.setContent(fullHTML, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Margins
  const m = config.margins || { top: 20, right: 18, bottom: 22, left: 18 };

  // Generate PDF
  console.log('  Generando PDF...');
  await page.pdf({
    path: config.output,
    format: config.format || 'A4',
    printBackground: true,
    margin: {
      top: `${m.top}mm`,
      right: `${m.right || m.left}mm`,
      bottom: `${m.bottom}mm`,
      left: `${m.left}mm`,
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width:100%;text-align:right;padding-right:${m.right || m.left}mm;font-size:8px;color:#cbd5e1;font-family:system-ui;">
        ${config.header || ''}
      </div>`,
    footerTemplate: `
      <div style="width:100%;text-align:center;font-size:9px;color:#94a3b8;font-family:system-ui;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>`,
  });

  await context.close();
  if (ownBrowser) await browser.close();

  // Report
  const stats = statSync(config.output);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  console.log('  ✅ PDF generado: ' + sizeMB + ' MB');
  console.log('  📄 ' + config.output);
  console.log('========================================\n');

  return config.output;
}
