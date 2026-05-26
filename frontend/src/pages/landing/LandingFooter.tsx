import { LogoWordmark } from '../../components/LogoWordmark';

export const LandingFooter = () => {
  return (
    <footer
      className="py-12 border-t select-none w-full"
      style={{
        background: '#07080A',
        borderColor: 'rgba(148,163,184,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Top 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          {/* Left Column (Logo + Tagline) */}
          <div className="md:col-span-5 space-y-4">
            <LogoWordmark size="sm" />
            <p className="text-xs font-mono leading-relaxed" style={{ color: '#475569' }}>
              Signals become logic.
              <br />
              Logic becomes systems.
            </p>
          </div>

          {/* Center Column (Navigation links) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#475569' }}>
              NAVIGATION
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-sans text-slate-400">
              <a href="/dsd/1" className="hover:text-white transition-colors">
                Learn Digital Design
              </a>
              <a href="/career-roadmap" className="hover:text-white transition-colors">
                Explore Career Paths
              </a>
              <a href="/career-roadmap?tab=about" className="hover:text-white transition-colors">
                About BitforBytes
              </a>
              <a href="/career-roadmap?tab=about" className="hover:text-white transition-colors">
                Meet the Team
              </a>
            </div>
          </div>

          {/* Right Column (Platform Info) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#475569' }}>
              PLATFORM STATE
            </h4>
            <div className="space-y-2 text-xs font-mono" style={{ color: '#94A3B8' }}>
              <p>Built by ECE students in India.</p>
              <p>Version: v5.0</p>
              <p>Modules: 1 live, more building</p>
              <div className="pt-2">
                <a
                  href="https://github.com/kriten370/VeriLog_k1"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-block text-[11px] font-bold"
                  style={{ color: '#22D3EE' }}
                >
                  VIEW ON GITHUB →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-wider"
          style={{
            borderColor: 'rgba(148,163,184,0.06)',
            color: '#475569',
          }}
        >
          <span>© 2026 BitforBytes. Free for students.</span>
          <span>Made with intent, not investment.</span>
        </div>
      </div>
    </footer>
  );
};
