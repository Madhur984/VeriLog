/**
 * GateDiscovery.tsx — Level 4, Scene 4.1
 *
 * Truth table explorer with animated SVG signal propagation.
 * When inputs toggle, a glowing pulse travels from input → gate → output.
 * Truth table highlights the active row with a left accent bar.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GATE_META, GATE_ORDER, type GateId } from '../../utils/gateMeta';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B',
    mono: "'JetBrains Mono', monospace",
};

interface Props { onComplete: () => void; hasCompleted: boolean; }

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

const SwitchBtn: React.FC<{ val: boolean; onToggle: () => void; label: string; color: string }> = ({ val, onToggle, label, color }) => (
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

export const GateDiscovery: React.FC<Props> = ({ onComplete, hasCompleted }) => {
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

                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>
                        {meta.label}
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: meta.color, marginBottom: 24 }}>
                        {meta.equation}
                    </div>

                    {/* Gate diagram: Inputs — Gate — Output, relative positioned for SVG overlay */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center', marginBottom: 24, height: 140 }}>

                        {/* Inputs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, zIndex: 2 }}>
                            <SwitchBtn val={inputA} onToggle={handleToggleA} label="Input A" color={meta.color} />
                            {meta.inputs === 2 && <SwitchBtn val={inputB} onToggle={handleToggleB} label="Input B" color={meta.color} />}
                        </div>

                        {/* Gate symbol */}
                        <motion.div
                            key={`${activeGate}-${pulseTick}`}
                            animate={{
                                boxShadow: output
                                    ? [`0 0 0px ${meta.color}00`, `0 0 20px ${meta.color}99`, `0 0 10px ${meta.color}55`]
                                    : 'none',
                            }}
                            transition={{ duration: 0.4 }}
                            style={{
                                width: 72, height: 72, borderRadius: 8, zIndex: 2,
                                background: meta.accentBg,
                                border: `2px solid ${output ? meta.color : T.border}`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                transition: 'border-color 0.25s ease',
                            }}>
                            <span style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 800, color: meta.color }}>{meta.symbol}</span>
                            <span style={{ fontFamily: T.mono, fontSize: 8, color: meta.color, marginTop: 4, opacity: 0.7 }}>{meta.id}</span>
                        </motion.div>

                        {/* Output */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.18em' }}>OUTPUT</span>
                            <AnimatePresence mode="wait">
                                <motion.div key={`out-${output}`}
                                    initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    style={{
                                        width: 56, height: 56, borderRadius: 8,
                                        background: output ? `${meta.color}20` : T.surface,
                                        border: `2px solid ${output ? meta.color : T.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: output ? `0 0 20px ${meta.color}60` : 'none',
                                    }}>
                                    <span style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: output ? meta.color : T.muted }}>
                                        {output ? 1 : 0}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                            {/* LED indicator */}
                            <motion.div
                                animate={{
                                    background: output ? meta.color : '#1A1D24',
                                    boxShadow: output ? `0 0 16px ${meta.color}90` : 'none',
                                }}
                                style={{ width: 14, height: 14, borderRadius: '50%', transition: 'all 0.22s' }}
                            />
                        </div>
                    </div>

                    {/* Signal state indicator */}
                    <motion.div
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}
                    >
                        {[inputA, ...(meta.inputs === 2 ? [inputB] : []), output].map((v, i) => (
                            <div key={i} style={{
                                flex: 1, padding: '6px 0', textAlign: 'center',
                                background: v ? `${meta.color}15` : T.surface,
                                borderRadius: 4,
                                border: `1px solid ${v ? meta.color + '40' : T.border}`,
                                fontFamily: T.mono, fontSize: 9, color: v ? meta.color : T.muted,
                                transition: 'all 0.2s',
                            }}>
                                {i < (meta.inputs === 2 ? 2 : 1) ? `IN${i === 0 ? 'A' : 'B'}` : 'OUT'} — {v ? 'HIGH' : 'LOW'}
                            </div>
                        ))}
                    </motion.div>

                    <div style={{ padding: 12, background: T.surface, borderRadius: 6 }}>
                        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, lineHeight: 1.7 }}>{meta.description}</p>
                        <p style={{ fontFamily: T.mono, fontSize: 9, color: `${meta.color}80`, marginTop: 6 }}>⚙ {meta.cmosNote}</p>
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
        </div>
    );
};
