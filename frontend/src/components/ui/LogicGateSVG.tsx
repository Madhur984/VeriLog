import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogicGateSVGProps {
    type: 'and' | 'or' | 'nand' | 'nor' | 'not' | 'xor';
    interactionState?: 'idle' | 'active' | 'success' | 'error';
    className?: string;
}

export const LogicGateSVG: React.FC<LogicGateSVGProps> = ({
    type,
    interactionState = 'active',
    className
}) => {
    const strokeColor = interactionState === 'success' ? '#10b981' :
        interactionState === 'error' ? '#ef4444' : '#4f46e5';

    const renderLabels = () => {
        const typeLower = type.toLowerCase();
        const labelClass = "font-heading font-black text-[11px] fill-indigo-200 select-none pointer-events-none transition-opacity duration-300";

        const Labels = ({ a = "A", b = "B", out = "" }) => (
            <motion.g className={labelClass}>
                {typeLower !== 'not' && (
                    <>
                        <text x="-15" y="32" textAnchor="middle">{a}</text>
                        <text x="-15" y="72" textAnchor="middle">{b}</text>
                    </>
                )}
                {typeLower === 'not' && <text x="-15" y="52" textAnchor="middle">{a}</text>}
                <text x="135" y="52" textAnchor="middle">{out}</text>
            </motion.g>
        );

        switch (typeLower) {
            case 'and': return <Labels out="A · B" />;
            case 'or': return <Labels out="A + B" />;
            case 'nand': return <Labels out="(A·B)'" />;
            case 'nor': return <Labels out="(A+B)'" />;
            case 'not': return <Labels a="A" out="A'" />;
            case 'xor': return <Labels out="A ⊕ B" />;
            default: return null;
        }
    };

    const renderGate = () => {
        const strokeWidth = 4.5;
        const gateFill = "transparent";
        const typeLower = type.toLowerCase();

        // Helper for input/output lines
        const LeadLines = ({ inputs = 2, outputX = 95 }) => (
            <g opacity="0.4">
                {inputs === 2 ? (
                    <>
                        <line x1="8" y1="32" x2="20" y2="32" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
                        <line x1="8" y1="72" x2="20" y2="72" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
                    </>
                ) : (
                    <line x1="8" y1="50" x2="25" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
                )}
                <line x1={outputX} y1="50" x2="112" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            </g>
        );

        switch (typeLower) {
            case 'and':
                return (
                    <g>
                        <LeadLines outputX={85} />
                        <path
                            d="M 25 20 C 18 20 18 80 25 80 H 55 C 85 80 85 20 55 20 H 25 Z"
                            fill={gateFill}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                    </g>
                );
            case 'or':
                return (
                    <g>
                        <LeadLines outputX={95} />
                        <path
                            d="M 15 20 C 25 20 40 40 40 50 C 40 60 25 80 15 80 C 45 80 65 70 95 50 C 65 30 45 20 15 20 Z"
                            fill={gateFill}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                    </g>
                );
            case 'xor':
                return (
                    <g>
                        <LeadLines outputX={95} />
                        <path
                            d="M 5 20 C 15 20 30 40 30 50 C 30 60 15 80 5 80"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M 15 20 C 25 20 40 40 40 50 C 40 60 25 80 15 80 C 45 80 65 70 95 50 C 65 30 45 20 15 20 Z"
                            fill={gateFill}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                    </g>
                );
            case 'nand':
                return (
                    <g>
                        <LeadLines outputX={94} />
                        <path
                            d="M 25 20 C 18 20 18 80 25 80 H 55 C 85 80 85 20 55 20 H 25 Z"
                            fill={gateFill}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                        <circle cx="88" cy="50" r="5" fill={gateFill} stroke={strokeColor} strokeWidth={strokeWidth} />
                    </g>
                );
            case 'nor':
                return (
                    <g>
                        <LeadLines outputX={106} />
                        <path
                            d="M 15 20 C 25 20 40 40 40 50 C 40 60 25 80 15 80 C 45 80 65 70 95 50 C 65 30 45 20 15 20 Z"
                            fill={gateFill}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                        <circle cx="100" cy="50" r="5" fill={gateFill} stroke={strokeColor} strokeWidth={strokeWidth} />
                    </g>
                );
            case 'not':
                return (
                    <g>
                        <LeadLines inputs={1} outputX={98} />
                        <path
                            d="M 25 20 C 18 20 18 80 25 80 L 85 50 Z"
                            fill={gateFill}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                        <circle cx="92" cy="50" r="5" fill={gateFill} stroke={strokeColor} strokeWidth={strokeWidth} />
                    </g>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn(
            "relative w-full max-w-[400px] aspect-video flex items-center justify-center rounded-[32px] overflow-hidden group transition-all duration-500",
            className
        )}>
            <motion.svg
                viewBox="-40 0 200 100"
                className="w-2/3 h-2/3 cursor-pointer"
                initial="initial"
                whileHover="hover"
                variants={{
                    initial: { scale: 1, filter: "drop-shadow(0 0 0px transparent)" },
                    hover: {
                        scale: 1.15,
                        filter: `drop-shadow(0 0 18px ${strokeColor}88)`
                    }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                {/* Labels only visible on hover using parent variant */}
                <motion.g
                    variants={{
                        initial: { opacity: 0, y: 5 },
                        hover: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {renderLabels()}
                </motion.g>
                {renderGate()}
            </motion.svg>
        </div>
    );
};
