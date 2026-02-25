import React from 'react';

export const BATTERY_ANCHORS = [
    { id: 'neg', offsetX: 0, offsetY: 40 },
    { id: 'pos', offsetX: 0, offsetY: -40 }
];

interface BatteryProps {
    x?: number;
    y?: number;
    isGhost?: boolean;
    isActive?: boolean;
}

export const Battery: React.FC<BatteryProps> = ({ x = 0, y = 0, isGhost, isActive }) => (
    <g transform={`translate(${x}, ${y})`} opacity={isGhost ? 0.5 : 1}>
        {/* Body casing */}
        <rect x={-18} y={-32} width={36} height={64} rx={4}
            fill="#0E2240" stroke={isActive ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        <rect x={-14} y={-28} width={28} height={56} rx={2}
            fill="#0A1628" stroke={isActive ? '#00BFFF44' : '#152a46'} strokeWidth={1} />

        {/* Internal cell plates */}
        <rect x={-10} y={-18} width={20} height={3} fill={isActive ? '#00BFFF' : '#2a5a8a'} rx={1} />
        <rect x={-10} y={-12} width={20} height={2} fill={isActive ? '#0088CC' : '#1e4060'} rx={1} />
        <rect x={-10} y={-6} width={20} height={3} fill={isActive ? '#00BFFF' : '#2a5a8a'} rx={1} />
        <rect x={-10} y={0} width={20} height={2} fill={isActive ? '#0088CC' : '#1e4060'} rx={1} />
        <rect x={-10} y={6} width={20} height={3} fill={isActive ? '#00BFFF' : '#2a5a8a'} rx={1} />
        <rect x={-10} y={12} width={20} height={2} fill={isActive ? '#0088CC' : '#1e4060'} rx={1} />

        {/* Terminal nub - positive (top) */}
        <rect x={-5} y={-38} width={10} height={8} rx={2}
            fill="#1a3a5c" stroke={isActive ? '#00BFFF' : '#2a5a8a'} strokeWidth={1.5} />

        {/* Polarity markers */}
        <text x={22} y={-28} fontSize={12} fontWeight="bold"
            fill={isActive ? '#00BFFF' : '#4a7aaa'} fontFamily="monospace">+</text>
        <text x={22} y={28} fontSize={14} fontWeight="bold"
            fill={isActive ? '#00BFFF' : '#4a7aaa'} fontFamily="monospace">−</text>

        {/* Active glow filter */}
        {isActive && (
            <rect x={-20} y={-34} width={40} height={68} rx={6}
                fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.3}
                filter="url(#glowFilter)" />
        )}

        {/* Anchor dots */}
        <circle cx={0} cy={-40} r={4}
            fill={isActive ? '#00BFFF' : '#0B1C2D'}
            stroke={isActive ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        <circle cx={0} cy={40} r={4}
            fill={isActive ? '#00BFFF' : '#0B1C2D'}
            stroke={isActive ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />

        {/* Anchor glow rings */}
        {isActive && (
            <>
                <circle cx={0} cy={-40} r={8} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.4} />
                <circle cx={0} cy={40} r={8} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.4} />
            </>
        )}
    </g>
);
