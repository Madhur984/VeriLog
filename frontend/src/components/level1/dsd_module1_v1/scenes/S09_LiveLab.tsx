import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Zap, RefreshCw, Calculator, Trophy, Cpu, AlertTriangle, Lightbulb, ShieldAlert, Timer, History, Undo2, Play, CircleDot, Binary } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const GATE_BUDGET = 5;

const literal = (name: string, val: 0 | 1, mode: 'min' | 'max') => {
  if (mode === 'min') return val === 1 ? name : `${name}'`;
  return val === 0 ? name : `${name}'`;
};

const buildMinterm = (idx: number) => {
  const X = (idx >> 2) & 1, Y = (idx >> 1) & 1, Z = idx & 1;
  return `${literal('X', X as 0|1, 'min')}·${literal('Y', Y as 0|1, 'min')}·${literal('Z', Z as 0|1, 'min')}`;
};

const buildMaxterm = (idx: number) => {
  const X = (idx >> 2) & 1, Y = (idx >> 1) & 1, Z = idx & 1;
  return `${literal('X', X as 0|1, 'max')}+${literal('Y', Y as 0|1, 'max')}+${literal('Z', Z as 0|1, 'max')}`;
};

const detectPattern = (outputs: (0|1)[]): string | null => {
  const ones = outputs.filter(v => v === 1).length;
  if (ones === 0) return 'constant-zero';
  if (ones === 8) return 'constant-one';
  if (ones === 1) return 'single-minterm';
  if (ones === 7) return 'single-maxterm';
  const indices = outputs.map((o,i) => o ? i : -1).filter(i => i >= 0);
  if (indices.length > 0 && indices.every(i => i % 2 === 1)) return 'all-odd';
  if (indices.length > 0 && indices.every(i => i % 2 === 0)) return 'all-even';
  if (ones <= 3) return 'sparse-ones';
  if (ones >= 5) return 'sparse-zeros';
  return 'balanced';
};

const PATTERN_HINTS: Record<string, { msg: string; color: string; rec: 'sop'|'pos'|null }> = {
  'single-minterm': { msg: 'Single 1 detected — SOP is trivially 1 term', color: '#10b981', rec: 'sop' },
  'single-maxterm': { msg: 'Single 0 detected — POS is trivially 1 term', color: '#f59e0b', rec: 'pos' },
  'sparse-ones':    { msg: 'Sparse 1s detected → SOP is likely more efficient', color: '#10b981', rec: 'sop' },
  'sparse-zeros':   { msg: 'Sparse 0s detected → POS is likely more efficient', color: '#f59e0b', rec: 'pos' },
  'all-odd':        { msg: 'Parity pattern detected — only odd row addresses active', color: '#a78bfa', rec: null },
  'all-even':       { msg: 'Symmetry detected — only even row addresses active', color: '#a78bfa', rec: null },
  'constant-zero':  { msg: 'Null function — all outputs are grounded', color: '#64748b', rec: 'sop' },
  'constant-one':   { msg: 'Identity function — output is tied to VCC', color: '#38bdf8', rec: 'pos' },
  'balanced':       { msg: 'Balanced load — no dominant strategy', color: '#64748b', rec: null },
};

export const S09_LiveLab: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [outputs, setOutputs] = useState<(0 | 1)[]>([1, 0, 1, 0, 0, 1, 1, 0]);
  const [pulsingRow, setPulsingRow] = useState<number | null>(null);
  
  // Rapid Mode State
  const [rapidMode, setRapidMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // History State
  const [history, setHistory] = useState<(0|1)[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const ones  = useMemo(() => outputs.map((o, i) => (o === 1 ? i : -1)).filter(i => i >= 0), [outputs]);
  const zeros = useMemo(() => outputs.map((o, i) => (o === 0 ? i : -1)).filter(i => i >= 0), [outputs]);

  const sopGates = ones.length === 0 || ones.length === 8 ? 0 : ones.length + 1;
  const posGates = zeros.length === 0 || zeros.length === 8 ? 0 : zeros.length + 1;
  const cheaperGates = Math.min(sopGates, posGates);
  const systemState = cheaperGates > GATE_BUDGET ? 'fail' : cheaperGates === GATE_BUDGET ? 'warning' : 'nominal';

  const updateOutputs = (newOutputs: (0|1)[]) => {
    setHistory(prev => [...prev.slice(0, historyIdx + 1), outputs]);
    setHistoryIdx(prev => prev + 1);
    setOutputs(newOutputs);
  };

  const undo = () => {
    if (historyIdx >= 0) {
      setOutputs(history[historyIdx]);
      setHistoryIdx(prev => prev - 1);
    }
  };

  const startRapidMode = () => {
    setRapidMode(true);
    setTimeLeft(30);
    setOutputs(Array.from({ length: 8 }, () => (Math.random() < 0.5 ? 0 : 1) as 0 | 1));
  };

  useEffect(() => {
    if (rapidMode && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setRapidMode(false);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [rapidMode, timeLeft]);

  const sopShort = ones.length === 0 ? '0' : ones.length === 8 ? '1' : `Σm(${ones.join(', ')})`;
  const posShort = zeros.length === 0 ? '1' : zeros.length === 8 ? '0' : `ΠM(${zeros.join(', ')})`;

  // PPA (Power, Performance, Area) Calculations
  const gateLatency = cheaperGates > 0 ? (cheaperGates === 1 ? 2.1 : 4.8) : 0;
  const transistorCount = cheaperGates * 12;
  const powerConsumption = (cheaperGates * 0.45).toFixed(2);

  const verilogCode = useMemo(() => {
    if (ones.length === 0) return 'assign y = 0;';
    if (ones.length === 8) return 'assign y = 1;';
    const useSop = cheaperGates === sopGates;
    if (useSop) {
      const terms = ones.map(i => {
        const x = (i >> 2) & 1, y = (i >> 1) & 1, z = i & 1;
        const l = (n: string, v: number) => v ? n : `~${n}`;
        return `(${l('X',x)} & ${l('Y',y)} & ${l('Z',z)})`;
      });
      return `assign y = ${terms.join(' |\n           ')};`;
    } else {
      const terms = zeros.map(i => {
        const x = (i >> 2) & 1, y = (i >> 1) & 1, z = i & 1;
        const l = (n: string, v: number) => v ? `~${n}` : n;
        return `(${l('X',x)} | ${l('Y',y)} | ${l('Z',z)})`;
      });
      return `assign y = ${terms.join(' &\n           ')};`;
    }
  }, [ones, zeros, cheaperGates, sopGates]);

  const pattern = useMemo(() => detectPattern(outputs), [outputs]);
  const hint = pattern ? PATTERN_HINTS[pattern] : null;

  // Dopamine & Gamification State
  const [architectLog, setArchitectLog] = useState<string[]>(["SYSTEM READY. WAITING FOR ARCHITECT..."]);
  const addLog = (msg: string) => setArchitectLog(prev => [msg, ...prev].slice(0, 5));

  const savings = useMemo(() => {
    const baseline = 8; // Naive implementation
    return Math.max(0, (baseline - cheaperGates) * 1250);
  }, [cheaperGates]);

  const badges = useMemo(() => {
    const b = [];
    if (cheaperGates <= 3) b.push({ label: 'AREA KING', color: 'text-emerald-400', icon: <Trophy size={10}/> });
    if (pattern === 'single-minterm' || pattern === 'single-maxterm') b.push({ label: 'ELEGANCE', color: 'text-fuchsia-400', icon: <Zap size={10}/> });
    if (rapidMode && systemState !== 'fail') b.push({ label: 'QUICK LOGIC', color: 'text-amber-400', icon: <Timer size={10}/> });
    return b;
  }, [cheaperGates, pattern, rapidMode, systemState]);

  useEffect(() => {
    if (systemState === 'fail') addLog("⚠️ ALERT: GATE BUDGET BREACH. SILICON STABILITY DROPPING.");
    else if (systemState === 'warning') addLog("◈ CRITICAL: AREA AT CAPACITY. OPTIMIZE NOW.");
    else if (cheaperGates < 3) addLog("✓ ARCHITECT: DESIGN ELEGANCE DETECTED. AREA MINIMIZED.");
  }, [systemState, cheaperGates]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className={`max-w-6xl mx-auto space-y-8 py-4 transition-all duration-1000 ${systemState === 'fail' ? 'grayscale-[0.5] opacity-80 scale-[0.99]' : ''}`}>
      {/* Dopamine HUD */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <div className="flex gap-2">
           <AnimatePresence>
             {badges.map((b, i) => (
               <motion.div 
                 key={b.label} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                 className={`px-3 py-1 rounded-full border border-current bg-white/5 font-black text-[8px] flex items-center gap-2 tracking-widest ${b.color}`}
               >
                 {b.icon} {b.label}
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className="font-mono text-xs font-black text-emerald-400 flex items-center gap-2"
        >
          <Calculator size={14} /> MANUFACTURING SAVINGS: ${savings.toLocaleString()}
        </motion.div>
      </div>

      {/* Silicon Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Latency', value: `${gateLatency}ns`, icon: <Zap size={14}/>, color: 'text-amber-400', sub: '2-Level Max' },
          { label: 'Silicon Area', value: `${transistorCount} XTR`, icon: <Cpu size={14}/>, color: 'text-cyan-400', sub: 'BOM Estimate' },
          { label: 'Static Power', value: `${powerConsumption}mW`, icon: <FlaskConical size={14}/>, color: 'text-emerald-400', sub: 'Idle Leakage' },
          { label: 'Path State', value: systemState.toUpperCase(), icon: <ShieldAlert size={14}/>, color: systemState === 'fail' ? 'text-rose-500' : 'text-cyan-400', sub: 'Critical Path' },
        ].map((item, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex flex-col gap-1 relative overflow-hidden`}
          >
            {systemState === 'fail' && <div className="absolute inset-0 bg-rose-500/5 animate-pulse" />}
            <div className="flex items-center gap-2 opacity-40">
               {item.icon}
               <span className="text-[9px] font-mono uppercase tracking-widest">{item.label}</span>
            </div>
            <div className={`text-xl font-black font-mono ${item.color}`}>{item.value}</div>
            <div className="text-[8px] opacity-30 font-mono italic">{item.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Logic Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <section className="space-y-2 relative">
            {/* Cinematic Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 pointer-events-none opacity-20" />
            
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-cyan-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Mission Reactor S09 · Zero-Defect Optimization</span>
            </div>
            <h2 className={`text-3xl font-black ${textColor}`}>The Critical Path Reactor</h2>
            <p className={`text-sm max-w-2xl opacity-60`}>
              Design a logical function under a strict <strong>5-gate budget</strong>. 
              The reactor status depends on your synthesis efficiency.
            </p>
          </section>

          {/* Architect's Log (Terminal) */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-[10px] space-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <History size={40} />
             </div>
             <div className="text-cyan-500/40 mb-2 uppercase tracking-widest font-black">Architect's Log // Real-time Telemetry</div>
             {architectLog.map((log, i) => (
               <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={log.includes('⚠️') ? 'text-rose-500' : 'text-emerald-400/80'}>
                 {`> ${log}`}
               </motion.div>
             ))}
          </div>

          {/* Verilog Bridge Panel */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-slate-50 border-slate-200'} font-mono relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Binary size={80} className="text-cyan-400" />
            </div>
            <div className="flex items-center gap-2 mb-4">
               <div className={`w-2 h-2 rounded-full ${systemState === 'fail' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
               <span className="text-[10px] uppercase tracking-widest opacity-40">RTL_SOURCE_GEN // VERILOG</span>
               {systemState === 'fail' && (
                 <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter bg-rose-500/10 px-2 py-0.5 rounded animate-bounce">
                    Budget Overflow: Synthesis may fail
                 </span>
               )}
            </div>
            <pre className={`text-xs md:text-sm leading-relaxed overflow-x-auto transition-colors duration-500 ${systemState === 'fail' ? 'text-rose-400' : 'text-cyan-400/90'}`}>
              <code>{verilogCode}</code>
            </pre>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[9px] opacity-30 italic">Generated for Xilinx Vivado Synthesis</span>
              <button className="text-[9px] font-bold text-cyan-400 hover:underline">COPY RTL</button>
            </div>
          </motion.div>

          <div className={`p-8 rounded-[40px] border relative overflow-hidden ${cardBg}`}>
            <div className="flex justify-between items-center mb-10">
               <div className="flex gap-4">
                  {rapidMode && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 font-mono text-xs font-black animate-pulse">
                       <Timer size={14} /> {timeLeft}s REMAINING
                    </div>
                  )}
                  <button onClick={undo} disabled={historyIdx < 0} className="p-2 hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100 disabled:opacity-10">
                    <Undo2 size={16} />
                  </button>
               </div>
               <div className="flex gap-2">
                  {['ben', 'random', 'all', 'none'].map(p => (
                    <button
                      key={p} onClick={() => updateOutputs(p === 'ben' ? [1,1,1,0,1,0,0,0] : p === 'all' ? [1,1,1,1,1,1,1,1] : p === 'none' ? [0,0,0,0,0,0,0,0] : Array.from({length:8}, ()=>Math.random()<0.5?1:0) as (0|1)[])}
                      className="px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[10px] uppercase tracking-tighter hover:bg-white/5 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
               </div>
            </div>

            {/* Truth Table Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               {outputs.map((val, i) => (
                 <motion.button
                   key={i}
                   onHoverStart={() => setPulsingRow(i)}
                   onHoverEnd={() => setPulsingRow(null)}
                   onClick={() => {
                     const next = [...outputs];
                     next[i] = (1 - next[i]) as 0|1;
                     updateOutputs(next as (0|1)[]);
                   }}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className={`p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
                     val === 1 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                      : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'
                   }`}
                 >
                   <div className="font-mono text-[10px] opacity-40 mb-1">UNIVERSE m{i}</div>
                   <div className={`text-4xl font-black font-mono ${val === 1 ? 'text-emerald-400' : 'text-white'}`}>
                     {val}
                   </div>
                   <div className="mt-2 font-mono text-[9px] opacity-40">
                     {((i >> 2) & 1)}{((i >> 1) & 1)}{(i & 1)}
                   </div>
                   {val === 1 && (
                     <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
                   )}
                 </motion.button>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Stats */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {hint && (
              <motion.div
                key={pattern || 'default'}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/20' : 'bg-slate-50'}`}
                style={{ borderColor: `${hint.color}33` }}
              >
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded-xl" style={{ backgroundColor: `${hint.color}22` }}>
                     <Lightbulb size={16} style={{ color: hint.color }} />
                   </div>
                   <span className="font-bold text-xs uppercase tracking-widest opacity-60">Architectural Hint</span>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${textColor}`}>
                  {hint.msg}
                </p>
                {hint.rec && (
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Recommended:</div>
                    <div className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-black font-mono uppercase tracking-widest" style={{ color: hint.color }}>
                       {hint.rec.toUpperCase()} LENS
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`p-6 rounded-3xl border ${cardBg} space-y-6`}>
             <div className="flex items-center gap-2 mb-2">
                <Calculator size={14} className="text-cyan-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-black">Design Scorecard</span>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">SOP Implementation</div>
                      <div className="text-xl font-mono font-black">{sopGates} Gates</div>
                   </div>
                   <div className="text-[9px] font-mono opacity-20 italic truncate max-w-[120px]">{sopShort}</div>
                </div>
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">POS Implementation</div>
                      <div className="text-xl font-mono font-black">{posGates} Gates</div>
                   </div>
                   <div className="text-[9px] font-mono opacity-20 italic truncate max-w-[120px]">{posShort}</div>
                </div>
             </div>

             <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                   <div className="text-[11px] font-black uppercase tracking-widest">Total Area Usage</div>
                   <div className={`text-2xl font-black font-mono ${systemState === 'fail' ? 'text-rose-500' : 'text-emerald-400'}`}>
                      {cheaperGates}/{GATE_BUDGET}
                   </div>
                </div>
                
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ 
                       width: `${(cheaperGates / GATE_BUDGET) * 100}%`,
                       backgroundColor: systemState === 'fail' ? '#f43f5e' : systemState === 'warning' ? '#f59e0b' : '#10b981'
                     }}
                     className="h-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                   />
                </div>

                {systemState === 'fail' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500"
                  >
                    <AlertTriangle size={14} className="shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Critical Area Limit Exceeded. System Unstable.</span>
                  </motion.div>
                )}
             </div>
          </div>
          
          {/* History Timeline */}
          <div className={`p-6 rounded-3xl border ${cardBg}`}>
             <div className="flex items-center gap-2 mb-4">
                <History size={14} className="text-cyan-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-black">History Timeline</span>
             </div>
             <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {history.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setOutputs(history[i]);
                      setHistoryIdx(i - 1);
                    }}
                    className={`w-6 h-6 rounded flex-shrink-0 border flex items-center justify-center font-mono text-[8px] transition-all ${
                      i <= historyIdx ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/5 opacity-40'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
