/**
 * WaveformViewer — a digital timing diagram for the judge's grading traces.
 *
 * GTKWave is a desktop GTK application and cannot be embedded in a page, so this
 * is the in-browser equivalent for the one job the judge needs: showing what the
 * student's design did, what the reference did, and precisely which cycles
 * disagree.
 *
 * Rendering rules:
 *   - 1-bit signals draw as a square wave.
 *   - Wider signals draw as bus hexagons whose label is the value in the chosen
 *     radix, elided when the column is too narrow to hold it.
 *   - Unknown (x) draws hatched in amber rather than as a plausible-looking 0.
 *   - Mismatched cycles get a red band across every row, so a failure is visible
 *     without reading any numbers.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, ChevronRight, AlertTriangle } from 'lucide-react';
import type { Trace, TraceSignal } from '../../engine/verilog/simRunner';

export type Radix = 'hex' | 'dec' | 'bin';

const palette = (light: boolean) => ({
  bg: light ? '#ffffff' : '#0a0e1a',
  panel: light ? '#f8fafc' : '#0f1524',
  grid: light ? '#e2e8f0' : '#1e293b',
  gridStrong: light ? '#cbd5e1' : '#293548',
  label: light ? '#1e293b' : '#e2e8f0',
  dim: light ? '#64748b' : '#94a3b8',
  wave: '#10b981',
  waveExpected: light ? '#6366f1' : '#818cf8',
  bus: light ? '#0ea5e9' : '#38bdf8',
  unknown: '#f59e0b',
  bad: '#f43f5e',
  badBand: light ? 'rgba(244,63,94,0.10)' : 'rgba(244,63,94,0.16)',
  cursor: light ? '#0f172a' : '#f1f5f9',
});
type Pal = ReturnType<typeof palette>;

const LABEL_W = 132;
const ROW_H = 34;
const WAVE_H = 20;
const HEADER_H = 22;
const MONO = "'IBM Plex Mono',ui-monospace,monospace";

/** Format a value for display; `null` is unknown (x). */
function fmt(v: bigint | null, width: number, radix: Radix): string {
  if (v === null) return 'x';
  if (width === 1) return v.toString();
  switch (radix) {
    case 'hex': return `${width}'h${v.toString(16).toUpperCase()}`;
    case 'bin': return `${width}'b${v.toString(2).padStart(width, '0')}`;
    default: return v.toString();
  }
}

/** Compact form used inside a bus hexagon, where space is tight. */
function fmtShort(v: bigint | null, width: number, radix: Radix): string {
  if (v === null) return 'x';
  if (width === 1) return v.toString();
  switch (radix) {
    case 'hex': return v.toString(16).toUpperCase();
    case 'bin': return v.toString(2).padStart(width, '0');
    default: return v.toString();
  }
}

/** One row of the diagram: square wave for scalars, hexagons for buses. */
const SignalRow: React.FC<{
  sig: TraceSignal;
  y: number;
  px: number;
  pal: Pal;
  radix: Radix;
  color: string;
  dashed?: boolean;
}> = ({ sig, y, px, pal, radix, color, dashed }) => {
  const top = y + (ROW_H - WAVE_H) / 2;
  const bot = top + WAVE_H;
  const mid = (top + bot) / 2;

  if (sig.width === 1) {
    // Square wave: a horizontal run per cycle plus a vertical edge on change.
    const segs: string[] = [];
    const unknown: React.ReactNode[] = [];
    let prev: bigint | null | undefined;
    for (let i = 0; i < sig.values.length; i++) {
      const v = sig.values[i];
      const x0 = i * px;
      const x1 = x0 + px;
      if (v === null) {
        unknown.push(
          <rect key={`u${i}`} x={x0} y={top} width={px} height={WAVE_H}
                fill={pal.unknown} opacity={0.28} />,
        );
        prev = undefined;
        continue;
      }
      const yy = v === 1n ? top : bot;
      if (prev !== undefined && prev !== null && prev !== v) segs.push(`M ${x0},${prev === 1n ? top : bot} L ${x0},${yy}`);
      segs.push(`M ${x0},${yy} L ${x1},${yy}`);
      prev = v;
    }
    return (
      <g>
        {unknown}
        <path d={segs.join(' ')} fill="none" stroke={color} strokeWidth={1.75}
              strokeLinecap="square" strokeDasharray={dashed ? '4 3' : undefined} />
      </g>
    );
  }

  // Bus: one hexagon per run of equal values, labelled if it fits.
  const cells: React.ReactNode[] = [];
  let runStart = 0;
  const flush = (end: number) => {
    const v = sig.values[runStart];
    const x0 = runStart * px;
    const w = (end - runStart) * px;
    const notch = Math.min(5, w / 2);
    const isX = v === null;
    const d = [
      `M ${x0 + notch},${top}`,
      `L ${x0 + w - notch},${top}`,
      `L ${x0 + w},${mid}`,
      `L ${x0 + w - notch},${bot}`,
      `L ${x0 + notch},${bot}`,
      `L ${x0},${mid}`,
      'Z',
    ].join(' ');
    const text = fmtShort(v, sig.width, radix);
    // ~6.2px per character at 10px monospace; hide the label if it would spill.
    const fits = w > text.length * 6.4 + 8;
    cells.push(
      <g key={`c${runStart}`}>
        <path d={d} fill={isX ? pal.unknown : color} fillOpacity={isX ? 0.3 : 0.14}
              stroke={isX ? pal.unknown : color} strokeWidth={1.4}
              strokeDasharray={dashed ? '4 3' : undefined} />
        {fits && (
          <text x={x0 + w / 2} y={mid + 3.5} textAnchor="middle"
                fontSize={10} fontFamily={MONO} fill={isX ? pal.unknown : pal.label}>
            {text}
          </text>
        )}
      </g>,
    );
  };
  for (let i = 1; i <= sig.values.length; i++) {
    if (i === sig.values.length || sig.values[i] !== sig.values[runStart]) {
      flush(i);
      runStart = i;
    }
  }
  return <g>{cells}</g>;
};

export interface WaveformViewerProps {
  /** The student's trace. */
  trace: Trace;
  /** The reference trace, drawn as a dashed golden overlay for failing outputs. */
  expectedTrace?: Trace;
  /** Cycle indices where the two disagree — banded in red. */
  failingCycles?: number[];
  /** Names to treat as outputs (drives the golden overlay). */
  outputNames?: string[];
  isLight: boolean;
  /** Scroll the view to this cycle when it changes. */
  focusCycle?: number;
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({
  trace, expectedTrace, failingCycles, outputNames, isLight, focusCycle,
}) => {
  const pal = useMemo(() => palette(isLight), [isLight]);
  const [radix, setRadix] = useState<Radix>('hex');
  const [pxPerCycle, setPxPerCycle] = useState(26);
  const [cursor, setCursor] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cycles = trace.cycles;
  const failSet = useMemo(() => new Set(failingCycles ?? []), [failingCycles]);
  const outs = useMemo(() => new Set(outputNames ?? []), [outputNames]);

  /**
   * Inputs first, then outputs — the order an engineer reads a timing diagram.
   *
   * An output that disagrees with the reference gets a second row carrying the
   * expected values. Overlaying the two on one row works for a square wave but
   * not for a bus, where the golden hexagons end up hidden underneath the
   * student's; a dedicated row is legible in both cases.
   */
  const rows = useMemo<{ sig: TraceSignal; kind: 'actual' | 'expected' }[]>(() => {
    const ins = trace.signals.filter((s) => s.role === 'input');
    const os = trace.signals.filter((s) => s.role === 'output');
    const out: { sig: TraceSignal; kind: 'actual' | 'expected' }[] =
      ins.map((sig) => ({ sig, kind: 'actual' as const }));
    for (const sig of os) {
      out.push({ sig, kind: 'actual' });
      const exp = expectedTrace?.signals.find((e) => e.name === sig.name);
      if (exp && exp.values.some((v, i) => v !== sig.values[i])) {
        out.push({ sig: exp, kind: 'expected' });
      }
    }
    return out;
  }, [trace, expectedTrace]);

  const width = Math.max(cycles * pxPerCycle, 40);
  const height = rows.length * ROW_H + HEADER_H;

  // Keep the first failing cycle in view when the grader points at one.
  useEffect(() => {
    if (focusCycle == null || !scrollRef.current) return;
    const el = scrollRef.current;
    const x = focusCycle * pxPerCycle;
    if (x < el.scrollLeft || x > el.scrollLeft + el.clientWidth - 60) {
      el.scrollLeft = Math.max(0, x - el.clientWidth / 3);
    }
  }, [focusCycle, pxPerCycle]);

  const onMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / pxPerCycle);
    setCursor(c >= 0 && c < cycles ? c : null);
  }, [pxPerCycle, cycles]);

  const zoom = (dir: 1 | -1) =>
    setPxPerCycle((p) => Math.max(6, Math.min(120, dir > 0 ? p * 1.4 : p / 1.4)));

  const fit = () => {
    const w = scrollRef.current?.clientWidth ?? 600;
    setPxPerCycle(Math.max(6, Math.min(120, w / Math.max(1, cycles))));
  };

  // Tick spacing that keeps labels from colliding as you zoom out.
  const tickEvery = pxPerCycle >= 40 ? 1 : pxPerCycle >= 20 ? 5 : pxPerCycle >= 10 ? 10 : 20;

  const sigOf = (t: Trace | undefined, name: string) => t?.signals.find((s) => s.name === name);

  return (
    <div className={`flex h-full flex-col ${isLight ? 'bg-white' : 'bg-[#0a0e1a]'}`}>
      {/* toolbar */}
      <div className={`flex items-center gap-2 border-b px-3 py-2 ${
        isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#0f1524]'}`}>
        <div className={`inline-flex overflow-hidden rounded-md border ${
          isLight ? 'border-slate-300' : 'border-slate-700'}`}>
          {(['hex', 'dec', 'bin'] as Radix[]).map((r) => (
            <button
              key={r}
              onClick={() => setRadix(r)}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                radix === r
                  ? 'bg-emerald-500 text-emerald-950'
                  : isLight ? 'bg-white text-slate-600 hover:bg-slate-100'
                            : 'bg-transparent text-slate-400 hover:bg-slate-800'}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => zoom(-1)} title="Zoom out"
                  className={`rounded p-1.5 ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800'}`}>
            <ZoomOut size={15} />
          </button>
          <button onClick={() => zoom(1)} title="Zoom in"
                  className={`rounded p-1.5 ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800'}`}>
            <ZoomIn size={15} />
          </button>
          <button onClick={fit} title="Fit to width"
                  className={`rounded p-1.5 ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Maximize2 size={15} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3 text-[11px]">
          {expectedTrace && (
            <span className="flex items-center gap-1.5" style={{ color: pal.dim }}>
              <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4"
                stroke={pal.waveExpected} strokeWidth="2" strokeDasharray="4 3" /></svg>
              expected
            </span>
          )}
          {failSet.size > 0 && (
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: pal.bad }}>
              <AlertTriangle size={13} />
              {failSet.size} cycle{failSet.size === 1 ? '' : 's'} differ
            </span>
          )}
          <span style={{ color: pal.dim }}>
            {cursor !== null ? `cycle ${cursor}` : `${cycles} cycles`}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* fixed signal-name gutter */}
        <div className={`shrink-0 border-r ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#0f1524]'}`}
             style={{ width: LABEL_W }}>
          <div style={{ height: HEADER_H }} />
          {rows.map(({ sig: s, kind }, i) => {
            const isExpected = kind === 'expected';
            const isOut = s.role === 'output';
            const bad = failSet.size > 0 && isOut && !isExpected;
            return (
              <div key={`${s.name}-${kind}-${i}`} style={{ height: ROW_H }}
                   className="flex items-center gap-1 px-2.5">
                <ChevronRight size={11} className="shrink-0"
                              style={{
                                color: isExpected ? pal.waveExpected : isOut ? pal.wave : pal.dim,
                                opacity: isExpected ? 0.9 : isOut ? 1 : 0.5,
                                transform: isExpected ? 'translateX(4px)' : undefined,
                              }} />
                <span className="truncate text-[11px] font-semibold"
                      style={{
                        color: isExpected ? pal.waveExpected : bad ? pal.bad : pal.label,
                        fontFamily: MONO,
                      }}
                      title={isExpected ? `${s.name} — reference` : `${s.name}[${s.width - 1}:0]`}>
                  {isExpected ? 'want' : s.name}
                </span>
                {s.width > 1 && !isExpected && (
                  <span className="ml-auto shrink-0 text-[9px]" style={{ color: pal.dim }}>
                    {s.width}b
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* scrolling wave area */}
        <div ref={scrollRef} className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
          <svg width={width} height={height} onMouseMove={onMove}
               onMouseLeave={() => setCursor(null)}
               style={{ display: 'block', cursor: 'crosshair' }}>
            {/* failing-cycle bands, drawn under everything */}
            {[...failSet].map((c) => (
              <rect key={`f${c}`} x={c * pxPerCycle} y={0} width={pxPerCycle} height={height}
                    fill={pal.badBand} />
            ))}

            {/* cycle grid + ruler */}
            {Array.from({ length: cycles + 1 }, (_, i) => i).map((i) => {
              const major = i % tickEvery === 0;
              if (!major && pxPerCycle < 14) return null;
              return (
                <line key={`g${i}`} x1={i * pxPerCycle} y1={HEADER_H} x2={i * pxPerCycle} y2={height}
                      stroke={major ? pal.gridStrong : pal.grid} strokeWidth={major ? 1 : 0.5}
                      opacity={major ? 0.7 : 0.4} />
              );
            })}
            {Array.from({ length: cycles }, (_, i) => i)
              .filter((i) => i % tickEvery === 0)
              .map((i) => (
                <text key={`t${i}`} x={i * pxPerCycle + 3} y={HEADER_H - 7}
                      fontSize={9} fontFamily={MONO} fill={pal.dim}>
                  {i}
                </text>
              ))}

            {/* rows */}
            {rows.map(({ sig: s, kind }, idx) => {
              const y = HEADER_H + idx * ROW_H;
              const isExpected = kind === 'expected';
              const isOut = outs.size ? outs.has(s.name) : s.role === 'output';
              const color = isExpected
                ? pal.waveExpected
                : s.width === 1 ? (isOut ? pal.wave : pal.dim) : pal.bus;
              return (
                <g key={`${s.name}-${kind}-${idx}`}>
                  <line x1={0} y1={y + ROW_H} x2={width} y2={y + ROW_H}
                        stroke={pal.grid} strokeWidth={0.5} opacity={0.5} />
                  <SignalRow sig={s} y={y} px={pxPerCycle} pal={pal} radix={radix}
                             color={color} dashed={isExpected} />
                </g>
              );
            })}

            {/* hover cursor */}
            {cursor !== null && (
              <line x1={cursor * pxPerCycle + pxPerCycle / 2} y1={0}
                    x2={cursor * pxPerCycle + pxPerCycle / 2} y2={height}
                    stroke={pal.cursor} strokeWidth={1} opacity={0.55} strokeDasharray="3 2" />
            )}
          </svg>
        </div>

        {/* cursor readout */}
        {cursor !== null && (
          <div className={`w-44 shrink-0 overflow-y-auto border-l ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#0f1524]'}`}>
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                 style={{ color: pal.dim, height: HEADER_H }}>
              cycle {cursor}
            </div>
            {rows.map(({ sig: s, kind }, i) => {
              const v = s.values[cursor] ?? null;
              const isExpected = kind === 'expected';
              const isOut = outs.size ? outs.has(s.name) : s.role === 'output';
              const exp = sigOf(expectedTrace, s.name)?.values[cursor];
              const differs = !isExpected && isOut && exp !== undefined && exp !== v;
              return (
                <div key={`${s.name}-${kind}-${i}`} style={{ height: ROW_H }}
                     className="flex items-center gap-1.5 px-2.5">
                  <span className="truncate text-[10px]"
                        style={{ color: isExpected ? pal.waveExpected : pal.dim, fontFamily: MONO }}>
                    {isExpected ? 'want' : s.name}
                  </span>
                  <span className="ml-auto text-[11px] font-semibold"
                        style={{
                          color: isExpected ? pal.waveExpected : differs ? pal.bad : pal.label,
                          fontFamily: MONO,
                        }}>
                    {fmt(v, s.width, radix)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
