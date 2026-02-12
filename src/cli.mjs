#!/usr/bin/env node
/**
 * ============================================================
 *  CLI — tutorial-pdf-video-generator
 *  Generate professional PDFs and videos from Markdown tutorials
 * ============================================================
 *
 *  Usage:
 *    npx tutorial-pdf [--config ./tutorial.config.js] [--pdf] [--video]
 *
 *  If no --config is provided, it looks for tutorial.config.js
 *  in the current working directory.
 *  If neither --pdf nor --video is specified, defaults to --pdf.
 * ============================================================
 */

import { resolve, dirname } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { exportTutorialToPDF } from './export-pdf.mjs';
import { exportTutorialToVideo } from './export-video.mjs';

// ─── Parse CLI args ────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  let configPath = null;
  let doPdf = false;
  let doVideo = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--pdf') {
      doPdf = true;
    } else if (args[i] === '--video') {
      doVideo = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    } else if (args[i] === '--version' || args[i] === '-v') {
      const pkg = JSON.parse(
        (await import('fs')).readFileSync(
          resolve(dirname(new URL(import.meta.url).pathname), '..', 'package.json'),
          'utf8'
        )
      );
      console.log(pkg.version);
      process.exit(0);
    }
  }

  // Default: look for tutorial.config.js in cwd
  if (!configPath) {
    configPath = resolve(process.cwd(), 'tutorial.config.js');
  }

  // If neither specified, default to PDF only
  if (!doPdf && !doVideo) {
    doPdf = true;
  }

  return { configPath, doPdf, doVideo };
}

function printHelp() {
  console.log(`
  tutorial-pdf-video-generator
  ────────────────────────────────────

  Generate professional PDFs and videos from Markdown tutorials.

  Usage:
    npx tutorial-pdf [options]

  Options:
    --config <path>   Path to tutorial.config.js (default: ./tutorial.config.js)
    --pdf             Generate PDF (default if no flag specified)
    --video           Generate MP4 video
    --help, -h        Show this help
    --version, -v     Show version

  Examples:
    npx tutorial-pdf --config ./tutorial.config.js
    npx tutorial-pdf --config ./tutorial.config.js --video
    npx tutorial-pdf --config ./tutorial.config.js --pdf --video
  `);
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  const { configPath, doPdf, doVideo } = parseArgs();

  if (!existsSync(configPath)) {
    console.error(`\n  ❌ Config file not found: ${configPath}`);
    console.error(`  Create a tutorial.config.js or use --config <path>\n`);
    process.exit(1);
  }

  console.log(`\n  📄 Config: ${configPath}`);

  // Load config
  const configUrl = pathToFileURL(configPath).href;
  const configModule = await import(configUrl);
  const config = configModule.default || configModule;

  // Resolve paths relative to config file location
  const configDir = dirname(configPath);
  const resolvedConfig = {
    ...config,
    input: resolve(configDir, config.input),
    output: resolve(configDir, config.output),
    imagesDir: resolve(configDir, config.imagesDir || './SS'),
    cover: {
      ...config.cover,
      logo: config.cover?.logo ? resolve(configDir, config.cover.logo) : null,
    },
  };

  // Resolve video paths
  if (config.video) {
    resolvedConfig.video = {
      ...config.video,
      output: config.video.output
        ? resolve(configDir, config.video.output)
        : resolvedConfig.output.replace(/\.pdf$/i, '.mp4'),
    };
    if (config.video.backgroundMusic) {
      resolvedConfig.video.backgroundMusic = resolve(configDir, config.video.backgroundMusic);
    }
  }

  // Execute requested exports
  if (doPdf) {
    await exportTutorialToPDF(resolvedConfig);
  }

  if (doVideo) {
    await exportTutorialToVideo(resolvedConfig);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n  ❌ Error:', err.message);
    process.exit(1);
  });
