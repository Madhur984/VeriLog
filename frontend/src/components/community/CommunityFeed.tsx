/**
 * CommunityFeed.tsx - Community circuit feed and discovery
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
                padding: '12px 16px',
                background: 'white',
                borderBottom: '1px solid #E2E8F0',
                alignItems: 'center',
            }}>
                <input
                    type="text"
                    placeholder="Search circuits..."
                    value={feedFilters.search || ''}
                    onChange={e => setFeedSearch(e.target.value)}
                    style={{
                        flex: 1,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: '#0F172A',
                        fontFamily: 'inherit',
                        fontSize: 12,
                        padding: '8px 12px',
                        borderRadius: 12,
                        outline: 'none',
                    }}
                />
                <select
                    value={feedFilters.sort}
                    onChange={e => setFeedSort(e.target.value as any)}
                    style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: '#0F172A',
                        fontFamily: 'inherit',
                        fontSize: 12,
                        padding: '8px 12px',
                        borderRadius: 12,
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
                gap: 8,
                padding: '8px 16px',
                background: 'white',
                borderBottom: '1px solid #E2E8F0',
                overflowX: 'auto',
            }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => handleCategoryChange(cat.key)}
                        style={{
                            background: activeCategory === cat.key ? '#F0F9FF' : 'transparent',
                            border: `1px solid ${activeCategory === cat.key ? '#0284C7' : 'transparent'}`,
                            color: activeCategory === cat.key ? '#0284C7' : '#94A3B8',
                            fontSize: 11,
                            padding: '6px 12px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: activeCategory === cat.key ? 600 : 400,
                            whiteSpace: 'nowrap',
                            transition: 'all 200ms',
                        }}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* Circuit Cards */}
            <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.length === 0 && (
                    <div style={{ color: '#94A3B8', textAlign: 'center', padding: 40, fontSize: 13, fontWeight: 500 }}>
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
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: '16px 20px',
            transition: 'all 200ms',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {/* Author avatar */}
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#F0F9FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: '#0284C7',
                    fontWeight: 700,
                }}>
                    {circuit.author.displayName[0]}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ color: '#0F172A', fontWeight: 700, fontSize: 14 }}>
                        {circuit.title}
                    </div>
                    <div style={{ color: '#64748B', fontSize: 11 }}>
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
                color: '#475569',
                fontSize: 12,
                lineHeight: 1.6,
                marginBottom: 12,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
            }}>
                {circuit.description}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {circuit.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: 10,
                        padding: '3px 8px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 6,
                        color: '#64748B',
                        fontWeight: 500,
                    }}>
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div style={{
                display: 'flex',
                gap: 16,
                borderTop: '1px solid #F1F5F9',
                paddingTop: 12,
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
                        fontSize: 14,
                        padding: 4,
                        color: circuit.isBookmarked ? '#F59E0B' : '#CBD5E1',
                        transition: 'color 150ms',
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
            fontSize: 11,
            color: active ? '#F43F5E' : '#64748B',
            padding: '4px 8px',
            borderRadius: 6,
            transition: 'all 150ms',
            fontFamily: "'IBM Plex Mono', monospace",
        }}
    >
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600 }}>{count}</span>
    </button>
));

ActionBtn.displayName = 'ActionBtn';
