/**
 * Sandbox tour — placement maths and the anchor contract.
 *
 * The second half matters more than the first. A tour points at elements by
 * `data-tour` name, so renaming or dropping an attribute in the page silently
 * turns a step into a floating card with no spotlight — a failure that no type
 * checker catches and that only shows up if someone happens to replay the tour.
 * Reading the page source and checking every referenced anchor exists turns that
 * into a build failure.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { placeCard, SANDBOX_TOUR_STEPS } from './SandboxTour';

const CARD_W = 344;
const EDGE = 12;
const VW = 1500;
const VH = 950;

const box = (left: number, top: number, width = 100, height = 40) => ({ left, top, width, height });

describe('placeCard', () => {
  it('centres the card when a step has no anchor', () => {
    const p = placeCard(null, 200, undefined, VW, VH);
    expect(p.left).toBe(Math.round((VW - CARD_W) / 2));
    expect(p.top).toBe(Math.round((VH - 200) / 2));
  });

  it('sits below the target when there is room', () => {
    const b = box(700, 100);
    const p = placeCard(b, 200, 'bottom', VW, VH);
    expect(p.top).toBeGreaterThan(b.top + b.height);
  });

  it('flips above when the target is near the bottom edge', () => {
    const b = box(700, 900);
    const p = placeCard(b, 200, 'bottom', VW, VH);
    // No room beneath a target 900px down in a 950px viewport.
    expect(p.top + 200).toBeLessThanOrEqual(b.top + EDGE);
  });

  it('flips left when the target hugs the right edge', () => {
    const b = box(VW - 60, 400, 50, 40);
    const p = placeCard(b, 200, 'right', VW, VH);
    expect(p.left + CARD_W).toBeLessThanOrEqual(VW - EDGE + 1);
  });

  it('never lets the card leave the viewport, wherever the target is', () => {
    const spots = [
      box(0, 0), box(VW - 100, 0), box(0, VH - 40), box(VW - 100, VH - 40),
      box(VW / 2, VH / 2), box(-50, -20), box(VW + 100, VH + 100),
    ];
    for (const b of spots) {
      for (const place of ['top', 'bottom', 'left', 'right'] as const) {
        const p = placeCard(b, 260, place, VW, VH);
        expect(p.left).toBeGreaterThanOrEqual(EDGE);
        expect(p.top).toBeGreaterThanOrEqual(EDGE);
        expect(p.left + CARD_W).toBeLessThanOrEqual(VW - EDGE + 1);
        expect(p.top + 260).toBeLessThanOrEqual(VH - EDGE + 1);
      }
    }
  });

  it('fits a phone-width viewport once the card is narrowed to match', () => {
    // 360px screen: the card shrinks to 336 and must still clear both edges.
    const vw = 360;
    const cardW = Math.min(CARD_W, vw - EDGE * 2);
    for (const b of [box(0, 60, 90, 36), box(vw - 48, 8, 40, 40), box(120, 700, 100, 30)]) {
      const p = placeCard(b, 220, 'bottom', vw, 780, cardW);
      expect(p.left).toBeGreaterThanOrEqual(EDGE);
      expect(p.left + cardW).toBeLessThanOrEqual(vw - EDGE + 1);
    }
  });

  it('keeps the card on screen when it is taller than the viewport allows', () => {
    // A long step on a short window: clamping must win over centring rather
    // than pushing the buttons off the top.
    const p = placeCard(box(700, 300), 900, 'bottom', VW, 600);
    expect(p.top).toBeGreaterThanOrEqual(EDGE);
    expect(p.left).toBeGreaterThanOrEqual(EDGE);
  });
});

describe('the tour script', () => {
  const page = readFileSync(
    resolve(__dirname, '../../pages/VerilogSandbox.tsx'), 'utf8');
  const anchorsInPage = new Set(
    [...page.matchAll(/data-tour="([^"]+)"/g)].map((m) => m[1]));

  it('every step that names an anchor points at one the page renders', () => {
    const missing = SANDBOX_TOUR_STEPS
      .map((s) => s.target)
      .filter((t): t is string => !!t)
      .filter((t) => !anchorsInPage.has(t));
    expect(missing).toEqual([]);
  });

  it('mounts the tour and offers a way to replay it', () => {
    expect(anchorsInPage.has('help')).toBe(true);
    expect(page).toMatch(/<SandboxTour\b/);
  });

  it('opens on a first visit and stays shut afterwards', () => {
    // The gate is a localStorage key, and inverting this comparison would show
    // the tour to everyone on every visit.
    expect(page).toMatch(/localStorage\.getItem\(TOUR_KEY\)\s*!==\s*'done'/);
    expect(page).toMatch(/localStorage\.setItem\(TOUR_KEY,\s*'done'\)/);
  });

  it('reads as a coherent script', () => {
    expect(SANDBOX_TOUR_STEPS.length).toBeGreaterThanOrEqual(5);
    // A first and last step with no anchor: the welcome and the sign-off are
    // about the tool as a whole, not about one control.
    expect(SANDBOX_TOUR_STEPS[0].target).toBeUndefined();
    expect(SANDBOX_TOUR_STEPS[SANDBOX_TOUR_STEPS.length - 1].target).toBeUndefined();
    for (const s of SANDBOX_TOUR_STEPS) expect(s.title.trim()).not.toBe('');
    // Titles are the dot-list keys in the component, so they must be unique.
    const titles = SANDBOX_TOUR_STEPS.map((s) => s.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
