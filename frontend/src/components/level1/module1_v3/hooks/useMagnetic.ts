import { useMotionValue, useSpring } from 'framer-motion';
import { useCallback } from 'react';

const SPRING = { stiffness: 120, damping: 20, mass: 0.5 };

export function useMagnetic(strength = 0.08) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const update = useCallback(
    (mouseX: number, mouseY: number, centerX: number, centerY: number) => {
      rawX.set((mouseX - centerX) * strength);
      rawY.set((mouseY - centerY) * strength);
    },
    [rawX, rawY, strength],
  );

  const reset = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { x, y, update, reset };
}
