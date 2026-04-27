import React from 'react';

// ─── SHARED SVG DIAGRAMS FOR THE VERILOG MODULE ───────────────────────────────
// All diagrams accept an `accent` color so they pick up the active Part theme.

interface Props { accent: string }

// ── 1. HDL → Silicon pipeline ────────────────────────────────────────────────
export const HDLPipeline: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 720 140" className="w-full max-w-3xl">
    {[
      { x: 20, label: 'Verilog Code', sub: 'text' },
      { x: 200, label: 'Synthesis', sub: 'compile' },
      { x: 380, label: 'Netlist', sub: 'gates' },
      { x: 560, label: 'Silicon', sub: 'die' },
    ].map((step, i) => (
      <g key={i}>
        <rect x={step.x} y={40} width={140} height={60} rx={8}
              fill="#0B0D11" stroke={accent} strokeOpacity={0.7} strokeWidth={1} />
        <text x={step.x + 70} y={68} textAnchor="middle" fill="#E5E7EB" fontSize={13} fontWeight={600}>
          {step.label}
        </text>
        <text x={step.x + 70} y={86} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">
          {step.sub}
        </text>
        {i < 3 && (
          <g>
            <line x1={step.x + 140} y1={70} x2={step.x + 200} y2={70}
                  stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
            <polygon points={`${step.x + 200},70 ${step.x + 192},66 ${step.x + 192},74`}
                     fill={accent} fillOpacity={0.7} />
          </g>
        )}
      </g>
    ))}
  </svg>
);

// ── 2. Sequential (software) vs Parallel (hardware) ──────────────────────────
export const SequentialVsParallel: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 720 220" className="w-full max-w-3xl">
    {/* SOFTWARE side */}
    <text x={20} y={20} fill="#94a3b8" fontSize={11} fontFamily="monospace" letterSpacing="2">SOFTWARE  ·  one after another</text>
    {[0, 1, 2, 3].map(i => (
      <g key={i}>
        <rect x={20 + i * 75} y={35} width={65} height={32} rx={4}
              fill="#0B0D11" stroke="#475569" strokeWidth={1} />
        <text x={52 + i * 75} y={56} textAnchor="middle" fill="#cbd5e1" fontSize={11} fontFamily="monospace">
          inst{i + 1}
        </text>
        {i < 3 && (
          <line x1={20 + i * 75 + 65} y1={51} x2={20 + (i + 1) * 75} y2={51}
                stroke="#475569" strokeWidth={1} />
        )}
      </g>
    ))}
    <line x1={20} y1={80} x2={340} y2={80} stroke="#475569" strokeWidth={0.5} strokeDasharray="2 3" />
    <text x={20} y={94} fill="#64748b" fontSize={9} fontFamily="monospace">time →</text>

    {/* Divider */}
    <line x1={360} y1={10} x2={360} y2={210} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

    {/* HARDWARE side */}
    <text x={380} y={20} fill={accent} fontSize={11} fontFamily="monospace" letterSpacing="2">HARDWARE  ·  all at once</text>
    {[0, 1, 2, 3].map(i => (
      <g key={i}>
        <rect x={380} y={35 + i * 38} width={170} height={28} rx={4}
              fill="#0B0D11" stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
        <text x={465} y={53 + i * 38} textAnchor="middle" fill="#cbd5e1" fontSize={11} fontFamily="monospace">
          gate{i + 1}
        </text>
        <text x={585} y={53 + i * 38} fill={accent} fillOpacity={0.7} fontSize={10} fontFamily="monospace">
          ← live
        </text>
      </g>
    ))}
    <line x1={380} y1={195} x2={620} y2={195} stroke={accent} strokeOpacity={0.4} strokeWidth={0.5} strokeDasharray="2 3" />
    <text x={380} y={208} fill={`${accent}99`} fontSize={9} fontFamily="monospace">all evaluate at the same instant</text>
  </svg>
);

// ── 3. Verilog history timeline ──────────────────────────────────────────────
export const VerilogTimeline: React.FC<Props> = ({ accent }) => {
  const events = [
    { year: 1984, label: 'Gateway DA' },
    { year: 1990, label: 'Cadence buys' },
    { year: 1995, label: 'IEEE 1364' },
    { year: 2001, label: 'Verilog-2001' },
    { year: 2005, label: 'SystemVerilog' },
  ];
  return (
    <svg viewBox="0 0 720 140" className="w-full max-w-3xl">
      <line x1={40} y1={70} x2={680} y2={70} stroke={accent} strokeOpacity={0.5} strokeWidth={1} />
      {events.map((e, i) => {
        const x = 40 + (i * 640) / (events.length - 1);
        return (
          <g key={i}>
            <circle cx={x} cy={70} r={5} fill={accent} />
            <line x1={x} y1={70} x2={x} y2={i % 2 === 0 ? 40 : 100} stroke={accent} strokeOpacity={0.4} strokeWidth={1} />
            <text x={x} y={i % 2 === 0 ? 30 : 118} textAnchor="middle" fill="#E5E7EB" fontSize={11} fontWeight={600}>
              {e.year}
            </text>
            <text x={x} y={i % 2 === 0 ? 16 : 132} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">
              {e.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── 4. Half-adder schematic ──────────────────────────────────────────────────
export const HalfAdderSchematic: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
    {/* Inputs */}
    <text x={10} y={64} fill="#cbd5e1" fontSize={13} fontFamily="monospace">a</text>
    <text x={10} y={154} fill="#cbd5e1" fontSize={13} fontFamily="monospace">b</text>
    <line x1={20} y1={60} x2={140} y2={60} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={20} y1={150} x2={140} y2={150} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={80} y1={60} x2={80} y2={120} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={80} y1={150} x2={80} y2={170} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={80} y1={120} x2={140} y2={120} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={80} y1={170} x2={140} y2={170} stroke="#94a3b8" strokeWidth={1.2} />

    {/* XOR */}
    <g transform="translate(140,40)">
      <path d="M 0 0 Q 25 40 0 80 Q 40 80 60 40 Q 40 0 0 0 Z"
            fill="#0B0D11" stroke={accent} strokeWidth={1.2} />
      <path d="M -8 0 Q 17 40 -8 80" fill="none" stroke={accent} strokeWidth={1.2} />
      <text x={28} y={45} textAnchor="middle" fill={accent} fontSize={11} fontFamily="monospace">XOR</text>
    </g>
    {/* AND */}
    <g transform="translate(140,130)">
      <path d="M 0 0 L 30 0 Q 60 0 60 30 Q 60 60 30 60 L 0 60 Z"
            fill="#0B0D11" stroke={accent} strokeWidth={1.2} />
      <text x={28} y={36} textAnchor="middle" fill={accent} fontSize={11} fontFamily="monospace">AND</text>
    </g>

    {/* Outputs */}
    <line x1={200} y1={80} x2={420} y2={80} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={200} y1={160} x2={420} y2={160} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={428} y={84} fill="#cbd5e1" fontSize={13} fontFamily="monospace">sum</text>
    <text x={428} y={164} fill="#cbd5e1" fontSize={13} fontFamily="monospace">carry</text>

    {/* Equations */}
    <text x={300} y={64} fill={`${accent}cc`} fontSize={11} fontFamily="monospace">= a ^ b</text>
    <text x={300} y={144} fill={`${accent}cc`} fontSize={11} fontFamily="monospace">= a &amp; b</text>
  </svg>
);

// ── 5. Module black-box ──────────────────────────────────────────────────────
export const ModuleBox: React.FC<Props & { name?: string; inputs?: string[]; outputs?: string[] }> = ({
  accent, name = 'full_adder', inputs = ['a', 'b', 'cin'], outputs = ['sum', 'cout'],
}) => {
  const W = 220, H = Math.max(inputs.length, outputs.length) * 36 + 40;
  return (
    <svg viewBox={`0 0 ${W + 200} ${H + 20}`} className="w-full max-w-xl">
      {/* Box */}
      <rect x={100} y={10} width={W} height={H} rx={6}
            fill="#0B0D11" stroke={accent} strokeWidth={1.2} />
      <text x={100 + W / 2} y={H / 2 + 14} textAnchor="middle"
            fill="#E5E7EB" fontSize={14} fontWeight={700} fontFamily="monospace">
        {name}
      </text>

      {/* Inputs (left) */}
      {inputs.map((p, i) => {
        const y = 30 + i * 36;
        return (
          <g key={p}>
            <line x1={20} y1={y} x2={100} y2={y} stroke="#94a3b8" strokeWidth={1.2} />
            <circle cx={100} cy={y} r={3} fill={accent} />
            <text x={14} y={y + 4} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">
              {p}
            </text>
          </g>
        );
      })}

      {/* Outputs (right) */}
      {outputs.map((p, i) => {
        const y = 30 + i * 36;
        return (
          <g key={p}>
            <line x1={100 + W} y1={y} x2={100 + W + 80} y2={y} stroke="#94a3b8" strokeWidth={1.2} />
            <circle cx={100 + W} cy={y} r={3} fill={accent} />
            <text x={100 + W + 86} y={y + 4} fill="#cbd5e1" fontSize={12} fontFamily="monospace">
              {p}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── 6. Module hierarchy tree ─────────────────────────────────────────────────
export const HierarchyTree: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 720 280" className="w-full max-w-3xl">
    {/* Root */}
    <rect x={290} y={20} width={140} height={36} rx={6} fill="#0B0D11" stroke={accent} strokeWidth={1.2} />
    <text x={360} y={43} textAnchor="middle" fill="#E5E7EB" fontSize={12} fontWeight={600} fontFamily="monospace">
      ripple_adder_4
    </text>

    {/* Connectors to FA0..FA3 */}
    {[100, 280, 460, 560].map((x, i) => (
      <g key={i}>
        <line x1={360} y1={56} x2={x + 70} y2={130} stroke={accent} strokeOpacity={0.5} strokeWidth={1} />
        <rect x={x} y={130} width={140} height={36} rx={6} fill="#0B0D11" stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
        <text x={x + 70} y={153} textAnchor="middle" fill="#cbd5e1" fontSize={11} fontFamily="monospace">
          full_adder fa{i}
        </text>
        {/* Children of each FA */}
        {[0, 1].map(c => (
          <g key={c}>
            <line x1={x + 70} y1={166} x2={x + 25 + c * 90} y2={220}
                  stroke={accent} strokeOpacity={0.3} strokeWidth={1} />
            <rect x={x - 5 + c * 90} y={220} width={90} height={28} rx={4}
                  fill="#0B0D11" stroke={accent} strokeOpacity={0.4} strokeWidth={1} />
            <text x={x + 40 + c * 90} y={238} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">
              half_adder
            </text>
          </g>
        ))}
      </g>
    ))}
  </svg>
);

// ── 7. Clock waveform with sampling ──────────────────────────────────────────
export const ClockWaveform: React.FC<Props> = ({ accent }) => {
  // Square wave clock + data + sampled output
  const cycle = 80;
  const cycles = 5;
  const baseY = 60;
  const dataY = 130;
  const qY = 200;

  const clkPath = (() => {
    let p = `M 40 ${baseY + 30}`;
    for (let i = 0; i < cycles; i++) {
      const x = 40 + i * cycle;
      p += ` L ${x} ${baseY} L ${x + cycle / 2} ${baseY} L ${x + cycle / 2} ${baseY + 30} L ${x + cycle} ${baseY + 30}`;
    }
    return p;
  })();

  // Sample d on rising edges → q follows after 1 cycle
  const dStates = [0, 1, 1, 0, 1, 0]; // d at start of each half-cycle
  const dPath = (() => {
    let p = `M 40 ${dataY + (dStates[0] ? 0 : 30)}`;
    for (let i = 0; i < cycles; i++) {
      const x = 40 + i * cycle;
      const ny = dataY + (dStates[i + 1] ? 0 : 30);
      p += ` L ${x + cycle} ${dataY + (dStates[i] ? 0 : 30)} L ${x + cycle} ${ny}`;
    }
    return p;
  })();

  const qPath = (() => {
    // q updates at posedge (start of each cycle) with previous d value
    let p = `M 40 ${qY + 30}`;
    for (let i = 0; i < cycles; i++) {
      const x = 40 + i * cycle;
      const ny = qY + (dStates[i] ? 0 : 30);
      p += ` L ${x} ${qY + (i === 0 ? 30 : (dStates[i - 1] ? 0 : 30))} L ${x} ${ny} L ${x + cycle} ${ny}`;
    }
    return p;
  })();

  return (
    <svg viewBox="0 0 480 250" className="w-full max-w-2xl">
      <text x={6} y={baseY + 18} fill="#94a3b8" fontSize={12} fontFamily="monospace">clk</text>
      <text x={6} y={dataY + 18} fill="#94a3b8" fontSize={12} fontFamily="monospace">d</text>
      <text x={6} y={qY + 18} fill="#94a3b8" fontSize={12} fontFamily="monospace">q</text>

      <path d={clkPath} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
      <path d={dPath} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
      <path d={qPath} fill="none" stroke={accent} strokeWidth={2} />

      {/* Mark posedge */}
      {[1, 2, 3, 4].map(i => (
        <line key={i} x1={40 + i * cycle} y1={baseY - 6} x2={40 + i * cycle} y2={qY + 36}
              stroke={accent} strokeOpacity={0.25} strokeWidth={0.8} strokeDasharray="2 4" />
      ))}
      <text x={40 + cycle - 4} y={baseY - 12} fill={accent} fontSize={9} fontFamily="monospace">↑ posedge clk</text>
    </svg>
  );
};

// ── 8. 2:1 Mux symbol + truth table ──────────────────────────────────────────
export const MuxDiagram: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 520 200" className="w-full max-w-2xl">
    {/* Symbol */}
    <polygon points="120,30 220,60 220,140 120,170" fill="#0B0D11" stroke={accent} strokeWidth={1.2} />
    <text x={170} y={108} textAnchor="middle" fill={accent} fontSize={12} fontFamily="monospace">2:1 MUX</text>
    <line x1={40} y1={60} x2={120} y2={60} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={40} y1={140} x2={120} y2={140} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={170} y1={170} x2={170} y2={195} stroke="#94a3b8" strokeWidth={1.2} />
    <line x1={220} y1={100} x2={300} y2={100} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={32} y={64} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">a</text>
    <text x={32} y={144} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">b</text>
    <text x={170} y={195 + 12} textAnchor="middle" fill="#cbd5e1" fontSize={12} fontFamily="monospace">sel</text>
    <text x={306} y={104} fill="#cbd5e1" fontSize={12} fontFamily="monospace">y</text>

    {/* Truth table */}
    <g transform="translate(340,30)">
      <rect width={160} height={140} rx={6} fill="#0B0D11" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      <text x={80} y={20} textAnchor="middle" fill={accent} fontSize={11} fontFamily="monospace">truth table</text>
      <line x1={0} y1={28} x2={160} y2={28} stroke="rgba(255,255,255,0.1)" />
      {[
        ['sel', 'y'],
        ['0', 'b'],
        ['1', 'a'],
      ].map((row, i) => (
        <g key={i}>
          <text x={50} y={50 + i * 30} textAnchor="middle"
                fill={i === 0 ? '#94a3b8' : '#E5E7EB'} fontSize={12} fontFamily="monospace">
            {row[0]}
          </text>
          <text x={120} y={50 + i * 30} textAnchor="middle"
                fill={i === 0 ? '#94a3b8' : '#E5E7EB'} fontSize={12} fontFamily="monospace">
            {row[1]}
          </text>
          {i === 0 && <line x1={0} y1={62} x2={160} y2={62} stroke="rgba(255,255,255,0.06)" />}
          <line x1={80} y1={32} x2={80} y2={130} stroke="rgba(255,255,255,0.08)" />
        </g>
      ))}
    </g>
  </svg>
);

// ── 9. Testbench block diagram (TB drives DUT, observes) ─────────────────────
export const TestbenchDiagram: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 600 220" className="w-full max-w-2xl">
    {/* TB box */}
    <rect x={20} y={50} width={180} height={120} rx={8} fill="#0B0D11"
          stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="4 3" />
    <text x={110} y={42} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">TESTBENCH</text>
    <text x={110} y={110} textAnchor="middle" fill="#cbd5e1" fontSize={13} fontWeight={600}>tb_half_adder</text>
    <text x={110} y={132} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">initial / $monitor</text>

    {/* DUT box */}
    <rect x={380} y={50} width={180} height={120} rx={8} fill="#0B0D11"
          stroke={accent} strokeWidth={1.2} />
    <text x={470} y={42} textAnchor="middle" fill={accent} fontSize={11} fontFamily="monospace">DUT</text>
    <text x={470} y={110} textAnchor="middle" fill="#cbd5e1" fontSize={13} fontWeight={600}>half_adder</text>
    <text x={470} y={132} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">synthesisable</text>

    {/* Stimulus arrow */}
    <line x1={200} y1={90} x2={380} y2={90} stroke={accent} strokeWidth={1.5} />
    <polygon points="380,90 372,86 372,94" fill={accent} />
    <text x={290} y={82} textAnchor="middle" fill={accent} fontSize={11} fontFamily="monospace">stimulus (a, b)</text>

    {/* Response arrow */}
    <line x1={380} y1={140} x2={200} y2={140} stroke="#94a3b8" strokeWidth={1.5} />
    <polygon points="200,140 208,136 208,144" fill="#94a3b8" />
    <text x={290} y={158} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">response (sum, carry)</text>
  </svg>
);

// ── 10. Synthesis pipeline ───────────────────────────────────────────────────
export const SynthesisFlow: React.FC<Props> = ({ accent }) => {
  const stages = [
    { label: 'RTL', sub: 'always / assign' },
    { label: 'Optimize', sub: 'boolean min.' },
    { label: 'Map', sub: 'cell library' },
    { label: 'Netlist', sub: 'gates + nets' },
    { label: 'P&R', sub: 'silicon' },
  ];
  const W = 130, GAP = 12;
  return (
    <svg viewBox={`0 0 ${stages.length * (W + GAP) + 20} 130`} className="w-full max-w-3xl">
      {stages.map((s, i) => {
        const x = 10 + i * (W + GAP);
        return (
          <g key={i}>
            <rect x={x} y={30} width={W} height={70} rx={6}
                  fill="#0B0D11" stroke={accent} strokeOpacity={0.5 + i * 0.1} strokeWidth={1.2} />
            <text x={x + W / 2} y={62} textAnchor="middle" fill="#E5E7EB" fontSize={13} fontWeight={600}>
              {s.label}
            </text>
            <text x={x + W / 2} y={82} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">
              {s.sub}
            </text>
            {i < stages.length - 1 && (
              <g>
                <line x1={x + W} y1={65} x2={x + W + GAP} y2={65}
                      stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
                <polygon points={`${x + W + GAP},65 ${x + W + GAP - 6},62 ${x + W + GAP - 6},68`} fill={accent} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── 11. Sim-vs-real waveform comparison ──────────────────────────────────────
export const SimVsRealWave: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 600 220" className="w-full max-w-2xl">
    <text x={20} y={20} fill="#94a3b8" fontSize={11} fontFamily="monospace">SIMULATION  ·  ideal</text>
    {/* Clean square wave */}
    <path d="M 20 70 L 80 70 L 80 40 L 160 40 L 160 70 L 240 70 L 240 40 L 320 40 L 320 70 L 400 70"
          fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
    <line x1={20} y1={90} x2={400} y2={90} stroke="#475569" strokeWidth={0.5} />

    <text x={20} y={130} fill={accent} fontSize={11} fontFamily="monospace">SILICON  ·  reality</text>
    {/* Noisy signal with glitches */}
    <path d="M 20 180 L 78 180 Q 80 178 82 180 L 82 152 Q 84 150 86 152 Q 90 148 92 152 L 158 152 Q 160 154 162 152 Q 164 156 168 152 L 168 180 Q 170 178 172 180 L 238 180 L 240 152 Q 242 154 244 152 L 318 152 Q 320 156 322 152 L 322 180 L 400 180"
          fill="none" stroke={accent} strokeWidth={1.5} />
    {/* glitch marker */}
    <circle cx={245} cy={166} r={10} fill="none" stroke={accent} strokeOpacity={0.8} strokeWidth={1} strokeDasharray="2 2" />
    <text x={258} y={170} fill={`${accent}cc`} fontSize={10} fontFamily="monospace">glitch</text>
    <line x1={20} y1={200} x2={400} y2={200} stroke="#475569" strokeWidth={0.5} />

    <text x={420} y={70} fill="#94a3b8" fontSize={10} fontFamily="monospace">no glitches.</text>
    <text x={420} y={84} fill="#94a3b8" fontSize={10} fontFamily="monospace">no jitter.</text>
    <text x={420} y={98} fill="#94a3b8" fontSize={10} fontFamily="monospace">no metastability.</text>

    <text x={420} y={170} fill={`${accent}cc`} fontSize={10} fontFamily="monospace">all of the above.</text>
  </svg>
);

// ── 12. Tool flow (Verilog → iverilog → vvp → VCD → GTKWave) ─────────────────
export const ToolFlow: React.FC<Props> = ({ accent }) => {
  const tools = ['design.v', 'iverilog', 'vvp sim.out', 'dump.vcd', 'GTKWave'];
  return (
    <svg viewBox="0 0 760 110" className="w-full max-w-3xl">
      {tools.map((t, i) => {
        const x = 10 + i * 152;
        return (
          <g key={i}>
            <rect x={x} y={30} width={130} height={50} rx={6}
                  fill="#0B0D11" stroke={accent} strokeOpacity={0.55} strokeWidth={1} />
            <text x={x + 65} y={60} textAnchor="middle" fill="#cbd5e1" fontSize={12} fontFamily="monospace">
              {t}
            </text>
            {i < tools.length - 1 && (
              <g>
                <line x1={x + 130} y1={55} x2={x + 152} y2={55}
                      stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
                <polygon points={`${x + 152},55 ${x + 146},52 ${x + 146},58`} fill={accent} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── 13. Concurrent always blocks visual ──────────────────────────────────────
export const ConcurrentBlocks: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 600 200" className="w-full max-w-2xl">
    <text x={10} y={20} fill="#94a3b8" fontSize={11} fontFamily="monospace">all three fire on the same posedge clk</text>
    {[
      { label: 'always block A', sub: 'counter <= counter+1' },
      { label: 'always block B', sub: 'led     <= ~led' },
      { label: 'always block C', sub: 'state   <= next_state' },
    ].map((b, i) => (
      <g key={i}>
        <rect x={20} y={40 + i * 50} width={400} height={36} rx={6}
              fill="#0B0D11" stroke={accent} strokeOpacity={0.55} strokeWidth={1} />
        <text x={36} y={62 + i * 50} fill="#E5E7EB" fontSize={12} fontWeight={600}>
          {b.label}
        </text>
        <text x={200} y={62 + i * 50} fill="#94a3b8" fontSize={11} fontFamily="monospace">
          {b.sub}
        </text>
        {/* arrow from clk */}
        <line x1={500} y1={58 + i * 50} x2={420} y2={58 + i * 50} stroke={accent} strokeWidth={1.2} />
        <polygon points={`${420},${58 + i * 50} ${426},${55 + i * 50} ${426},${61 + i * 50}`} fill={accent} />
      </g>
    ))}
    {/* Clock line */}
    <line x1={500} y1={50} x2={500} y2={180} stroke={accent} strokeWidth={1.2} />
    <text x={510} y={120} fill={accent} fontSize={12} fontWeight={700} fontFamily="monospace">clk</text>
    <text x={510} y={138} fill={`${accent}99`} fontSize={9} fontFamily="monospace">↑ rising edge</text>
  </svg>
);

// ── 15. Clock anatomy — period, frequency, duty cycle, edges ─────────────────
export const ClockAnatomy: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 600 240" className="w-full max-w-2xl">
    {/* Clock waveform: 3 cycles */}
    <text x={10} y={68} fill="#94a3b8" fontSize={12} fontFamily="monospace">clk</text>
    <path
      d="M 50 80 L 50 50 L 110 50 L 110 110 L 170 110 L 170 50 L 230 50 L 230 110 L 290 110 L 290 50 L 350 50 L 350 110 L 410 110 L 410 50 L 470 50 L 470 110 L 530 110"
      fill="none" stroke={accent} strokeWidth={2} />

    {/* Voltage axis */}
    <line x1={45} y1={40} x2={45} y2={120} stroke="#475569" strokeWidth={0.5} />
    <text x={30} y={54} textAnchor="end" fill="#64748b" fontSize={10} fontFamily="monospace">1</text>
    <text x={30} y={114} textAnchor="end" fill="#64748b" fontSize={10} fontFamily="monospace">0</text>

    {/* Period bracket */}
    <line x1={110} y1={140} x2={230} y2={140} stroke={accent} strokeOpacity={0.7} strokeWidth={1} />
    <line x1={110} y1={135} x2={110} y2={145} stroke={accent} strokeOpacity={0.7} strokeWidth={1} />
    <line x1={230} y1={135} x2={230} y2={145} stroke={accent} strokeOpacity={0.7} strokeWidth={1} />
    <text x={170} y={158} textAnchor="middle" fill={accent} fontSize={11} fontFamily="monospace">period T</text>

    {/* Duty cycle (high time) */}
    <line x1={110} y1={32} x2={170} y2={32} stroke="#cbd5e1" strokeOpacity={0.7} strokeWidth={1} />
    <line x1={110} y1={28} x2={110} y2={36} stroke="#cbd5e1" strokeOpacity={0.7} strokeWidth={1} />
    <line x1={170} y1={28} x2={170} y2={36} stroke="#cbd5e1" strokeOpacity={0.7} strokeWidth={1} />
    <text x={140} y={22} textAnchor="middle" fill="#cbd5e1" fontSize={10} fontFamily="monospace">t_high</text>

    {/* Rising / falling edge markers */}
    <circle cx={110} cy={80} r={4} fill={accent} />
    <text x={102} y={186} fill={accent} fontSize={10} fontFamily="monospace">↑ rising</text>
    <circle cx={170} cy={80} r={4} fill="none" stroke={accent} strokeWidth={1.2} />
    <text x={162} y={186} fill="#94a3b8" fontSize={10} fontFamily="monospace">↓ falling</text>

    {/* Formulas */}
    <text x={50} y={210} fill="#cbd5e1" fontSize={12} fontFamily="monospace">
      f = 1 / T
    </text>
    <text x={50} y={228} fill="#94a3b8" fontSize={11} fontFamily="monospace">
      duty = t_high / T
    </text>
    <text x={300} y={210} fill="#cbd5e1" fontSize={12} fontFamily="monospace">
      e.g. T = 10 ns
    </text>
    <text x={300} y={228} fill="#94a3b8" fontSize={11} fontFamily="monospace">
      → f = 100 MHz, duty = 50%
    </text>
  </svg>
);

// ── 16. Level-triggered (latch) vs edge-triggered (flip-flop) waveforms ──────
export const LevelVsEdge: React.FC<Props> = ({ accent }) => {
  // Single shared clock/enable
  const enPath = "M 60 60 L 60 30 L 160 30 L 160 60 L 260 60 L 260 30 L 360 30 L 360 60 L 460 60";
  // Data signal toggling continuously
  const dPath = "M 60 110 L 100 110 L 100 80 L 180 80 L 180 110 L 240 110 L 240 80 L 320 80 L 320 110 L 380 110 L 380 80 L 460 80";

  // LATCH: q follows d while enable is HIGH (transparent), holds otherwise
  // Enable high windows: 60-160, 260-360
  const qLatchPath = "M 60 170 L 60 200 L 100 200 L 100 170 L 160 170 L 160 200 L 260 200 L 260 170 L 320 170 L 320 200 L 360 200 L 360 170 L 460 170";

  // FLIPFLOP: q samples d only at rising edges of enable (60, 260)
  // At t=60, d=0 → q=0; at t=260, d=0 → q=0; (d toggles between but q only updates at rising edge)
  // Make it more visible: add a third rising edge if needed. With only 2 edges, q stays at d-value-at-edge.
  // Let q go: low (0..60), then sample d at 60. d at t=60 is just toggling - say 0. So q=0 from 60 to 260.
  // At t=260 d transitions: at exactly 260, d=0 (falling at 240). So q=0 from 260 to end.
  // To make it interesting, change the rising-edge sample at 260 to d=1.
  // Adjust dPath so at t=260, d is high.
  const dPath2 = "M 60 110 L 100 110 L 100 80 L 180 80 L 180 110 L 230 110 L 230 80 L 290 80 L 290 110 L 380 110 L 380 80 L 460 80";
  // d at t=60: low(110). At t=260: d high(80). So q-FF: 0 from 0..60, 0 from 60..260, 1 from 260..end.
  const qFFPath = "M 60 270 L 60 300 L 260 300 L 260 270 L 460 270";

  return (
    <svg viewBox="0 0 480 320" className="w-full max-w-2xl">
      <text x={6} y={48} fill="#94a3b8" fontSize={11} fontFamily="monospace">en/clk</text>
      <text x={6} y={98} fill="#94a3b8" fontSize={11} fontFamily="monospace">d</text>
      <text x={6} y={188} fill={accent} fontSize={11} fontFamily="monospace">q (latch)</text>
      <text x={6} y={288} fill={accent} fontSize={11} fontFamily="monospace">q (flop)</text>

      {/* Enable / clock */}
      <path d={enPath} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
      {/* Data */}
      <path d={dPath2} fill="none" stroke="#94a3b8" strokeWidth={1.5} />

      {/* Latch q */}
      <path d={qLatchPath} fill="none" stroke={accent} strokeWidth={2} />
      {/* Highlight transparent windows */}
      <rect x={60} y={155} width={100} height={50} fill={accent} fillOpacity={0.06} />
      <rect x={260} y={155} width={100} height={50} fill={accent} fillOpacity={0.06} />
      <text x={110} y={228} textAnchor="middle" fill={`${accent}aa`} fontSize={9} fontFamily="monospace">transparent</text>
      <text x={310} y={228} textAnchor="middle" fill={`${accent}aa`} fontSize={9} fontFamily="monospace">transparent</text>

      {/* FF q */}
      <path d={qFFPath} fill="none" stroke={accent} strokeWidth={2} />
      {/* Mark rising edges */}
      <line x1={60} y1={20} x2={60} y2={310} stroke={accent} strokeOpacity={0.2} strokeWidth={0.8} strokeDasharray="2 4" />
      <line x1={260} y1={20} x2={260} y2={310} stroke={accent} strokeOpacity={0.2} strokeWidth={0.8} strokeDasharray="2 4" />
      <circle cx={60} cy={270} r={3} fill={accent} />
      <circle cx={260} cy={270} r={3} fill={accent} />
    </svg>
  );
};

// ── 17. Posedge sampling — the always @(posedge clk) idiom ────────────────────
export const PosedgeSampling: React.FC<Props> = ({ accent }) => {
  const cycle = 100;
  // 4 cycles: low edges at 40, 140, 240, 340 (high)→ rising at 40, 140, 240, 340
  // Actually: clk: low 40-90, high 90-140, low 140-190, high 190-240, low 240-290, high 290-340
  // Rising edges at 90, 190, 290
  const clkPath = "M 40 80 L 90 80 L 90 50 L 140 50 L 140 80 L 190 80 L 190 50 L 240 50 L 240 80 L 290 80 L 290 50 L 340 50 L 340 80 L 390 80 L 390 50 L 440 50";
  // d: changes mid-cycle: 1 at first rising edge (90), 0 at second (190), 1 at third (290), 0 at fourth (390)
  const dPath = "M 40 130 L 70 130 L 70 100 L 170 100 L 170 130 L 270 130 L 270 100 L 370 100 L 370 130 L 440 130";
  // q: updates at each rising edge with d's value at that edge
  // At 90: d=1 → q=1; at 190: d=0 → q=0; at 290: d=1 → q=1; at 390: d=0 → q=0
  const qPath = "M 40 200 L 90 200 L 90 170 L 190 170 L 190 200 L 290 200 L 290 170 L 390 170 L 390 200 L 440 200";

  return (
    <svg viewBox="0 0 480 250" className="w-full max-w-2xl">
      <text x={6} y={68} fill="#94a3b8" fontSize={12} fontFamily="monospace">clk</text>
      <text x={6} y={118} fill="#94a3b8" fontSize={12} fontFamily="monospace">d</text>
      <text x={6} y={188} fill={accent} fontSize={12} fontFamily="monospace">q</text>

      <path d={clkPath} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
      <path d={dPath} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
      <path d={qPath} fill="none" stroke={accent} strokeWidth={2} />

      {/* Rising edge markers */}
      {[90, 190, 290, 390].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={40} x2={x} y2={215} stroke={accent} strokeOpacity={0.25} strokeWidth={0.8} strokeDasharray="2 3" />
          <circle cx={x} cy={50} r={4} fill={accent} />
          <text x={x} y={235} textAnchor="middle" fill={`${accent}cc`} fontSize={9} fontFamily="monospace">posedge</text>
        </g>
      ))}
      <text x={120} y={32} fill={accent} fontSize={10} fontFamily="monospace">↑ q samples d at every rising edge</text>
    </svg>
  );
};

// ── 18. Flip-flop internal — master/slave latch pair ─────────────────────────
export const FlipFlopParts: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 640 260" className="w-full max-w-2xl">
    {/* External wrapper */}
    <rect x={20} y={60} width={600} height={140} rx={10}
          fill="none" stroke={accent} strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="6 4" />
    <text x={20} y={50} fill={accent} fontSize={11} fontFamily="monospace">D Flip-Flop (rising-edge)</text>

    {/* D input */}
    <line x1={0} y1={130} x2={120} y2={130} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={6} y={124} fill="#cbd5e1" fontSize={12} fontFamily="monospace">D</text>

    {/* Master latch */}
    <rect x={120} y={100} width={140} height={60} rx={6}
          fill="#0B0D11" stroke={accent} strokeOpacity={0.6} strokeWidth={1.2} />
    <text x={190} y={132} textAnchor="middle" fill="#E5E7EB" fontSize={12} fontWeight={600}>master</text>
    <text x={190} y={148} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">latch (clk low)</text>

    {/* Inter-stage wire */}
    <line x1={260} y1={130} x2={340} y2={130} stroke="#94a3b8" strokeWidth={1.2} />

    {/* Slave latch */}
    <rect x={340} y={100} width={140} height={60} rx={6}
          fill="#0B0D11" stroke={accent} strokeOpacity={0.6} strokeWidth={1.2} />
    <text x={410} y={132} textAnchor="middle" fill="#E5E7EB" fontSize={12} fontWeight={600}>slave</text>
    <text x={410} y={148} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">latch (clk high)</text>

    {/* Q output */}
    <line x1={480} y1={130} x2={620} y2={130} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={606} y={124} fill="#cbd5e1" fontSize={12} fontFamily="monospace">Q</text>

    {/* Clock to master (inverted) */}
    <line x1={190} y1={210} x2={190} y2={170} stroke={accent} strokeWidth={1.2} />
    <circle cx={190} cy={166} r={4} fill="none" stroke={accent} strokeWidth={1.2} />
    {/* Clock to slave (direct) */}
    <line x1={410} y1={210} x2={410} y2={160} stroke={accent} strokeWidth={1.2} />

    {/* Clock bus */}
    <line x1={20} y1={220} x2={500} y2={220} stroke={accent} strokeWidth={1.5} />
    <text x={6} y={224} fill="#cbd5e1" fontSize={12} fontFamily="monospace">clk</text>
    <text x={510} y={224} fill={`${accent}aa`} fontSize={10} fontFamily="monospace">⚪ = inverted</text>
  </svg>
);

// ── 19. Flip-flop with reset / preset / clear control inputs ─────────────────
export const FlipFlopControls: React.FC<Props> = ({ accent }) => (
  <svg viewBox="0 0 600 280" className="w-full max-w-2xl">
    {/* FF body */}
    <rect x={180} y={60} width={220} height={160} rx={8}
          fill="#0B0D11" stroke={accent} strokeWidth={1.5} />
    <text x={290} y={144} textAnchor="middle" fill="#E5E7EB" fontSize={14} fontWeight={700} fontFamily="monospace">D-FF</text>

    {/* D input */}
    <line x1={60} y1={100} x2={180} y2={100} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={50} y={104} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">D</text>
    <text x={66} y={92} fill="#64748b" fontSize={9} fontFamily="monospace">data</text>

    {/* CLK */}
    <line x1={60} y1={180} x2={180} y2={180} stroke="#94a3b8" strokeWidth={1.2} />
    <polyline points="180,178 184,180 180,182" fill="none" stroke="#94a3b8" strokeWidth={1.2} />
    <text x={50} y={184} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">CLK</text>
    <text x={66} y={172} fill="#64748b" fontSize={9} fontFamily="monospace">edge</text>

    {/* PRESET (top, asynchronous, sets Q=1) */}
    <line x1={290} y1={20} x2={290} y2={60} stroke={accent} strokeWidth={1.2} />
    <text x={296} y={28} fill={accent} fontSize={12} fontFamily="monospace">PRE</text>
    <text x={296} y={44} fill={`${accent}aa`} fontSize={9} fontFamily="monospace">async → Q=1</text>

    {/* CLEAR / RESET (bottom, asynchronous, sets Q=0) */}
    <line x1={290} y1={220} x2={290} y2={260} stroke={accent} strokeWidth={1.2} />
    <text x={296} y={252} fill={accent} fontSize={12} fontFamily="monospace">CLR</text>
    <text x={296} y={268} fill={`${accent}aa`} fontSize={9} fontFamily="monospace">async → Q=0</text>

    {/* Q output */}
    <line x1={400} y1={100} x2={540} y2={100} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={550} y={104} fill="#cbd5e1" fontSize={12} fontFamily="monospace">Q</text>

    {/* Q-bar output */}
    <line x1={400} y1={180} x2={540} y2={180} stroke="#94a3b8" strokeWidth={1.2} />
    <text x={550} y={184} fill="#cbd5e1" fontSize={12} fontFamily="monospace">Q̅</text>

    {/* Truth-style legend */}
    <text x={60} y={250} fill="#94a3b8" fontSize={10} fontFamily="monospace">priority:</text>
    <text x={60} y={266} fill="#cbd5e1" fontSize={11} fontFamily="monospace">CLR &gt; PRE &gt; CLK ↑</text>
  </svg>
);

// ── 14. Mental model: Verilog → gates → silicon stack ────────────────────────
export const MentalStack: React.FC<Props> = ({ accent }) => {
  const layers = [
    { label: 'Verilog source', sub: 'what you type' },
    { label: 'Gate netlist', sub: 'what it becomes' },
    { label: 'Standard cells', sub: 'physical layout' },
    { label: 'Silicon', sub: 'atoms' },
  ];
  return (
    <svg viewBox="0 0 600 280" className="w-full max-w-2xl">
      {layers.map((l, i) => {
        const y = 20 + i * 64;
        return (
          <g key={i}>
            <rect x={120} y={y} width={360} height={48} rx={6}
                  fill="#0B0D11" stroke={accent} strokeOpacity={0.4 + i * 0.15} strokeWidth={1.2} />
            <text x={140} y={y + 30} fill="#E5E7EB" fontSize={13} fontWeight={600}>
              {l.label}
            </text>
            <text x={470} y={y + 30} textAnchor="end" fill="#94a3b8" fontSize={11} fontFamily="monospace">
              {l.sub}
            </text>
            {i < layers.length - 1 && (
              <g>
                <line x1={300} y1={y + 48} x2={300} y2={y + 64} stroke={accent} strokeOpacity={0.5} strokeWidth={1} />
                <polygon points={`300,${y + 64} 296,${y + 58} 304,${y + 58}`} fill={accent} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
