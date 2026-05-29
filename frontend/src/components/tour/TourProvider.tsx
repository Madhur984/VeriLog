import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getTourForPath, type TourDef } from './tourSteps';

/**
 * Global, route-aware onboarding tour controller.
 *
 * - On entering a route with a registered tour, auto-starts it once per browser
 *   (unless the visitor has opted out of all tours).
 * - Persists per-tour "seen" + a global opt-out flag in localStorage, so it
 *   works for guests and logged-in users alike.
 * - Exposes start/stop/next/prev + a `dontShowAgain` opt-out for the overlay
 *   and the floating launcher beacon.
 */

const DONE_PREFIX = 'bfb_tour_done_';
const OPTOUT_KEY = 'bfb_tour_optout';
const AUTOSTART_DELAY = 1100; // let the page mount/animate in first

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string): void {
  try { localStorage.setItem(key, val); } catch { /* ignore */ }
}

function isSeen(id: string): boolean { return lsGet(DONE_PREFIX + id) === '1'; }
function markSeen(id: string): void { lsSet(DONE_PREFIX + id, '1'); }
function isOptedOut(): boolean { return lsGet(OPTOUT_KEY) === '1'; }

interface TourCtx {
  def: TourDef | null;          // tour available for the current route
  index: number;
  isActive: boolean;
  hasTourForPath: boolean;
  seenCurrent: boolean;
  start: () => void;
  stop: (markComplete?: boolean) => void;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  dontShowAgain: () => void;
}

const Ctx = createContext<TourCtx | null>(null);

export function useTour(): TourCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTour must be used within <TourProvider>');
  return ctx;
}

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [def, setDef] = useState<TourDef | null>(null);
  const [index, setIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [seenCurrent, setSeenCurrent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve tour on route change + schedule auto-start.
  useEffect(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setIsActive(false);
    setIndex(0);

    const tour = getTourForPath(location.pathname);
    setDef(tour);
    setSeenCurrent(tour ? isSeen(tour.id) : false);

    if (tour && !isSeen(tour.id) && !isOptedOut()) {
      timerRef.current = setTimeout(() => {
        setIndex(0);
        setIsActive(true);
      }, AUTOSTART_DELAY);
    }
    return () => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    };
  }, [location.pathname]);

  const stop = useCallback((markComplete = true) => {
    setIsActive(false);
    if (markComplete && def) {
      markSeen(def.id);
      setSeenCurrent(true);
    }
    setIndex(0);
  }, [def]);

  const start = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!def) return;
    setIndex(0);
    setIsActive(true);
  }, [def]);

  const next = useCallback(() => {
    if (!def) return;
    setIndex((i) => {
      if (i >= def.steps.length - 1) return i; // overlay handles finish
      return i + 1;
    });
  }, [def]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goTo = useCallback((i: number) => setIndex(i), []);

  const dontShowAgain = useCallback(() => {
    lsSet(OPTOUT_KEY, '1');
    stop(true);
  }, [stop]);

  return (
    <Ctx.Provider value={{ def, index, isActive, hasTourForPath: !!def, seenCurrent, start, stop, next, prev, goTo, dontShowAgain }}>
      {children}
    </Ctx.Provider>
  );
};
