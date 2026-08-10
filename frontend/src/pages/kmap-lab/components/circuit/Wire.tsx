import React from 'react';

interface WireProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Optional highlight for signal animation */
  active?: boolean;
}

export const Wire: React.FC<WireProps> = ({ x1, y1, x2, y2, active }) => {
  // Orthogonal 90-degree routing: horizontal -> vertical -> horizontal bend
  const dx = x2 - x1;
  const midX = x1 + Math.max(dx * 0.5, 20);

  const d = `M ${x1},${y1} L ${midX},${y1} L ${midX},${y2} L ${x2},${y2}`;

  return (
    <g>
      {/* Glow layer */}
      <path
        d={d}
        fill="none"
        stroke={active ? '#fbbf24' : 'rgba(249,115,22,0.18)'}
        strokeWidth={active ? 5 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#wire-glow)"
      />
      {/* Main wire */}
      <path
        d={d}
        fill="none"
        stroke={active ? '#fbbf24' : 'rgba(249,115,22,0.75)'}
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Corner junction indicators if vertical offset exists */}
      {Math.abs(y2 - y1) > 4 && (
        <>
          <circle cx={midX} cy={y1} r={2} fill={active ? '#fbbf24' : '#f97316'} opacity={0.6} />
          <circle cx={midX} cy={y2} r={2} fill={active ? '#fbbf24' : '#f97316'} opacity={0.6} />
        </>
      )}
    </g>
  );
};

/** SVG filter definition for the wire glow - include once in the SVG defs */
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
