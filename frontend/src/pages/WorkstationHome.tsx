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
    'INIT_AXE_OR_OS',
    'MOUNT_NEURAL_BUS',
    'CALIBRATING_FLOW',
    'SYNC_SIP_BANKS',
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
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      className="fixed inset-0 z-[300] bg-[#06090f] flex flex-col items-center justify-center font-mono"
    >
      <div className="w-64 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full" />
          <div className="text-cyan-400 text-xs font-black tracking-[0.3em] uppercase">Engaging_Flow</div>
        </div>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] text-cyan-400/60 uppercase tracking-widest">{`> ${log}`}</motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── ONBOARDING OVERLAY ──────────────────────────────────────────────────────
const OnboardingOverlay: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const steps = [
        { title: "THE COMMAND CENTER", text: "Primary mission controls and engineering telemetry.", style: { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { title: "MODULE ARCHITECTURE", text: "Interactive hierarchy from Signal Theory to Verilog masters.", style: { top: '60%', left: '40%', transform: 'translate(-50%, -50%)' } },
        { title: "RANK & RESERVES", text: "Monitor your SIP banks and streak integrity here.", style: { top: '40%', right: '280px', transform: 'translateY(-50%)' } }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center"
        >
            <motion.div 
                key={step} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-80 p-8 rounded-[2.5rem] bg-[#0A0A0B]/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                style={steps[step-1].style}
            >
                <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">Step_0{step} // Tactical_Guide</span>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">{steps[step-1].title}</h2>
                    <p className="text-[10px] text-white/50 leading-relaxed font-mono">{steps[step-1].text}</p>
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={onComplete} className="text-[9px] font-bold text-white/20 hover:text-white transition-colors uppercase">Skip</button>
                        <button onClick={() => step < 3 ? setStep(step + 1) : onComplete()} className="px-6 py-2 bg-cyan-400 rounded-full text-[9px] font-black text-black uppercase tracking-widest">{step < 3 ? 'Proceed' : 'Finish'}</button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── CIRCUIT FLOW CANVAS ──────────────────────────────────────────────────────
const CircuitFlow: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        let frame: number; let particles: any[] = [];
        const resize = () => {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            particles = Array.from({ length: 15 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.5 + Math.random() * 2, len: 100 + Math.random() * 200, opacity: 0.05 + Math.random() * 0.1 }));
        };
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 0.5;
            particles.forEach(p => {
                ctx.beginPath(); ctx.globalAlpha = p.opacity; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.len); ctx.stroke();
                p.y += p.speed; if (p.y > canvas.height) { p.y = -p.len; p.x = Math.random() * canvas.width; }
            });
            frame = requestAnimationFrame(draw);
        };
        window.addEventListener('resize', resize); resize(); draw();
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-30" />;
};

const PCBBackground: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#06090f]" />
      <motion.div 
        animate={{ background: [ 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)', 'radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.03) 0%, transparent 50%)', 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)' ] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      <CircuitFlow />
    </div>
);

// ─── PROFILE CARD ───────────────────────────────────────────────────────────
const ProfileCard: React.FC<{ name: string; xp: any; level: number; streak: number; gems: number; hearts: number; }> = ({ name, xp, level, streak, gems, hearts }) => {
  const progress = ((xp.total - Math.pow(level-1, 2)*100) / (Math.pow(level, 2)*100 - Math.pow(level-1, 2)*100)) * 100;
  return (
    <motion.div initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ delay: 0.8, type: "spring", stiffness: 40 }}
      className="fixed top-12 right-8 z-50 p-6 rounded-[2.5rem] w-[300px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] group"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"> {name.charAt(0)} </div>
        <div> <h2 className="text-md font-black uppercase text-white tracking-widest"><KineticText text={name} /></h2> <span className="text-[7px] text-cyan-400 uppercase tracking-widest font-black">Operator_Active</span> </div>
      </div>
      <div className="space-y-4">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"> <motion.div animate={{ width: `${progress}%` }} className="h-full bg-cyan-400" /> </div>
          <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-2xl"> <div className="text-[6px] text-white/30 uppercase mb-1">Streak</div> <div className="text-xs font-black text-white">{streak} DAYS</div> </div>
              <div className="bg-white/5 p-3 rounded-2xl"> <div className="text-[6px] text-white/30 uppercase mb-1">Health</div> <div className="text-xs font-black text-white">{hearts} UNIT</div> </div>
          </div>
          <div className="bg-cyan-400/5 p-4 rounded-2xl border border-cyan-400/10">
              <div className="text-[6px] text-cyan-400 font-black uppercase mb-1">Active_Goal</div>
              <div className="text-[9px] font-bold text-white mb-2">LOGIC_MINIMIZATION</div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden"> <div className="h-full w-1/2 bg-cyan-400" /> </div>
          </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const { firstName, checkStreak, xp, level, streak, gems, hearts, badges, skills } = useGamificationStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => { checkStreak(); }, [checkStreak]);
  useEffect(() => { const hR = () => setIsMobile(window.innerWidth < 1024); window.addEventListener('resize', hR); return () => window.removeEventListener('resize', hR); }, []);
  useEffect(() => { if (!isInitializing) { if (!localStorage.getItem('axeor_onboarding_done')) setShowOnboarding(true); } }, [isInitializing]);

  return (
    <div className="h-screen flex overflow-hidden font-sans bg-[#06090f] text-[#cbd5e1] selection:bg-cyan-400 selection:text-black">
      <AnimatePresence> {isInitializing && <BootSequence onComplete={() => setIsInitializing(false)} />} </AnimatePresence>
      <AnimatePresence> {showOnboarding && <OnboardingOverlay onComplete={() => { setShowOnboarding(false); localStorage.setItem('axeor_onboarding_done', 'true'); }} />} </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 h-6 bg-black/40 backdrop-blur-md z-[100] flex items-center px-6 overflow-hidden border-b border-white/5">
          <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="whitespace-nowrap text-[7px] font-mono uppercase tracking-[0.2em] opacity-30">
              SYSTEM_LINK_STABLE // NO_PACKET_LOSS // VLSI_CORE_V7.5_ACTIVE // CLOCK_SYNC_NOMINAL // SESSION_ID_0x{Math.random().toString(16).slice(2, 10).toUpperCase()}
          </motion.div>
      </div>

      <PCBBackground />
      <RadialMenu />
      {!isMobile && <ProfileCard name={firstName || 'Madhur'} xp={xp} level={level} streak={streak.current} gems={gems} hearts={hearts} />}

      <main className={`flex-1 transition-all duration-1000 ${isMobile ? 'px-6' : 'pl-20 pr-[340px]'} h-screen flex flex-col relative z-20 overflow-hidden pt-10`}>
        <div className="flex-1 flex flex-col items-start overflow-hidden pb-12">
          <div className="flex-shrink-0 w-full mb-8 pt-6">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.4em] text-white">Workstation <span className="text-cyan-400">Alpha-7</span></h1>
                <div className="mt-1 flex items-center gap-3">
                   <div className="h-px w-8 bg-cyan-400" />
                   <span className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-[0.4em]">Operational_Interface</span>
                </div>
             </motion.div>
          </div>

          <div className="flex-1 w-full flex flex-col lg:flex-row gap-10 items-start overflow-hidden">
            {!isMobile && (
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex-shrink-0 pt-4">
                <DiagnosticConsole />
              </motion.div>
            )}
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.98, filter: 'blur(20px)' }} 
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
               transition={{ delay: 0.7, type: "spring", stiffness: 30 }}
               className="flex-1 h-full w-full relative rounded-[3rem] overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 p-4 md:p-10"
            >
               <HierarchicalGrindTree />
               <div className="absolute bottom-8 left-10">
                   <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                    className="px-10 py-4 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-[0_15px_30px_rgba(34,211,238,0.2)]"
                   >
                     Continue_Mission
                   </motion.button>
               </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
