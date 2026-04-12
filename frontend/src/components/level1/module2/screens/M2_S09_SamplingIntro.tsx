import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S09_SamplingIntro: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  useEffect(() => { triggerHaptic('light'); }, [triggerHaptic]);

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act III · Sampling
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 34, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 }}>
          To go digital, you must take snapshots.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, letterSpacing: '0.05em', maxWidth: 520, margin: '0 auto' }}>
          The orange dots are samples. Each one captures the signal's value at a specific instant.
          The process is called Pulse Code Modulation (PCM).
        </p>
      </div>

      {/* Sampling visual */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 16, height: 2, background: T.signal }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>True analog signal</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.interact }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>Sample instant</span>
          </div>
        </div>
        <WaveCanvas mode="sampling-overlay" frequency={3} amplitude={0.65} samplingRate={12} height={230} showGrid />
      </div>

      {/* Concept row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}>
        {[
          { step: '01', title: 'Sample', desc: 'Measure voltage at T intervals' },
          { step: '02', title: 'Quantize', desc: 'Round to nearest of 2^n levels' },
          { step: '03', title: 'Encode', desc: "Store as binary — computer's language" },
        ].map(item => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: parseInt(item.step) * 0.2 }}
            style={{ padding: '16px', border: `1px solid ${T.border}`, borderRadius: 2, background: T.card }}
          >
            <div style={{ fontFamily: T.mono, fontSize: 8, color: `${T.signal}60`, letterSpacing: '0.3em', marginBottom: 8 }}>STEP {item.step}</div>
            <div style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, lineHeight: 1.5 }}>{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
