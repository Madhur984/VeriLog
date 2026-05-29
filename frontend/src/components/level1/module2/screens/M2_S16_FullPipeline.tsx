import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { M2ScreenProps, T } from '../types';

const STAGES = [
  {
    id: 'analog',
    label: 'Analog Signal',
    icon: '〜',
    color: T.signal,
    tooltip: 'Continuous voltage from the real world\n(microphone, sensor, antenna)',
  },
  {
    id: 'sampling',
    label: 'Sampling',
    icon: '⬛',
    color: '#8B5CF6',
    tooltip: 'ADC captures voltage snapshots at fs\nMust satisfy: fs ≥ 2f (Nyquist)',
  },
  {
    id: 'quantization',
    label: 'Quantization',
    icon: '╤',
    color: T.interact,
    tooltip: 'Each sample is rounded to nearest of 2^n levels\nMore bits = less error',
  },
  {
    id: 'digital',
    label: 'Digital Output',
    icon: '01',
    color: T.success,
    tooltip: 'Binary code - noise-immune, compressible, storable\nThe language of Verilog',
  },
];

export const M2_S16_FullPipeline: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act IV · Full Picture
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          The complete ADC pipeline.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Hover each stage to understand what happens.
        </p>
      </div>

      {/* Pipeline diagram */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 0 }}>
        {STAGES.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            {/* Stage block */}
            <motion.div
              onMouseEnter={() => { setActiveStage(stage.id); triggerHaptic('light'); }}
              onMouseLeave={() => setActiveStage(null)}
              whileHover={{ y: -4 }}
              style={{
                flex: 1,
                padding: '20px 12px',
                border: `2px solid ${activeStage === stage.id ? stage.color : T.border}`,
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'default',
                transition: 'border-color 0.2s',
                background: activeStage === stage.id ? `${stage.color}08` : T.bg,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10, fontFamily: T.mono, color: stage.color }}>
                {stage.icon}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.text, letterSpacing: '0.05em', marginBottom: 4 }}>
                {stage.label}
              </div>
              <div style={{ width: 24, height: 2, background: stage.color, margin: '0 auto', opacity: activeStage === stage.id ? 1 : 0.3, transition: 'opacity 0.2s' }} />
            </motion.div>

            {/* Arrow connector */}
            {idx < STAGES.length - 1 && (
              <div style={{ flexShrink: 0, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="14" viewBox="0 0 32 14" fill="none">
                  <path d="M0 7 L24 7 M20 3 L28 7 L20 11" stroke={T.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tooltip panel */}
      <div style={{ width: '100%', minHeight: 90 }}>
        <AnimatePresence mode="wait">
          {activeStage && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '20px 24px',
                border: `1px solid ${STAGES.find(s => s.id === activeStage)!.color}40`,
                borderLeft: `4px solid ${STAGES.find(s => s.id === activeStage)!.color}`,
                borderRadius: 2,
                background: `${STAGES.find(s => s.id === activeStage)!.color}06`,
              }}
            >
              <p style={{ fontFamily: T.mono, fontSize: 12, color: T.text, margin: 0, lineHeight: 1.8, whiteSpace: 'pre-line', letterSpacing: '0.03em' }}>
                {STAGES.find(s => s.id === activeStage)!.tooltip}
              </p>
            </motion.div>
          )}
          {!activeStage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, textAlign: 'center', letterSpacing: '0.15em', textTransform: 'uppercase', paddingTop: 32 }}
            >
              Hover a stage →
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Signal flow SVG */}
      <div style={{ width: '100%', height: 80, border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden', background: T.card }}>
        <svg viewBox="0 0 800 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          {/* Analog segment */}
          <path d="M0,40 C30,10 60,70 90,40 S150,10 180,40 S240,70 270,40" fill="none" stroke={T.signal} strokeWidth="2" opacity="0.8"/>
          {/* Segmented (sampled) */}
          {[300, 330, 360, 390, 420, 450, 480].map((x, i) => (
            <line key={x} x1={x} y1="40" x2={x} y2={i % 2 === 0 ? 20 : 60} stroke="#8B5CF6" strokeWidth="2" opacity="0.7"/>
          ))}
          {/* Stepped (quantized) */}
          <path d="M510,25 L540,25 L540,55 L580,55 L580,20 L620,20 L620,50 L660,50 L660,30" fill="none" stroke={T.interact} strokeWidth="2"/>
          {/* Binary */}
          {[700, 715, 730, 745, 760, 775].map((x, i) => (
            <text key={x} x={x} y="45" fontSize="10" fontFamily="monospace" fill={T.success} opacity="0.8">
              {i % 2 === 0 ? '1' : '0'}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
