/**
 * Shared design tokens for the redesigned landing page.
 *
 * Direction: "Duotone Split" - the page alternates LIGHT and DARK section bands
 * down the scroll, keeping the BitforBytes cyan as the through-line accent.
 * Simple, visual, GenZ-native; one signature motif (SignalWave) is retained.
 */
export const LANDING_THEME = {
  light: {
    bg: '#F4F6FA',      // page band
    card: '#FFFFFF',
    border: 'rgba(15,23,42,0.08)',
    ink: '#0B1220',     // headings
    body: '#334155',    // slate-700 body text
    muted: '#64748B',   // slate-500
    faint: '#94A3B8',   // slate-400 / labels
    accent: '#0891B2',  // cyan-600 - readable on light
  },
  dark: {
    bg: '#0B1220',      // ink band
    card: 'rgba(255,255,255,0.04)',
    cardSolid: '#111A2B',
    border: 'rgba(255,255,255,0.10)',
    ink: '#F8FAFC',
    body: '#CBD5E1',    // slate-300
    muted: '#94A3B8',   // slate-400
    faint: '#64748B',
    accent: '#22D3EE',  // cyan-400 - pops on dark
  },
  /** Brand + categorical accents (shared across bands). */
  brand: '#06B6D4',
  amber: '#F59E0B',
  emerald: '#10B981',
  violet: '#8B5CF6',
  orange: '#EA580C',
} as const;
