/**
 * SignalVisualizer.tsx
 * 
 * GPU-accelerated Waveform Visualization component using Canvas.
 * Refined with Prediction Tension (Freeze + Glow Build) and Invisible Guidance (Selection Oscillation).
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { WaveParameters } from '../engines/WaveEngine';

interface SignalVisualizerProps {
  points: { x: number; y: number }[];
  params: WaveParameters;
  secondaryPoints?: { x: number; y: number }[];
  showSum?: boolean;
  pulseTrigger?: number;
  feedback?: 'correct' | 'incorrect' | null;
  engineeringMode?: boolean;
  targetControlId?: string | null; // Invisible guidance
}

export const SignalVisualizer: React.FC<SignalVisualizerProps> = ({ 
  points, 
  params, 
  secondaryPoints, 
  showSum, 
  pulseTrigger, 
  feedback, 
  engineeringMode,
  targetControlId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number>(0);
  
  // High-fidelity feedback states
  const glowBoost = useRef(0);
  const shakeOffset = useRef({ x: 0, y: 0 });
  const bgDrift = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      // Calculate micro background drift (15s loop)
      bgDrift.current = Math.sin(now * 0.0004) * 5;
      
      // Draw Refined Background (Radial Gradient Shift)
      const grad = ctx.createRadialGradient(
        canvas.clientWidth / 2 + bgDrift.current,
        canvas.clientHeight / 2 + bgDrift.current,
        0,
        canvas.clientWidth / 2,
        canvas.clientHeight / 2,
        canvas.clientWidth * 0.8
      );
      grad.addColorStop(0, 'rgba(0, 255, 65, 0.015)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // Handle Shake (Incorrect Feedback)
      if (feedback === 'incorrect') {
        shakeOffset.current = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        };
      } else {
        shakeOffset.current = { x: 0, y: 0 };
      }

      // Handle Glow Boost (Correct Feedback / Prediction Tension)
      if (feedback === 'correct' || feedback === 'incorrect') {
          glowBoost.current = Math.min(glowBoost.current + 10, 50);
      } else {
          glowBoost.current = Math.max(glowBoost.current - 1.5, 0);
      }

      // ── DRAWING LOGIC ──
      ctx.save();
      ctx.translate(shakeOffset.current.x, shakeOffset.current.y);

      // Engineering Grid
      if (engineeringMode) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.setLineDash([2, 8]);
        ctx.beginPath();
        for (let x = 0; x < canvas.clientWidth; x += 50) {
          ctx.moveTo(x, 0); ctx.lineTo(x, canvas.clientHeight);
        }
        for (let y = 0; y < canvas.clientHeight; y += 50) {
          ctx.moveTo(0, y); ctx.lineTo(canvas.clientWidth, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Shadow for Global Bloom
      ctx.shadowBlur = feedback ? 25 + glowBoost.current : 15 + glowBoost.current;
      ctx.shadowColor = feedback === 'incorrect' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 65, 0.5)';

      // 1. Secondary Wave (Fade)
      if (secondaryPoints) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 140, 0, 0.3)';
        ctx.lineWidth = 2;
        renderWave(ctx, secondaryPoints, canvas.clientHeight / 2);
        ctx.stroke();
      }

      // 2. Primary Wave (Neon Signal Color: #00FF41 Cyan/Green)
      ctx.beginPath();
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 3;
      renderWave(ctx, points, canvas.clientHeight / 2);
      ctx.stroke();

      // 3. Sum Wave
      if (showSum && secondaryPoints) {
        const sumPoints = points.map((p, i) => ({
          x: p.x,
          y: p.y + (secondaryPoints[i].y || 0)
        }));
        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        renderWave(ctx, sumPoints, canvas.clientHeight / 2);
        ctx.stroke();
      }

      ctx.restore();
      rafId.current = requestAnimationFrame(draw);
    };

    rafId.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
    };
  }, [points, feedback, engineeringMode, showSum, secondaryPoints]);

  const renderWave = (ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[], midY: number) => {
    if (pts.length < 2) return;
    ctx.moveTo(pts[0].x, midY + pts[0].y * 100);
    for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, midY + pts[i].y * 100);
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full transform-gpu translate-z-0 will-change-transform" 
      style={{ filter: feedback === 'incorrect' ? 'hue-rotate(280deg) brightness(1.2)' : 'none' }}
    />
  );
};
