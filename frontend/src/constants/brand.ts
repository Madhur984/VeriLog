// src/constants/brand.ts
// Single source of truth for all brand strings.
// Import from here — never hardcode brand name elsewhere.

export const BRAND = {
  name: 'BitforBytes',
  nameDisplay: 'BitforBytes',    // Bit + for + Bytes
  nameMono: 'BITFORBYTES',       // for monospace/all-caps contexts
  nameShort: 'BFB',              // abbreviation
  taglinePrimary: 'From bits to bytes. From gates to chips.',
  taglineSecondary: 'Learn digital design. One bit at a time.',
  taglineTertiary: 'Signals become logic. Logic becomes systems.',
  missionStatement:
    'Every ECE student in India deserves to know what their degree ' +
    'can actually do — for free, in plain language, starting today.',
  version: 'v5.0',
  year: '2026',
  footerCopy: 'Made with intent, not investment.',
  metaDescription:
    'BitforBytes — Free, interactive VLSI and digital design learning ' +
    'for every ECE student in India. From bits to bytes, from gates to chips.',
  url: 'https://bitforbytes.in',    // future domain
  localUrl: 'http://localhost:5173',
  storagePrefix: 'bfb_',
  tickerLabel: 'BFB INTEL // LIVE',
} as const;

export type BrandName = typeof BRAND.name;
