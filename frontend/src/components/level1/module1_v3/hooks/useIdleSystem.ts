import { useState, useEffect, useRef, useCallback } from 'react';

export type IdleLevel = 0 | 1 | 2 | 3;
// 0=active | 1=3s | 2=6s | 3=10s

export function useIdleSystem(): { level: IdleLevel; resetIdle: () => void } {
  const [level, setLevel] = useState<IdleLevel>(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resetIdle = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setLevel(0);
    timers.current = [
      setTimeout(() => setLevel(1), 3000),
      setTimeout(() => setLevel(2), 6000),
      setTimeout(() => setLevel(3), 10000),
    ];
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      timers.current.forEach(clearTimeout);
    };
  }, [resetIdle]);

  return { level, resetIdle };
}
