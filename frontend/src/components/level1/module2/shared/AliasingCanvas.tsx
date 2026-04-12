/**
 * AliasingCanvas.tsx
 * Physics-accurate 3-layer aliasing visualization.
 *
 * Layer 1 — True Signal (faint sky-blue): Ground truth high-frequency sine
 * Layer 2 — Sample Points (orange dots): Discrete samples at fs
 * Layer 3 — Reconstructed Signal (bold sky-blue): Linear interp from samples
 * Pink tint overlay: appears when fs < 2f (aliasing condition)
 *
 * Alias freq math: f_alias = |f - round(f/fs) * fs|
 */
import { useRef, useEffect, memo } from 'react';
import { T } from '../types';

interface AliasingCanvasProps {
  frequency: number;   // Signal frequency f (Hz, represented visually)
  sampleRate: number;  // Sampling rate fs
  height?: number;
  showAxes?: boolean;
}

function AliasingCanvasInner({ frequency, sampleRate, height = 260, showAxes = true }: AliasingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  const isAliasing = sampleRate < 2 * frequency;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth;
      const H = height;

      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      tRef.current += 0.015;
      const t = tRef.current;
      const midY = H / 2;
      const A = H * 0.34;

      // Internal time scale: maps pixel x → "seconds"
      const timeScale = 0.003;

      // ── ALIASING TINT ───────────────────────────────────────────────────
      if (isAliasing) {
        ctx.fillStyle = 'rgba(236,72,153,0.06)';
        ctx.fillRect(0, 0, W, H);
      }

      // Grid
      ctx.strokeStyle = 'rgba(15,23,42,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const x = (i / 8) * W;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
      ctx.setLineDash([]);

      // ── LAYER 1: TRUE SIGNAL (faint) ────────────────────────────────────
      ctx.beginPath();
      ctx.strokeStyle = T.signal;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.2;

      for (let px = 0; px <= W; px++ ) {
        const time = px * timeScale + t * 0.3;
        const y = midY + A * Math.sin(2 * Math.PI * frequency * time);
        px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // ── LAYER 2: SAMPLE POINTS ──────────────────────────────────────────
      const dt = 1 / sampleRate; // Time between samples in "virtual seconds"
      const samples: { x: number; y: number }[] = [];

      // Pixel width per "virtual second"
      const pxPerSec = 1 / timeScale;
      const sampleSpacePx = dt * pxPerSec;

      ctx.fillStyle = T.interact;
      for (let sx = 0; sx < W; sx += sampleSpacePx) {
        const time = sx * timeScale + t * 0.3;
        const y = midY + A * Math.sin(2 * Math.PI * frequency * time);
        samples.push({ x: sx, y });

        // Dot with stem
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(sx, midY);
        ctx.lineTo(sx, y);
        ctx.strokeStyle = `${T.interact}60`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ── LAYER 3: RECONSTRUCTED SIGNAL ───────────────────────────────────
      if (samples.length > 1) {
        // Determine alias frequency
        const n = Math.round(frequency / sampleRate);
        const fAlias = Math.abs(frequency - n * sampleRate);
        const reconFreq = isAliasing ? fAlias : frequency;

        ctx.beginPath();
        ctx.strokeStyle = T.signal;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `${T.signal}60`;

        for (let px = 0; px <= W; px++ ) {
          const time = px * timeScale + t * 0.3;
          // Reconstruct using alias frequency
          let y: number;
          if (isAliasing) {
            y = midY + A * Math.sin(2 * Math.PI * reconFreq * time + (reconFreq !== frequency ? Math.PI : 0));
          } else {
            // Perfect reconstruction: linear interpolation between sample points
            const timeAtPx = px * timeScale + t * 0.3;
            const sampleIdx = timeAtPx / dt;
            const i0 = Math.floor(sampleIdx);
            const i1 = i0 + 1;
            const frac = sampleIdx - i0;
            const y0 = midY + A * Math.sin(2 * Math.PI * frequency * i0 * dt);
            const y1 = midY + A * Math.sin(2 * Math.PI * frequency * i1 * dt);
            y = y0 + frac * (y1 - y0);
          }
          px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // ── AXIS LABELS ─────────────────────────────────────────────────────
      if (showAxes) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = T.muted;
        ctx.font = `bold 8px ${T.mono}`;
        ctx.fillText('TRUE SIGNAL', 8, 14);

        ctx.fillStyle = isAliasing ? 'rgba(236,72,153,0.8)' : T.signal;
        ctx.fillText(isAliasing ? 'RECONSTRUCTED (ALIASED)' : 'RECONSTRUCTED ✓', W - 175, 14);

        ctx.fillStyle = T.interact;
        ctx.fillText('SAMPLES', 8, H - 8);
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [frequency, sampleRate, height, showAxes, isAliasing]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}

export const AliasingCanvas = memo(AliasingCanvasInner);
