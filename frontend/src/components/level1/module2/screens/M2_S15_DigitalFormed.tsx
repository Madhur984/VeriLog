import React from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S15_DigitalFormed: React.FC<M2ScreenProps> = ({ signal }) => {
  const bits = signal?.bitDepth ?? 4;
  const levels = Math.pow(2, bits);

  return (
    <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act IV · Result
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 }}>
          The digital signal is formed.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Clean. Discrete. Immune to noise below the threshold.
        </p>
      </div>

      {/* The clean digital signal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: '100%', border: `2px solid ${T.signal}40`, borderRadius: 2, overflow: 'hidden', boxShadow: `0 0 40px ${T.signal}10` }}
      >
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${T.signal}06` }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.signal }}>Digital Signal — Output</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.signal }}>{bits}-bit · {levels} levels</span>
        </div>
        <WaveCanvas mode="digital" frequency={signal?.frequency ?? 3} amplitude={signal?.amplitude ?? 0.65}
          bitDepth={bits} height={230} showGrid signalColor={T.signal} />
      </motion.div>

      {/* Properties */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}>
        {[
          { icon: '⚡', title: 'Noise-Immune', desc: 'Errors < 0.5 LSB are correctable with error codes' },
          { icon: '📦', title: 'Compressible', desc: 'Redundancy can be removed. FLAC, ZIP, JPEG.' },
          { icon: '🔁', title: 'Lossless Copy', desc: 'Identical copies forever — bits do not degrade' },
        ].map(item => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ padding: '16px', border: `1px solid ${T.border}`, borderRadius: 2, background: T.card, textAlign: 'center' }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, lineHeight: 1.5 }}>{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
