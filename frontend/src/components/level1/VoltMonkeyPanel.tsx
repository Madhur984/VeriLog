/**
 * VoltMonkeyPanel.tsx — Enterprise VoltMonkey Mentor Interface
 *
 * Always-dark terminal-style panel. No VoltBot avatar styling.
 * OBS / WHY / DO format strictly enforced.
 * Auto-expands on new response, collapses after 6s via direct DOM mutation.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { VoltMonkeyResponse } from '../../hooks/useVoltMonkeyMentor';
import './level1.css';

interface VoltMonkeyResponseWithInsight extends VoltMonkeyResponse {
    insight?: string;
}

export type CharacterState = 'idle' | 'observing' | 'curious' | 'confused' | 'excited';

interface VoltMonkeyPanelProps {
    response: VoltMonkeyResponseWithInsight | null;
    characterState?: CharacterState;
}

const TIER_COLORS: Record<string, string> = {
    sharp: '#00D4FF',
    steady: '#10B981',
    struggling: '#F59E0B',
};

export const VoltMonkeyPanel = memo(({ response, characterState = 'idle' }: VoltMonkeyPanelProps) => {
    const hasResponse = Boolean(response);
    const accentColor = response ? TIER_COLORS[response.tier] : TIER_COLORS.steady;

    // Map character states to specific subtle animations
    const characterAnimations = {
        idle: { scale: [1, 1.05, 1], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
        observing: { rotate: [0, 4, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
        curious: { rotate: [0, 8, 8, 0], scale: [1, 1.1, 1.1, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
        confused: { x: [0, -3, 3, -3, 3, 0], transition: { duration: 0.5 } },
        excited: { y: [0, -8, 0], scale: [1, 1.1, 1], transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <aside
            className="hidden lg:flex"
            style={{
                width: 340,
                flexShrink: 0,
                background: '#0D0F16', // Dark slate surface
                borderLeft: `1px solid #1A1D24`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflowY: 'auto',
            }}
        >
            {/* Header Area */}
            <div style={{
                padding: '20px 24px',
                borderBottom: `1px solid #1A1D24`,
                display: 'flex', alignItems: 'center', gap: 12
            }}>
                <motion.div
                    animate={characterAnimations[characterState]}
                    style={{
                        width: 32, height: 32, borderRadius: 4,
                        background: hasResponse ? `${accentColor}15` : '#1A1D24',
                        border: `1px solid ${hasResponse ? accentColor + '50' : '#2A2D35'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'JetBrains Mono', monospace", color: hasResponse ? accentColor : '#94A3B8',
                        fontSize: 14, fontWeight: 700
                    }}
                >
                    Σ
                </motion.div>
                <div>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#F8FAFC', letterSpacing: '0.05em' }}>
                        VoltMonkey
                    </h3>
                    <p style={{ margin: 0, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: hasResponse ? accentColor : '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {hasResponse ? `STATUS: ${response!.tier}` : 'STATUS: STANDBY'}
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '24px' }}>
                {!hasResponse ? (
                    <div style={{ textAlign: 'center', color: '#64748B', marginTop: 40, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                        Awaiting interaction...
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* OBSERVATION */}
                        <div>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9, letterSpacing: '0.15em',
                                color: `${accentColor}`, display: 'block', marginBottom: 8,
                                textTransform: 'uppercase', fontWeight: 600
                            }}>Observation</span>
                            <p style={{
                                fontSize: 13, color: '#F8FAFC', margin: 0, lineHeight: 1.5,
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontWeight: 500
                            }}>{response!.obs}</p>
                        </div>

                        {/* ANALYSIS */}
                        <div>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9, letterSpacing: '0.15em',
                                color: `${accentColor}`, display: 'block', marginBottom: 8,
                                textTransform: 'uppercase', fontWeight: 600
                            }}>Analysis</span>
                            <p style={{
                                fontSize: 14, color: '#CBD5E1', margin: 0, lineHeight: 1.6,
                                fontFamily: "'Inter', system-ui, sans-serif",
                            }}>{response!.why}</p>
                        </div>

                        {/* CONCLUSION */}
                        <div>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9, letterSpacing: '0.15em',
                                color: `${accentColor}`, display: 'block', marginBottom: 8,
                                textTransform: 'uppercase', fontWeight: 600
                            }}>Conclusion</span>
                            <p style={{
                                fontSize: 14, color: '#94A3B8', margin: 0, lineHeight: 1.6,
                                fontFamily: "'Inter', system-ui, sans-serif",
                            }}>{response!.conclusion}</p>
                        </div>

                        {/* ENGINEERING INSIGHT */}
                        <div style={{
                            marginTop: 8, padding: '16px',
                            background: `${accentColor}08`,
                            borderLeft: `2px solid ${accentColor}`,
                            borderRadius: '0 4px 4px 0'
                        }}>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9, letterSpacing: '0.15em',
                                color: `${accentColor}`, display: 'block', marginBottom: 8,
                                textTransform: 'uppercase', fontWeight: 600
                            }}>Engineering Insight</span>
                            <p style={{
                                fontSize: 13, color: '#E2E8F0', fontStyle: 'italic', margin: 0, lineHeight: 1.6,
                                fontFamily: "'Inter', system-ui, sans-serif",
                            }}>{response!.insight || 'Always prioritize robust engineering principles. The rules of physics govern every logic outcome.'}</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
});

VoltMonkeyPanel.displayName = 'VoltMonkeyPanel';
