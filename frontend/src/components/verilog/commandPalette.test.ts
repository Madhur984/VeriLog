/**
 * The fuzzy matcher is the whole usability of the palette: if "gcnt" does not
 * find "Gray Code Counter", people go back to the mouse.
 */
import { describe, it, expect } from 'vitest';
import { fuzzyScore } from './CommandPalette';

describe('fuzzyScore', () => {
  it('matches a subsequence, not just a substring', () => {
    expect(fuzzyScore('Gray Code Counter', 'gcnt')).toBeGreaterThanOrEqual(0);
    expect(fuzzyScore('Gray Code Counter', 'gcc')).toBeGreaterThanOrEqual(0);
  });

  it('rejects letters that are not present in order', () => {
    expect(fuzzyScore('Gray Code Counter', 'zzz')).toBe(-1);
    expect(fuzzyScore('Half Adder', 'redda')).toBe(-1);
  });

  it('treats an empty query as neutral rather than a rejection', () => {
    expect(fuzzyScore('anything', '')).toBe(0);
  });

  it('ranks a prefix above letters scattered through the string', () => {
    const prefix = fuzzyScore('Ring Counter', 'ring');
    const scattered = fuzzyScore('Reverse the bIt order desigN', 'ring');
    expect(prefix).toBeGreaterThan(scattered);
  });

  it('rewards word-boundary hits, so initials find multi-word titles', () => {
    const initials = fuzzyScore('Parallel In Serial Out', 'piso');
    const midword = fuzzyScore('appliesinseriousoutput', 'piso');
    expect(initials).toBeGreaterThan(midword);
  });

  it('prefers the shorter of two equally-matching labels', () => {
    expect(fuzzyScore('Wire', 'wire')).toBeGreaterThan(fuzzyScore('Wire Reduction Helper', 'wire'));
  });

  it('is case-insensitive in both directions', () => {
    expect(fuzzyScore('MOORE FSM', 'moore')).toBeGreaterThanOrEqual(0);
    expect(fuzzyScore('moore fsm', 'MOORE')).toBeGreaterThanOrEqual(0);
  });
});
