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
    <div className="section-content flex flex-col items-center justify-center space-y-12" {...focusProps}>
      <div className="text-center space-y-4">
          <h2 className="text-[var(--accent-primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">The Return</h2>
          <h1 className="title-xl italic">A SIGNAL NEEDS A PATH.</h1>
          <p className="body max-w-lg opacity-60">No return, no flow. Complete the sequence to stabilize the link.</p>
      </div>

      <div className="w-full max-w-3xl glass-card p-12 flex flex-col items-center justify-center space-y-12 relative overflow-hidden group border-white/5">
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[#070B14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
            >
                <Link className="text-[var(--accent-primary)] w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2">Continuity Check</h3>
                <p className="body text-white/50 text-[10px] max-w-xs mb-6">If the wire snaps, does the energy wait at the edge, or does the world go dark instantly?</p>
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
            <div className={`p-8 rounded-3xl border-2 transition-all duration-700 ${isConnected ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 shadow-[0_0_30px_rgba(0,229,255,0.1)]' : 'border-white/5 opacity-50'}`}>
                <Activity className={isConnected ? 'text-[var(--accent-primary)] animate-pulse' : 'text-white/20'} size={32} />
                <span className="block mt-4 text-[8px] font-mono uppercase tracking-widest text-center">Source</span>
            </div>

            <div className="flex-1 h-0.5 relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10" />
                {isConnected && (
                    <motion.div 
                        animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute h-1 w-8 bg-[var(--accent-primary)] rounded-full shadow-[0_0_15px_var(--accent-primary)]"
                    />
                )}
            </div>

            <div className={`p-8 rounded-3xl border-2 transition-all duration-700 ${isConnected ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 shadow-[0_0_30px_rgba(0,229,255,0.1)]' : 'border-white/5 opacity-50'}`}>
                <Zap className={isConnected ? 'text-[var(--accent-primary)] animate-pulse' : 'text-white/20'} size={32} />
                <span className="block mt-4 text-[8px] font-mono uppercase tracking-widest text-center">Receiver</span>
            </div>
          </div>

          <div style={getDimStyle(false)}>
            <VeriButton 
                onClick={toggleConnection}
                variant={isConnected ? 'signal' : 'secondary'}
                className={!isConnected ? 'animate-pulse transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''}
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
                    className="flex items-center gap-3 text-[var(--error)] font-mono text-[8px] uppercase tracking-[0.2em]"
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
