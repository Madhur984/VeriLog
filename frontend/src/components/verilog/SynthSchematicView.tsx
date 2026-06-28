/**
 * SynthSchematicView - draws ANY synthesizable Verilog as a block diagram by
 * running the real Yosys engine (WASM, in a worker) and rendering its netlist.
 * Used by the bench whenever a design is beyond the quick single-bit engine
 * (buses, arithmetic, always blocks, sub-modules, flip-flops). The 43 MB engine
 * is opt-in (downloaded once per session) so we never surprise the user.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize2, Loader2, AlertTriangle, Cpu, Download, RefreshCw, Layers,
} from 'lucide-react';
import { synthesize, engineStarted, type SynthProgress } from '../../engine/verilog/yosysClient';
import { parseYosysNetlist, pinPos, type SynSchematic, type SynNode } from '../../engine/verilog/synthSchematic';

const palette = (light: boolean) => ({
  ink: light ? '#475569' : '#cbd5e1',
  inkSoft: light ? '#94a3b8' : '#64748b',
  accent: '#10b981',
  wire: light ? '#94a3b8' : '#64748b',
  bus: light ? '#6366f1' : '#818cf8',
  label: light ? '#1e293b' : '#e2e8f0',
  dim: light ? '#64748b' : '#94a3b8',
  fill: light ? '#ffffff' : '#0a0e1a',
});

function orthoPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  if (Math.abs(a.y - b.y) < 0.6) return `M ${a.x},${a.y} H ${b.x}`;
  const midX = (a.x + b.x) / 2;
  const dir = b.y > a.y ? 1 : -1;
  const r = Math.max(0, Math.min(7, Math.abs(midX - a.x), Math.abs(b.x - midX), Math.abs(b.y - a.y) / 2));
  return [
    `M ${a.x},${a.y}`, `H ${midX - r}`,
    `Q ${midX},${a.y} ${midX},${a.y + dir * r}`,
    `V ${b.y - dir * r}`,
    `Q ${midX},${b.y} ${midX + r},${b.y}`, `H ${b.x}`,
  ].join(' ');
}

// ── one block / terminal ──────────────────────────────────────────────────────
const Block: React.FC<{ n: SynNode; pal: ReturnType<typeof palette> }> = ({ n, pal }) => {
  const cx = n.x + n.w / 2;
  const mono = "'IBM Plex Mono',monospace";

  if (n.kind === 'in' || n.kind === 'out') {
    const isIn = n.kind === 'in';
    // a flag/terminal pointing into the circuit
    const d = isIn
      ? `M ${n.x},${n.y} H ${n.x + n.w - 10} L ${n.x + n.w},${n.y + n.h / 2} L ${n.x + n.w - 10},${n.y + n.h} H ${n.x} Z`
      : `M ${n.x + 10},${n.y} H ${n.x + n.w} V ${n.y + n.h} H ${n.x + 10} L ${n.x},${n.y + n.h / 2} Z`;
    return (
      <g>
        <path d={d} fill={`${pal.accent}1a`} stroke={pal.accent} strokeWidth={1.6} strokeLinejoin="round" />
        <text x={cx} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
          fontSize={11.5} fontWeight={800} fontFamily={mono} fill={pal.accent}>{n.label}</text>
        {n.width > 1 && (
          <text x={cx} y={n.y - 4} textAnchor="middle" fontSize={8.5} fontFamily={mono} fill={pal.dim}>[{n.width - 1}:0]</text>
        )}
      </g>
    );
  }

  if (n.kind === 'const') {
    return (
      <g>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={6} fill="transparent" stroke={pal.inkSoft} strokeWidth={1.5} />
        <text x={cx} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
          fontSize={13} fontWeight={800} fontFamily={mono} fill={pal.inkSoft}>{n.label}</text>
      </g>
    );
  }

  const isMux = n.kind === 'mux';
  const isDff = n.kind === 'dff';
  const bodyFill = pal.fill;
  return (
    <g>
      {isMux ? (
        <path d={`M ${n.x},${n.y} L ${n.x + n.w},${n.y + n.h * 0.28} L ${n.x + n.w},${n.y + n.h * 0.72} L ${n.x},${n.y + n.h} Z`}
          fill={bodyFill} stroke={pal.ink} strokeWidth={1.7} strokeLinejoin="round" />
      ) : (
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={isDff ? 4 : 9}
          fill={bodyFill} stroke={pal.ink} strokeWidth={1.7} />
      )}
      {isDff && (
        <path d={`M ${n.x},${n.y + n.h / 2 - 6} l 9,6 l -9,6`} fill="none" stroke={pal.ink} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      )}
      <text x={cx} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
        fontSize={n.label.length > 4 ? 11 : 13} fontWeight={800} fontFamily={mono} fill={pal.label}>{n.label}</text>
      {/* pin stubs + names */}
      {n.ins.map((p) => (
        <g key={`i-${p.name}`}>
          <line x1={p.x - 5} y1={p.y} x2={p.x} y2={p.y} stroke={pal.ink} strokeWidth={1.4} />
          {n.ins.length > 1 && <text x={p.x + 4} y={p.y} dominantBaseline="central" fontSize={7.5} fontFamily={mono} fill={pal.dim}>{p.name}</text>}
        </g>
      ))}
      {n.outs.map((p) => (
        <g key={`o-${p.name}`}>
          <line x1={p.x} y1={p.y} x2={p.x + 5} y2={p.y} stroke={pal.ink} strokeWidth={1.4} />
        </g>
      ))}
    </g>
  );
};

// ── pan/zoom canvas ───────────────────────────────────────────────────────────
type View = { x: number; y: number; w: number; h: number };

const Canvas: React.FC<{ s: SynSchematic; pal: ReturnType<typeof palette>; isLight: boolean }> = ({ s, pal }) => {
  const [view, setView] = useState<View>({ x: -20, y: -10, w: s.width + 40, h: s.height + 20 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ sx: number; sy: number; vx: number; vy: number } | null>(null);

  const fit = useCallback(() => setView({ x: -20, y: -10, w: s.width + 40, h: s.height + 20 }), [s.width, s.height]);
  useEffect(() => { fit(); }, [fit]);

  const zoomBy = (f: number, cx?: number, cy?: number) => setView((v) => {
    const nw = Math.min(Math.max(v.w / f, 160), 8000);
    const nh = nw * (v.h / v.w);
    const ax = cx ?? v.x + v.w / 2, ay = cy ?? v.y + v.h / 2;
    return { x: ax - (ax - v.x) * (nw / v.w), y: ay - (ay - v.y) * (nh / v.h), w: nw, h: nh };
  });
  const onWheel = (e: React.WheelEvent) => {
    const r = svgRef.current?.getBoundingClientRect(); if (!r) return;
    const cx = view.x + ((e.clientX - r.left) / r.width) * view.w;
    const cy = view.y + ((e.clientY - r.top) / r.height) * view.h;
    zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12, cx, cy);
  };
  const down = (e: React.PointerEvent) => { drag.current = { sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const move = (e: React.PointerEvent) => {
    if (!drag.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    setView((v) => ({ ...v, x: drag.current!.vx - (e.clientX - drag.current!.sx) * (view.w / r.width), y: drag.current!.vy - (e.clientY - drag.current!.sy) * (view.h / r.height) }));
  };
  const up = () => { drag.current = null; };
  const ctrlBtn = 'flex h-7 w-7 items-center justify-center rounded-md text-text-dim transition-colors hover:bg-white/5 hover:text-text-main';

  return (
    <div className="relative h-full w-full">
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full touch-none"
        style={{ cursor: drag.current ? 'grabbing' : 'grab' }}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        preserveAspectRatio="xMidYMid meet"
        onWheel={onWheel} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
      >
        {s.edges.map((e, i) => {
          const from = s.byId.get(e.from), to = s.byId.get(e.to);
          if (!from || !to) return null;
          const a = pinPos(from, e.fromPin, 'out');
          const b = pinPos(to, e.toPin, 'in');
          const bus = e.width > 1;
          return (
            <g key={i}>
              <path d={orthoPath(a, b)} fill="none" stroke={bus ? pal.bus : pal.wire}
                strokeWidth={bus ? 2.4 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
              {bus && (
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} textAnchor="middle"
                  fontSize={8} fontFamily="'IBM Plex Mono',monospace" fill={pal.bus}>{e.width}</text>
              )}
            </g>
          );
        })}
        {s.nodes.map((n) => <Block key={n.id} n={n} pal={pal} />)}
      </svg>
      <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-lg border border-border-soft bg-bg-elev/90 p-0.5 backdrop-blur">
        <button onClick={() => zoomBy(1.2)} title="Zoom in" className={ctrlBtn}><ZoomIn className="h-4 w-4" /></button>
        <button onClick={() => zoomBy(1 / 1.2)} title="Zoom out" className={ctrlBtn}><ZoomOut className="h-4 w-4" /></button>
        <button onClick={fit} title="Fit" className={ctrlBtn}><Maximize2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

// ── the panel ─────────────────────────────────────────────────────────────────
type Phase = 'idle' | 'running' | 'ready' | 'error';

export const SynthSchematicView: React.FC<{ code: string; isLight: boolean; miniError?: string | null; headerExtra?: React.ReactNode }>
  = ({ code, isLight, miniError, headerExtra }) => {
  const pal = useMemo(() => palette(isLight), [isLight]);
  const [phase, setPhase] = useState<Phase>(engineStarted() ? 'running' : 'idle');
  const [schem, setSchem] = useState<SynSchematic | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [prog, setProg] = useState<SynthProgress | null>(null);
  const reqRef = useRef(0);

  const runSynth = useCallback((src: string) => {
    setPhase('running'); setErr(null);
    const myReq = ++reqRef.current;
    synthesize(src, (p) => { if (myReq === reqRef.current) setProg(p); }).then((r) => {
      if (myReq !== reqRef.current) return;
      setProg(null);
      if (!r.ok) { setErr(r.error); setSchem(null); setPhase('error'); return; }
      const parsed = parseYosysNetlist(r.json);
      if ('error' in parsed) { setErr(parsed.error); setSchem(null); setPhase('error'); return; }
      setSchem(parsed); setPhase('ready');
    });
  }, []);

  // once the engine is live, re-synthesize on a debounce as the code changes
  useEffect(() => {
    if (!engineStarted()) return;
    const t = setTimeout(() => runSynth(code), 450);
    return () => clearTimeout(t);
  }, [code, runSynth]);

  const downloading = prog && prog.total > 0 && prog.done < prog.total;
  const pct = downloading ? Math.round((prog!.done / prog!.total) * 100) : 0;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-bg-void">
      {/* HUD */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border-soft bg-bg-elev px-3 py-1.5">
        <Layers className="h-3.5 w-3.5 text-indigo-400" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Synthesized (Yosys)</span>
        {phase === 'ready' && schem && (
          <span className="font-mono text-[11px] text-text-dim">
            <span className="text-emerald-500">{schem.top}</span> &middot; {schem.stats.cells} cell{schem.stats.cells === 1 ? '' : 's'}
            {schem.stats.regs > 0 && <> &middot; {schem.stats.regs} reg{schem.stats.regs === 1 ? '' : 's'}</>}
          </span>
        )}
        {headerExtra}
        {phase === 'ready' && (
          <button onClick={() => runSynth(code)} title="Re-synthesize" className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-text-dim hover:bg-white/5 hover:text-text-main">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* body */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)',
            backgroundSize: '26px 26px', opacity: 0.35,
          }} />

        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
              <Cpu className="h-7 w-7 text-indigo-400" />
            </div>
            <div className="max-w-sm space-y-1.5">
              <p className="text-[14px] font-bold text-text-main">This design needs the full synthesizer</p>
              <p className="text-[12.5px] leading-relaxed text-text-dim">
                It uses Verilog beyond the quick engine (buses, arithmetic, <span className="font-mono">always</span> blocks, sub-modules...).
                Run the real Yosys synthesizer to turn it into a circuit. First use downloads the engine once (~50 MB, then cached).
              </p>
              {miniError && <p className="font-mono text-[11px] text-amber-500/80">quick engine: {miniError}</p>}
            </div>
            <button onClick={() => runSynth(code)}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-indigo-400 active:scale-95">
              <Download className="h-4 w-4" /> Synthesize with Yosys
            </button>
          </div>
        )}

        {phase === 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
            <p className="text-[13px] font-semibold text-text-main">
              {downloading ? `Downloading the Yosys engine... ${pct}%` : 'Synthesizing your design...'}
            </p>
            {downloading && (
              <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-indigo-500" animate={{ width: `${pct}%` }} transition={{ ease: 'linear' }} />
              </div>
            )}
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">one-time download, cached after</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10">
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            </div>
            <p className="text-[13px] font-semibold text-text-main">Synthesis failed</p>
            <pre className="max-h-40 max-w-md overflow-auto whitespace-pre-wrap rounded-lg border border-rose-500/25 bg-rose-500/5 p-3 text-left font-mono text-[11.5px] leading-relaxed text-rose-300">{err}</pre>
            <button onClick={() => runSynth(code)} className="flex items-center gap-2 rounded-lg border border-border-soft px-3 py-1.5 text-[12px] font-semibold text-text-dim hover:text-text-main">
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        )}

        {phase === 'ready' && schem && <Canvas s={schem} pal={pal} isLight={isLight} />}
      </div>
    </div>
  );
};

export default SynthSchematicView;
