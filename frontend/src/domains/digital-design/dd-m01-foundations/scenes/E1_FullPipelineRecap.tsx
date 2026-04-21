import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#FF5F1F';

interface E1Props { sceneIndex: number; currentScene: number; recapNodeActive: string | null; onNodeClick: (id: string | null) => void; }

const PIPELINE_NODES = [
  { id: 'truth-table', label: 'TRUTH TABLE', emoji: '⊟', phase: '#00D4FF', detail: 'Specification. 2ⁿ rows. F=1, F=0.', x: 60, y: 60 },
  { id: 'minterm', label: 'MINTERMS', emoji: '∑', phase: '#A855F7', detail: 'Rows with F=1. Input=1→uncomp. Input=0→comp. Σm notation.', x: 220, y: 40 },
  { id: 'maxterm', label: 'MAXTERMS', emoji: 'Π', phase: '#A855F7', detail: 'Rows with F=0. REVERSED RULE. Input=1→comp. ΠM notation.', x: 220, y: 110 },
  { id: 'sop', label: 'CANONICAL SOP', emoji: '+', phase: '#A855F7', detail: 'OR of minterms. AND-OR circuit. NAND-NAND form.', x: 380, y: 40 },
  { id: 'pos', label: 'CANONICAL POS', emoji: '·', phase: '#A855F7', detail: 'AND of maxterms. OR-AND circuit. NOR-NOR form.', x: 380, y: 110 },
  { id: 'minimise', label: 'MINIMISE', emoji: '▦', phase: '#3B82F6', detail: 'K-map or Quine-McCluskey. Reduce gate count.', x: 540, y: 75 },
  { id: 'gates', label: 'GATE CIRCUIT', emoji: '⊃', phase: '#22C55E', detail: 'AND-OR, NAND-NAND, OR-AND, or NOR-NOR. Choose by count.', x: 700, y: 75 },
];

const PIPELINE_EDGES = [
  { from: 'truth-table', to: 'minterm' }, { from: 'truth-table', to: 'maxterm' },
  { from: 'minterm', to: 'sop' }, { from: 'maxterm', to: 'pos' },
  { from: 'sop', to: 'minimise' }, { from: 'pos', to: 'minimise' },
  { from: 'minimise', to: 'gates' },
];

function nodeById(id: string) { return PIPELINE_NODES.find(n => n.id === id); }

const E1_FullPipelineRecap: React.FC<E1Props> = ({ sceneIndex, currentScene, recapNodeActive, onNodeClick }) => {
  const isActive = currentScene === sceneIndex;
  const active = recapNodeActive ? nodeById(recapNodeActive) : null;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="E" name="FULL PIPELINE RECAP" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 items-center gap-5">
        {/* Pipeline map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <svg width="100%" viewBox="0 0 800 180" role="img" aria-label="Full design pipeline map">
            {/* Edges */}
            {PIPELINE_EDGES.map(({ from, to }) => {
              const f = nodeById(from);
              const t = nodeById(to);
              if (!f || !t) return null;
              return (
                <motion.line
                  key={`${from}-${to}`}
                  x1={f.x + 30} y1={f.y + 14}
                  x2={t.x} y2={t.y + 14}
                  stroke={recapNodeActive && (from === recapNodeActive || to === recapNodeActive) ? '#00D4FF' : '#2A2A3A'}
                  strokeWidth={1.5}
                  strokeDasharray="4,3"
                />
              );
            })}

            {/* Nodes */}
            {PIPELINE_NODES.map((n, i) => (
              <g
                key={n.id}
                onClick={() => onNodeClick(n.id === recapNodeActive ? null : n.id)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`Click to learn about ${n.label}`}
                aria-pressed={recapNodeActive === n.id}
              >
                <motion.rect
                  x={n.x} y={n.y - 4}
                  width={90} height={36}
                  rx={8}
                  fill="#111114"
                  stroke={recapNodeActive === n.id ? n.phase : `${n.phase}44`}
                  strokeWidth={recapNodeActive === n.id ? 2 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.12 }}
                />
                <text x={n.x + 26} y={n.y + 19} fontSize={6.5} fill={n.phase} fontFamily="IBM Plex Mono" textAnchor="middle">
                  {n.label}
                </text>
                <text x={n.x + 10} y={n.y + 14} fontSize={12} fill={n.phase}>{n.emoji}</text>
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-5 flex flex-col gap-3 w-full max-w-lg"
              style={{ background: '#111114', border: `2px solid ${active.phase}66` }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 24 }}>{active.emoji}</span>
                <span className="font-mono font-bold" style={{ color: active.phase, fontSize: 13, letterSpacing: '0.06em' }}>{active.label}</span>
              </div>
              <p className="text-[12px] font-mono leading-relaxed" style={{ color: '#E8E8F0' }}>
                {active.detail}
              </p>
              <button
                onClick={() => onNodeClick(null)}
                className="text-[10px] font-mono text-left"
                style={{ color: '#7A7A8C' }}
              >
                ✕ CLOSE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        {!active && (
          <div className="text-[11px] font-mono" style={{ color: '#7A7A8C' }}>
            ↑ Click any node to review the concept
          </div>
        )}

        {/* Capstone teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="rounded-2xl px-6 py-4 text-center"
          style={{ background: 'rgba(255,95,31,0.08)', border: '2px solid rgba(255,95,31,0.4)' }}
        >
          <div className="text-[11px] font-mono" style={{ color: PHASE_COLOR }}>NEXT: BOSS CHALLENGE</div>
          <p className="text-[13px] mt-1" style={{ color: '#E8E8F0' }}>
            Apply the complete pipeline to a new specification. From words to gates.
          </p>
        </motion.div>
      </div>
    </SceneWrapper>
  );
};

export default E1_FullPipelineRecap;
