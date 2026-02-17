import React from 'react';
import { motion } from 'framer-motion';
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
    const glowColor = interactionState === 'success' ? '#10b981' :
        interactionState === 'error' ? '#ef4444' : '#22d3ee';

    const renderGate = () => {
        switch (type) {
            case 'and':
                return (
                    <path
                        d="M20 10V90H60C85 90 85 10 60 10H20Z"
                        className="transition-all duration-500"
                        stroke={glowColor}
                        strokeWidth="4"
                        fill="none"
                        filter="url(#glow)"
                    />
                );
            case 'nand':
                return (
                    <g>
                        <path
                            d="M20 10V90H60C85 90 85 10 60 10H20Z"
                            stroke={glowColor}
                            strokeWidth="4"
                            fill="none"
                            filter="url(#glow)"
                        />
                        <circle cx="88" cy="50" r="5" stroke={glowColor} strokeWidth="3" fill="none" filter="url(#glow)" />
                    </g>
                );
            case 'or':
                return (
                    <path
                        d="M10 10C30 10 40 50 40 50C40 50 30 90 10 90C35 90 85 70 85 50C85 30 35 10 10 10Z"
                        stroke={glowColor}
                        strokeWidth="4"
                        fill="none"
                        filter="url(#glow)"
                    />
                );
            case 'nor':
                return (
                    <g>
                        <path
                            d="M10 10C30 10 40 50 40 50C40 50 30 90 10 90C35 90 85 70 85 50C85 30 35 10 10 10Z"
                            stroke={glowColor}
                            strokeWidth="4"
                            fill="none"
                            filter="url(#glow)"
                        />
                        <circle cx="92" cy="50" r="5" stroke={glowColor} strokeWidth="3" fill="none" filter="url(#glow)" />
                    </g>
                );
            case 'not':
                return (
                    <g>
                        <path
                            d="M20 15L75 50L20 85V15Z"
                            stroke={glowColor}
                            strokeWidth="4"
                            fill="none"
                            filter="url(#glow)"
                        />
                        <circle cx="83" cy="50" r="6" stroke={glowColor} strokeWidth="3" fill="none" filter="url(#glow)" />
                    </g>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn("relative w-full max-w-[400px] aspect-video flex items-center justify-center bg-slate-950/40 rounded-3xl border border-white/5 shadow-2xl overflow-hidden group", className)}>
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 opacity-10 blur-3xl transition-colors duration-1000"
                style={{ backgroundColor: glowColor }}
            />

            <svg
                viewBox="0 0 120 100"
                className="w-3/4 h-3/4 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Animated Circuit Pulse */}
                    <linearGradient id="pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={glowColor} stopOpacity="0" />
                        <stop offset="50%" stopColor={glowColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                        <animate attributeName="x1" from="-100%" to="100%" dur="2s" repeatCount="Infinity" />
                        <animate attributeName="x2" from="0%" to="200%" dur="2s" repeatCount="Infinity" />
                    </linearGradient>
                </defs>

                {/* Connection Lines (Glow Pulse) */}
                <g stroke={glowColor} strokeWidth="2" strokeOpacity="0.3" fill="none">
                    <path d="M0 30H20" />
                    {type !== 'not' && <path d="M0 70H20" />}
                    <path d="M90 50H120" />
                </g>

                {/* Animated Signal Pulses */}
                <motion.circle
                    r="2"
                    fill={glowColor}
                    animate={{ cx: [0, 120] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="opacity-60"
                />

                {renderGate()}
            </svg>

            {/* Technical Labels */}
            <div className="absolute top-4 left-6 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400/60 font-black tracking-widest uppercase">
                    Signal_Processor // rev_3.1
                </span>
            </div>

            <div className="absolute bottom-4 right-6">
                <span className="text-[10px] font-mono text-white/20 font-bold uppercase tracking-tighter">
                    Status: {interactionState.toUpperCase()}
                </span>
            </div>
        </div>
    );
};
