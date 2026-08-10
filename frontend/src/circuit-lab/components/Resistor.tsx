import type { CircuitComponent } from '../types';
import type { AnimProps } from './animProps';

interface ResistorProps extends AnimProps {
    component: CircuitComponent;
    isLive: boolean;
    onPointerDown: (e: React.PointerEvent) => void;
    isDragging: boolean;
}

const ANCHOR_R = 7;

export function Resistor({ component, isLive, onPointerDown, isDragging,
    dataCompId, dataType, dataConnected, dataDragging, dataBaseX, dataBaseY,
}: ResistorProps) {
    const { position, anchors } = component;

    // Zigzag path for resistor body
    const zigzag =
        'M -30 0 L -18 0 L -14 -14 L -6 14 L 2 -14 L 10 14 L 18 -14 L 22 0 L 30 0';

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
            {/* Background rectangle */}
            <rect
                x={-34}
                y={-22}
                width={68}
                height={44}
                rx={6}
                fill="#0d2233"
                stroke={isLive ? '#00BFFF' : '#1a3a5a'}
                strokeWidth={1}
                filter={isLive ? 'url(#glow)' : undefined}
            />

            {/* Zigzag wire */}
            <path
                d={zigzag}
                fill="none"
                stroke={isLive ? '#00BFFF' : '#4a8caa'}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={isLive ? 'url(#glow)' : undefined}
            />

            {/* Color bands (realism) */}
            {[-8, -2, 4].map((x, i) => (
                <rect
                    key={i}
                    x={x}
                    y={-9}
                    width={3}
                    height={18}
                    fill={['#f59e0b', '#a855f7', '#22c55e'][i]}
                    opacity={0.8}
                />
            ))}

            {/* Label */}
            <text x={0} y={28} textAnchor="middle" fill="#64b5d6" fontSize={8} fontFamily="'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace" letterSpacing={1}>
                RESISTOR
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
