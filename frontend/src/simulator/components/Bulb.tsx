import React from 'react';

export const BULB_ANCHORS = [
    { id: 'l', offsetX: -14, offsetY: 30 },
    { id: 'r', offsetX: 14, offsetY: 30 }
];

interface BulbProps {
    x?: number;
    y?: number;
    isGhost?: boolean;
    isOn?: boolean;
}

export const Bulb: React.FC<BulbProps> = ({ x = 0, y = 0, isGhost, isOn }) => (
    <g transform={`translate(${x}, ${y})`} opacity={isGhost ? 0.5 : 1}>
        {/* Warm yellow halo when lit */}
        {isOn && (
            <>
                <circle cx={0} cy={-4} r={40} fill="url(#bulbHalo)" opacity={0.5} />
                <circle cx={0} cy={-4} r={28} fill="url(#bulbHalo)" opacity={0.3} />
            </>
        )}

        {/* Glass envelope */}
        <ellipse cx={0} cy={-8} rx={20} ry={22}
            fill={isOn ? '#FFC85720' : '#0B1C2D'}
            stroke={isOn ? '#FFC857' : '#1a3a5c'} strokeWidth={2} />

        {/* Inner filament glow */}
        {isOn && (
            <ellipse cx={0} cy={-8} rx={12} ry={14}
                fill="#FFC85730" stroke="none" />
        )}

        {/* Filament cross */}
        <line x1={-8} y1={-14} x2={8} y2={2}
            stroke={isOn ? '#FFD87F' : '#2a5a8a'} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={8} y1={-14} x2={-8} y2={2}
            stroke={isOn ? '#FFD87F' : '#2a5a8a'} strokeWidth={1.5} strokeLinecap="round" />

        {/* Base / screw cap */}
        <rect x={-10} y={12} width={20} height={12} rx={2}
            fill="#1a2a40" stroke={isOn ? '#FFC857' : '#1a3a5c'} strokeWidth={1.5} />
        <line x1={-10} y1={16} x2={10} y2={16}
            stroke={isOn ? '#FFC85788' : '#152a46'} strokeWidth={1} />
        <line x1={-10} y1={20} x2={10} y2={20}
            stroke={isOn ? '#FFC85788' : '#152a46'} strokeWidth={1} />

        {/* Bottom leads */}
        <line x1={-14} y1={24} x2={-14} y2={30}
            stroke={isOn ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} strokeLinecap="round" />
        <line x1={14} y1={24} x2={14} y2={30}
            stroke={isOn ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} strokeLinecap="round" />

        {/* Anchor dots */}
        <circle cx={-14} cy={30} r={4}
            fill={isOn ? '#00BFFF' : '#0B1C2D'}
            stroke={isOn ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        <circle cx={14} cy={30} r={4}
            fill={isOn ? '#00BFFF' : '#0B1C2D'}
            stroke={isOn ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />

        {/* Glow filter on glass when on */}
        {isOn && (
            <ellipse cx={0} cy={-8} rx={22} ry={24}
                fill="none" stroke="#FFC857" strokeWidth={1} opacity={0.4}
                filter="url(#warmGlowFilter)" />
        )}
    </g>
);
