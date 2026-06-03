import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorScheme } from '../../hooks/useColorScheme';

type TabType = 'GATES' | 'WAVEFORMS' | 'TELEMETRY';

export const SiliconPlaypenGrid: React.FC = () => {
  const [scheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  
  // States for the component selector tab (with LocalStorage Persistence)
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = localStorage.getItem('bitforbytes_grid_tab');
    return (saved === 'GATES' || saved === 'WAVEFORMS' || saved === 'TELEMETRY') ? saved as TabType : 'GATES';
  });
  
  // States for the Gate Simulator tab (with LocalStorage Persistence)
  const [pinA, setPinA] = useState<boolean>(() => {
    const saved = localStorage.getItem('bitforbytes_grid_pin_a');
    return saved === null ? true : saved === 'true';
  });
  const [pinB, setPinB] = useState<boolean>(() => {
    const saved = localStorage.getItem('bitforbytes_grid_pin_b');
    return saved === null ? false : saved === 'true';
  });
  const outNand = !(pinA && pinB);

  // States for Waveform simulation cycles
  const [clockCycle, setClockCycle] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setClockCycle((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Sync state values to LocalStorage
  useEffect(() => {
    localStorage.setItem('bitforbytes_grid_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('bitforbytes_grid_pin_a', String(pinA));
  }, [pinA]);

  useEffect(() => {
    localStorage.setItem('bitforbytes_grid_pin_b', String(pinB));
  }, [pinB]);

  return (
    <div 
      id="playground" 
      className={`w-full py-24 px-4 md:px-8 border-b transition-colors duration-500 antialiased font-sans relative overflow-hidden ${
        isDarkMode ? 'bg-[#060813] border-slate-900 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}
    >
      
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
          <span className="text-xs font-mono text-[#00F5FF] uppercase tracking-widest block">
            // LIVE SYSTEM RUNTIME ENVIRONMENT
          </span>
          <h2 
            className={`font-bold tracking-tight leading-[1.1] uppercase font-sans ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            Interact with real <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#10B981]">
              hardware primitives.
            </span>
          </h2>
          <p className={`text-sm md:text-base leading-relaxed max-w-prose ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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
                className={`w-full text-left font-sans text-xs px-5 py-4 border rounded-lg relative tab-transition uppercase tracking-wider active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                  activeTab === tab
                    ? (isDarkMode ? 'bg-[#0F172A] border-[#00F5FF]/60 text-[#00F5FF]' : 'bg-white border-[#00F5FF]/60 text-[#00F5FF] shadow-sm')
                    : (isDarkMode ? 'bg-[#0F172A]/40 border-slate-900 text-slate-450 hover:border-slate-800 hover:text-slate-200' : 'bg-white/40 border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-900')
                }`}
              >
                <span>{tab} MODULE</span>
              </button>
            ))}
          </div>

          {/* Right Panel: The Live Laboratory Simulator Stage (8 Columns) */}
          <div 
            className={`lg:col-span-8 border rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px] transition-colors duration-500 ${
              isDarkMode ? 'bg-[#0F172A] border-slate-900' : 'bg-white border-slate-200'
            }`}
          >
            
            {/* Terminal Window Chrome bar */}
            <div 
              className={`px-5 py-3 border-b flex items-center justify-between transition-colors duration-500 ${
                isDarkMode ? 'bg-[#060813] border-slate-900' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-800"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-500 lowercase tracking-wider">
                  bitforbytes_core_analyzer.{activeTab.toLowerCase()}
                </span>
              </div>
              <div className="font-mono text-[10px] text-[#00F5FF]/95 bg-[#00F5FF]/5 border border-[#00F5FF]/10 px-2 py-0.5 rounded tracking-wide">
                SYS_STATUS: RUNNING
              </div>
            </div>

            {/* Inner Stage Canvas Area */}
            <div 
              className={`p-8 flex-1 relative flex flex-col justify-center transition-colors duration-500 ${
                isDarkMode ? 'bg-[#090e1a]/20' : 'bg-slate-50/20'
              }`}
            >
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
                          <span className={`font-mono text-xs w-12 ${isDarkMode ? 'text-slate-450' : 'text-slate-600'}`}>PIN_A:</span>
                          <button 
                            onClick={() => setPinA(!pinA)}
                            aria-label="Toggle input Pin A state"
                            className={`px-3 py-1.5 font-mono text-xs border rounded transition-all active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                              pinA 
                                ? 'bg-[#00F5FF]/10 border-[#00F5FF] text-[#00F5FF]' 
                                : (isDarkMode ? 'bg-[#060813] border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400')
                            }`}
                          >
                            {pinA ? '1 (HIGH)' : '0 (LOW)'}
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-mono text-xs w-12 ${isDarkMode ? 'text-slate-450' : 'text-slate-600'}`}>PIN_B:</span>
                          <button 
                            onClick={() => setPinB(!pinB)}
                            aria-label="Toggle input Pin B state"
                            className={`px-3 py-1.5 font-mono text-xs border rounded transition-all active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                              pinB 
                                ? 'bg-[#00F5FF]/10 border-[#00F5FF] text-[#00F5FF]' 
                                : (isDarkMode ? 'bg-[#060813] border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400')
                            }`}
                          >
                            {pinB ? '1 (HIGH)' : '0 (LOW)'}
                          </button>
                        </div>
                      </div>

                      {/* Schematic Logic Execution Model Vector Layout */}
                      <div 
                        className={`relative flex items-center justify-center border p-6 rounded-lg transition-colors duration-500 ${
                          isDarkMode ? 'border-slate-900 bg-[#060813]/90' : 'border-slate-200 bg-slate-50/90'
                        }`}
                      >
                        
                        {/* Interactive Visual Wire Trace indicators */}
                        <div className="absolute left-0 top-1/3 w-6 h-[2px] -translate-x-full transition-colors duration-300" 
                             style={{ backgroundColor: pinA ? '#00F5FF' : (isDarkMode ? '#2A2A35' : '#CBD5E1') }} />
                        <div className="absolute left-0 top-2/3 w-6 h-[2px] -translate-x-full transition-colors duration-300" 
                             style={{ backgroundColor: pinB ? '#00F5FF' : (isDarkMode ? '#2A2A35' : '#CBD5E1') }} />
                        <div className="absolute right-0 top-1/2 w-6 h-[2px] translate-x-full transition-colors duration-300" 
                             style={{ backgroundColor: outNand ? '#00F5FF' : (isDarkMode ? '#2A2A35' : '#CBD5E1') }} />

                        {/* Native SVG Schematic Representation */}
                        <svg width="70" height="50" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400 phosphor-glow animate-pulse" style={{ '--glow-color': '#00F5FF' } as React.CSSProperties}>
                          <path d="M10 5 H35 C45 5, 55 15, 55 25 C55 35, 45 45, 35 45 H10 V5 Z" stroke="currentColor" strokeWidth="2" fill={isDarkMode ? "#090e1a" : "#ffffff"}/>
                          <circle cx="61" cy="25" r="4" stroke="currentColor" strokeWidth="2" fill={isDarkMode ? "#03050a" : "#f8fafc"}/>
                          <text x="20" y="30" fill="currentColor" className="font-mono text-[11px] font-bold tracking-tighter">NAND</text>
                        </svg>
                      </div>

                      {/* Output Hardware Block */}
                      <div className="text-center sm:text-left">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">OUTPUT_LOGIC</div>
                        <div className={`text-2xl font-mono font-bold px-4 py-2 rounded border transition-all duration-300 ${
                          outNand ? 'bg-emerald-500/10 border-[#10B981] text-[#10B981]' : (isDarkMode ? 'bg-[#060813] border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400')
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
                    <div 
                      className={`p-6 rounded-lg border space-y-4 transition-colors duration-500 ${
                        isDarkMode ? 'bg-[#060813]/90 border-slate-900' : 'bg-slate-50/90 border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[#00F5FF] tracking-wider block">// SYSTEM TIMING WAVEFORM CAPTURE</span>
                      
                      {/* SVG Logic Timing Timeline Block with moving lightbar */}
                      <div 
                        className={`w-full h-24 relative flex items-end overflow-hidden rounded-lg border px-2 transition-colors duration-500 ${
                          isDarkMode ? 'bg-slate-950/40 border-slate-900/30' : 'bg-white/40 border-slate-200/60'
                        }`}
                      >
                        <div className="absolute inset-y-0 w-[1.5px] bg-[#00F5FF]/50 shadow-[0_0_8px_#00F5FF] grid-sweep-line pointer-events-none" />
                        
                        <svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none" className="text-[#00F5FF]">
                          <path 
                            d="M 0 60 L 50 60 L 50 20 L 100 20 L 100 60 L 150 60 L 150 20 L 200 20 L 200 60 L 250 60 L 250 20 L 300 20 L 300 60 L 350 60 L 350 20 L 400 20" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            className="transition-all duration-500 phosphor-glow"
                            style={{ '--glow-color': '#00F5FF' } as React.CSSProperties}
                          />
                          {/* Dynamic Indicator tracking point */}
                          <circle cx={50 + clockCycle * 100} cy="20" r="3" fill="#FF5F1F" className="phosphor-glow" style={{ '--glow-color': '#FF5F1F' } as React.CSSProperties} />
                        </svg>
                      </div>

                      <div 
                        className={`flex items-center justify-between font-mono text-[11px] text-slate-500 pt-2 border-t transition-colors duration-500 ${
                          isDarkMode ? 'border-slate-900/60' : 'border-slate-200'
                        }`}
                      >
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
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>SETUP_MARGIN_CONSTRAINT</span>
                        <span className="text-[#10B981] font-bold">88% (MARGIN_SAFE)</span>
                      </div>
                      <div 
                        className={`w-full h-2 border rounded-full overflow-hidden transition-colors duration-500 ${
                          isDarkMode ? 'bg-[#060813] border-slate-900' : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="h-full bg-[#10B981] rounded-full transition-all duration-1000 w-[88%]" />
                      </div>
                    </div>

                    {/* Metric Block 2: Logic Block Optimization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>LOGIC_BLOCK_OPTIMIZATION</span>
                        <span className="text-[#00F5FF] font-bold">65% (SYNTH_STABLE)</span>
                      </div>
                      <div 
                        className={`w-full h-2 border rounded-full overflow-hidden transition-colors duration-500 ${
                          isDarkMode ? 'bg-[#060813] border-slate-900' : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="h-full bg-[#00F5FF] rounded-full transition-all duration-1000 w-[65%]" />
                      </div>
                    </div>

                    {/* Metric Block 3: Clock Skew Delta */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>CLOCK_SKEW_LATENCY_DELTA</span>
                        <span className="text-[#FF5F1F] font-bold">12% (WARNING_MARGIN)</span>
                      </div>
                      <div 
                        className={`w-full h-2 border rounded-full overflow-hidden transition-colors duration-500 ${
                          isDarkMode ? 'bg-[#060813] border-slate-900' : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="h-full bg-[#FF5F1F] rounded-full transition-all duration-1000 w-[12%]" />
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Static Diagnostic Metadata Footer line trace routing details */}
            <div 
              className={`px-5 py-3.5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-[11px] text-slate-500 gap-2 transition-colors duration-500 ${
                isDarkMode ? 'bg-[#060813] border-t-slate-900' : 'bg-slate-50 border-t-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[#00F5FF]">&gt;_</span>
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
