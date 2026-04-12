import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S01_SmoothVsStepped: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [hovered, setHovered] = useState<'analog' | 'digital' | null>(null);

  return (
    <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 14 }}>
          Act I · Perception
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 12 }}>
          One flows. One jumps.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.06em' }}>
          Hover each to feel the difference.
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>

        {/* Analog */}
        <motion.div
          onMouseEnter={() => { setHovered('analog'); triggerHaptic('light'); }}
          onMouseLeave={() => setHovered(null)}
          animate={{ scale: hovered === 'analog' ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            border: `1px solid ${hovered === 'analog' ? T.signal : T.border}`,
            borderRadius: 2,
            overflow: 'hidden',
            background: T.bg,
            cursor: 'default',
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>Analog</span>
            <motion.span
              animate={{ opacity: hovered === 'analog' ? 1 : 0 }}
              style={{ fontFamily: T.mono, fontSize: 8, color: T.signal, letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Continuous ∞
            </motion.span>
          </div>
          <WaveCanvas mode="analog" frequency={3} amplitude={0.65} height={180} showGrid signalColor={T.signal} />
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${T.border}` }}>
            <p style={{ fontFamily: T.mono, fontSize: 11, color: T.text, letterSpacing: '0.04em', margin: 0 }}>
              Smooth. Infinite values.
            </p>
          </div>
        </motion.div>

        {/* Digital */}
        <motion.div
          onMouseEnter={() => { setHovered('digital'); triggerHaptic('light'); }}
          onMouseLeave={() => setHovered(null)}
          animate={{ scale: hovered === 'digital' ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            border: `1px solid ${hovered === 'digital' ? T.interact : T.border}`,
            borderRadius: 2,
            overflow: 'hidden',
            background: T.card,
            cursor: 'default',
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>Digital</span>
            <motion.span
              animate={{ opacity: hovered === 'digital' ? 1 : 0 }}
              style={{ fontFamily: T.mono, fontSize: 8, color: T.interact, letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Discrete steps
            </motion.span>
          </div>
          <WaveCanvas mode="digital" frequency={3} amplitude={0.65} bitDepth={3} height={180} showGrid signalColor={T.interact} />
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${T.border}` }}>
            <p style={{ fontFamily: T.mono, fontSize: 11, color: T.text, letterSpacing: '0.04em', margin: 0 }}>
              Captured in steps.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
