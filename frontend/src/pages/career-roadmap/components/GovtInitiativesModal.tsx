import React from 'react';
import { motion } from 'framer-motion';
import { govtInitiatives } from '../data/govtInitiatives';
import { DataTerminal } from './DataTerminal';

interface GovtInitiativesModalProps {
  onClose: () => void;
}

export const GovtInitiativesModal: React.FC<GovtInitiativesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matte-obsidian/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[70vh]"
      >
        <DataTerminal 
          title="GOVERNMENT STRATEGIC INIATIVES"
          subtitle="ISM & MeitY Funding Pipelines"
          className="h-full"
        >
          <div className="p-6 grid grid-cols-1 gap-6">
            {govtInitiatives.map((scheme, i) => (
              <div 
                key={i}
                className="p-6 border border-ghost-trace bg-matte-obsidian/30 relative overflow-hidden"
              >
                {/* Background watermarks */}
                <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-ghost-trace/10 font-bold select-none">
                  {scheme.acronym}
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-mono font-bold text-text-main">{scheme.name}</h3>
                      <span className="px-2 py-0.5 bg-plasma-cyan text-matte-obsidian font-mono text-[9px] font-bold rounded uppercase">
                        {scheme.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Agency</label>
                        <div className="text-text-sub font-mono text-xs">{scheme.org}</div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Budget Outlay</label>
                        <div className="text-plasma-cyan font-mono text-xs">{scheme.budget}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Impact for ECE</label>
                      <p className="text-text-sub font-mono text-sm mt-1">{scheme.forECE}</p>
                    </div>
                  </div>

                  <div className="w-full md:w-64 bg-solder-mask p-4 border border-ghost-trace/50 flex flex-col justify-between">
                    <div>
                      <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">How to Access</label>
                      <p className="text-text-main font-mono text-[11px] mt-2 leading-relaxed">
                        {scheme.howToAccess}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-ghost-trace/30">
                      <div className="flex flex-wrap gap-2">
                        {scheme.eligibility.map((e, idx) => (
                          <span key={idx} className="text-[9px] font-mono text-text-dim border border-ghost-trace px-2 py-0.5 rounded">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 pt-0">
            <button 
              onClick={onClose}
              className="w-full py-4 border border-dashed border-ghost-trace text-text-dim font-mono text-xs uppercase tracking-[0.2em] hover:text-plasma-cyan hover:border-plasma-cyan transition-all"
            >
              Close Intelligence Brief
            </button>
          </div>
        </DataTerminal>
      </motion.div>
    </div>
  );
};
