/**
 * useKMapProgress.ts - Supabase-backed data hook for Level 5 K-Map module.
 *
 * Provides:
 * - loadProgress()         → fetches completed scenes from DB
 * - markSceneComplete()    → upserts module_progress + appends user_xp_events
 * - saveKMapSession()      → inserts grouping analytics into kmap_sessions
 * - submitChallenge()      → inserts attempt into kmap_challenge_attempts
 * - completeSkill()        → inserts into skill_unlocks
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface KMapSession {
    variables: number;
    minterms: number[];
    groups: string[][];
    expression: string;
    is_optimal: boolean;
}

export interface ChallengeAttempt {
    challenge_id: string;
    passed: boolean;
    score: number;
    gate_reduction?: number;
    time_taken_seconds?: number;
    expression_submitted?: string;
}

export function useKMapProgress(moduleId = 'level-5') {
    const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Load current user & completed scenes on mount
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }
            setUserId(user.id);

            const { data } = await supabase
                .from('module_progress')
                .select('scene_id')
                .eq('user_id', user.id)
                .eq('module_id', moduleId);

            if (data) {
                setCompletedScenes(new Set(data.map(r => r.scene_id)));
            }
            setLoading(false);
        };
        init();
    }, [moduleId]);

    const markSceneComplete = useCallback(async (sceneId: string, xp: number, category = 'application') => {
        if (!userId) return;

        await supabase.from('module_progress').upsert({
            user_id: userId,
            module_id: moduleId,
            scene_id: sceneId,
            xp_earned: xp,
        }, { onConflict: 'user_id,module_id,scene_id' });

        await supabase.from('user_xp_events').insert({
            user_id: userId,
            category,
            amount: xp,
            source: `${moduleId}:${sceneId}`,
        });

        setCompletedScenes(prev => new Set([...prev, sceneId]));
    }, [userId, moduleId]);

    const saveKMapSession = useCallback(async (session: KMapSession) => {
        if (!userId) return;
        await supabase.from('kmap_sessions').insert({
            user_id: userId,
            ...session,
            groups: JSON.stringify(session.groups),
        });
    }, [userId]);

    const submitChallenge = useCallback(async (attempt: ChallengeAttempt) => {
        if (!userId) return;
        await supabase.from('kmap_challenge_attempts').insert({
            user_id: userId,
            ...attempt,
        });
    }, [userId]);

    const unlockSkill = useCallback(async (skillId: string) => {
        if (!userId) return;
        await supabase.from('skill_unlocks').upsert({
            user_id: userId,
            skill_id: skillId,
        }, { onConflict: 'user_id,skill_id' });
    }, [userId]);

    return {
        completedScenes,
        loading,
        markSceneComplete,
        saveKMapSession,
        submitChallenge,
        unlockSkill,
    };
}
