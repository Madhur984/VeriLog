/**
 * QuantizationCanvas.tsx
 * Physics-accurate 3-layer quantization visualization.
 *
 * Layer 1 - Original Signal (faint): Smooth sinusoidal ground truth
 * Layer 2 - Quantized Signal (bold sky-blue): Stepped approximation at 2^bits levels
 * Layer 3 - Error Bars (orange): Vertical lines showing quantization error
 *
 * Quantization math:
 *   levels = 2^bits
 *   q_val = round((raw + 1) * 0.5 * (levels - 1)) / (levels - 1)
 *   error = raw - q_val (visualized as vertical orange bar)
 */
import { useRef, useEffect, memo } from 'react';
import { T } from '../types';

interface QuantizationCanvasProps {
  bits: number;        // Bit depth 1-8
  frequency?: number;  // Signal frequency
  height?: number;
  showErrorBars?: boolean;
}

function QuantizationCanvasInner({ bits, frequency = 2, height = 260, showErrorBars = true }: QuantizationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

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

      tRef.current += 0.018;
      const t = tRef.current;
      const midY = H / 2;
      const A = H * 0.36;
      const levels = Math.pow(2, bits);

      // Grid
      ctx.strokeStyle = 'rgba(15,23,42,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const x = (i / 8) * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Quantization level guides
      ctx.strokeStyle = 'rgba(14,165,233,0.08)';
      for (let l = 0; l <= levels; l++) {
        const normalized = l / levels;
        const y = midY - A + normalized * (2 * A);
        ctx.beginPath(); ctx.moveTo(0, H - y + midY - A * 2); ctx.lineTo(W, H - y + midY - A * 2); ctx.stroke();
      }

      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(15,23,42,0.07)';
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
      ctx.setLineDash([]);

      // Pre-compute sample pairs
      const N = 360;
      type Sample = { x: number; rawY: number; qY: number };
      const samples: Sample[] = [];

      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W;
        const raw = Math.sin((i / N) * Math.PI * 2 * frequency + t);
        const q = Math.round((raw + 1) * 0.5 * (levels - 1)) / (levels - 1);
        const qMapped = q * 2 - 1;
        samples.push({ x, rawY: midY + A * raw, qY: midY + A * qMapped });
      }

      // ── LAYER 3: ERROR BARS (drawn first, behind signal) ────────────────
      if (showErrorBars) {
        ctx.strokeStyle = `${T.interact}60`;
        ctx.lineWidth = 1.5;
        const stride = Math.max(1, Math.floor(N / 80));
        for (let i = 0; i < samples.length; i += stride) {
          const s = samples[i];
          if (Math.abs(s.rawY - s.qY) > 1) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.rawY);
            ctx.lineTo(s.x, s.qY);
            ctx.stroke();
          }
        }
      }

      // ── LAYER 1: ORIGINAL SIGNAL (faint) ────────────────────────────────
      ctx.beginPath();
      ctx.strokeStyle = T.signal;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.2;
      samples.forEach((s, i) => i === 0 ? ctx.moveTo(s.x, s.rawY) : ctx.lineTo(s.x, s.rawY));
      ctx.stroke();
      ctx.globalAlpha = 1;

      // ── LAYER 2: QUANTIZED SIGNAL (bold) ────────────────────────────────
      ctx.beginPath();
      ctx.strokeStyle = T.signal;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${T.signal}50`;

      let prevQY = samples[0].qY;
      ctx.moveTo(samples[0].x, prevQY);
      for (let i = 1; i < samples.length; i++) {
        const s = samples[i];
        if (Math.abs(s.qY - prevQY) > 0.5) {
          ctx.lineTo(s.x, prevQY);
          ctx.lineTo(s.x, s.qY);
        }
        ctx.lineTo(s.x, s.qY);
        prevQY = s.qY;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Bit-depth label
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = T.signal;
      ctx.font = `bold 9px ${T.mono}`;
      ctx.fillText(`${bits}-BIT  (${levels} LEVELS)`, 8, 14);

      const errorRms = Math.sqrt(
        samples.reduce((acc, s) => acc + Math.pow((s.rawY - s.qY) / (2 * A), 2), 0) / samples.length
      );
      ctx.fillStyle = T.interact;
      ctx.fillText(`ERROR RMS: ${(errorRms * 100).toFixed(1)}%`, W - 160, 14);
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bits, frequency, height, showErrorBars]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}

export const QuantizationCanvas = memo(QuantizationCanvasInner);
