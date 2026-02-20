import React from 'react';
import { cn } from '../../lib/utils';

interface LogicGateSVGProps {
    type: 'and' | 'or' | 'nand' | 'nor' | 'not';
    interactionState?: 'idle' | 'active' | 'success' | 'error';
    className?: string;
}

export const LogicGateSVG: React.FC<LogicGateSVGProps> = ({
    type,
    interactionState = 'active',
    className
}) => {
    const strokeColor = interactionState === 'success' ? '#10b981' :
        interactionState === 'error' ? '#ef4444' : '#00d9ff';

    const renderGate = () => {
        switch (type.toLowerCase()) {
            case 'and':
                return (
                    <g>
                        <line x1="0" y1="30" x2="20" y2="30" stroke="#475569" strokeWidth="3" />
                        <line x1="0" y1="70" x2="20" y2="70" stroke="#475569" strokeWidth="3" />
                        <line x1="85" y1="50" x2="105" y2="50" stroke="#475569" strokeWidth="3" />
                        <path
                            d="M 20 15 V 85 H 55 C 80 85 80 15 55 15 H 20 Z"
                            fill="#1e293b"
                            stroke={strokeColor}
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />
                    </g>
                );
            case 'or':
                return (
                    <g>
                        <line x1="0" y1="30" x2="25" y2="30" stroke="#475569" strokeWidth="3" />
                        <line x1="0" y1="70" x2="25" y2="70" stroke="#475569" strokeWidth="3" />
                        <line x1="90" y1="50" x2="110" y2="50" stroke="#475569" strokeWidth="3" />
                        <path
                            d="M 15 15 C 30 15 45 35 45 50 C 45 65 30 85 15 85 C 40 85 55 75 90 50 C 55 25 40 15 15 15 Z"
                            fill="#1e293b"
                            stroke={strokeColor}
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />
                    </g>
                );
            case 'nand':
                return (
                    <g>
                        <line x1="0" y1="30" x2="20" y2="30" stroke="#475569" strokeWidth="3" />
                        <line x1="0" y1="70" x2="20" y2="70" stroke="#475569" strokeWidth="3" />
                        <line x1="95" y1="50" x2="115" y2="50" stroke="#475569" strokeWidth="3" />
                        <path
                            d="M 20 15 V 85 H 55 C 80 85 80 15 55 15 H 20 Z"
                            fill="#1e293b"
                            stroke={strokeColor}
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />
                        <circle cx="85" cy="50" r="7" fill="#1e293b" stroke={strokeColor} strokeWidth="4" />
                    </g>
                );
            case 'nor':
                return (
                    <g>
                        <line x1="0" y1="30" x2="25" y2="30" stroke="#475569" strokeWidth="3" />
                        <line x1="0" y1="70" x2="25" y2="70" stroke="#475569" strokeWidth="3" />
                        <line x1="100" y1="50" x2="120" y2="50" stroke="#475569" strokeWidth="3" />
                        <path
                            d="M 15 15 C 30 15 45 35 45 50 C 45 65 30 85 15 85 C 40 85 55 75 90 50 C 55 25 40 15 15 15 Z"
                            fill="#1e293b"
                            stroke={strokeColor}
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />
                        <circle cx="102" cy="50" r="7" fill="#1e293b" stroke={strokeColor} strokeWidth="4" />
                    </g>
                );
            case 'not':
                return (
                    <g>
                        <line x1="0" y1="50" x2="25" y2="50" stroke="#475569" strokeWidth="3" />
                        <line x1="100" y1="50" x2="120" y2="50" stroke="#475569" strokeWidth="3" />
                        <path
                            d="M 25 15 L 80 50 L 25 85 Z"
                            fill="#1e293b"
                            stroke={strokeColor}
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />
                        <circle cx="92" cy="50" r="7" fill="#1e293b" stroke={strokeColor} strokeWidth="4" />
                    </g>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn(
            "relative w-full max-w-[400px] aspect-video flex items-center justify-center bg-slate-950/40 rounded-[48px] border border-white/5 shadow-2xl overflow-hidden group backdrop-blur-3xl",
            className
        )}>
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 opacity-5 blur-3xl transition-colors duration-1000"
                style={{ backgroundColor: strokeColor }}
            />

            <svg
                viewBox="0 0 120 100"
                className="w-3/4 h-3/4 drop-shadow-[0_0_15px_rgba(0,217,255,0.2)]"
            >
                <defs>
                    <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <g filter="url(#circuit-glow)">
                    {renderGate()}
                </g>
            </svg>

            {/* Technical Labels */}
            <div className="absolute top-6 left-8 flex items-center space-x-3">
                <div className={cn("w-2 h-2 rounded-full animate-pulse",
                    interactionState === 'success' ? "bg-emerald-400" :
                        interactionState === 'error' ? "bg-rose-400" : "bg-cyan-400"
                )} />
                <span className="text-[11px] font-mono text-white/40 font-bold tracking-[0.2em] uppercase">
                    Circuit_Core // {type.toUpperCase()}
                </span>
            </div>

            <div className="absolute bottom-6 right-8 opacity-40">
                <span className="text-[10px] font-mono text-white/60 font-medium uppercase tracking-widest">
                    Mode: {interactionState.toUpperCase()}
                </span>
            </div>
        </div>
    );
};
