/**
 * components/fsm/FSMTimeline.tsx
 *
 * Horizontal input/state timeline view.
 * Scrub through the input sequence to animate the FSM backward/forward.
 */

import { useCallback } from 'react';
// import type { StepResult } from '../../engine/FSMEngine';

// Stub for StepResult
type StepResult = {
    isValid: boolean;
    toState?: string;
    output?: string;
};

const T = {
    card: '#0D0F16', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B',
    accent: '#00D4FF', active: '#F59E0B',
    success: '#10B981', error: '#EF4444',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

interface FSMTimelineProps {
    inputs: string[];
    trace: StepResult[];
    currentStep: number;
    onSeek: (step: number) => void;
}

export function FSMTimeline({ inputs, trace, currentStep, onSeek }: FSMTimelineProps) {
    const handleClick = useCallback((step: number) => {
        onSeek(step);
    }, [onSeek]);

    if (inputs.length === 0) {
        return (
            <div style={{
                padding: '12px 16px',
                fontFamily: T.mono, fontSize: 8,
                color: T.muted, textAlign: 'center',
                letterSpacing: '0.1em',
            }}>
                RUN INPUT SEQUENCE TO SEE TIMELINE
            </div>
        );
    }

    return (
        <div style={{
            overflowX: 'auto',
            padding: '12px 16px',
        }}>
            {/* Step headers */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 4 }}>
                <div style={{ width: 60, flexShrink: 0, fontFamily: T.mono, fontSize: 7, color: T.muted }}>
                    t=
                </div>
                {inputs.map((_, i) => (
                    <div key={i} style={{
                        width: 48, flexShrink: 0, textAlign: 'center',
                        fontFamily: T.mono, fontSize: 8,
                        color: i === currentStep ? T.accent : T.muted,
                    }}>
                        {i}
                    </div>
                ))}
            </div>

            {/* Input row */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 6 }}>
                <div style={{ width: 60, flexShrink: 0, fontFamily: T.mono, fontSize: 7, color: T.muted, paddingTop: 6 }}>
                    INPUT
                </div>
                {inputs.map((inp, i) => (
                    <div
                        key={i}
                        onClick={() => handleClick(i)}
                        style={{
                            width: 48, height: 28, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: T.mono, fontSize: 9,
                            background: i === currentStep ? `${T.accent}20` : 'transparent',
                            border: `1px solid ${i === currentStep ? T.accent : T.border}`,
                            borderRight: 'none',
                            color: i === currentStep ? T.accent : T.text,
                            cursor: 'pointer',
                            transition: 'all 0.1s ease',
                        }}
                    >
                        {inp}
                    </div>
                ))}
            </div>

            {/* State trace row */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 6 }}>
                <div style={{ width: 60, flexShrink: 0, fontFamily: T.mono, fontSize: 7, color: T.muted, paddingTop: 6 }}>
                    STATE
                </div>
                {trace.map((step, i) => (
                    <div
                        key={i}
                        onClick={() => handleClick(i)}
                        style={{
                            width: 48, height: 28, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: T.mono, fontSize: 9,
                            background: !step.isValid
                                ? `${T.error}10`
                                : i === currentStep ? `${T.active}15` : 'transparent',
                            border: `1px solid ${!step.isValid ? T.error : i === currentStep ? T.active : T.border}`,
                            borderRight: 'none',
                            color: !step.isValid ? T.error : i === currentStep ? T.active : T.muted,
                            cursor: 'pointer',
                        }}
                    >
                        {step.toState || '-'}
                    </div>
                ))}
            </div>

            {/* Output row (if any outputs exist) */}
            {trace.some(s => s.output) && (
                <div style={{ display: 'flex', gap: 0 }}>
                    <div style={{ width: 60, flexShrink: 0, fontFamily: T.mono, fontSize: 7, color: T.muted, paddingTop: 6 }}>
                        OUTPUT
                    </div>
                    {trace.map((step, i) => (
                        <div
                            key={i}
                            style={{
                                width: 48, height: 28, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: T.mono, fontSize: 9,
                                border: `1px solid ${T.border}`,
                                borderRight: 'none',
                                color: step.output ? T.success : T.muted,
                            }}
                        >
                            {step.output || '-'}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
