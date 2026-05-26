import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogoWordmark } from '../../components/LogoWordmark';

export const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,8,10,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(148,163,184,0.06)'
          : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <LogoWordmark size="sm" />

      {/* Center nav links (desktop only) */}
      <div className="hidden md:flex items-center gap-6">
        {['Learn', 'Career', 'About'].map(label => (
          <a
            key={label}
            href={
              label === 'Career'
                ? '/career-roadmap'
                : label === 'About'
                ? '/career-roadmap?tab=about'
                : '/portal'
            }
            className="text-sm transition-colors duration-150"
            style={{ color: '#475569', fontFamily: 'IBM Plex Mono' }}
            onMouseEnter={e =>
              (e.currentTarget.style.color = '#F1F5F9')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.color = '#475569')
            }
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <a
          href="/career-roadmap"
          className="hidden md:block text-sm font-mono px-4 py-1.5 rounded-full transition-all duration-150"
          style={{
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#94A3B8',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.30)';
            e.currentTarget.style.color = '#F1F5F9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          SIGN IN
        </a>
        <a
          href="/portal"
          className="text-sm font-mono font-semibold px-5 py-1.5 rounded-full transition-all duration-200"
          style={{
            background: '#22D3EE',
            color: '#07080A',
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = '#38BDF8')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.background = '#22D3EE')
          }
        >
          START FREE →
        </a>
      </div>
    </motion.nav>
  );
};
