import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';

const NyquistDiagram: React.FC<{ isAliasing: boolean }> = ({ isAliasing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth;
      const H = 180;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr; canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      // Axes
      ctx.strokeStyle = 'rgba(15,23,42,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, 20); ctx.lineTo(40, H - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(40, H - 20); ctx.lineTo(W - 20, H - 20); ctx.stroke();

      // Nyquist threshold line at f = fs/2
      const fNyq = W * 0.45;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = T.error;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(fNyq, 20); ctx.lineTo(fNyq, H - 20); ctx.stroke();
      ctx.setLineDash([]);

      // Label threshold
      ctx.font = `bold 8px ${T.mono}`;
      ctx.fillStyle = T.error;
      ctx.fillText('fs/2', fNyq - 14, H - 6);

      // Signal frequency marker
      const fSig = isAliasing ? W * 0.65 : W * 0.3;
      ctx.fillStyle = T.signal;
      ctx.beginPath();
      ctx.moveTo(fSig, H - 20);
      ctx.lineTo(fSig, H - 20 - (H - 50) * 0.8);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(fSig, H - 20 - (H - 50) * 0.8, 4, 0, Math.PI * 2);
      ctx.fillStyle = isAliasing ? '#EC4899' : T.signal;
      ctx.fill();

      ctx.font = `bold 8px ${T.mono}`;
      ctx.fillStyle = isAliasing ? '#EC4899' : T.signal;
      ctx.fillText(isAliasing ? 'f > fs/2 !' : 'f < fs/2 ✓', fSig + 6, H - 20 - (H - 50) * 0.8 - 4);

      // Axis labels
      ctx.fillStyle = T.muted;
      ctx.font = `8px ${T.mono}`;
      ctx.fillText('0', 28, H - 14);
      ctx.fillText('Frequency →', W - 100, H - 5);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAliasing]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 180, display: 'block' }} />;
};

export const M2_S12_NyquistInsight: React.FC<M2ScreenProps> = ({ signal }) => {
  const f = signal?.frequency ?? 5;
  const fs = signal?.samplingRate ?? 14;
  const isAliasing = fs < 2 * f;

  return (
    <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act III · The Principle
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 }}>
          The Nyquist-Shannon Theorem.
        </h2>
      </div>

      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <NyquistDiagram isAliasing={isAliasing} />
      </div>

      {/* Theorem statement */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ padding: '20px 28px', border: `1px solid ${T.signal}40`, borderLeft: `4px solid ${T.signal}`, borderRadius: 2, width: '100%', background: `${T.signal}05` }}
      >
        <p style={{ fontFamily: T.mono, fontSize: 12, color: T.text, margin: 0, lineHeight: 1.8, letterSpacing: '0.03em' }}>
          To perfectly reconstruct a continuous signal, the sampling rate{' '}
          <span style={{ color: T.interact }}>f<sub>s</sub></span>{' '}
          must be at least twice the highest frequency{' '}
          <span style={{ color: T.signal }}>f</span>{' '}
          in the signal:
        </p>
        <p style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 900, color: T.text, margin: '14px 0 0', letterSpacing: '0.05em', textAlign: 'center' }}>
          <span style={{ color: T.interact }}>f<sub>s</sub></span>
          {' ≥ 2 × '}
          <span style={{ color: T.signal }}>f</span>
        </p>
      </motion.div>

      {/* Real-world examples */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%' }}>
        {[
          { system: 'Audio CD', f: '22 kHz', fs: '44.1 kHz', ratio: '2.0×' },
          { system: 'Phone STD', f: '4 kHz', fs: '8 kHz', ratio: '2.0×' },
        ].map(ex => (
          <div key={ex.system} style={{ padding: '14px 18px', border: `1px solid ${T.border}`, borderRadius: 2, background: T.card }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.text, marginBottom: 8 }}>{ex.system}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Signal: {ex.f}</span>
              <span>Sample: {ex.fs}</span>
              <span style={{ color: T.success }}>Ratio: {ex.ratio}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
