import React from 'react';

export const RESISTOR_ANCHORS = [
    { id: 'l', offsetX: -45, offsetY: 0 },
    { id: 'r', offsetX: 45, offsetY: 0 }
];

interface ResistorProps {
    x?: number;
    y?: number;
    isGhost?: boolean;
    isActive?: boolean;
}

export const Resistor: React.FC<ResistorProps> = ({ x = 0, y = 0, isGhost, isActive }) => {
    const zigzag = 'M-45,0 L-30,0 L-24,-10 L-16,10 L-8,-10 L0,10 L8,-10 L16,10 L24,-10 L30,0 L45,0';
    const color = isActive ? '#00BFFF' : '#4a7aaa';

    return (
        <g transform={`translate(${x}, ${y})`} opacity={isGhost ? 0.5 : 1}>
            {/* Glow under zigzag */}
            {isActive && (
                <path d={zigzag} fill="none" stroke="#00BFFF" strokeWidth={6}
                    strokeLinecap="round" strokeLinejoin="round" opacity={0.2}
                    filter="url(#glowFilter)" />
            )}

            {/* Main zigzag path */}
            <path d={zigzag} fill="none" stroke={color} strokeWidth={2.5}
                strokeLinecap="round" strokeLinejoin="round" />

            {/* Active brighter center */}
            {isActive && (
                <path d={zigzag} fill="none" stroke="#66D9FF" strokeWidth={1}
                    strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
            )}

            {/* Anchor dots */}
            <circle cx={-45} cy={0} r={4}
                fill={isActive ? '#00BFFF' : '#0B1C2D'}
                stroke={isActive ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
            <circle cx={45} cy={0} r={4}
                fill={isActive ? '#00BFFF' : '#0B1C2D'}
                stroke={isActive ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />

            {/* Glow rings on anchors */}
            {isActive && (
                <>
                    <circle cx={-45} cy={0} r={8} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.4} />
                    <circle cx={45} cy={0} r={8} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.4} />
                </>
            )}
        </g>
    );
};
