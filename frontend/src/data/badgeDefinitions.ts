
export interface BadgeDefinition {
  id: string;
  name: string;
  subtitle: string;
  trigger: 'complete_subtree' | 'complete_mastery_quiz' | 'use_feature';
  subtreeIds?: string[];
  domain?: string;
  score?: number;
  feature?: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'UTILITY';
  serialPrefix: string;
  description: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'digital-foundation',
    name: 'DIGITAL FOUNDATION',
    subtitle: 'AXE-OR VERIFIED // SERIES-01',
    trigger: 'complete_subtree',
    subtreeIds: ['digital-logic', 'boolean-algebra', 'kmaps', 'sequential-logic'],
    tier: 'BRONZE',
    serialPrefix: 'DF',
    description: 'Mastery of digital design fundamentals confirmed.'
  },
  {
    id: 'rtl-architect',
    name: 'RTL ARCHITECT',
    subtitle: 'AXE-OR VERIFIED // SERIES-02',
    trigger: 'complete_subtree',
    subtreeIds: ['verilog', 'rtl-synthesis', 'timing-analysis', 'formal-verify'],
    tier: 'SILVER',
    serialPrefix: 'RA',
    description: 'RTL design and synthesis pipeline mastered.'
  },
  {
    id: 'silicon-master',
    name: 'SILICON MASTER',
    subtitle: 'AXE-OR VERIFIED // SERIES-03',
    trigger: 'complete_mastery_quiz',
    domain: 'vlsi-design',
    score: 5,
    tier: 'GOLD',
    serialPrefix: 'SM',
    description: 'VLSI mastery quiz completed with perfect score.'
  },
  {
    id: 'fiscal-navigator',
    name: 'FISCAL NAVIGATOR',
    subtitle: 'AXE-OR VERIFIED // UTILITY',
    trigger: 'use_feature',
    feature: 'fiscal_matrix',
    tier: 'UTILITY',
    serialPrefix: 'FN',
    description: 'Global compensation analysis completed.'
  }
];
