/**
 * SchematicView - the live gate-level circuit that mirrors the Verilog in the
 * editor. The page compiles the source and hands us a ready-built `schematic`
 * (or an `error` string); here we just draw it, let you flip the input switches
 * to watch current flow, and pan / zoom around the board.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Play, Pause, Hand, Waypoints } from 'lucide-react';
import type { Bit } from '../../engine/verilog/miniSim';
import { evalSchematic, type Schematic, type SNode } from '../../engine/verilog/schematic';

// ── theme-aware colours ──────────────────────────────────────────────────────
const palette = (light: boolean) => ({
  ink: light ? '#475569' : '#cbd5e1',          // gate outline
  inkSoft: light ? '#94a3b8' : '#64748b',
  on: '#10b981',                                // logic 1
  onGlow: '#34d399',
  off: light ? '#cbd5e1' : '#3f4b5e',           // logic 0 wire
  unknown: '#f59e0b',                           // floating / unresolved
  label: light ? '#334155' : '#e2e8f0',
  dim: light ? '#64748b' : '#94a3b8',
});

// ── per-kind geometry (all offsets relative to the node centre) ───────────────
type Geo = { nose: number; out: number; bubble: boolean; bubbleX: number; inX: number };
const GEO: Record<string, Geo> = {
  and: { nose: 14, out: 32, bubble: false, bubbleX: 0, inX: -22 },
  nand: { nose: 14, out: 36, bubble: true, bubbleX: 18, inX: -22 },
  or: { nose: 30, out: 34, bubble: false, bubbleX: 0, inX: -22 },
  nor: { nose: 30, out: 38, bubble: true, bubbleX: 34, inX: -22 },
  xor: { nose: 30, out: 34, bubble: false, bubbleX: 0, inX: -24 },
  xnor: { nose: 30, out: 38, bubble: true, bubbleX: 34, inX: -24 },
  not: { nose: 14, out: 30, bubble: true, bubbleX: 18, inX: -16 },
  buf: { nose: 14, out: 28, bubble: false, bubbleX: 0, inX: -16 },
  mux: { nose: 14, out: 32, bubble: false, bubbleX: 0, inX: -16 },
};

const spreadY = (n: number): number[] => {
  if (n <= 1) return [0];
  const span = Math.min(30, 13 * (n - 1));
  return Array.from({ length: n }, (_, i) => -span / 2 + (span * i) / (n - 1));
};

/** Absolute coord of input port `port` on a node. */
function inPort(node: SNode, port: number): { x: number; y: number } {
  const k = node.kind;
  if (k === 'mux') {
    if (port === 0) return { x: node.x - 2, y: node.y + 22 };       // select (bottom)
    if (port === 1) return { x: node.x - 16, y: node.y - 9 };       // in0
    return { x: node.x - 16, y: node.y + 9 };                       // in1
  }
  if (k === 'output') return { x: node.x - 16, y: node.y };
  const g = GEO[k];
  const xs = g ? g.inX : -16;
  const ys = spreadY(node.ins.length);
  return { x: node.x + xs, y: node.y + (ys[port] ?? 0) };
}

/** Absolute coord of a node's single output port. */
function outPort(node: SNode): { x: number; y: number } {
  if (node.kind === 'input') return { x: node.x + 24, y: node.y };
  if (node.kind === 'const') return { x: node.x + 14, y: node.y };
  if (node.kind === 'output') return { x: node.x, y: node.y };
  const g = GEO[node.kind];
  return { x: node.x + (g ? g.out : 28), y: node.y };
}

// ── gate body paths (centred at origin) ──────────────────────────────────────
function bodyPath(kind: string): string {
  switch (kind) {
    case 'and':
    case 'nand':
      return 'M -22,-18 L -4,-18 A 18,18 0 0 1 -4,18 L -22,18 Z';
    case 'or':
    case 'nor':
      return 'M -24,-18 Q -8,-18 6,-18 Q 22,-9 30,0 Q 22,9 6,18 Q -8,18 -24,18 Q -11,0 -24,-18 Z';
    case 'xor':
    case 'xnor':
      return 'M -20,-18 Q -4,-18 10,-18 Q 24,-9 30,0 Q 24,9 10,18 Q -4,18 -20,18 Q -7,0 -20,-18 Z';
    case 'not':
    case 'buf':
      return 'M -16,-14 L -16,14 L 14,0 Z';
    case 'mux':
      return 'M -16,-22 L 14,-12 L 14,12 L -16,22 Z';
    default:
      return '';
  }
}

// ── wire (rounded orthogonal / Manhattan routing, like a real schematic) ──────
function orthoPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  if (Math.abs(a.y - b.y) < 0.6) return `M ${a.x},${a.y} H ${b.x}`;
  const midX = (a.x + b.x) / 2;
  const dir = b.y > a.y ? 1 : -1;
  const r = Math.max(0, Math.min(7, Math.abs(midX - a.x), Math.abs(b.x - midX), Math.abs(b.y - a.y) / 2));
  return [
    `M ${a.x},${a.y}`,
    `H ${midX - r}`,
    `Q ${midX},${a.y} ${midX},${a.y + dir * r}`,
    `V ${b.y - dir * r}`,
    `Q ${midX},${b.y} ${midX + r},${b.y}`,
    `H ${b.x}`,
  ].join(' ');
}

const Wire: React.FC<{ a: { x: number; y: number }; b: { x: number; y: number }; v: Bit | null; pal: ReturnType<typeof palette> }>
  = ({ a, b, v, pal }) => {
    const d = orthoPath(a, b);
    const color = v === 1 ? pal.on : v === null ? pal.unknown : pal.off;
    const live = v === 1;
    return (
      <g>
        {live && <path d={d} fill="none" stroke={pal.onGlow} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.16} />}
        <path
          d={d} fill="none" stroke={color}
          strokeWidth={live ? 2.1 : 1.5}
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={v === null ? '4 4' : undefined}
          className={v === null ? 'vj-pulse' : undefined}
        />
      </g>
    );
  };

// ── one node glyph ────────────────────────────────────────────────────────────
const Glyph: React.FC<{
  node: SNode; v: Bit | null; pal: ReturnType<typeof palette>; light: boolean;
  onToggle?: (name: string) => void;
}> = ({ node, v, pal, onToggle }) => {
  const on = v === 1;
  const stroke = on ? pal.on : pal.ink;

  // INPUT - a clickable little switch
  if (node.kind === 'input') {
    return (
      <g
        transform={`translate(${node.x},${node.y})`}
        onPointerDown={(e) => { e.stopPropagation(); onToggle?.(node.label); }}
        style={{ cursor: onToggle ? 'pointer' : 'default' }}
      >
        <rect x={-34} y={-15} width={56} height={30} rx={15}
          fill={on ? 'rgba(16,185,129,0.16)' : 'rgba(148,163,184,0.12)'}
          stroke={on ? pal.on : pal.inkSoft} strokeWidth={1.6} />
        <motion.circle cx={on ? 8 : -20} cy={0} r={10}
          animate={{ cx: on ? 8 : -20 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          fill={on ? pal.on : pal.inkSoft} />
        <text x={on ? -18 : 0} y={1} textAnchor="middle" dominantBaseline="central"
          fontSize={11} fontWeight={800} fontFamily="'IBM Plex Mono',monospace"
          fill={on ? '#fff' : pal.label}>{node.label}</text>
        <text x={0} y={-26} textAnchor="middle" fontSize={9} fontWeight={700}
          fontFamily="'IBM Plex Mono',monospace" fill={pal.dim}>{node.label}</text>
      </g>
    );
  }

  // CONST - a small source box
  if (node.kind === 'const') {
    return (
      <g transform={`translate(${node.x},${node.y})`}>
        <rect x={-13} y={-13} width={26} height={26} rx={6}
          fill={on ? 'rgba(16,185,129,0.16)' : 'transparent'} stroke={stroke} strokeWidth={1.6} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={800}
          fontFamily="'IBM Plex Mono',monospace" fill={stroke}>{node.label}</text>
      </g>
    );
  }

  // OUTPUT - a lamp that glows on 1
  if (node.kind === 'output') {
    return (
      <g transform={`translate(${node.x},${node.y})`}>
        {on && <circle r={20} fill={pal.onGlow} opacity={0.22} />}
        <circle r={15} fill={on ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.08)'}
          stroke={on ? pal.on : pal.inkSoft} strokeWidth={1.8} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={800}
          fontFamily="'IBM Plex Mono',monospace" fill={on ? pal.on : pal.dim}>
          {v === null ? '?' : v}
        </text>
        <text x={0} y={28} textAnchor="middle" fontSize={9.5} fontWeight={800}
          fontFamily="'IBM Plex Mono',monospace" fill={pal.label}>{node.label}</text>
      </g>
    );
  }

  // GATE
  const g = GEO[node.kind] ?? GEO.buf;
  return (
    <g transform={`translate(${node.x},${node.y})`}>
      {on && <path d={bodyPath(node.kind)} fill="none" stroke={pal.onGlow} strokeWidth={4} opacity={0.18} />}
      <path d={bodyPath(node.kind)} fill={on ? 'rgba(16,185,129,0.10)' : 'transparent'}
        stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" />
      {/* output bubble for negated gates */}
      {g.bubble && <circle cx={g.bubbleX} cy={0} r={3.6} fill="none" stroke={stroke} strokeWidth={1.8} />}
      {/* output stub */}
      <line x1={g.bubble ? g.bubbleX + 3.6 : g.nose} y1={0} x2={g.out} y2={0} stroke={stroke} strokeWidth={1.8} />
      {/* mux select / data hints */}
      {node.kind === 'mux' && (
        <>
          <text x={-9} y={-9} textAnchor="middle" dominantBaseline="central" fontSize={7.5} fill={pal.dim} fontFamily="monospace">0</text>
          <text x={-9} y={9} textAnchor="middle" dominantBaseline="central" fontSize={7.5} fill={pal.dim} fontFamily="monospace">1</text>
        </>
      )}
      <text x={node.kind === 'and' || node.kind === 'nand' ? -2 : node.kind === 'mux' ? 1 : 2} y={0}
        textAnchor="middle" dominantBaseline="central" fontSize={node.kind === 'mux' ? 7.5 : 8.5}
        fontWeight={800} fontFamily="'IBM Plex Mono',monospace" fill={on ? pal.on : pal.dim} letterSpacing="0.02em">
        {node.label}
      </text>
    </g>
  );
};

// ── the panel ─────────────────────────────────────────────────────────────────
type View = { x: number; y: number; w: number; h: number };

export const SchematicView: React.FC<{ schematic: Schematic | null; error: string | null; isLight: boolean; headerExtra?: React.ReactNode }> = ({ schematic, error, isLight, headerExtra }) => {
  const pal = useMemo(() => palette(isLight), [isLight]);

  // probe values for the live inputs (default all 0)
  const [probe, setProbe] = useState<Record<string, Bit>>({});
  useEffect(() => {
    if (!schematic) return;
    setProbe((prev) => {
      const next: Record<string, Bit> = {};
      for (const name of schematic.inputs) next[name] = prev[name] ?? 0;
      return next;
    });
  }, [schematic]);

  const values = useMemo(
    () => (schematic ? evalSchematic(schematic, probe) : new Map<string, Bit | null>()),
    [schematic, probe],
  );

  // driver pins that feed more than one sink - drawn as solder junction dots
  const fanout = useMemo(() => {
    if (!schematic) return [] as { id: string; x: number; y: number }[];
    const counts = new Map<string, number>();
    schematic.wires.forEach((w) => counts.set(w.from, (counts.get(w.from) ?? 0) + 1));
    const out: { id: string; x: number; y: number }[] = [];
    counts.forEach((c, id) => {
      if (c < 2) return;
      const n = schematic.byId.get(id);
      if (!n) return;
      const p = outPort(n);
      out.push({ id, x: p.x, y: p.y });
    });
    return out;
  }, [schematic]);

  const toggle = (name: string) => setProbe((p) => ({ ...p, [name]: (p[name] ? 0 : 1) as Bit }));

  // auto-scan: cycle every input combination so the whole truth table animates
  const [scan, setScan] = useState(false);
  useEffect(() => {
    if (!scan || !schematic || schematic.inputs.length === 0) return;
    let m = 0;
    const n = schematic.inputs.length;
    const tick = () => {
      const next: Record<string, Bit> = {};
      schematic.inputs.forEach((name, i) => { next[name] = ((m >> (n - 1 - i)) & 1) as Bit; });
      setProbe(next);
      m = (m + 1) % (1 << n);
    };
    tick();
    const id = setInterval(tick, 900);
    return () => clearInterval(id);
  }, [scan, schematic]);

  // ── pan / zoom via viewBox ──────────────────────────────────────────────────
  const [view, setView] = useState<View>({ x: 0, y: 0, w: 600, h: 360 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ sx: number; sy: number; vx: number; vy: number } | null>(null);

  const fit = (s: Schematic | null) => {
    if (s) setView({ x: -20, y: -10, w: s.width + 40, h: s.height + 20 });
  };
  useEffect(() => { fit(schematic); /* re-fit when the design changes shape */ }, [schematic?.width, schematic?.height]);

  const zoomBy = (factor: number, cx?: number, cy?: number) => {
    setView((v) => {
      const nw = Math.min(Math.max(v.w / factor, 160), 4000);
      const nh = nw * (v.h / v.w);
      const ax = cx ?? v.x + v.w / 2;
      const ay = cy ?? v.y + v.h / 2;
      return { x: ax - (ax - v.x) * (nw / v.w), y: ay - (ay - v.y) * (nh / v.h), w: nw, h: nh };
    });
  };

  const onWheel = (e: React.WheelEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = view.x + ((e.clientX - rect.left) / rect.width) * view.w;
    const cy = view.y + ((e.clientY - rect.top) / rect.height) * view.h;
    zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12, cx, cy);
  };
  const onPanDown = (e: React.PointerEvent) => {
    drag.current = { sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPanMove = (e: React.PointerEvent) => {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = (e.clientX - drag.current.sx) * (view.w / rect.width);
    const dy = (e.clientY - drag.current.sy) * (view.h / rect.height);
    setView((v) => ({ ...v, x: drag.current!.vx - dx, y: drag.current!.vy - dy }));
  };
  const onPanUp = () => { drag.current = null; };

  const ctrlBtn = 'flex h-7 w-7 items-center justify-center rounded-md text-text-dim transition-colors hover:bg-white/5 hover:text-text-main';

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-bg-void">
      <style>{`
        @keyframes vjflow { to { stroke-dashoffset: -28; } }
        @keyframes vjpulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        .vj-flow { animation: vjflow .6s linear infinite; }
        .vj-pulse { animation: vjpulse 1.1s ease-in-out infinite; }
      `}</style>

      {/* HUD */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border-soft bg-bg-elev px-3 py-1.5">
        <Waypoints className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Schematic</span>
        {schematic ? (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500/90">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {schematic.gateCount} gate{schematic.gateCount === 1 ? '' : 's'}
          </span>
        ) : (
          <span className="font-mono text-[11px] text-amber-500/90">no valid design</span>
        )}
        {headerExtra}

        <div className="ml-auto flex items-center gap-0.5">
          {schematic && schematic.inputs.length > 0 && (
            <button onClick={() => setScan((s) => !s)} title={scan ? 'Stop auto-scan' : 'Auto-scan every input combo'}
              className={`mr-1 flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${scan ? 'bg-emerald-500/15 text-emerald-400' : 'text-text-dim hover:text-text-main'}`}>
              {scan ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} Scan
            </button>
          )}
          <button onClick={() => zoomBy(1.2)} title="Zoom in" className={ctrlBtn}><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => zoomBy(1 / 1.2)} title="Zoom out" className={ctrlBtn}><ZoomOut className="h-4 w-4" /></button>
          <button onClick={() => fit(schematic)} title="Fit to view" className={ctrlBtn}><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>

      {/* canvas */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* blueprint grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)',
            backgroundSize: '26px 26px', opacity: 0.4,
          }} />

        <AnimatePresence mode="wait">
          {schematic ? (
            <motion.svg
              key="svg"
              ref={svgRef}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full touch-none"
              style={{ cursor: drag.current ? 'grabbing' : 'grab' }}
              viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
              preserveAspectRatio="xMidYMid meet"
              onWheel={onWheel}
              onPointerDown={onPanDown}
              onPointerMove={onPanMove}
              onPointerUp={onPanUp}
              onPointerLeave={onPanUp}
            >
              {schematic.wires.map((w, i) => {
                const from = schematic.byId.get(w.from);
                const to = schematic.byId.get(w.to);
                if (!from || !to) return null;
                return <Wire key={i} a={outPort(from)} b={inPort(to, w.port)} v={values.get(w.from) ?? null} pal={pal} />;
              })}
              {/* solder dots where a net fans out to more than one sink */}
              {fanout.map(({ id, x, y }) => {
                const on = values.get(id) === 1;
                return <circle key={`j-${id}`} cx={x} cy={y} r={3.2} fill={on ? pal.on : pal.ink} />;
              })}
              {schematic.nodes.map((n) => (
                <Glyph key={n.id} node={n} v={values.get(n.id) ?? null} pal={pal} light={isLight}
                  onToggle={n.kind === 'input' && !scan ? toggle : undefined} />
              ))}
            </motion.svg>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
            >
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#94a3b8' : '#64748b'} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
                <path d="M6 5 H12 A7 7 0 0 1 12 19 H6 Z" />
                <path d="M3 9 H6 M3 15 H6 M19 12 H21" />
              </svg>
              <p className="max-w-xs text-[13px] font-semibold text-text-main">
                The board lights up as soon as your Verilog elaborates.
              </p>
              {error && (
                <p className="max-w-md rounded-md border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-left font-mono text-[12px] leading-relaxed text-amber-500/90">
                  {error}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* hint pill */}
        {schematic && schematic.inputs.length > 0 && !scan && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border-soft bg-bg-elev/90 px-3 py-1 text-[11px] font-medium text-text-dim backdrop-blur">
            <Hand className="h-3.5 w-3.5 text-emerald-500" /> Tap a switch to drive the inputs
          </div>
        )}
      </div>
    </div>
  );
};

export default SchematicView;
