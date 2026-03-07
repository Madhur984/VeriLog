import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const T = {
    bg: '#0A0B10',
    surface: '#1A1D24',
    text: '#E5E7EB',
    muted: '#94A3B8',
    accent: '#00D4FF',
    success: '#10B981',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
};

export interface ProgressStage {
    id: string;
    label: string;
}

export const ProgressTracker: React.FC<{
    stages: ProgressStage[];
    activeStageId: string;
}> = ({ stages, activeStageId }) => {
    const foundIdx = stages.findIndex(s => s.id === activeStageId);
    // If scene is not found (e.g., summary or complete), we assume all tracked stages are completed.
    const activeIdx = foundIdx >= 0 ? foundIdx : stages.length;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {stages.map((stage, idx) => {
                const isCompleted = idx < activeIdx;
                const isActive = idx === activeIdx;

                return (
                    <React.Fragment key={stage.id}>
                        <motion.div
                            initial={false}
                            animate={{ opacity: isActive || isCompleted ? 1 : 0.5 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            <div style={{
                                width: 18, height: 18, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isCompleted ? `${T.success}20` : isActive ? `${T.accent}20` : 'transparent',
                                border: `1px solid ${isCompleted ? T.success : isActive ? T.accent : T.surface}`,
                                color: isCompleted ? T.success : isActive ? T.accent : T.muted,
                                transition: 'all 0.3s ease'
                            }}>
                                {isCompleted ? <Check style={{ width: 10, height: 10 }} strokeWidth={3} /> :
                                    <span style={{ fontSize: 9, fontFamily: T.mono, fontWeight: 700 }}>{idx + 1}</span>}
                            </div>
                            <span style={{
                                fontSize: 10, fontFamily: T.mono, letterSpacing: '0.05em', textTransform: 'uppercase',
                                color: isCompleted ? T.text : isActive ? T.text : T.muted,
                                fontWeight: isActive ? 600 : 400,
                                transition: 'color 0.3s ease'
                            }}>
                                {stage.label}
                            </span>
                        </motion.div>
                        {idx < stages.length - 1 && (
                            <div style={{
                                width: 24, height: 1,
                                background: isCompleted ? T.success : T.surface,
                                transition: 'background 0.3s'
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
