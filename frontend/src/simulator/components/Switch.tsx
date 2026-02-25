import React from 'react';

export const SWITCH_ANCHORS = [
    { id: 'l', offsetX: -30, offsetY: 0 },
    { id: 'r', offsetX: 30, offsetY: 0 }
];

interface SwitchProps {
    x?: number;
    y?: number;
    isOpen?: boolean;
    isGhost?: boolean;
    isActive?: boolean;
    onToggle?: () => void;
}

export const Switch: React.FC<SwitchProps> = ({ x = 0, y = 0, isOpen = true, isGhost, isActive, onToggle }) => (
    <g transform={`translate(${x}, ${y})`} opacity={isGhost ? 0.5 : 1}
        onClick={onToggle} style={{ cursor: 'pointer' }}>
        {/* Left terminal base */}
        <circle cx={-30} cy={0} r={5}
            fill={isActive ? '#00BFFF' : '#1a3a5c'}
            stroke={isActive ? '#00BFFF' : '#2a5a8a'} strokeWidth={2} />

        {/* Right terminal base */}
        <circle cx={30} cy={0} r={5}
            fill={isActive && !isOpen ? '#00BFFF' : '#1a3a5c'}
            stroke={isActive && !isOpen ? '#00BFFF' : '#2a5a8a'} strokeWidth={2} />

        {/* Switch arm */}
        <line x1={-25} y1={0}
            x2={isOpen ? 15 : 25} y2={isOpen ? -20 : 0}
            stroke={isActive && !isOpen ? '#00BFFF' : '#8899aa'}
            strokeWidth={3} strokeLinecap="round"
            style={{ transition: 'all 0.3s ease' }} />

        {/* Pivot dot */}
        <circle cx={-25} cy={0} r={3}
            fill={isActive ? '#00BFFF' : '#4a6a8a'} />

        {/* Contact tip */}
        <circle cx={isOpen ? 15 : 25} cy={isOpen ? -20 : 0} r={3}
            fill={isActive && !isOpen ? '#00BFFF' : '#8899aa'}
            style={{ transition: 'all 0.3s ease' }} />

        {/* Glow ring around terminals */}
        {isActive && !isOpen && (
            <>
                <circle cx={-30} cy={0} r={9} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.4} />
                <circle cx={30} cy={0} r={9} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.4} />
            </>
        )}

        {/* Anchor dots */}
        <circle cx={-30} cy={0} r={4}
            fill={isActive ? '#00BFFF' : '#0B1C2D'}
            stroke={isActive ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        <circle cx={30} cy={0} r={4}
            fill={isActive && !isOpen ? '#00BFFF' : '#0B1C2D'}
            stroke={isActive && !isOpen ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
    </g>
);
