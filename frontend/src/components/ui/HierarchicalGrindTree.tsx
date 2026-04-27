import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── TYPE DEFINITIONS ──────────────────────────────────────────────────────────
interface SubNode {
  id: string;
  label: string;
  pct: number;
  color: string;
  icon: string;
  locked?: boolean;
}

interface RootNode {
  id: string;
  label: string;
  fullLabel: string;
  description: string; // short tooltip blurb describing what's inside
  tech: string; // technical category badge (matches branch subtitle style)
  level: string; // "L1" .. "L5"
  pct: number;
  icon: string;
  color: [string, string]; // [dark, light]
  glow: string;
  route?: string;
  status: 'done' | 'active' | 'locked';
  children: SubNode[];
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const ROOT_NODES: RootNode[] = [
  {
    id: 'r1',
    label: 'Signals & Waves',
    fullLabel: 'Signal Foundations',
    description: 'Standard signals, analog vs digital, wave parameters, and the bridge to Verilog.',
    tech: 'WAVE_FOUNDATION',
    level: 'L1',
    pct: 0,
    icon: '〜',
    color: ['#0e7490', '#22d3ee'],
    glow: '#22d3ee',
    route: '/module/1',
    status: 'done',
    children: [
      { id: 'r1c1', label: 'Standard Signals', pct: 100, color: '#22d3ee', icon: '⚡', locked: false },
      { id: 'r1c2', label: 'Analog vs Digital', pct: 100, color: '#38bdf8', icon: '↺', locked: false },
      { id: 'r1c3', label: 'Wave Parameters', pct: 100, color: '#0ea5e9', icon: '∿', locked: false },
      { id: 'r1c4', label: 'Verilog Bridge', pct: 80, color: '#7dd3fc', icon: '≋', locked: false },
    ],
  },
  {
    id: 'r2',
    label: 'Sampling & ADC',
    fullLabel: 'Analog → Digital',
    description: 'Sampling, aliasing, Nyquist, quantization, dither, reconstruction, and ADC architectures.',
    tech: 'SAMPLING_THEORY',
    level: 'L2',
    pct: 0,
    icon: '⊞',
    color: ['#065f46', '#34d399'],
    glow: '#34d399',
    route: '/module/2',
    status: 'active',
    children: [
      { id: 'r2c1', label: 'Sampling', pct: 100, color: '#34d399', icon: '◉', locked: false },
      { id: 'r2c2', label: 'Aliasing & Nyquist', pct: 90, color: '#6ee7b7', icon: '≁', locked: false },
      { id: 'r2c3', label: 'Quantization', pct: 70, color: '#10b981', icon: '▤', locked: false },
      { id: 'r2c4', label: 'Reconstruction', pct: 55, color: '#059669', icon: '∽', locked: false },
      { id: 'r2c5', label: 'ADC Architecture', pct: 20, color: '#a7f3d0', icon: '⊟', locked: false },
    ],
  },
  {
    id: 'r4',
    label: 'Binary & Logic',
    fullLabel: 'Numbers & Boolean',
    description: 'Decimal, binary, octal, hex, conversions, logic gates, carry chain, Boolean algebra.',
    tech: 'BOOLEAN_LOGIC',
    level: 'L3',
    pct: 0,
    icon: '⊃',
    color: ['#1e3a8a', '#60a5fa'],
    glow: '#60a5fa',
    route: '/module/3',
    status: 'active',
    children: [
      { id: 'r4c1', label: 'Number Systems', pct: 0, color: '#60a5fa', icon: '0b', locked: false },
      { id: 'r4c2', label: 'Logic Gates', pct: 0, color: '#3b82f6', icon: '∧', locked: false },
      { id: 'r4c3', label: 'Carry Chain', pct: 0, color: '#2563eb', icon: '⊕', locked: false },
      { id: 'r4c4', label: 'Boolean Algebra', pct: 0, color: '#bfdbfe', icon: '⊗', locked: false },
      { id: 'r4c5', label: 'Complements', pct: 0, color: '#dbeafe', icon: '±', locked: false },
    ],
  },
  {
    id: 'r5',
    label: 'K-Maps',
    fullLabel: 'Karnaugh Reduction',
    description: '2/3/4-variable maps, grouping rules, don\'t-cares, POS, and the K-Map sandbox.',
    tech: 'MAP_REDUCTION',
    level: 'L4',
    pct: 0,
    icon: '▦',
    color: ['#9f1239', '#fb7185'],
    glow: '#fb7185',
    route: '/module/4',
    status: 'active',
    children: [
      { id: 'r5c1', label: '2-Variable Maps', pct: 0, color: '#fb7185', icon: '▣', locked: false },
      { id: 'r5c2', label: '3-Variable Maps', pct: 0, color: '#f43f5e', icon: '▤', locked: false },
      { id: 'r5c3', label: '4-Variable Maps', pct: 0, color: '#e11d48', icon: '▥', locked: false },
      { id: 'r5c4', label: "Don't Care Terms", pct: 0, color: '#fda4af', icon: '⊘', locked: false },
      { id: 'r5c5', label: 'SOP / POS Forms', pct: 0, color: '#fecdd3', icon: 'Σ', locked: false },
    ],
  },
  {
    id: 'r6',
    label: 'Verilog Core',
    fullLabel: 'HDL Synthesis Gateway',
    description: 'First Verilog, modules, testbenches, clock signals, hierarchy — gateway to L6 mastery.',
    tech: 'HDL_GATEWAY',
    level: 'L5',
    pct: 0,
    icon: '≡',
    color: ['#4c1d95', '#c4b5fd'],
    glow: '#c4b5fd',
    route: '/module/5',
    status: 'active',
    children: [
      { id: 'r6c1', label: 'First Verilog', pct: 0, color: '#c4b5fd', icon: '{', locked: false },
      { id: 'r6c2', label: 'Modules', pct: 0, color: '#a78bfa', icon: '◫', locked: false },
      { id: 'r6c3', label: 'Testbenches', pct: 0, color: '#8b5cf6', icon: '⊡', locked: false },
      { id: 'r6c4', label: 'Clock Signal', pct: 0, color: '#7c3aed', icon: '⟳', locked: false },
      { id: 'r6c5', label: 'Hierarchy', pct: 0, color: '#ddd6fe', icon: '⬡', locked: false },
    ],
  },
];


// ─── ROOT MODULE NODE ─────────────────────────────────────────────────────────
const RootGem: React.FC<{
  node: RootNode;
  index: number;
  onClick: () => void;
}> = ({ node, index, onClick }) => {
  const isLocked = node.status === 'locked';
  const isDone = node.status === 'done';
  const accent = node.glow;

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width: 138, cursor: isLocked ? 'not-allowed' : 'pointer' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      onClick={() => { if (!isLocked) onClick(); }}
    >
      {/* Level chip */}
      <div
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border bg-transparent mb-3"
        style={{
          borderColor: isLocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)',
        }}
      >
        <span className="text-[8.5px] font-mono tracking-[0.25em] text-white/55">
          {node.level}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: isLocked ? 'rgba(255,255,255,0.15)' : accent }}
        />
      </div>

      {/* Module hex crystal — flat, no glow/spin */}
      <div className="relative group">
        <svg
          width={66}
          height={74}
          viewBox="0 0 66 74"
          className="transition-opacity duration-200"
          style={{ opacity: isLocked ? 0.45 : 1 }}
        >
          <polygon
            points="33,3 60,18 60,52 33,67 6,52 6,18"
            fill="#0B0D11"
            stroke={isLocked ? 'rgba(255,255,255,0.1)' : `${accent}99`}
            strokeWidth="1"
          />
          {/* Subtle inner facet line for crystal feel */}
          {!isLocked && (
            <>
              <line x1="33" y1="3" x2="33" y2="67" stroke={accent} strokeOpacity="0.12" strokeWidth="0.6" />
              <line x1="6" y1="35" x2="60" y2="35" stroke={accent} strokeOpacity="0.08" strokeWidth="0.6" />
            </>
          )}
          <text
            x="33"
            y="42"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="20"
            fill={isLocked ? '#334155' : accent}
          >
            {isLocked ? '🔒' : node.icon}
          </text>
        </svg>
        {/* Subtle hover highlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${accent}14, transparent 70%)`,
          }}
        />
        {isDone && (
          <div
            className="absolute -top-1 -right-0.5 px-1 py-0.5 rounded-sm bg-[#0B0D11] border"
            style={{ borderColor: accent }}
          >
            <span className="text-[8px] font-mono" style={{ color: accent }}>✓</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div
        className="mt-3 text-center text-[11px] font-semibold leading-tight tracking-wide"
        style={{
          color: isLocked ? '#475569' : '#E5E7EB',
          maxWidth: 130,
        }}
      >
        {node.label}
      </div>

      {/* Tech category sub-label */}
      <div
        className="mt-1 text-[8px] font-mono tracking-[0.18em] text-center"
        style={{
          color: isLocked ? '#334155' : 'rgba(255,255,255,0.4)',
          maxWidth: 130,
        }}
      >
        {node.tech}
      </div>

      {/* Progress percentage */}
      <div
        className="mt-1.5 text-[9px] font-mono tabular-nums"
        style={{ color: isLocked ? '#334155' : 'rgba(255,255,255,0.55)' }}
      >
        {node.pct}%
      </div>
    </motion.div>
  );
};

// ─── MAIN TREE COMPONENT ───────────────────────────────────────────────────────
export const HierarchicalGrindTree: React.FC = () => {
  const navigate = useNavigate();

  const branches = [
    {
      id: 'branch-electronics',
      title: 'HDL Foundations',
      subtitle: 'CRISIS_AND_PARADIGM',
      color: '#22d3ee',
      nodes: [
        { id: 's00', label: 'Breaking Point', subtitle: 'L6 · 01', desc: 'Why traditional design fails at scale.', route: '/module/6/0' },
        { id: 's01', label: 'Industry Risk', subtitle: 'L6 · 03', desc: 'The economic cost of complexity.', route: '/module/6/2' },
        { id: 's03', label: 'What is HDL?', subtitle: 'L6 · 05', desc: 'Hardware description as language.', route: '/module/6/4' },
        { id: 's03a', label: 'Verilog Mandate', subtitle: 'L6 · 09', desc: 'Why Verilog became the standard.', route: '/module/6/8' },
      ]
    },
    {
      id: 'branch-design',
      title: 'System Architecture',
      subtitle: 'ARCH_SYNTHESIS',
      color: '#34d399',
      nodes: [
        { id: 's02', label: 'Abstraction Ladder', subtitle: 'L6 · 12', desc: 'Climbing from gates to behaviour.', route: '/module/6/11' },
        { id: 's13', label: 'Synthesis Flow', subtitle: 'L6 · 14', desc: 'Translating intent to netlists.', route: '/module/6/13' },
        { id: 's05', label: 'VLSI Pipeline', subtitle: 'L6 · 15', desc: 'From RTL to silicon die.', route: '/module/6/14' },
        { id: 's14', label: 'FPGA vs ASIC', subtitle: 'L6 · 24', desc: 'Choosing your implementation destiny.', route: '/module/6/23' },
      ]
    },
    {
      id: 'branch-verilog',
      title: 'Verilog Mastery',
      subtitle: 'RTL_VERIFICATION',
      color: '#a78bfa',
      nodes: [
        { id: 's06', label: 'First Contact', subtitle: 'L6 · 17', desc: 'Writing your first Verilog module.', route: '/module/6/16' },
        { id: 's06a', label: 'Testbench', subtitle: 'L6 · 18', desc: 'Verification fundamentals.', route: '/module/6/17' },
        { id: 's20', label: 'AI Hardware', subtitle: 'L6 · 25', desc: 'Matrix engines and modern accelerators.', route: '/module/6/24' },
        { id: 's21', label: 'Power Design', subtitle: 'L6 · 26', desc: 'PPA and thermal envelopes.', route: '/module/6/25' },
      ]
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      {/* ── Fixed Header Area ── */}
      <div className="flex-shrink-0 w-full pt-6 pb-5 px-4 lg:px-6 border-b border-white/10 bg-[#0A0B0F]/95 backdrop-blur-md relative z-30 flex justify-center">
        <div className="w-full max-w-[850px] flex flex-col items-center">
          {/* Header label — minimal, no pulses */}
          <div className="flex items-center justify-between w-full mb-5 px-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-white/55">
              <span className="w-1 h-1 rounded-full bg-cyan-400/70" />
              Foundation Framework
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-white/35">
              L1 — L5 · 5 modules
            </div>
          </div>

          {/* Root nodes row with sequential connector trace */}
          <div className="relative w-full">
            {/* Subtle horizontal connector through node centers */}
            <div
              className="absolute left-[10%] right-[10%] h-[1px] pointer-events-none bg-white/8"
              style={{ top: 52 }}
            />

            <div className="flex items-start justify-center gap-3 lg:gap-5 w-full flex-wrap sm:flex-nowrap relative">
              {ROOT_NODES.map((node, idx) => (
                <RootGem
                  key={node.id}
                  node={node}
                  index={idx}
                  onClick={() => {
                    if (node.route && node.status !== 'locked') navigate(node.route);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Branches Area ── */}
      <div
        className="flex-1 w-full overflow-y-auto px-4 lg:px-6 pt-0 pb-24 scrollbar-hide relative z-10 flex justify-center"
      >
        <div className="w-full max-w-[850px] relative">
          {/* Three Vertical Branches */}
          <div className="relative w-full pb-10 px-4 md:px-8">
            {/* Top entry trace from header to junction */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-white/10" />

            {/* L6 label — plain, no glow */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
              <div
                className="px-2.5 py-0.5 rounded-sm border bg-[#0A0B0F]"
                style={{ borderColor: 'rgba(255,255,255,0.14)' }}
              >
                <span className="text-[9px] font-mono tracking-[0.2em] text-white/70">L6 · Synthesis Layer</span>
              </div>
            </div>

            {/* Junction node where trunk splits */}
            <div className="absolute top-[58px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40 z-20" />

            {/* Horizontal distributor trace */}
            <div className="absolute top-[62px] left-[16.66%] right-[16.66%] h-[1px] bg-white/12" />

            <div className="flex justify-between gap-0 relative">
              {branches.map(branch => (
                <div key={branch.id} className="flex-1 flex flex-col items-center relative min-w-0">
                  {/* Branch Entry Trace - vertical from distributor down to title */}
                  <div
                    className="absolute top-[62px] left-1/2 -translate-x-1/2 w-[1px] h-12 bg-white/12"
                  />

                  {/* Branch Title — clean academic style */}
                  <div className="mt-[106px] mb-6 text-center z-10 px-2 w-full flex flex-col items-center justify-end" style={{ minHeight: 150 }}>
                    <span
                      className="text-[8.5px] font-mono tracking-[0.22em] mb-2 uppercase"
                      style={{ color: `${branch.color}cc` }}
                    >
                      {branch.subtitle.replace(/_/g, ' ').toLowerCase()}
                    </span>
                    <h3
                      className="text-base lg:text-[17px] font-semibold tracking-tight text-white/95 leading-snug"
                    >
                      {branch.title}
                    </h3>
                    {/* Branch progress — minimal segmented dots */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="text-[9px] font-mono tabular-nums text-white/45">
                        0
                      </span>
                      <div className="flex items-center gap-1">
                        {branch.nodes.map((_, dotIdx) => (
                          <div
                            key={dotIdx}
                            className="w-1.5 h-1.5 rounded-sm border"
                            style={{ borderColor: `${branch.color}80` }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono tabular-nums text-white/45">
                        / {branch.nodes.length}
                      </span>
                    </div>
                  </div>

                  {/* Branch Body — central trunk + alternating leaves */}
                  <div className="relative w-full flex flex-col items-center pt-2">
                    {/* Continuous vertical trunk — single thin line, no glow/pulse */}
                    <div
                      className="absolute top-0 bottom-12 left-1/2 -translate-x-1/2 w-[1px]"
                      style={{ backgroundColor: `${branch.color}55` }}
                    />

                    {branch.nodes.map((node, i) => {
                      const onLeft = i % 2 === 0;
                      // Small hex chip used for both left and right node positions
                      const hexChip = (
                        <button
                          onClick={() => navigate(node.route)}
                          className="relative cursor-pointer outline-none transition-opacity duration-200 hover:opacity-100 opacity-95"
                          aria-label={node.label}
                          style={{ width: 44, height: 50 }}
                        >
                          <svg width={44} height={50} viewBox="0 0 44 50">
                            <polygon
                              points="22,2 40,12 40,38 22,48 4,38 4,12"
                              fill="#0B0D11"
                              stroke={`${branch.color}88`}
                              strokeWidth="1"
                            />
                            <text
                              x="22"
                              y="29"
                              textAnchor="middle"
                              fontFamily="monospace"
                              fontSize="13"
                              fontWeight="600"
                              fill={branch.color}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </text>
                          </svg>
                        </button>
                      );

                      // Label block aligned to the appropriate side
                      const labelBlock = (align: 'left' | 'right') => (
                        <div className={`max-w-full ${align === 'right' ? 'text-right pr-1' : 'text-left pl-1'}`}>
                          <div className="text-[12px] font-semibold leading-tight text-white/95 mb-0.5">
                            {node.label}
                          </div>
                          <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
                            <span
                              className="text-[8.5px] font-mono tracking-[0.15em]"
                              style={{ color: `${branch.color}cc` }}
                            >
                              {node.subtitle}
                            </span>
                          </div>
                          <div className="mt-1 text-[10px] leading-snug text-white/60">
                            {node.desc}
                          </div>
                        </div>
                      );

                      return (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                          className="relative w-full flex items-center mb-9 last:mb-2"
                          style={{ minHeight: 56 }}
                        >
                          {/* LEFT cell (node when onLeft, else label) */}
                          <div className="flex-1 flex justify-end items-center pr-3">
                            {onLeft ? hexChip : labelBlock('right')}
                          </div>

                          {/* CENTER trunk connector */}
                          <div className="relative w-0 flex-shrink-0 h-full flex items-center justify-center" style={{ minHeight: 56 }}>
                            {/* Thin branch arm */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 h-[1px]"
                              style={{
                                width: 22,
                                left: onLeft ? -22 : 0,
                                backgroundColor: `${branch.color}88`,
                              }}
                            />
                            {/* Junction pip on trunk */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                              style={{
                                left: 0,
                                backgroundColor: branch.color,
                              }}
                            />
                          </div>

                          {/* RIGHT cell (node when !onLeft, else label) */}
                          <div className="flex-1 flex justify-start items-center pl-3">
                            {!onLeft ? hexChip : labelBlock('left')}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Branch terminator — flat horizontal bar */}
                    <div className="relative mt-2 flex flex-col items-center">
                      <div
                        className="w-8 h-[2px]"
                        style={{ backgroundColor: `${branch.color}66` }}
                      />
                      <div
                        className="mt-2 text-[8px] font-mono tracking-[0.2em]"
                        style={{ color: `${branch.color}99` }}
                      >
                        end of branch
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
