import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  AlertCircle,
  Link
} from 'lucide-react';
import { ScreenProps } from '../types';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const SignalLoop: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  playSound
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [predictionMode, setPredictionMode] = useState(true);
  const { focusProps, getDimStyle } = useAttentionLock();

  const toggleConnection = () => {
    const nextState = !isConnected;
    setIsConnected(nextState);
    triggerHaptic?.(nextState ? 'success' : 'error');
    playSound?.(nextState ? 'success' : 'break');
  };

  return (
    <div className="section-content flex flex-col items-center justify-center space-y-12 bg-white" {...focusProps}>
      <div className="text-center space-y-4">
          <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">The Return</h2>
          <h1 className="title-xl italic text-slate-900 font-black tracking-tighter">A SIGNAL NEEDS A PATH.</h1>
          <p className="body max-w-lg text-slate-500 mx-auto font-medium">No return, no flow. Complete the sequence to stabilize the link.</p>
      </div>

      <div className="w-full max-w-3xl glass-card p-12 flex flex-col items-center justify-center space-y-12 relative overflow-hidden group border-slate-200 bg-white shadow-lg">
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-100 shadow-2xl"
            >
                <Link className="text-sky-600 w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2 text-slate-800 font-bold">Continuity Check</h3>
                <p className="body text-slate-500 text-[10px] max-w-xs mb-6 font-medium">If the wire snaps, does the energy wait at the edge, or does the world go dark instantly?</p>
                <VeriButton 
                    variant="signal"
                    onClick={() => {
                        setPredictionMode(false);
                        triggerHaptic?.('heavy');
                    }}
                >
                    Test Continuity
                </VeriButton>
            </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex items-center gap-12 relative z-10 w-full justify-between px-12" style={getDimStyle(false)}>
            <div className={`p-8 rounded-3xl border-2 transition-all duration-700 shadow-sm ${isConnected ? 'border-sky-400 bg-sky-50 shadow-[0_0_30px_rgba(14,165,233,0.1)]' : 'border-slate-100 opacity-50'}`}>
                <Activity className={isConnected ? 'text-sky-600 animate-pulse' : 'text-slate-200'} size={32} />
                <span className={`block mt-4 text-[8px] font-mono uppercase tracking-widest text-center font-bold ${isConnected ? 'text-sky-900' : 'text-slate-300'}`}>Source</span>
            </div>

            <div className="flex-1 h-0.5 relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-100" />
                {isConnected && (
                    <motion.div 
                        animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute h-1 w-8 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                    />
                )}
            </div>

            <div className={`p-8 rounded-3xl border-2 transition-all duration-700 shadow-sm ${isConnected ? 'border-sky-400 bg-sky-50 shadow-[0_0_30px_rgba(14,165,233,0.1)]' : 'border-slate-100 opacity-50'}`}>
                <Zap className={isConnected ? 'text-sky-600 animate-pulse' : 'text-slate-200'} size={32} />
                <span className={`block mt-4 text-[8px] font-mono uppercase tracking-widest text-center font-bold ${isConnected ? 'text-sky-900' : 'text-slate-300'}`}>Receiver</span>
            </div>
          </div>

          <div style={getDimStyle(false)}>
            <VeriButton 
                onClick={toggleConnection}
                variant={isConnected ? 'signal' : 'secondary'}
                className={!isConnected ? 'animate-pulse transition-all shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-50 border-red-100 text-red-600' : ''}
            >
                {isConnected ? 'SIGNAL LOOP VERIFIED' : 'BREAK DETECTED // REPAIR'}
            </VeriButton>
          </div>

          <AnimatePresence>
            {!isConnected && !predictionMode && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-red-500 font-mono text-[8px] uppercase tracking-[0.2em] font-bold"
                >
                    <AlertCircle size={12} /> Potential drop found in return channel.
                </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};

export default SignalLoop;
