import { motion } from 'framer-motion';

/**
 * The landing page's single signature motif: a seamless, slowly-scrolling
 * digital clock waveform ("one bit at a time"). Lightweight — one looping
 * transform, no per-frame JS. Themeable so it works on both light and dark bands.
 */
export const SignalWave = ({
  color = '#06B6D4',
  className = '',
  opacity = 1,
  duration = 6,
  strokeWidth = 2,
}: {
  color?: string;
  className?: string;
  opacity?: number;
  duration?: number;
  strokeWidth?: number;
}) => {
  // One 200-unit clock-wave tile; we render two side by side and scroll by 200
  // for a seamless loop.
  const tile = 'M0 28 H16 V8 H36 V28 H56 V8 H76 V28 H96 V8 H116 V28 H136 V8 H156 V28 H176 V8 H196 V28 H200';

  return (
    <div className={`overflow-hidden ${className}`} style={{ opacity }} aria-hidden>
      <svg
        viewBox="0 0 200 36"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <motion.g
          animate={{ x: [0, -200] }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
        >
          <path d={tile} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={tile} transform="translate(200,0)" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </motion.g>
      </svg>
    </div>
  );
};
