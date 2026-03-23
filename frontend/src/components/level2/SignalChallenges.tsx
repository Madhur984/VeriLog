import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const T = {
    card: '#0D0F16', border: '#1A1D24',
    accent: '#00D4FF', success: '#34D399', warning: '#F59E0B',
    muted: 'rgba(255,255,255,0.4)',
    mono: "'IBM Plex Mono',monospace"
} as const;

export type ChallengeLevel = 1 | 2 | 3;

interface Challenge {
    id: string;
    level: ChallengeLevel;
    title: string;
    mission: string;
    target: string;
    reward: number;
}

const CHALLENGES: Challenge[] = [
    {
        id: 'c1', level: 1, title: 'Analog Matcher',
        mission: 'Synchronize the generator to reach exactly 12Hz peak.',
        target: 'Freq = 12.0Hz', reward: 50
    },
    {
        id: 'c2', level: 2, title: 'Threshold Hunter',
        mission: 'Find the exact UNDEFINED zone for the current signal.',
        target: 'Zone = [0.8V, 2.0V]', reward: 100
    },
    {
        id: 'c3', level: 3, title: 'Nyquist Master',
        mission: 'Convert a 7Hz signal into digital with zero aliasing.',
        target: 'Fs >= 14Hz', reward: 150
    }
];

interface SignalChallengesProps {
    currentLevel: ChallengeLevel;
    onStartChallenge: (id: string) => void;
    completedIds: string[];
}

export function SignalChallenges({ currentLevel, onStartChallenge, completedIds }: SignalChallengesProps) {
    const { triggerHaptic, playSound } = useGlobalSensory();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Trophy size={16} style={{ color: T.warning }} />
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Active Assignments
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {CHALLENGES.map((ch) => {
                    const isLocked = ch.level > currentLevel;
                    const isDone = completedIds.includes(ch.id);

                    return (
                        <motion.div
                            key={ch.id}
                            whileHover={!isLocked && !isDone ? { y: -2, border: `1px solid ${T.accent}40` } : {}}
                            onClick={() => {
                                if (!isLocked && !isDone) {
                                    onStartChallenge(ch.id);
                                    triggerHaptic('light');
                                    playSound('snap');
                                }
                            }}
                            style={{
                                background: T.card, border: `1px solid ${isDone ? T.success + '40' : T.border}`,
                                borderRadius: 4, padding: 12, position: 'relative',
                                cursor: isLocked || isDone ? 'default' : 'pointer',
                                opacity: isLocked ? 0.4 : 1, transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div style={{ 
                                    padding: '2px 6px', background: isDone ? T.success : T.accent, 
                                    borderRadius: 2, fontSize: 8, color: '#000', fontWeight: 800 
                                }}>
                                    LV.{ch.level}
                                </div>
                                {isDone && <CheckCircle2 size={12} style={{ color: T.success }} />}
                            </div>

                            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                                {ch.title}
                            </div>
                            <div style={{ fontSize: 9, color: T.muted, lineHeight: 1.3, marginBottom: 8, height: 24 }}>
                                {ch.mission}
                            </div>

                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: 4, 
                                fontSize: 9, fontFamily: T.mono, color: T.accent 
                            }}>
                                <Target size={10} /> {ch.target}
                            </div>

                            {!isLocked && !isDone && (
                                <motion.div 
                                    style={{ position: 'absolute', right: 8, bottom: 8 }}
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <ChevronRight size={14} style={{ color: T.accent }} />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
