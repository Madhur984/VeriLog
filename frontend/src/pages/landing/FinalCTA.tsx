import React from 'react';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';

export const FinalCTATerminal: React.FC = () => {
  return (
    <div className="w-full bg-[#060813] pt-24 pb-12 px-4 md:px-8 border-t border-slate-900/60 relative" aria-label="Closing conversion workspace">
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Core Stat Callouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12 text-center">
          {[
            { v: '13', l: 'ECE Domains Map' },
            { v: '₹0', l: 'Free for Students' },
            { v: '85K', l: 'Engineers Needed' },
            { v: '$1T', l: 'Market Size by 2030' }
          ].map((item, idx) => (
            <div key={idx} className="border-r last:border-none border-slate-900/60 py-2">
              <div className="text-xl md:text-2xl font-mono font-bold text-[#22D3EE]">{item.v}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{item.l}</div>
            </div>
          ))}
        </div>

        {/* Fluid Responsive Typography Header */}
        <h2 
          className="font-bold text-slate-100 tracking-tight leading-none uppercase"
          style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
        >
          Modern hardware design <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#10B981]">
            requires intuitive tools.
          </span>
        </h2>

        <p className="text-slate-400 text-sm md:text-base max-w-[65ch] mx-auto leading-relaxed">
          Join thousands of engineering students and developers who use our application workspace. BitforBytes guides you through every layer of the processor stack with free, browser-based environments.
        </p>

        {/* Conversion CTA Group - Matte boundary button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to={LANDING_ROUTES.firstModule}
            aria-label="Start learning digital design modules for free"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-mono text-xs font-bold text-[#060813] bg-[#22D3EE] hover:bg-[#5ce1e6] transition-all duration-200 text-center"
          >
            Start Learning
          </Link>
          <a
            href={LANDING_ROUTES.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our Discord community workspace"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg font-mono text-xs border border-slate-800 text-slate-300 bg-slate-900/40 hover:bg-slate-850 transition-all duration-200 text-center"
          >
            Join Discord Community
          </a>
        </div>

        <div className="text-[10px] font-mono text-slate-600 tracking-widest uppercase pt-2">
          No Account Required &bull; No CC Needed &bull; Installs: 0
        </div>
      </div>

      {/* Simple, low-contrast 3-column metadata footer */}
      <footer className="max-w-6xl mx-auto border-t border-slate-900/60 mt-24 pt-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono">
        
        <div className="md:col-span-6 space-y-4">
          <div className="text-sm font-bold text-slate-200">Bit<span className="text-[#22D3EE]">for</span>Bytes</div>
          <p className="text-slate-500 text-xs leading-relaxed font-sans max-w-xs">
            Signals become logic. Logic becomes systems. Free, open-access digital design and VLSI education.
          </p>
          <div className="text-[10px] text-slate-600">&copy; 2026 BitforBytes. All rights reserved. Aligned to ISM 2.0.</div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <div className="text-slate-400 font-bold tracking-wider uppercase text-[10px] text-[#22D3EE]">// Navigation</div>
          <ul className="space-y-2 text-slate-500">
            <li><a href="#curriculum-section" className="hover:text-[#22D3EE]">&gt;_ Curriculum</a></li>
            <li><a href="#documentation-section" className="hover:text-[#22D3EE]">&gt;_ Documentation</a></li>
            <li><Link to={LANDING_ROUTES.career} className="hover:text-[#22D3EE]">&gt;_ University Access</Link></li>
            <li><Link to={LANDING_ROUTES.about} className="hover:text-[#22D3EE]">&gt;_ About Us</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <div className="text-slate-400 font-bold tracking-wider uppercase text-[10px] text-[#10B981]">// Platform</div>
          <ul className="space-y-2 text-slate-500 font-sans">
            <li>
              <a href={LANDING_ROUTES.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#10B981] font-mono">
                &gt;_ GitHub Source
              </a>
            </li>
            <li><span className="text-slate-600 font-mono">&gt;_ Terms of Service</span></li>
            <li><span className="text-slate-600 font-mono">&gt;_ Privacy Policy</span></li>
            <li>
              <a href={LANDING_ROUTES.social.email} className="hover:text-[#10B981] font-mono">
                &gt;_ Contact Email
              </a>
            </li>
          </ul>
        </div>

      </footer>
    </div>
  );
};
