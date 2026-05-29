/**
 * Single source of truth for every destination the landing page links to.
 *
 * Keeping them here means a label and its route can never drift apart — if a
 * module path changes, it changes in exactly one place and every CTA, nav item
 * and footer link stays aligned.
 *
 * Notes:
 *  - `firstModule` is `/module/1` ("Signals & Waves", L1) — the genuine first
 *    module per the HierarchicalGrindTree, NOT `/dsd/1` (which is the L3
 *    "Binary & Logic" digital-design track).
 *  - The career roadmap honours a `?tab=` query param (see career-roadmap
 *    index). Bare `/career-roadmap` now lands on the Explore tab.
 */
export const LANDING_ROUTES = {
  /** The real first module a newcomer should start with. */
  firstModule: '/module/1',
  /** Digital-design (gates → K-maps → NAND) track entry. */
  digitalDesign: '/dsd/1',
  /** Career roadmap, Explore tab (domains, companies). */
  career: '/career-roadmap?tab=explore',
  /** Career roadmap, Skills tab (skill-gap radar). */
  careerSkills: '/career-roadmap?tab=skills',
  /** Career roadmap, About tab (story, team, mission). */
  about: '/career-roadmap?tab=about',
  /** Auth / sign-in screen. */
  login: '/login',
  /** Public source repository. */
  github: 'https://github.com/kriten370/VeriLog_k1',
} as const;
