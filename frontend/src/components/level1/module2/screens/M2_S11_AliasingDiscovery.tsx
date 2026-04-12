import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { AliasingCanvas } from '../shared/AliasingCanvas';

export const M2_S11_AliasingDiscovery: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [signalFreq, setSignalFreq] = useState(5);
  const [sampleRate, setSampleRate] = useState(14);

  const isAliasing = sampleRate < 2 * signalFreq;
  const fAlias = Math.abs(signalFreq - Math.round(signalFreq / sampleRate) * sampleRate);

  return (
    <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act III · The Discovery
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Aliasing: The Phantom Signal.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Reduce sampling rate below 2× signal frequency. Watch reality bend.
        </p>
      </div>

      {/* Status alert */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isAliasing ? 'alias' : 'ok'}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            padding: '12px 20px',
            border: `2px solid ${isAliasing ? '#EC4899' : T.success}`,
            borderRadius: 2,
            background: isAliasing ? 'rgba(236,72,153,0.06)' : `${T.success}08`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: T.mono, fontSize: 10, color: isAliasing ? '#EC4899' : T.success, letterSpacing: '0.1em' }}>
            {isAliasing
              ? `⚠ ALIASING — f={signalFreq}Hz, fs={sampleRate}Hz. Phantom freq: ${fAlias.toFixed(1)}Hz`
              : `✓ CLEAN — fs/f = ${(sampleRate / signalFreq).toFixed(2)}× (Nyquist satisfied)`}
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>
            {isAliasing ? `f_alias = |${signalFreq} − ${Math.round(signalFreq / sampleRate)}×${sampleRate}|` : 'fs ≥ 2f'}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Physics canvas */}
      <div style={{ border: `1px solid ${isAliasing ? '#EC489940' : T.border}`, borderRadius: 2, overflow: 'hidden', transition: 'border-color 0.3s' }}>
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 20, height: 2, background: T.signal, opacity: 0.3 }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>True signal</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.interact }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>Samples (fs)</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 20, height: 2, background: isAliasing ? '#EC4899' : T.signal }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>Reconstructed</span>
          </div>
        </div>
        <AliasingCanvas frequency={signalFreq} sampleRate={sampleRate} height={240} />
      </div>

      {/* Dual sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Signal frequency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Signal (f)</label>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.signal }}>{signalFreq} Hz</span>
          </div>
          <input type="range" min="1" max="15" step="0.5" value={signalFreq}
            onChange={e => { setSignalFreq(parseFloat(e.target.value)); triggerHaptic('light'); }}
            style={{ accentColor: T.signal, cursor: 'pointer', height: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>1 Hz</span>
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>15 Hz</span>
          </div>
        </div>

        {/* Sample rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Sample Rate (fs)</label>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact }}>{sampleRate} Hz</span>
          </div>
          <input type="range" min="1" max="30" step="1" value={sampleRate}
            onChange={e => { setSampleRate(parseInt(e.target.value, 10)); triggerHaptic('light'); }}
            style={{ accentColor: isAliasing ? T.error : T.interact, cursor: 'pointer', height: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.error }}>1 Hz</span>
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.success }}>30 Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
};
