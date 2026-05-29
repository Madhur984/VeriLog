import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';

export const LandingFooter = () => {
  return (
    <footer className="w-full" style={{ background: '#070B14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-3">
            <span className="font-extrabold tracking-tight text-lg">
              <span style={{ color: '#F8FAFC' }}>Bit</span>
              <span style={{ color: '#64748B' }}>for</span>
              <span style={{ color: '#22D3EE' }}>Bytes</span>
            </span>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#64748B' }}>
              Signals become logic. Logic becomes systems. Free, browser-based VLSI &amp; digital
              design for every ECE student in India.
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Navigation</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                { label: 'Start learning', to: LANDING_ROUTES.firstModule },
                { label: 'Explore career paths', to: LANDING_ROUTES.career },
                { label: 'About BitforBytes', to: LANDING_ROUTES.about },
                { label: 'Meet the team', to: LANDING_ROUTES.about },
              ].map((l) => (
                <Link key={l.label} to={l.to} className="transition-colors hover:text-white" style={{ color: '#94A3B8' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Platform</h4>
            <div className="space-y-1.5 text-sm" style={{ color: '#94A3B8' }}>
              <p>Built by ECE students in India.</p>
              <p>Aligned to India Semiconductor Mission 2.0.</p>
              <p>Modules live, more building.</p>
              <a
                href={LANDING_ROUTES.github}
                target="_blank"
                rel="noreferrer"
                className="inline-block pt-1 text-[13px] font-bold transition-colors hover:text-white"
                style={{ color: '#22D3EE' }}
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#64748B' }}>
          <span>© 2026 BitforBytes. Free for students.</span>
          <span>Made with intent, not investment.</span>
        </div>
      </div>
    </footer>
  );
};
