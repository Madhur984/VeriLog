import React, { useState } from 'react';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S10_SamplingRate: React.FC<M2ScreenProps> = ({ triggerHaptic, updateSignal, signal }) => {
  const [fs, setFs] = useState(signal?.samplingRate ?? 12);
  const f = signal?.frequency ?? 3;
  const ratio = fs / f;
  const isSafe = ratio >= 2;

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act III · Sampling Rate
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Sparse vs Dense.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Push the sampling rate down. Watch what happens to reconstruction quality.
        </p>
      </div>

      {/* Ratio display */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ padding: '12px 20px', border: `2px solid ${isSafe ? T.success : T.error}`, borderRadius: 2, transition: 'border-color 0.3s' }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>fs / f</div>
          <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 900, color: isSafe ? T.success : T.error, transition: 'color 0.3s' }}>
            {ratio.toFixed(2)}×
          </div>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', border: `1px solid ${isSafe ? `${T.success}30` : `${T.error}30`}`, borderRadius: 2, background: isSafe ? `${T.success}06` : `${T.error}06`, transition: 'all 0.3s' }}>
          <p style={{ fontFamily: T.mono, fontSize: 10, color: isSafe ? T.success : T.error, margin: 0, lineHeight: 1.6 }}>
            {isSafe
              ? '✓ Nyquist condition met: fs ≥ 2f. Signal can be reconstructed.'
              : `⚠ Nyquist violated: fs < 2f. Aliasing WILL occur. fs=${fs}Hz, 2f=${2 * f}Hz required.`}
          </p>
        </div>
      </div>

      {/* Wave */}
      <div style={{ width: '100%', border: `1px solid ${isSafe ? T.border : T.error}`, borderRadius: 2, overflow: 'hidden', transition: 'border-color 0.3s' }}>
        <WaveCanvas mode="sampling-overlay" frequency={f} amplitude={signal?.amplitude ?? 0.65} samplingRate={fs} height={220} showGrid
          signalColor={isSafe ? T.signal : '#EC4899'} />
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
            Sampling Rate (fs)
          </label>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact }}>{fs} samples/period</span>
        </div>

        {/* Threshold marker */}
        <div style={{ position: 'relative' }}>
          <input type="range" min="1" max="30" step="1" value={fs}
            onChange={e => { const v = parseInt(e.target.value, 10); setFs(v); updateSignal?.({ samplingRate: v }); triggerHaptic('light'); }}
            style={{ width: '100%', accentColor: isSafe ? T.interact : T.error, cursor: 'pointer', height: 4 }} />
          {/* Nyquist threshold indicator */}
          <div style={{
            position: 'absolute', top: -20,
            left: `${((2 * f - 1) / 29) * 100}%`,
            transform: 'translateX(-50%)',
            fontFamily: T.mono, fontSize: 8, color: T.error, letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}>
            min: 2f={2 * f}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.error }}>1 (aliasing)</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.success }}>30 (high fidelity)</span>
        </div>
      </div>
    </div>
  );
};
