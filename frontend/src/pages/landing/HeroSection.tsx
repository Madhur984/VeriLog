import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';
import { SignalWave } from './SignalWave';

const STATS = ['13 ECE domains', 'Free forever', 'No lab required', 'India-first'];

export const HeroSection = () => {
  return (
    <section className="relative w-full flex flex-col items-center overflow-hidden" style={{ background: '#F4F6FA' }}>
      {/* Soft cyan glow + dot grid (subtle, light) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 800px 480px at 50% 8%, rgba(6,182,212,0.10) 0%, transparent 60%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)',
          backgroundSize: '30px 30px',
          maskImage: 'linear-gradient(to bottom, black, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 80%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-36 pb-20 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 mb-7 px-4 py-1.5 rounded-full bg-white shadow-sm"
          style={{ border: '1px solid rgba(15,23,42,0.08)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06B6D4]" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: '#0891B2' }}>
            Free · Interactive · India-first
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-extrabold leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(40px, 7vw, 76px)', color: '#0B1220', letterSpacing: '-0.03em' }}
        >
          Learn VLSI &amp; digital design.
          <br />
          <span style={{ color: '#0891B2' }}>One bit at a time.</span>
        </motion.h1>

        {/* Subhead — PDF-aligned */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-xl text-base md:text-lg leading-relaxed"
          style={{ color: '#475569' }}
        >
          From confused ECE student to industry-ready silicon designer. Signals become
          logic, logic becomes systems — all in your browser. No lab, no install, free for
          every student in India.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to={LANDING_ROUTES.firstModule}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200"
            style={{ background: '#0B1220', boxShadow: '0 10px 30px rgba(11,18,32,0.18)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0891B2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#0B1220'; }}
          >
            <span>▶ Start your first module</span>
            <span className="text-xs font-semibold opacity-70 px-1.5 py-0.5 rounded-md bg-white/15">FREE</span>
          </Link>
          <Link
            to={LANDING_ROUTES.career}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-white"
            style={{ border: '1px solid rgba(15,23,42,0.12)', color: '#0B1220' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(8,145,178,0.5)'; e.currentTarget.style.color = '#0891B2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'; e.currentTarget.style.color = '#0B1220'; }}
          >
            Explore career paths →
          </Link>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {STATS.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[12px] font-medium"
              style={{ border: '1px solid rgba(15,23,42,0.08)', color: '#475569' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#06B6D4' }} />
              {s}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Signature motif: scrolling clock waveform */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 -mt-2">
        <SignalWave color="#06B6D4" opacity={0.5} className="h-12 w-full" duration={7} strokeWidth={2} />
      </div>
    </section>
  );
};
