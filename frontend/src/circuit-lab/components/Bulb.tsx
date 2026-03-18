import type { CircuitComponent } from '../types';
import type { AnimProps } from './animProps';

interface BulbProps extends AnimProps {
    component: CircuitComponent;
    isLive: boolean;
    onPointerDown: (e: React.PointerEvent) => void;
    isDragging: boolean;
}

const ANCHOR_R = 7;

export function Bulb({ component, isLive, onPointerDown, isDragging,
    dataCompId, dataType, dataConnected, dataDragging, dataBaseX, dataBaseY,
}: BulbProps) {
    const { position, anchors } = component;

    return (
        <g
            transform={`translate(${position.x}, ${position.y})`}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onPointerDown={onPointerDown}
            data-comp-id={dataCompId}
            data-type={dataType}
            data-connected={dataConnected ? 'true' : 'false'}
            data-dragging={dataDragging ? 'true' : 'false'}
            data-base-x={dataBaseX}
            data-base-y={dataBaseY}
        >
            {/* Outer glow halo when live */}
            {isLive && (
                <circle
                    cx={0}
                    cy={-14}
                    r={36}
                    fill="rgba(255,200,87,0.12)"
                    filter="url(#bulbBloom)"
                />
            )}

            {/* Background card */}
            <rect
                x={-32}
                y={-56}
                width={64}
                height={80}
                rx={6}
                fill="#0d2233"
                stroke={isLive ? '#FFC857' : '#1a3a5a'}
                strokeWidth={isLive ? 2 : 1}
                filter={isLive ? 'url(#bulbGlow)' : undefined}
            />

            {/* Bulb glass dome — teardrop shape */}
            <path
                d="M 0 -48 C -22 -48 -26 -28 -24 -12 C -22 2 -14 8 0 10 C 14 8 22 2 24 -12 C 26 -28 22 -48 0 -48 Z"
                fill={isLive ? 'rgba(255,200,87,0.85)' : '#0e2336'}
                stroke={isLive ? '#FFC857' : '#2a5a7a'}
                strokeWidth={1.5}
                filter={isLive ? 'url(#bulbGlow)' : undefined}
            />

            {/* Filament inside dome */}
            <path
                d="M -8 -8 Q 0 -22 8 -8"
                fill="none"
                stroke={isLive ? '#fff' : '#1e3d55'}
                strokeWidth={isLive ? 2 : 1.5}
                strokeLinecap="round"
                filter={isLive ? 'url(#glow)' : undefined}
                opacity={isLive ? 1 : 0.5}
            />

            {/* Bulb base (screw base) */}
            <rect x={-10} y={10} width={20} height={6} rx={1} fill="#2A2D35" />
            <rect x={-8} y={16} width={16} height={6} rx={1} fill="#1A1D24" />
            <rect x={-6} y={22} width={12} height={5} rx={1} fill="#2A2D35" />

            {/* Base lines */}
            {[-4, 0, 4].map((x, i) => (
                <line key={i} x1={x} y1={10} x2={x} y2={16} stroke="#475569" strokeWidth={0.7} />
            ))}

            {/* Shine reflection */}
            {isLive && (
                <ellipse cx={-8} cy={-34} rx={4} ry={8} fill="rgba(255,255,255,0.25)" transform="rotate(-20, -8, -34)" />
            )}

            {/* Label */}
            <text x={0} y={34} textAnchor="middle" fill={isLive ? '#FFC857' : '#64b5d6'} fontSize={8} fontFamily="'Courier New', monospace" letterSpacing={1}>
                {isLive ? '⚡ ON' : 'BULB'}
            </text>

            {/* Anchors */}
            {anchors.map((anchor) => {
                const isConnected = anchor.connectedTo !== null;
                return (
                    <g key={anchor.id} transform={`translate(${anchor.offset.x}, ${anchor.offset.y})`}>
                        <circle
                            r={ANCHOR_R + 3}
                            fill="transparent"
                            stroke={isConnected ? (isLive ? '#FFC857' : '#00BFFF') : 'transparent'}
                            strokeWidth={1.5}
                            opacity={0.4}
                        />
                        <circle
                            r={ANCHOR_R}
                            fill={isConnected ? (isLive ? '#FFC857' : '#00BFFF') : '#2a6e8a'}
                            filter={(isConnected || isLive) ? (isLive ? 'url(#bulbGlow)' : 'url(#glow)') : undefined}
                            stroke="#fff"
                            strokeWidth={1}
                            data-anchor-id={anchor.id}
                        />
                    </g>
                );
            })}
        </g>
    );
}
