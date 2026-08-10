export type CareerEventName =
  | 'roadmap_personalized'
  | 'roadmap_tab_opened'
  | 'recommended_next_step_opened'
  | 'recommended_step_completed'
  | 'internship_directory_opened'
  | 'internship_apply_clicked'
  | 'government_initiatives_opened'
  | 'trajectory_simulator_opened'
  | 'silicon_runner_game_opened'
  | 'silicon_runner_banner_clicked';

export interface CareerAnalyticsEvent {
  name: CareerEventName;
  properties: Record<string, string | number | boolean>;
  occurredAt: string;
}

const STORAGE_KEY = 'bfb_career_analytics_queue';
const MAX_EVENTS = 50;

/**
 * Privacy-safe client event queue. It contains no identity, free-text, or resume
 * data. An analytics provider can subscribe to `bfb:career-analytics` later.
 */
export function trackCareerEvent(name: CareerEventName, properties: CareerAnalyticsEvent['properties'] = {}) {
  const event: CareerAnalyticsEvent = { name, properties, occurredAt: new Date().toISOString() };
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as CareerAnalyticsEvent[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, event].slice(-MAX_EVENTS)));
    window.dispatchEvent(new CustomEvent<CareerAnalyticsEvent>('bfb:career-analytics', { detail: event }));
  } catch {
    // Analytics must never interfere with the roadmap experience.
  }
}

export function getQueuedCareerEvents(): CareerAnalyticsEvent[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as CareerAnalyticsEvent[]; }
  catch { return []; }
}
