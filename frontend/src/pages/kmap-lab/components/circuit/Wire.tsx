import React from 'react';

interface WireProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Optional highlight for signal animation */
  active?: boolean;
}

/**
 * Renders a smooth cubic Bezier wire between two gate ports.
 * The control points are offset horizontally to create a natural
 * S-curve even when ports are at the same or nearby Y positions.
 */
export const Wire: React.FC<WireProps> = ({ x1, y1, x2, y2, active }) => {
  const dx = Math.abs(x2 - x1);
  const cpOffset = Math.max(dx * 0.5, 40);

  // Cubic bezier: start → curve right → arrive at dest from left
  const d = `M ${x1},${y1} C ${x1 + cpOffset},${y1} ${x2 - cpOffset},${y2} ${x2},${y2}`;

  return (
    <g>
      {/* Glow layer */}
      <path
        d={d}
        fill="none"
        stroke={active ? '#fbbf24' : 'rgba(249,115,22,0.18)'}
        strokeWidth={active ? 5 : 4}
        strokeLinecap="round"
        filter="url(#wire-glow)"
      />
      {/* Main wire */}
      <path
        d={d}
        fill="none"
        stroke={active ? '#fbbf24' : 'rgba(249,115,22,0.65)'}
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
      />
    </g>
  );
};

/** SVG filter definition for the wire glow — include once in the SVG defs */
export const WireGlowFilter: React.FC = () => (
  <defs>
    <filter id="wire-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);
