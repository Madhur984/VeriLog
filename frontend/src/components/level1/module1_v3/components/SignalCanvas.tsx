import React, { useEffect, useRef } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';

interface Props {
  className?: string;
}

export const SignalCanvas: React.FC<Props> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Params to interpolate for smoothness (0.18 lerp)
  const paramsRef = useRef({
    amplitude: 0.3,
    frequency: 1.0,
    noise: 0.1,
    phase: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const { amplitude, frequency, noise, phase, signalMode } = useSignalStore.getState();
      const p = paramsRef.current;
      const lerp = 0.22; // HIGHEST RESPONSIVE (Upgraded from 0.18)

      // Premium Lerp
      p.amplitude += (amplitude - p.amplitude) * lerp;
      p.frequency += (frequency - p.frequency) * lerp;
      p.noise += (noise - p.noise) * lerp;
      p.phase += (phase - p.phase) * lerp;

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerY = h / 2;

      ctx.clearRect(0, 0, w, h);
      
      // OPTIONAL: Multi-pass for glow/premium feel
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = '#FFFFFF';

      const time = performance.now() * 0.001;
      const steps = 400;

      for (let i = 0; i <= steps; i++) {
        const xNorm = i / steps;
        const x = xNorm * w;
        
        const t = time + canvasState.timeOffset;
        let yNorm = 0;
        const p_val = xNorm * p.frequency * 8 + t * 4 + p.phase;

        // Waveform Logic
        if (signalMode === 'analog') {
          yNorm = Math.sin(p_val);
        } else if (signalMode === 'digital') {
          yNorm = Math.sign(Math.sin(p_val));
        } else if (signalMode === 'periodic') {
          yNorm = Math.sin(p_val) * 0.8 + Math.sin(p_val * 2) * 0.2;
        } else if (signalMode === 'aperiodic') {
          yNorm = Math.sin(p_val) * Math.cos(p_val * 0.3);
        } else if (signalMode === 'deterministic') {
          yNorm = Math.sin(p_val);
        } else if (signalMode === 'random') {
          yNorm = Math.sin(p_val + (Math.random() - 0.5) * 0.3); // Add chaotic drift
        } else if (signalMode === 'step') {
          yNorm = xNorm > 0.5 ? 1 : 0;
        } else if (signalMode === 'impulse') {
          yNorm = Math.exp(-Math.pow((xNorm - 0.5) * 50, 2)) * 10;
        } else if (signalMode === 'ramp') {
          yNorm = xNorm;
        } else if (signalMode === 'sinc') {
          const sx = (xNorm - 0.5) * 20;
          yNorm = sx === 0 ? 1 : Math.sin(sx) / sx;
        } else if (signalMode === 'triangular') {
          yNorm = (Math.abs((p_val % (2 * Math.PI)) - Math.PI) / Math.PI) * 2 - 1;
        } else if (signalMode === 'rectangular') {
          yNorm = Math.sign(Math.sin(p_val));
        }


        // Noise
        const n = (Math.random() - 0.5) * p.noise * 0.4;
        yNorm += n;

        // Amplitude base
        let finalY = yNorm * p.amplitude * (h * 0.4);

        // ENHANCED MAGNETIC BENDING (Highest Responsive)
        if (canvasState.magneticStrength > 0 && canvasState.cursorNormX !== -1) {
          const dist = Math.abs(xNorm - canvasState.cursorNormX);
          // High-precision Gaussian influence with sharper falloff for "snappy" feel
          const influence = Math.pow(Math.exp(-Math.pow(dist * 7.5, 2.0)), 1.2);
          
          // Hybrid Pull-Push: Bend toward and amplify at cursor
          const pull = influence * canvasState.magneticStrength * 5.0;
          finalY *= (1 + pull);
          
          // Subtle vertical compression near cursor to emphasize "pull"
          finalY += (influence * canvasState.magneticStrength * 20); 
        }

        if (i === 0) ctx.moveTo(x, centerY + finalY);
        else ctx.lineTo(x, centerY + finalY);
      }

      ctx.stroke();

      // Secondary Signal (Interference S09/S11) - ENHANCED REACTIVE
      if (canvasState.secondaryEnabled) {
        ctx.beginPath();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(0, 229, 255, ${canvasState.secondaryOpacity})`;
        
        // Interactive secondary phase shift based on cursor (Highest Responsive)
        const mousePhaseShift = canvasState.cursorNormX !== -1 
          ? (canvasState.cursorNormX - 0.5) * 4.0 
          : 0;

        for (let i = 0; i <= steps; i++) {
          const xNorm = i / steps;
          const px = xNorm * p.frequency * 8 * canvasState.secondaryFrequencyMult + 
                    time * 4 + canvasState.secondaryPhase + mousePhaseShift;
          
          let ySec = Math.sin(px) * p.amplitude * canvasState.secondaryAmplitudeMult * (h * 0.3);

          // INTERACTIVE SECONDARY BENDING
          if (canvasState.secondaryMagneticStrength > 0 && canvasState.cursorNormX !== -1) {
            const dist = Math.abs(xNorm - (1 - canvasState.cursorNormX)); // Opposing pull for clarity
            const influence = Math.exp(-Math.pow(dist * 8.0, 2.0));
            ySec *= (1 + influence * canvasState.secondaryMagneticStrength * 6);
          }

          if (i === 0) ctx.moveTo(xNorm * w, centerY + ySec);
          else ctx.lineTo(xNorm * w, centerY + ySec);
        }
        ctx.stroke();
      }


      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: canvasState.opacity, zIndex: 10 }}
    />
  );
};
