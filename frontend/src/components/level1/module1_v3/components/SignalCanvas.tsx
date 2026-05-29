import React, { useEffect, useRef } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { useTaskStore } from '../store/taskStore';

interface SignalCanvasProps { className?: string; }

// ─── SCENE COLOR EVOLUTION ────────────────────────────────────────────────────
function getSignalColor(scene: number, entryFrames: number): string {
  if (entryFrames < 12)  return '#BAE6FD'; // soft entry handoff
  if (scene === 0)       return '#64748B'; // S00 - dead/desaturated
  if (scene === 12)      return '#BAE6FD'; // S12 - final, brightest
  return '#7DD3FC';                         // S01-S11 - signal-core
}

export const SignalCanvas: React.FC<SignalCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;
    let snapScale   = 1;
    let entryFrames = 0;

    // ── DPI-AWARE RESIZE ─────────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      if (canvasState.lastX !== undefined)
        canvasState.velocity += (e.clientX - canvasState.lastX) * 0.0025;
      canvasState.lastX       = e.clientX;
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      canvasState.cursorX     = e.clientX;
      canvasState.cursorY     = e.clientY;
      const s = useSignalStore.getState();
      if (s.phase === 'ACTIVE') {
        s.setFrequency(canvasState.cursorNormX * 3);
        s.setAmplitude(1 - e.clientY / window.innerHeight);
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onWheel = (e: WheelEvent) => {
      const s = useSignalStore.getState();
      if (s.phase === 'ACTIVE') s.setNoise(s.noise + e.deltaY * 0.001);
    };
    window.addEventListener('wheel', onWheel);

    // ── RENDER LOOP ───────────────────────────────────────────────────────────
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = useSignalStore.getState();

      useTaskStore.getState().evaluate();
      if (s.hasMoved) s.updateInteraction(0.016);

      const L = 0.18;
      canvasState.currentA += (s.amplitude - canvasState.currentA) * L;
      canvasState.currentF += (s.frequency - canvasState.currentF) * L;
      canvasState.currentN += (s.noise     - canvasState.currentN) * L;

      canvasState.velocity *= 0.96;
      t += 0.016 + Math.max(-0.08, Math.min(0.08, canvasState.velocity));

      snapScale += ((s.stability > 0.85 ? 0.93 : 1.0) - snapScale) * 0.15;

      // Pure black clear - zero color accumulation
      if (s.phase === 'ACTIVE') {
        ctx.fillStyle = 'rgba(0,0,0,0.13)';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      if (s.phase === 'ENTRY') {
        entryFrames = 0;
        renderEntry(ctx, w, h, t, s);
      } else {
        entryFrames = Math.min(entryFrames + 1, 300);
        ctx.save();
        ctx.translate(0, h / 2);
        ctx.scale(1, snapScale);
        ctx.translate(0, -h / 2);
        renderActiveSignal(ctx, w, h, t, s, entryFrames);
        ctx.restore();
      }

      raf = requestAnimationFrame(render);
    };

    // ── ENTRY PHASE ───────────────────────────────────────────────────────────
    const renderEntry = (
      ctx: CanvasRenderingContext2D, w: number, h: number,
      time: number, state: any
    ) => {
      if (state.introPhase <= 2) {
        ctx.beginPath();
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth   = 1.8;
        ctx.globalAlpha = state.introPhase === 2 ? 1.0 : 0.35;
        ctx.shadowBlur  = 0;
        for (let i = 0; i <= 120; i++) {
          const x  = (i / 120) * w;
          let   py = Math.sin(x * 0.011 + time) * (state.introPhase === 2 ? 5 : 1.5);
          if (state.introPhase === 2 && canvasState.cursorNormX !== -1) {
            const inf = Math.exp(-Math.abs(canvasState.cursorX - x) * 0.005);
            py += (canvasState.cursorY - h / 2) * inf * 0.12;
          }
          i === 0 ? ctx.moveTo(x, h / 2 + py) : ctx.lineTo(x, h / 2 + py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        return;
      }

      // Tunnel formation
      const zoom = 1 + state.tunnelProgress * 0.6;
      ctx.setTransform(zoom, 0, 0, zoom, (w / 2) * (1 - zoom), (h / 2) * (1 - zoom));
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      for (let l = 0; l < 6; l++) {
        const depth = l / 6;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = h / 2 + Math.sin((x / w) * 4 + time + depth) * 40 * (1 - depth * 0.4) + depth * 20;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#7DD3FC';
        ctx.lineWidth   = 2 * (1 - depth * 0.4);
        ctx.globalAlpha = 0.1 * (1 - depth) * (1 - state.collapseProgress);
        ctx.shadowBlur  = 0;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (state.collapseProgress >= 1) { state.setPhase('ACTIVE'); state.setIntroPhase(0); }
    };

    // ── 3-LAYER ACTIVE SIGNAL ─────────────────────────────────────────────────
    const renderActiveSignal = (
      ctx: CanvasRenderingContext2D, w: number, h: number,
      time: number, state: any, frames: number
    ) => {
      const A    = Math.max(canvasState.currentA, 0.08);
      const F    = canvasState.currentF;
      const N    = canvasState.currentN;
      const cy   = h / 2;
      const col  = getSignalColor(state.scene, frames);
      const blur = frames < 12 ? 10 : 5;

      // ── LAYER 1: SOFT FLOW RIBBON (depth / glow base) ──
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const xn = i / 120;
        const x  = xn * w;
        let   py = Math.sin(xn * F * 4 + time * 1.8 + state.phase_offset) * A * h * 0.28;
        py += (Math.random() - 0.5) * N * 35;
        if (canvasState.cursorNormX !== -1 && state.scene >= 1) {
          const dist = Math.sqrt((canvasState.cursorX - x) ** 2 + (canvasState.cursorY - (cy + py)) ** 2);
          py += (canvasState.cursorY - (cy + py)) * Math.exp(-dist * 0.008) * 0.12;
        }
        i === 0 ? ctx.moveTo(x, cy + py) : ctx.lineTo(x, cy + py);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth   = 6;
      ctx.globalAlpha = 0.06;
      ctx.shadowBlur  = 0;
      ctx.stroke();

      // ── LAYER 2: MAIN RIBBON (signal) ──
      ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const xn   = i / 240;
        const x    = xn * w;
        let   wave = Math.sin(xn * F * 4 + time * 2 + state.phase_offset);
        if (state.signalMode === 'digital') wave = wave > 0 ? 1 : -1;

        let py = wave * A * h * 0.25;
        py += (Math.random() - 0.5) * N * 55;

        if (canvasState.cursorNormX !== -1 && state.scene >= 1) {
          const dist = Math.sqrt((canvasState.cursorX - x) ** 2 + (canvasState.cursorY - (cy + py)) ** 2);
          py += (canvasState.cursorY - (cy + py)) * Math.exp(-dist * 0.008) * 0.12;
        }

        // Secondary signal (S09 interference)
        if (canvasState.secondaryEnabled) {
          const spy = Math.sin(xn * F * 4 + time * 2 + canvasState.secondaryPhase) * A * h * 0.25;
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = '#7DD3FC';
          ctx.globalAlpha = (canvasState.secondaryOpacity || 0.3) * 0.8;
          ctx.lineWidth   = 1.0;
          ctx.shadowBlur  = 0;
          ctx.moveTo(x, cy + spy);
          ctx.lineTo(x + 2, cy + spy);
          ctx.stroke();
          ctx.restore();

          const diff    = Math.abs((state.phase_offset % (Math.PI * 2)) - (canvasState.secondaryPhase % (Math.PI * 2)));
          const aligned = diff < 0.15 || diff > Math.PI * 2 - 0.15;
          if (aligned !== state.phaseAligned) useSignalStore.setState({ phaseAligned: aligned });
        }

        i === 0 ? ctx.moveTo(x, cy + py) : ctx.lineTo(x, cy + py);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth   = 2.2;
      ctx.globalAlpha = 0.95;
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur  = blur;
      ctx.stroke();

      // ── LAYER 3: SIGNAL PARTICLES (dots along the ribbon) ──
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
      const particleCount = 5;
      for (let p = 0; p < particleCount; p++) {
        const xnorm = ((p / particleCount) + (time * 0.06) % 1);
        const xp    = xnorm * w;
        const wave  = Math.sin(xnorm * F * 4 + time * 2 + state.phase_offset);
        const yp    = cy + wave * A * h * 0.25;

        ctx.beginPath();
        ctx.arc(xp, yp, 1.5, 0, Math.PI * 2);
        ctx.fillStyle   = col;
        ctx.globalAlpha = 0.5 + Math.sin(time * 3 + p * 1.2) * 0.25;
        ctx.fill();
      }

      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('wheel',     onWheel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'block', pointerEvents: 'none' }}
    />
  );
};
