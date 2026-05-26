// src/utils/storageMigration.ts
export const migrateStorage = () => {
  const MIGRATION_MAP: Record<string, string> = {
    'axe_compass_result': 'bfb_compass_result',
    'axe_compass_completed': 'bfb_compass_completed',
    'axe_career_v3_state': 'bfb_career_v3_state',
    'axe_mastered_nodes': 'bfb_mastered_nodes',
    'axe_mission_clocks': 'bfb_mission_clocks',
    'axe_mission_clock': 'bfb_mission_clock',
    'axe_user_profile': 'bfb_user_profile',
    'axe_timeline_progress': 'bfb_timeline_progress',
    'axe_badges': 'bfb_badges',
    'axe_bookmarks': 'bfb_bookmarks',
    'axe_viewed_ids': 'bfb_viewed_ids',
    'axe_viewed_count': 'bfb_viewed_count',
    'axe_dismissed_recs': 'bfb_dismissed_recs',
    'axe_quiz_scores': 'bfb_quiz_scores',
    'axe_mastery_domains': 'bfb_mastery_domains',
    'axe_sim_history': 'bfb_sim_history',
    'axe_ticker_paused': 'bfb_ticker_paused',
    'axe_internship_saved': 'bfb_internship_saved',
    'axe_daily_streak': 'bfb_daily_streak',
    'axe_daily_points': 'bfb_daily_points',
    'axe_last_challenge': 'bfb_last_challenge',
    'skill_graph_mixed_positions_v2': 'bfb_skill_graph_positions_v2',
    'ece_bookmarks': 'bfb_ece_bookmarks',
    'ece_viewed_ids': 'bfb_ece_viewed_ids',
    'ece_viewed_count': 'bfb_ece_viewed_count',
    'ece_badges': 'bfb_ece_badges',
    'ece_dismissed_recs': 'bfb_ece_dismissed_recs',
    'daily_points': 'bfb_daily_points',
    'daily_streak': 'bfb_daily_streak',
    'last_challenge': 'bfb_last_challenge',
  };
  Object.entries(MIGRATION_MAP).forEach(([oldKey, newKey]) => {
    const val = localStorage.getItem(oldKey);
    if (val !== null && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, val);
      localStorage.removeItem(oldKey);
    }
  });
};
