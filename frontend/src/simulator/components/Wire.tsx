import React from 'react';

interface GlowingWireProps {
    points: { x: number; y: number }[];
    isActive: boolean;
    animationDelay?: number;
}

export const GlowingWire: React.FC<GlowingWireProps> = ({ points, isActive, animationDelay = 0 }) => {
    if (points.length < 2) return null;

    // Build a smooth path with rounded corners
    let d = `M${points[0].x},${points[0].y}`;
    const cornerRadius = 16;

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        // Vectors: prev->curr and curr->next
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;

        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (len1 === 0 || len2 === 0) {
            d += ` L${curr.x},${curr.y}`;
            continue;
        }

        const r = Math.min(cornerRadius, len1 / 2, len2 / 2);

        // Start of arc (on prev->curr segment)
        const startX = curr.x - (dx1 / len1) * r;
        const startY = curr.y - (dy1 / len1) * r;

        // End of arc (on curr->next segment)
        const endX = curr.x + (dx2 / len2) * r;
        const endY = curr.y + (dy2 / len2) * r;

        d += ` L${startX},${startY}`;
        d += ` Q${curr.x},${curr.y} ${endX},${endY}`;
    }

    d += ` L${points[points.length - 1].x},${points[points.length - 1].y}`;

    // Calculate total path length for animation
    const totalLength = points.reduce((acc, p, i) => {
        if (i === 0) return 0;
        const dx = p.x - points[i - 1].x;
        const dy = p.y - points[i - 1].y;
        return acc + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    return (
        <g>
            {/* Layer 1: Wide soft bloom */}
            {isActive && (
                <path d={d} fill="none"
                    stroke="#00BFFF" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round"
                    opacity={0.08} filter="url(#glowFilter)" />
            )}

            {/* Layer 2: Medium glow */}
            {isActive && (
                <path d={d} fill="none"
                    stroke="#00BFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
                    opacity={0.15} filter="url(#glowFilter)" />
            )}

            {/* Layer 3: Base wire */}
            <path d={d} fill="none"
                stroke={isActive ? '#00BFFF' : '#1a3a5c'}
                strokeWidth={isActive ? 3 : 2}
                strokeLinecap="round" strokeLinejoin="round" />

            {/* Layer 4: Bright core */}
            {isActive && (
                <path d={d} fill="none"
                    stroke="#66D9FF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                    opacity={0.7} />
            )}

            {/* Layer 5: Energy pulse traveling along the wire */}
            {isActive && totalLength > 0 && (
                <path d={d} fill="none"
                    stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    opacity={0.9}
                    strokeDasharray={`20 ${totalLength - 20}`}
                    strokeDashoffset={0}>
                    <animate
                        attributeName="stroke-dashoffset"
                        from={totalLength}
                        to={0}
                        dur="1.5s"
                        begin={`${animationDelay}s`}
                        repeatCount="indefinite" />
                </path>
            )}

            {/* Layer 6: Secondary dimmer pulse */}
            {isActive && totalLength > 0 && (
                <path d={d} fill="none"
                    stroke="#00BFFF" strokeWidth={3} strokeLinecap="round"
                    opacity={0.4}
                    strokeDasharray={`12 ${totalLength - 12}`}
                    strokeDashoffset={0}>
                    <animate
                        attributeName="stroke-dashoffset"
                        from={totalLength}
                        to={0}
                        dur="1.5s"
                        begin={`${animationDelay + 0.5}s`}
                        repeatCount="indefinite" />
                </path>
            )}
        </g>
    );
};

interface GlowNodeProps {
    x: number;
    y: number;
    isActive: boolean;
    isOccupied: boolean;
}

export const GlowNode: React.FC<GlowNodeProps> = ({ x, y, isActive, isOccupied }) => (
    <g>
        {/* Outer soft ring */}
        {isActive && (
            <>
                <circle cx={x} cy={y} r={12} fill="none"
                    stroke="#00BFFF" strokeWidth={1} opacity={0.2}
                    filter="url(#glowFilter)" />
                <circle cx={x} cy={y} r={8} fill="none"
                    stroke="#00BFFF" strokeWidth={1} opacity={0.3} />
            </>
        )}

        {/* Main node circle */}
        <circle cx={x} cy={y} r={5}
            fill={isActive ? '#00BFFF' : isOccupied ? '#1a4a6c' : '#0E2240'}
            stroke={isActive ? '#00BFFF' : isOccupied ? '#2a6a9a' : '#1a3a5c'}
            strokeWidth={2} />

        {/* Inner bright core */}
        {isActive && (
            <circle cx={x} cy={y} r={2.5}
                fill="#FFFFFF" opacity={0.8} />
        )}

        {/* Breathing pulse animation */}
        {isActive && (
            <circle cx={x} cy={y} r={5} fill="none"
                stroke="#00BFFF" strokeWidth={2} opacity={0.6}>
                <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
        )}
    </g>
);
