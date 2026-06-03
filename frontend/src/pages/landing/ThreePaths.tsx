import React from 'react';

export const ThreePathsTechTree: React.FC = () => {
  return (
    <section id="curriculum-section" className="w-full bg-[#060813] py-24 px-4 md:px-8 border-b border-slate-900 relative" aria-label="Curriculum pipeline pathways">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="space-y-4">
          <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-widest block">
            // CURRICULUM PIPELINE PATHWAYS
          </span>
          <h2 
            className="font-bold text-slate-100 tracking-tight leading-[1.1] uppercase"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            A complete silicon engineering pipeline.
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-[65ch]">
            Select your curriculum entry block. Build fundamental digital logic components, synthesise functional hardware modules, and evaluate physical floorplanning timing metrics.
          </p>
        </div>

        {/* Index Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Digital Logic Primitives */}
          <div className="bg-[#0F172A] border border-slate-900 rounded-lg p-6 flex flex-col justify-between hover:border-slate-800 transition-colors duration-200">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#22D3EE] tracking-wider uppercase">
                01 / Digital Logic Primitives
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                Boolean Foundations &amp; States
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master Boolean algebra, combinational networks, and finite state machines through interactive gate matrices and live truth tables. Designed to establish solid core ECE fundamentals.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">TIME: ~90 mins</span>
              <button aria-label="Begin digital logic primitives module" className="text-xs font-mono text-[#22D3EE] hover:underline flex items-center gap-1">
                Begin Core Module &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: Hardware Description Languages */}
          <div className="bg-[#0F172A] border border-slate-900 rounded-lg p-6 flex flex-col justify-between hover:border-slate-800 transition-colors duration-200">
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-500 tracking-wider uppercase">
                02 / Hardware Description Languages
              </div>
              <h3 className="text-lg font-bold text-slate-200 tracking-tight">
                Verilog HDL RTL Synthesis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transition from visual schematics to industry-standard Verilog. Learn to author functional testbenches and verify logic loops via browser-based RTL synthesis.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">YEAR RANGE: 3-4</span>
              <button aria-label="Join Verilog HDL queue waitlist" className="text-xs font-mono text-slate-400 hover:text-slate-200 hover:underline flex items-center gap-1">
                Join Queue Waitlist &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: Physical Layer Optimization */}
          <div className="bg-[#0F172A] border border-slate-900 rounded-lg p-6 flex flex-col justify-between hover:border-slate-800 transition-colors duration-200">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#10B981] tracking-wider uppercase">
                03 / Physical Layer Optimization
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                Silicon Timing &amp; Physical Floorplanning
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand the structural realities of silicon. Manage propagation delays, setup and hold constraints, and evaluate clock skew latency parameters on macro floorplanning diagrams.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">TELEMETRY: ACTIVE</span>
              <button aria-label="Explore silicon timing roadmap parameters" className="text-xs font-mono text-[#10B981] hover:underline flex items-center gap-1">
                Explore Market Maps &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
