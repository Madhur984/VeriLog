import { useRef, useEffect, useState, memo, useCallback } from 'react';
import { usePerformanceAdapter } from '../../hooks/usePerformanceAdapter';

const VOLTS_DIV_STEPS = [0.1, 0.2, 0.5, 1, 2, 5];
const TIME_DIV_STEPS = [1, 2, 5, 10, 20, 50, 100, 200];
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { SPRINGS } from '../../constants/designTokens';

/**
 * OscilloscopeCanvas.tsx
 *
 * High-performance canvas-based oscilloscope renderer.
 * Features: Pro Mode (Manual Cursors), Grid, Scaling, Scrubbing.
 */

interface OscilloscopeCanvasProps {
    ch1Samples: Float32Array;
    ch2Samples?: Float32Array;
    showThreshold?: boolean;
    thresholdLow?: number;
    thresholdHigh?: number;
    label1?: string;
    label2?: string;
    height?: number;
    className?: string;
    isPaused?: boolean;
    isEngineerMode?: boolean;
    isManualMode?: boolean;
    showGrid?: boolean;
}

const T = {
    accent: '#0EA5E9',
    success: '#059669',
    error: '#DC2626',
    card: '#F8FAFC',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#64748B',
    mono: "'IBM Plex Mono', 'Roboto Mono', monospace",
};

const GRID_COLOR = 'rgba(15, 23, 42, 0.08)';
const CURSOR_COLOR = 'rgba(217, 119, 6, 0.6)';
const CH1_COLOR = '#0EA5E9';
const CH2_COLOR = '#D97706';
const LOW_COLOR = 'rgba(220, 38, 38, 0.7)';
const HIGH_COLOR = 'rgba(5, 150, 105, 0.7)';

function OscilloscopeCanvasInner({
    ch1Samples,
    ch2Samples,
    showThreshold = false,
    thresholdLow = 0.16,
    thresholdHigh = 0.40,
    label1 = 'CH1',
    label2 = 'CH2',
    height = 200,
    className,
    isPaused = false,
    isEngineerMode = false,
    isManualMode = false,
    showGrid = false,
}: OscilloscopeCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useGlobalSensory();
    const { glowFactor } = usePerformanceAdapter();
    
    // State
    const [cursorX, setCursorX] = useState<number | null>(null);
    const [triggerEdge, setTriggerEdge] = useState<'rising' | 'falling'>('rising');
    const [scrubOffset, setScrubOffset] = useState(0); 
    const rafRef = useRef<number>(0);

    // Manual Cursors (0-100 percentage)
    const [cursors, setCursors] = useState({ v1: 20, v2: 80, t1: 20, t2: 80 });
    const [draggingCursor, setDraggingCursor] = useState<string | null>(null);

    // Scaling with overshoot/settle
    const [voltsDivTarget, setVoltsDiv] = useState(1);
    const [timeDivTarget, setTimeDiv] = useState(10);
    const voltsDiv = useSpring(voltsDivTarget, SPRINGS.INTERACTIVE);
    const timeDiv = useSpring(timeDivTarget, SPRINGS.INTERACTIVE);

    // Historical buffers
    const history1Ref = useRef<Float32Array[]>([]);
    const history2Ref = useRef<Float32Array[]>([]);
    const BUFFER_SIZE = 120;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        function draw() {
            if (!canvas || !ctx) return;
            const W = canvas.width;
            const H = canvas.height;

            if (!isPaused) {
                history1Ref.current.unshift(new Float32Array(ch1Samples));
                if (ch2Samples) history2Ref.current.unshift(new Float32Array(ch2Samples));
                if (history1Ref.current.length > BUFFER_SIZE) history1Ref.current.pop();
                if (history2Ref.current.length > BUFFER_SIZE) history2Ref.current.pop();
            }

            const getSample = (history: Float32Array[], current: Float32Array) => {
                if (!isPaused) return current;
                const idx = Math.floor((scrubOffset / 100) * (history.length - 1));
                return history[idx] || current;
            };

            const s1 = getSample(history1Ref.current, ch1Samples);
            const s2 = ch2Samples ? getSample(history2Ref.current, ch2Samples) : null;

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, W, H);

            if (showGrid || isEngineerMode) {
                ctx.strokeStyle = GRID_COLOR;
                ctx.lineWidth = 1;
                for (let i = 0; i <= 10; i++) {
                    const x = Math.round(i * W / 10);
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
                }
                for (let i = 0; i <= 8; i++) {
                    const y = Math.round(i * H / 8);
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
                }
            }

            // Zero ref
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.setLineDash([4, 6]);
            ctx.beginPath(); ctx.moveTo(0, H * 0.5); ctx.lineTo(W, H * 0.5); ctx.stroke();
            ctx.setLineDash([]);

            if (showThreshold) {
                const yLow = H - thresholdLow * H;
                const yHigh = H - thresholdHigh * H;
                ctx.fillStyle = LOW_COLOR.replace('0.7', '0.04');
                ctx.fillRect(0, yLow, W, H - yLow);
                ctx.fillStyle = HIGH_COLOR.replace('0.7', '0.04');
                ctx.fillRect(0, 0, W, yHigh);
                ctx.strokeStyle = LOW_COLOR; ctx.beginPath(); ctx.moveTo(0, yLow); ctx.lineTo(W, yLow); ctx.stroke();
                ctx.strokeStyle = HIGH_COLOR; ctx.beginPath(); ctx.moveTo(0, yHigh); ctx.lineTo(W, yHigh); ctx.stroke();
            }

            const drawChannel = (samples: Float32Array, color: string, yOffset = 0) => {
                if (!samples || samples.length === 0) return;
                const len = Math.min(samples.length, 256);
                const step = W / len;
                
                // 1. Draw Glow/Bloom (Secondary Layer)
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.5;
                ctx.globalAlpha = 0.15;
                ctx.shadowBlur = 15 * glowFactor;
                ctx.shadowColor = color;



                ctx.beginPath();
                for (let i = 0; i < len; i++) {
                    const x = i * step;
                    const noise = (Math.random() - 0.5) * 0.004; // Micro-noise
                    const y = H - ((samples[i] + noise) * H * 0.8 / voltsDiv.get() + H * 0.1) + yOffset;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // 2. Draw Main Signal (Primary Layer)
                ctx.globalAlpha = 1;
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 0;
                ctx.beginPath();
                for (let i = 0; i < len; i++) {
                    const x = i * step;
                    const noise = (Math.random() - 0.5) * 0.002;
                    const y = H - ((samples[i] + noise) * H * 0.8 / voltsDiv.get() + H * 0.1) + yOffset;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            };

            drawChannel(s1, CH1_COLOR);
            if (s2) drawChannel(s2, CH2_COLOR, -4);

            if (isManualMode) {
                ctx.setLineDash([2, 4]); ctx.strokeStyle = CURSOR_COLOR;
                [cursors.t1, cursors.t2].forEach((t) => {
                    const x = (t / 100) * W;
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
                });
                [cursors.v1, cursors.v2].forEach((v) => {
                    const y = (1 - v / 100) * H;
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
                });
                ctx.setLineDash([]);
                const deltaT = Math.abs(cursors.t1 - cursors.t2) * timeDiv.get();
                const deltaV = Math.abs(cursors.v1 - cursors.v2) / 20 * voltsDiv.get();
                ctx.fillStyle = T.text; ctx.font = '9px monospace';
                ctx.fillText(`ΔT: ${deltaT.toFixed(1)}ms`, W - 100, H - 30);
                ctx.fillText(`ΔV: ${deltaV.toFixed(2)}V`, W - 100, H - 18);
            }

            ctx.fillStyle = CH1_COLOR; ctx.fillText(isEngineerMode ? `CH1: ${voltsDivTarget}V/DIV` : label1, 8, 14);
            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [ch1Samples, ch2Samples, voltsDiv, timeDiv, isPaused, scrubOffset, isManualMode, cursors, isEngineerMode, showGrid, showThreshold, thresholdLow, thresholdHigh, label1, label2]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCursorX(x);
        if (draggingCursor) {
            setCursors(prev => ({ ...prev, [draggingCursor]: draggingCursor.startsWith('t') ? x : 100 - y }));
            triggerHaptic('light');
        } else if (isPaused && e.buttons === 1) setScrubOffset(x);
    }, [draggingCursor, isPaused, triggerHaptic]);

    const getNextStep = (current: number, steps: number[], direction: 1 | -1) => {
        const idx = steps.findIndex(s => s >= current);
        if (direction === 1) return steps[Math.min(idx + 1, steps.length - 1)];
        // If exact match, go down. If not, find closest smaller.
        const lowerIdx = steps.filter(s => s < current).length - 1;
        return steps[Math.max(lowerIdx, 0)];
    };

    const handleVoltsUp = useCallback(() => {
        setVoltsDiv(v => getNextStep(v, VOLTS_DIV_STEPS, 1));
        triggerHaptic('light');
    }, [triggerHaptic]);

    const handleVoltsDown = useCallback(() => {
        setVoltsDiv(v => getNextStep(v, VOLTS_DIV_STEPS, -1));
        triggerHaptic('light');
    }, [triggerHaptic]);

    const handleTimeUp = useCallback(() => {
        setTimeDiv(v => getNextStep(v, TIME_DIV_STEPS, 1));
        triggerHaptic('light');
    }, [triggerHaptic]);

    const handleTimeDown = useCallback(() => {
        setTimeDiv(v => getNextStep(v, TIME_DIV_STEPS, -1));
        triggerHaptic('light');
    }, [triggerHaptic]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        if (isManualMode) {
            const thresh = 3;
            if (Math.abs(x - cursors.t1) < thresh) setDraggingCursor('t1');
            else if (Math.abs(x - cursors.t2) < thresh) setDraggingCursor('t2');
            else if (Math.abs((100 - y) - cursors.v1) < thresh) setDraggingCursor('v1');
            else if (Math.abs((100 - y) - cursors.v2) < thresh) setDraggingCursor('v2');
        }
    }, [cursors, isManualMode]);

    return (
        <div ref={containerRef} className={className}
            style={{ position: 'relative', width: '100%', height, background: '#FFFFFF', borderRadius: 4, overflow: 'hidden' }}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDraggingCursor(null)}
            onMouseDown={handleMouseDown}
        >
            <canvas ref={canvasRef} width={800} height={height} style={{ width: '100%', height: '100%' }} />
            
            <HUD 
                isPaused={isPaused} 
                isEngineerMode={isEngineerMode} 
                voltsDiv={voltsDivTarget}
                timeDiv={timeDivTarget}
                triggerEdge={triggerEdge}
                setTriggerEdge={setTriggerEdge}
                onVoltsUp={handleVoltsUp}
                onVoltsDown={handleVoltsDown}
                onTimeUp={handleTimeUp}
                onTimeDown={handleTimeDown}
            />

            {isPaused && (
                <div style={{ position: 'absolute', bottom: 12, left: '10%', right: '10%', height: 2, background: 'rgba(15, 23, 42, 0.1)' }}>
                    <div style={{ position: 'absolute', left: `${scrubOffset}%`, top: -4, width: 2, height: 10, background: T.accent }} />
                </div>
            )}

            <AnimatePresence>
                {cursorX !== null && !draggingCursor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', top: 0, bottom: 0, left: `${cursorX}%`, width: 1, background: 'rgba(15, 23, 42, 0.1)', pointerEvents: 'none' }} />
                )}
            </AnimatePresence>
        </div>
    );
}

interface HUDProps {
    isPaused: boolean;
    isEngineerMode: boolean;
    voltsDiv: number;
    timeDiv: number;
    triggerEdge: 'rising' | 'falling';
    setTriggerEdge: (e: 'rising' | 'falling') => void;
    onVoltsUp: () => void;
    onVoltsDown: () => void;
    onTimeUp: () => void;
    onTimeDown: () => void;
}

function HUD({ 
    isPaused, isEngineerMode, voltsDiv, timeDiv, triggerEdge, setTriggerEdge,
    onVoltsUp, onVoltsDown, onTimeUp, onTimeDown 
}: HUDProps) {
    const btnStyle = {
        background: 'rgba(14, 165, 233, 0.05)', color: '#0EA5E9', 
        padding: '4px 10px', borderRadius: 4, fontSize: 9, 
        border: '1px solid rgba(14, 165, 233, 0.2)', cursor: 'pointer',
        fontFamily: "'IBM Plex Mono', monospace", pointerEvents: 'auto'
    } as const;

    return (
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
                {isPaused && <div style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, border: '1px solid rgba(239,68,68,0.4)' }}>PAUSED</div>}
                <div style={{ ...btnStyle, background: 'rgba(0,212,255,0.1)' }}>{triggerEdge.toUpperCase()}_EDGE</div>
            </div>

            {isEngineerMode && (
                <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button style={btnStyle} onClick={onVoltsDown}>−</button>
                        <div style={{ color: T.text, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", minWidth: 60, textAlign: 'center' }}>
                            {voltsDiv < 1 ? (voltsDiv*1000).toFixed(0)+'m' : voltsDiv.toFixed(1)}V/DIV
                        </div>
                        <button style={btnStyle} onClick={onVoltsUp}>+</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button style={btnStyle} onClick={onTimeDown}>−</button>
                        <div style={{ color: T.text, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", minWidth: 60, textAlign: 'center' }}>
                            {timeDiv.toFixed(0)}ms/DIV
                        </div>
                        <button style={btnStyle} onClick={onTimeUp}>+</button>
                    </div>

                    <button 
                        style={{ ...btnStyle, background: 'rgba(0,212,255,0.15)' }} 
                        onClick={() => setTriggerEdge(triggerEdge === 'rising' ? 'falling' : 'rising')}
                    >
                        {triggerEdge.toUpperCase()}
                    </button>
                </div>
            )}
        </div>
    );
}

export const OscilloscopeCanvas = memo(OscilloscopeCanvasInner);
