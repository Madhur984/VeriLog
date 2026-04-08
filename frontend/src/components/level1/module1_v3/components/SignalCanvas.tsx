import React, { useEffect, useRef } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';

interface SignalCanvasProps {
  className?: string;
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = (e.clientX - rect.left) / rect.width;
      const nextY = e.clientY;

      // ─── TIME DRAG CALCulation (S03) ───
      if (canvasState.lastX !== undefined) {
        const deltaX = e.clientX - canvasState.lastX;
        canvasState.velocity += deltaX * 0.0025;
      }
      canvasState.lastX = e.clientX;

      canvasState.cursorNormX = nextX;
      canvasState.cursorX = e.clientX;
      canvasState.cursorY = e.clientY;

      // ─── 8. CONTROL SYSTEM (LOCKED) ───
      const state = useSignalStore.getState();
      if (state.phase === 'ACTIVE') {
        state.setFrequency(nextX * 3);
        state.setAmplitude(1 - (nextY / window.innerHeight));
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onWheel = (e: WheelEvent) => {
      const state = useSignalStore.getState();
      if (state.phase === 'ACTIVE') {
        state.setNoise(state.noise + e.deltaY * 0.001);
      }
    };
    window.addEventListener('wheel', onWheel);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // ─── STATE SYNC ───
      const state = useSignalStore.getState();
      const currentPhase = state.phase;
      
      const LERP = 0.18;
      canvasState.currentA += (state.amplitude - canvasState.currentA) * LERP;
      canvasState.currentF += (state.frequency - canvasState.currentF) * LERP;
      canvasState.currentN += (state.noise - canvasState.currentN) * LERP;

      // ─── S03 TIME DRAG ───
      canvasState.velocity *= 0.92;
      const tDelta = 0.016 + Math.max(-0.08, Math.min(0.08, canvasState.velocity));
      t += tDelta;

      // ─── CLEAR / TRAIL (S02 — INERTIA) ───
      if (currentPhase === 'ACTIVE') {
        // Always show slight trail for inertia feel in ACTIVE mode
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        ctx.clearRect(0, 0, w, h);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentPhase === 'ENTRY') {
        renderTunnel(ctx, w, h, t, state);
      } else {
        renderSignal(ctx, w, h, t, state);
      }

      raf = requestAnimationFrame(render);
    };

    const renderTunnel = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, state: any) => {
      // ⚡ 4. ADD ZOOM ILLUSION
      const zoom = 1 + state.tunnelProgress * 0.6;
      ctx.setTransform(zoom, 0, 0, zoom, (w/2) * (1 - zoom), (h/2) * (1 - zoom));

      const layers = 6;
      const A = canvasState.currentA;
      const F = canvasState.currentF;

      for (let l = 0; l < layers; l++) {
        const depth = l / layers;
        const timeOffset = time + depth * 0.6;
        const scale = 1 - depth * 0.4;
        const alpha = 0.12 * (1 - depth) * (1 - state.collapseProgress);
        const offsetY = depth * 20;

        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
          const nx = (x / w) * 4;
          const wave = Math.sin(nx * F * 3 + timeOffset) * A * 80 * scale;
          const y = h / 2 + wave + offsetY;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "#E6F9FF";
        ctx.lineWidth = 2 * scale;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      }
      
      if (state.collapseProgress >= 1 && state.phase === 'ENTRY') {
        state.setPhase('ACTIVE');
        state.setTunnelProgress(0);
        state.setIntroPhase(0);
        state.setAmplitude(0.55);
        state.setFrequency(1.2);
        state.setNoise(0.0);
      }
    };

    const renderSignal = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, state: any) => {
      const A = canvasState.currentA;
      const F = canvasState.currentF;
      const N = canvasState.currentN;
      
      const isSnapped = state.stability > 0.85;
      const baseLineWidth = isSnapped ? 2.5 : 2;

      ctx.beginPath();
      ctx.strokeStyle = isSnapped ? "#FFFFFF" : "#E6F9FF";
      ctx.lineWidth = baseLineWidth;
      ctx.globalAlpha = 1.0;

      const steps = 180;
      for (let i = 0; i <= steps; i++) {
        const xNorm = i / steps;
        const x = xNorm * w;
        const nx = xNorm * F * 4 + time * 2;
        
        // wave type logic
        let wave = Math.sin(nx + state.phase_offset);
        if (state.signalMode === 'digital') wave = wave > 0 ? 1 : -1;
        
        let py = wave * A * (h * 0.2);
        const noiseVal = (Math.random() - 0.5) * N * 40;
        py += noiseVal;

        // 🧲 CURSOR MAGNETISM
        if (canvasState.cursorNormX !== -1) {
           const dx = canvasState.cursorX - x;
           const dy = canvasState.cursorY - (h / 2 + py);
           const dist = Math.sqrt(dx * dx + dy * dy);
           const influence = Math.exp(-dist * 0.008);
           
           if (state.scene >= 1) {
             py += dy * influence * 0.12; 
           }
        }

        const finalY = h / 2 + py;
        if (i === 0) ctx.moveTo(x, finalY);
        else ctx.lineTo(x, finalY);
      }
      ctx.stroke();
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ opacity: 1, zIndex: 10 }}
    />
  );
};

