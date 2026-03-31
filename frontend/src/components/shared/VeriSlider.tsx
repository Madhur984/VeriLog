import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const SPRINGS = {
    INTERACTIVE: { stiffness: 400, damping: 30, mass: 0.8 },
};

interface SnapPoint {
    value: number;
    label?: string;
    threshold?: number;
}

interface VeriSliderProps {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    unit?: string;
    snaps?: SnapPoint[];
    variant?: 'signal' | 'logic';
    className?: string;
}

/**
 * VeriSlider — Unified VeriLog V1 Slider.
 * Follows strict Cyan (#00E5FF) for Signal and Purple (#7C3AED) for Logic.
 */
export const VeriSlider: React.FC<VeriSliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.01,
    label,
    unit = '',
    snaps = [],
    variant = 'signal',
    className = '',
}) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const [isDragging, setIsDragging] = useState(false);
    const lastHapticValue = useRef(value);
    
    const color = variant === 'signal' ? 'var(--signal-cyan)' : 'var(--logic-purple)';
    const glow = variant === 'signal' ? 'var(--energy-glow)' : 'var(--logic-glow)';

    const displayValue = useSpring(value, SPRINGS.INTERACTIVE);
    const containerScale = useSpring(1, SPRINGS.INTERACTIVE);

    const handleDragStart = () => {
        setIsDragging(true);
        containerScale.set(1.02);
        triggerHaptic('tension'); // Subtle mechanical take-up
        playSound('tension');
        
        // Followed by a light click to signal engagement
        setTimeout(() => {
            triggerHaptic('light');
            playSound('snap');
        }, 30);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        containerScale.set(1);
        triggerHaptic('light');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newVal = parseFloat(e.target.value);
        
        // Detent Haptics (every 10 units if defined, or 10% of scale)
        const range = max - min;
        const hapticStep = range > 10 ? 1 : range * 0.1;
        
        if (Math.abs(newVal - lastHapticValue.current) >= hapticStep) {
            triggerHaptic('micro');
            lastHapticValue.current = newVal;
        }

        // Magnetic Snapping
        for (const snap of snaps) {
            const threshold = snap.threshold || range * 0.03;
            if (Math.abs(newVal - snap.value) < threshold) {
                if (value !== snap.value) {
                    triggerHaptic('medium');
                    playSound('snap');
                }
                newVal = snap.value;
                break;
            }
        }

        onChange(newVal);
        displayValue.set(newVal);
    };

    const percent = ((value - min) / (max - min)) * 100;

    return (
        <motion.div 
            className={`veri-slider ${className}`} 
            style={{ width: '100%', padding: '12px 0', scale: containerScale }}
        >
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 9, fontFamily: 'IBM Plex Mono', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: color, fontWeight: 700 }}>
                        {value.toFixed(2)}{unit}
                    </span>
                </div>
            )}
            
            <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
                {/* Track */}
                <div style={{ position: 'absolute', width: '100%', height: 2, background: '#F1F5F9', borderRadius: 1 }} />
                
                {/* Magnetic Area Glow */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', width: '100%', height: 32, background: `radial-gradient(circle at ${percent}%, ${color}, transparent 80%)`, pointerEvents: 'none', filter: 'blur(8px)' }}
                        />
                    )}
                </AnimatePresence>

                <motion.div style={{ position: 'absolute', width: `${percent}%`, height: 2, background: color, boxShadow: `0 0 8px ${color}44` }} />

                {/* Input Layer */}
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={handleInputChange} onMouseDown={handleDragStart} onMouseUp={handleDragEnd}
                    onTouchStart={handleDragStart} onTouchEnd={handleDragEnd}
                    style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                />

                {/* Handle */}
                <motion.div
                    animate={{ scale: isDragging ? 1.1 : 1, borderColor: isDragging ? color : color }}
                    style={{
                        position: 'absolute', left: `${percent}%`, width: 14, height: 14, borderRadius: '50%',
                        background: '#FFFFFF', border: `2px solid ${color}`, transform: 'translateX(-50%)',
                        pointerEvents: 'none', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isDragging ? `0 0 15px ${color}66` : '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
                </motion.div>
            </div>
        </motion.div>
    );
};
