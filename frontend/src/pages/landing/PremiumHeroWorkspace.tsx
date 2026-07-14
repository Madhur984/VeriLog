import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

export const PremiumHeroWorkspace: React.FC = () => {
  const authed = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState<'VERILOG' | 'TIMING'>('VERILOG');
  const [pinState, setPinState] = useState<{ A: boolean; B: boolean }>({ A: true, B: false });

  const primaryTo = authed ? LANDING_ROUTES.workstation : LANDING_ROUTES.firstModule;
  const primaryLabel = authed ? 'Go to Workstation' : 'Start your first module free';

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden flex flex-col justify-between pt-24 border-b border-slate-900">
      
      {/* Micro-Detail: High-Fidelity Subtle Technical Grid Base */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Deep Layer Radial Glows — For depth, not neon flashiness */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/[0.02] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/[0.015] blur-[120px] pointer-events-none" />

      {/* Main Structural Layout Grid */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 py-12 z-10">
        
        {/* Left Column: Authoritative Value Copy */}
        <div className="lg:col-span-5 space-y-8 text-left">
          
          {/* Subtle Technical Index Tag */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            <span>Platform Core // v2.0.26</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] uppercase">
              Bits become logic. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                Logic becomes silicon.
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-[48ch]">
              Go from confused ECE undergraduate to industry-ready digital design engineer. Learn VLSI, physical layout rules, and RTL synthesis through zero-install interactive simulation tools.
            </p>
          </div>

          {/* Clean, Non-Gimmicky CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-medium">
            <Link 
              to={primaryTo}
              aria-label="Start digital design curriculum module"
              className="px-6 py-3 rounded-lg text-sm bg-slate-100 text-slate-950 font-semibold hover:bg-white transition-all duration-150 shadow-sm active:scale-[0.98] text-center"
            >
              {primaryLabel}
            </Link>
            <Link 
              to={LANDING_ROUTES.career}
              aria-label="Explore engineering career roadmaps"
              className="px-6 py-3 rounded-lg text-sm bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-150 active:scale-[0.98] text-center"
            >
              Explore career paths
            </Link>
          </div>

          {/* Pure, Low-Contrast Trust Labels */}
          <div className="pt-4 border-t border-slate-900 space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Trusted at engineering institutions</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-slate-400 font-medium">
              <span>IIT</span> &bull; <span>NIT</span> &bull; <span>VIT</span> &bull; <span>BITS</span> &bull; <span>DTU</span> &bull; <span>ANNA UNIV</span>
            </div>
          </div>
        </div>

        {/* Right Column: Premium, Pixel-Perfect IDE Workstation Mockup */}
        <div className="lg:col-span-7 w-full">
          <div className="w-full bg-[#0d131f] border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[440px]">
            
            {/* Real App Header UI Layer */}
            <div className="bg-[#080b12] px-4 py-3 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Simulated Window Control Dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>
                
                {/* Premium Tabs Selection System */}
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <button 
                    onClick={() => setActiveTab('VERILOG')}
                    aria-label="Show Verilog code editor tab"
                    className={`px-2.5 py-1 transition-colors ${activeTab === 'VERILOG' ? 'text-cyan-400 border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    nand_gate.v
                  </button>
                  <button 
                    onClick={() => setActiveTab('TIMING')}
                    aria-label="Show timing diagram analyzer tab"
                    className={`px-2.5 py-1 transition-colors ${activeTab === 'TIMING' ? 'text-cyan-400 border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    timing_diagram.out
                  </button>
                </div>
              </div>

              <div className="font-mono text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
                SIMULATION_PASS
              </div>
            </div>

            {/* Main Stage Workarea Content */}
            <div className="p-6 md:p-8 flex-1 bg-[#090d15]/40 flex flex-col justify-center">
              
              {activeTab === 'VERILOG' ? (
                /* TAB 1: Ultra-Clean Code Syntax & Interactive Control Array */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Clean Monospace Editor Layout */}
                  <div className="md:col-span-7 bg-[#05070c] p-4 rounded-lg border border-slate-900 font-mono text-xs text-slate-300 space-y-1.5 shadow-inner">
                    <div><span className="text-teal-400">module</span> <span className="text-slate-200">nand_primitive</span> (</div>
                    <div className="pl-4 text-slate-500">input <span className="text-slate-400">a, b,</span></div>
                    <div className="pl-4 text-slate-500">output <span className="text-slate-400">out</span></div>
                    <div>);</div>
                    <div className="pl-4 pt-2 text-slate-400"><span className="text-teal-400">assign</span> out = ~(a & b);</div>
                    <div className="pt-2"><span className="text-teal-400">endmodule</span></div>
                  </div>

                  {/* Clean Hardware State Diagnostics */}
                  <div className="md:col-span-5 space-y-4 border-l border-slate-900/60 pl-0 md:pl-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Modify Pin Vectors</label>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setPinState(p => ({ ...p, A: !p.A }))}
                          aria-label="Toggle input Pin A state"
                          className={`w-full text-left font-mono text-xs px-3 py-2 rounded border flex justify-between items-center transition-all ${
                            pinState.A ? 'bg-slate-900 border-cyan-500/30 text-cyan-400' : 'bg-slate-950 border-slate-900 text-slate-600'
                          }`}
                        >
                          <span>INPUT_A</span>
                          <span className="font-bold">{pinState.A ? '1' : '0'}</span>
                        </button>
                        <button 
                          onClick={() => setPinState(p => ({ ...p, B: !p.B }))}
                          aria-label="Toggle input Pin B state"
                          className={`w-full text-left font-mono text-xs px-3 py-2 rounded border flex justify-between items-center transition-all ${
                            pinState.B ? 'bg-slate-900 border-cyan-500/30 text-cyan-400' : 'bg-slate-950 border-slate-900 text-slate-600'
                          }`}
                        >
                          <span>INPUT_B</span>
                          <span className="font-bold">{pinState.B ? '1' : '0'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900">
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Evaluated Output</div>
                      <div className={`font-mono text-xs font-bold px-3 py-2 rounded border ${
                        !(pinState.A && pinState.B) ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-950 border-slate-900 text-slate-500'
                      }`}>
                        OUTPUT_OUT = {!(pinState.A && pinState.B) ? '1' : '0'}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* TAB 2: Clean Timing Graph Representation (Textbook Accurate, Not Gimmicky) */
                <div className="space-y-4">
                  <div className="bg-[#05070c] p-4 rounded-lg border border-slate-900 space-y-4">
                    
                    <div className="grid grid-cols-12 items-center font-mono text-[11px]">
                      <span className="col-span-2 text-slate-500">CLK (GHz)</span>
                      <div className="col-span-10 h-6 flex items-center">
                        <svg width="100%" height="100%" viewBox="0 0 300 20" preserveAspectRatio="none" className="text-slate-700">
                          <path d="M 0 18 L 30 18 L 30 2 L 60 2 L 60 18 L 90 18 L 90 2 L 120 2 L 120 18 L 150 18 L 150 2 L 180 2 L 180 18 L 210 18 L 210 2 L 240 2 L 240 18 L 270 18 L 270 2 L 300 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center font-mono text-[11px]">
                      <span className="col-span-2 text-cyan-400">SIGNAL_OUT</span>
                      <div className="col-span-10 h-6 flex items-center">
                        <svg width="100%" height="100%" viewBox="0 0 300 20" preserveAspectRatio="none" className="text-cyan-400/80">
                          <path d="M 0 2 L 90 2 L 90 18 L 180 18 L 180 2 L 300 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* System Output Console Status Line */}
            <div className="bg-[#080b12] px-5 py-3 border-t border-slate-900 flex items-center justify-between font-mono text-[10px] text-slate-500 tracking-wide">
              <div className="flex items-center gap-2">
                <span className="text-cyan-500">&gt;_</span>
                <span>Active Target: Core_Matrix_Evaluator_01</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>Delay: 12ps</span>
                <span>Foundry Capable: Yes</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Pure Corporate-SaaS Footer Row */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 border-t border-slate-900/60 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 z-10 gap-2">
        <div>&copy; 2026 BitForBytes Inc. Aligned with India Semiconductor Mission.</div>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-slate-300">Terms</Link>
          <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
          <a href="#" className="hover:text-slate-300">Security Architecture</a>
        </div>
      </div>

    </div>
  );
};
