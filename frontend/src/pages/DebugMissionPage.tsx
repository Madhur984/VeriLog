/**
 * DebugMissionPage.tsx — Debug mission runner
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { DEBUG_MISSIONS } from '../data/debugMissions';
import { useBadgeSystem } from '../hooks/useBadgeSystem';
import { ChevronLeft, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

export function DebugMissionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { onDebugComplete } = useBadgeSystem();

    const mission = DEBUG_MISSIONS.find((m) => m.id === id);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [solved, setSolved] = useState(false);

    const handleSolve = useCallback(() => {
        setSolved(true);
        onDebugComplete();
    }, [onDebugComplete]);

    if (!mission) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#060912',
                color: '#CBD5E1',
                gap: '16px',
            }}>
                <AlertTriangle size={48} color="#EF4444" />
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Mission not found</h2>
                <button
                    onClick={() => navigate('/logic-studio')}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(0, 212, 255, 0.1)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#00D4FF',
                        cursor: 'pointer',
                        fontFamily: "'IBM Plex Mono', monospace",
                    }}
                >
                    Back to Studio
                </button>
            </div>
        );
    }

    const difficultyColor = {
        easy: '#10B981',
        medium: '#F59E0B',
        hard: '#EF4444',
    }[mission.difficulty];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#060912',
            color: '#CBD5E1',
            fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
            padding: '24px',
        }}>
            {/* Back button */}
            <button
                onClick={() => navigate('/logic-studio')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginBottom: '24px',
                    fontFamily: 'inherit',
                }}
            >
                <ChevronLeft size={14} /> Back to Studio
            </button>

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
            }}>
                <span style={{ fontSize: '28px' }}>🐛</span>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
                        {mission.title}
                    </h1>
                    <span style={{
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: difficultyColor,
                    }}>
                        {mission.difficulty}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div style={{
                padding: '16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(100, 116, 139, 0.2)',
                borderRadius: '8px',
                marginBottom: '16px',
            }}>
                <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    {mission.description}
                </p>
            </div>

            {/* Symptom */}
            <div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
            }}>
                <AlertTriangle size={16} color="#EF4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                    <div style={{ fontSize: '10px', color: '#EF4444', letterSpacing: '0.08em', marginBottom: '4px' }}>
                        SYMPTOM
                    </div>
                    <p style={{ fontSize: '12px', color: '#F1F5F9', margin: 0 }}>
                        {mission.symptom}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    onClick={() => setShowHint(!showHint)}
                    style={{
                        padding: '8px 14px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '4px',
                        color: '#F59E0B',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <HelpCircle size={12} /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>

                {!solved && (
                    <button
                        onClick={() => setShowSolution(!showSolution)}
                        style={{
                            padding: '8px 14px',
                            background: 'rgba(100, 116, 139, 0.1)',
                            border: '1px solid rgba(100, 116, 139, 0.2)',
                            borderRadius: '4px',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontFamily: 'inherit',
                        }}
                    >
                        Reveal Solution
                    </button>
                )}

                {!solved && (
                    <button
                        onClick={handleSolve}
                        style={{
                            padding: '8px 14px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            borderRadius: '4px',
                            color: '#10B981',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontFamily: 'inherit',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <CheckCircle2 size={12} /> Mark as Solved
                    </button>
                )}
            </div>

            {/* Hint */}
            {showHint && (
                <div style={{
                    padding: '12px 16px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#F1F5F9',
                }}>
                    💡 <strong>Hint:</strong> {mission.hint}
                </div>
            )}

            {/* Solution */}
            {showSolution && (
                <div style={{
                    padding: '12px 16px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#F1F5F9',
                }}>
                    ✅ <strong>Solution:</strong> {mission.solution}
                </div>
            )}

            {/* Solved banner */}
            {solved && (
                <div style={{
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <CheckCircle2 size={24} color="#10B981" />
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#10B981' }}>
                            Mission Complete!
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                            Bug Hunter badge unlocked
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
