import { motion, useReducedMotion } from 'framer-motion';
import { useColorScheme } from '../../hooks/useColorScheme';

/**
 * "Try it yourself" — a hand-placed sticker that marks an interactive spot in a
 * lesson. Drop it on (or next to) anything the learner can poke: a live demo, a
 * toggle, a build canvas. It reads as a physical sticky note — warm amber, a 2px
 * ink border, a hard offset shadow and a slight tilt — so it pops off the page
 * without fighting the module's own colours.
 *
 * Usage:
 *   // absolute corner sticker on a relatively-positioned interactive card
 *   <TryItYourself corner />
 *   // inline, above an interactive block
 *   <TryItYourself label="Flip the switches" />
 */

type Props = {
  /** Sticker text. Default: "Try it yourself". */
  label?: string;
  /** Absolutely position it on the top-right corner of a `relative` parent. */
  corner?: boolean;
  /** Tilt direction; slight hand-placed rotation. Default alternates by nothing → left. */
  tilt?: 'left' | 'right';
  className?: string;
};

export function TryItYourself({ label = 'Try it yourself', corner = false, tilt = 'left', className = '' }: Props) {
  const [scheme] = useColorScheme();
  const isDark = scheme === 'dark';
  const reduce = useReducedMotion();

  const rot = tilt === 'left' ? -3 : 3;

  // Warm sticky-note palette, legible in both themes.
  const bg = isDark ? '#3A2E0B' : '#FDE9A7';
  const ink = isDark ? '#FCD34D' : '#5A4300';
  const edge = isDark ? '#7A5C10' : '#1B1436';
  const shadow = isDark ? '3px 3px 0 0 rgba(0,0,0,0.55)' : '3px 3px 0 0 #1B1436';

  return (
    <motion.span
      initial={reduce ? false : { rotate: rot, scale: 0.9, opacity: 0 }}
      whileInView={reduce ? undefined : { rotate: rot, scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      animate={reduce ? undefined : { rotate: [rot, rot - 1.5, rot, rot + 1.5, rot] }}
      transition={
        reduce
          ? undefined
          : { rotate: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 0.3 } }
      }
      whileHover={reduce ? undefined : { scale: 1.06, rotate: 0 }}
      className={[
        'pointer-events-auto z-20 inline-flex select-none items-center gap-1.5 rounded-[4px] border-2 px-2.5 py-1',
        'font-mono text-[11px] font-bold uppercase tracking-[0.12em]',
        corner ? 'absolute -right-2 -top-3' : '',
        className,
      ].join(' ')}
      style={{ background: bg, color: ink, borderColor: edge, boxShadow: shadow }}
      aria-hidden
    >
      {/* pointing hand */}
      <motion.span
        aria-hidden
        animate={reduce ? undefined : { x: [0, 2, 0] }}
        transition={reduce ? undefined : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        className="text-[13px] leading-none"
      >
        👉
      </motion.span>
      {label}
    </motion.span>
  );
}

export default TryItYourself;
