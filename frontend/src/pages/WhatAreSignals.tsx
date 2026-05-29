import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const T = {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    surface: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#64748B',
    accent: '#0284C7',
    success: '#10B981',
    error: '#EF4444',
    mono: "'IBM Plex Mono', 'Roboto Mono', monospace",
    sans: "'Inter', system-ui, sans-serif",
} as const;

export const WhatAreSignals: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh', width: '100%',
            display: 'flex', flexDirection: 'column',
            fontFamily: T.sans,
            background: T.bg, color: T.text,
            lineHeight: 1.7,
        }}>
            {/* Header */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px',
                borderBottom: `1px solid ${T.border}`,
                background: T.bg,
                position: 'sticky', top: 0, zIndex: 20,
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 2,
                        border: `1px solid ${T.border}`,
                        background: 'transparent', color: T.muted,
                        fontFamily: T.mono, fontSize: 8,
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        cursor: 'pointer', transition: 'border-color 0.18s, color 0.18s',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = T.muted;
                        (e.currentTarget as HTMLButtonElement).style.color = T.text;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                        (e.currentTarget as HTMLButtonElement).style.color = T.muted;
                    }}
                >
                    <ArrowLeft style={{ width: 12, height: 12 }} />
                    Back
                </button>
                <span style={{
                    fontFamily: T.mono, fontSize: 8,
                    letterSpacing: '0.16em', color: T.muted,
                    textTransform: 'uppercase',
                }}>
                    Theory - Signal Layer
                </span>
            </header>

            <main style={{
                flex: 1, padding: '48px 24px',
                maxWidth: 800, width: '100%', margin: '0 auto',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeIn' }}
                >
                    <span style={{
                        display: 'block',
                        fontFamily: T.mono, fontSize: 9,
                        letterSpacing: '0.22em', color: `${T.accent}99`,
                        textTransform: 'uppercase', marginBottom: 12,
                    }}>Theoretical Scaffold - 01</span>

                    <h1 style={{
                        fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em',
                        color: T.text, marginBottom: 56,
                    }}>
                        Signal Propagation
                    </h1>

                    {[
                        {
                            title: 'What is a Signal?',
                            def: 'A physical quantity structured to convey technical information over a propagation medium.',
                            principle: 'State variations over time (e.g., voltage, pressure, frequency) encode the raw data payload.',
                            practical: 'A CPU toggling an interconnect pin between 0.0V and 1.2V to transmit a binary 1 state.',
                            insight: 'Without strict noise immunity margins and clear threshold definitions, a signal quickly degrades back into raw thermal noise.'
                        },
                        {
                            title: 'Types of Signals',
                            def: 'Signals are strictly categorized by their mathematical continuity and time-domain predictability.',
                            principle: 'Digital signals snap to predefined logic levels for robust error handling. Analog maps infinite states.',
                            practical: 'System clocks are strictly periodic discrete signals. An asynchronous hardware interrupt is non-periodic.',
                            insight: 'Modern architectures shift real-world analog inputs into digital discrete domains as early as possible to minimize signal degradation through traces.'
                        },
                        {
                            title: 'Signal Parameters',
                            def: 'The physical structure of a wave is parameterized geometrically by Amplitude, Frequency, and Phase.',
                            principle: 'Amplitude dictates magnitude, Frequency sets the data rate, and Phase dictates synchronization alignment.',
                            practical: 'A 5GHz Wi-Fi radio wave carries data by rapidly shifting its phase and amplitude via QAM.',
                            insight: 'High frequencies drastically increase bandwidth but introduce severe parasitic capacitance drag, requiring specialized impedance-matched routing.'
                        },
                        {
                            title: 'Basic Signals',
                            def: 'Complex waveforms are mathematically constructed from foundational primitive signals.',
                            principle: 'The Step function models sudden switching. The Impulse function models instantaneous noise spikes. The Sinusoid models smooth oscillation.',
                            practical: 'Flipping a light switch or a transistor gate applies a Step response to the circuit, initiating transient charging.',
                            insight: 'Real-world digital square waves are never perfect vertical steps; they are composed of infinite odd harmonics of sine waves (Fourier series).'
                        },
                        {
                            title: 'Signal in Circuits',
                            def: 'Electrical signals are physically manifested as the orchestrated movement of charge carriers (electrons).',
                            principle: 'The signal is not the electron itself, but the electromagnetic energy wave propagating through the electron "sea".',
                            practical: 'While electrons drift at millimeters per second, the electrical signal propagates down a copper trace at nearly 70% the speed of light.',
                            insight: 'At high frequencies, signal integrity engineering requires treating PCB traces as transmission lines rather than simple wires.'
                        },
                        {
                            title: 'Core Invariant',
                            def: 'A signal strictly requires a physical circuit-a designated, uninterrupted loop for controlled energy movement.',
                            principle: 'Energy must leave a source, perform structural work at a load, and return entirely to the source via a reference return plane.',
                            practical: 'An LED illuminates only when both the high-side supply (+V) and low-side ground return (GND) are securely bonded in a loop.',
                            insight: 'Always design the return path first. If omitted or broken, high-speed signals will parasitize adjacent traces to return, causing catastrophic EMI failure.'
                        }
                    ].map((section, idx, arr) => (
                        <React.Fragment key={idx}>
                            <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <span style={{ fontFamily: T.mono, color: 'rgba(15,23,42,0.15)', fontSize: 13, letterSpacing: '0.1em' }}>
                                        0{idx + 1}
                                    </span>
                                    <h2 style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', color: T.text, margin: 0 }}>
                                        {section.title}
                                    </h2>
                                </div>

                                <div style={{ display: 'grid', gap: 20, paddingLeft: 34 }}>

                                    {/* Definition */}
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
                                        <span style={{
                                            fontFamily: T.mono, color: T.accent, fontSize: 10,
                                            letterSpacing: '0.15em', textTransform: 'uppercase', width: 160, flexShrink: 0
                                        }}>Definition</span>
                                        <p style={{ fontSize: 16, color: T.text, margin: 0, maxWidth: '65ch', letterSpacing: '0.01em' }}>
                                            {section.def}
                                        </p>
                                    </div>

                                    {/* Core Principle */}
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
                                        <span style={{
                                            fontFamily: T.mono, color: T.success, fontSize: 10,
                                            letterSpacing: '0.15em', textTransform: 'uppercase', width: 160, flexShrink: 0
                                        }}>Core Principle</span>
                                        <p style={{ fontSize: 16, color: T.text, margin: 0, maxWidth: '65ch', letterSpacing: '0.01em' }}>
                                            {section.principle}
                                        </p>
                                    </div>

                                    {/* Practical Interpretation */}
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
                                        <span style={{
                                            fontFamily: T.mono, color: T.muted, fontSize: 10,
                                            letterSpacing: '0.15em', textTransform: 'uppercase', width: 160, flexShrink: 0
                                        }}>Interpretation</span>
                                        <p style={{ fontSize: 15, color: '#94A3B8', margin: 0, maxWidth: '65ch', letterSpacing: '0.01em' }}>
                                            {section.practical}
                                        </p>
                                    </div>

                                    {/* Engineering Insight */}
                                    {section.insight && (
                                        <div style={{
                                            display: 'flex', gap: 24, alignItems: 'baseline',
                                            marginTop: 8, padding: '16px 20px',
                                            background: 'rgba(245,158,11,0.08)', borderRadius: 8, borderLeft: '2px solid rgba(245,158,11,0.5)'
                                        }}>
                                            <span style={{
                                                fontFamily: T.mono, color: '#F59E0B', fontSize: 10,
                                                letterSpacing: '0.15em', textTransform: 'uppercase', width: 140, flexShrink: 0
                                            }}>Eng Insight</span>
                                            <p style={{ fontSize: 14, color: '#0F172A', margin: 0, maxWidth: '65ch', fontStyle: 'italic', opacity: 0.8 }}>
                                                {section.insight}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Separator */}
                            {idx < arr.length - 1 && (
                                <div style={{
                                    height: 1, width: '100%',
                                    background: T.border,
                                    margin: '48px 0'
                                }} />
                            )}
                        </React.Fragment>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 64, borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 32 }}>
                        <button
                            onClick={() => navigate('/module/1')}
                            style={{
                                padding: '14px 32px',
                                fontFamily: T.mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                                background: 'transparent',
                                border: `1px solid ${T.accent}`,
                                borderRadius: 4, color: T.accent,
                                cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,132,199,0.08)';
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(2,132,199,0.15)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                            }}
                        >
                            Enter Laboratory <ArrowRight style={{ width: 14, height: 14 }} />
                        </button>
                    </div>

                </motion.div>
            </main>
        </div>
    );
};
