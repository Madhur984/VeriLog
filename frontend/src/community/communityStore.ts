/**
 * communityStore.ts — Zustand store for community features
 *
 * Manages shared circuits, feed, and social interactions.
 * Uses optimistic updates for likes/bookmarks.
 */

import { create } from 'zustand';
import type {
    SharedCircuit, FeedItem, FeedFilters, FeedSortOrder,
    CircuitCategory, Comment, CommunityProfile,
} from './CommunityTypes';

// ─── Store Interface ────────────────────────────────────────────────────

interface CommunityState {
    // Feed
    feed: FeedItem[];
    feedLoading: boolean;
    feedFilters: FeedFilters;

    // Circuits
    circuits: SharedCircuit[];
    selectedCircuit: SharedCircuit | null;
    circuitComments: Comment[];

    // Social
    following: Set<string>;

    // Actions — Feed
    setFeedSort: (sort: FeedSortOrder) => void;
    setFeedCategory: (category: CircuitCategory | undefined) => void;
    setFeedSearch: (search: string) => void;
    loadFeed: () => void;

    // Actions — Circuits
    shareCircuit: (circuit: Omit<SharedCircuit, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'forks' | 'comments' | 'isLiked' | 'isBookmarked' | 'author'>) => void;
    selectCircuit: (id: string | null) => void;
    likeCircuit: (id: string) => void;
    bookmarkCircuit: (id: string) => void;
    forkCircuit: (id: string) => void;

    // Actions — Comments
    addComment: (circuitId: string, content: string) => void;
    likeComment: (commentId: string) => void;

    // Actions — Social
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
}

// ─── Mock Data ──────────────────────────────────────────────────────────

const MOCK_PROFILE: CommunityProfile = {
    userId: 'current-user',
    username: 'circuit_builder',
    displayName: 'Circuit Builder',
    avatarUrl: '',
    bio: 'Learning digital electronics!',
    level: 5,
    xp: 1250,
    badges: [],
    circuitsShared: 3,
    followers: 12,
    following: 8,
    joinedAt: new Date().toISOString(),
};

const MOCK_CIRCUITS: SharedCircuit[] = [
    {
        id: 'c1',
        authorId: 'user-1',
        author: { ...MOCK_PROFILE, userId: 'user-1', username: 'logic_master', displayName: 'Logic Master', level: 12 },
        title: '4-bit Ripple Carry Adder',
        description: 'A complete 4-bit ripple carry adder built from full adders. Great for understanding carry propagation.',
        tags: ['adder', 'arithmetic', 'beginner'],
        circuitData: '{}',
        thumbnailUrl: '',
        visibility: 'public',
        likes: 42,
        views: 156,
        forks: 8,
        comments: 5,
        difficulty: 'beginner',
        category: 'arithmetic',
        createdAt: '2025-03-01T10:00:00Z',
        updatedAt: '2025-03-01T10:00:00Z',
        isLiked: false,
        isBookmarked: false,
    },
    {
        id: 'c2',
        authorId: 'user-2',
        author: { ...MOCK_PROFILE, userId: 'user-2', username: 'flip_flop_fan', displayName: 'Flip Flop Fan', level: 8 },
        title: 'JK Flip-Flop with Clear',
        description: 'Edge-triggered JK flip-flop with asynchronous clear. Includes timing diagram.',
        tags: ['sequential', 'flip-flop', 'intermediate'],
        circuitData: '{}',
        thumbnailUrl: '',
        visibility: 'public',
        likes: 28,
        views: 89,
        forks: 3,
        comments: 2,
        difficulty: 'intermediate',
        category: 'sequential',
        createdAt: '2025-02-28T14:00:00Z',
        updatedAt: '2025-02-28T14:00:00Z',
        isLiked: true,
        isBookmarked: false,
    },
    {
        id: 'c3',
        authorId: 'user-3',
        author: { ...MOCK_PROFILE, userId: 'user-3', username: 'cpu_architect', displayName: 'CPU Architect', level: 15 },
        title: '8-bit ALU with Flags',
        description: 'Full 8-bit ALU supporting ADD, SUB, AND, OR, XOR, NOT with Zero, Carry, and Overflow flags.',
        tags: ['alu', 'processor', 'advanced'],
        circuitData: '{}',
        thumbnailUrl: '',
        visibility: 'public',
        likes: 67,
        views: 234,
        forks: 15,
        comments: 12,
        difficulty: 'advanced',
        category: 'processor',
        createdAt: '2025-02-25T09:00:00Z',
        updatedAt: '2025-02-25T09:00:00Z',
        isLiked: false,
        isBookmarked: true,
    },
];

// ─── Store ──────────────────────────────────────────────────────────────

export const useCommunityStore = create<CommunityState>((set, get) => ({
    // Initial state
    feed: [],
    feedLoading: false,
    feedFilters: { sort: 'recent' },
    circuits: MOCK_CIRCUITS,
    selectedCircuit: null,
    circuitComments: [],
    following: new Set<string>(),

    // Feed actions
    setFeedSort: (sort) => set(s => ({ feedFilters: { ...s.feedFilters, sort } })),
    setFeedCategory: (category) => set(s => ({ feedFilters: { ...s.feedFilters, category } })),
    setFeedSearch: (search) => set(s => ({ feedFilters: { ...s.feedFilters, search } })),

    loadFeed: () => {
        set({ feedLoading: true });
        // Simulate feed from circuits
        const circuits = get().circuits;
        const feedItems: FeedItem[] = circuits.map(c => ({
            id: `feed-${c.id}`,
            type: 'circuit_shared' as const,
            userId: c.authorId,
            user: c.author,
            timestamp: c.createdAt,
            circuit: c,
        }));
        set({ feed: feedItems, feedLoading: false });
    },

    // Circuit actions
    shareCircuit: (circuitData) => {
        const newCircuit: SharedCircuit = {
            ...circuitData,
            id: `c-${Date.now()}`,
            author: MOCK_PROFILE,
            likes: 0,
            views: 0,
            forks: 0,
            comments: 0,
            isLiked: false,
            isBookmarked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set(s => ({ circuits: [newCircuit, ...s.circuits] }));
    },

    selectCircuit: (id) => {
        if (!id) { set({ selectedCircuit: null }); return; }
        const circuit = get().circuits.find(c => c.id === id) || null;
        set({ selectedCircuit: circuit });
    },

    likeCircuit: (id) => {
        set(s => ({
            circuits: s.circuits.map(c => c.id === id
                ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
                : c
            ),
        }));
    },

    bookmarkCircuit: (id) => {
        set(s => ({
            circuits: s.circuits.map(c => c.id === id
                ? { ...c, isBookmarked: !c.isBookmarked }
                : c
            ),
        }));
    },

    forkCircuit: (id) => {
        const original = get().circuits.find(c => c.id === id);
        if (!original) return;
        const forked: SharedCircuit = {
            ...original,
            id: `c-${Date.now()}`,
            author: MOCK_PROFILE,
            authorId: MOCK_PROFILE.userId,
            title: `${original.title} (Fork)`,
            likes: 0,
            views: 0,
            forks: 0,
            comments: 0,
            isLiked: false,
            isBookmarked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set(s => ({
            circuits: [forked, ...s.circuits],
            circuits_orig: s.circuits.map(c => c.id === id ? { ...c, forks: c.forks + 1 } : c),
        } as any));
    },

    // Comment actions
    addComment: (circuitId, content) => {
        const comment: Comment = {
            id: `cmt-${Date.now()}`,
            authorId: MOCK_PROFILE.userId,
            author: MOCK_PROFILE,
            circuitId,
            content,
            likes: 0,
            isLiked: false,
            createdAt: new Date().toISOString(),
            replies: [],
        };
        set(s => ({ circuitComments: [...s.circuitComments, comment] }));
    },

    likeComment: (commentId) => {
        set(s => ({
            circuitComments: s.circuitComments.map(c => c.id === commentId
                ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
                : c
            ),
        }));
    },

    // Social actions
    followUser: (userId) => {
        set(s => {
            const next = new Set(s.following);
            next.add(userId);
            return { following: next };
        });
    },

    unfollowUser: (userId) => {
        set(s => {
            const next = new Set(s.following);
            next.delete(userId);
            return { following: next };
        });
    },
}));
