import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';
import { EnhancedSlider } from '../ui/EnhancedSlider';

const T = {
    bg: '#FFFFFF',
    card: '#F8FAFC',
    border: '#E2E8F0',
    accent: '#0EA5E9',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    muted: '#64748B',
    mono: "'IBM Plex Mono',monospace"
} as const;

export function NoisyLineChallenge({ onComplete }: { onComplete: () => void }) {
    const { triggerHaptic, playSound } = useGlobalSensory();
    
    // Engineering Mode Controls
    const [threshold, setThreshold] = useState(2.5);
    const [hysteresis, setHysteresis] = useState(0.2);
    const [filterStrength, setFilterStrength] = useState(2);
    
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorDetected, setErrorDetected] = useState(false);

    // Mock Signal Data
    const signalData = new Float32Array(256).map((_, i) => {
        const base = Math.sin(i / 10) > 0 ? 1 : 0;
        const noise = (Math.random() - 0.5) * 0.4;
        return base + noise;
    });

    const runSimulation = () => {
        setIsTransmitting(true);
        setProgress(0);
        setErrorDetected(false);
        triggerHaptic('medium');
        playSound('signal_chime');
    };

    useEffect(() => {
        if (isTransmitting && progress < 100) {
            const timer = setTimeout(() => {
                setProgress(p => p + 2);
                
                // Logic check: if threshold is bad or noise is too high (mocked)
                if (threshold < 2.0 || threshold > 3.0 || filterStrength < 4) {
                    if (Math.random() > 0.9) setErrorDetected(true);
                }
            }, 50);
            return () => clearTimeout(timer);
        } else if (progress >= 100) {
            setIsTransmitting(false);
            if (!errorDetected) {
                setIsSuccess(true);
                triggerHaptic('success');
                playSound('signal_chime');
                setTimeout(onComplete, 2000);
            } else {
                triggerHaptic('error');
                playSound('glitch');
            }
        }
    }, [isTransmitting, progress, threshold, filterStrength, errorDetected, onComplete, triggerHaptic, playSound]);

    return (
        <div style={{ padding: 24, background: T.bg, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ margin: 0, color: '#0F172A', fontSize: 18 }}>BOSS CHALLENGE: The Noisy Line</h2>
                    <p style={{ margin: '4px 0 0', color: T.muted, fontSize: 11, fontFamily: T.mono }}>
                        MISSION: Clean the signal and transmit "HELLO WORLD"
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: T.muted }}>STATUS</div>
                        <div style={{ fontSize: 11, fontFamily: T.mono, color: errorDetected ? T.error : (isSuccess ? T.success : T.accent) }}>
                            {isTransmitting ? 'TRANSMITTING...' : (errorDetected ? 'FAILED: SOURCE JITTER' : (isSuccess ? 'TRANSFER COMPLETE' : 'READY'))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <OscilloscopeCanvas 
                        ch1Samples={signalData}
                        label1="Raw Dirty Signal"
                        height={200}
                    />
                    
                    <div style={{ 
                        height: 4, background: 'rgba(15, 23, 42, 0.05)', 
                        borderRadius: 2, overflow: 'hidden' 
                    }}>
                        <motion.div 
                            style={{ height: '100%', background: T.accent, width: `${progress}%` }}
                        />
                    </div>

                    <div style={{ 
                        background: T.card, padding: 16, borderRadius: 4, 
                        border: `1px solid ${T.accent}20`, minHeight: 60,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AnimatePresence mode="wait">
                            {isTransmitting ? (
                                <motion.div 
                                    key="msg" 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ fontFamily: T.mono, color: T.accent, letterSpacing: '0.4em', fontSize: 20 }}
                                >
                                    { "HELLO WORLD".substring(0, Math.floor(progress / 10)) }
                                    { progress % 10 > 5 ? '_' : '' }
                                </motion.div>
                            ) : isSuccess ? (
                                <motion.div style={{ color: T.success, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <CheckCircle2 size={24} /> 
                                    <span style={{ fontFamily: T.mono, fontWeight: 700 }}>HELLO WORLD [ACK]</span>
                                </motion.div>
                            ) : (
                                <div style={{ color: 'rgba(15, 23, 42, 0.2)', fontSize: 12, fontFamily: T.mono }}>
                                    ENCODE BUFFER EMPTY
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, background: T.card, padding: 20, borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: T.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Engineer Overrides
                    </div>
                    
                    <EnhancedSlider 
                        label="Decision Threshold" min={0} max={5} value={threshold} onChange={setThreshold} unit="V" color={T.accent}
                    />
                    <EnhancedSlider 
                        label="Schmidt Hysteresis" min={0.1} max={1.0} value={hysteresis} onChange={setHysteresis} unit="V" color={T.warning}
                    />
                    <EnhancedSlider 
                        label="DSP Filter Strength" min={1} max={8} value={filterStrength} onChange={setFilterStrength} unit=" tap" color={T.success}
                    />

                    <div style={{ marginTop: 'auto' }}>
                         {errorDetected && (
                             <div style={{ color: T.error, fontSize: 10, marginBottom: 12, textAlign: 'center' }}>
                                 Error in bit 4: Threshold too low for noise floor.
                             </div>
                         )}
                         <button 
                            onClick={runSimulation}
                            disabled={isTransmitting}
                            style={{ 
                                width: '100%', padding: 14, background: isTransmitting ? 'transparent' : T.accent,
                                border: isTransmitting ? `1px solid ${T.accent}40` : 'none',
                                color: isTransmitting ? T.accent : '#FFF', fontWeight: 800,
                                borderRadius: 4, cursor: isTransmitting ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}
                         >
                            {isTransmitting ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                            {isTransmitting ? 'SIMULATING...' : 'EXECUTE TRANSFER'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
