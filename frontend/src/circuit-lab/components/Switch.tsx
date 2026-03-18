import type { CircuitComponent } from '../types';
import type { AnimProps } from './animProps';

interface SwitchProps extends AnimProps {
    component: CircuitComponent;
    isLive: boolean;
    onPointerDown: (e: React.PointerEvent) => void;
    onToggle: () => void;
    isDragging: boolean;
}

const ANCHOR_R = 7;

export function Switch({ component, isLive, onPointerDown, onToggle, isDragging,
    dataCompId, dataType, dataConnected, dataDragging, dataBaseX, dataBaseY,
}: SwitchProps) {
    const { position, anchors, isClosed } = component;

    // Pivot at left anchor, lever tip near right anchor
    const leverAngle = isClosed ? 0 : -30;
    const leverLen = 44;

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
            {/* Background */}
            <rect
                x={-40}
                y={-24}
                width={80}
                height={48}
                rx={6}
                fill="#0d2233"
                stroke={isLive ? '#00BFFF' : '#1a3a5a'}
                strokeWidth={1}
                filter={isLive ? 'url(#glow)' : undefined}
            />

            {/* Left terminal line */}
            <line x1={-40} y1={0} x2={-20} y2={0} stroke={isLive ? '#00BFFF' : '#4a8caa'} strokeWidth={2.5} />

            {/* Right terminal line */}
            <line x1={20} y1={0} x2={40} y2={0} stroke={isLive ? '#00BFFF' : '#4a8caa'} strokeWidth={2.5} />

            {/* Pivot circle */}
            <circle cx={-20} cy={0} r={4} fill="#94a3b8" stroke="#cbd5e1" strokeWidth={1} />

            {/* Lever arm */}
            <g transform={`rotate(${leverAngle}, -20, 0)`} style={{ transition: 'all 0.25s ease' }}>
                <line
                    x1={-20}
                    y1={0}
                    x2={-20 + leverLen}
                    y2={0}
                    stroke={isClosed ? '#00BFFF' : '#94a3b8'}
                    strokeWidth={3}
                    strokeLinecap="round"
                    filter={isClosed && isLive ? 'url(#glow)' : undefined}
                />
                {/* Lever tip ball */}
                <circle cx={-20 + leverLen} cy={0} r={5} fill={isClosed ? '#00BFFF' : '#64748b'} stroke="#fff" strokeWidth={1} />
            </g>

            {/* Clickable overlay for toggle */}
            <rect
                x={-40}
                y={-24}
                width={80}
                height={48}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
            />

            {/* Status label */}
            <text x={0} y={30} textAnchor="middle" fill={isClosed ? '#4ade80' : '#f87171'} fontSize={8} fontFamily="'Courier New', monospace" letterSpacing={0.5}>
                {isClosed ? '● CLOSED' : '○ OPEN'}
            </text>

            {/* Anchors */}
            {anchors.map((anchor) => {
                const isConnected = anchor.connectedTo !== null;
                return (
                    <g key={anchor.id} transform={`translate(${anchor.offset.x}, ${anchor.offset.y})`}>
                        <circle
                            r={ANCHOR_R + 3}
                            fill="transparent"
                            stroke={isConnected ? '#00BFFF' : 'transparent'}
                            strokeWidth={1.5}
                            opacity={0.4}
                        />
                        <circle
                            r={ANCHOR_R}
                            fill={isConnected ? '#00BFFF' : '#2a6e8a'}
                            filter={isConnected || isLive ? 'url(#glow)' : undefined}
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
