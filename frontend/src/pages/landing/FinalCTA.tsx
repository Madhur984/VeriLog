import { motion } from 'framer-motion';

export const FinalCTA = () => {
  return (
    <section
      className="relative min-h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden py-24 select-none"
      style={{
        background: '#07080A',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 500px at 50% 50%, rgba(34,211,238,0.06) 0%, rgba(34,211,238,0.02) 40%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 flex flex-col items-center text-center space-y-8">
        {/* Headline */}
        <h2
          className="font-extrabold uppercase leading-tight font-sans text-white"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.03em' }}
        >
          Your degree can take you
          <br />
          <span style={{ color: '#22D3EE' }}>to the chips inside every device.</span>
        </h2>

        {/* Subtext */}
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl font-sans">
          It starts with understanding one bit. Then a byte. Then a gate. Then a system.
          BitforBytes walks you through every step. Free. Interactive. Starting now.
        </p>

        {/* Primary CTA Button (large, scaling hover effect) */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <motion.a
            href="/dsd/1"
            className="group flex items-center justify-center gap-3 px-10 py-5 rounded-full font-mono font-bold text-sm tracking-wide transition-all duration-200 relative overflow-hidden"
            style={{
              background: '#22D3EE',
              color: '#07080A',
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(34,211,238,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer effect on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
              }}
            />
            <span>▶ START YOUR FIRST MODULE — FREE</span>
          </motion.a>

          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#475569' }}>
            No account needed · No credit card · No download
          </span>
        </div>

        {/* Secondary Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-8 text-xs font-mono" style={{ color: '#475569' }}>
          <a href="/career-roadmap" className="hover:text-[#22D3EE] transition-colors">
            EXPLORE CAREER PATHS
          </a>
          <span>|</span>
          <a href="/career-roadmap?tab=about" className="hover:text-[#22D3EE] transition-colors">
            READ OUR STORY
          </a>
          <span>|</span>
          <a href="/career-roadmap?tab=about" className="hover:text-[#22D3EE] transition-colors">
            MEET THE TEAM
          </a>
        </div>
      </div>
    </section>
  );
};
