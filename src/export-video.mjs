/**
 * ============================================================
 *  export-video.mjs — Markdown → MP4 video engine
 *  tutorial-pdf-video-generator
 * ============================================================
 *
 *  Pipeline:
 *    1. Parse Markdown → slides (slide-builder)
 *    2. For each slide, render animated frames via Playwright
 *    3. Concatenate frames + transitions with FFmpeg → .mp4
 *
 *  Usage as module:
 *    import { exportTutorialToVideo } from './export-video.mjs';
 *    await exportTutorialToVideo(config);
 *
 * ============================================================
 */

import { chromium } from 'playwright';
import { existsSync, mkdirSync, rmSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { spawn } from 'child_process';
import { buildSlides } from './slide-builder.mjs';
import { renderSlideHTML, loadVideoThemeCSS } from './slide-renderer.mjs';

// ─── Find FFmpeg binary ────────────────────────────────────────
function findFFmpeg() {
  try {
    // Try ffmpeg-static first (npm package)
    const ffmpegStatic = await import('ffmpeg-static');
    const bin = ffmpegStatic.default || ffmpegStatic;
    if (bin && existsSync(bin)) return bin;
  } catch {
    // Not installed
  }
  // Fallback to system PATH
  return 'ffmpeg';
}

// Workaround: top-level await not available in regular function
let _ffmpegPath = null;
async function getFFmpegPath() {
  if (_ffmpegPath) return _ffmpegPath;
  try {
    const mod = await import('ffmpeg-static');
    const bin = mod.default || mod;
    if (bin && typeof bin === 'string' && existsSync(bin)) {
      _ffmpegPath = bin;
      return bin;
    }
  } catch { /* ignore */ }
  _ffmpegPath = 'ffmpeg';
  return 'ffmpeg';
}

// ─── Run FFmpeg command ────────────────────────────────────────
function runFFmpeg(args, label) {
  return new Promise((resolve, reject) => {
    const proc = spawn(args[0], args.slice(1), { stdio: ['pipe', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg ${label} failed (code ${code}):\n${stderr.slice(-500)}`));
      }
    });
    proc.on('error', (err) => {
      reject(new Error(`FFmpeg not found. Install it: npm install ffmpeg-static\n${err.message}`));
    });
  });
}

// ─── Capture frames for a single slide ─────────────────────────
async function captureSlideFrames(page, slide, css, resolution, fps, framesDir, startFrame) {
  const duration = slide.duration;
  const totalFrames = Math.ceil(duration * fps);

  // Animation: first 20% of frames animate in, last 10% hold, middle 70% full
  const animInFrames = Math.ceil(totalFrames * 0.20);
  const animHoldEnd = Math.ceil(totalFrames * 0.90);

  let frameIndex = startFrame;

  for (let f = 0; f < totalFrames; f++) {
    // Calculate animation phase
    let phase;
    if (f < animInFrames) {
      // Ease-out cubic for smooth entry
      const t = f / animInFrames;
      phase = 1 - Math.pow(1 - t, 3);
    } else if (f < animHoldEnd) {
      phase = 1.0;
    } else {
      // Slight fade at very end (for crossfade transition)
      const t = (f - animHoldEnd) / (totalFrames - animHoldEnd);
      phase = 1.0 - t * 0.15; // subtle fade to 0.85
    }

    const html = renderSlideHTML(slide, phase, css, resolution);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Small wait for first frame to ensure fonts load
    if (f === 0) await page.waitForTimeout(100);

    const framePath = join(framesDir, `frame-${String(frameIndex).padStart(7, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });
    frameIndex++;
  }

  return frameIndex;
}

// ─── Generate crossfade transition frames ──────────────────────
async function captureTransitionFrames(page, slideA, slideB, css, resolution, fps, transitionDuration, framesDir, startFrame) {
  const totalFrames = Math.ceil(transitionDuration * fps);
  let frameIndex = startFrame;

  for (let f = 0; f < totalFrames; f++) {
    const t = f / (totalFrames - 1 || 1);
    // Ease in-out
    const eased = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Render slide B at entry phase
    const phaseB = eased;
    const html = renderSlideHTML(slideB, phaseB, css, resolution);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const framePath = join(framesDir, `frame-${String(frameIndex).padStart(7, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });
    frameIndex++;
  }

  return frameIndex;
}

// ─── Main export ───────────────────────────────────────────────
/**
 * Export a Markdown tutorial to MP4 video.
 *
 * @param {object} config  Resolved config (with video section)
 * @returns {Promise<string|null>}  Path to generated video or null
 */
export async function exportTutorialToVideo(config) {
  const videoCfg = config.video || {};
  const output = videoCfg.output || config.output.replace(/\.pdf$/i, '.mp4');
  const resolution = videoCfg.resolution || { width: 1920, height: 1080 };
  const fps = videoCfg.fps || 144;
  const transitionDuration = videoCfg.transitionDuration ?? 0.5;
  const transition = videoCfg.transition || 'crossfade';

  console.log('\n========================================');
  console.log('  Exportando Tutorial a Video');
  console.log('========================================');
  console.log(`  Resolución: ${resolution.width}×${resolution.height}`);
  console.log(`  FPS: ${fps}`);
  console.log(`  Transición: ${transition} (${transitionDuration}s)`);

  // Validate input
  if (!existsSync(config.input)) {
    console.error('  ❌ Markdown no encontrado: ' + config.input);
    return null;
  }

  // Build slides
  console.log('  Parseando Markdown...');
  const slides = buildSlides(config);
  console.log(`  Slides: ${slides.length}`);

  // Calculate total duration
  const contentDuration = slides.reduce((sum, s) => sum + s.duration, 0);
  const transitionsDuration = (slides.length - 1) * transitionDuration;
  const totalDuration = contentDuration + transitionsDuration;
  const totalFrames = Math.ceil(totalDuration * fps);
  console.log(`  Duración estimada: ${totalDuration.toFixed(1)}s (~${totalFrames} frames)`);

  // Temp directory for frames
  const framesDir = join(dirname(output), '.tutorial-video-frames');
  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
  mkdirSync(framesDir, { recursive: true });

  // Load theme
  const css = await loadVideoThemeCSS(videoCfg.theme || config.theme);

  // Launch browser
  console.log('  Lanzando Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: resolution.width, height: resolution.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Capture all frames
  let frameIndex = 0;
  const progressInterval = Math.max(1, Math.floor(slides.length / 10));

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    if (i % progressInterval === 0 || i === slides.length - 1) {
      const pct = Math.round((i / slides.length) * 100);
      process.stdout.write(`\r  🎬 Renderizando: ${pct}% (slide ${i + 1}/${slides.length}, frame ${frameIndex})`);
    }

    // Capture slide frames
    frameIndex = await captureSlideFrames(
      page, slide, css, resolution, fps, framesDir, frameIndex
    );

    // Capture transition frames (except after last slide)
    if (i < slides.length - 1 && transitionDuration > 0) {
      if (transition === 'crossfade') {
        frameIndex = await captureTransitionFrames(
          page, slide, slides[i + 1], css, resolution, fps,
          transitionDuration, framesDir, frameIndex
        );
      } else if (transition === 'fade-black') {
        // Fade to black: render empty black frames
        const transFrames = Math.ceil(transitionDuration * fps);
        for (let f = 0; f < transFrames; f++) {
          await page.setContent(`<!DOCTYPE html><html><body style="margin:0;background:#000;width:${resolution.width}px;height:${resolution.height}px;"></body></html>`, { waitUntil: 'domcontentloaded' });
          const framePath = join(framesDir, `frame-${String(frameIndex).padStart(7, '0')}.png`);
          await page.screenshot({ path: framePath, type: 'png' });
          frameIndex++;
        }
      }
      // 'cut' → no transition frames
    }
  }

  process.stdout.write(`\r  🎬 Renderizando: 100% — ${frameIndex} frames capturados        \n`);

  await context.close();
  await browser.close();

  // ── Assemble with FFmpeg ─────────────────────────────────────
  console.log('  Ensamblando video con FFmpeg...');
  const ffmpeg = await getFFmpegPath();

  const ffmpegArgs = [
    ffmpeg,
    '-y',                                   // Overwrite output
    '-framerate', String(fps),              // Input framerate
    '-i', join(framesDir, 'frame-%07d.png'), // Input pattern
    '-c:v', 'libx264',                      // H.264 codec
    '-preset', 'slow',                      // Better compression
    '-crf', '18',                           // High quality (lower = better, 18 is visually lossless)
    '-pix_fmt', 'yuv420p',                  // Compatibility
    '-r', String(fps),                      // Output framerate
    '-movflags', '+faststart',              // Web-optimized
  ];

  // Add background music if configured
  if (videoCfg.backgroundMusic && existsSync(videoCfg.backgroundMusic)) {
    ffmpegArgs.push('-i', videoCfg.backgroundMusic);
    ffmpegArgs.push('-c:a', 'aac', '-b:a', '192k');
    ffmpegArgs.push('-shortest');           // End when video ends
    console.log('  🎵 Audio: ' + videoCfg.backgroundMusic);
  }

  ffmpegArgs.push(output);

  await runFFmpeg(ffmpegArgs, 'encode');

  // Cleanup frames
  console.log('  Limpiando frames temporales...');
  rmSync(framesDir, { recursive: true });

  // Report
  if (existsSync(output)) {
    const stats = statSync(output);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    console.log(`  ✅ Video generado: ${sizeMB} MB`);
    console.log(`  🎥 ${output}`);
    console.log(`  ⏱️  ${totalDuration.toFixed(1)}s @ ${fps}fps`);
  }

  console.log('========================================\n');
  return output;
}
