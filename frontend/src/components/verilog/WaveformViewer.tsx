/**
 * WaveformViewer — the judge's timing diagram, built as an instrument rather
 * than a picture. UI/UX master plan §8.
 *
 * GTKWave is a desktop GTK application and cannot be embedded in a page, so
 * this is the in-browser equivalent. The interaction vocabulary deliberately
 * copies GTKWave's (§8.1) — click places T1, shift-click places T2, `n`/`p`
 * step edges, scroll zooms on the cursor — so an engineer who already knows
 * the desktop tool has nothing to relearn.
 *
 * Rendering rules:
 *   - 1-bit signals draw as a square wave.
 *   - Wider signals draw as bus hexagons labelled in the chosen radix, elided
 *     when the column is too narrow.
 *   - Unknown (x) draws hatched in amber rather than as a plausible-looking 0.
 *   - Mismatched cycles get a red band AND a dashed reference row, so a
 *     failure is legible without relying on colour (§13).
 *
 * Accessibility: the SVG is decorative. Everything it shows is also emitted as
 * a real <table> for screen readers (§13) — a student using one is a supported
 * path, not an edge case.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, ChevronRight, AlertTriangle,
  ChevronLeft, ChevronsRight, Ruler, X,
} from 'lucide-react';
import type { Trace, TraceSignal } from '../../engine/verilog/simRunner';

export type Radix = 'hex' | 'dec' | 'bin';

/**
 * Read the design tokens (§4.1) rather than hard-coding hexes, so all four
 * themes work without this component knowing they exist.
 */
const readToken = (name: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

const buildPalette = () => ({
  grid: readToken('--vj-wave-grid', '#1e293b'),
  gridStrong: readToken('--vj-wave-grid-strong', '#293548'),
  label: readToken('--vj-text', '#e2e8f0'),
  dim: readToken('--vj-text-dim', '#94a3b8'),
  wave: readToken('--vj-wave', '#10b981'),
  waveExpected: readToken('--vj-wave-expected', '#818cf8'),
  bus: readToken('--vj-wave-bus', '#38bdf8'),
  unknown: readToken('--vj-unknown', '#f59e0b'),
  bad: readToken('--vj-fail', '#f43f5e'),
  badBand: readToken('--vj-fail-band', 'rgba(244,63,94,0.16)'),
  cursor1: readToken('--vj-cursor-1', '#f1f5f9'),
  cursor2: readToken('--vj-cursor-2', '#f0abfc'),
});
type Pal = ReturnType<typeof buildPalette>;

const LABEL_W = 138;
const ROW_H = 34;
const WAVE_H = 20;
const HEADER_H = 22;
const MONO = "'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace";

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

/** Cycle indices where a signal changes value — the basis of edge navigation. */
function edgesOf(sig: TraceSignal | undefined): number[] {
  if (!sig) return [];
  const out: number[] = [];
  for (let i = 1; i < sig.values.length; i++) {
    if (sig.values[i] !== sig.values[i - 1]) out.push(i);
  }
  return out;
}

/**
 * Measurements over the selected signal (§8.4) — what turns the diagram from
 * something to look at into something to measure with.
 */
function measure(sig: TraceSignal | undefined): {
  transitions: number; period: number | null; duty: number | null;
} {
  if (!sig || sig.values.length === 0) return { transitions: 0, period: null, duty: null };
  const edges = edgesOf(sig);
  if (sig.width !== 1) return { transitions: edges.length, period: null, duty: null };

  // Period: mean spacing between rising edges. Duty: fraction of cycles high.
  const rising: number[] = [];
  for (let i = 1; i < sig.values.length; i++) {
    if (sig.values[i] === 1n && sig.values[i - 1] === 0n) rising.push(i);
  }
  const period = rising.length >= 2
    ? (rising[rising.length - 1] - rising[0]) / (rising.length - 1)
    : null;
  const high = sig.values.reduce<number>((n, v) => n + (v === 1n ? 1 : 0), 0);
  return { transitions: edges.length, period, duty: high / sig.values.length };
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
  // Tokens are resolved from the DOM, so re-read whenever the theme changes.
  const [pal, setPal] = useState<Pal>(buildPalette);
  useEffect(() => { setPal(buildPalette()); }, [isLight]);
  useEffect(() => {
    const obs = new MutationObserver(() => setPal(buildPalette()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const [radix, setRadix] = useState<Radix>('hex');
  const [pxPerCycle, setPxPerCycle] = useState(26);
  const [hover, setHover] = useState<number | null>(null);
  // T1/T2 measurement cursors (§8.1). T1 is the primary; T2 enables the delta.
  const [t1, setT1] = useState<number | null>(null);
  const [t2, setT2] = useState<number | null>(null);
  const [sel, setSel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
  const selSig = rows[Math.min(sel, rows.length - 1)]?.sig;
  const stats = useMemo(() => measure(selSig), [selSig]);
  const failList = useMemo(() => [...failSet].sort((a, b) => a - b), [failSet]);

  const scrollTo = useCallback((cycle: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const x = cycle * pxPerCycle;
    if (x < el.scrollLeft || x > el.scrollLeft + el.clientWidth - 60) {
      el.scrollLeft = Math.max(0, x - el.clientWidth / 3);
    }
  }, [pxPerCycle]);

  // Park T1 on the first divergence when the grader points at one — the plan's
  // "cursor already on the diverging edge" (§8.3).
  useEffect(() => {
    if (focusCycle == null) return;
    setT1(focusCycle);
    scrollTo(focusCycle);
  }, [focusCycle, scrollTo]);

  const cycleAt = useCallback((clientX: number, target: SVGSVGElement): number | null => {
    const rect = target.getBoundingClientRect();
    const c = Math.floor((clientX - rect.left) / pxPerCycle);
    return c >= 0 && c < cycles ? c : null;
  }, [pxPerCycle, cycles]);

  const onMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setHover(cycleAt(e.clientX, e.currentTarget));
  }, [cycleAt]);

  const onClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const c = cycleAt(e.clientX, e.currentTarget);
    if (c === null) return;
    // GTKWave convention: click sets the primary cursor, shift-click the second.
    if (e.shiftKey) setT2(c); else setT1(c);
    svgRef.current?.focus();
  }, [cycleAt]);

  const zoom = useCallback((dir: 1 | -1) =>
    setPxPerCycle((p) => Math.max(6, Math.min(120, dir > 0 ? p * 1.4 : p / 1.4))), []);

  const fit = useCallback(() => {
    const w = scrollRef.current?.clientWidth ?? 600;
    setPxPerCycle(Math.max(6, Math.min(120, w / Math.max(1, cycles))));
  }, [cycles]);

  /** Step T1 to the next/previous edge of the selected signal (§8.1). */
  const stepEdge = useCallback((dir: 1 | -1) => {
    const edges = edgesOf(selSig);
    if (!edges.length) return;
    const from = t1 ?? 0;
    const next = dir > 0
      ? edges.find((c) => c > from)
      : [...edges].reverse().find((c) => c < from);
    if (next === undefined) return;
    setT1(next);
    scrollTo(next);
  }, [selSig, t1, scrollTo]);

  /** Step to the next divergence — `d`, the fastest path to the actual bug. */
  const stepDivergence = useCallback(() => {
    if (!failList.length) return;
    const from = t1 ?? -1;
    const next = failList.find((c) => c > from) ?? failList[0];
    setT1(next);
    scrollTo(next);
  }, [failList, t1, scrollTo]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === 'n') { stepEdge(1); e.preventDefault(); }
    else if (k === 'p') { stepEdge(-1); e.preventDefault(); }
    else if (k === 'd') { stepDivergence(); e.preventDefault(); }
    else if (k === 'f') { fit(); e.preventDefault(); }
    else if (k === '+' || k === '=') { zoom(1); e.preventDefault(); }
    else if (k === '-') { zoom(-1); e.preventDefault(); }
    else if (k === 'ArrowDown') { setSel((s) => Math.min(rows.length - 1, s + 1)); e.preventDefault(); }
    else if (k === 'ArrowUp') { setSel((s) => Math.max(0, s - 1)); e.preventDefault(); }
    else if (k === 'ArrowRight') { setT1((c) => Math.min(cycles - 1, (c ?? -1) + 1)); e.preventDefault(); }
    else if (k === 'ArrowLeft') { setT1((c) => Math.max(0, (c ?? 1) - 1)); e.preventDefault(); }
    else if (k === 'Escape') { setT1(null); setT2(null); }
  }, [stepEdge, stepDivergence, fit, zoom, rows.length, cycles]);

  // Tick spacing that keeps labels from colliding as you zoom out.
  const tickEvery = pxPerCycle >= 40 ? 1 : pxPerCycle >= 20 ? 5 : pxPerCycle >= 10 ? 10 : 20;
  const sigOf = (t: Trace | undefined, name: string) => t?.signals.find((s) => s.name === name);

  const delta = t1 !== null && t2 !== null ? Math.abs(t2 - t1) : null;
  /** Which cycle the readout column describes: the pinned cursor, else hover. */
  const readAt = t1 ?? hover;

  const btn = 'rounded p-1.5 transition-colors';
  const btnStyle = { color: 'var(--vj-text-dim)' };

  return (
    <div className="vj-scope flex h-full flex-col" style={{ background: 'var(--vj-surface-0)' }}>
      {/* ── toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2"
           style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
        <div className="inline-flex overflow-hidden rounded-md border"
             style={{ borderColor: 'var(--vj-border-strong)' }}>
          {(['hex', 'dec', 'bin'] as Radix[]).map((r) => (
            <button
              key={r}
              onClick={() => setRadix(r)}
              aria-pressed={radix === r}
              className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors"
              style={radix === r
                ? { background: 'var(--vj-wave)', color: 'var(--vj-surface-0)' }
                : { color: 'var(--vj-text-dim)' }}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => zoom(-1)} title="Zoom out (−)" aria-label="Zoom out"
                  className={btn} style={btnStyle}><ZoomOut size={15} /></button>
          <button onClick={() => zoom(1)} title="Zoom in (+)" aria-label="Zoom in"
                  className={btn} style={btnStyle}><ZoomIn size={15} /></button>
          <button onClick={fit} title="Fit to width (f)" aria-label="Fit to width"
                  className={btn} style={btnStyle}><Maximize2 size={15} /></button>
        </div>

        <div className="flex items-center gap-1 border-l pl-2" style={{ borderColor: 'var(--vj-border)' }}>
          <button onClick={() => stepEdge(-1)} title="Previous edge (p)" aria-label="Previous edge"
                  className={btn} style={btnStyle}><ChevronLeft size={15} /></button>
          <button onClick={() => stepEdge(1)} title="Next edge (n)" aria-label="Next edge"
                  className={btn} style={btnStyle}><ChevronRight size={15} /></button>
          {failList.length > 0 && (
            <button onClick={stepDivergence} title="Next divergence (d)" aria-label="Next divergence"
                    className={`${btn} font-semibold`} style={{ color: 'var(--vj-fail)' }}>
              <ChevronsRight size={15} />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3 text-[11px]">
          {expectedTrace && (
            <span className="flex items-center gap-1.5" style={{ color: 'var(--vj-text-dim)' }}>
              <svg width="18" height="8" aria-hidden><line x1="0" y1="4" x2="18" y2="4"
                stroke={pal.waveExpected} strokeWidth="2" strokeDasharray="4 3" /></svg>
              expected
            </span>
          )}
          {failSet.size > 0 && (
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--vj-fail)' }}>
              <AlertTriangle size={13} aria-hidden />
              {failSet.size} cycle{failSet.size === 1 ? '' : 's'} differ
            </span>
          )}
        </div>
      </div>

      {/* ── measurement strip (§8.4) ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-3 py-1.5 text-[11px]"
           style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)', fontFamily: MONO }}>
        <span className="flex items-center gap-1.5" style={{ color: 'var(--vj-text-dim)' }}>
          <Ruler size={12} aria-hidden />
          <span style={{ color: pal.cursor1 }}>T1 {t1 ?? '—'}</span>
        </span>
        <span style={{ color: pal.cursor2 }}>T2 {t2 ?? '—'}</span>
        <span style={{ color: 'var(--vj-text)' }}>
          Δ {delta ?? '—'}{delta !== null ? ' cyc' : ''}
        </span>
        <span style={{ color: 'var(--vj-text-dim)' }}>
          1/Δ {delta ? (1 / delta).toFixed(3) : '—'}
        </span>
        {selSig && (
          <>
            <span className="border-l pl-4" style={{ borderColor: 'var(--vj-border)', color: 'var(--vj-text-dim)' }}>
              {selSig.name}
            </span>
            <span style={{ color: 'var(--vj-text-dim)' }}>{stats.transitions} edges</span>
            {stats.period !== null && (
              <span style={{ color: 'var(--vj-text-dim)' }}>period {stats.period.toFixed(1)} cyc</span>
            )}
            {stats.duty !== null && (
              <span style={{ color: 'var(--vj-text-dim)' }}>duty {(stats.duty * 100).toFixed(0)}%</span>
            )}
          </>
        )}
        {(t1 !== null || t2 !== null) && (
          <button onClick={() => { setT1(null); setT2(null); }}
                  className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5"
                  style={{ color: 'var(--vj-text-dim)' }} title="Clear cursors (Esc)">
            <X size={11} aria-hidden /> clear
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ── fixed signal-name gutter ─────────────────────────────────── */}
        <div className="shrink-0 overflow-hidden border-r"
             style={{ width: LABEL_W, borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
          <div style={{ height: HEADER_H }} />
          {rows.map(({ sig: s, kind }, i) => {
            const isExpected = kind === 'expected';
            const isOut = s.role === 'output';
            const bad = failSet.size > 0 && isOut && !isExpected;
            const isSel = i === sel;
            return (
              <button key={`${s.name}-${kind}-${i}`} style={{ height: ROW_H }}
                      onClick={() => { setSel(i); svgRef.current?.focus(); }}
                      aria-pressed={isSel}
                      className="flex w-full items-center gap-1 px-2.5 text-left transition-colors"
                      title={isExpected ? `${s.name} — reference` : `${s.name}[${s.width - 1}:0]`}>
                <ChevronRight size={11} className="shrink-0" aria-hidden
                              style={{
                                color: isExpected ? pal.waveExpected : isOut ? pal.wave : pal.dim,
                                opacity: isExpected ? 0.9 : isOut ? 1 : 0.5,
                                transform: isExpected ? 'translateX(4px)' : undefined,
                              }} />
                <span className="truncate text-[11px] font-semibold"
                      style={{
                        color: isExpected ? pal.waveExpected : bad ? pal.bad : pal.label,
                        fontFamily: MONO,
                        textDecoration: isSel ? 'underline' : undefined,
                        textUnderlineOffset: 3,
                      }}>
                  {isExpected ? 'want' : s.name}
                </span>
                {s.width > 1 && !isExpected && (
                  <span className="ml-auto shrink-0 text-[9px]" style={{ color: pal.dim }}>
                    {s.width}b
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── scrolling wave area ──────────────────────────────────────── */}
        <div ref={scrollRef} className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
          <svg
            ref={svgRef}
            width={width} height={height}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="img"
            aria-label={
              `Timing diagram, ${rows.length} signals over ${cycles} cycles.`
              + (failSet.size ? ` ${failSet.size} cycles differ from the reference.` : '')
              + ' Use n and p to step edges, d for the next divergence, arrow keys to move the cursor.'
            }
            style={{ display: 'block', cursor: 'crosshair' }}
          >
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

            {/* selected-row highlight, so edge-stepping has a visible subject */}
            {rows[sel] && (
              <rect x={0} y={HEADER_H + sel * ROW_H} width={width} height={ROW_H}
                    fill={pal.label} opacity={0.05} />
            )}

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

            {/* hover cursor — faint, transient */}
            {hover !== null && hover !== t1 && (
              <line x1={hover * pxPerCycle + pxPerCycle / 2} y1={0}
                    x2={hover * pxPerCycle + pxPerCycle / 2} y2={height}
                    stroke={pal.cursor1} strokeWidth={1} opacity={0.3} strokeDasharray="3 2" />
            )}

            {/* T1 / T2 measurement cursors — solid, labelled, persistent */}
            {t2 !== null && t1 !== null && (
              <rect x={Math.min(t1, t2) * pxPerCycle + pxPerCycle / 2} y={HEADER_H}
                    width={Math.abs(t2 - t1) * pxPerCycle} height={height - HEADER_H}
                    fill={pal.cursor2} opacity={0.07} />
            )}
            {([[t1, pal.cursor1, 'T1'], [t2, pal.cursor2, 'T2']] as const).map(([c, col, tag]) =>
              c === null ? null : (
                <g key={tag}>
                  <line x1={c * pxPerCycle + pxPerCycle / 2} y1={0}
                        x2={c * pxPerCycle + pxPerCycle / 2} y2={height}
                        stroke={col} strokeWidth={1.4} opacity={0.9} />
                  <rect x={c * pxPerCycle + pxPerCycle / 2 - 10} y={0} width={20} height={12}
                        fill={col} rx={2} />
                  <text x={c * pxPerCycle + pxPerCycle / 2} y={9} textAnchor="middle"
                        fontSize={8} fontFamily={MONO} fontWeight="bold"
                        fill="var(--vj-surface-0)">{tag}</text>
                </g>
              ))}
          </svg>
        </div>

        {/* ── cursor readout ───────────────────────────────────────────── */}
        {readAt !== null && (
          <div className="w-48 shrink-0 overflow-y-auto border-l"
               style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
            <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                 style={{ color: 'var(--vj-text-dim)', height: HEADER_H }}>
              <span>cycle {readAt}</span>
              {t2 !== null && <span style={{ color: pal.cursor2 }}>vs T2</span>}
            </div>
            {rows.map(({ sig: s, kind }, i) => {
              const v = s.values[readAt] ?? null;
              const at2 = t2 !== null ? s.values[t2] ?? null : undefined;
              const isExpected = kind === 'expected';
              const isOut = outs.size ? outs.has(s.name) : s.role === 'output';
              const exp = sigOf(expectedTrace, s.name)?.values[readAt];
              const differs = !isExpected && isOut && exp !== undefined && exp !== v;
              return (
                <div key={`${s.name}-${kind}-${i}`} style={{ height: ROW_H }}
                     className="flex flex-col justify-center px-2.5">
                  <div className="flex items-center gap-1.5">
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
                  {at2 !== undefined && at2 !== v && (
                    <div className="text-right text-[9px]" style={{ color: pal.cursor2, fontFamily: MONO }}>
                      T2 {fmt(at2, s.width, radix)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── keyboard hints ──────────────────────────────────────────────── */}
      <div className="border-t px-3 py-1 text-[10px]"
           style={{ borderColor: 'var(--vj-border)', color: 'var(--vj-text-dim)', fontFamily: MONO }}>
        click T1 · shift-click T2 · <kbd>n</kbd>/<kbd>p</kbd> edge
        {failList.length > 0 && <> · <kbd>d</kbd> divergence</>}
        {' '}· <kbd>↑</kbd>/<kbd>↓</kbd> signal · <kbd>f</kbd> fit · <kbd>esc</kbd> clear
      </div>

      {/*
        Accessibility fallback (§13). The SVG above is `role="img"` with a
        summary; this table carries the actual data so a screen-reader user can
        walk it signal by signal. Only transitions are listed — a cycle-by-cycle
        dump of a 256-vector run would be unusable read aloud.
      */}
      <table className="vj-sr-only">
        <caption>
          Timing diagram data. {rows.length} signals over {cycles} cycles.
          {failSet.size > 0 && ` ${failSet.size} cycles differ from the reference.`}
        </caption>
        <thead>
          <tr><th scope="col">Signal</th><th scope="col">Width</th><th scope="col">Transitions</th></tr>
        </thead>
        <tbody>
          {rows.map(({ sig: s, kind }, i) => {
            const edges = edgesOf(s);
            return (
              <tr key={`a11y-${s.name}-${kind}-${i}`}>
                <th scope="row">{kind === 'expected' ? `${s.name} (reference)` : s.name}</th>
                <td>{s.width} bit{s.width === 1 ? '' : 's'}</td>
                <td>
                  {edges.length === 0
                    ? `constant ${fmt(s.values[0] ?? null, s.width, radix)}`
                    : `starts at ${fmt(s.values[0] ?? null, s.width, radix)}, then `
                      + edges.slice(0, 40)
                        .map((c) => `cycle ${c}: ${fmt(s.values[c] ?? null, s.width, radix)}`)
                        .join('; ')
                      + (edges.length > 40 ? `; and ${edges.length - 40} more transitions` : '')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
