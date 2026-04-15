"use client";
import React, { useMemo, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { simplify } from '@/lib/solver/mintermSimplifier';
import { parseBoolean } from '@/lib/utils/parseBoolean';
import { buildCircuit, getCanvasSize, GateNode } from '@/lib/utils/buildCircuit';
import { GateShape, getOutputPort, getInputPorts } from './circuit/GateShape';
import { Wire, WireGlowFilter } from './circuit/Wire';

// ----------------------------------------------------------------
// CircuitRenderer — full SVG logic circuit diagram
// ----------------------------------------------------------------

export const CircuitRenderer: React.FC = () => {
  const { numVars, minterms, dontCares, solType } = useStore();
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
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
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);

  // ── Empty states ─────────────────────────────────────────────
  if (minterms.length === 0) return null;

  const isTrivial = expression === '1' || expression === '0';

  return (
    <div className="glass-card p-8 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/15 border border-orange-500/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="6" height="10" rx="2" />
              <rect x="16" y="7" width="6" height="10" rx="2" />
              <path d="M8 12h8M12 7V5M12 19v-2" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Circuit Diagram</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              {solType} · <span className="text-orange-400 font-mono">{expression || '—'}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setPan({ x: 0, y: 0 })}
          className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-orange-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-orange-500/30"
        >
          Reset view
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/5 bg-black/50"
        style={{ height: 360, cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Trivial expressions */}
        {isTrivial && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-orange-500/40 flex items-center justify-center bg-orange-500/10">
              <span className="text-2xl font-bold font-mono text-orange-400">{expression}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {expression === '1' ? 'Tautology — always ON' : 'Contradiction — always OFF'}
            </p>
            <p className="text-xs text-gray-700 font-mono uppercase tracking-widest">No gates needed</p>
          </div>
        )}

        {/* No circuit (parse error) */}
        {!circuit && !isTrivial && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600 font-mono text-sm">Unable to parse expression</p>
          </div>
        )}

        {/* SVG Circuit */}
        {circuit && !isTrivial && (
          <svg
            ref={svgRef}
            width={canvasSize.width}
            height={canvasSize.height}
            viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px)`, transition: dragging ? 'none' : 'transform 0.15s ease' }}
            className="absolute top-0 left-0"
          >
            <WireGlowFilter />

            {/* Wires — drawn first so they're under the gates */}
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
        <div className="mt-4 flex items-center gap-5 text-xs font-medium text-gray-500">
          <GateCount nodes={circuit.nodes} type="AND" />
          <div className="w-px h-3 bg-white/10" />
          <GateCount nodes={circuit.nodes} type="OR" />
          <div className="w-px h-3 bg-white/10" />
          <GateCount nodes={circuit.nodes} type="NOT" />
          <div className="w-px h-3 bg-white/10" />
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
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{label}</span>
  </div>
);
