import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Thermometer, Zap, Wifi, Eye } from 'lucide-react';
import { ScreenProps } from '../types';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const RealWorldSignals: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  currentHint 
}) => {
  const { getDimStyle, focusProps } = useAttentionLock();
  const [predictionMode, setPredictionMode] = useState(true);

  const items = [
    { title: 'Voice', icon: Mic, desc: 'Acoustic air pressure', color: '#00E5FF' },
    { title: 'Temperature', icon: Thermometer, desc: 'Thermal kinetic energy', color: '#FF7043' },
    { title: 'Voltage', icon: Zap, desc: 'Electric potential flow', color: '#FFD740' },
    { title: 'Wireless', icon: Wifi, desc: 'Electromagnetic field', color: '#7C4DFF' },
  ];

  return (
    <div className="section-content relative overflow-hidden bg-white" {...focusProps}>
       {/* AI Hint Notification */}
       <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 z-50 glass-card p-3 border-sky-200 bg-white/90 text-sky-600 text-[10px] uppercase tracking-[0.2em] font-mono shadow-lg"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 space-y-4 text-left">
        <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Discovery</h2>
        <h1 className="title-xl italic text-slate-900 font-black tracking-tighter">SIGNALS ARE EVERYWHERE.</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full relative">
        <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-200 shadow-2xl"
            >
                <Eye className="text-sky-600 w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2 text-slate-800 font-bold">Pattern Recognition</h3>
                <p className="body text-slate-500 text-[10px] max-w-xs mb-6 font-medium">Does a wireless signal follow the same physical laws as a voice wave? Prepare to bridge the domains.</p>
                <VeriButton 
                    variant="signal"
                    onClick={() => {
                        setPredictionMode(false);
                        triggerHaptic?.('heavy');
                    }}
                >
                    Expand Domains
                </VeriButton>
            </motion.div>
            ) : null}
        </AnimatePresence>

        {items.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={!predictionMode ? { scale: 1.02, backgroundColor: 'rgba(248, 250, 252, 0.8)' } : {}}
            onClick={() => {
              if (predictionMode) return;
              triggerHaptic?.('light');
            }}
            style={getDimStyle(false)}
            className="group relative p-6 glass-card cursor-pointer overflow-hidden border-slate-100 bg-white hover:border-sky-300 shadow-sm transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <item.icon size={64} style={{ color: item.color }} />
            </div>
            
            <div className="flex flex-col gap-4 relative z-10 text-left">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-sky-200 transition-all shadow-sm">
                <item.icon size={20} style={{ color: item.color }} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-1 h-6 items-end opacity-10 group-hover:opacity-60 transition-opacity">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '80%', '20%'] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  className="flex-1 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RealWorldSignals;
