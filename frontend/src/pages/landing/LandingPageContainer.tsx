import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Terminal,
  Clock,
  CheckCircle2,
  HelpCircle,
  Zap,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';
import { BrandWordmark } from '../../components/Brand';
import { PremiumBentoFeatures } from './PremiumBentoFeatures';
import { SiliconPlaypenGrid } from './SiliconPlaypenGrid';
import { SignalShowcase } from './SignalShowcase';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useColorScheme } from '../../hooks/useColorScheme';

/**
 * ENHANCEMENT 2: Scroll-Triggered Section Entrance Animation
 * Wraps any section with a subtle translateY + opacity entrance
 * that fires once when the element enters the viewport.
 */
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className, id }) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
};

// Core Type Specifications
type BentoTabType = 'GATES' | 'WAVEFORMS' | 'TELEMETRY';
type ProfileTabType = 'ACADEMIC' | 'SYSTEMS' | 'PROFESSIONAL';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  { q: "What is the entry barrier for these modules?", a: "Zero. The entire runtime layer executes inside an in-browser web assembly container. No local EDA licensing or tool installation is required." },
  { q: "Does the platform support hardware description execution?", a: "Yes. You author industry-standard Verilog syntax directly inside our workspace IDE, which synthesizes concurrently into gate-level primitives." },
  { q: "Are the physical layer metrics production-grade?", a: "The geometry engine enforces realistic layout constraints modeled directly after modern fabrication rules, including setup/hold timing margin boundaries." },
  { q: "Can I track my logic verification history?", a: "Every testbench run updates automated timing coverage maps, logs propagation slack metrics, and archives passing vectors inside your local workspace status profile." }
];

export default function LandingPageContainer() {
  // Authentication check
  const authed = useIsAuthenticated();
  const primaryTo = authed ? LANDING_ROUTES.workstation : LANDING_ROUTES.firstModule;
  const primaryLabel = authed ? 'Go to Workstation' : 'Start Learning';

  // Application Interface States (with LocalStorage Persistence)
  const [heroTab, setHeroTab] = useState<'CODE' | 'WAVE'>(() => {
    const saved = localStorage.getItem('bitforbytes_hero_tab');
    return (saved === 'CODE' || saved === 'WAVE') ? saved : 'CODE';
  });
  const [profileTab, setProfileTab] = useState<ProfileTabType>(() => {
    const saved = localStorage.getItem('bitforbytes_profile_tab');
    return (saved === 'ACADEMIC' || saved === 'SYSTEMS' || saved === 'PROFESSIONAL') ? saved as ProfileTabType : 'ACADEMIC';
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(() => {
    const saved = localStorage.getItem('bitforbytes_active_faq');
    if (saved === null) return 0;
    if (saved === 'null') return null;
    const parsed = parseInt(saved, 10);
    return isNaN(parsed) ? 0 : parsed;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive Hardware State Toggles
  const [pinState, setPinState] = useState<{ A: boolean; B: boolean }>(() => {
    const saved = localStorage.getItem('bitforbytes_pin_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.A === 'boolean' && typeof parsed.B === 'boolean') {
          return parsed;
        }
      } catch (e) {}
    }
    return { A: true, B: false };
  });
  const outNand = !(pinState.A && pinState.B);

  // Sync state values to LocalStorage
  useEffect(() => {
    localStorage.setItem('bitforbytes_hero_tab', heroTab);
  }, [heroTab]);

  useEffect(() => {
    localStorage.setItem('bitforbytes_profile_tab', profileTab);
  }, [profileTab]);

  useEffect(() => {
    localStorage.setItem('bitforbytes_active_faq', String(activeFaq));
  }, [activeFaq]);

  useEffect(() => {
    localStorage.setItem('bitforbytes_pin_state', JSON.stringify(pinState));
  }, [pinState]);

  // Synchronized System Clock State
  const [londonTime, setLondonTime] = useState<string>('21:00');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLondonTime(now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // ENHANCEMENT 4: SEO Meta Infrastructure
  useEffect(() => {
    document.title = 'BitforBytes — Interactive VLSI & Digital Design Education';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Learn digital design, Verilog HDL, and VLSI physical layout through free, interactive browser-based simulation tools. From Boolean foundations to silicon timing.');
    return () => { document.title = 'BitforBytes'; };
  }, []);

  // ENHANCEMENT 5: Smooth Scroll Navigation Handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  // Premium Border Spotlight Mouse Tracker Hook
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Brilliant-style landing is light-only. Force the light scheme *synchronously*
  // (in render, before children mount) so child components that read the scheme
  // from localStorage on first render (SiliconPlaypenGrid, PremiumBentoFeatures)
  // also come up light — otherwise their isDarkMode ternaries paint white text on
  // the now-light background and it disappears. Restore the user's pref on leave.
  const isDarkMode = false;
  const prevThemeRef = useRef<string | null>(null);
  if (prevThemeRef.current === null) {
    try {
      prevThemeRef.current = localStorage.getItem('bitforbytes_theme') ?? 'dark';
      localStorage.setItem('bitforbytes_theme', 'light');
    } catch { prevThemeRef.current = 'dark'; }
  }
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    return () => {
      const prev = prevThemeRef.current || 'dark';
      try { localStorage.setItem('bitforbytes_theme', prev); } catch { /* ignore */ }
      if (prev === 'dark') { root.classList.add('dark'); root.classList.remove('light'); }
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#FAF9F6] dark:bg-[#03050a] text-slate-800 dark:text-slate-200 antialiased font-sans selection:bg-[#4A57FF]/20 selection:text-[#4A57FF]">
      
      {/* Floating analog CRT noise grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-grain" />

      {/* Embedded Global Stylesheet Utilities for Elite Layout Components */}
      <style>{`
        .liquid-glass {
          background: var(--bg-elev);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }
        .light .liquid-glass {
          background: #FFFFFF;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.2px;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 20%,
            rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
            rgba(255,255,255,0.08) 80%, rgba(255,255,255,0.3) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .micro-grid {
          background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .dark .micro-grid {
          background-image: linear-gradient(rgba(30, 41, 59, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.15) 1px, transparent 1px);
        }
        .bento-spotlight {
          position: relative;
        }
        .bento-spotlight::before {
          content: "";
          position: absolute;
          inset: -1px;
          background: radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(74, 87, 255, 0.14), transparent 80%);
          border-radius: inherit;
          z-index: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
          opacity: 0;
        }
        .bento-spotlight:hover::before {
          opacity: 1;
        }
        .bento-card-inner {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border-radius: calc(0.75rem - 1px);
          height: 100%;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .dark .bento-card-inner {
          background: #090e1a;
          border: none;
        }
        /* ENHANCEMENT 1: Tabular Numerics — Prevents layout jitter on dynamic data */
        .tabular-data {
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
        }
        /* ENHANCEMENT 5: Smooth scroll offset for fixed navbar */
        [id="curriculum"], [id="playground"], [id="diagnostics"] {
          scroll-margin-top: 80px;
        }
        /* ENHANCEMENT 8: Focus-visible ring for keyboard navigation */
        button:focus, a:focus, [role="button"]:focus {
          outline: none;
        }
        button:focus-visible, a:focus-visible, [role="button"]:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px #03050a, 0 0 0 3px #4A57FF !important;
          border-radius: inherit;
        }
      `}</style>

      {/* Background Micro-Grid Infrastructure */}
      <div className="absolute inset-0 micro-grid pointer-events-none z-0" />

      {/* STICKY TOP NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-bg-base border-b-2 border-edge px-6 py-4" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="active-press">
            <BrandWordmark size={26} textClassName="text-base text-slate-900 dark:text-white" />
          </Link>
          
          <div className="hidden md:flex items-center gap-7 text-[14px] font-semibold text-slate-600 dark:text-[#8E9AA8]">
            <a href="#curriculum" onClick={(e) => scrollToSection(e, 'curriculum')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Curriculum</a>
            <a href="#playground" onClick={(e) => scrollToSection(e, 'playground')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Playground</a>
            <a href="#diagnostics" onClick={(e) => scrollToSection(e, 'diagnostics')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Documentation</a>
            <Link to={LANDING_ROUTES.about} className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/login" className="hidden sm:inline-flex text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
            <Link to={primaryTo} className="hidden md:inline-flex items-center gap-1.5 bg-[#2E32FF] hover:bg-[#1E22E0] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-[0_8px_20px_-6px_rgba(46,50,255,0.5)] transition-all active-press">
              {primaryLabel} <ArrowRight size={14} />
            </Link>
            {/* ENHANCEMENT 3: Mobile Hamburger Menu Toggle */}
            <button
              className="md:hidden p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-[#8E9AA8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors active-press"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-900/60"
            >
              <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-[#8E9AA8]">
                <a href="#curriculum" onClick={(e) => scrollToSection(e, 'curriculum')} className="py-2 hover:text-slate-900 dark:hover:text-white transition-colors">Curriculum</a>
                <a href="#playground" onClick={(e) => scrollToSection(e, 'playground')} className="py-2 hover:text-slate-900 dark:hover:text-white transition-colors">Playground</a>
                <a href="#diagnostics" onClick={(e) => scrollToSection(e, 'diagnostics')} className="py-2 hover:text-slate-900 dark:hover:text-white transition-colors">Documentation</a>
                <Link to={LANDING_ROUTES.about} onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link>
                <Link to={primaryTo} onClick={() => setMobileMenuOpen(false)} className="mt-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-center active-press">
                  {primaryLabel}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-7 text-left">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E32FF]/[0.07] border border-[#2E32FF]/15 text-[12px] font-semibold tracking-wide text-[#2E32FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E32FF]" /> Learn by doing · Free forever
          </div>

          {/* Headline */}
          <h1 className="font-extrabold text-slate-900 tracking-tight leading-[1.05] text-[clamp(2.75rem,5.8vw,4.75rem)]">
            Bits become logic.<br />
            <span className="text-[#2E32FF]">Logic becomes silicon.</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-[46ch]">
            Interactive VLSI &amp; digital-logic courses you actually play with — from logic gates to silicon, right in your browser.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link to={primaryTo} className="group/cta inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-[16px] bg-[#2E32FF] hover:bg-[#1E22E0] text-white shadow-[0_16px_38px_-12px_rgba(46,50,255,0.7)] transition-all active-press">
              {primaryLabel}
              <ArrowRight size={18} className="transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
            <Link to={LANDING_ROUTES.career} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-[16px] bg-white border border-slate-300 text-slate-800 hover:border-slate-400 transition-all active-press">
              Explore career paths
            </Link>
          </div>

          {/* Social proof metrics */}
          <div className="flex items-center gap-8 pt-3">
            {[['13', 'ECE domains'], ['100%', 'Free forever'], ['0', 'Installs needed']].map(([n, l]) => (
              <div key={l}>
                <div className="text-[26px] font-extrabold text-slate-900 leading-none">{n}</div>
                <div className="text-[12px] text-slate-500 font-medium mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 w-full">
          <div className="w-full bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="bg-slate-50 dark:bg-[#03050a] px-4 py-3 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-850" /><span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-850" /><span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-850" /></div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                  <button onClick={() => setHeroTab('CODE')} className={`px-2 py-0.5 transition-colors active-press ${heroTab === 'CODE' ? 'text-[#4A57FF] border-b border-[#4A57FF]' : 'text-slate-550 dark:text-[#8E9AA8] hover:text-slate-800 dark:hover:text-slate-300'}`}>nand_gate.v</button>
                  <button onClick={() => setHeroTab('WAVE')} className={`px-2 py-0.5 transition-colors active-press ${heroTab === 'WAVE' ? 'text-[#4A57FF] border-b border-[#4A57FF]' : 'text-slate-550 dark:text-[#8E9AA8] hover:text-slate-800 dark:hover:text-slate-300'}`}>timing_diagram.out</button>
                </div>
              </div>
              <div className="font-mono text-[9px] text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/10 px-2 py-0.5 rounded uppercase tracking-wide">Simulation_Pass</div>
            </div>

            <div className="p-6 flex-1 bg-slate-50/10 dark:bg-[#090e1a]/40 flex flex-col justify-center">
              {heroTab === 'CODE' ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* ENHANCEMENT 7: Code Block with Line Numbers */}
                  <div className="md:col-span-7 bg-slate-50 dark:bg-[#03050a] p-4 rounded-lg border border-slate-255 dark:border-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-300 shadow-inner">
                    <div className="flex gap-4">
                      <div className="flex flex-col text-right text-slate-400 dark:text-slate-700 select-none border-r border-slate-200 dark:border-slate-900 pr-3 leading-[1.6]" aria-hidden="true">
                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                      </div>
                      <div className="space-y-0 leading-[1.6]">
                        <div><span className="text-blue-600 dark:text-[#6E7BFF]">module</span> nand_primitive (</div>
                        <div className="text-slate-550 dark:text-[#8E9AA8]">  input <span className="text-slate-800 dark:text-slate-400">a, b,</span></div>
                        <div className="text-slate-550 dark:text-[#8E9AA8]">  output <span className="text-slate-800 dark:text-slate-400">out</span></div>
                        <div>);</div>
                        <div className="text-slate-800 dark:text-slate-400">  <span className="text-blue-600 dark:text-[#6E7BFF]">assign</span> out = ~(a & b);</div>
                        <div><span className="text-blue-600 dark:text-[#6E7BFF]">endmodule</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-5 space-y-4 font-mono text-[11px] border-l border-slate-200 dark:border-slate-900/60 pl-0 md:pl-6">
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-550 dark:text-[#8E9AA8] uppercase block tracking-wider">Toggle inputs</span>
                      <button onClick={() => setPinState(p => ({ ...p, A: !p.A }))} aria-pressed={pinState.A} aria-label={`Input A: ${pinState.A ? 'HIGH' : 'LOW'}`} className={`w-full text-left px-3 py-2 rounded border flex justify-between active-press ${pinState.A ? 'bg-[#4A57FF]/10 border-[#4A57FF] text-[#4A57FF]' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 dark:text-[#8E9AA8]'}`}>
                        <span>Input A</span><span className="font-bold tabular-data">{pinState.A ? '1' : '0'}</span>
                      </button>
                      <button onClick={() => setPinState(p => ({ ...p, B: !p.B }))} aria-pressed={pinState.B} aria-label={`Input B: ${pinState.B ? 'HIGH' : 'LOW'}`} className={`w-full text-left px-3 py-2 rounded border flex justify-between active-press ${pinState.B ? 'bg-[#4A57FF]/10 border-[#4A57FF] text-[#4A57FF]' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 dark:text-[#8E9AA8]'}`}>
                        <span>Input B</span><span className="font-bold tabular-data">{pinState.B ? '1' : '0'}</span>
                      </button>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-900">
                      <span className="text-[9px] text-slate-550 dark:text-[#8E9AA8] uppercase block tracking-wider mb-1">Computed result</span>
                      <div className={`font-bold px-3 py-2 rounded border tabular-data ${outNand ? 'bg-[#10B981]/5 border-[#10B981]/20 text-[#10B981]' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-455 dark:text-slate-500'}`}>Output = {outNand ? '1' : '0'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-[#03050a] p-4 rounded-lg border border-slate-200 dark:border-slate-900 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center gap-4"><span className="w-16 text-slate-500 dark:text-[#8E9AA8]">Clock</span><svg width="100%" height="16" viewBox="0 0 300 16" preserveAspectRatio="none" className="text-slate-300 dark:text-slate-800"><path d="M 0 14 L 30 14 L 30 2 L 60 2 L 60 14 L 90 14 L 90 2 L 120 2 L 120 14 L 150 14 L 150 2 L 180 2 L 180 14 L 210 14 L 210 2 L 240 2 L 240 14 L 270 14 L 270 2 L 300 2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
                  <div className="flex items-center gap-4"><span className="w-16 text-[#4A57FF]">Output</span><svg width="100%" height="16" viewBox="0 0 300 16" preserveAspectRatio="none" className="text-[#4A57FF]/80"><path d="M 0 2 L 90 2 L 90 14 L 180 14 L 180 2 L 300 2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
                </div>
              )}
            </div>
            <div className="bg-slate-50 dark:bg-[#03050a] px-4 py-3 border-t border-slate-200 dark:border-slate-900 font-mono text-[10px] text-slate-500 dark:text-[#8E9AA8] flex justify-between">
              <span>&gt;_ Running: Gate logic simulator</span>
              <span className="tabular-data">Delay: 12ps &bull; Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEE IT IN ACTION · self-built animated signal scope ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-2 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-[12px] font-bold tracking-[0.14em] text-[#2E32FF] uppercase mb-3">See it in action</span>
          <h2 className="font-extrabold text-slate-900 tracking-tight text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.08]">
            Watch signals become silicon.
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Every concept is something you can see, toggle, and play with — not just read about.
          </p>
        </div>

        <SignalShowcase />
      </section>

      <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/60 dark:border-slate-900/60 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4 max-w-[65ch]">
          <span className="text-[10px] font-mono text-[#4A57FF] uppercase tracking-widest block">// ANALYTICAL LOGIC PLAYGROUND</span>
          <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-[clamp(1.75rem,4vw,3rem)] leading-[1.1]">
            Bridge the gap between math derivations and actual silicon.
          </h2>
          <p className="text-sm text-slate-650 dark:text-[#8E9AA8] leading-relaxed">
            Traditional engineering curricula often leave students stuck in abstract whiteboard derivations, disconnected from the physical tools and systems used in the semiconductor industry. BitforBytes tethers physical concepts directly to a visually accurate logic gate environment.
          </p>
        </div>
        <div className="lg:col-span-6 bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-slate-900 rounded-xl p-6 flex flex-col justify-center items-center min-h-[200px]">
          <div className="flex gap-2 font-mono text-[10px] mb-4">
            {['AND', 'OR', 'NAND', 'NOR', 'XOR'].map((g) => (
              <span key={g} className={`px-2.5 py-1 rounded border active-press ${g === 'NOR' ? 'bg-[#4A57FF]/10 border-[#4A57FF] text-[#4A57FF]' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-600 dark:text-[#8E9AA8]'}`}>{g}</span>
            ))}
          </div>
          <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">HIGH</div>
        </div>
      </AnimatedSection>

      <SiliconPlaypenGrid />

      <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8 border-t border-slate-200/60 dark:border-slate-900/60">
        <PremiumBentoFeatures />
      </AnimatedSection>

      {/* SECTION 5: THE CURRICULUM INDEX SEQUENCE */}
      <AnimatedSection id="curriculum" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/60 dark:border-slate-900/60 space-y-12">
        <div className="text-left max-w-[65ch] space-y-2">
          <span className="text-[10px] font-mono text-[#4A57FF] uppercase tracking-widest block">// CURRICULUM PIPELINE PATHWAYS</span>
          <h2 className={`font-bold uppercase tracking-tight text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            A COMPLETE SILICON ENGINEERING PIPELINE.
          </h2>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
            Select your curriculum entry block. Build fundamental digital logic components, synthesise functional hardware modules, and evaluate physical floorplanning timing metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {[
            { id: "01", title: "Boolean Foundations & States", subtitle: "Digital Logic Primitives", desc: "Master Boolean algebra, combinational networks, and finite state machines through interactive gate matrices and live truth tables. Designed to establish solid core ECE fundamentals.", action: "Begin Core Module &rarr;", time: "TIME: ~90 mins" },
            { id: "02", title: "Verilog HDL RTL Synthesis", subtitle: "Hardware Description Languages", desc: "Transition from visual schematics to industry-standard Verilog. Learn to author functional testbenches and verify logic loops via browser-based RTL synthesis.", action: "Join Queue Waitlist &rarr;", time: "YEAR RANGE: 3-4" },
            { id: "03", title: "Silicon Timing & Physical Floorplanning", subtitle: "Physical Layer Optimization", desc: "Understand the structural realities of silicon. Manage propagation delays, setup and hold constraints, and evaluate clock skew latency parameters on macro floorplanning diagrams.", action: "Explore Market Maps &rarr;", time: "TELEMETRY: ACTIVE" }
          ].map((c) => (
            <div key={c.id} className={`border rounded-xl p-6 flex flex-col justify-between group transition-colors duration-500 ${isDarkMode ? 'bg-[#090e1a] border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-[#4A57FF] block uppercase tracking-wider">{c.id} / {c.subtitle}</span>
                <h3 className={`text-base font-semibold tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{c.title}</h3>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{c.desc}</p>
              </div>
              <div className={`mt-8 pt-4 border-t flex items-center justify-between font-mono text-[10px] ${isDarkMode ? 'border-slate-900/60' : 'border-slate-100'}`}>
                <span className="text-[#8E9AA8] tabular-data">{c.time}</span>
                <button className="text-[#4A57FF] group-hover:underline active-press">{c.action}</button>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* SECTION 6: THE TARGET PROFILES CONSOLE */}
      <AnimatedSection id="diagnostics" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/60 dark:border-slate-900/60 space-y-8">
        <div className="max-w-[65ch] space-y-1 text-left">
          <span className="text-[10px] font-mono text-[#4A57FF] uppercase tracking-widest block">// DOCUMENTATION TARGET PROFILES</span>
          <h2 className={`font-bold uppercase tracking-tight text-[clamp(1.5rem,4vw,2.75rem)] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Engineered for clarity at every level.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-2 font-mono text-[11px]" role="tablist" aria-label="Profile Stage Selector">
            {(['ACADEMIC', 'SYSTEMS', 'PROFESSIONAL'] as ProfileTabType[]).map((p) => (
              <button key={p} role="tab" aria-selected={profileTab === p} onClick={() => setProfileTab(p)} className={`w-full text-left px-4 py-3.5 border rounded-lg transition-colors active-press ${profileTab === p ? 'bg-white dark:bg-[#090e1a] border-[#4A57FF]/30 text-[#4A57FF] shadow-sm' : 'bg-slate-50/20 dark:bg-[#090e1a]/20 border-slate-200 dark:border-slate-900 text-slate-600 dark:text-[#8E9AA8] hover:text-slate-900 dark:hover:text-slate-400'}`}>
                {p === 'ACADEMIC' && 'Academic Foundations'}
                {p === 'SYSTEMS' && 'Systems Transition'}
                {p === 'PROFESSIONAL' && 'Professional Expansion'}
              </button>
            ))}
          </div>

          <div className={`lg:col-span-8 border rounded-xl p-6 min-h-[220px] font-mono flex flex-col justify-between transition-colors duration-500 ${isDarkMode ? 'bg-[#090e1a] border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`} role="tabpanel">
            <div className="space-y-3">
              <span className="text-[9px] text-[#8E9AA8] block uppercase tracking-wider">Active_Stage: {profileTab}</span>
              {profileTab === 'ACADEMIC' && (
                <>
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-[#4A57FF]" />
                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Visualize abstract lecture physics.</h3>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans max-w-prose ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>For students navigating lecture material who require a visual, tactile model to master the physics of digital circuits. Replace manual truth tables with real-time waveform analyzers and gate debuggers.</p>
                </>
              )}
              {profileTab === 'SYSTEMS' && (
                <>
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-[#4A57FF]" />
                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Master architectural cross-compilation execution pipelines.</h3>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans max-w-prose ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>For software developers moving down the hardware stack. Uncover how operational instructions synthesize into custom physical layouts, cache topologies, and core vectors.</p>
                </>
              )}
              {profileTab === 'PROFESSIONAL' && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#10B981]" />
                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Scale tool-fluent foundry capability.</h3>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans max-w-prose ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>For senior engineering profiles tuning low-level ASIC parameters. Close setup errors, optimize routing layers, and secure continuous verification targets.</p>
                </>
              )}
            </div>
            <div className={`mt-4 pt-3 border-t text-[10px] text-[#10B981] flex gap-2 items-center ${isDarkMode ? 'border-slate-900/60' : 'border-slate-100'}`}>&bull; <span>System diagnostic paths loaded cleanly</span></div>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Accordion Section */}
      <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6 py-16 border-t border-slate-200/60 dark:border-slate-900/60 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-[#4A57FF] uppercase tracking-widest block">// SYSTEM FREQUENTLY ASKED QUESTIONS</span>
          <h2 className={`font-bold uppercase tracking-tight text-2xl md:text-3xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Common Inquiries</h2>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className={`border rounded-xl overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#090e1a] border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold transition-colors font-sans active-press ${isDarkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-black'}`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-[#4A57FF]" />
                    <span>{faq.q}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-[#8E9AA8]" /> : <ChevronDown size={16} className="text-[#8E9AA8]" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className={`px-6 pb-5 pt-1 text-xs leading-relaxed font-sans border-t ${isDarkMode ? 'text-slate-400 border-slate-900/30' : 'text-slate-600 border-slate-100'}`}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* SECTION 7: THE CONVERSION STAGE & LIQUID GLASS FOOTER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-16">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto text-center border-b pb-6 font-mono ${
            isDarkMode ? 'border-slate-900' : 'border-slate-200'
          }`}>
            {[
              { v: '13', l: 'ECE Domains Map' },
              { v: '₹0', l: 'Free for Students' },
              { v: '85K', l: 'Engineers Needed' },
              { v: '$1T', l: 'Market Size by 2030' }
            ].map((i, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#10B981]" />
                  <div className="text-lg font-bold text-[#4A57FF] tabular-data">{i.v}</div>
                </div>
                <div className="text-[8px] text-slate-500 dark:text-[#8E9AA8] uppercase tracking-wider">{i.l}</div>
              </div>
            ))}
          </div>

          <h2 className={`font-bold tracking-tight uppercase leading-[1.1] text-[clamp(1.75rem,4.5vw,3rem)] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Modern hardware design <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A57FF] to-[#10B981]">
              requires intuitive tools.
            </span>
          </h2>
          <p className={`text-xs md:text-sm max-w-[60ch] mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
            Join thousands of engineering students and developers who use our application workspace. BitforBytes guides you through every layer of the processor stack with free, browser-based environments.
          </p>
          <div className="flex justify-center gap-3 font-mono text-[11px]">
            <Link to={primaryTo} className="bg-[#2E32FF] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#1E22E0] transition-colors text-center active-press">{primaryLabel}</Link>
            <a href={LANDING_ROUTES.social.discord} target="_blank" rel="noopener noreferrer" className={`border px-6 py-3 rounded-lg transition-colors text-center active-press ${isDarkMode ? 'border-slate-800 text-slate-300 bg-slate-900/40 hover:bg-slate-800' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-100 shadow-sm'}`}>Join Discord Community</a>
          </div>
          <span className="text-[9px] font-mono text-slate-500 dark:text-[#8E9AA8] tracking-wider block uppercase">No Account Required &bull; No CC Needed &bull; Installs: 0</span>
        </div>

        {/* ULTRA-PREMIUM LIQUID GLASS FOOTER COMPONENT */}
        <footer className={`liquid-glass w-full rounded-2xl p-8 md:p-12 border-t z-10 transition-all duration-500 ${isDarkMode ? 'text-white/50 border-slate-900/60' : 'text-slate-700/60 border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 text-left">
            <div className="md:col-span-5 space-y-3">
              <BrandWordmark size={26} textClassName={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
              <p className={`text-xs leading-relaxed font-sans max-w-xs ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-650'}`}>
                Signals become logic. Logic becomes systems. Free, open-access digital design and VLSI education.
              </p>
              <p className="text-[10px] font-mono text-slate-550 dark:text-[#8E9AA8]">&copy; 2026 BitforBytes. All rights reserved. Aligned to ISM 2.0.</p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-[10px] tracking-wider">
              <div>
                <h4 className={`font-semibold mb-3 uppercase text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>// Navigation</h4>
                <ul className={`space-y-2 ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-600'}`}>
                  <li><a href="#curriculum" className="hover:text-[#4A57FF] transition-colors">&gt;_ Curriculum</a></li>
                  <li><a href="#playground" className="hover:text-[#4A57FF] transition-colors">&gt;_ Playground</a></li>
                  <li><a href="#diagnostics" className="hover:text-[#4A57FF] transition-colors">&gt;_ Documentation</a></li>
                  <li><Link to={LANDING_ROUTES.about} className="hover:text-[#4A57FF] transition-colors">&gt;_ About Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold mb-3 uppercase text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>// Platform</h4>
                <ul className={`space-y-2 ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-600'}`}>
                  <li><a href={LANDING_ROUTES.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#4A57FF] transition-colors">&gt;_ GitHub Source</a></li>
                  <li><span className="hover:text-[#4A57FF] transition-colors">&gt;_ Terms of Service</span></li>
                  <li><span className="hover:text-[#4A57FF] transition-colors">&gt;_ Privacy Policy</span></li>
                  <li><a href={LANDING_ROUTES.social.email} className="hover:text-[#4A57FF] transition-colors">&gt;_ Contact Email</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </section>

    </main>
  );
}
