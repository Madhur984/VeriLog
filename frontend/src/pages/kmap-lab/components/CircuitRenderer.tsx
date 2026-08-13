
import React, { useMemo, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { simplify } from '../lib/solver/mintermSimplifier';
import { parseBoolean } from '../lib/utils/parseBoolean';
import { buildCircuit, getCanvasSize, GateNode } from '../lib/utils/buildCircuit';
import { GateShape, getOutputPort, getInputPorts } from './circuit/GateShape';
import { Wire, WireGlowFilter } from './circuit/Wire';
import { InfoTooltip } from './InfoTooltip';

// ----------------------------------------------------------------
// CircuitRenderer - full SVG logic circuit diagram
// ----------------------------------------------------------------

export const CircuitRenderer: React.FC = () => {
  const { numVars, minterms, dontCares, solType } = useStore();
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan + zoom state (the SVG fits the whole circuit by default; these let the
  // user inspect a large diagram without it being clipped).
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // ── Derive expression + circuit ──────────────────────────────
  const { expression } = useMemo(
    () => simplify(minterms, dontCares, numVars, solType),
    [minterms, dontCares, numVars, solType]
  );

  const circuit = useMemo(() => {
    const ast = parseBoolean(expression);
    if (!ast) return null;
    return buildCircuit(ast);
  }, [expression]);

  const canvasSize = useMemo(
    () => (circuit ? getCanvasSize(circuit.nodes) : { width: 600, height: 300 }),
    [circuit]
  );

  // ── Drag-to-pan handlers ─────────────────────────────────────
  // Pointer (not mouse) events so the pan works with touch + pen as well as a
  // mouse. touch-action below keeps vertical page scrolling alive on phones
  // while letting a horizontal drag pan the (wide) diagram.
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onPointerUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(3, Math.max(0.4, z - e.deltaY * 0.0015)));
  };
  const resetView = () => { setPan({ x: 0, y: 0 }); setZoom(1); };

  // ── Empty states ─────────────────────────────────────────────
  if (minterms.length === 0) return null;

  const isTrivial = expression === '1' || expression === '0';

  return (
    <div className="glass-card p-4 lg:p-8 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6 gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 p-2 rounded-lg bg-orange-500/15 border border-orange-500/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="6" height="10" rx="2" />
              <rect x="16" y="7" width="6" height="10" rx="2" />
              <path d="M8 12h8M12 7V5M12 19v-2" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-text-main tracking-tight">Circuit Diagram</h3>
              <InfoTooltip
                title="Synthesized Logic Circuit"
                description="Interactive SVG gate schematic generated directly from the simplified Boolean expression. Drag to pan, scroll to zoom, or click 'Fit view'."
                side="top"
              />
            </div>
            <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-0.5 break-words">
              {solType} · <span className="text-accent-orange font-mono">{expression || '-'}</span>
            </p>
          </div>
        </div>
        <button
          onClick={resetView}
          className="shrink-0 min-h-[40px] sm:min-h-0 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-accent-orange transition-colors px-3 py-1.5 rounded-lg border border-border-soft hover:border-accent-orange/30"
        >
          Fit view
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-border-soft bg-bg-base/30"
        style={{ height: 'clamp(300px, 52vw, 480px)', cursor: dragging ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(var(--border-soft) 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Trivial expressions */}
        {isTrivial && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-orange-500/40 flex items-center justify-center bg-orange-500/10">
              <span className="text-2xl font-bold font-mono text-orange-400">{expression}</span>
            </div>
            <p className="text-sm font-semibold text-text-sub">
              {expression === '1' ? 'Tautology - always ON' : 'Contradiction - always OFF'}
            </p>
            <p className="text-xs text-text-dim font-mono uppercase tracking-widest">No gates needed</p>
          </div>
        )}

        {/* No circuit (parse error) */}
        {!circuit && !isTrivial && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600 font-mono text-sm">Unable to parse expression</p>
          </div>
        )}

        {/* SVG Circuit — fills the box and fits the whole diagram (meet), so it's
            never clipped. pan/zoom apply to an inner group for inspection. */}
        {circuit && !isTrivial && (
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0"
          >
            <WireGlowFilter />

            <g
              transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}
              style={{ transition: dragging ? 'none' : 'transform 0.12s ease' }}
            >
              {/* Wires - drawn first so they're under the gates */}
              {circuit.wires.map((wire, i) => {
                const fromNode = circuit.nodes.find(n => n.id === wire.fromId);
                const toNode = circuit.nodes.find(n => n.id === wire.toId);
                if (!fromNode || !toNode) return null;

                const fromPort = getOutputPort(fromNode.type, fromNode.x, fromNode.y);
                // Find which input index this wire connects to on toNode
                const toInputIndex = toNode.inputIds.indexOf(wire.fromId);
                const toPorts = getInputPorts(toNode.type, toNode.x, toNode.y, toNode.inputIds.length);
                const toPort = toPorts[toInputIndex] ?? { x: toNode.x - 26, y: toNode.y };

                return (
                  <Wire
                    key={i}
                    x1={fromPort.x}
                    y1={fromPort.y}
                    x2={toPort.x}
                    y2={toPort.y}
                  />
                );
              })}

              {/* Gates */}
              {circuit.nodes.map(node => (
                <GateShape
                  key={node.id}
                  type={node.type}
                  x={node.x}
                  y={node.y}
                  label={node.label}
                />
              ))}
            </g>
          </svg>
        )}

        {/* Legend */}
        {circuit && !isTrivial && (
          <div className="absolute bottom-3 right-4 flex items-center gap-4 opacity-50 pointer-events-none select-none">
            <Legend color="#fb923c" label="IN/OUT" shape="rect" />
            <Legend color="#f97316" label="Gate" shape="hex" />
            <Legend color="rgba(249,115,22,0.65)" label="Wire" shape="line" />
          </div>
        )}
      </div>

      {/* Gate count info */}
      {circuit && !isTrivial && (
        <div className="mt-4 flex flex-wrap items-center gap-3 lg:gap-5 text-xs font-medium text-text-dim">
          <GateCount nodes={circuit.nodes} type="AND" />
          <div className="hidden sm:block w-px h-3 bg-border-soft" />
          <GateCount nodes={circuit.nodes} type="OR" />
          <div className="hidden sm:block w-px h-3 bg-border-soft" />
          <GateCount nodes={circuit.nodes} type="NOT" />
          <div className="hidden sm:block w-px h-3 bg-border-soft" />
          <GateCount nodes={circuit.nodes} type="INPUT" label="Inputs" />
        </div>
      )}
    </div>
  );
};

// ── Small UI helpers ─────────────────────────────────────────────

const GateCount: React.FC<{ nodes: GateNode[]; type: string; label?: string }> = ({ nodes, type, label }) => {
  const count = nodes.filter(n => n.type === type).length;
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-orange-500/60" />
      {count}× {label ?? type}
    </div>
  );
};

const Legend: React.FC<{ color: string; label: string; shape: 'rect' | 'hex' | 'line' }> = ({ color, label, shape }) => (
  <div className="flex items-center gap-1.5" style={{ color }}>
    {shape === 'rect' && <div className="w-3 h-2 rounded border" style={{ borderColor: color }} />}
    {shape === 'hex' && <div className="w-3 h-3 rounded-sm border" style={{ borderColor: color }} />}
    {shape === 'line' && <div className="w-4 h-px" style={{ background: color }} />}
    <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">{label}</span>
  </div>
);
