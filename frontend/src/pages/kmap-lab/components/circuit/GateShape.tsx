import React from 'react';
import { GateType } from '../../lib/utils/buildCircuit';

const GATE_W = 52;

interface GateShapeProps {
  type: GateType;
  x: number;
  y: number;
  label: string;
}

// ---------- Gate SVG path definitions (centered at 0,0) ----------

function AndGatePath() {
  // Flat left, D-curve right. Input ports at (-26, -10) and (-26, 10), output at (26, 0)
  return (
    <path
      d={`M -26,-18 L 0,-18 A 18,18 0 0,1 0,18 L -26,18 Z`}
      fill="none"
      stroke="#f97316"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function OrGatePath() {
  // Curved left (concave), pointed right. Standard IEEE OR shape.
  return (
    <path
      d={`M -26,-18 Q -10,-18 10,-18 Q 28,-10 28,0 Q 28,10 10,18 Q -10,18 -26,18 Q -12,0 -26,-18 Z`}
      fill="none"
      stroke="#f97316"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function NotGatePath() {
  // Triangle pointing right + small circle on output
  return (
    <>
      <path
        d={`M -20,-14 L -20,14 L 18,0 Z`}
        fill="none"
        stroke="#f97316"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={21} cy={0} r={3.5} fill="none" stroke="#f97316" strokeWidth="1.8" />
    </>
  );
}

// ---------- GateShape component ----------

export const GateShape: React.FC<GateShapeProps> = ({ type, x, y, label }) => {
  const isInput = type === 'INPUT';
  const isOutput = type === 'OUTPUT';

  if (isInput) {
    return (
      <g transform={`translate(${x},${y})`}>
        {/* Rounded rect terminal */}
        <rect
          x={-22} y={-14} width={44} height={28}
          rx={6}
          fill="rgba(249,115,22,0.08)"
          stroke="rgba(249,115,22,0.6)"
          strokeWidth="1.4"
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          fontWeight="700"
          fontFamily="'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace"
          fill="#fb923c"
        >
          {label}
        </text>
      </g>
    );
  }

  if (isOutput) {
    return (
      <g transform={`translate(${x},${y})`}>
        <circle
          cx={0} cy={0} r={18}
          fill="rgba(249,115,22,0.12)"
          stroke="#f97316"
          strokeWidth="1.8"
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          fontWeight="700"
          fontFamily="'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace"
          fill="#f97316"
        >
          {label}
        </text>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Gate shadow glow */}
      <g opacity={0.15}>
        {type === 'AND' && <AndGatePath />}
        {type === 'OR' && <OrGatePath />}
        {type === 'NOT' && <NotGatePath />}
      </g>

      {/* Gate body */}
      {type === 'AND' && <AndGatePath />}
      {type === 'OR' && <OrGatePath />}
      {type === 'NOT' && <NotGatePath />}

      {/* Gate label below */}
      <text
        y={26}
        textAnchor="middle"
        fontSize={9}
        fontWeight="600"
        fontFamily="'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace"
        fill="rgba(249,115,22,0.55)"
        letterSpacing="0.08em"
      >
        {label}
      </text>
    </g>
  );
};

// Port offset helpers - where to connect wires
export function getOutputPort(type: GateType, x: number, y: number): { x: number; y: number } {
  if (type === 'INPUT') return { x: x + 22, y };
  if (type === 'OUTPUT') return { x: x - 18, y };
  if (type === 'NOT') return { x: x + 25, y };   // tip of circle
  if (type === 'AND') return { x: x + 26, y };
  if (type === 'OR') return { x: x + 28, y };
  return { x: x + GATE_W / 2, y };
}

export function getInputPorts(type: GateType, x: number, y: number, count: number): Array<{ x: number; y: number }> {
  if (type === 'AND' || type === 'OR') {
    return Array.from({ length: count }, (_, i) => ({
      x: type === 'AND' ? x - 26 : x - 26,
      y: y + (i - (count - 1) / 2) * (count > 1 ? 16 : 0),
    }));
  }
  if (type === 'NOT') return [{ x: x - 20, y }];
  if (type === 'OUTPUT') return [{ x: x - 18, y }];
  return [{ x: x - GATE_W / 2, y }];
}
