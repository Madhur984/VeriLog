import React, { useEffect, useRef, useCallback } from 'react';

interface GraphCanvasProps {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  height?: number;
  live?: boolean; // if true, uses RAF for animated graphs
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ draw, height = 120, live = false }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const paint = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    draw(ctx, w, h);
    if (live) rafRef.current = requestAnimationFrame(paint);
  }, [draw, live]);

  useEffect(() => {
    paint();
    return () => cancelAnimationFrame(rafRef.current);
  }, [paint]);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  );
};

// ── STATIC GRAPHS ──────────────────────────────────────────────

export const SineGraph: React.FC = () => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h / 2 + Math.sin((x / w) * Math.PI * 6) * (h * 0.36);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#7DD3FC';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, []);
  return <GraphCanvas draw={draw} />;
};

export const SquareGraph: React.FC = () => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const step = w / 8;
    const hi = h * 0.28;
    const lo = h * 0.72;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const x = i * step;
      const y = i % 2 === 0 ? hi : lo;
      const ny = i % 2 === 0 ? lo : hi;
      ctx.lineTo(x, y);
      ctx.lineTo(x + step, y);
      ctx.lineTo(x + step, ny);
    }
    ctx.strokeStyle = '#7DD3FC';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'miter';
    ctx.stroke();
  }, []);
  return <GraphCanvas draw={draw} />;
};

export const NoiseGraph: React.FC = () => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h / 2 + (Math.random() - 0.5) * h * 0.7;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#F97316';
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);
  return <GraphCanvas draw={draw} />;
};

export const RampGraph: React.FC = () => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(0, h * 0.85);
    ctx.lineTo(w * 0.7, h * 0.15);
    ctx.lineTo(w * 0.7, h * 0.85);
    ctx.strokeStyle = '#7DD3FC';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);
  return <GraphCanvas draw={draw} />;
};

// ── LIVE GRAPHS (tied to real signal state) ───────────────────

interface LiveGraphProps {
  amplitude: number;
  frequency: number;
}

export const LiveAmplitudeGraph: React.FC<LiveGraphProps> = ({ amplitude, frequency }) => {
  const t = useRef(0);
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    t.current += 0.016;
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h / 2 + Math.sin((x / w) * Math.PI * 4 * frequency + t.current * 2) * amplitude * h * 0.4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#7DD3FC';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [amplitude, frequency]);
  return <GraphCanvas draw={draw} height={130} live />;
};
