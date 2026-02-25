#!/usr/bin/env node
/**
 * ============================================================
 *  CLI — Tutorializator-2049
 *  Generate professional documentation, PDFs, and videos
 * ============================================================
 *
 *  Usage:
 *    npx tutorializator <command> [options]
 *
 *  Commands:
 *    init              Initialize a new project with documentation structure
 *    sync              Check and track documentation progress
 *    export            Generate PDF/DOCX/Video from Markdown
 *    (no command)      Legacy mode: export with --pdf/--docx/--video flags
 * ============================================================
 */

import { resolve, dirname } from 'path';
import { existsSync, readFileSync } from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { exportTutorialToPDF } from './export-pdf.mjs';
import { exportTutorialToVideo } from './export-video.mjs';
import { exportToDocx } from './export-docx.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── ANSI Colors ───────────────────────────────────────────────
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

// ─── Command detection ─────────────────────────────────────────
function getCommand() {
  const args = process.argv.slice(2);
  const firstArg = args[0];
  
  // Check if first arg is a command
  if (firstArg === 'init' || firstArg === 'sync' || firstArg === 'export') {
    return firstArg;
  }
  
  // Legacy mode: no command, use flags
  return 'export';
}

// ─── Run subcommand script ─────────────────────────────────────
function runSubcommand(scriptName) {
  const scriptPath = resolve(__dirname, scriptName);
  const args = process.argv.slice(3); // Remove node, cli.mjs, command
  
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

// ─── Parse export args ─────────────────────────────────────────
function parseExportArgs() {
  const args = process.argv.slice(2);
  let configPath = null;
  let doPdf = false;
  let doVideo = false;
  let doDocx = false;
  
  // Skip 'export' command if present
  const startIndex = args[0] === 'export' ? 1 : 0;

  for (let i = startIndex; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--pdf') {
      doPdf = true;
    } else if (args[i] === '--video') {
      doVideo = true;
    } else if (args[i] === '--docx') {
      doDocx = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    } else if (args[i] === '--version' || args[i] === '-v') {
      const pkg = JSON.parse(
        readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8')
      );
      console.log(pkg.version);
      process.exit(0);
    }
  }

  // Default: look for tutorial.config.js in cwd
  if (!configPath) {
    configPath = resolve(process.cwd(), 'tutorial.config.js');
  }

  return { configPath, doPdf, doVideo, doDocx };
}

function printHelp() {
  console.log(`
  ${colors.bright}${colors.cyan}Tutorializator-2049${colors.reset}
  ────────────────────────────────────

  Generate professional documentation, PDFs, and videos.

  ${colors.bright}Usage:${colors.reset}
    npx tutorializator <command> [options]

  ${colors.bright}Commands:${colors.reset}
    ${colors.green}init${colors.reset}              Initialize a new project with documentation
    ${colors.green}sync${colors.reset}              Check and track documentation progress
    ${colors.green}export${colors.reset}            Generate PDF/DOCX/Video from Markdown

  ${colors.bright}Export Options:${colors.reset}
    --config <path>   Path to config file (default: ./tutorial.config.js)
    --pdf             Generate PDF (default if no flag specified)
    --docx            Generate DOCX (Word document)
    --video           Generate MP4 video

  ${colors.bright}Global Options:${colors.reset}
    --help, -h        Show this help
    --version, -v     Show version

  ${colors.bright}Examples:${colors.reset}
    npx tutorializator init --project TC --client NOR-PAN
    npx tutorializator sync --check
    npx tutorializator export --config ./tutorial.config.js --pdf
    npx tutorializator --pdf --video   # Legacy mode
  `);
}

// ─── Export handler ────────────────────────────────────────────
async function handleExport() {
  const { configPath, doPdf, doVideo, doDocx } = parseExportArgs();

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

  // Auto-detect format from output extension when no explicit flag was passed
  const outputIsDocx = config.output && config.output.endsWith('.docx');
  const explicitFlags = doDocx || doPdf || doVideo;

  // If user passed --docx or output is .docx (and no explicit --pdf)
  const shouldDocx = doDocx || (outputIsDocx && !doPdf);
  // PDF only if --pdf explicit, or default (no flags) and output is not .docx
  const shouldPdf = doPdf || (!explicitFlags && !outputIsDocx);

  // Resolve paths relative to config file location
  const configDir = dirname(configPath);
  const resolvedConfig = {
    ...config,
    _configPath: configPath,
    input: resolve(configDir, config.input),
    output: resolve(configDir, config.output),
    imagesDir: resolve(configDir, config.imagesDir || './SS'),
    cover: {
      ...config.cover,
      logo: config.cover?.logo ? resolve(configDir, config.cover.logo) : null,
      backgroundImage: config.cover?.backgroundImage
        ? resolve(configDir, config.cover.backgroundImage)
        : null,
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
  if (shouldDocx) {
    const docxOutput = resolvedConfig.output.endsWith('.docx')
      ? resolvedConfig.output
      : resolvedConfig.output.replace(/\.pdf$/i, '.docx');
    await exportToDocx({ ...resolvedConfig, output: docxOutput });
  }

  if (shouldPdf) {
    await exportTutorialToPDF(resolvedConfig);
  }

  if (doVideo) {
    await exportTutorialToVideo(resolvedConfig);
  }
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  const command = getCommand();

  switch (command) {
    case 'init':
      await runSubcommand('init-project.mjs');
      break;
    
    case 'sync':
      await runSubcommand('sync-docs.mjs');
      break;
    
    case 'export':
    default:
      await handleExport();
      break;
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n  ❌ Error:', err.message);
    process.exit(1);
  });
