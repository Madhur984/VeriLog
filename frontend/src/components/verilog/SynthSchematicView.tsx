/**
 * SynthSchematicView - draws ANY synthesizable Verilog as a block diagram by
 * running the real Yosys engine (WASM, worker) and rendering its netlist, AND
 * makes it a live, probeable circuit: every wire shows its value, you can click
 * inputs to drive them and any wire to force it, and sequential designs get a
 * Clock/Reset. Diagnostics (errors + warnings, with line/signal) are reported up
 * to the page so the editor can mark exactly which wire/line is wrong.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize2, Loader2, AlertTriangle, RefreshCw, Layers, Clock, RotateCcw, Eraser, Info, X,
} from 'lucide-react';
import { synthesize, type SynthProgress } from '../../engine/verilog/yosysClient';
import type { Diag } from '../../engine/verilog/diagnostics';
import { parseYosysNetlist, pinPos, type SynSchematic, type SynNode } from '../../engine/verilog/synthSchematic';
import { buildSim, busValue, type NetlistSim, type Val } from '../../engine/verilog/netlistSim';

const palette = (light: boolean) => ({
  ink: light ? '#475569' : '#cbd5e1',
  inkSoft: light ? '#94a3b8' : '#64748b',
  on: '#10b981', onGlow: '#34d399',
  off: light ? '#cbd5e1' : '#3f4b5e',
  unknown: '#f59e0b',
  bus: light ? '#6366f1' : '#818cf8',
  label: light ? '#1e293b' : '#e2e8f0',
  dim: light ? '#64748b' : '#94a3b8',
  fill: light ? '#ffffff' : '#0a0e1a',
});
type Pal = ReturnType<typeof palette>;

function orthoPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  if (Math.abs(a.y - b.y) < 0.6) return `M ${a.x},${a.y} H ${b.x}`;
  const midX = (a.x + b.x) / 2;
  const dir = b.y > a.y ? 1 : -1;
  const r = Math.max(0, Math.min(7, Math.abs(midX - a.x), Math.abs(b.x - midX), Math.abs(b.y - a.y) / 2));
  return [`M ${a.x},${a.y}`, `H ${midX - r}`, `Q ${midX},${a.y} ${midX},${a.y + dir * r}`, `V ${b.y - dir * r}`, `Q ${midX},${b.y} ${midX + r},${b.y}`, `H ${b.x}`].join(' ');
}

type ValInfo = { num: bigint | null; anyHigh: boolean; anyX: boolean; width: number };
const infoColor = (i: ValInfo | null, pal: Pal): string =>
  !i ? pal.off : i.anyX ? pal.unknown : i.anyHigh ? pal.on : pal.off;
const valText = (i: ValInfo | null): string => {
  if (!i) return '';
  if (i.anyX) return 'x';
  if (i.width === 1) return String(i.anyHigh ? 1 : 0);
  return i.num === null ? 'x' : i.num.toString();
};

// ── one block / terminal ──────────────────────────────────────────────────────
const Block: React.FC<{ n: SynNode; pal: Pal; info: ValInfo | null; onClick?: () => void }>
  = ({ n, pal, info, onClick }) => {
  const cx = n.x + n.w / 2;
  const mono = "'IBM Plex Mono',monospace";
  const live = infoColor(info, pal);
  const isHigh = !!info && !info.anyX && info.anyHigh;

  if (n.kind === 'in' || n.kind === 'out') {
    const isIn = n.kind === 'in';
    const d = isIn
      ? `M ${n.x},${n.y} H ${n.x + n.w - 10} L ${n.x + n.w},${n.y + n.h / 2} L ${n.x + n.w - 10},${n.y + n.h} H ${n.x} Z`
      : `M ${n.x + 10},${n.y} H ${n.x + n.w} V ${n.y + n.h} H ${n.x + 10} L ${n.x},${n.y + n.h / 2} Z`;
    return (
      <g onPointerDown={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <path d={d} fill={isHigh ? `${pal.on}22` : `${pal.inkSoft}1e`} stroke={live} strokeWidth={1.7} strokeLinejoin="round" />
        <text x={isIn ? cx - 5 : cx + 5} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
          fontSize={11} fontWeight={800} fontFamily={mono} fill={pal.label}>{n.label}</text>
        <text x={cx} y={n.y - 5} textAnchor="middle" fontSize={9.5} fontWeight={800} fontFamily={mono} fill={live}>
          {info && info.width > 1 ? `${valText(info)}` : valText(info)}{info && info.width > 1 ? ` [${info.width - 1}:0]` : ''}
        </text>
      </g>
    );
  }

  if (n.kind === 'const') {
    return (
      <g>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={6} fill={isHigh ? `${pal.on}1e` : 'transparent'} stroke={live} strokeWidth={1.5} />
        <text x={cx} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={800} fontFamily={mono} fill={live}>{n.label}</text>
      </g>
    );
  }

  const isMux = n.kind === 'mux';
  const isDff = n.kind === 'dff';
  return (
    <g>
      {isMux ? (
        <path d={`M ${n.x},${n.y} L ${n.x + n.w},${n.y + n.h * 0.28} L ${n.x + n.w},${n.y + n.h * 0.72} L ${n.x},${n.y + n.h} Z`}
          fill={pal.fill} stroke={pal.ink} strokeWidth={1.7} strokeLinejoin="round" />
      ) : (
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={isDff ? 4 : 9} fill={pal.fill} stroke={pal.ink} strokeWidth={1.7} />
      )}
      {isDff && <path d={`M ${n.x},${n.y + n.h / 2 - 6} l 9,6 l -9,6`} fill="none" stroke={pal.ink} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />}
      <text x={cx} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central" fontSize={n.label.length > 4 ? 11 : 13} fontWeight={800} fontFamily={mono} fill={pal.label}>{n.label}</text>
      {n.ins.map((p) => (
        <g key={`i-${p.name}`}>
          <line x1={p.x - 5} y1={p.y} x2={p.x} y2={p.y} stroke={pal.ink} strokeWidth={1.4} />
          {n.ins.length > 1 && <text x={p.x + 4} y={p.y} dominantBaseline="central" fontSize={7.5} fontFamily={mono} fill={pal.dim}>{p.name}</text>}
        </g>
      ))}
      {n.outs.map((p) => <line key={`o-${p.name}`} x1={p.x} y1={p.y} x2={p.x + 5} y2={p.y} stroke={pal.ink} strokeWidth={1.4} />)}
    </g>
  );
};

// ── interactive pan/zoom canvas with live values ──────────────────────────────
type View = { x: number; y: number; w: number; h: number };

const Canvas: React.FC<{ s: SynSchematic; sim: NetlistSim | null; pal: Pal }> = ({ s, sim, pal }) => {
  const [view, setView] = useState<View>({ x: -20, y: -10, w: s.width + 40, h: s.height + 20 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ sx: number; sy: number; vx: number; vy: number; moved: boolean } | null>(null);

  // interactive sim state
  const [drive, setDrive] = useState<Map<string, bigint>>(new Map());
  const [forces, setForces] = useState<Map<number, 0 | 1>>(new Map());
  const [regs, setRegs] = useState<Map<string, Val[]>>(new Map());
  useEffect(() => {
    setDrive(new Map()); setForces(new Map());
    setRegs(sim ? sim.initRegs() : new Map());
  }, [sim]);

  const values = useMemo(() => (sim ? sim.settle(drive, forces, regs) : new Map<number, Val>()), [sim, drive, forces, regs]);

  const infoOf = useCallback((bits: (number | string)[]): ValInfo => {
    const bv = busValue(bits, values);
    return { ...bv, width: bits.length };
  }, [values]);

  const fit = useCallback(() => setView({ x: -20, y: -10, w: s.width + 40, h: s.height + 20 }), [s.width, s.height]);
  useEffect(() => { fit(); }, [fit]);

  const zoomBy = (f: number, cx?: number, cy?: number) => setView((v) => {
    const nw = Math.min(Math.max(v.w / f, 160), 9000);
    const nh = nw * (v.h / v.w);
    const ax = cx ?? v.x + v.w / 2, ay = cy ?? v.y + v.h / 2;
    return { x: ax - (ax - v.x) * (nw / v.w), y: ay - (ay - v.y) * (nh / v.h), w: nw, h: nh };
  });
  const onWheel = (e: React.WheelEvent) => {
    const r = svgRef.current?.getBoundingClientRect(); if (!r) return;
    zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12, view.x + ((e.clientX - r.left) / r.width) * view.w, view.y + ((e.clientY - r.top) / r.height) * view.h);
  };
  const down = (e: React.PointerEvent) => { drag.current = { sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const move = (e: React.PointerEvent) => {
    if (!drag.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - drag.current.sx, dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
    setView((v) => ({ ...v, x: drag.current!.vx - dx * (view.w / r.width), y: drag.current!.vy - dy * (view.h / r.height) }));
  };
  const up = () => { drag.current = null; };

  // drive an input port (toggle 1-bit, increment a bus)
  const driveInput = (n: SynNode) => {
    if (!sim) return;
    const w = n.outs[0]?.bits.length ?? 1;
    setDrive((prev) => {
      const next = new Map(prev);
      const cur = prev.get(n.label) ?? 0n;
      const m = (1n << BigInt(w)) - 1n;
      next.set(n.label, w === 1 ? (cur ^ 1n) & 1n : (cur + 1n) & m);
      return next;
    });
  };
  // force any net (toggle 1-bit, increment a bus); forced bits stay overridden
  const forceNet = (bits: (number | string)[]) => {
    const nums = bits.filter((b): b is number => typeof b === 'number');
    if (!nums.length) return;
    const info = infoOf(bits);
    const w = bits.length;
    const m = (1n << BigInt(w)) - 1n;
    const curr = info.anyX ? 0n : (info.num ?? 0n);
    const nextVal = w === 1 ? ((curr ^ 1n) & 1n) : ((curr + 1n) & m);
    setForces((prev) => {
      const next = new Map(prev);
      bits.forEach((b, i) => { if (typeof b === 'number') next.set(b, (Number((nextVal >> BigInt(i)) & 1n) as 0 | 1)); });
      return next;
    });
  };

  const stepClock = () => sim && setRegs(sim.nextRegs(drive, forces, regs));
  const doReset = () => sim && setRegs(sim.applyReset());

  const ctrlBtn = 'flex h-7 w-7 items-center justify-center rounded-md text-text-dim transition-colors hover:bg-white/5 hover:text-text-main';

  return (
    <div className="relative h-full w-full">
      <svg ref={svgRef} className="absolute inset-0 h-full w-full touch-none" style={{ cursor: drag.current ? 'grabbing' : 'grab' }}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} preserveAspectRatio="xMidYMid meet"
        onWheel={onWheel} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        {/* wires (with a wide transparent hit area so any wire is clickable to force) */}
        {s.edges.map((e, i) => {
          const from = s.byId.get(e.from), to = s.byId.get(e.to);
          if (!from || !to) return null;
          const a = pinPos(from, e.fromPin, 'out'), b = pinPos(to, e.toPin, 'in');
          const d = orthoPath(a, b);
          const pin = from.outs.find((p) => p.name === e.fromPin) ?? from.outs[0];
          const info = pin ? infoOf(pin.bits) : null;
          const col = infoColor(info, pal);
          const bus = e.width > 1;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="transparent" strokeWidth={11} style={{ cursor: 'pointer' }}
                onPointerDown={(ev) => { ev.stopPropagation(); if (pin) forceNet(pin.bits); }} />
              {info && !info.anyX && info.anyHigh && <path d={d} fill="none" stroke={pal.onGlow} strokeWidth={bus ? 5 : 4} opacity={0.16} strokeLinecap="round" strokeLinejoin="round" />}
              <path d={d} fill="none" stroke={col} strokeWidth={bus ? 2.4 : 1.6} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
              {bus && (
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} textAnchor="middle" fontSize={8.5} fontFamily="'IBM Plex Mono',monospace" fill={col} pointerEvents="none">{valText(info)}</text>
              )}
            </g>
          );
        })}
        {/* nodes */}
        {s.nodes.map((n) => {
          const bits = n.kind === 'out' ? (n.ins[0]?.bits ?? []) : (n.outs[0]?.bits ?? []);
          const info = bits.length ? infoOf(bits) : null;
          const onClick = n.kind === 'in' && sim ? () => driveInput(n) : undefined;
          return <Block key={n.id} n={n} pal={pal} info={info} onClick={onClick} />;
        })}
      </svg>

      {/* zoom controls */}
      <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-lg border border-border-soft bg-bg-elev p-0.5">
        <button onClick={() => zoomBy(1.2)} title="Zoom in" className={ctrlBtn}><ZoomIn className="h-4 w-4" /></button>
        <button onClick={() => zoomBy(1 / 1.2)} title="Zoom out" className={ctrlBtn}><ZoomOut className="h-4 w-4" /></button>
        <button onClick={fit} title="Fit" className={ctrlBtn}><Maximize2 className="h-4 w-4" /></button>
      </div>

      {/* sim controls */}
      {sim && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg border border-border-soft bg-bg-elev px-2 py-1">
          {sim.hasClock && (
            <>
              <button onClick={stepClock} title="Advance one clock edge" className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/25">
                <Clock className="h-3.5 w-3.5" /> Clock
              </button>
              <button onClick={doReset} title="Reset registers" className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-bold text-text-dim hover:text-text-main">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </>
          )}
          {forces.size > 0 && (
            <button onClick={() => setForces(new Map())} title="Clear forced wires" className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-bold text-amber-500 hover:text-amber-400">
              <Eraser className="h-3.5 w-3.5" /> {forces.size}
            </button>
          )}
        </div>
      )}

      {/* hint */}
      {sim && sim.inputs.length > 0 && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-border-soft bg-bg-elev px-3 py-1 text-[11px] font-medium text-text-dim">
          tap an input to drive it &middot; tap any wire to force it
        </div>
      )}
    </div>
  );
};

// ── the panel ─────────────────────────────────────────────────────────────────
type Phase = 'running' | 'ready' | 'error';

export const SynthSchematicView: React.FC<{
  code: string; isLight: boolean; headerExtra?: React.ReactNode;
  onDiagnostics?: (d: Diag[]) => void;
  /**
   * Dissolve module hierarchy before drawing. The judge leaves this off — a
   * student's single module has none. The sandbox turns it on so a testbench's
   * DUT instance is drawn as the gates it becomes rather than one opaque block,
   * which also makes the picture agree with the waveform and the cell counts.
   */
  flatten?: boolean;
}> = ({ code, isLight, headerExtra, onDiagnostics, flatten }) => {
  const pal = useMemo(() => palette(isLight), [isLight]);
  const [phase, setPhase] = useState<Phase>('running');
  const [schem, setSchem] = useState<SynSchematic | null>(null);
  const [sim, setSim] = useState<NetlistSim | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [diags, setDiags] = useState<Diag[]>([]);
  const [prog, setProg] = useState<SynthProgress | null>(null);
  const [showDiags, setShowDiags] = useState(false);
  const reqRef = useRef(0);
  const onDiagRef = useRef(onDiagnostics);
  useEffect(() => { onDiagRef.current = onDiagnostics; });

  const runSynth = useCallback((src: string) => {
    setPhase('running'); setErr(null); setShowDiags(false);
    const myReq = ++reqRef.current;
    synthesize(src, (p) => { if (myReq === reqRef.current) setProg(p); }, { flatten }).then((r) => {
      if (myReq !== reqRef.current) return;
      setProg(null);
      setDiags(r.diagnostics);
      onDiagRef.current?.(r.diagnostics);
      if (!r.ok) { setErr(r.error); setSchem(null); setSim(null); setPhase('error'); return; }
      const parsed = parseYosysNetlist(r.json);
      if ('error' in parsed) { setErr(parsed.error); setSchem(null); setSim(null); setPhase('error'); return; }
      setSchem(parsed); setSim(buildSim(r.json)); setPhase('ready');
    });
    // `flatten` is captured in the closure, so it has to be a dependency —
    // otherwise toggling it would keep re-running the previous mode.
  }, [flatten]);

  useEffect(() => {
    const t = setTimeout(() => runSynth(code), 400);
    return () => clearTimeout(t);
  }, [code, runSynth]);

  const downloading = prog && prog.total > 0 && prog.done < prog.total;
  const pct = downloading ? Math.round((prog!.done / prog!.total) * 100) : 0;
  const warnings = diags.filter((d) => d.severity === 'warning');
  const notes = diags.filter((d) => d.severity === 'note');
  const hasDiags = warnings.length > 0 || notes.length > 0;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-bg-void">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border-soft bg-bg-elev px-3 py-1.5">
        <Layers className="h-3.5 w-3.5 text-indigo-400" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Synthesized (Yosys)</span>
        {phase === 'ready' && schem && (
          <span className="font-mono text-[11px] text-text-dim">
            <span className="text-emerald-500">{schem.top}</span> &middot; {schem.stats.cells} cell{schem.stats.cells === 1 ? '' : 's'}
            {schem.stats.regs > 0 && <> &middot; {schem.stats.regs} reg{schem.stats.regs === 1 ? '' : 's'}</>}
          </span>
        )}
        {phase === 'ready' && hasDiags && (
          <button
            onClick={() => setShowDiags((v) => !v)}
            title={showDiags ? 'Hide synthesis notes' : 'Show synthesis notes'}
            className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold transition-colors ${
              warnings.length > 0
                ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                : 'bg-white/5 text-text-dim hover:bg-white/10'
            } ${showDiags ? 'ring-1 ring-inset ring-border-soft' : ''}`}
          >
            {warnings.length > 0 && (
              <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {warnings.length} warning{warnings.length === 1 ? '' : 's'}</span>
            )}
            {notes.length > 0 && (
              <span className="flex items-center gap-1"><Info className="h-3 w-3" /> {notes.length} note{notes.length === 1 ? '' : 's'}</span>
            )}
          </button>
        )}
        {headerExtra}
        {phase === 'ready' && (
          <button onClick={() => runSynth(code)} title="Re-synthesize" className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-text-dim hover:bg-white/5 hover:text-text-main">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.35 }} />

        {phase === 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
            <p className="text-[13px] font-semibold text-text-main">{downloading ? `Loading the Yosys engine... ${pct}%` : 'Synthesizing your design...'}</p>
            {downloading && (
              <>
                <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full bg-indigo-500" animate={{ width: `${pct}%` }} transition={{ ease: 'linear' }} />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">one-time download, cached after</p>
              </>
            )}
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10"><AlertTriangle className="h-6 w-6 text-rose-400" /></div>
            <p className="text-[13px] font-semibold text-text-main">Could not build the circuit</p>
            <div className="max-h-44 max-w-md space-y-1.5 overflow-auto">
              {(() => {
                const shown = diags.filter((d) => d.severity !== 'note');
                return shown.length ? shown : [{ severity: 'error', message: err ?? 'Synthesis failed.' } as Diag];
              })().map((d, i) => <DiagRow key={i} d={d} />)}
            </div>
            <button onClick={() => runSynth(code)} className="flex items-center gap-2 rounded-lg border border-border-soft px-3 py-1.5 text-[12px] font-semibold text-text-dim hover:text-text-main">
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        )}

        {phase === 'ready' && schem && (
          <>
            <Canvas s={schem} sim={sim} pal={pal} />
            {/* Diagnostics are collapsed by default (schematic stays clean) and
                open into a dismissible popover — not a strip that covers the diagram. */}
            {showDiags && hasDiags && (
              <div className="absolute left-2 top-2 z-20 max-h-[62%] w-[min(94%,560px)] overflow-auto rounded-xl border border-border-soft bg-bg-elev/95 shadow-xl backdrop-blur-sm">
                <div className="sticky top-0 flex items-center justify-between border-b border-border-soft bg-bg-elev/95 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Synthesis notes</span>
                  <button onClick={() => setShowDiags(false)} title="Close" className="flex h-6 w-6 items-center justify-center rounded-md text-text-dim hover:bg-white/5 hover:text-text-main">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-0.5 p-1.5">
                  {warnings.map((d, i) => <DiagRow key={`w${i}`} d={d} />)}
                  {notes.length > 0 && (
                    <>
                      {warnings.length > 0 && <div className="my-1 border-t border-border-soft/60" />}
                      <p className="px-2 pb-0.5 pt-1 font-mono text-[9px] uppercase tracking-widest text-text-dim/70">
                        Informational &middot; not problems with your design
                      </p>
                      {notes.map((d, i) => <DiagRow key={`n${i}`} d={d} />)}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const DiagRow: React.FC<{ d: Diag }> = ({ d }) => {
  const tone =
    d.severity === 'error' ? { text: 'text-rose-300', accent: 'text-rose-400' }
    : d.severity === 'warning' ? { text: 'text-amber-300/90', accent: 'text-amber-500' }
    : { text: 'text-text-dim', accent: 'text-text-dim/80' }; // note
  const Icon = d.severity === 'note' ? Info : AlertTriangle;
  return (
    <div className={`flex items-start gap-2 rounded-md px-2 py-1 text-left font-mono text-[11.5px] leading-relaxed ${tone.text}`}>
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone.accent}`} />
      <span>
        {d.line != null && <span className={tone.accent}>L{d.line} </span>}
        {d.signal && <span className="text-text-main">[{d.signal}] </span>}
        {d.message}
      </span>
    </div>
  );
};

export default SynthSchematicView;
