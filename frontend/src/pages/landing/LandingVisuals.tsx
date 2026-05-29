import { motion } from 'framer-motion';

/**
 * Premium ambient backdrop for the product-forward landing.
 * Deep gradient + faint PCB grid + a slow rotating "spotlight" behind the
 * mockup zone + a dual cyan/violet breathing aurora + a floor-reflection
 * anchor + film grain. All transform/opacity (GPU-friendly), no interactivity.
 */
export const LandingVisuals = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Deep base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 120% 90% at 80% 0%, #0E1730 0%, #080C18 45%, #05070E 100%)' }}
      />

      {/* Faint PCB grid, fading toward bottom-left */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 75% 25%, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 75% 25%, black 10%, transparent 70%)',
        }}
      />

      {/* Slow rotating spotlight behind the mockup zone (theater light) */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'conic-gradient(from 0deg at 80% 32%, rgba(34,211,238,0.12) 0deg, rgba(139,92,246,0.08) 110deg, transparent 230deg, transparent 360deg)',
          filter: 'blur(60px)',
          maskImage: 'radial-gradient(circle at 80% 32%, black 18%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle at 80% 32%, black 18%, transparent 72%)',
        }}
      />

      {/* Dual breathing aurora - cyan + violet, out of phase */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle 680px at 76% 26%, rgba(34,211,238,0.14) 0%, transparent 60%)' }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle 600px at 70% 20%, rgba(139,92,246,0.10) 0%, transparent 65%)' }}
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* Floor reflection - anchors the mockup in space */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 820px 300px at 62% 96%, rgba(34,211,238,0.07) 0%, transparent 60%)',
          maskImage: 'radial-gradient(ellipse 100% 42% at 50% 100%, black 0%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 42% at 50% 100%, black 0%, transparent 72%)',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};
