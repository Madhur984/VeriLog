import { motion } from 'framer-motion';
import { BinaryRain } from '../../components/BinaryRain';

export const HeroSection = () => {
  return (
    <section
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden py-20"
      style={{
        background: '#07080A',
      }}
    >
      {/* Layer 1: Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 900px 600px at 50% 40%, rgba(34,211,238,0.05) 0%, transparent 65%)',
          zIndex: 1,
        }}
      />

      {/* Layer 2: PCB Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.06) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          zIndex: 2,
        }}
      />

      {/* Layer 3: Binary Rain */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        <BinaryRain />
      </div>

      {/* Hero Content (above the background layers) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: '#22D3EE' }}
          />
          <span
            className="text-[11px] font-mono tracking-[0.18em]"
            style={{ color: '#475569' }}
          >
            FREE · INTERACTIVE · INDIA-FIRST
          </span>
        </motion.div>

        {/* Logo Wordmark (Hero Version) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <div
            className="font-bold tracking-tight leading-none font-sans select-none"
            style={{ fontSize: 'clamp(56px, 9vw, 96px)' }}
          >
            <span style={{ color: '#F1F5F9' }}>Bit</span>
            <span style={{ color: '#475569', fontWeight: 400 }}>for</span>
            <span style={{ color: '#22D3EE' }}>Bytes</span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h1
            className="font-bold text-center leading-tight font-sans"
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: '#F1F5F9',
              letterSpacing: '-0.025em',
            }}
          >
            Learn VLSI and digital design.
            <br />
            <span style={{ color: '#22D3EE' }}>One bit at a time.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-10 max-w-lg mx-auto"
          style={{
            fontSize: '16px',
            color: '#94A3B8',
            lineHeight: 1.7,
            fontFamily: 'IBM Plex Mono',
          }}
        >
          Signals become logic. Logic becomes systems.
          <br />
          Free for every ECE student in India. No lab required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Primary CTA */}
          <a
            href="/dsd/1"
            className="group flex items-center gap-3 px-8 py-4 rounded-full font-mono font-semibold text-sm transition-all duration-200 relative overflow-hidden"
            style={{
              background: '#22D3EE',
              color: '#07080A',
              boxShadow: '0 0 0 0 rgba(34,211,238,0)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(34,211,238,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(34,211,238,0)';
            }}
          >
            {/* Shimmer effect on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
              }}
            />
            <span>▶ START FIRST MODULE</span>
            <span className="text-xs opacity-70">FREE</span>
          </a>

          {/* Secondary CTA */}
          <a
            href="/career-roadmap"
            className="flex items-center gap-2 px-7 py-4 rounded-full font-mono text-sm transition-all duration-200"
            style={{
              border: '1px solid rgba(148,163,184,0.15)',
              color: '#94A3B8',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(34,211,238,0.25)';
              e.currentTarget.style.color = '#F1F5F9';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            EXPLORE CAREER PATHS →
          </a>
        </motion.div>

        {/* Hero Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { label: '13 ECE Domains', icon: '⬡' },
            { label: 'Free Forever', icon: '○' },
            { label: 'No Lab Needed', icon: '◈' },
            { label: 'India-First', icon: '◆' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: 'rgba(148,163,184,0.05)',
                border: '1px solid rgba(148,163,184,0.08)',
              }}
            >
              <span style={{ color: '#22D3EE', fontSize: '10px' }}>
                {stat.icon}
              </span>
              <span
                className="text-[11px] font-mono"
                style={{ color: '#94A3B8' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" style={{ zIndex: 10 }}>
        <div
          style={{
            height: '60px',
            width: '1px',
            background: 'linear-gradient(to bottom, #22D3EE, transparent)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '1px',
              height: '8px',
              background: '#fff',
              boxShadow: '0 0 8px #22D3EE',
              animation: 'scroll-dot 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scroll-dot {
            0% { transform: translateY(0); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(60px); opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
};
