import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HUDProps {
  signal: {
    amplitude: number;
    frequency: number;
    samplingRate?: number;
    bitDepth?: number;
    noise?: number;
  };
  isDigital?: boolean;
  className?: string;
}

export const LiveMetricsHUD: React.FC<HUDProps> = ({ signal, isDigital, className = "" }) => {
  const nyquist = signal.frequency * 2;
  const isAliasing = isDigital && (signal.samplingRate || 0) < nyquist;
  const precision = isDigital ? Math.pow(2, signal.bitDepth || 8) : Infinity;

  const Metric = ({ label, value, unit, color = "text-white/60", warning = false }: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-[7px] font-mono uppercase tracking-widest text-white/30">{label}</span>
      <div className={`flex items-baseline gap-1 ${warning ? 'text-[var(--error)]' : color}`}>
        <span className="text-xs font-mono font-bold leading-none">{value}</span>
        <span className="text-[7px] font-mono opacity-50">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className={`glass-card p-4 border-none bg-black/40 backdrop-blur-md flex flex-col gap-4 min-w-[140px] ${className}`}>
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-[var(--accent-primary)]" />
          <span className="text-[9px] font-bold uppercase tracking-tighter">Live Monitor</span>
        </div>
        <AnimatePresence>
            {isAliasing ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <AlertTriangle size={12} className="text-[var(--error)]" />
                </motion.div>
            ) : (
                <CheckCircle2 size={12} className="text-[var(--accent-primary)]/40" />
            )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Metric label="Amp" value={(signal?.amplitude ?? 0).toFixed(2)} unit="V" color="text-[var(--accent-primary)]" />
        <Metric label="Freq" value={(signal?.frequency ?? 0).toFixed(1)} unit="Hz" />
        {isDigital && (
             <>
                <Metric label="Rate" value={signal?.samplingRate ?? 0} unit="Fs" warning={isAliasing} />
                <Metric label="Levels" value={precision === Infinity ? '∞' : precision} unit="L" />
             </>
        )}
        <Metric label="Noise" value={(signal?.noise ?? 0).toFixed(2)} unit="%" color="text-[var(--error)]/60" />
      </div>

      {isAliasing && (
          <div className="pt-2 border-t border-[var(--error)]/20">
              <span className="text-[7px] font-mono uppercase text-[var(--error)] animate-pulse">
                Critical Error: Aliasing Active
              </span>
          </div>
      )}
    </div>
  );
};
