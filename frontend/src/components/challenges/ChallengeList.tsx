/**
 * ChallengeList.tsx — Browse hardware challenges by difficulty/category
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
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
            }}>
                <h2 style={{ margin: 0, color: '#00D4FF', fontSize: 14, fontWeight: 700 }}>
                    ⚡ Hardware LeetCode
                </h2>
                <span style={{ flex: 1 }} />
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>
                    {totalSolved}/{totalChallenges} solved
                </span>
                {/* Progress bar */}
                <div style={{
                    width: 80,
                    height: 4,
                    background: 'rgba(255,255,255,0.05)',
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
                borderBottom: '1px solid rgba(0, 212, 255, 0.04)',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
            }}>
                {DIFF_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveDiff(tab.key)}
                        style={{
                            background: activeDiff === tab.key ? `${tab.color}10` : 'transparent',
                            border: `1px solid ${activeDiff === tab.key ? `${tab.color}25` : 'transparent'}`,
                            color: activeDiff === tab.key ? tab.color : 'rgba(255,255,255,0.3)',
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
                                background: solved ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${solved ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 212, 255, 0.06)'}`,
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
                                <span style={{ color: '#e6edf3', fontWeight: 600, fontSize: 12, flex: 1 }}>
                                    {challenge.title}
                                </span>
                                <span style={{
                                    fontSize: 7,
                                    padding: '1px 5px',
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
                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, textTransform: 'capitalize' }}>
                                    {challenge.category.replace('_', ' ')}
                                </span>
                                <span style={{ flex: 1 }} />
                                <span style={{ color: '#F59E0B', fontSize: 9 }}>💎 {challenge.xpReward} XP</span>
                            </div>

                            {/* Stats */}
                            <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 8 }}>
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
