import React, { useRef, useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { computeY, getNoiseValue, magneticPull, WaveParams } from '../engine/waveEngine';
import { canvasState } from '../engine/canvasState';

const RESOLUTION = 400;
const isMobile = window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 30 : 100;

interface Props {
  className?: string;
}

export const SignalCanvas: React.FC<Props> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync store params to a ref — zero React overhead in RAF loop
  const paramsRef = useRef<WaveParams>({
    amplitude: 0.5,
    frequency: 1,
    phase: 0,
    noise: 0,
    waveType: 'sine',
  });

  useEffect(() => {
    return useSignalStore.subscribe((s) => {
      paramsRef.current = {
        amplitude: s.amplitude,
        frequency: s.frequency,
        phase: s.phase,
        noise: s.noise,
        waveType: s.waveType,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let raf: number;
    let t = 0;
    let frame = 0;
    const trail: Float32Array[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const step = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(step);
        return;
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const p = paramsRef.current;
      const cs = canvasState;

      if (!cs.frozen) t += 0.016 * p.frequency;
      const tEffective = t + cs.timeOffset;

      ctx.clearRect(0, 0, w, h);

      // Compute current wave
      const wave = new Float32Array(RESOLUTION + 1);
      for (let i = 0; i <= RESOLUTION; i++) {
        const normX = i / RESOLUTION;
        let y = computeY(normX, tEffective, { ...p });

        if (cs.cursorNormX >= 0 && cs.magneticStrength > 0) {
          y += magneticPull(normX, cs.cursorNormX, cs.magneticStrength);
        }

        if (p.noise > 0) {
          y += getNoiseValue(frame, i) * p.noise * 0.5;
        }

        wave[i] = y;
      }
      frame++;

      // Trail (S02+)
      if (cs.showTrail && trail.length > 0) {
        for (let ti = 0; ti < trail.length; ti++) {
          const age = (ti + 1) / (trail.length + 1);
          ctx.globalAlpha = cs.opacity * age * 0.12;
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = cs.lineWidth * 0.6;
          ctx.beginPath();
          const buf = trail[ti];
          for (let i = 0; i <= RESOLUTION; i++) {
            const x = (i / RESOLUTION) * w;
            const y = h / 2 - buf[i] * (h * 0.32);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // Primary wave
      ctx.globalAlpha = cs.opacity;
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = cs.lineWidth;
      ctx.shadowBlur = cs.lineWidth * 4 * (canvasState.opacity);
      ctx.shadowColor = 'rgba(0,229,255,0.15)';
      ctx.beginPath();
      for (let i = 0; i <= RESOLUTION; i++) {
        const x = (i / RESOLUTION) * w;
        const y = h / 2 - wave[i] * (h * 0.32);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary signal (S09)
      if (cs.secondaryEnabled) {
        ctx.globalAlpha = cs.secondaryOpacity;
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = cs.lineWidth * 0.7;
        ctx.beginPath();
        for (let i = 0; i <= RESOLUTION; i++) {
          const normX = i / RESOLUTION;
          const y2 = computeY(normX, tEffective, {
            ...p,
            phase: p.phase + cs.secondaryPhase,
          });
          const x = (i / RESOLUTION) * w;
          const y = h / 2 - y2 * (h * 0.32);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Update trail buffer (keep last 3)
      if (cs.showTrail) {
        trail.push(new Float32Array(wave));
        if (trail.length > 3) trail.shift();
      } else {
        trail.length = 0;
      }

      // Particles for S07 (noise screen)
      if (p.noise > 0.1) {
        const count = Math.floor(PARTICLE_COUNT * p.noise);
        ctx.globalAlpha = p.noise * 0.3;
        ctx.fillStyle = '#00E5FF';
        for (let i = 0; i < count; i++) {
          const px = Math.random() * w;
          const py = Math.random() * h;
          ctx.fillRect(px, py, 1, 1);
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []); // empty deps — never restarts, reads from refs

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', willChange: 'transform' }}
    />
  );
};
