import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Cpu, Settings2, X } from 'lucide-react';
import type { NodeId } from '../../mure/core/SignalNode';
import type { PortState } from '../../mure/core/Port';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981', warning: '#F59E0B',
    mono: "'JetBrains Mono', monospace",
};

interface Props {
    selectedNodeId: NodeId | null;
    nodeType?: string;
    nodeLabel?: string;
    ports?: PortState[];
    onClose: () => void;
}

export const LogicInspector: React.FC<Props> = ({ selectedNodeId, nodeType, nodeLabel, ports = [], onClose }) => {

    // Estimate generic properties based on type
    const getGateProps = (type?: string) => {
        if (!type) return { delay: '0ns', family: 'Unknown', power: '0mW' };
        if (type.includes('SWITCH') || type === 'GROUND' || type === 'BATTERY') return { delay: '0ns', family: 'Passive/Source', power: '0mW' };
        if (type === 'LED') return { delay: '0ns', family: 'Sink', power: '15mW' };
        return { delay: '10ns', family: '74HC Series TSMC 180nm', power: '5mW' };
    };

    const props = getGateProps(nodeType);

    return (
        <AnimatePresence>
            {selectedNodeId && (
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                        position: 'absolute', right: 24, top: 24, zIndex: 50,
                        width: 280, background: T.card, border: `1px solid ${T.border}`,
                        borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '12px 16px', background: T.surface, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.accent }}>
                            <Settings2 size={16} />
                            <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>LOGIC INSPECTOR</span>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 }}>
                            <X size={14} />
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 700, color: T.text }}>{nodeType}</span>
                                {nodeLabel && <span style={{ fontSize: 12, color: T.accent, background: 'rgba(0,212,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>{nodeLabel}</span>}
                            </div>
                            <span style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{props.family}</span>
                        </div>

                        {/* Physical / Time Properties */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px', border: `1px solid rgba(255,255,255,0.05)` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted, marginBottom: 4 }}><Zap size={12} /> <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delay</span></div>
                                <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text }}>{props.delay}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px', border: `1px solid rgba(255,255,255,0.05)` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted, marginBottom: 4 }}><Cpu size={12} /> <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Power</span></div>
                                <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text }}>{props.power}</div>
                            </div>
                        </div>

                        {/* Ports Live Telemetry */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ fontSize: 10, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Activity size={12} color={T.success} /> LIVE PORT TELEMETRY
                            </div>

                            {ports.length === 0 && <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>No active ports detected.</div>}

                            {ports.map((port, idx) => {
                                const isLogicHigh = port.logic;

                                return (
                                    <div key={idx} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 6,
                                        borderLeft: `2px solid ${isLogicHigh ? T.success : '#EF4444'}`
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 10, color: T.muted }}>PORT {idx}</span>
                                            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.text }}>{port.voltage.toFixed(2)}V</span>
                                        </div>
                                        <div style={{
                                            background: isLogicHigh ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: isLogicHigh ? T.success : '#EF4444',
                                            padding: '4px 8px', borderRadius: 4, fontFamily: T.mono, fontSize: 11, fontWeight: 700
                                        }}>
                                            {isLogicHigh ? 'HIGH (1)' : 'LOW (0)'}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
