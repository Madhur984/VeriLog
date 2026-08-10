/**
 * ChallengeList.tsx - Browse hardware challenges by difficulty/category
 *
 * Grid of challenge cards with filtering and progress tracking.
 */

import { useState, memo } from 'react';
import { HARDWARE_CHALLENGES, type HardwareChallenge, type ChallengeDifficulty } from '../../engines/challenges/ChallengeEngine';

interface ChallengeListProps {
    completedIds: string[];
    onSelect: (challenge: HardwareChallenge) => void;
}

const DIFF_TABS: { key: ChallengeDifficulty | 'all'; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: '#00D4FF' },
    { key: 'easy', label: 'Easy', color: '#10B981' },
    { key: 'medium', label: 'Medium', color: '#F59E0B' },
    { key: 'hard', label: 'Hard', color: '#EF4444' },
    { key: 'expert', label: 'Expert', color: '#8B5CF6' },
];

export const ChallengeList = memo(({ completedIds, onSelect }: ChallengeListProps) => {
    const [activeDiff, setActiveDiff] = useState<ChallengeDifficulty | 'all'>('all');

    const filtered = activeDiff === 'all'
        ? HARDWARE_CHALLENGES
        : HARDWARE_CHALLENGES.filter(c => c.difficulty === activeDiff);

    const totalSolved = completedIds.length;
    const totalChallenges = HARDWARE_CHALLENGES.length;

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
            fontSize: 11,
            backgroundColor: 'var(--bg-void)',
            color: 'var(--text-main)',
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-soft)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
            }}>
                <h2 style={{ margin: 0, color: 'var(--accent-orange)', fontSize: 14, fontWeight: 700 }}>
                    ⚡ Hardware LeetCode
                </h2>
                <span style={{ flex: 1 }} />
                <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>
                    {totalSolved}/{totalChallenges} solved
                </span>
                {/* Progress bar */}
                <div style={{
                    width: 80,
                    height: 4,
                    background: 'var(--border-soft)',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: `${(totalSolved / totalChallenges) * 100}%`,
                        height: '100%',
                        background: '#10B981',
                        borderRadius: 2,
                        transition: 'width 300ms',
                    }} />
                </div>
            </div>

            {/* Difficulty Tabs */}
            <div style={{
                display: 'flex',
                gap: 2,
                padding: '6px 16px',
                borderBottom: '1px solid var(--border-soft)',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
            }}>
                {DIFF_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveDiff(tab.key)}
                        style={{
                            background: activeDiff === tab.key ? `${tab.color}15` : 'transparent',
                            border: `1px solid ${activeDiff === tab.key ? `${tab.color}30` : 'transparent'}`,
                            color: activeDiff === tab.key ? tab.color : 'var(--text-dim)',
                            fontSize: 10,
                            padding: '6px 10px',
                            minHeight: 40,
                            borderRadius: 3,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 100ms',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Challenge Grid */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                gap: 10,
                alignContent: 'start',
            }}>
                {filtered.map(challenge => {
                    const solved = completedIds.includes(challenge.id);
                    const diffColor = DIFF_TABS.find(t => t.key === challenge.difficulty)?.color || '#6B7280';

                    return (
                        <button
                            key={challenge.id}
                            onClick={() => onSelect(challenge)}
                            style={{
                                background: solved ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-elev)',
                                border: `1px solid ${solved ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-soft)'}`,
                                borderRadius: 6,
                                padding: '12px 14px',
                                minHeight: 64,
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 150ms',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                            }}
                        >
                            {/* Title row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 12 }}>{solved ? '✅' : '⬜'}</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 12, flex: 1 }}>
                                    {challenge.title}
                                </span>
                                <span style={{
                                    fontSize: 10,
                                    padding: '2px 6px',
                                    border: `1px solid ${diffColor}30`,
                                    color: diffColor,
                                    borderRadius: 2,
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                }}>
                                    {challenge.difficulty}
                                </span>
                            </div>

                            {/* Category + XP */}
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-sub)', fontSize: 11, textTransform: 'capitalize' }}>
                                    {challenge.category.replace('_', ' ')}
                                </span>
                                <span style={{ flex: 1 }} />
                                <span style={{ color: '#F59E0B', fontSize: 11 }}>💎 {challenge.xpReward} XP</span>
                            </div>

                            {/* Stats */}
                            <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>
                                {challenge.solvedCount} solved · {Math.round(challenge.acceptanceRate * 100)}% acceptance
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

ChallengeList.displayName = 'ChallengeList';
