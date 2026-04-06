/**
 * CinematicTunnel.tsx
 * 
 * Master Anti-Gravity Cinematic Entry for Module 1.
 * Refined with Time Dilation (Arrival Weight) and Waveform Emergence.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine } from '../engines/AudioEngine';

interface CinematicTunnelProps {
  onComplete: () => void;
}

export const CinematicTunnel: React.FC<CinematicTunnelProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number>(0);
  const audioRef = useRef<AudioEngine>(new AudioEngine());
  
  const [phase, setPhase] = useState<'begin' | 'reveal' | 'neural' | 'core' | 'tunnel' | 'transition' | 'emergence' | 'stabilize'>('begin');
  const [hasPlayedArrival, setHasPlayedArrival] = useState(false);
  const particlesRef = useRef<any[]>([]);

  // Initialize particles once
  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 150 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 2000,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? '#00FF41' : '#FF8C00',
    }));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (phase === 'begin') return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-center particles if needed? No, starfield handles it.
    };
    window.addEventListener('resize', resize);
    resize();

    const TIMING = {
        REVEAL: 1500,
        NEURAL: 3000,
        CORE: 4500,
        TUNNEL: 6000,
        TRANSITION: 7500,
        EMERGENCE: 9000,
        STABILIZE: 10500
    };

    const particles = particlesRef.current;

    const tick = (now: number) => {
      let elapsed = now - startTimeRef.current;
      
      // ARRIVAL WEIGHT: Time Dilation (0.85x speed at 21-23s)
      if (elapsed > 21000 && elapsed < 23500) {
          elapsed = 21000 + (elapsed - 21000) * 0.85;
      }

      // Phase management
      if (elapsed < TIMING.REVEAL) setPhase('reveal');
      else if (elapsed < TIMING.NEURAL) setPhase('neural');
      else if (elapsed < TIMING.CORE) setPhase('core');
      else if (elapsed < TIMING.TUNNEL) setPhase('tunnel');
      else if (elapsed < TIMING.TRANSITION) setPhase('transition');
      else if (elapsed < TIMING.EMERGENCE) {
          setPhase('emergence');
          if (!hasPlayedArrival) {
              setHasPlayedArrival(true);
              audioRef.current.playArrival();
          }
      } else if (elapsed <= TIMING.STABILIZE) setPhase('stabilize');
      else {
          onComplete();
          return;
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw Starfield (Anti-Gravity)
      particles.forEach(p => {
          const speed = (phase === 'reveal') ? 0.3 : (phase === 'transition' ? 6 : 1);
          p.z -= speed;
          if (p.z < 1) p.z = 2000;

          const scale = 500 / p.z;
          const px = centerX + (p.x - centerX) * scale;
          const py = centerY + (p.y - centerY) * scale;
          
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, scale * 0.5) * 0.2;
          ctx.fill();
      });

      // Wave Emergence (Cyan Glow expansion at arrival)
      if (elapsed > TIMING.TRANSITION) {
          const waveOpacity = Math.min(1, (elapsed - TIMING.TRANSITION) / 2000);
          const arrivalExp = (elapsed > 21000 && elapsed < 23000) ? 1.05 : 1.0;
          
          ctx.globalAlpha = waveOpacity;
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 2 * arrivalExp;
          ctx.beginPath();
          for (let x = centerX - 180; x < centerX + 180; x++) {
              const f = (x - centerX) * 0.01;
              const y = centerY + Math.sin(f * 2 + elapsed * 0.01) * (40 * arrivalExp);
              if (x === centerX - 180) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [hasPlayedArrival, onComplete, phase]);

  const handleBegin = () => {
    setPhase('reveal');
    startTimeRef.current = performance.now();
    audioRef.current.playTick(); // Initialize AudioContext safely
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-[#050505] overflow-hidden flex flex-col items-center justify-center cursor-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      <AnimatePresence>
        {phase === 'begin' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10 cursor-pointer"
             onClick={handleBegin}
           >
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="flex flex-col items-center gap-6"
             >
                <div className="w-16 h-16 rounded-full border border-[#00FF41]/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
                </div>
                <span className="text-[#00FF41] font-mono text-[10px] tracking-[1em] uppercase">Click to Initialize_System</span>
             </motion.div>
           </motion.div>
        )}

        {phase === 'stabilize' && (
          <motion.div 
            key="hook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
              <div className="flex flex-col items-center gap-12 mt-40">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-4"
                  >
                      <h2 className="text-white text-5xl font-black italic tracking-tighter uppercase">This is a <span className="text-[#00FFFF]">signal.</span></h2>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1.2 }}
                    className="flex flex-col items-center gap-4"
                  >
                      <p className="text-white/40 font-mono text-[10px] tracking-[0.8em] uppercase italic">And you’re about to control it.</p>
                  </motion.div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
};
