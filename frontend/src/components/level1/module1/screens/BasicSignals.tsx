import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenProps } from '../types';
import { KnowledgeCard } from '../shared/KnowledgeCard';
import { FlaskConical, Zap, Activity, TrendingUp, Circle, Copy, Snowflake } from 'lucide-react';
import { VeriSlider } from '../../../shared/VeriSlider';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const BasicSignals: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  currentHint 
}) => {
  const [activeType, setActiveType] = useState('unit_step');
  const [compareType, setCompareType] = useState<string | null>(null);
  const [timeFreeze, setTimeFreeze] = useState(0);
  const { focusProps } = useAttentionLock();

  const components = [
    { id: 'unit_step', label: 'Unit Step', icon: TrendingUp, desc: 'Zero to one instantly.' },
    { id: 'impulse', label: 'Impulse', icon: Zap, desc: 'A momentary spike of energy.' },
    { id: 'ramp', label: 'Ramp', icon: Activity, desc: 'Linear build-up over time.' },
    { id: 'parabolic', label: 'Parabolic', icon: Circle, desc: 'Exponential acceleration.' }
  ];

  const getPath = (type: string, offset: number) => {
    const xOff = offset * 2;
    switch (type) {
      case 'unit_step':
        return `M ${0} 160 L ${100 + xOff} 160 L ${100 + xOff} 40 L 400 40`;
      case 'impulse':
        return `M ${0} 160 L ${150 + xOff} 160 L ${150 + xOff} 20 L ${160 + xOff} 160 L 400 160`;
      case 'ramp':
        return `M ${0} 160 L ${100 + xOff} 160 L ${350 + xOff} 20`;
      case 'parabolic':
        return `M ${0} 160 L ${100 + xOff} 160 Q ${250 + xOff} 160 ${380 + xOff} 20`;
      default: return "";
    }
  };

  return (
    <div className="section-content relative flex flex-col items-center !justify-start pt-24 min-h-[110vh] bg-white" {...focusProps}>
       {/* AI Hint Notification */}
       <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-0 z-50 glass-card p-3 border-sky-200 bg-white/90 text-sky-600 text-[10px] uppercase tracking-[0.2em] font-mono shadow-lg"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 space-y-2 text-left w-full px-4">
        <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Builder</h2>
        <h1 className="title-xl italic text-slate-900 font-black tracking-tighter">ATOMIC COMPONENTS.</h1>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-stretch px-4">
        <div className="flex flex-col gap-3">
            {components.map((item) => (
                <VeriButton
                    key={item.id}
                    onClick={() => {
                        if (compareType === item.id) {
                            setCompareType(null);
                        } else if (activeType !== item.id) {
                            setActiveType(item.id);
                        }
                        triggerHaptic?.('light');
                    }}
                    variant={activeType === item.id ? 'signal' : compareType === item.id ? 'logic' : 'secondary'}
                    className={`p-4 h-auto flex flex-col items-start gap-2 relative overflow-hidden transition-all duration-300 ${activeType === item.id ? 'shadow-[0_0_20px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/50' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                >
                    <item.icon size={18} className={activeType === item.id ? 'text-white' : 'text-sky-600'} />
                    <div className="text-left">
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${activeType === item.id ? 'text-white' : 'text-slate-900'}`}>{item.label}</div>
                        <p className={`text-[8px] mt-1 leading-tight font-mono normal-case font-medium ${activeType === item.id ? 'text-white/80' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                </VeriButton>
            ))}
            
            <VeriButton 
                onClick={() => {
                    const nextIndex = (components.findIndex(c => c.id === activeType) + 1) % components.length;
                    setCompareType(components[nextIndex].id);
                    triggerHaptic?.('medium');
                }}
                variant="ghost"
                className="mt-2 py-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200"
            >
                <Copy size={12} className="mr-2" /> {compareType ? 'Comparing Active' : 'Compare Signals'}
            </VeriButton>
        </div>

        <div className="glass-card relative overflow-hidden p-8 flex flex-col min-h-[400px] bg-slate-50/50 border-slate-200 shadow-sm">
            <div className="absolute inset-0 bg-grid-slate-900/[0.03] pointer-events-none"
                style={{ backgroundSize: '40px 40px' }} />
            
            <div className="flex-1 relative flex items-center justify-center">
                <svg className="w-full h-48" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <line x1="0" y1="160" x2="400" y2="160" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="2" strokeDasharray="4 4" />
                    <AnimatePresence mode="wait">
                        <motion.path
                            key={`primary-${activeType}`}
                            d={getPath(activeType, timeFreeze)}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            fill="none"
                            stroke="#0284c7" // sky-600
                            strokeWidth="4"
                            transition={{ duration: 0.8 }}
                        />
                        {compareType && (
                            <motion.path
                                key={`compare-${compareType}`}
                                d={getPath(compareType, timeFreeze)}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                fill="none"
                                stroke="#94a3b8" // slate-400
                                strokeWidth="4"
                                strokeDasharray="8 4"
                                transition={{ duration: 0.8 }}
                            />
                        )}
                    </AnimatePresence>
                </svg>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-3 flex-1 w-full">
                    <Snowflake size={14} className="text-slate-300" />
                    <VeriSlider 
                        label="Time Scrub"
                        min={-50}
                        max={50}
                        value={timeFreeze}
                        onChange={(val) => setTimeFreeze(val)}
                        variant="signal"
                        className="flex-1"
                    />
                </div>
                
                <div className="flex gap-12 font-mono text-[7px] uppercase tracking-widest text-slate-400 font-bold">
                    <span className="text-sky-600/80">Synthesis Lab v1.1 Polished</span>
                    <span>Domain: Time (t)</span>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full max-w-lg mt-12 pb-24 px-4 text-left">
          <KnowledgeCard 
            title="The Dirac Delta & Heaviside Step"
            description="These 'Atomic' signals are the building blocks of System Response analysis."
            details="The Impulse (Dirac Delta) helps engineers find a system's 'Impulse Response'—it's like hitting a bell once to hear how it rings. The Unit Step (Heaviside) shows how a system stabilizes when turned on instantly."
            icon={FlaskConical}
            className="bg-white border-slate-200 shadow-sm"
          />
      </div>
    </div>
  );
};

export default BasicSignals;
