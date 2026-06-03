import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'GATES' | 'WAVEFORMS' | 'TELEMETRY';

export const SiliconPlaypenGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('GATES');
  
  // States for the Gate Simulator tab
  const [pinA, setPinA] = useState<boolean>(true);
  const [pinB, setPinB] = useState<boolean>(false);
  const outNand = !(pinA && pinB);

  // States for Waveform simulation cycles
  const [clockCycle, setClockCycle] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setClockCycle((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#060813] py-24 px-4 md:px-8 border-b border-slate-900 text-slate-200 antialiased font-sans relative overflow-hidden">
      
      {/* Self-contained style overrides for snappy logic easing curve */}
      <style>{`
        .bezier-ease {
          transition: all 650ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tab-transition {
          transition: all 450ms cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section with Fluid Typography */}
        <div className="max-w-[65ch] space-y-4">
          <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-widest block">
            // LIVE SYSTEM RUNTIME ENVIRONMENT
          </span>
          <h2 
            className="font-bold text-slate-100 tracking-tight leading-[1.1] uppercase font-sans"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            Interact with real <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#10B981]">
              hardware primitives.
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-prose">
            Click the workspace matrix below to toggle inputs, monitor real-time clock cycles, and evaluate execution timing closures concurrently.
          </p>
        </div>

        {/* The Asymmetric Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: The Component Selector Matrix (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-start">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">
              SELECT_EDA_STAGE
            </span>
            {(['GATES', 'WAVEFORMS', 'TELEMETRY'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-label={`Select ${tab.toLowerCase()} module`}
                className={`w-full text-left font-sans text-xs px-5 py-4 border rounded-lg relative tab-transition uppercase tracking-wider focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                  activeTab === tab
                    ? 'bg-[#0F172A] border-[#22D3EE]/60 text-[#22D3EE]'
                    : 'bg-[#0F172A]/40 border-slate-900 text-slate-450 hover:border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{tab} MODULE</span>
              </button>
            ))}
          </div>

          {/* Right Panel: The Live Laboratory Simulator Stage (8 Columns) */}
          <div className="lg:col-span-8 bg-[#0F172A] border border-slate-900 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            
            {/* Terminal Window Chrome bar */}
            <div className="bg-[#060813] px-5 py-3 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-500 lowercase tracking-wider">
                  bitforbytes_core_analyzer.{activeTab.toLowerCase()}
                </span>
              </div>
              <div className="font-mono text-[10px] text-[#22D3EE]/95 bg-[#22D3EE]/5 border border-[#22D3EE]/10 px-2 py-0.5 rounded tracking-wide">
                SYS_STATUS: RUNNING
              </div>
            </div>

            {/* Inner Stage Canvas Area */}
            <div className="p-8 flex-1 relative flex flex-col justify-center bg-[#090e1a]/20">
              <AnimatePresence mode="wait">
                
                {/* STAGE 1: GATE DESIGNS INTERACTIVE WORKSPACE */}
                {activeTab === 'GATES' && (
                  <motion.div
                    key="GATES"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                      
                      {/* Clickable Matrix Pin Rails */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-slate-400 w-12">PIN_A:</span>
                          <button 
                            onClick={() => setPinA(!pinA)}
                            aria-label="Toggle input Pin A state"
                            className={`px-3 py-1.5 font-mono text-xs border rounded transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                              pinA ? 'bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]' : 'bg-[#060813] border-slate-800 text-slate-550'
                            }`}
                          >
                            {pinA ? '1 (HIGH)' : '0 (LOW)'}
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-slate-400 w-12">PIN_B:</span>
                          <button 
                            onClick={() => setPinB(!pinB)}
                            aria-label="Toggle input Pin B state"
                            className={`px-3 py-1.5 font-mono text-xs border rounded transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                              pinB ? 'bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]' : 'bg-[#060813] border-slate-800 text-slate-550'
                            }`}
                          >
                            {pinB ? '1 (HIGH)' : '0 (LOW)'}
                          </button>
                        </div>
                      </div>

                      {/* Schematic Logic Execution Model Vector Layout */}
                      <div className="relative flex items-center justify-center border border-slate-900 p-6 rounded-lg bg-[#060813]/90">
                        
                        {/* Interactive Visual Wire Trace indicators */}
                        <div className="absolute left-0 top-1/3 w-6 h-[2px] -translate-x-full transition-colors duration-300" 
                             style={{ backgroundColor: pinA ? '#22D3EE' : '#1E293B' }} />
                        <div className="absolute left-0 top-2/3 w-6 h-[2px] -translate-x-full transition-colors duration-300" 
                             style={{ backgroundColor: pinB ? '#22D3EE' : '#1E293B' }} />
                        <div className="absolute right-0 top-1/2 w-6 h-[2px] translate-x-full transition-colors duration-300" 
                             style={{ backgroundColor: outNand ? '#22D3EE' : '#1E293B' }} />

                        {/* Native SVG Schematic Representation */}
                        <svg width="70" height="50" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
                          <path d="M10 5 H35 C45 5, 55 15, 55 25 C55 35, 45 45, 35 45 H10 V5 Z" stroke="currentColor" strokeWidth="2" fill="#090e1a"/>
                          <circle cx="61" cy="25" r="4" stroke="currentColor" strokeWidth="2" fill="#03050a"/>
                          <text x="20" y="30" fill="currentColor" className="font-mono text-[11px] font-bold tracking-tighter">NAND</text>
                        </svg>
                      </div>

                      {/* Output Hardware Block */}
                      <div className="text-center sm:text-left">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">OUTPUT_LOGIC</div>
                        <div className={`text-2xl font-mono font-bold px-4 py-2 rounded border transition-all duration-300 ${
                          outNand ? 'bg-emerald-500/10 border-[#10B981] text-[#10B981]' : 'bg-[#060813] border-slate-800 text-slate-550'
                        }`}>
                          {outNand ? 'VAL = 1' : 'VAL = 0'}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STAGE 2: WAVEFORM OSCILLOSCOPE MONITOR STAGE */}
                {activeTab === 'WAVEFORMS' && (
                  <motion.div
                    key="WAVEFORMS"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full space-y-4"
                  >
                    <div className="bg-[#060813]/90 p-6 rounded-lg border border-slate-900 space-y-4">
                      <span className="text-[10px] font-mono text-[#22D3EE] tracking-wider block">// SYSTEM TIMING WAVEFORM CAPTURE</span>
                      
                      {/* SVG Logic Timing Timeline Block */}
                      <div className="w-full h-24 relative flex items-end">
                        <svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none" className="text-[#22D3EE]">
                          <path 
                            d="M 0 60 L 50 60 L 50 20 L 100 20 L 100 60 L 150 60 L 150 20 L 200 20 L 200 60 L 250 60 L 250 20 L 300 20 L 300 60 L 350 60 L 350 20 L 400 20" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            className="transition-all duration-500"
                          />
                          {/* Dynamic Indicator tracking point */}
                          <circle cx={50 + clockCycle * 100} cy="20" r="3" fill="#FFB000" />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 pt-2 border-t border-slate-900/60">
                        <span>FRAME INDEX: {clockCycle} / 03</span>
                        <span>RESOLUTION: 10ps / DIV</span>
                        <span className="text-emerald-500/80">CLOCK LOCK: TRUE</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STAGE 3: TELEMETRY PERFORMANCE TELEMETRY TRACK TRACKERS */}
                {activeTab === 'TELEMETRY' && (
                  <motion.div
                    key="TELEMETRY"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full space-y-5"
                  >
                    {/* Metric Block 1: Setup Constraint */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-slate-400">SETUP_MARGIN_CONSTRAINT</span>
                        <span className="text-[#10B981] font-bold">88% (MARGIN_SAFE)</span>
                      </div>
                      <div className="w-full h-2 bg-[#060813] border border-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10B981] rounded-full transition-all duration-1000 w-[88%]" />
                      </div>
                    </div>

                    {/* Metric Block 2: Logic Block Optimization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-slate-400">LOGIC_BLOCK_OPTIMIZATION</span>
                        <span className="text-[#22D3EE] font-bold">65% (SYNTH_STABLE)</span>
                      </div>
                      <div className="w-full h-2 bg-[#060813] border border-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-[#22D3EE] rounded-full transition-all duration-1000 w-[65%]" />
                      </div>
                    </div>

                    {/* Metric Block 3: Clock Skew Delta */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-slate-400">CLOCK_SKEW_LATENCY_DELTA</span>
                        <span className="text-[#FFB000] font-bold">12% (WARNING_MARGIN)</span>
                      </div>
                      <div className="w-full h-2 bg-[#060813] border border-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFB000] rounded-full transition-all duration-1000 w-[12%]" />
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Static Diagnostic Metadata Footer line trace routing details */}
            <div className="bg-[#060813] px-5 py-3.5 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#22D3EE]">&gt;_</span>
                <span>Active Workspace: DSD_Module_01_Foundations</span>
              </div>
              <div className="flex items-center gap-4 font-sans text-[10px]">
                <span>Grid: 45° Route Matrix</span>
                <span className="font-mono">Subpixel Scan: 4x4</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
