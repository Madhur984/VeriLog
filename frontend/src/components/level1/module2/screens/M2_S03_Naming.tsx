import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { M2ScreenProps, T } from '../types';

const LABELS: { key: string; x: string; y: string; text: string; sub: string; color: string }[] = [
  { key: 'analog', x: '20%', y: '38%', text: 'Analog', sub: '∞ values · continuous in time', color: T.signal },
  { key: 'digital', x: '60%', y: '62%', text: 'Digital', sub: '2^n values · discrete in time', color: T.interact },
];

export const M2_S03_Naming: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [revealed, setRevealed] = useState<string[]>([]);

  useEffect(() => {
    const timers = LABELS.map((l, i) =>
      setTimeout(() => {
        setRevealed(r => [...r, l.key]);
        triggerHaptic('light');
      }, 800 + i * 900)
    );
    return () => timers.forEach(clearTimeout);
  }, [triggerHaptic]);

  return (
    <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act I · Language
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.text, letterSpacing: '-0.02em' }}>
          Now name them.
        </h2>
      </div>

      {/* Label reveal arena */}
      <div style={{ position: 'relative', width: '100%', height: 280, border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden', background: T.card }}>

        {/* Background signal deco */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }} viewBox="0 0 600 280" preserveAspectRatio="none">
          <path d="M0,140 C50,80 100,200 150,140 S250,80 300,140 S400,200 450,140 S550,80 600,140" fill="none" stroke={T.signal} strokeWidth="3"/>
          <path d="M0,170 L75,170 L75,110 L150,110 L150,170 L225,170 L225,110 L300,110 L300,170 L375,170 L375,110 L450,110 L450,170 L600,170" fill="none" stroke={T.interact} strokeWidth="3"/>
        </svg>

        {/* Reveal labels */}
        {LABELS.map(label => (
          <AnimatePresence key={label.key}>
            {revealed.includes(label.key) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  position: 'absolute',
                  left: label.x, top: label.y,
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  border: `2px solid ${label.color}`,
                  borderRadius: 2,
                  background: `${label.color}10`,
                }}>
                  <div style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 900, color: label.color, letterSpacing: '-0.02em' }}>
                    {label.text}
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, marginTop: 4, letterSpacing: '0.1em' }}>
                    {label.sub}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      <AnimatePresence>
        {revealed.length === LABELS.length && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, textAlign: 'center', letterSpacing: '0.05em' }}
          >
            These are the two fundamental signal domains.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
