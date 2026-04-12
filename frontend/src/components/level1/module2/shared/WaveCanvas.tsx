import { useRef, useEffect, memo } from 'react';
import { T } from '../types';

export type WaveMode = 'analog' | 'digital' | 'dual' | 'sampling-overlay';

interface WaveCanvasProps {
  mode?: WaveMode;
  frequency?: number;
  amplitude?: number;
  samplingRate?: number;
  bitDepth?: number;
  height?: number;
  showGrid?: boolean;
  paused?: boolean;
  label?: string;
  signalColor?: string;
  secondaryColor?: string;
  /** frequency for a second analog channel in 'dual' mode */
  frequency2?: number;
  amplitude2?: number;
}

function WaveCanvasInner({
  mode = 'analog',
  frequency = 3,
  amplitude = 0.65,
  samplingRate = 12,
  bitDepth = 4,
  height = 220,
  showGrid = true,
  paused = false,
  label,
  signalColor = T.signal,
  secondaryColor = T.interact,
  frequency2,
  amplitude2,
}: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  // Freeze time ref for paused mode
  const frozenTRef = useRef<number>(0);

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

      // Background
      ctx.fillStyle = T.bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(15,23,42,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) {
          const x = Math.round((i / 8) * W);
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let i = 0; i <= 4; i++) {
          const y = Math.round((i / 4) * H);
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
      }

      // Zero reference line
      const midY = H / 2;
      ctx.strokeStyle = 'rgba(15,23,42,0.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
      ctx.setLineDash([]);

      if (!paused) tRef.current += 0.018;
      else frozenTRef.current = tRef.current;
      const t = paused ? frozenTRef.current : tRef.current;

      const amp = amplitude * (H * 0.38);
      const freq = frequency;

      const drawAnalog = (f: number, a: number, color: string, alpha = 1) => {
        ctx.globalAlpha = alpha;
        // Glow bloom pass
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.globalAlpha = 0.12 * alpha;
        ctx.shadowBlur = 14;
        ctx.shadowColor = color;
        for (let i = 0; i <= 300; i++) {
          const x = (i / 300) * W;
          const y = midY + a * Math.sin((i / 300) * Math.PI * 2 * f + t);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Main signal
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 0;
        for (let i = 0; i <= 300; i++) {
          const x = (i / 300) * W;
          const y = midY + a * Math.sin((i / 300) * Math.PI * 2 * f + t);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      };

      const drawDigital = (f: number, a: number, bits: number, color: string) => {
        const levels = Math.pow(2, bits);
        const steps = Math.max(16, Math.floor(f * 6));
        const stepW = W / steps;
        let lastQY = midY;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;

        for (let i = 0; i < steps; i++) {
          const x = i * stepW;
          const raw = Math.sin((i / steps) * Math.PI * 2 * f + t);
          const q = Math.round((raw + 1) * 0.5 * (levels - 1)) / (levels - 1);
          const qY = midY - (q * 2 - 1) * a;

          if (i === 0) {
            ctx.moveTo(x, qY);
          } else {
            ctx.lineTo(x, lastQY);
            ctx.lineTo(x, qY);
          }
          ctx.lineTo(x + stepW, qY);
          lastQY = qY;
        }
        ctx.stroke();
      };

      if (mode === 'analog') {
        drawAnalog(freq, amp, signalColor);
      } else if (mode === 'digital') {
        drawDigital(freq, amp, bitDepth, signalColor);
      } else if (mode === 'dual') {
        const amp2 = (amplitude2 || amplitude) * (H * 0.38);
        const f2 = frequency2 || freq;
        drawAnalog(freq, amp, signalColor, 0.9);
        drawDigital(f2, amp2, bitDepth, secondaryColor);
      } else if (mode === 'sampling-overlay') {
        drawAnalog(freq, amp, signalColor);

        // Sample dots
        const sInterval = W / (samplingRate * (freq / 3));
        ctx.fillStyle = T.interact;
        for (let x = 0; x < W; x += sInterval) {
          const progress = x / W;
          const y = midY + amp * Math.sin(progress * Math.PI * 2 * freq + t);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Label
      if (label) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = signalColor;
        ctx.font = `bold 9px ${T.mono}`;
        ctx.fillText(label.toUpperCase(), 8, 14);
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, frequency, amplitude, samplingRate, bitDepth, paused, showGrid, label, signalColor, secondaryColor, frequency2, amplitude2, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}

export const WaveCanvas = memo(WaveCanvasInner);
