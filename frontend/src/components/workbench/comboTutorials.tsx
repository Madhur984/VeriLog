import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, RotateCcw, Compass, ToggleLeft, Cpu, Lightbulb,
  Cable, FlaskConical, Trophy, ChevronUp, ChevronDown, ChevronRight,
} from 'lucide-react';

/**
 * Data-driven guided-build rail for the combinational building blocks
 * (dsd 21-27). One engine (GuidedBuildRail) + a config per circuit, instead of
 * seven near-identical copies. Same shape/behaviour as the adder/subtractor
 * tutorials: a step accordion, a truth-table proof checklist on the last step,
 * progress + completion. Each rail floats over the live CircuitVerse iframe.
 */

const EMERALD = '#34d399';
const STEP_ICONS = [Compass, ToggleLeft, Cpu, Lightbulb, Cable, FlaskConical];

export interface BuildStep { title: string; why: string; subs: string[] }
export interface BuildConfig {
  accent: string;
  title: string;            // e.g. "4-to-1 Multiplexer"
  storeKey: string;
  blurb: string;
  steps: BuildStep[];
  proof: { columns: string[]; rows: (number | string)[][]; note?: string }; // last cols are outputs
  completionRoute: string;
  completionTitle: string;
  completionBody: string;
}

interface Saved { step: number; checks: boolean[] }

const GuidedBuildRail: React.FC<{ config: BuildConfig; onClose: () => void; onMinimize?: () => void }>
  = ({ config, onClose, onMinimize }) => {
  const navigate = useNavigate();
  const { accent, title, storeKey, blurb, steps, proof, completionRoute, completionTitle, completionBody } = config;
  const nRows = proof.rows.length;

  const load = (): Saved => {
    try {
      const raw = JSON.parse(localStorage.getItem(storeKey) || 'null');
      if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === nRows) return raw;
    } catch { /* ignore */ }
    return { step: 0, checks: Array(nRows).fill(false) };
  };

  const [{ step, checks }, setState] = useState<Saved>(load);
  const [expanded, setExpanded] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true);

  useEffect(() => {
    try { localStorage.setItem(storeKey, JSON.stringify({ step, checks })); } catch { /* ignore */ }
  }, [step, checks, storeKey]);

  const setStep = (s: number) => setState((p) => ({ ...p, step: s }));
  const toggleCheck = (i: number) => setState((p) => ({ ...p, checks: p.checks.map((c, j) => (j === i ? !c : c)) }));
  const restart = () => setState({ step: 0, checks: Array(nRows).fill(false) });

  const allProven = checks.every(Boolean);
  const progress = allProven ? 100 : Math.round(((step + checks.filter(Boolean).length / nRows) / steps.length) * 100);
  const nOut = 1; // highlight last column as the proven output (visual only)

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-200 border-t-2 lg:border-t-0 lg:border-l-2" style={{ borderColor: accent }}>
      <button onClick={() => setExpanded((v) => !v)} className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/10 px-4 lg:hidden">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>
          Guided build · step {Math.min(step + 1, steps.length)} of {steps.length}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className={`${expanded ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col lg:flex`}>
        <div className="flex-shrink-0 border-b border-white/10 px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>Guided build · {title}</div>
              <div className="mt-1 text-[11px] text-slate-400">{blurb}</div>
            </div>
            <div className="flex flex-shrink-0 gap-1.5">
              {onMinimize && (
                <button onClick={onMinimize} title="Minimize" className="hidden rounded-lg border border-white/10 p-2 transition-colors hover:border-white/30 lg:block"><ChevronRight size={14} /></button>
              )}
              <button onClick={onClose} title="Close the tutorial" className="rounded-lg border border-white/10 p-2 transition-colors hover:border-white/30"><X size={14} /></button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} style={{ background: allProven ? EMERALD : accent }} />
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: allProven ? EMERALD : accent }}>
              {allProven ? 'DONE' : `${Math.min(step + 1, steps.length)}/${steps.length}`}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1;
            const done = i < step || (isLast && allProven);
            const active = i === step && !(isLast && allProven);
            const locked = i > step;
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <div key={s.title} className={`rounded-2xl border transition-all ${active ? 'border-amber-400/60' : done ? 'border-emerald-400/30 bg-emerald-500/[0.04]' : 'border-white/10 opacity-50'}`}
                style={active ? { borderColor: `${accent}99`, background: `${accent}10` } : undefined}>
                <button onClick={() => !locked && setStep(i)} disabled={locked} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black"
                    style={{ background: done ? EMERALD : active ? accent : 'rgba(255,255,255,0.1)', color: done || active ? '#000' : '#94a3b8' }}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`flex-1 text-sm font-bold ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-400'}`}>{s.title}</span>
                  <span style={{ color: done ? EMERALD : active ? accent : '#64748b' }}><Icon size={15} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="space-y-3 px-4 pb-4">
                        <ol className="space-y-2">
                          {s.subs.map((sub, j) => (
                            <li key={j} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300">
                              <span className="flex-shrink-0 pt-0.5 font-mono text-[10px] font-black" style={{ color: accent }}>{i + 1}.{j + 1}</span>{sub}
                            </li>
                          ))}
                        </ol>
                        <p className="border-l-2 pl-3 text-[11px] italic text-slate-500" style={{ borderColor: `${accent}66` }}>Why: {s.why}</p>
                        {isLast ? (
                          <div className="overflow-hidden rounded-xl border border-white/10">
                            <div className="grid bg-white/[0.04] py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500" style={{ gridTemplateColumns: `repeat(${proof.columns.length + 1}, minmax(0,1fr))` }}>
                              {proof.columns.map((c) => <span key={c}>{c}</span>)}<span></span>
                            </div>
                            {proof.rows.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)} className={`grid w-full items-center py-2 text-center font-mono text-sm transition-colors ${checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'}`}
                                style={{ gridTemplateColumns: `repeat(${proof.columns.length + 1}, minmax(0,1fr))` }}>
                                {r.map((cell, ci) => (
                                  <span key={ci} className={ci >= r.length - nOut ? 'font-bold' : ''} style={{ color: !checks[ri] && ci >= r.length - nOut ? accent : undefined }}>{cell}</span>
                                ))}
                                <span className="flex justify-center">{checks[ri] ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Circle size={15} className="text-slate-600" />}</span>
                              </button>
                            ))}
                            {proof.note && <div className="px-3 py-2 text-[11px] text-slate-500">{proof.note}</div>}
                          </div>
                        ) : (
                          <button onClick={() => setStep(i + 1)} className="w-full rounded-xl py-2.5 font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]" style={{ background: accent }}>
                            Mark step done · next
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <AnimatePresence>
            {allProven && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: `${EMERALD}66`, background: `${EMERALD}0d` }}>
                <Trophy size={26} className="mx-auto mb-2" style={{ color: EMERALD }} />
                <div className="font-black text-emerald-300">{completionTitle}</div>
                <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{completionBody}</p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate(completionRoute)} className="rounded-xl py-2.5 font-mono text-[11px] font-black uppercase tracking-widest text-black" style={{ background: EMERALD }}>Back to the module</button>
                  <button onClick={onClose} className="rounded-xl border border-white/15 py-2.5 font-mono text-[11px] font-black uppercase tracking-widest text-slate-300 hover:border-white/30">Free build - keep tinkering</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-shrink-0 border-t border-white/10 px-5 py-3">
          <button onClick={restart} className="flex items-center gap-2 font-mono text-[11px] text-slate-500 transition-colors hover:text-slate-300"><RotateCcw size={11} /> Restart tutorial</button>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── configs ─────────────────────────────── */

const benchStep: BuildStep = {
  title: 'Know your bench',
  why: 'Every lab starts with knowing where the parts live.',
  subs: [
    'The panel on the LEFT is the parts shelf, labeled Circuit Elements. Inputs, Outputs, Gates and a Decoders & Plexers drawer all live here.',
    'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
    'The RIGHT panel shows the properties of whatever you select (bit width, label, select-line count).',
    'Nothing you do here can break anything - experiment freely.',
  ],
};

const CONFIGS: Record<string, BuildConfig> = {
  'mux-4to1': {
    accent: '#22d3ee', title: '4-to-1 Multiplexer', storeKey: 'bfb_wb_mux4_tutorial',
    blurb: 'Route one of four inputs to a single output with two select lines.',
    steps: [
      benchStep,
      { title: 'Place the data inputs', why: 'These are the four trains waiting on parallel tracks.', subs: ['Open the Input drawer and drop FOUR Input switches, stacked. Label them D0, D1, D2, D3.', 'Set them to a memorable pattern, e.g. D0=0, D1=1, D2=0, D3=1, so you can see which one is routed.'] },
      { title: 'Place the select lines', why: 'The two-bit code the switch operator dials to pick a track.', subs: ['Drop TWO more Input switches below the data ones. Label them S1 (MSB) and S0 (LSB).', 'The binary value S1S0 is the index of the chosen input: 00->D0, 01->D1, 10->D2, 11->D3.'] },
      { title: 'Drop the Multiplexer', why: 'CircuitVerse ships a ready MUX; you set how many select lines it has.', subs: ['Open the Decoders & Plexers drawer and drag a Multiplexer onto the canvas.', 'Select it; in the right panel set its control/select size to 2 (so it has 4 data inputs).', 'Add one Output (the LED Y) on the right.'] },
      { title: 'Wire and prove it', why: 'A circuit is only real once every select code routes the right input.', subs: ['Wire D0..D3 to the four MUX data pins, S1,S0 to its two select pins, and the MUX output to Y.', 'Keep D = (0,1,0,1). Sweep the select code below and tick each row when Y matches D[sel].'] },
    ],
    proof: { columns: ['S1', 'S0', 'Y'], rows: [[0, 0, 0], [0, 1, 1], [1, 0, 0], [1, 1, 1]], note: 'With D0..D3 = 0,1,0,1, the output Y must equal the selected input every time.' },
    completionRoute: '/dsd/21', completionTitle: 'Certified: you built a 4-to-1 multiplexer.',
    completionBody: 'Every select code routed the correct input through to Y. Two select lines pick one of four - and the same idea cascades: seven 2-to-1 MUXes make an 8-to-1.',
  },
  'demux-1to4': {
    accent: '#a78bfa', title: '1-to-4 Demultiplexer', storeKey: 'bfb_wb_demux4_tutorial',
    blurb: 'Send one input to exactly one of four outputs chosen by the select code.',
    steps: [
      benchStep,
      { title: 'Place the data input + selects', why: 'One package (D) and the two-bit address that decides its destination.', subs: ['Drop ONE Input switch labeled D (the data to distribute).', 'Drop TWO Input switches labeled S1, S0 (the destination address).'] },
      { title: 'Drop the Demultiplexer', why: 'The inverse of a MUX: one input fans out to many lines.', subs: ['From Decoders & Plexers drag a Demultiplexer; set its select size to 2 (four outputs).', 'Drop FOUR Output LEDs labeled Y0..Y3.'] },
      { title: 'Wire and prove it', why: 'Only the addressed output may follow D; the rest stay 0.', subs: ['Wire D to the demux data pin, S1,S0 to its selects, and its four outputs to Y0..Y3.', 'Set D = 1, sweep the select, and tick each row when ONLY the addressed Y is 1.'] },
    ],
    proof: { columns: ['S1', 'S0', 'on'], rows: [[0, 0, 'Y0'], [0, 1, 'Y1'], [1, 0, 'Y2'], [1, 1, 'Y3']], note: 'With D=1, exactly one output is HIGH; the other three are 0.' },
    completionRoute: '/dsd/22', completionTitle: 'Certified: you built a 1-to-4 demultiplexer.',
    completionBody: 'One input, four destinations, one address. A decoder with its enable used as the data input is exactly this circuit.',
  },
  'decoder-2to4': {
    accent: '#34d399', title: '2-to-4 Decoder', storeKey: 'bfb_wb_dec24_tutorial',
    blurb: 'Light exactly one of four output lines for each 2-bit input code (one-hot).',
    steps: [
      benchStep,
      { title: 'Place the address inputs', why: 'The 2-bit code whose value picks which line lights.', subs: ['Drop TWO Input switches labeled A (MSB) and B (LSB).'] },
      { title: 'Drop the Decoder', why: 'n address bits produce 2^n one-hot outputs.', subs: ['From Decoders & Plexers drag a Decoder; with 2 inputs it has 4 outputs.', 'Drop FOUR Output LEDs labeled D0..D3.'] },
      { title: 'Wire and prove it', why: 'Each output is a minterm; exactly one is HIGH at a time.', subs: ['Wire A,B to the decoder, and its outputs to D0..D3.', 'Sweep AB and tick each row when the matching one-hot output lights (D0=A\'B\', D3=A.B).'] },
    ],
    proof: { columns: ['A', 'B', 'on'], rows: [[0, 0, 'D0'], [0, 1, 'D1'], [1, 0, 'D2'], [1, 1, 'D3']], note: 'Each row turns on exactly one output - the minterm of the input code.' },
    completionRoute: '/dsd/23', completionTitle: 'Certified: you built a 2-to-4 decoder.',
    completionBody: 'One-hot, every time. Add an OR gate across the minterms you need and a decoder becomes a universal SOP function generator.',
  },
  'encoder-4to2': {
    accent: '#f59e0b', title: '4-to-2 Priority Encoder', storeKey: 'bfb_wb_enc42_tutorial',
    blurb: 'Output the binary code of the highest active input, with a valid bit.',
    steps: [
      benchStep,
      { title: 'Place the input lines', why: 'The candidate lines of the voting booth - only the highest active one wins.', subs: ['Drop FOUR Input switches labeled D0..D3.'] },
      { title: 'Drop the Priority Encoder', why: 'A plain encoder breaks if two lines are high; priority ranks them.', subs: ['From Decoders & Plexers drag a Priority Encoder (4 inputs -> 2-bit output + an enable/valid).', 'Drop output LEDs A1, A0 and a valid LED V.'] },
      { title: 'Wire and prove it', why: 'The output is the index of the highest HIGH input; V flags whether any input is active.', subs: ['Wire D0..D3 in, A1,A0 and V out.', 'Raise one line at a time and tick each row when the code matches; also try two at once and watch the higher win.'] },
    ],
    proof: { columns: ['highest', 'A1', 'A0'], rows: [['D0', 0, 0], ['D1', 0, 1], ['D2', 1, 0], ['D3', 1, 1]], note: 'A1 = D3 + D2, A0 = D3 + D1.D2\'. With nothing pressed, V = 0 and the code is meaningless.' },
    completionRoute: '/dsd/24', completionTitle: 'Certified: you built a 4-to-2 priority encoder.',
    completionBody: 'The highest active line always wins, and the valid bit tells you when the answer means anything. That is how interrupt controllers pick which request to serve first.',
  },
  'binary-to-gray': {
    accent: '#38bdf8', title: 'Binary-to-Gray Converter', storeKey: 'bfb_wb_b2g_tutorial',
    blurb: 'Convert a 4-bit binary number to Gray code with a chain of XOR gates.',
    steps: [
      benchStep,
      { title: 'Place the binary inputs', why: 'The four bits we will re-encode so only one bit changes per step.', subs: ['Drop FOUR Input switches labeled b3 (MSB) .. b0 (LSB).'] },
      { title: 'Place three XOR gates', why: 'Gray bit g_i = b_i XOR b_{i+1}; the MSB passes straight through.', subs: ['From the Gates drawer drag THREE 2-input XOR gates.', 'Drop FOUR Output LEDs g3..g0.'] },
      { title: 'Wire and prove it', why: 'The XOR chain is the whole converter; g3 = b3 with no gate at all.', subs: ['Wire b3 straight to g3. Wire b3^b2 -> g2, b2^b1 -> g1, b1^b0 -> g0.', 'Set a few binary values and tick each row when the Gray output matches.'] },
    ],
    proof: { columns: ['binary', 'gray'], rows: [['0000', '0000'], ['0011', '0010'], ['0111', '0100'], ['1000', '1100'], ['1111', '1000']], note: 'g3=b3, g2=b3^b2, g1=b2^b1, g0=b1^b0. Notice Gray changes one bit between consecutive numbers.' },
    completionRoute: '/dsd/25', completionTitle: 'Certified: you built a binary-to-Gray converter.',
    completionBody: 'A handful of XOR gates rewrites any number into a glitch-free, single-bit-change code - exactly what rotary encoders and K-map axes rely on.',
  },
  'nand-universal': {
    accent: '#fb7185', title: 'Build Everything From NAND', storeKey: 'bfb_wb_nand_tutorial',
    blurb: 'Prove the NAND gate is universal by building NOT, AND and OR from it alone.',
    steps: [
      benchStep,
      { title: 'Place two inputs', why: 'a and b feed every gate we are about to forge from NAND.', subs: ['Drop TWO Input switches labeled a and b.', 'From the Gates drawer you will use ONLY NAND gates from here on.'] },
      { title: 'Build NOT and AND', why: 'NAND with tied inputs inverts; invert a NAND and you get AND.', subs: ['NOT a: one NAND with BOTH inputs tied to a -> output is a\'.', 'a AND b: one NAND(a,b) feeding a second NAND used as an inverter -> (a.b).'] },
      { title: 'Build OR and prove it', why: 'By De Morgan, OR is a NAND of the inverted inputs.', subs: ['a OR b: NAND(a\' , b\') where a\' = NAND(a,a) and b\' = NAND(b,b).', 'Add Output LEDs for NOT, AND, OR and tick each row when all three match the textbook truth table.'] },
    ],
    proof: { columns: ['a', 'b', 'NOTa', 'AND', 'OR'], rows: [[0, 0, 1, 0, 0], [0, 1, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 0, 1, 1]], note: 'Every gate here is built from NAND only - that is what "functionally complete" means.' },
    completionRoute: '/dsd/26', completionTitle: 'Certified: NAND really is the Swiss Army knife.',
    completionBody: 'NOT, AND and OR all fell out of a single gate type - so any logic at all can be built from NAND alone. That is why whole chips are manufactured as a sea of identical NAND cells.',
  },
  'array-divider-cell': {
    accent: '#c084fc', title: 'The Divider Cell (Controlled Subtractor)', storeKey: 'bfb_wb_divcell_tutorial',
    blurb: 'Build the one cell a restoring array divider is tiled from.',
    steps: [
      benchStep,
      { title: 'Place the cell inputs', why: 'Each divider cell trial-subtracts the divisor bit from the running remainder bit.', subs: ['Drop Input switches: M (minuend / remainder bit), S (subtrahend / divisor bit), Bin (borrow-in).'] },
      { title: 'Build the full subtractor', why: 'Difference D = M ^ S ^ Bin; Borrow Bout = M\'.S + M\'.Bin + S.Bin.', subs: ['Use TWO XOR gates for D, plus NOT/AND/OR gates (or one each) for Bout, exactly like the full subtractor you built earlier.', 'Add Output LEDs D and Bout.'] },
      { title: 'Add the restore MUX + prove it', why: 'The cell keeps the difference if it fits (Bout=0) or restores M if it does not (Bout=1) - that is the quotient bit.', subs: ['Drop a 2-to-1 Multiplexer; data inputs = D and the original M, select = Bout. Its output is the bit passed to the next row.', 'The quotient bit q = NOT Bout. Set the inputs below and tick each row when D and Bout match.'] },
    ],
    proof: { columns: ['M', 'S', 'Bin', 'D', 'Bout'], rows: [[0, 0, 0, 0, 0], [0, 1, 0, 1, 1], [1, 0, 0, 1, 0], [1, 1, 1, 1, 1]], note: 'Bout=1 means the divisor did not fit here, so q=0 and the remainder is restored; Bout=0 means it fit, q=1.' },
    completionRoute: '/dsd/27', completionTitle: 'Certified: you built one divider cell.',
    completionBody: 'Tile this controlled-subtractor cell into a 2D grid and you have a combinational array divider - long division done in pure hardware, no clock required.',
  },
};

const makeRail = (key: string): React.FC<{ onClose: () => void; onMinimize?: () => void }> =>
  ({ onClose, onMinimize }) => <GuidedBuildRail config={CONFIGS[key]} onClose={onClose} onMinimize={onMinimize} />;

export const Mux4to1Tutorial = makeRail('mux-4to1');
export const Demux1to4Tutorial = makeRail('demux-1to4');
export const Decoder2to4Tutorial = makeRail('decoder-2to4');
export const Encoder4to2Tutorial = makeRail('encoder-4to2');
export const BinaryToGrayTutorial = makeRail('binary-to-gray');
export const NandUniversalTutorial = makeRail('nand-universal');
export const ArrayDividerCellTutorial = makeRail('array-divider-cell');
