/**
 * Single source of truth for every destination the landing page links to.
 *
 * Keeping them here means a label and its route can never drift apart - if a
 * module path changes, it changes in exactly one place and every CTA, nav item
 * and footer link stays aligned.
 *
 * Notes:
 *  - `firstModule` is `/module/1` ("Signals & Waves", L1) - the genuine first
 *    module per the HierarchicalGrindTree, NOT `/dsd/1` (which is the L3
 *    "Binary & Logic" digital-design track).
 *  - The career roadmap honours a `?tab=` query param (see career-roadmap
 *    index). Bare `/career-roadmap` now lands on the Explore tab.
 */
export const SOCIAL_LINKS = {
  discord: 'https://discord.gg/mvKfBGmCc',
  email: 'mailto:bitforbyte.in@gmail.com',
  twitter: 'https://x.com/bitforbyte_',
  instagram: 'https://www.instagram.com/bit_for_bytes',
  reddit: 'https://www.reddit.com/u/Constant_Prize4232',
  linkedin: 'https://www.linkedin.com/company/bitforbytes/',
} as const;

export const LANDING_ROUTES = {
  /** The real first module a newcomer should start with. */
  firstModule: '/module/1',
  /** Digital-design (gates → K-maps → NAND) track entry. */
  digitalDesign: '/dsd/1',
  /** Basic Electronics track entry (module 1, Physics of Control). */
  basicElectronics: '/basic-electronics/1',
  /** Career roadmap (domains, salaries, companies, opportunities, path). */
  career: '/career-roadmap',
  /** Career roadmap, jump to the domains + skills section. */
  careerSkills: '/career-roadmap#domains',
  /** Auth / sign-in screen. */
  login: '/login',
  /** The signed-in hub (portal). Shown instead of sign-in once a session exists. */
  workstation: '/portal',
  /** Public source repository. */
  github: 'https://github.com/kriten370/VeriLog_k1',
  /** Social media links object. */
  social: SOCIAL_LINKS,
} as const;

