import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';

// Inline animated wave — seamless continuation from Module 1
const ContinuityWave: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let t = 0;
    const animate = () => {
      if (!pathRef.current) return;
      const w = 800;
      const cy = 50;
      const pts = Array.from({ length: 200 }, (_, i) => {
        const x = (i / 200) * w;
        const y = cy + 22 * Math.sin(0.025 * x + t);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ');
      pathRef.current.setAttribute('d', pts);
      t += 0.012;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg viewBox="0 0 800 100" preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block' }}>
      {/* Ghost bloom */}
      <path ref={pathRef} fill="none" stroke={T.signal} strokeWidth="6" opacity="0.08"
        style={{ filter: `blur(6px)` }} />
      {/* Main line */}
      <path ref={pathRef} fill="none" stroke={T.signal} strokeWidth="2.5"
        style={{ filter: `drop-shadow(0 0 8px ${T.signal}50)` }} />
    </svg>
  );
};

export const M2_S00_Entry: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  useEffect(() => { triggerHaptic('light'); }, [triggerHaptic]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, padding: '0 24px' }}>

      {/* Wave continuity */}
      <div style={{ width: '100%', maxWidth: 700 }}>
        <ContinuityWave />
      </div>

      {/* Text sequence */}
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}80`, marginBottom: 20 }}
        >
          Module 02 · Signal Domains
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ fontFamily: T.mono, fontSize: 42, fontWeight: 900, color: T.text, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 24 }}
        >
          You've seen a signal.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: T.mono, fontSize: 14, color: T.muted, letterSpacing: '0.05em' }}
        >
          But signals don't all behave the same.
        </motion.p>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 1, height: 32, background: `${T.signal}50` }}
        />
        <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
          Scroll to begin
        </span>
      </motion.div>
    </div>
  );
};
