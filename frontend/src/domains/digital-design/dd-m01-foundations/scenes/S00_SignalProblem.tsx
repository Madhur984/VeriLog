import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

interface S00Props {
  sceneIndex: number;
  currentScene: number;
  onBegin: () => void;
}

const JOURNEY_PILLS = [
  { label: 'TRUTH TABLE', phase: '#00D4FF' },
  { label: 'MINTERM', phase: '#A855F7' },
  { label: 'MAXTERM', phase: '#A855F7' },
  { label: 'CANONICAL SOP', phase: '#A855F7' },
  { label: 'CANONICAL POS', phase: '#A855F7' },
  { label: 'MINIMISE', phase: '#3B82F6' },
  { label: 'GATES', phase: '#22C55E' },
];

const CHALLENGE_CARDS = ['LOCK', 'ALARM', 'PRIME'];

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.35, duration: 0.6, ease: 'easeOut' },
  }),
};

const S00_SignalProblem: React.FC<S00Props> = ({ sceneIndex, currentScene, onBegin }) => {
  const isActive = currentScene === sceneIndex;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor="#00D4FF">
      <PhaseLabel phase="0" name="HOOK" color="#00D4FF" />

      {/* Ambient binary heartbeat (bottom-left) */}
      <div
        className="absolute bottom-8 left-6 z-20 pointer-events-none"
        style={{ width: 180, height: 120, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <div className="relative w-full h-full rounded-lg border border-cyan-500/10 bg-black/40 backdrop-blur-sm overflow-hidden">
          <div
            className="absolute inset-0 font-mono text-[10px] leading-[16px] text-cyan-400/30"
            style={{ animation: 'scrollUp 8s linear infinite', whiteSpace: 'pre-wrap', userSelect: 'none' }}
          >
            {Array.from({ length: 40 }, () =>
              Array.from({ length: 16 }, () => (Math.random() > 0.5 ? '1' : '0')).join(' ')
            ).join('\n')}
          </div>
          <div className="absolute bottom-2 left-2 right-2 text-[9px] font-mono text-cyan-400/70 leading-tight z-10">
            Every one of these is a decision.
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 gap-10">
        {/* Hero text */}
        <div className="flex flex-col items-center gap-3">
          <motion.h1
            custom={0}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            variants={heroVariants}
            className="text-center font-extrabold tracking-tight"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#00D4FF',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              fontFamily: 'Inter, system-ui',
            }}
          >
            You know gates.
          </motion.h1>
          <motion.h1
            custom={1}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            variants={heroVariants}
            className="text-center font-extrabold tracking-tight"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#E8E8F0',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              fontFamily: 'Inter, system-ui',
            }}
          >
            Can you build anything?
          </motion.h1>
          <motion.div
            custom={2}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            variants={heroVariants}
            className="flex items-center gap-1"
          >
            <span
              className="text-xl font-mono"
              style={{ color: '#7A7A8C', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Start here
            </span>
            <span
              className="text-xl font-mono"
              style={{
                color: '#7A7A8C',
                animation: 'blink 1s step-end infinite',
              }}
            >
              |
            </span>
          </motion.div>

          {/* Microcopy */}
          <motion.p
            custom={3}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            variants={heroVariants}
            className="text-center mt-2"
            style={{
              color: '#7A7A8C',
              fontSize: 16,
              maxWidth: 480,
              lineHeight: 1.6,
              fontFamily: 'Inter, system-ui',
            }}
          >
            Every digital system starts as behavior described in words.
            By the end of this module, you'll translate words directly into gates.
          </motion.p>
        </div>

        {/* Challenge cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex gap-4 items-center flex-wrap justify-center"
        >
          {CHALLENGE_CARDS.map((card, i) => (
            <motion.div
              key={card}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 120,
                height: 80,
                border: '1px solid #FFFFFF0F',
                background: '#111114',
              }}
              aria-label={`Challenge card: ${card}`}
            >
              <span style={{ color: '#00D4FF', fontFamily: 'IBM Plex Mono, monospace', fontSize: 28 }}>?</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Journey pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {JOURNEY_PILLS.map((pill, i) => (
            <React.Fragment key={pill.label}>
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.8 + i * 0.08 }}
                className="px-2 py-1 rounded text-[10px] font-mono cursor-default"
                style={{
                  border: '1px solid #FFFFFF0F',
                  background: '#111114',
                  color: pill.phase,
                  letterSpacing: '0.06em',
                }}
              >
                {pill.label}
              </motion.span>
              {i < JOURNEY_PILLS.length - 1 && (
                <span style={{ color: '#7A7A8C', fontSize: 10 }}>→</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.4, duration: 0.4 }}
          whileHover={{ scale: 1.02, background: 'rgba(0,212,255,0.12)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onBegin}
          className="px-8 py-3 rounded-full font-mono text-[14px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
          style={{
            border: '1px solid #00D4FF',
            color: '#00D4FF',
            background: 'transparent',
            letterSpacing: '0.08em',
            fontFamily: 'IBM Plex Mono, monospace',
          }}
          aria-label="Begin the module journey"
        >
          BEGIN JOURNEY →
        </motion.button>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
      `}</style>
    </SceneWrapper>
  );
};

export default S00_SignalProblem;
