/**
 * KnowledgeNode.tsx + KnowledgePanel.tsx
 *
 * Clickable knowledge node badges and their sliding professional panels.
 * Exported from single file for co-location.
 */

import { useState, useCallback, useEffect, useRef, memo } from 'react';
import type { KnowledgeNodeData } from '../../data/knowledgeNodes';
import '../level1/level1.css';

// ─── Knowledge Panel ──────────────────────────────────────────────────────────

interface KnowledgePanelProps {
    node: KnowledgeNodeData;
    onClose: () => void;
    isClosing: boolean;
}

const SECTION_LABELS = [
    { key: 'definition', label: 'DEFINITION', color: '#00BFFF' },
    { key: 'corePrinciple', label: 'CORE PRINCIPLE', color: '#22c55e' },
    { key: 'practicalExample', label: 'PRACTICAL EXAMPLE', color: '#10B981' },
    { key: 'equation', label: 'EQUATION', color: '#a78bfa' },
    { key: 'misconception', label: 'COMMON MISTAKE', color: '#ef4444' },
    { key: 'designInsight', label: 'DESIGN INSIGHT', color: '#c084fc' },
] as const;

export const KnowledgePanel = memo(({ node, onClose, isClosing }: KnowledgePanelProps) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // ESC to close
    useEffect(() => {
        const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [onClose]);

    // Focus trap
    useEffect(() => {
        panelRef.current?.focus();
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 5000,
                    background: 'rgba(0,0,0,0.4)',
                    animation: isClosing ? 'none' : undefined,
                    opacity: isClosing ? 0 : 1,
                    transition: isClosing ? 'opacity 220ms ease-out' : 'opacity 280ms ease-in',
                }}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-label={`Knowledge: ${node.title}`}
                className={`vl-kpanel ${isClosing ? 'is-closing' : 'is-open'}`}
                style={{
                    position: 'fixed',
                    top: 0, right: 0, bottom: 0,
                    width: 'min(420px, 92vw)',
                    zIndex: 5001,
                    background: '#0B0F14',
                    borderLeft: '1px solid rgba(0,191,255,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    outline: 'none',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid rgba(229,231,235,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky', top: 0,
                    background: '#0B0F14',
                    zIndex: 1,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 2,
                            border: '1.5px solid rgba(0,212,255,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,212,255,0.05)',
                            fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
                            fontSize: 15, color: '#00D4FF', fontWeight: 500,
                        }}>
                            {node.label}
                        </div>
                        <div>
                            <span style={{
                                display: 'block',
                                fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace", fontSize: 8,
                                letterSpacing: '0.22em', color: 'rgba(229,231,235,0.35)',
                                textTransform: 'uppercase', marginBottom: 4,
                            }}>
                                Knowledge Node
                            </span>
                            <h2 style={{
                                fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
                                fontSize: 16, fontWeight: 600,
                                letterSpacing: '0.12em', color: '#E5E7EB',
                                textTransform: 'uppercase',
                                textRendering: 'geometricPrecision',
                            }}>
                                {node.title}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close panel"
                        style={{
                            width: 28, height: 28, borderRadius: 3,
                            border: '1px solid rgba(229,231,235,0.12)',
                            background: 'transparent', cursor: 'pointer',
                            color: 'rgba(229,231,235,0.4)', fontSize: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'border-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,231,235,0.3)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#E5E7EB';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,231,235,0.12)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(229,231,235,0.4)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Sections */}
                <div style={{ padding: '8px 24px 32px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {SECTION_LABELS.map(({ key, label, color }, idx) => {
                        const value = node[key as keyof KnowledgeNodeData];
                        if (!value) return null;

                        return (
                            <div key={key} style={{
                                paddingTop: 20, paddingBottom: 20,
                                borderBottom: idx < SECTION_LABELS.length - 1
                                    ? '1px solid rgba(229,231,235,0.05)' : 'none',
                            }}>
                                {/* Section label with thin divider */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                                    borderBottom: '1px solid rgba(229,231,235,0.08)', paddingBottom: 6
                                }}>
                                    <div style={{ width: 3, height: 12, background: color, borderRadius: 1.5 }} />
                                    <p style={{
                                        fontFamily: 'Roboto Mono, monospace', fontSize: 9,
                                        letterSpacing: '0.22em', color: color,
                                        textTransform: 'uppercase', fontWeight: 600,
                                        opacity: 0.9,
                                    }}>
                                        {label}
                                    </p>
                                </div>

                                {/* Content */}
                                {key === 'equation' ? (
                                    <div>
                                        <div style={{
                                            padding: '10px 14px',
                                            background: 'rgba(167,139,250,0.06)',
                                            border: '1px solid rgba(167,139,250,0.15)',
                                            borderRadius: 3, marginBottom: 8,
                                        }}>
                                            <code style={{
                                                fontFamily: 'Roboto Mono, monospace',
                                                fontSize: 16, fontWeight: 500,
                                                color: '#a78bfa', letterSpacing: '0.08em',
                                            }}>
                                                {node.equation}
                                            </code>
                                        </div>
                                        {node.equationLabel && (
                                            <p style={{
                                                fontFamily: 'Roboto Mono, monospace', fontSize: 10,
                                                color: 'rgba(229,231,235,0.35)', letterSpacing: '0.05em',
                                                lineHeight: 1.6,
                                            }}>
                                                {node.equationLabel}
                                            </p>
                                        )}
                                    </div>
                                ) : key === 'misconception' ? (
                                    <div style={{
                                        padding: '12px 16px',
                                        background: 'rgba(239,68,68,0.05)',
                                        border: '1px solid rgba(239,68,68,0.15)',
                                        borderRadius: 3,
                                    }}>
                                        <p style={{
                                            fontSize: 13, color: '#94a3b8',
                                            lineHeight: 1.65, letterSpacing: '0.02em',
                                        }}>
                                            {value as string}
                                        </p>
                                    </div>
                                ) : key === 'designInsight' ? (
                                    <div style={{
                                        padding: '12px 16px',
                                        background: 'rgba(192,132,252,0.05)',
                                        border: '1px solid rgba(192,132,252,0.2)',
                                        borderRadius: 3, borderLeft: '3px solid #c084fc',
                                    }}>
                                        <p style={{
                                            fontSize: 13, color: '#E5E7EB',
                                            lineHeight: 1.65, letterSpacing: '0.01em',
                                            fontWeight: 500
                                        }}>
                                            {value as string}
                                        </p>
                                    </div>
                                ) : (
                                    <p style={{
                                        fontSize: 13, color: '#94a3b8',
                                        lineHeight: 1.65, letterSpacing: '0.02em',
                                    }}>
                                        {value as string}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
});
KnowledgePanel.displayName = 'KnowledgePanel';

// ─── Knowledge Node Badge ─────────────────────────────────────────────────────

interface KnowledgeNodeProps {
    node: KnowledgeNodeData;
}

export const KnowledgeNode = memo(({ node }: KnowledgeNodeProps) => {
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    const handleOpen = useCallback(() => {
        setClosing(false);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setClosing(true);
        setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, 220);
    }, []);

    return (
        <>
            <button
                className="vl-knode"
                onClick={handleOpen}
                aria-label={`Open knowledge node: ${node.title}`}
                title={node.title}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20, height: 20,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(0,212,255,0.5)',
                    background: 'rgba(0,212,255,0.05)',
                    color: '#00D4FF',
                    fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
                    fontSize: 10, fontWeight: 600,
                    cursor: 'pointer',
                    verticalAlign: 'middle',
                    margin: '0 4px',
                    transition: 'transform 0.15s, border-color 0.15s',
                    flexShrink: 0,
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#00BFFF';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,191,255,0.5)';
                }}
            >
                {node.label}
            </button>

            {(open || closing) && (
                <KnowledgePanel node={node} onClose={handleClose} isClosing={closing} />
            )}
        </>
    );
});
KnowledgeNode.displayName = 'KnowledgeNode';
