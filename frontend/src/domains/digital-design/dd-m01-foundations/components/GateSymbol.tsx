import React, { memo } from 'react';

export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'BUFFER';

interface GateSymbolProps {
  type: GateType;
  x?: number;
  y?: number;
  scale?: number;
  inputs?: number;
  inputStates?: boolean[];
  outputState?: boolean;
  strokeColor?: string;
  active?: boolean;
  label?: string;
  showBubbles?: boolean;
}

const PHASE_COLOR = '#22C55E';
const INACTIVE_WIRE = '#3A3A4A';
const ACTIVE_WIRE = '#00D4FF';
const BG_DEEP = '#06060A';

const GateSymbol: React.FC<GateSymbolProps> = ({
  type,
  x = 0,
  y = 0,
  scale = 1,
  inputStates = [],
  outputState = false,
  strokeColor = PHASE_COLOR,
  active = false,
  label,
  showBubbles = true,
}) => {
  const w = 60 * scale;
  const h = 40 * scale;
  const glow = active
    ? `drop-shadow(0 0 4px ${ACTIVE_WIRE}) drop-shadow(0 0 8px ${ACTIVE_WIRE}80)`
    : undefined;

  const wireColor = (state: boolean | undefined) =>
    state === true ? ACTIVE_WIRE : state === false ? '#2A2A3A' : INACTIVE_WIRE;

  const inp1 = wireColor(inputStates[0]);
  const inp2 = wireColor(inputStates[1]);
  const out = wireColor(outputState);

  const hasBubble = showBubbles && (type === 'NAND' || type === 'NOR' || type === 'XNOR');

  const renderBody = () => {
    const s = strokeColor;
    switch (type) {
      case 'AND':
      case 'NAND':
        return <path d={`M${5*scale},${5*scale} L${35*scale},${5*scale} Q${55*scale},${5*scale} ${55*scale},${20*scale} Q${55*scale},${35*scale} ${35*scale},${35*scale} L${5*scale},${35*scale} Z`} stroke={s} strokeWidth={2*scale} fill={BG_DEEP} />;
      case 'OR':
      case 'NOR':
        return <path d={`M${5*scale},${5*scale} Q${25*scale},${5*scale} ${45*scale},${20*scale} Q${25*scale},${35*scale} ${5*scale},${35*scale} Q${15*scale},${20*scale} ${5*scale},${5*scale} Z`} stroke={s} strokeWidth={2*scale} fill={BG_DEEP} />;
      case 'XOR':
      case 'XNOR':
        return (
          <>
            <path d={`M${5*scale},${5*scale} Q${25*scale},${5*scale} ${45*scale},${20*scale} Q${25*scale},${35*scale} ${5*scale},${35*scale} Q${15*scale},${20*scale} ${5*scale},${5*scale} Z`} stroke={s} strokeWidth={2*scale} fill={BG_DEEP} />
            <path d={`M${3*scale},${5*scale} Q${13*scale},${20*scale} ${3*scale},${35*scale}`} stroke={s} strokeWidth={2*scale} fill="none" />
          </>
        );
      case 'NOT':
      case 'BUFFER':
        return <path d={`M${5*scale},${5*scale} L${40*scale},${20*scale} L${5*scale},${35*scale} Z`} stroke={s} strokeWidth={2*scale} fill={BG_DEEP} />;
      default:
        return null;
    }
  };

  const outputX = type === 'NOT' ? 44 * scale : type === 'OR' || type === 'NOR' ? 45 * scale : 55 * scale;

  return (
    <g transform={`translate(${x},${y})`} filter={glow} role="img" aria-label={`${type} gate`}>
      {/* Input wires */}
      {type !== 'NOT' && type !== 'BUFFER' && (
        <>
          {inputStates.length > 0 ? (
            inputStates.map((state, i) => {
              const spacing = h / (inputStates.length + 1);
              const inpY = (i + 1) * spacing;
              return (
                <line
                  key={i}
                  x1={0}
                  y1={inpY}
                  x2={5 * scale}
                  y2={inpY}
                  stroke={wireColor(state)}
                  strokeWidth={1.5 * scale}
                />
              );
            })
          ) : (
            <>
              <line x1={0} y1={13 * scale} x2={5 * scale} y2={13 * scale} stroke={inp1} strokeWidth={1.5 * scale} />
              <line x1={0} y1={27 * scale} x2={5 * scale} y2={27 * scale} stroke={inp2} strokeWidth={1.5 * scale} />
            </>
          )}
        </>
      )}
      {(type === 'NOT' || type === 'BUFFER') && (
        <line x1={0} y1={20 * scale} x2={5 * scale} y2={20 * scale} stroke={inp1} strokeWidth={1.5 * scale} />
      )}

      {/* Gate body */}
      {renderBody()}

      {/* Bubble for NAND/NOR/XNOR/NOT */}
      {(hasBubble || type === 'NOT') && (
        <circle cx={(outputX + 4*scale)} cy={20*scale} r={4*scale} stroke={strokeColor} strokeWidth={2*scale} fill={BG_DEEP} />
      )}

      {/* Output wire */}
      <line
        x1={hasBubble || type === 'NOT' ? outputX + 8*scale : outputX}
        y1={20*scale}
        x2={w}
        y2={20*scale}
        stroke={out}
        strokeWidth={1.5*scale}
      />

      {/* Label */}
      {label && (
        <text
          x={type === 'AND' || type === 'NAND' ? 30*scale : 22*scale}
          y={23*scale}
          fontSize={7*scale}
          fill="#7A7A8C"
          fontFamily="IBM Plex Mono, monospace"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default memo(GateSymbol);
