import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldAlert } from 'lucide-react';

interface TacticalHUDProps {
  phase: string;
  sip: number;
  status?: string;
  logicValue?: boolean;
}

const TacticalHUD: React.FC<TacticalHUDProps> = ({ phase, sip, status = 'SYSTEM_READY', logicValue = false }) => {
  const [history, setHistory] = React.useState<number[]>(new Array(40).fill(0));

  React.useEffect(() => {
    setHistory(prev => [...prev.slice(1), logicValue ? 1 : 0]);
  }, [logicValue]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] font-mono overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/20" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white/20" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-white/20" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/20" />

      {/* Top Bar Telemetry */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-12 px-8 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Cpu size={14} className="text-cyan-400" />
          <span className="text-[10px] tracking-[0.3em] text-white/60">PHASE_{phase}</span>
        </div>
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-[10px] tracking-[0.3em] text-white/60">{status}</span>
        </div>
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-amber-400" />
          <span className="text-[10px] tracking-[0.3em] text-white/60">S.I.P: {sip.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Logic Oscilloscope (Bottom-Right) */}
      <div className="absolute bottom-10 right-32 flex flex-col items-end gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <span className="text-[8px] tracking-widest text-cyan-400/50 uppercase">Oscilloscope_V7</span>
            <div className={`w-1.5 h-1.5 rounded-full ${logicValue ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-white/10'}`} />
        </div>
        <svg width="120" height="30" className="opacity-80">
          <path
            d={history.map((val, i) => `${i === 0 ? 'M' : 'L'}${i * 3},${25 - val * 20}`).join(' ')}
            fill="none"
            stroke={logicValue ? "#22d3ee" : "#444"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Side Alerts */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex flex-col gap-1">
             <div className="w-1 h-3 bg-white/10" />
             <div className={`w-1 h-8 ${i === 1 ? 'bg-cyan-500 animate-pulse' : 'bg-white/20'}`} />
             <div className="w-1 h-3 bg-white/10" />
          </div>
        ))}
      </div>

      {/* Industrial Scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.03]" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-20 w-full"
        animate={{ y: ['-100%', '1000%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Bottom Mission Label */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4">
        <div className="bg-cyan-500 w-1 h-10" />
        <div className="flex flex-col">
          <span className="text-[8px] text-cyan-400 font-black tracking-widest">UNIT // DD-M01</span>
          <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Logic Foundations</span>
        </div>
      </div>

      {/* Signal Interference Decors */}
      <div className="absolute bottom-10 right-10 flex gap-2 items-end">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/20"
            animate={{ height: [10, Math.random() * 30 + 10, 10] }}
            transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
          />
        ))}
        <ShieldAlert size={14} className="text-rose-500 ml-4 mb-2 opacity-50" />
      </div>
    </div>
  );
};

export default TacticalHUD;
