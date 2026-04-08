import React, { useEffect, useRef } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { useTaskStore } from '../store/taskStore';

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
    let snapScale = 1;

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

      if (canvasState.lastX !== undefined) {
        const deltaX = e.clientX - canvasState.lastX;
        canvasState.velocity += deltaX * 0.0025;
      }
      canvasState.lastX = e.clientX;

      canvasState.cursorNormX = nextX;
      canvasState.cursorX = e.clientX;
      canvasState.cursorY = e.clientY;

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
      // 🚀 1. ABSOLUTE RESET (CRITICAL)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      const w = canvas.width;
      const h = canvas.height;

      const state = useSignalStore.getState();
      const currentPhase = state.phase;
      
      // ⚡ CONTINUOUS EVALUATION
      useTaskStore.getState().evaluate();
      
      // Update interaction clock
      if (state.hasMoved) state.updateInteraction(0.016);

      const LERP = 0.18;
      canvasState.currentA += (state.amplitude - canvasState.currentA) * LERP;
      canvasState.currentF += (state.frequency - canvasState.currentF) * LERP;
      canvasState.currentN += (state.noise - canvasState.currentN) * LERP;

      // ─── S03 TIME DRAG (ELASTIC PHYSICS) ───
      canvasState.velocity *= 0.92;
      const vClamp = Math.max(-0.08, Math.min(0.08, canvasState.velocity));
      t += (0.016 + vClamp);

      // ─── SNAP FEEDBACK (COMPRESSION) ───
      const isSnapped = state.stability > 0.85;
      const targetScale = isSnapped ? 0.92 : 1.0;
      snapScale += (targetScale - snapScale) * 0.15;

      // ─── GHOST TRAIL (PERCEPTION-BASED) ───
      if (currentPhase === 'ACTIVE') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)"; // SPEC: 0.12 for physical motion memory
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentPhase === 'ENTRY') {
        renderSignalEmergence(ctx, w, h, t, state);
      } else {
        ctx.translate(0, h/2);
        ctx.scale(1, snapScale);
        ctx.translate(0, -h/2);
        renderSignal(ctx, w, h, t, state);
      }

      raf = requestAnimationFrame(render);
    };

    const renderSignalEmergence = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, state: any) => {
      ctx.setTransform(1,0,0,1,0,0);
      
      // PHASE 1 & 2: VOID -> DISTURBANCE
      if (state.introPhase <= 2) {
        const alpha = state.introPhase === 2 ? 1.0 : 0.4; // Boosted alpha
        ctx.strokeStyle = "#E6F9FF";
        ctx.lineWidth = 2.5; // Thicker for visibility
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        
        for (let i = 0; i <= 100; i++) {
          const x = (i / 100) * w;
          let py = Math.sin(x * 0.01 + time) * (state.introPhase === 2 ? 4 : 1.2); // More pronounced wave
          
          if (state.introPhase === 2 && canvasState.cursorNormX !== -1) {
            const dx = canvasState.cursorX - x;
            const dy = canvasState.cursorY - (h / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.exp(-dist * 0.008);
            py += dy * influence * 0.15; // Increased reaction
          }

          if (i === 0) ctx.moveTo(x, h/2 + py);
          else ctx.lineTo(x, h/2 + py);
        }
        ctx.stroke();
        return;
      }

      // PHASE 3: FORMATION (TUNNEL TRANSFORMATION)
      const zoom = 1 + state.tunnelProgress * 0.6;
      ctx.setTransform(zoom, 0, 0, zoom, (w/2) * (1 - zoom), (h/2) * (1 - zoom));

      const layers = 6;
      for (let l = 0; l < layers; l++) {
        const depth = l / layers;
        const scale = 1 - depth * 0.4;
        const alpha = 0.15 * (1 - depth) * (1 - state.collapseProgress);
        const offsetY = depth * 20;

        ctx.beginPath();
        for (let x = 0; x < w; x += 6) {
          const nx = (x/w) * 4;
          const wave = Math.sin(nx * 1.5 + time + depth) * 40 * scale;
          const y = h/2 + wave + offsetY;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "#E6F9FF";
        ctx.lineWidth = 2 * scale;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      }

      if (state.collapseProgress >= 1) {
        state.setPhase('ACTIVE');
        state.setIntroPhase(0);
      }
    };

    const renderSignal = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, state: any) => {
      const A = canvasState.currentA;
      const F = canvasState.currentF;
      const N = canvasState.currentN;
      
      const isSnapped = state.stability > 0.85;
      const baseLineWidth = isSnapped ? 3.0 : 2.0;

      ctx.beginPath();
      // 🚀 ABSOLUTE VISIBILITY
      ctx.strokeStyle = isSnapped ? "#FFFFFF" : "#E6F9FF";
      ctx.lineWidth = baseLineWidth + 0.5; // Slight boost for ribbon feel
      ctx.globalAlpha = 1.0; 

      if (isSnapped) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 229, 255, 0.5)";
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      const steps = 180;
      for (let i = 0; i <= steps; i++) {
        const xNorm = i / steps;
        const x = xNorm * w;
        const nx = xNorm * F * 4 + time * 2;
        
        let wave = Math.sin(nx + state.phase_offset);
        if (state.signalMode === 'digital') wave = wave > 0 ? 1 : -1;
        
        let py = wave * A * (h * 0.25);
        const noiseVal = (Math.random() - 0.5) * N * 50; // Corrected bias
        py += noiseVal;

        // 🧬 SECONDARY SIGNAL (S09 - Interaction)
        if (canvasState.secondaryEnabled) {
          const snx = xNorm * F * 4 + time * 2;
          const swave = Math.sin(snx + canvasState.secondaryPhase);
          const spy = swave * A * (h * 0.25);
          
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = "#E6F9FF";
          ctx.globalAlpha = canvasState.secondaryOpacity || 0.3;
          ctx.lineWidth = 1.0;
          ctx.moveTo(x, h/2 + spy);
          ctx.lineTo(x + 2, h/2 + spy);
          ctx.stroke();
          ctx.restore();

          // Live Phase Alignment check
          const diff = Math.abs((state.phase_offset % (Math.PI * 2)) - (canvasState.secondaryPhase % (Math.PI * 2)));
          const isAligned = diff < 0.15 || diff > (Math.PI * 2 - 0.15);
          if (isAligned !== state.phaseAligned) {
            useSignalStore.setState({ phaseAligned: isAligned });
          }
        }

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

