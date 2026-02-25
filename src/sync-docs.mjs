#!/usr/bin/env node
/**
 * ============================================================
 *  sync-docs.mjs — Tutorializator-2049
 *  Sync and track project documentation progress
 * ============================================================
 *
 *  Usage:
 *    npx tutorializator sync [--check] [--update-progress]
 *
 *  Features:
 *    - Check completeness of documentation
 *    - Track RF progress from CLAUDE.md
 *    - Detect when all RFs are at 100% (release ready)
 * ============================================================
 */

import { resolve, dirname, join } from 'path';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── ANSI Colors ───────────────────────────────────────────────
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// ─── Parse CLI args ────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  let configPath = null;
  let checkOnly = false;
  let updateProgress = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--check') {
      checkOnly = true;
    } else if (args[i] === '--update-progress') {
      updateProgress = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return { configPath, checkOnly, updateProgress };
}

function printHelp() {
  console.log(`
${colors.bright}Tutorializator-2049 — Documentation Sync${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npx tutorializator sync [options]

${colors.cyan}Options:${colors.reset}
  --config PATH       Path to project.config.js
  --check             Check documentation completeness only
  --update-progress   Update progress tracking in CLAUDE.md
  --help, -h          Show this help

${colors.cyan}Examples:${colors.reset}
  npx tutorializator sync
  npx tutorializator sync --check
  npx tutorializator sync --config ./project.config.js
`);
}

// ─── Config loading ────────────────────────────────────────────
async function loadConfig(configPath) {
  const paths = configPath 
    ? [configPath]
    : [
        resolve(process.cwd(), 'project.config.js'),
        resolve(process.cwd(), 'project.config.mjs'),
        resolve(process.cwd(), 'tutorial.config.js'),
      ];

  for (const p of paths) {
    if (existsSync(p)) {
      try {
        const configModule = await import(pathToFileURL(p).href);
        log.success(`Loaded config: ${p}`);
        return { config: configModule.default, configPath: p };
      } catch (err) {
        log.error(`Error loading config: ${err.message}`);
      }
    }
  }

  log.warn('No config file found. Using defaults.');
  return { config: null, configPath: null };
}

// ─── Documentation checks ──────────────────────────────────────
function findMoreFolder(startDir) {
  const items = readdirSync(startDir);
  
  for (const item of items) {
    if (item.endsWith('-more') && statSync(join(startDir, item)).isDirectory()) {
      return join(startDir, item);
    }
  }
  
  return null;
}

function checkDocumentation(moreDir) {
  const docs = {
    'CLAUDE.md': { required: true, exists: false, hasContent: false },
    'SRS.md': { required: true, exists: false, hasContent: false },
    'PLAN.md': { required: true, exists: false, hasContent: false },
    'TUTORIAL.md': { required: false, exists: false, hasContent: false },
    'LOVABLE-PROMPT.md': { required: false, exists: false, hasContent: false },
    'ERASER-DSL.md': { required: false, exists: false, hasContent: false },
    'README.md': { required: false, exists: false, hasContent: false },
  };

  for (const [filename, info] of Object.entries(docs)) {
    const filePath = join(moreDir, filename);
    if (existsSync(filePath)) {
      info.exists = true;
      const content = readFileSync(filePath, 'utf8');
      // Check if it has more than just template placeholders
      info.hasContent = content.length > 500 && !content.includes('{{PROYECTO}}');
    }
  }

  return docs;
}

function checkFolders(moreDir) {
  const folders = {
    'SS': { required: true, exists: false, fileCount: 0 },
    'diagrams': { required: false, exists: false, fileCount: 0 },
  };

  for (const [folderName, info] of Object.entries(folders)) {
    const folderPath = join(moreDir, folderName);
    if (existsSync(folderPath) && statSync(folderPath).isDirectory()) {
      info.exists = true;
      info.fileCount = readdirSync(folderPath).filter(f => !f.startsWith('.')).length;
    }
  }

  return folders;
}

// ─── Progress tracking ─────────────────────────────────────────
function parseProgressFromClaude(claudePath) {
  if (!existsSync(claudePath)) {
    return null;
  }

  const content = readFileSync(claudePath, 'utf8');
  const rfProgress = [];

  // Parse progress tracking table
  // Looking for: | RF-XXX | Description | ████░░░░░░ XX% |
  const rfRegex = /\|\s*(RF-\d+)\s*\|\s*([^|]+)\s*\|\s*[█░]*\s*(\d+)%/g;
  let match;

  while ((match = rfRegex.exec(content)) !== null) {
    rfProgress.push({
      code: match[1].trim(),
      name: match[2].trim(),
      progress: parseInt(match[3], 10),
    });
  }

  // Calculate overall progress
  const overall = rfProgress.length > 0
    ? Math.round(rfProgress.reduce((sum, rf) => sum + rf.progress, 0) / rfProgress.length)
    : 0;

  return {
    requirements: rfProgress,
    overall,
    allComplete: rfProgress.length > 0 && rfProgress.every(rf => rf.progress === 100),
  };
}

// ─── Progress bar generation ───────────────────────────────────
function progressBar(percent, width = 20) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return bar;
}

// ─── Output report ─────────────────────────────────────────────
function printReport(docs, folders, progress, moreDir) {
  log.title('📊 Documentation Status Report');

  // Documents
  console.log(`${colors.bright}Documents:${colors.reset}`);
  for (const [filename, info] of Object.entries(docs)) {
    const emoji = info.exists 
      ? (info.hasContent ? '✅' : '⚠️')
      : (info.required ? '❌' : '⬜');
    const status = info.exists
      ? (info.hasContent ? colors.green + 'Complete' : colors.yellow + 'Template')
      : (info.required ? colors.red + 'Missing' : colors.dim + 'Not created');
    console.log(`  ${emoji} ${filename.padEnd(20)} ${status}${colors.reset}`);
  }

  // Folders
  console.log(`\n${colors.bright}Folders:${colors.reset}`);
  for (const [folderName, info] of Object.entries(folders)) {
    const emoji = info.exists ? (info.fileCount > 0 ? '✅' : '⬜') : '❌';
    const status = info.exists
      ? `${info.fileCount} files`
      : 'Missing';
    console.log(`  ${emoji} ${folderName.padEnd(20)} ${status}`);
  }

  // Progress tracking
  if (progress && progress.requirements.length > 0) {
    console.log(`\n${colors.bright}RF Progress:${colors.reset}`);
    for (const rf of progress.requirements) {
      const bar = progressBar(rf.progress, 10);
      const pctColor = rf.progress === 100 ? colors.green : (rf.progress >= 50 ? colors.yellow : colors.red);
      console.log(`  ${rf.code} ${rf.name.substring(0, 25).padEnd(25)} ${bar} ${pctColor}${rf.progress.toString().padStart(3)}%${colors.reset}`);
    }
    
    console.log(`\n  ${colors.bright}Overall: ${progressBar(progress.overall)} ${progress.overall}%${colors.reset}`);
    
    // Release check
    if (progress.allComplete) {
      console.log(`\n  ${colors.green}${colors.bright}🎉 ALL RFs COMPLETE! Ready for release.${colors.reset}`);
    }
  }

  // Summary
  const requiredDocs = Object.entries(docs).filter(([_, info]) => info.required);
  const completeDocs = requiredDocs.filter(([_, info]) => info.exists && info.hasContent);
  const docScore = Math.round((completeDocs.length / requiredDocs.length) * 100);

  console.log(`\n${colors.bright}Summary:${colors.reset}`);
  console.log(`  Documentation: ${docScore}% complete (${completeDocs.length}/${requiredDocs.length} required docs)`);
  console.log(`  Location: ${moreDir}`);
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  const args = parseArgs();
  
  log.title('🔄 Tutorializator-2049 — Documentation Sync');

  // Load config
  const { config } = await loadConfig(args.configPath);

  // Find -more folder
  const startDir = process.cwd();
  const moreDir = config?.paths?.docs 
    ? resolve(startDir, config.paths.docs)
    : findMoreFolder(startDir);

  if (!moreDir) {
    log.error('Could not find {PROJECT}-more folder.');
    log.info('Run "npx tutorializator init" first to create project structure.');
    process.exit(1);
  }

  log.info(`Found documentation folder: ${moreDir}`);

  // Check documentation
  const docs = checkDocumentation(moreDir);
  const folders = checkFolders(moreDir);
  
  // Parse progress from CLAUDE.md
  const claudePath = join(moreDir, 'CLAUDE.md');
  const progress = parseProgressFromClaude(claudePath);

  // Print report
  printReport(docs, folders, progress, moreDir);

  // Return exit code based on completeness
  const requiredDocs = Object.entries(docs).filter(([_, info]) => info.required);
  const missingRequired = requiredDocs.filter(([_, info]) => !info.exists);
  
  if (missingRequired.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
