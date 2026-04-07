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
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      canvasState.cursorNormX = (e.clientX - rect.left) / rect.width;
      canvasState.cursorX = e.clientX;
      canvasState.cursorY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // ─── LERP / RESISTANCE (PREMIUM FEEL) ───
      const targetA = useSignalStore.getState().amplitude;
      const targetF = useSignalStore.getState().frequency;
      const targetN = useSignalStore.getState().noise;
      const mode = useSignalStore.getState().signalMode;
      const scene = useSignalStore.getState().scene;

      const resistance = 0.85;
      canvasState.currentA += (targetA - canvasState.currentA) * (1 - resistance) * 0.18;
      canvasState.currentF += (targetF - canvasState.currentF) * (1 - resistance) * 0.18;

      time += 0.016;
      
      // ─── INERTIA TRAIL (CLEAN UP) ───
      // S02 / High noise feel: use persistent clearing
      if (scene === 2 || canvasState.showTrail) {
        ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ─── SIGNAL SNAP FEEDBACK ───
      const isSnapped = targetA > 0.7 && targetN < 0.1;
      const baseLineWidth = isSnapped ? 2.5 : 1.8;

      // ─── TUNNEL LAYERING (6 LAYERS) ───
      const layers = 6;
      for (let l = layers - 1; l >= 0; l--) {
        const isMain = l === 0;
        const depth = l / layers;

        // Shrink, fade, shift
        const scale = 1 - depth * 0.4;
        const alpha = isMain ? canvasState.opacity : 0.15 * (1 - depth);
        const offsetY = depth * 20;
        
        if (alpha <= 0) continue;

        ctx.beginPath();
        ctx.strokeStyle = isMain ? "#FFFFFF" : "#E6F9FF";
        ctx.lineWidth = isMain ? baseLineWidth : 1.5 * scale;
        ctx.globalAlpha = alpha;

        const steps = 180;
        for (let i = 0; i <= steps; i++) {
          const xNorm = i / steps;
          const x = xNorm * w;
          
          // Phase/Frequency calculation
          const nx = xNorm * canvasState.currentF * 4 + time * 2;
          
          let wave = 0;
          if (mode === 'analog') wave = Math.sin(nx);
          else if (mode === 'rectangular') wave = Math.sin(nx) > 0 ? 1 : -1;
          else if (mode === 'triangular') wave = (2 / Math.PI) * Math.asin(Math.sin(nx));
          else wave = Math.sin(nx); // Default to sine

          // Amplitude + depth scale
          let py = wave * canvasState.currentA * (h * 0.2) * scale;
          
          // Noise
          const noiseVal = (Math.random() - 0.5) * targetN * 40 * (1 - depth);
          py += noiseVal;

          // Target point before magnetism
          const targetX = x;
          const targetY = centerY + py + offsetY;

          // 🧲 CURSOR MAGNETISM (TIGHT FALLOFF)
          if (canvasState.cursorNormX !== -1) {
             const dx = canvasState.cursorX - targetX;
             const dy = canvasState.cursorY - targetY;
             const dist = Math.sqrt(dx * dx + dy * dy);
             
             // exponential falloff
             const influence = Math.exp(-dist * 0.01) * (isMain ? 1 : scale);
             
             // Apply pull if in scene 1+ or active magnetism
             if (canvasState.magneticStrength > 0 || scene >= 1) {
               py += dy * influence * 0.35; // BOOSTED SENSITIVITY from 0.15
             }
          }

          const finalY = centerY + py + offsetY;
          if (i === 0) ctx.moveTo(x, finalY);
          else ctx.lineTo(x, finalY);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0; // Reset
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
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

