/**
 * CommunityTypes.ts - Type definitions for Community Platform
 *
 * Defines shared circuits, user profiles, comments, ratings,
 * and community feed structures.
 */

// ─── User Profiles ──────────────────────────────────────────────────────

export interface CommunityProfile {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    level: number;
    xp: number;
    badges: Badge[];
    circuitsShared: number;
    followers: number;
    following: number;
    joinedAt: string;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// ─── Shared Circuits ────────────────────────────────────────────────────

export type CircuitVisibility = 'public' | 'unlisted' | 'private';

export interface SharedCircuit {
    id: string;
    authorId: string;
    author: CommunityProfile;
    title: string;
    description: string;
    tags: string[];
    circuitData: string;          // Serialized circuit JSON
    thumbnailUrl: string;
    visibility: CircuitVisibility;
    likes: number;
    views: number;
    forks: number;
    comments: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: CircuitCategory;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
    isBookmarked: boolean;
}

export type CircuitCategory =
    | 'combinational'
    | 'sequential'
    | 'arithmetic'
    | 'memory'
    | 'processor'
    | 'io'
    | 'custom';

// ─── Comments ───────────────────────────────────────────────────────────

export interface Comment {
    id: string;
    authorId: string;
    author: CommunityProfile;
    circuitId: string;
    content: string;
    likes: number;
    isLiked: boolean;
    createdAt: string;
    replies: Comment[];
}

// ─── Feed ───────────────────────────────────────────────────────────────

export type FeedItemType = 'circuit_shared' | 'circuit_forked' | 'badge_earned' | 'level_up' | 'challenge_completed';

export interface FeedItem {
    id: string;
    type: FeedItemType;
    userId: string;
    user: CommunityProfile;
    timestamp: string;

    // Payload varies by type
    circuit?: SharedCircuit;
    badge?: Badge;
    newLevel?: number;
    challengeId?: string;
    challengeTitle?: string;
}

export type FeedSortOrder = 'recent' | 'popular' | 'trending';

export interface FeedFilters {
    sort: FeedSortOrder;
    category?: CircuitCategory;
    difficulty?: SharedCircuit['difficulty'];
    search?: string;
}
