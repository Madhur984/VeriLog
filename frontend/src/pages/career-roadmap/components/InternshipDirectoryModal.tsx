import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { internships, Internship } from '../data/internships';
import { DataTerminal } from './DataTerminal';

interface InternshipDirectoryModalProps {
  onClose: () => void;
}

export const InternshipDirectoryModal: React.FC<InternshipDirectoryModalProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<Internship['category'] | 'all'>('all');

  const filtered = filter === 'all' ? internships : internships.filter(i => i.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matte-obsidian/80">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl h-[80vh]"
      >
        <DataTerminal 
          title="GLOBAL INTERNSHIP DIRECTORY"
          subtitle={`${filtered.length} Opportunities Cataloged`}
          className="h-full"
        >
          <div className="flex flex-col h-full">
            {/* Filter Bar */}
            <div className="px-6 py-4 border-b border-ghost-trace flex gap-4 bg-matte-obsidian/30">
              {['all', 'india', 'international', 'research'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`
                    px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest border
                    ${filter === f 
                      ? 'border-plasma-cyan text-plasma-cyan bg-plasma-cyan/10' 
                      : 'border-ghost-trace text-text-dim hover:text-text-sub'
                    }
                  `}
                >
                  {f}
                </button>
              ))}
              <button 
                onClick={onClose}
                className="ml-auto text-text-dim hover:text-text-main font-mono text-[10px] uppercase tracking-widest"
              >
                [ ESC ] CLOSE
              </button>
            </div>

            {/* List */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((item, i) => (
                <div 
                  key={i}
                  className="p-5 border border-ghost-trace bg-matte-obsidian/20 hover:border-plasma-cyan/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-text-main font-mono font-bold uppercase tracking-tight">{item.name}</h4>
                      <p className="text-plasma-cyan font-mono text-[10px] uppercase mt-1">{item.org}</p>
                    </div>
                    <div className="px-2 py-0.5 border border-ghost-trace text-[9px] font-mono text-text-dim rounded uppercase">
                      {item.category}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-text-dim">STIPEND:</span>
                      <span className="text-text-sub">{item.stipend}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-text-dim">DURATION:</span>
                      <span className="text-text-sub">{item.duration}</span>
                    </div>
                  </div>

                  {item.roles && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-ghost-trace/30">
                      {item.roles.map((r, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-plasma-cyan/70 bg-plasma-cyan/5 px-2 py-0.5 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono text-text-dim italic">CONVERSION: {item.conversionRate || 'N/A'}</span>
                    <button className="text-[10px] font-mono text-plasma-cyan underline uppercase tracking-widest">
                      Apply Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DataTerminal>
      </motion.div>
    </div>
  );
};
