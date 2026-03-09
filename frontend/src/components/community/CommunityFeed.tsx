/**
 * CommunityFeed.tsx — Community circuit feed and discovery
 *
 * Shows shared circuits with search, filters, likes, and category tabs.
 * Each card shows circuit title, author, stats, and action buttons.
 */

import { useState, useCallback, memo } from 'react';
import { useCommunityStore } from '../../community/communityStore';
import type { CircuitCategory, SharedCircuit } from '../../community/CommunityTypes';

const CATEGORIES: { key: CircuitCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '🔷' },
    { key: 'combinational', label: 'Combinational', icon: '🔲' },
    { key: 'sequential', label: 'Sequential', icon: '🔄' },
    { key: 'arithmetic', label: 'Arithmetic', icon: '➕' },
    { key: 'memory', label: 'Memory', icon: '💾' },
    { key: 'processor', label: 'Processor', icon: '🖥' },
    { key: 'io', label: 'I/O', icon: '🔌' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    beginner: '#10B981',
    intermediate: '#F59E0B',
    advanced: '#EF4444',
    expert: '#8B5CF6',
};

export const CommunityFeed = memo(() => {
    const circuits = useCommunityStore(s => s.circuits);
    const feedFilters = useCommunityStore(s => s.feedFilters);
    const setFeedCategory = useCommunityStore(s => s.setFeedCategory);
    const setFeedSearch = useCommunityStore(s => s.setFeedSearch);
    const setFeedSort = useCommunityStore(s => s.setFeedSort);
    const likeCircuit = useCommunityStore(s => s.likeCircuit);
    const bookmarkCircuit = useCommunityStore(s => s.bookmarkCircuit);
    const forkCircuit = useCommunityStore(s => s.forkCircuit);

    const [activeCategory, setActiveCategory] = useState<CircuitCategory | 'all'>('all');

    const handleCategoryChange = useCallback((cat: CircuitCategory | 'all') => {
        setActiveCategory(cat);
        setFeedCategory(cat === 'all' ? undefined : cat);
    }, [setFeedCategory]);

    // Filter circuits
    const filtered = circuits.filter(c => {
        if (activeCategory !== 'all' && c.category !== activeCategory) return false;
        if (feedFilters.search && !c.title.toLowerCase().includes(feedFilters.search.toLowerCase())) return false;
        return true;
    });

    // Sort circuits
    const sorted = [...filtered].sort((a, b) => {
        switch (feedFilters.sort) {
            case 'popular': return b.likes - a.likes;
            case 'trending': return b.views - a.views;
            default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
        }}>
            {/* Search & Sort */}
            <div style={{
                display: 'flex',
                gap: 8,
                padding: '8px 12px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                alignItems: 'center',
            }}>
                <input
                    type="text"
                    placeholder="🔍 Search circuits..."
                    value={feedFilters.search || ''}
                    onChange={e => setFeedSearch(e.target.value)}
                    style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.1)',
                        color: '#e6edf3',
                        fontFamily: 'inherit',
                        fontSize: 11,
                        padding: '5px 10px',
                        borderRadius: 4,
                        outline: 'none',
                    }}
                />
                <select
                    value={feedFilters.sort}
                    onChange={e => setFeedSort(e.target.value as any)}
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.1)',
                        color: '#e6edf3',
                        fontFamily: 'inherit',
                        fontSize: 10,
                        padding: '4px 8px',
                        borderRadius: 4,
                        cursor: 'pointer',
                    }}
                >
                    <option value="recent">Recent</option>
                    <option value="popular">Popular</option>
                    <option value="trending">Trending</option>
                </select>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: 2,
                padding: '4px 12px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.04)',
                overflowX: 'auto',
            }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => handleCategoryChange(cat.key)}
                        style={{
                            background: activeCategory === cat.key ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                            border: `1px solid ${activeCategory === cat.key ? 'rgba(0, 212, 255, 0.2)' : 'transparent'}`,
                            color: activeCategory === cat.key ? '#00D4FF' : 'rgba(255,255,255,0.3)',
                            fontSize: 9,
                            padding: '3px 8px',
                            borderRadius: 3,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            whiteSpace: 'nowrap',
                            transition: 'all 100ms',
                        }}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* Circuit Cards */}
            <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.length === 0 && (
                    <div style={{ color: 'rgba(255,255,255,0.1)', textAlign: 'center', padding: 40, fontSize: 12 }}>
                        No circuits found. Try adjusting your filters!
                    </div>
                )}

                {sorted.map(circuit => (
                    <CircuitCard
                        key={circuit.id}
                        circuit={circuit}
                        onLike={() => likeCircuit(circuit.id)}
                        onBookmark={() => bookmarkCircuit(circuit.id)}
                        onFork={() => forkCircuit(circuit.id)}
                    />
                ))}
            </div>
        </div>
    );
});

CommunityFeed.displayName = 'CommunityFeed';

// ─── Circuit Card ────────────────────────────────────────────────────────

interface CircuitCardProps {
    circuit: SharedCircuit;
    onLike: () => void;
    onBookmark: () => void;
    onFork: () => void;
}

const CircuitCard = memo(({ circuit, onLike, onBookmark, onFork }: CircuitCardProps) => {
    const diffColor = DIFFICULTY_COLORS[circuit.difficulty] || '#6B7280';

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(0, 212, 255, 0.06)',
            borderRadius: 6,
            padding: '10px 12px',
            transition: 'all 150ms',
            cursor: 'pointer',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {/* Author avatar */}
                <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(0, 212, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: '#00D4FF',
                }}>
                    {circuit.author.displayName[0]}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ color: '#e6edf3', fontWeight: 600, fontSize: 12 }}>
                        {circuit.title}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>
                        by {circuit.author.displayName} · Lv.{circuit.author.level}
                    </div>
                </div>

                {/* Difficulty badge */}
                <span style={{
                    fontSize: 8,
                    padding: '2px 6px',
                    border: `1px solid ${diffColor}30`,
                    color: diffColor,
                    borderRadius: 3,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                }}>
                    {circuit.difficulty}
                </span>
            </div>

            {/* Description */}
            <div style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 10,
                lineHeight: 1.5,
                marginBottom: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
            }}>
                {circuit.description}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                {circuit.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: 8,
                        padding: '1px 5px',
                        background: 'rgba(0, 212, 255, 0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.08)',
                        borderRadius: 2,
                        color: 'rgba(0, 212, 255, 0.5)',
                    }}>
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div style={{
                display: 'flex',
                gap: 12,
                borderTop: '1px solid rgba(255,255,255,0.03)',
                paddingTop: 6,
                alignItems: 'center',
            }}>
                <ActionBtn
                    icon={circuit.isLiked ? '❤️' : '🤍'}
                    count={circuit.likes}
                    active={circuit.isLiked}
                    onClick={onLike}
                />
                <ActionBtn icon="👁" count={circuit.views} onClick={() => { }} />
                <ActionBtn icon="🔀" count={circuit.forks} onClick={onFork} />
                <ActionBtn icon="💬" count={circuit.comments} onClick={() => { }} />
                <span style={{ flex: 1 }} />
                <button
                    onClick={onBookmark}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        padding: 0,
                        color: circuit.isBookmarked ? '#F59E0B' : 'rgba(255,255,255,0.15)',
                    }}
                >
                    {circuit.isBookmarked ? '⭐' : '☆'}
                </button>
            </div>
        </div>
    );
});

CircuitCard.displayName = 'CircuitCard';

// ─── Action Button ───────────────────────────────────────────────────────

const ActionBtn = memo(({ icon, count, active, onClick }: {
    icon: string;
    count: number;
    active?: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 10,
            color: active ? '#EF4444' : 'rgba(255,255,255,0.25)',
            padding: 0,
            fontFamily: "'IBM Plex Mono', monospace",
        }}
    >
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span style={{ fontSize: 9 }}>{count}</span>
    </button>
));

ActionBtn.displayName = 'ActionBtn';
