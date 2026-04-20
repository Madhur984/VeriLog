import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { RadialMenu } from '../components/ui/RadialMenu';
import { KineticText } from '../components/ui/KineticText';

import { DiagnosticConsole } from '../components/ui/DiagnosticConsole';
import { HierarchicalGrindTree } from '../components/ui/HierarchicalGrindTree';

const getTourKey = (n: string | null) => `digi_tour_done_${n ?? 'guest'}`;

// ─── BOOT SEQUENCE OVERLAY ───────────────────────────────────────────────────
const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const logData = [
    'INIT_CORE_V7.5',
    'MOUNT_NEURAL_INTERFACE',
    'SYNC_SIP_RESERVES',
    'CALIBRATING_TECTONICS',
    'READY_FOR_ENGAGEMENT'
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < logData.length) {
        setLogs(prev => [...prev, logData[current]]);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="fixed inset-0 z-[200] bg-[#06090f] flex flex-col items-center justify-center font-mono"
    >
      <div className="w-64 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full" />
          <div className="text-cyan-400 text-xs font-black tracking-[0.3em] uppercase">Booting_AXE-OR</div>
        </div>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] text-cyan-400/60 uppercase tracking-widest">{`> ${log}`}</motion.div>
          ))}
        </div>
        <div className="pt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'linear' }} className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        </div>
      </div>
    </motion.div>
  );
};

// ─── GLOBAL NEWS TICKER ──────────────────────────────────────────────────────
const GlobalNewsTicker: React.FC = () => {
    const news = ["VLSI_CORE_UPDATE: 2nm Simulation Nodes active.", "COMMUNITY_ALERT: 'DigitalMind' achieved Master rank.", "SYSTEM_NOTICE: Global latency optimized.", "RISC-V acceleration added to Module 5."];
    return (
        <div className="fixed top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-md border-b border-white/5 z-[60] overflow-hidden flex items-center">
            <div className="flex-shrink-0 px-4 h-full flex items-center border-r border-white/10 bg-cyan-400/5">
                <span className="text-[7px] font-black text-cyan-400 uppercase tracking-[0.4em]">Live_Telemetry</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
                <motion.div initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="flex gap-20 whitespace-nowrap">
                    {news.map((item, i) => (
                        <span key={i} className="text-[8px] font-mono text-white/40 uppercase tracking-[0.15em]">{item} <span className="ml-4 text-cyan-400 opacity-50">///</span></span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// ─── PCB BACKGROUND (THE FLOW EDITION) ─────────────────────────────────────────
const PCBBackground: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#06090f]" />
      
      {/* Ambient Moving Gradient */}
      <motion.div 
        animate={{ 
            background: [
                'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
            ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      {/* Grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-[1px]"
            style={{ 
                width: Math.random() * 4 + 2, 
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
            }}
            animate={{
                y: [0, -100, 0],
                opacity: [0, 0.5, 0],
                scale: [1, 1.5, 1]
            }}
            transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut"
            }}
          />
      ))}
    </div>
);

// ─── PROFILE TACTICAL PANEL ───────────────────────────────────────────────────
const ProfileCard: React.FC<{
  name: string;
  xp: { total: number };
  level: number;
  streak: number;
  gems: number;
  hearts: number;
  badgesCount: number;
  completedCount: number;
}> = ({ name, xp, level, streak, gems, hearts, badgesCount, completedCount }) => {
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = Math.pow(level, 2) * 100;
  const progress = ((xp.total - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: 0.8, type: "spring", stiffness: 50, damping: 20 }}
      className="fixed top-12 right-8 z-50 p-6 rounded-[3rem] w-[320px] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] group"
    >
      <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black bg-gradient-to-br from-cyan-500 to-blue-600 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-black uppercase text-white tracking-widest leading-none">
            <KineticText text={name} />
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
             <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Technician_Level</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
          <div>
              <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">
                  <span>Level_{level}_Sync</span>
                  <span className="text-cyan-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl relative overflow-hidden group">
                  <div className="text-[7px] font-black text-slate-500 uppercase mb-1">Streak</div>
                  <div className="text-sm font-black text-white">{streak} DAYS</div>
                  <div className="mt-1 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]" />
                      <span className="text-[5px] text-amber-400/80 font-black uppercase tracking-widest">Integrity: Stable</span>
                  </div>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl group">
                  <div className="text-[7px] font-black text-slate-500 uppercase mb-1">Health</div>
                  <div className="text-sm font-black text-white">{hearts} UNITS</div>
                  <div className="mt-1 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-400 shadow-[0_0_5px_#f87171]" />
                      <span className="text-[5px] text-red-400/80 font-black uppercase tracking-widest">Status: Nominal</span>
                  </div>
              </div>
          </div>

          {/* ACTIVE MISSION IN PANEL */}
          <div className="bg-cyan-400/5 border border-cyan-400/10 p-4 rounded-2xl mt-4">
              <div className="text-[7px] font-black text-cyan-400 uppercase mb-2 tracking-[0.3em]">Active_Mission</div>
              <div className="text-[10px] font-bold text-white mb-3">LOGIC_GATE_OPTIMIZATION</div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                  <div className="h-full w-2/3 bg-cyan-400" />
              </div>
              <button className="w-full py-2 bg-cyan-400 text-black text-[8px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all">Execute_Node</button>
          </div>

          {/* STORE PREVIEW */}
          <div className="mt-6">
              <div className="flex justify-between text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                  <span>Store_Manifest</span>
                  <span className="text-amber-400">{gems} SIP</span>
              </div>
              <div className="space-y-2">
                  {['BOSS_ARENA', 'MASTER_BADGE'].map(item => (
                      <div key={item} className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 opacity-40 grayscale">
                          <span className="text-[7px] font-bold text-white tracking-widest">{item}</span>
                          <span className="text-[7px] font-mono">1.2k</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const { firstName, checkStreak, xp, level, streak, gems, hearts, badges, skills } = useGamificationStore();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { checkStreak(); }, [checkStreak]);

  const name = firstName ?? 'Madhur';

  return (
    <div className="h-screen flex overflow-hidden font-sans bg-[#06090f]">
      <AnimatePresence>
        {isInitializing && <BootSequence onComplete={() => setIsInitializing(false)} />}
      </AnimatePresence>

      <GlobalNewsTicker />
      <PCBBackground />
      <RadialMenu />
      <ProfileCard name={name} xp={xp} level={level} streak={streak.current} gems={gems} hearts={hearts} badgesCount={badges.length} completedCount={skills.completedIds.length} />

      {/* COMPACT GLOBAL RANKING STRIP */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-black/40 backdrop-blur-md border-t border-white/5 z-50 flex items-center px-10 gap-10">
          <span className="text-[6px] font-black text-white/20 uppercase tracking-[0.3em] whitespace-nowrap">Global_Eng_Link //</span>
          {["Digit_X (14k)", "Flux_M (12k)", "S_God (11k)"].map(u => (
              <span key={u} className="text-[6px] font-mono text-cyan-400/40 uppercase font-black">{u}</span>
          ))}
          <div className="ml-auto text-[6px] font-mono text-cyan-400 animate-pulse">LATENCY: 8ms // SYNC: 14ms</div>
      </div>

      <main ref={scrollRef} className="flex-1 pl-20 pr-[320px] h-screen flex flex-col relative z-10 overflow-hidden">
        <div className="flex-1 flex flex-col items-start px-10 pt-12">
          <div className="flex-shrink-0 w-full mb-8">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-white">Workstation <span className="text-cyan-400">Alpha-7</span></h1>
                <div className="px-2 py-0.5 rounded border border-white/10 text-[8px] font-mono text-white/40">v7.5_STABLE</div>
             </div>
             <div className="mt-1 flex items-center gap-2">
                <div className="w-12 h-px bg-cyan-400/40" />
                <span className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-[0.3em]">Operational_Status: Ready</span>
             </div>
          </div>

          <div className="flex-1 w-full flex gap-12 justify-start items-start overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex-shrink-0 pt-4"
            >
              <DiagnosticConsole onCommandPaletteOpen={() => setCmdOpen(true)} />
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 40 }}
                className="flex-1 h-full relative rounded-[3.5rem] overflow-hidden bg-[#0A0A0B]/60 backdrop-blur-md border border-white/10 p-12"
            >
               <HierarchicalGrindTree />
               
               {/* CONTINUATION ACTIVATOR (Flowy Edition) */}
               <div className="absolute bottom-10 left-12">
                   <motion.button 
                    whileHover={{ scale: 1.05, y: -5 }} 
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    className="group flex flex-col items-start gap-1"
                   >
                       <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.6em] opacity-30 group-hover:opacity-100 transition-opacity">Engage_Focus</span>
                       <div className="px-12 py-5 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-[0_20px_40px_rgba(34,211,238,0.2)] hover:shadow-[0_20px_60px_rgba(34,211,238,0.4)] transition-all">
                           Continue_Mission
                       </div>
                   </motion.button>
               </div>
            </motion.div>
          </div>
        </div>
      </main>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey="guest" />
    </div>
  );
};
