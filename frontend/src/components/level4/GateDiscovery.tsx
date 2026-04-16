/**
 * GateDiscovery.tsx — Level 4, Scene 4.1
 *
 * Truth table explorer with animated SVG signal propagation.
 * When inputs toggle, a glowing pulse travels from input → gate → output.
 * Truth table highlights the active row with a left accent bar.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu } from 'lucide-react';
import { GATE_META, GATE_ORDER, type GateId } from '../../utils/gateMeta';
import { getGateIcon } from './GateIcons';



interface Props { onComplete: () => void; hasCompleted: boolean; isDarkMode?: boolean; }

// Keyframe injected once
const INJECTED = { current: false };

function injectWireKeyframes() {
    if (INJECTED.current) return;
    INJECTED.current = true;
    const style = document.createElement('style');
    // We use a generic pulse that works for any wire length by traveling the full line
    style.textContent = `
        @keyframes wire-pulse-generic {
            0%   { stroke-dashoffset: 999;  opacity: 1; }
            80%  { stroke-dashoffset: 0;    opacity: 0.9; }
            100% { stroke-dashoffset: 0;    opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);
}


// ── Input switch button ───────────────────────────────────────────────────────

const SwitchBtn: React.FC<{ val: boolean; onToggle: () => void; label: string; color: string; T: any }> = ({ val, onToggle, label, color, T }) => (
    <button onClick={onToggle} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        background: 'none', border: 'none', cursor: 'pointer',
    }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</span>
        <motion.div
            animate={{
                background: val ? `${color}20` : T.surface,
                borderColor: val ? color : T.border,
                boxShadow: val ? `0 0 14px ${color}55` : 'none',
            }}
            transition={{ duration: 0.18 }}
            style={{ width: 56, height: 56, borderRadius: 8, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <span style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: val ? color : T.muted }}>{val ? 1 : 0}</span>
        </motion.div>
    </button>
);

// ── Main component ────────────────────────────────────────────────────────────

export const GateDiscovery: React.FC<Props> = ({ onComplete, hasCompleted, isDarkMode = true }) => {
    const T = {
        card: isDarkMode ? '#0D0F16' : '#FFFFFF', 
        surface: isDarkMode ? '#1A1D24' : '#F8FAFC', 
        border: isDarkMode ? '#222633' : '#E2E8F0',
        text: isDarkMode ? '#E5E7EB' : '#0F172A', 
        muted: isDarkMode ? '#64748B' : '#64748B',
        accent: '#00D4FF', warning: '#F59E0B', error: '#EF4444', success: '#10B981',
        mono: "'JetBrains Mono', monospace",
    };

    const [activeGate, setActiveGate] = useState<GateId>('AND');
    const [inputA, setInputA] = useState(false);
    const [inputB, setInputB] = useState(false);
    const [exploredGates, setExploredGates] = useState<Set<GateId>>(new Set(['AND']));
    const [pulseTick, setPulseTick] = useState(0);  // increments on any toggle to re-trigger animation

    useEffect(() => { injectWireKeyframes(); }, []);

    const meta = GATE_META[activeGate];
    const inputs = meta.inputs === 1 ? [inputA] : [inputA, inputB];
    const output = meta.evaluate(inputs);
    const truthTable = meta.getTruthTable();

    const handleToggleA = () => { setInputA(v => !v); setPulseTick(t => t + 1); };
    const handleToggleB = () => { setInputB(v => !v); setPulseTick(t => t + 1); };

    const handleGateSelect = (id: GateId) => {
        setActiveGate(id);
        setInputA(false); setInputB(false);
        setPulseTick(t => t + 1);
        const next = new Set([...exploredGates, id]);
        setExploredGates(next);
        if (next.size >= 5 && !hasCompleted) onComplete();
    };

    return (
        <div style={{ width: '100%', maxWidth: 880, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#00D4FF', display: 'block', marginBottom: 8 }}>
                    Scene 4.1 — Gate Discovery
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Logic Gate Explorer</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Select a gate, toggle inputs, observe signal propagation.
                    <span style={{ marginLeft: 8, color: '#00D4FF' }}>{exploredGates.size}/5 explored</span>
                </p>
            </div>

            {/* Gate tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
                {GATE_ORDER.map(id => {
                    const m = GATE_META[id];
                    const explored = exploredGates.has(id);
                    return (
                        <motion.button key={id} onClick={() => handleGateSelect(id)} whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '7px 16px', fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                                letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 6,
                                cursor: 'pointer', transition: 'all 0.15s',
                                background: activeGate === id ? m.accentBg : 'transparent',
                                border: `1px solid ${activeGate === id ? m.color : explored ? `${m.color}40` : T.border}`,
                                color: activeGate === id ? m.color : explored ? `${m.color}80` : T.muted,
                                boxShadow: activeGate === id ? `0 0 12px ${m.color}30` : 'none',
                            }}>
                            {id}
                        </motion.button>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Left: Interactive Gate */}
                <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
                    {/* Subtle gate color accent at top */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: meta.color, opacity: 0.5, borderRadius: '12px 12px 0 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, zIndex: 10, position: 'relative' }}>
                        <div>
                            <div style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 700, color: meta.color, marginBottom: 4 }}>
                                {meta.humanRule}
                            </div>
                            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}>
                                {meta.label} — {meta.equation}
                            </div>
                        </div>
                        <div style={{ padding: '4px 10px', background: `${meta.color}15`, borderRadius: 4, border: `1px solid ${meta.color}30`, fontFamily: T.mono, fontSize: 9, color: meta.color }}>
                            {meta.id}
                        </div>
                    </div>

                    {/* Gate diagram: Inputs — Gate — Output */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center', marginBottom: 32, height: 160 }}>

                        {/* Inputs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, zIndex: 2 }}>
                            <SwitchBtn val={inputA} onToggle={handleToggleA} label="Input A" color={meta.color} T={T} />
                            {meta.inputs === 2 && <SwitchBtn val={inputB} onToggle={handleToggleB} label="Input B" color={meta.color} T={T} />}
                        </div>

                        {/* Central Gate Logic Visualizer */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div
                                key={`${activeGate}-${pulseTick}`}
                                animate={{
                                    boxShadow: output
                                        ? [`0 0 0px ${meta.color}00`, `0 0 30px ${meta.color}60`, `0 0 15px ${meta.color}30`]
                                        : 'none',
                                    scale: output ? [1, 1.05, 1] : 1,
                                }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    width: 84, height: 84, borderRadius: 12, zIndex: 2,
                                    background: meta.accentBg,
                                    border: `2px solid ${output ? meta.color : T.border}`,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    transition: 'border-color 0.25s ease',
                                }}>
                                {getGateIcon(meta.id, 48, meta.color)}
                            </motion.div>
                            
                            {/* Connection Wires with Glowing Paths */}
                            <svg width="240" height="120" style={{ position: 'absolute', zIndex: 1, overflow: 'visible', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                {/* Base wires */}
                                {meta.inputs === 2 ? (
                                    <>
                                        <path d="M-80, 25 L-20, 25 L-20, 60 L40, 60" fill="none" stroke={T.border} strokeWidth="3" strokeLinejoin="round" />
                                        <path d="M-80, 95 L-20, 95 L-20, 60 L40, 60" fill="none" stroke={T.border} strokeWidth="3" strokeLinejoin="round" />
                                    </>
                                ) : (
                                    <path d="M-80, 60 L40, 60" fill="none" stroke={T.border} strokeWidth="3" />
                                )}
                                <path d="M124, 60 L180, 60" fill="none" stroke={T.border} strokeWidth="3" />

                                {/* Animated glowing pulses overlay */}
                                {meta.inputs === 2 ? (
                                    <>
                                        {/* Pulse A */}
                                        {inputA && (
                                            <path d="M-80, 25 L-20, 25 L-20, 60 L40, 60" fill="none" stroke={meta.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                              strokeDasharray="140" style={{ animation: `wire-pulse-generic 1s ease-out forwards ${pulseTick % 2 === 0 ? '' : 'reverse'}` }} />
                                        )}
                                        {/* Pulse B */}
                                        {inputB && (
                                            <path d="M-80, 95 L-20, 95 L-20, 60 L40, 60" fill="none" stroke={meta.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                              strokeDasharray="140" style={{ animation: `wire-pulse-generic 1s ease-out forwards ${pulseTick % 2 === 0 ? '' : 'reverse'}` }} />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {inputA && (
                                            <path d="M-80, 60 L40, 60" fill="none" stroke={meta.color} strokeWidth="3" strokeLinecap="round" strokeDasharray="120"
                                              style={{ animation: `wire-pulse-generic 0.8s ease-out forwards ${pulseTick % 2 === 0 ? '' : 'reverse'}` }} />
                                        )}
                                    </>
                                )}

                                {/* Pulse Output */}
                                {output && (
                                    <path d="M124, 60 L180, 60" fill="none" stroke={meta.color} strokeWidth="4" strokeLinecap="round" strokeDasharray="60"
                                        style={{ animation: `wire-pulse-generic 0.8s ease-out forwards ${pulseTick % 2 === 0 ? '' : 'reverse'}` }} />
                                )}
                            </svg>
                        </div>

                        {/* Output */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.18em' }}>OUTPUT</span>
                            <AnimatePresence mode="wait">
                                <motion.div key={`out-${output}`}
                                    initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    style={{
                                        width: 64, height: 64, borderRadius: 10,
                                        background: output ? `${meta.color}20` : T.surface,
                                        border: `2px solid ${output ? meta.color : T.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: output ? `0 0 25px ${meta.color}40` : 'none',
                                    }}>
                                    <span style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: output ? meta.color : T.muted }}>
                                        {output ? 1 : 0}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div style={{ padding: 16, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
                        <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: meta.color, marginBottom: 6, textTransform: 'uppercase' }}>
                            Human Example:
                        </div>
                        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.text, lineHeight: 1.6, marginBottom: 12 }}>
                            {meta.humanExample}
                        </p>
                        <div style={{ height: 1, background: T.border, margin: '0 0 12px 0' }} />
                        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, lineHeight: 1.7 }}>
                            {meta.description}
                        </p>
                        <p style={{ fontFamily: T.mono, fontSize: 9, color: `${meta.color}80`, marginTop: 8, fontStyle: 'italic' }}>
                            {meta.cmosNote}
                        </p>
                    </div>
                </div>

                {/* Right: Truth Table */}
                <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
                        Truth Table — Live
                    </div>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: meta.inputs === 1 ? '1fr 1fr' : '1fr 1fr 1fr', gap: 8, marginBottom: 8, borderBottom: `1px solid ${T.border}`, paddingBottom: 8 }}>
                        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, textAlign: 'center' }}>A</span>
                        {meta.inputs === 2 && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, textAlign: 'center' }}>B</span>}
                        <span style={{ fontFamily: T.mono, fontSize: 10, color: meta.color, textAlign: 'center' }}>Y</span>
                    </div>
                    {/* Rows */}
                    {truthTable.map((row, i) => {
                        const isActive = row.inputs[0] === inputA && (meta.inputs === 1 || row.inputs[1] === inputB);
                        return (
                            <motion.div key={i} animate={{ background: isActive ? meta.accentBg : 'transparent' }}
                                style={{
                                    display: 'grid', gridTemplateColumns: meta.inputs === 1 ? '1fr 1fr' : '1fr 1fr 1fr',
                                    gap: 8, padding: '10px 0 10px 8px', borderRadius: 4, position: 'relative',
                                    border: `1px solid ${isActive ? `${meta.color}30` : 'transparent'}`,
                                    // Left accent bar for active row
                                    borderLeft: isActive ? `3px solid ${meta.color}` : `3px solid transparent`,
                                    transition: 'all 0.2s',
                                }}>
                                <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 700, textAlign: 'center', color: row.inputs[0] ? meta.color : T.muted }}>{row.inputs[0] ? 1 : 0}</span>
                                {meta.inputs === 2 && <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 700, textAlign: 'center', color: row.inputs[1] ? meta.color : T.muted }}>{row.inputs[1] ? 1 : 0}</span>}
                                <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, textAlign: 'center', color: row.output ? meta.color : T.muted }}>{row.output ? 1 : 0}</span>
                            </motion.div>
                        );
                    })}

                    {/* Signal state legend */}
                    <div style={{ marginTop: 20, padding: '10px 12px', background: T.surface, borderRadius: 6, display: 'flex', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>HIGH = 1</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.surface, border: `1px solid ${T.border}` }} />
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>LOW = 0</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Premium Category Panel: Universal & Exclusive Gates */}
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ padding: 24, background: `${T.warning}08`, border: `1px solid ${T.warning}30`, borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ padding: 6, background: `${T.warning}20`, borderRadius: 6 }}>
                            <Zap size={16} color={T.warning} />
                        </div>
                        <h3 style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>The Universal Gates</h3>
                    </div>
                    <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                        <b style={{ color: T.text }}>NAND</b> and <b style={{ color: T.text }}>NOR</b> are called "Universal" because you can build <i style={{ color: T.accent }}>any other gate</i> using only them. In the real world, most computer chips are made primarily of NAND gates!
                    </p>
                </div>

                <div style={{ padding: 24, background: `${T.accent}08`, border: `1px solid ${T.accent}30`, borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ padding: 6, background: `${T.accent}20`, borderRadius: 6 }}>
                            <Cpu size={16} color={T.accent} />
                        </div>
                        <h3 style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>The Exclusive Gates</h3>
                    </div>
                    <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                        <b style={{ color: T.text }}>XOR</b> and <b style={{ color: T.text }}>XNOR</b> are decision specialists. 
                        XOR acts as a <span style={{ color: T.error }}>Difference Checker</span> (YES if inputs differ), while XNOR is an <span style={{ color: T.success }}>Equality Checker</span> (YES if inputs match).
                    </p>
                </div>
            </div>
        </div>
    );
};
