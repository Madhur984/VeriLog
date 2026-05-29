import type { WireSegment, AnchorPoint } from '../types';

interface WireProps {
    wire?: WireSegment;
    from: AnchorPoint & { worldX: number; worldY: number };
    to: AnchorPoint & { worldX: number; worldY: number };
    isLive: boolean;
    /** Stamped as data-wire-id for the ElectronFlow animator to pick up */
    wireId?: string;
}

export function Wire({ from, to, isLive, wireId }: WireProps) {
    const x1 = from.worldX;
    const y1 = from.worldY;
    const x2 = to.worldX;
    const y2 = to.worldY;

    // Manhattan-ish smooth bezier with orthogonal routing
    const mx = (x1 + x2) / 2;
    const d = `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;

    // Pulse animation length
    const pathLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.4;

    return (
        <g>
            {/* Base glow track (darker trail) */}
            <path
                d={d}
                fill="none"
                stroke={isLive ? 'rgba(0,191,255,0.25)' : 'transparent'}
                strokeWidth={8}
                strokeLinecap="round"
                filter="url(#glow)"
            />

            {/* Main wire - data-wire-id stamped here for ElectronFlow animator */}
            <path
                d={d}
                fill="none"
                stroke={isLive ? '#00BFFF' : '#1a3a4a'}
                strokeWidth={3}
                strokeLinecap="round"
                filter={isLive ? 'url(#glow)' : undefined}
                data-wire-id={wireId}
            />

            {/* Animated pulse dot travelling along wire (SMIL, paused when not live) */}
            {isLive && (
                <path
                    d={d}
                    fill="none"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={`${pathLen * 0.12} ${pathLen * 0.88}`}
                    strokeDashoffset={0}
                    opacity={0.9}
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        from={0}
                        to={-pathLen}
                        dur="1.2s"
                        repeatCount="indefinite"
                        calcMode="linear"
                    />
                </path>
            )}
        </g>
    );
}
