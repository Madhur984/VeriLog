import React from 'react';

// Common props for all circuit components
export interface CircuitComponentProps {
    className?: string;
    active?: boolean; // Is electricity flowing?
    onClick?: () => void;
}

export const Battery: React.FC<CircuitComponentProps> = ({ className, active }) => (
    <svg viewBox="0 0 60 40" className={className}>
        <rect x="5" y="5" width="50" height="30" rx="4" fill={active ? "#ffecd1" : "#e2e8f0"} stroke="#f97316" strokeWidth="2" />
        <path d="M 5 20 H 0 M 55 20 H 60" stroke="#94a3b8" strokeWidth="3" />
        <text x="30" y="25" textAnchor="middle" fontSize="12" fill="#f97316" fontWeight="bold">PWR</text>
    </svg>
);

export const Switch: React.FC<CircuitComponentProps & { isOn: boolean }> = ({ className, isOn, onClick }) => (
    <svg viewBox="0 0 60 80" className={`${className} cursor-pointer`} onClick={onClick}>
        <rect x="10" y="10" width="40" height="60" rx="8" fill="#334155" />
        {/* Toggle Lever */}
        <rect
            x="15"
            y={isOn ? "15" : "45"}
            width="30"
            height="20"
            rx="4"
            fill={isOn ? "#00d9ff" : "#94a3b8"}
            className="transition-all duration-200"
        />
    </svg>
);

export const LED: React.FC<CircuitComponentProps> = ({ className, active }) => (
    <svg viewBox="0 0 40 40" className={className}>
        <circle cx="20" cy="20" r="15" fill={active ? "#4ade80" : "#334155"} className="transition-colors duration-300" />
        {active && <circle cx="20" cy="20" r="15" fill="#4ade80" filter="url(#glow)" className="animate-pulse" />}
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
    </svg>
);

export const AndGate: React.FC<CircuitComponentProps> = ({ className }) => (
    <svg viewBox="0 0 80 60" className={className}>
        <path d="M 10 5 V 55 H 40 C 65 55 65 5 40 5 H 10 Z" fill="#1e293b" stroke="#00d9ff" strokeWidth="2" />
        {/* Pins */}
        <line x1="0" y1="15" x2="10" y2="15" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="45" x2="10" y2="45" stroke="#94a3b8" strokeWidth="2" />
        <line x1="68" y1="30" x2="80" y2="30" stroke="#94a3b8" strokeWidth="2" />
    </svg>
);

export const OrGate: React.FC<CircuitComponentProps> = ({ className }) => (
    <svg viewBox="0 0 80 60" className={className}>
        <path d="M 10 5 C 20 20 20 40 10 55 C 50 65 80 30 80 30 C 80 30 50 -5 10 5 Z" fill="#1e293b" stroke="#00d9ff" strokeWidth="2" />
        {/* Pins */}
        <line x1="0" y1="15" x2="15" y2="15" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="45" x2="15" y2="45" stroke="#94a3b8" strokeWidth="2" />
        <line x1="75" y1="30" x2="80" y2="30" stroke="#94a3b8" strokeWidth="2" />
    </svg>
);
