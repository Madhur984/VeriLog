/**
 * PipelineVisualizer.tsx — Visual representation of CPU pipeline stages
 *
 * Shows 5-stage pipeline (IF/ID/EX/MEM/WB) with:
 * - Currently executing instruction in each stage
 * - Hazard indicators
 * - Data forwarding paths
 * - Pipeline stall/flush visualization
 */

import { memo, useMemo } from 'react';
import type { PipelineState, PipelineStage, HazardInfo } from '../../engines/cpu/CPUTypes';

interface PipelineVisualizerProps {
    pipeline: PipelineState;
}

const STAGE_COLORS: Record<PipelineStage, string> = {
    IF: '#3B82F6',
    ID: '#8B5CF6',
    EX: '#F59E0B',
    MEM: '#10B981',
    WB: '#EF4444',
};

const STAGE_LABELS: Record<PipelineStage, string> = {
    IF: 'Fetch',
    ID: 'Decode',
    EX: 'Execute',
    MEM: 'Memory',
    WB: 'WriteBack',
};

export const PipelineVisualizer = memo(({ pipeline }: PipelineVisualizerProps) => {
    const stages: PipelineStage[] = ['IF', 'ID', 'EX', 'MEM', 'WB'];

    const cpi = useMemo(() => {
        if (pipeline.instructionCount === 0) return 0;
        return (pipeline.cycleCount / pipeline.instructionCount).toFixed(2);
    }, [pipeline.cycleCount, pipeline.instructionCount]);

    return (
        <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
        }}>
            {/* Pipeline Diagram */}
            <div style={{
                display: 'flex',
                gap: 4,
                alignItems: 'stretch',
            }}>
                {stages.map((stage, i) => {
                    const reg = pipeline[stage];
                    const color = STAGE_COLORS[stage];
                    const hasHazard = pipeline.hazards.some(h => h.stage === stage);

                    return (
                        <div key={stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Stage Header */}
                            <div style={{
                                background: `${color}15`,
                                border: `1px solid ${color}30`,
                                borderRadius: 4,
                                padding: '4px 6px',
                                textAlign: 'center',
                            }}>
                                <div style={{ color, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em' }}>
                                    {stage}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 8 }}>
                                    {STAGE_LABELS[stage]}
                                </div>
                            </div>

                            {/* Stage Content */}
                            <div style={{
                                background: reg.valid
                                    ? (reg.stalled ? 'rgba(239, 68, 68, 0.06)' : reg.flushed ? 'rgba(107, 114, 128, 0.06)' : `${color}08`)
                                    : 'rgba(255,255,255,0.01)',
                                border: `1px solid ${hasHazard ? '#EF4444' : 'rgba(255,255,255,0.05)'}`,
                                borderRadius: 4,
                                padding: '8px 6px',
                                minHeight: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                            }}>
                                {reg.valid && reg.instruction ? (
                                    <>
                                        <span style={{ color, fontWeight: 600, fontSize: 11 }}>
                                            {reg.instruction.mnemonic}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>
                                            PC: 0x{reg.pc.toString(16).padStart(4, '0')}
                                        </span>
                                        {reg.stalled && (
                                            <span style={{ color: '#EF4444', fontSize: 8, fontWeight: 600 }}>STALL</span>
                                        )}
                                        {reg.flushed && (
                                            <span style={{ color: '#6B7280', fontSize: 8, fontWeight: 600 }}>FLUSH</span>
                                        )}
                                    </>
                                ) : (
                                    <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: 9 }}>—</span>
                                )}
                            </div>

                            {/* Inter-stage arrow */}
                            {i < stages.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    right: -8,
                                    top: '50%',
                                    color: 'rgba(255,255,255,0.1)',
                                    fontSize: 12,
                                }}>
                                    →
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Hazards */}
            {pipeline.hazards.length > 0 && (
                <div style={{
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: 4,
                    padding: '6px 8px',
                    background: 'rgba(239, 68, 68, 0.04)',
                }}>
                    <div style={{ color: '#EF4444', fontSize: 9, fontWeight: 600, marginBottom: 4, letterSpacing: '0.08em' }}>
                        ⚠ HAZARDS DETECTED
                    </div>
                    {pipeline.hazards.map((h, i) => (
                        <HazardRow key={i} hazard={h} />
                    ))}
                </div>
            )}

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
            }}>
                <StatBox label="Cycles" value={pipeline.cycleCount} color="#00D4FF" />
                <StatBox label="Instructions" value={pipeline.instructionCount} color="#10B981" />
                <StatBox label="CPI" value={cpi} color="#F59E0B" />
                <StatBox label="Stalls" value={pipeline.stallCount} color="#EF4444" />
            </div>
        </div>
    );
});

PipelineVisualizer.displayName = 'PipelineVisualizer';

// ─── Hazard Row ──────────────────────────────────────────────────────────

const HazardRow = memo(({ hazard }: { hazard: HazardInfo }) => {
    const resolutionColors: Record<string, string> = {
        forward: '#10B981',
        stall: '#F59E0B',
        flush: '#EF4444',
        none: '#6B7280',
    };

    return (
        <div style={{
            display: 'flex',
            gap: 8,
            padding: '2px 0',
            fontSize: 9,
            alignItems: 'center',
        }}>
            <span style={{
                color: '#EF4444',
                fontSize: 8,
                padding: '1px 4px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 2,
            }}>
                {hazard.type.toUpperCase()}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', flex: 1 }}>
                {hazard.description}
            </span>
            <span style={{
                color: resolutionColors[hazard.resolution],
                fontSize: 8,
                fontWeight: 600,
            }}>
                {hazard.resolution.toUpperCase()}
            </span>
        </div>
    );
});

HazardRow.displayName = 'HazardRow';

// ─── Stat Box ────────────────────────────────────────────────────────────

const StatBox = memo(({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div style={{
        padding: '6px 8px',
        background: `${color}06`,
        border: `1px solid ${color}15`,
        borderRadius: 4,
        textAlign: 'center',
    }}>
        <div style={{ color, fontSize: 14, fontWeight: 700 }}>{value}</div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {label}
        </div>
    </div>
));

StatBox.displayName = 'StatBox';
