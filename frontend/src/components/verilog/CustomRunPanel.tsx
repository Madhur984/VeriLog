/**
 * CustomRunPanel — drive your own inputs and watch your design respond, before
 * ever hitting Submit.
 *
 * This is the "Run" half of the judge loop that every text judge has and most
 * hardware ones do not: Submit tells you whether you are right, Run tells you
 * what your circuit actually *does*. Debugging without it means guessing which
 * of 40 graded cycles to reason about.
 *
 * Two deliberate design decisions:
 *
 *   1. It runs YOUR design only, never the reference. A panel that reported the
 *      reference's output for arbitrary inputs would be an oracle — for a
 *      narrow problem you could read off the whole truth table without writing
 *      any logic. Expected values appear only for input combinations the
 *      problem statement already publishes as worked examples, where nothing is
 *      being given away.
 *
 *   2. Combinational designs settle live as you type; sequential ones are
 *      stepped a cycle at a time, holding register state between steps, because
 *      "what does this do over time" is the question that actually needs asking
 *      about a clocked circuit. The step history feeds the same WaveformViewer
 *      the grader uses.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Play, RotateCcw, Loader2, AlertTriangle, Dice5, ChevronsRight,
  SkipForward, ListPlus, Zap,
} from 'lucide-react';
import { synthesize } from '../../engine/verilog/yosysClient';
import { buildFromNetlist, readPort, type PortInfo } from '../../engine/verilog/simRunner';
import type { NetlistSim, Val } from '../../engine/verilog/netlistSim';
import type { Trace, TraceSignal } from '../../engine/verilog/simRunner';
import { isSequential, type VProblemV2, type VPort } from '../../data/verilog';
import { WaveformViewer } from './WaveformViewer';

/**
 * Parse a user-typed value. Accepts plain decimal, `0x`/`0b` prefixes and
 * Verilog literals (`8'hFF`, `4'b1010`), because students type all three and
 * rejecting two of them would be an obstacle rather than a lesson.
 * Returns null when unparseable, so the field can mark itself invalid.
 */
export function parseValue(text: string, width: number): bigint | null {
  const t = text.trim().replace(/_/g, '');
  if (!t) return 0n;
  const mask = (1n << BigInt(width)) - 1n;
  try {
    const verilog = /^(\d*)'([hbdo])([0-9a-fA-FxXzZ]+)$/.exec(t);
    if (verilog) {
      const digits = verilog[3];
      // x/z in a driven input has no meaning here — the sim drives real levels.
      if (/[xz]/i.test(digits)) return null;
      const base = { h: 16, b: 2, d: 10, o: 8 }[verilog[2].toLowerCase() as 'h' | 'b' | 'd' | 'o'];
      const v = [...digits].reduce((acc, ch) => acc * BigInt(base) + BigInt(parseInt(ch, base)), 0n);
      return v & mask;
    }
    if (/^0[xb]/i.test(t)) return BigInt(t) & mask;
    if (!/^\d+$/.test(t)) return null;
    return BigInt(t) & mask;
  } catch {
    return null;
  }
}

/** Display a value the way the port's width suggests. */
const showValue = (v: bigint | null, width: number): string => {
  if (v === null) return 'x';
  if (width === 1) return v.toString();
  return `${width}'h${v.toString(16).toUpperCase()}`;
};

const randomFor = (width: number): bigint => {
  let v = 0n;
  for (let i = 0; i < width; i += 30) {
    v |= BigInt(Math.floor(Math.random() * 2 ** Math.min(30, width - i))) << BigInt(i);
  }
  return v & ((1n << BigInt(width)) - 1n);
};

/** One editable input port. 1-bit ports get a toggle; buses get a text field. */
const InputControl: React.FC<{
  port: VPort;
  text: string;
  onChange: (s: string) => void;
}> = ({ port, text, onChange }) => {
  const parsed = parseValue(text, port.width);
  const bad = parsed === null;

  if (port.width === 1) {
    const on = parsed === 1n;
    return (
      <button
        onClick={() => onChange(on ? '0' : '1')}
        aria-pressed={on}
        aria-label={`${port.name}, currently ${on ? 1 : 0}. Click to toggle.`}
        className="flex h-7 w-full items-center justify-center rounded-md border font-mono text-[13px] font-bold transition-colors"
        style={{
          borderColor: on ? 'var(--vj-wave)' : 'var(--vj-border-strong)',
          background: on ? 'var(--vj-pass-bg)' : 'transparent',
          color: on ? 'var(--vj-wave)' : 'var(--vj-text-dim)',
        }}
      >
        {on ? '1' : '0'}
      </button>
    );
  }

  return (
    <input
      value={text}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`${port.name}, ${port.width} bits`}
      aria-invalid={bad}
      spellCheck={false}
      placeholder="0"
      className="h-7 w-full rounded-md border bg-transparent px-2 font-mono text-[12px] outline-none"
      style={{
        borderColor: bad ? 'var(--vj-fail)' : 'var(--vj-border-strong)',
        color: bad ? 'var(--vj-fail)' : 'var(--vj-text-code)',
      }}
      title={bad ? 'Try 12, 0xFF, 0b1010 or 8\'hFF' : `${port.width}-bit value`}
    />
  );
};

export interface CustomRunPanelProps {
  problem: VProblemV2;
  /** Debounced editor contents. */
  source: string;
  isLight: boolean;
}

export const CustomRunPanel: React.FC<CustomRunPanelProps> = ({ problem, source, isLight }) => {
  const seq = isSequential(problem);
  const drivable = useMemo(
    () => problem.inputs.filter((i) => i.name !== problem.clock),
    [problem],
  );

  const [text, setText] = useState<Record<string, string>>({});
  const [sim, setSim] = useState<NetlistSim | null>(null);
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outs, setOuts] = useState<Record<string, bigint | null> | null>(null);
  /** Sequential only: one entry per clock edge taken. */
  const [history, setHistory] = useState<{ in: Record<string, bigint>; out: Record<string, bigint | null> }[]>([]);
  const regsRef = useRef<Map<string, Val[]> | null>(null);

  // Reset the bench whenever the problem changes — carrying one problem's
  // vectors into another's ports would be nonsense.
  useEffect(() => {
    const init: Record<string, string> = {};
    for (const p of drivable) init[p.name] = '0';
    setText(init);
    setHistory([]);
    setOuts(null);
    regsRef.current = null;
  }, [problem.id, drivable]);

  // Synthesize the debounced source. The result is memoized in yosysClient, so
  // this shares work with the live schematic rather than duplicating it.
  useEffect(() => {
    let alive = true;
    if (!source.trim()) { setSim(null); return () => { alive = false; }; }
    setBusy(true);
    synthesize(source).then((r) => {
      if (!alive) return;
      setBusy(false);
      if (!r.ok) { setSim(null); setError(r.error); return; }
      const built = buildFromNetlist(r.json);
      if (!built.ok) { setSim(null); setError(built.error); return; }
      setError(null);
      setSim(built.sim);
      setPorts(built.ports);
      regsRef.current = built.sim.initRegs();
      setHistory([]);
      setOuts(null);
    });
    return () => { alive = false; };
  }, [source]);

  const values = useMemo(() => {
    const v: Record<string, bigint> = {};
    for (const p of drivable) v[p.name] = parseValue(text[p.name] ?? '0', p.width) ?? 0n;
    return v;
  }, [text, drivable]);

  const anyInvalid = drivable.some((p) => parseValue(text[p.name] ?? '0', p.width) === null);

  /** Ports the design actually exposes, so we never read one that isn't there. */
  const liveOutputs = useMemo(() => {
    const have = new Set(ports.filter((p) => p.direction === 'output').map((p) => p.name));
    return problem.outputs.filter((o) => have.has(o.name));
  }, [ports, problem.outputs]);

  const readOuts = useCallback((s: NetlistSim, vals: Map<number, Val>): Record<string, bigint | null> => {
    const out: Record<string, bigint | null> = {};
    for (const o of liveOutputs) {
      const port = s.outputs.find((p) => p.name === o.name);
      out[o.name] = port ? readPort(port, vals) : null;
    }
    return out;
  }, [liveOutputs]);

  const driveMap = useCallback((s: NetlistSim): Map<string, bigint> => {
    const drive = new Map<string, bigint>();
    for (const p of s.inputs) drive.set(p.name, values[p.name] ?? 0n);
    if (problem.clock) drive.set(problem.clock, 0n);
    return drive;
  }, [values, problem.clock]);

  // Combinational designs settle live — no button to press, which is the whole
  // point of a continuous assignment being continuous.
  useEffect(() => {
    if (!sim || seq || anyInvalid) return;
    const vals = sim.settle(driveMap(sim), new Map(), sim.initRegs());
    setOuts(readOuts(sim, vals));
  }, [sim, seq, anyInvalid, driveMap, readOuts]);

  /** Take one clock edge, then sample — the same ordering the grader uses. */
  const step = useCallback((n = 1) => {
    if (!sim || anyInvalid) return;
    let regs = regsRef.current ?? sim.initRegs();
    const added: typeof history = [];
    const forces = new Map<number, 0 | 1>();
    for (let i = 0; i < n; i++) {
      const drive = driveMap(sim);
      regs = sim.nextRegs(drive, forces, regs);
      const vals = sim.settle(drive, forces, regs);
      const snapshot: Record<string, bigint> = {};
      for (const p of drivable) snapshot[p.name] = values[p.name] ?? 0n;
      added.push({ in: snapshot, out: readOuts(sim, vals) });
    }
    regsRef.current = regs;
    setHistory((h) => [...h, ...added].slice(-128));
    setOuts(added[added.length - 1]?.out ?? null);
  }, [sim, anyInvalid, driveMap, readOuts, drivable, values]);

  const resetSeq = useCallback(() => {
    if (!sim) return;
    regsRef.current = sim.initRegs();
    setHistory([]);
    setOuts(null);
  }, [sim]);

  const fill = (mode: 'zero' | 'one' | 'random') => {
    const next: Record<string, string> = {};
    for (const p of drivable) {
      next[p.name] = mode === 'zero' ? '0'
        : mode === 'one' ? (p.width === 1 ? '1' : `0x${((1n << BigInt(p.width)) - 1n).toString(16)}`)
          : p.width === 1 ? String(Math.round(Math.random()))
            : `0x${randomFor(p.width).toString(16)}`;
    }
    setText(next);
  };

  /**
   * Worked examples from the statement are already public, so loading one and
   * checking against it gives away nothing the student cannot already read.
   */
  const examples = problem.examples ?? [];
  const loadExample = (i: number) => {
    const ex = examples[i];
    if (!ex) return;
    const next: Record<string, string> = { ...text };
    for (const p of drivable) {
      const raw = ex.in[p.name];
      if (raw === undefined) continue;
      next[p.name] = typeof raw === 'number' ? String(raw) : String(raw);
    }
    setText(next);
  };

  /**
   * The published example matching the current inputs, if there is one.
   *
   * Combinational only, and deliberately so. A sequential example such as
   * `rst=0, en=1 -> count=1` describes one point in a sequence, not a rule that
   * holds whenever those inputs appear — a correct counter reading 10 on its
   * tenth enabled cycle would be flagged wrong by an input-only match.
   * Clocked designs get `runExampleSequence` instead, which replays the
   * examples in order from reset, where the expected values genuinely hold.
   */
  const matchedExample = useMemo(() => {
    if (seq) return null;
    for (const ex of examples) {
      const keys = drivable.filter((p) => ex.in[p.name] !== undefined);
      if (keys.length !== drivable.length) continue;
      const same = keys.every((p) => {
        const want = parseValue(String(ex.in[p.name]), p.width);
        return want !== null && want === values[p.name];
      });
      if (same) return ex;
    }
    return null;
  }, [seq, examples, drivable, values]);

  /** Summary of the last example replay, for clocked designs. */
  const [exampleRun, setExampleRun] = useState<{ passed: number; total: number; firstBad: number | null } | null>(null);

  /**
   * Replay the statement's examples as consecutive cycles from reset — the
   * sequential analogue of checking one combinational example. The examples are
   * already published, so nothing is given away, and read in order they are a
   * real specification of behaviour over time.
   */
  const runExampleSequence = useCallback(() => {
    if (!sim || !examples.length) return;
    let regs = sim.initRegs();
    const forces = new Map<number, 0 | 1>();
    const added: { in: Record<string, bigint>; out: Record<string, bigint | null> }[] = [];
    let passed = 0;
    let firstBad: number | null = null;

    examples.forEach((ex, i) => {
      const drive = new Map<string, bigint>();
      const snapshot: Record<string, bigint> = {};
      for (const p of drivable) {
        const v = ex.in[p.name] !== undefined
          ? parseValue(String(ex.in[p.name]), p.width) ?? 0n
          : 0n;
        snapshot[p.name] = v;
        drive.set(p.name, v);
      }
      for (const p of sim.inputs) if (!drive.has(p.name)) drive.set(p.name, 0n);
      if (problem.clock) drive.set(problem.clock, 0n);

      regs = sim.nextRegs(drive, forces, regs);
      const vals = sim.settle(drive, forces, regs);
      const got = readOuts(sim, vals);
      added.push({ in: snapshot, out: got });

      const ok = liveOutputs.every((o) => {
        if (ex.out[o.name] === undefined) return true;
        const want = parseValue(String(ex.out[o.name]), o.width);
        return want === null || want === got[o.name];
      });
      if (ok) passed++;
      else if (firstBad === null) firstBad = i;
    });

    regsRef.current = regs;
    setHistory(added);
    setOuts(added[added.length - 1]?.out ?? null);
    setText(Object.fromEntries(
      drivable.map((p) => [p.name, String(added[added.length - 1]?.in[p.name] ?? 0n)]),
    ));
    setExampleRun({ passed, total: examples.length, firstBad });
  }, [sim, examples, drivable, liveOutputs, problem.clock, readOuts]);

  // A recompile or a problem change invalidates the summary — it described a
  // different design.
  useEffect(() => { setExampleRun(null); }, [source, problem.id]);

  /** Sequential history rendered through the grader's own waveform viewer. */
  const trace = useMemo<Trace | null>(() => {
    if (!seq || history.length === 0) return null;
    const signals: TraceSignal[] = [
      ...drivable.map((p) => ({
        name: p.name, width: p.width, role: 'input' as const,
        values: history.map((h) => h.in[p.name] ?? 0n) as (bigint | null)[],
      })),
      ...liveOutputs.map((o) => ({
        name: o.name, width: o.width, role: 'output' as const,
        values: history.map((h) => h.out[o.name] ?? null),
      })),
    ];
    return { cycles: history.length, signals };
  }, [seq, history, drivable, liveOutputs]);

  const chip = 'flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors';
  const chipStyle = { borderColor: 'var(--vj-border-strong)', color: 'var(--vj-text-dim)' };

  return (
    <div className="vj-scope flex h-full min-h-0 flex-col" style={{ background: 'var(--vj-surface-0)' }}>
      {/* ── controls ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2"
           style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--vj-text-dim)' }}>
          {seq ? 'Step your design' : 'Drive your design'}
        </span>

        <button onClick={() => fill('zero')} className={chip} style={chipStyle}>0s</button>
        <button onClick={() => fill('one')} className={chip} style={chipStyle}>1s</button>
        <button onClick={() => fill('random')} className={chip} style={chipStyle}>
          <Dice5 size={12} /> random
        </button>

        {examples.length > 0 && (
          seq ? (
            <button onClick={runExampleSequence} disabled={!sim} className={chip} style={chipStyle}
                    title="Replay the statement's examples as consecutive cycles from reset">
              <ListPlus size={12} /> play examples
            </button>
          ) : (
            <button onClick={() => loadExample(0)} className={chip} style={chipStyle}
                    title="Load the first worked example from the problem statement">
              <ListPlus size={12} /> example
            </button>
          )
        )}

        {exampleRun && (
          <span className="flex items-center gap-1 font-mono text-[11px] font-bold"
                style={{ color: exampleRun.firstBad === null ? 'var(--vj-pass)' : 'var(--vj-fail)' }}>
            {exampleRun.firstBad === null
              ? `✓ ${exampleRun.passed}/${exampleRun.total} example cycles`
              : `✗ diverges at example cycle ${exampleRun.firstBad}`}
          </span>
        )}

        {seq && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => step(1)} disabled={!sim || anyInvalid}
                    className={chip}
                    style={{ ...chipStyle, borderColor: 'var(--vj-wave)', color: 'var(--vj-wave)' }}>
              <SkipForward size={12} /> step
            </button>
            <button onClick={() => step(8)} disabled={!sim || anyInvalid} className={chip} style={chipStyle}>
              <ChevronsRight size={12} /> ×8
            </button>
            <button onClick={resetSeq} disabled={!sim} className={chip} style={chipStyle}>
              <RotateCcw size={12} /> reset
            </button>
            <span className="font-mono text-[11px]" style={{ color: 'var(--vj-text-dim)' }}>
              {history.length} cycle{history.length === 1 ? '' : 's'}
            </span>
          </div>
        )}

        <span className="ml-auto flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--vj-text-dim)' }}>
          {busy ? <><Loader2 size={12} className="animate-spin" /> synthesizing…</>
            : sim ? <><Zap size={12} style={{ color: 'var(--vj-wave)' }} /> your design only</>
              : null}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error && (
          <div className="m-3 flex items-start gap-2 rounded-lg border p-3 text-[12px]"
               style={{ borderColor: 'var(--vj-warn)', background: 'var(--vj-warn-bg)', color: 'var(--vj-warn)' }}>
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">Your design does not compile yet</div>
              <div className="mt-0.5 opacity-90">{error}</div>
            </div>
          </div>
        )}

        {!error && !sim && !busy && (
          <div className="p-6 text-center text-[12px]" style={{ color: 'var(--vj-text-dim)' }}>
            Write some Verilog and it will appear here, ready to drive.
          </div>
        )}

        {sim && (
          <div className="p-3">
            {/* inputs → outputs, side by side */}
            <div className="grid gap-3 md:grid-cols-2">
              <section>
                <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: 'var(--vj-text-dim)' }}>Inputs</h3>
                <div className="space-y-1.5">
                  {drivable.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 truncate font-mono text-[12px] font-bold"
                            style={{ color: 'var(--vj-text)' }} title={p.note}>
                        {p.name}
                      </span>
                      <span className="w-12 shrink-0 font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
                        {p.width > 1 ? `[${p.width - 1}:0]` : '1b'}
                      </span>
                      <div className="min-w-0 flex-1"><InputControl port={p} text={text[p.name] ?? '0'} onChange={(s) => setText((t) => ({ ...t, [p.name]: s }))} /></div>
                    </div>
                  ))}
                  {problem.clock && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="w-24 shrink-0 font-mono text-[12px] font-bold" style={{ color: 'var(--vj-text-dim)' }}>
                        {problem.clock}
                      </span>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
                        driven by “step”
                      </span>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: 'var(--vj-text-dim)' }}>Outputs</h3>
                <div className="space-y-1.5">
                  {liveOutputs.length === 0 && (
                    <div className="text-[12px]" style={{ color: 'var(--vj-text-dim)' }}>
                      No matching output ports yet — check the names against the spec.
                    </div>
                  )}
                  {liveOutputs.map((o) => {
                    const got = outs?.[o.name] ?? null;
                    const want = matchedExample
                      ? parseValue(String(matchedExample.out[o.name] ?? ''), o.width)
                      : null;
                    const wrong = want !== null && outs != null && got !== want;
                    return (
                      <div key={o.name} className="flex items-center gap-2">
                        <span className="w-24 shrink-0 truncate font-mono text-[12px] font-bold"
                              style={{ color: 'var(--vj-text)' }} title={o.note}>
                          {o.name}
                        </span>
                        <span className="w-12 shrink-0 font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
                          {o.width > 1 ? `[${o.width - 1}:0]` : '1b'}
                        </span>
                        <span className="flex h-7 min-w-0 flex-1 items-center rounded-md border px-2 font-mono text-[12px] font-bold"
                              style={{
                                borderColor: wrong ? 'var(--vj-fail)' : 'var(--vj-border)',
                                background: wrong ? 'var(--vj-fail-bg)' : 'var(--vj-surface-1)',
                                color: got === null ? 'var(--vj-unknown)'
                                  : wrong ? 'var(--vj-fail)' : 'var(--vj-text-code)',
                              }}>
                          {outs === null && seq ? '—' : showValue(got, o.width)}
                          {want !== null && (
                            <span className="ml-auto text-[10px] font-normal"
                                  style={{ color: wrong ? 'var(--vj-fail)' : 'var(--vj-text-dim)' }}>
                              {wrong ? `want ${showValue(want, o.width)}` : '✓ matches example'}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {sim.unsupported.length > 0 && (
              <p className="mt-3 text-[11px]" style={{ color: 'var(--vj-warn)' }}>
                Contains {sim.unsupported.join(', ')} — the simulator cannot model
                {sim.unsupported.length === 1 ? ' this cell' : ' these cells'}, so outputs may read x.
              </p>
            )}

            <p className="mt-3 text-[11px]" style={{ color: 'var(--vj-text-dim)' }}>
              This runs your design on its own. Submit to check it against the reference
              {examples.length > 0 && ', or load an example above to compare against a published case'}.
            </p>
          </div>
        )}

        {/* Sequential history, drawn with the grader's waveform viewer. */}
        {trace && (
          <div className="mt-1 border-t" style={{ borderColor: 'var(--vj-border)', height: 260 }}>
            <WaveformViewer
              trace={trace}
              outputNames={liveOutputs.map((o) => o.name)}
              isLight={isLight}
            />
          </div>
        )}

        {seq && sim && history.length === 0 && (
          <div className="px-3 pb-4 text-[12px]" style={{ color: 'var(--vj-text-dim)' }}>
            <Play size={12} className="mr-1 inline" />
            Set the inputs above, then <strong>step</strong> to take a clock edge. Registers hold
            their state between steps, so you can walk the design through a sequence.
          </div>
        )}
      </div>
    </div>
  );
};
