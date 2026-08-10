import type { CircuitComponent } from '../types';
import type { AnimProps } from './animProps';

interface BatteryProps extends AnimProps {
    component: CircuitComponent;
    isLive: boolean;
    onPointerDown: (e: React.PointerEvent) => void;
    isDragging: boolean;
}

const W = 56;
const H = 90;
const ANCHOR_R = 7;

export function Battery({ component, isLive, onPointerDown, isDragging,
    dataCompId, dataType, dataConnected, dataDragging, dataBaseX, dataBaseY,
}: BatteryProps) {
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
            {/* Drop shadow */}
            <rect
                x={-W / 2 + 2}
                y={-H / 2 + 2}
                width={W}
                height={H}
                rx={8}
                fill="rgba(0,0,0,0.4)"
            />

            {/* Body gradient */}
            <rect
                x={-W / 2}
                y={-H / 2}
                width={W}
                height={H}
                rx={8}
                fill="url(#battGrad)"
                stroke={isLive ? '#00BFFF' : '#1e4a6e'}
                strokeWidth={isLive ? 2 : 1}
                filter={isLive ? 'url(#glow)' : undefined}
            />

            {/* Positive terminal plate (top cap) */}
            <rect x={-10} y={-H / 2 - 6} width={20} height={8} rx={2} fill="#c0c0c0" />
            {/* Negative terminal plate (bottom cap) */}
            <rect x={-14} y={H / 2 - 2} width={28} height={7} rx={2} fill="#888" />

            {/* + sign */}
            <text x={0} y={-18} textAnchor="middle" fill="#4ade80" fontSize={18} fontWeight="bold" fontFamily="monospace">+</text>
            {/* - sign */}
            <text x={0} y={20} textAnchor="middle" fill="#f87171" fontSize={22} fontWeight="bold" fontFamily="monospace">−</text>

            {/* Battery label */}
            <text x={0} y={38} textAnchor="middle" fill="#64b5d6" fontSize={9} fontFamily="'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace" letterSpacing={1}>
                BATTERY
            </text>

            {/* Horizontal stripes for realism */}
            {[-12, -4, 4, 12].map((y, i) => (
                <line
                    key={i}
                    x1={-W / 2 + 6}
                    y1={y}
                    x2={W / 2 - 6}
                    y2={y}
                    stroke="#1a3a5a"
                    strokeWidth={1}
                    opacity={0.5}
                />
            ))}

            {/* Anchor nodes */}
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
                            fill={isConnected ? '#00BFFF' : anchor.role === 'positive' ? '#4ade80' : '#f87171'}
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
