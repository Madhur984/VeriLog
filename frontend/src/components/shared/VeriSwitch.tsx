import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalSensory, PACING } from '../../hooks/useGlobalSensory';

interface VeriSwitchProps {
    isOn: boolean;
    onToggle: (state: boolean) => void;
    label?: string;
    variant?: 'signal' | 'logic';
    disabled?: boolean;
    className?: string;
}

/**
 * VeriSwitch — Unified VeriLog V1 Toggle.
 * Includes 15ms pre-action tension and 80ms flip timing.
 */
export const VeriSwitch: React.FC<VeriSwitchProps> = ({
    isOn,
    onToggle,
    label,
    variant = 'signal',
    disabled = false,
    className = '',
}) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const [isTense, setIsTense] = useState(false);

    const activeColor = variant === 'signal' ? 'var(--signal-cyan)' : 'var(--logic-purple)';
    const glow = variant === 'signal' ? 'var(--energy-glow)' : 'var(--logic-glow)';

    const handleToggle = () => {
        if (disabled) return;
        
        // ─── Phase 1: Pre-Action Tension (15ms) ───
        setIsTense(true);
        triggerHaptic('tension'); // Subtle rumble

        setTimeout(() => {
            // ─── Phase 2: The Flip (80ms) ───
            setIsTense(false);
            onToggle(!isOn);
            triggerHaptic(isOn ? 'light' : 'medium');
            playSound('snap');
        }, 15);
    };

    return (
        <div className={`veri-switch-container flex flex-col items-center gap-2 ${className}`}>
            {label && (
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">{label}</span>
            )}
            
            <button
                onClick={handleToggle}
                disabled={disabled}
                className="relative w-12 h-6 rounded-full bg-white/5 border border-white/10 transition-colors"
                style={{ 
                    borderColor: isOn ? activeColor : undefined,
                    boxShadow: isOn ? `0 0 15px ${glow}` : 'none'
                }}
            >
                {/* Track Glow */}
                <AnimatePresence>
                    {isOn && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: activeColor }}
                        />
                    )}
                </AnimatePresence>

                {/* The Knob */}
                <motion.div
                    animate={{ 
                        x: isOn ? 24 : 4,
                        scale: isTense ? 0.9 : 1,
                        background: isOn ? activeColor : 'rgba(255,255,255,0.2)'
                    }}
                    transition={{ 
                        duration: PACING.INTERACTION / 1000, 
                        ease: [0.4, 0, 0.2, 1] 
                    }}
                    className="absolute top-1 w-4 h-4 rounded-full shadow-lg"
                    style={{ 
                        boxShadow: isOn ? `0 0 8px ${activeColor}` : 'none'
                    }}
                />
            </button>
        </div>
    );
};
