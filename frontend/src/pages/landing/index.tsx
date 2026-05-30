import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';
import { LandingVisuals } from './LandingVisuals';
import { ParallaxMockupContainer } from './ParallaxMockupContainer';
import { ProductMockup } from './ProductMockup';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';
import { WhatIsSection } from './WhatIsSection';
import { ThreePaths } from './ThreePaths';
import { HowItWorks } from './HowItWorks';
import { ForWhoSection } from './ForWhoSection';
import { StatsSection } from './StatsSection';
import { FinalCTA } from './FinalCTA';
import { LandingFooter } from './LandingFooter';

/**
 * Single-screen, non-scrolling, product-forward landing.
 * Deep gradient backdrop · bold type + CTAs (left) · glossy static product
 * mockup (right). No interactive widgets, no background video.
 */
const NAV = [
  { label: 'Learn', to: LANDING_ROUTES.firstModule },
  { label: 'Career', to: LANDING_ROUTES.career },
  { label: 'About', to: LANDING_ROUTES.about },
];

const CHIPS = ['13 ECE domains', 'No lab required', 'Free · India-first'];
const ease = [0.16, 1, 0.3, 1] as const;

const LandingPage = () => {
  const authed = useIsAuthenticated();
  // Once a session exists, the primary action becomes "continue to the hub".
  const primaryTo = authed ? LANDING_ROUTES.workstation : LANDING_ROUTES.firstModule;
  const primaryLabel = authed ? '▶ Continue to your Workstation' : '▶ Start your first module - free';

  return (
    <div className="relative w-full overflow-x-hidden text-white" style={{ background: '#05070E', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero viewport — fills 100svh so the above-the-fold is always complete */}
      <div className="relative min-h-[100svh] flex flex-col">
      <LandingVisuals />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 h-16 shrink-0">
        <Link to="/" aria-label="BitforBytes - home" className="font-extrabold tracking-tight text-lg select-none">
          <span style={{ color: '#F8FAFC' }}>Bit</span>
          <span style={{ color: '#64748B' }}>for</span>
          <span style={{ color: '#22D3EE' }}>Bytes</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ label, to }) => (
            <Link key={label} to={to} className="px-3 py-1.5 text-sm font-medium transition-colors" style={{ color: '#94A3B8' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F8FAFC')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          {authed ? (
            <Link to={LANDING_ROUTES.workstation} className="text-sm font-bold px-5 py-2 rounded-xl transition-all" style={{ background: '#22D3EE', color: '#06121A' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#38BDF8')} onMouseLeave={(e) => (e.currentTarget.style.background = '#22D3EE')}>
              Go to Workstation →
            </Link>
          ) : (
            <>
              <Link to={LANDING_ROUTES.login} className="hidden sm:inline text-sm font-semibold px-4 py-2 rounded-xl transition-colors" style={{ color: '#CBD5E1' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}>
                Sign in
              </Link>
              <Link to={LANDING_ROUTES.firstModule} className="text-sm font-bold px-5 py-2 rounded-xl transition-all" style={{ background: '#22D3EE', color: '#06121A' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#38BDF8')} onMouseLeave={(e) => (e.currentTarget.style.background = '#22D3EE')}>
                Start free →
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Stage */}
      <main className="relative z-10 flex-1 flex items-center py-12 lg:py-0">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* Left: copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 mb-6 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.22)' }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22D3EE]" />
              </span>
              <motion.span
                className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: '#7DD3FC' }}
                animate={{ textShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 12px rgba(34,211,238,0.5)', '0 0 0 rgba(34,211,238,0)'] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              >
                GenZ-native · ECE-first · Free
              </motion.span>
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease }}
              className="font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(30px, 8vw, 66px)', letterSpacing: '-0.03em' }}>
              <span style={{ color: '#FFFFFF' }}>Bits become logic.</span>
              <br />
              <motion.span
                style={{
                  backgroundImage: 'linear-gradient(110deg, #22D3EE 0%, #22D3EE 36%, #CFFAFE 50%, #22D3EE 64%, #22D3EE 100%)',
                  backgroundSize: '220% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 36px rgba(34,211,238,0.4))',
                }}
                animate={{ backgroundPosition: ['150% 0', '-50% 0'] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
              >
                Logic becomes silicon.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-6 max-w-lg text-base md:text-lg font-medium leading-relaxed" style={{ color: '#A9B6C9' }}>
              Go from confused ECE student to industry-ready{' '}
              <span style={{ color: '#7DD3FC', fontWeight: 700 }}>chip designer</span>. Learn VLSI &amp;
              digital design the interactive way - right in your browser. No lab, no installs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              {/* Primary CTA with glow pulse + shine sweep */}
              <div className="relative inline-flex">
                <motion.span aria-hidden className="absolute inset-0 rounded-xl blur-lg pointer-events-none" style={{ background: '#22D3EE' }}
                  animate={{ opacity: [0.28, 0.5, 0.28] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                <Link to={primaryTo}
                  className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-transform overflow-hidden"
                  style={{ background: '#22D3EE', color: '#06121A', boxShadow: '0 14px 40px rgba(34,211,238,0.28)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <motion.span aria-hidden className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)', backgroundSize: '250% 100%' }}
                    animate={{ backgroundPosition: ['180% 0', '-80% 0'] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }} />
                  <span className="relative">{primaryLabel}</span>
                </Link>
              </div>
              <Link to={LANDING_ROUTES.career}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ border: '1px solid rgba(148,163,184,0.25)', color: '#E2E8F0' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)'; e.currentTarget.style.color = '#22D3EE'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.25)'; e.currentTarget.style.color = '#E2E8F0'; }}>
                Explore career paths{' '}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.56 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {CHIPS.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                  style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.12)', color: '#94A3B8' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#22D3EE' }} />
                  {c}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: product mockup - parallax cluster on desktop, clean static on mobile */}
          <div className="w-full">
            <ParallaxMockupContainer />
            <div className="lg:hidden mx-auto w-full max-w-sm">
              <ProductMockup />
            </div>
          </div>
        </div>
      </main>
      </div>{/* end hero viewport */}

      {/* Scrolling narrative sections */}
      <WhatIsSection />
      <ThreePaths />
      <HowItWorks />
      <ForWhoSection />
      <StatsSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
