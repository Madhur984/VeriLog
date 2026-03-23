import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { SPRINGS, DURATIONS } from '../../constants/designTokens';

interface SnapPoint {
    value: number;
    label?: string;
    threshold?: number;
}

interface EnhancedSliderProps {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    unit?: string;
    snaps?: SnapPoint[];
    color?: string;
    className?: string;
}

export const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    unit = '',
    snaps = [],
    color = '#00D4FF',
    className = '',
}) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const [isDragging, setIsDragging] = useState(false);
    const lastHapticValue = useRef(value);
    
    // Smooth motion for the visual handle
    const displayValue = useSpring(value, SPRINGS.INTERACTIVE);
    const containerScale = useSpring(1, SPRINGS.INTERACTIVE);

    useEffect(() => {
        // Toggle Magnetic Spring when near snap
        const isNearSnap = snaps.some(s => Math.abs(value - s.value) < (max - min) * 0.05);
        displayValue.set(value);
        if (isNearSnap) {
            // Temporarily use magnetic physics
        }
    }, [value, displayValue, snaps, max, min]);

    const handleDragStart = () => {
        setIsDragging(true);
        containerScale.set(1.02);
        triggerHaptic('light');
        playSound('snap');
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        containerScale.set(1);
        triggerHaptic('light');
    };

    // Calculate proximity to nearest snap point for "Magnetic Aura"
    const getProximity = useCallback((val: number) => {
        if (snaps.length === 0) return 0;
        let minDiff = Infinity;
        for (const snap of snaps) {
            const diff = Math.abs(val - snap.value);
            if (diff < minDiff) minDiff = diff;
        }
        const range = (max - min) * 0.15; // 15% range for aura
        return Math.max(0, 1 - minDiff / range);
    }, [snaps, max, min]);

    const proximity = getProximity(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newVal = parseFloat(e.target.value);
        
        // Standardized Haptic "Detents" (every 5%)
        const stepSize = (max - min) * 0.05;
        if (Math.abs(newVal - lastHapticValue.current) >= stepSize) {
            triggerHaptic('micro');
            lastHapticValue.current = newVal;
        }

        // ─── Magnetic Snapping Logic ───
        for (const snap of snaps) {
            const threshold = snap.threshold || (max - min) * 0.025;
            if (Math.abs(newVal - snap.value) < threshold) {
                if (value !== snap.value) {
                    triggerHaptic('medium'); // Corrected type
                    playSound('signal_chime'); // Corrected type
                }
                newVal = snap.value;
                break;
            }
        }

        onChange(newVal);
    };

    const percent = ((value - min) / (max - min)) * 100;

    return (
        <motion.div 
            className={`enhanced-slider-container ${className}`} 
            style={{ width: '100%', padding: '12px 0', scale: containerScale }}
        >
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{label}</span>
                    <span style={{ 
                        fontSize: 12, 
                        fontFamily: 'IBM Plex Mono', 
                        color: color,
                        fontWeight: 600
                    }}>{value.toFixed(1)}{unit}</span>
                </div>
            )}
            
            <div style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center' }}>
                {/* Track Background */}
                <div style={{ 
                    position: 'absolute', width: '100%', height: 2, 
                    background: 'rgba(255,255,255,0.05)', borderRadius: 1 
                }} />
                
                {/* Magnetic Aura Glow */}
                <AnimatePresence>
                    {proximity > 0.1 && (
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: proximity * 0.4, scaleX: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute', width: '100%', height: 20,
                                background: `radial-gradient(circle at ${percent}%, ${color}40, transparent 70%)`,
                                pointerEvents: 'none',
                                filter: 'blur(8px)',
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Active Track Highlight */}
                <motion.div style={{ 
                    position: 'absolute', width: `${percent}%`, height: 2, 
                    background: color, borderRadius: 1,
                    boxShadow: isDragging ? `0 0 12px ${color}` : `0 0 4px ${color}40`
                }} />

                {/* Snap Markers */}
                {snaps.map((snap, i) => {
                    const snapPos = ((snap.value - min) / (max - min)) * 100;
                    const isNear = Math.abs(percent - snapPos) < 10;
                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${snapPos}%`,
                            width: 2, height: isNear ? 12 : 6,
                            background: isNear ? color : 'rgba(255,255,255,0.2)',
                            transform: 'translateX(-50%)',
                            transition: 'all 0.2s ease',
                            boxShadow: isNear ? `0 0 8px ${color}` : 'none'
                        }}>
                            {snap.label && (
                                <span style={{ 
                                    position: 'absolute', bottom: 16, left: '50%', 
                                    transform: 'translateX(-50%)', fontSize: 8, 
                                    fontFamily: 'IBM Plex Mono',
                                    fontWeight: isNear ? 700 : 400,
                                    color: isNear ? color : 'rgba(255,255,255,0.4)',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease',
                                }}>{snap.label}</span>
                            )}
                        </div>
                    );
                })}

                {/* The Input (Invisible for interaction) */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleInputChange}
                    onMouseDown={handleDragStart}
                    onMouseUp={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchEnd={handleDragEnd}
                    style={{
                        position: 'absolute', width: '100%', height: '100%',
                        opacity: 0, cursor: 'pointer', zIndex: 10
                    }}
                />

                {/* The Visual Handle */}
                <motion.div
                    animate={{ 
                        scale: isDragging ? 1.05 : 1, // Subtle scale
                        boxShadow: isDragging 
                            ? `0 0 25px ${color}, 0 0 10px rgba(255,255,255,0.4)` // Inner glow
                            : `0 0 10px ${color}60`,
                        borderColor: isDragging ? '#FFF' : color
                    }}
                    transition={{ duration: DURATIONS.TAP }}
                    style={{
                        position: 'absolute',
                        left: `${percent}%`,
                        width: 14, height: 14,
                        borderRadius: '50%',
                        background: '#0D0F16',
                        border: `2px solid ${color}`,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                        zIndex: 5,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
                </motion.div>
            </div>
        </motion.div>
    );
};
