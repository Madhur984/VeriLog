import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ProductMockup } from './ProductMockup';

/**
 * Wraps the product mockup in a subtle pointer-parallax
 * (rotateX/Y + translate via springs). Desktop fine-pointer only; respects
 * prefers-reduced-motion. Decorative only - not an interactive widget.
 */
export const ParallaxMockupContainer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const spring = { damping: 22, mass: 0.6, stiffness: 140 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);

  const rotateX = useTransform(sy, [-1, 1], [3, -3]);
  const rotateY = useTransform(sx, [-1, 1], [-3, 3]);
  const tx = useTransform(sx, [-1, 1], [-7, 7]);
  const ty = useTransform(sy, [-1, 1], [-7, 7]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2))));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <div ref={ref} className="hidden lg:block relative" style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, rotateY, x: tx, y: ty, transformStyle: 'preserve-3d' }}>
        <div className="relative">
          <ProductMockup />
        </div>
      </motion.div>
    </div>
  );
};
