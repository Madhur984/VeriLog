import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LANDING_ROUTES } from './landingRoutes';

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Learn', to: LANDING_ROUTES.firstModule },
  { label: 'Career', to: LANDING_ROUTES.career },
  { label: 'About', to: LANDING_ROUTES.about },
];

/** BitforBytes wordmark tuned for a light background. */
const Wordmark = () => (
  <span className="font-extrabold tracking-tight text-[19px] select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
    <span style={{ color: '#0B1220' }}>Bit</span>
    <span style={{ color: '#94A3B8', fontWeight: 600 }}>for</span>
    <span style={{ color: '#0891B2' }}>Bytes</span>
  </span>
);

export const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || menuOpen ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(14px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(15,23,42,0.08)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8 h-16">
        <Link to="/" aria-label="BitforBytes - home" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="group relative px-3 py-1.5 text-sm font-medium transition-colors duration-150"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0B1220')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              {label}
              <span className="pointer-events-none absolute bottom-0 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full bg-[#0891B2] transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            to={LANDING_ROUTES.login}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-150"
            style={{ color: '#334155' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15,23,42,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Sign in
          </Link>
          <Link
            to={LANDING_ROUTES.firstModule}
            className="text-sm font-bold px-5 py-2 rounded-xl text-white transition-all duration-200"
            style={{ background: '#0B1220' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#0891B2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#0B1220')}
          >
            Start free →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-[#0B1220]"
          style={{ border: '1px solid rgba(15,23,42,0.12)' }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'rgba(15,23,42,0.08)' }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} className="py-2.5 text-sm font-semibold text-[#334155] hover:text-[#0B1220]">
                  {label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2.5">
                <Link to={LANDING_ROUTES.login} className="text-center text-sm font-semibold px-4 py-2.5 rounded-xl" style={{ border: '1px solid rgba(15,23,42,0.12)', color: '#334155' }}>
                  Sign in
                </Link>
                <Link to={LANDING_ROUTES.firstModule} className="text-center text-sm font-bold px-5 py-2.5 rounded-xl text-white" style={{ background: '#0B1220' }}>
                  Start free →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
