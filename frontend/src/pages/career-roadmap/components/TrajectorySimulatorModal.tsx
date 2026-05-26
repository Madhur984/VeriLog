import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyTree, StoryChoice } from '../data/storyTree';
import { DataTerminal } from './DataTerminal';

interface TrajectorySimulatorModalProps {
  onClose: () => void;
}

export const TrajectorySimulatorModal: React.FC<TrajectorySimulatorModalProps> = ({ onClose }) => {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const currentNode = storyTree.find(n => n.id === currentNodeId)!;

  const handleOptionClick = (nextId: string) => {
    setCurrentNodeId(nextId);
  };

  const isOutcome = currentNode.type === 'outcome';

  // Fallback mocks for UI fields not present in simple static storyTree
  const mockOutcomeData = {
    role: currentNode.role || 'ASIC Design Specialist',
    package: '18 - 25 LPA',
    assessment: `Path verified for entry level domain integration at ${currentNode.company || 'Silicon Giants'}. Core timing closure competencies required.`,
    lifestyle: ['Hybrid Work Model', 'Subsidized Hardware Lab Access', 'Relocation Package'],
    whatItTakes: [
      'Comprehensive Logic optimization competence',
      'Verilog/SystemVerilog RTL proficiency',
      'FSM Design and Clock Domain CDC verification'
    ],
    year5: 'Lead Architect / Principal Engineer SC'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matte-obsidian/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <DataTerminal 
          title="TRAJECTORY SIMULATOR"
          className="h-[600px]"
        >
          <div className="flex h-full">
            {/* Left Column: Narrative */}
            <div className="flex-1 p-12 border-r border-ghost-trace flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNodeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-mono text-text-main leading-tight tracking-tighter">
                    {isOutcome ? `Outcome: ${currentNode.role} at ${currentNode.company}` : currentNode.question}
                  </h2>
                  
                  {!isOutcome && (
                    <div className="grid grid-cols-1 gap-4 pt-4">
                      {currentNode.choices?.map((opt: StoryChoice, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt.nextId)}
                          className="group flex items-center gap-4 p-5 border border-ghost-trace hover:border-plasma-cyan hover:bg-plasma-cyan/5 transition-all text-left"
                        >
                          <div className="w-8 h-8 rounded-full border border-ghost-trace group-hover:border-plasma-cyan flex items-center justify-center font-mono text-xs text-text-dim group-hover:text-plasma-cyan">
                            {i + 1}
                          </div>
                          <span className="text-text-sub font-mono text-sm group-hover:text-text-main">
                            {opt.label} - <span className="text-text-dim">{opt.description}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isOutcome && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-8 py-6 border-y border-ghost-trace/30">
                        <div>
                          <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Starting Role</label>
                          <div className="text-text-main font-mono mt-1">{mockOutcomeData.role}</div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Entry Package</label>
                          <div className="text-plasma-cyan font-mono mt-1 font-bold">{mockOutcomeData.package}</div>
                        </div>
                      </div>
                      <p className="text-text-sub font-mono text-sm leading-relaxed italic">
                        "{mockOutcomeData.assessment}"
                      </p>
                      <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-white text-matte-obsidian font-mono text-xs font-bold uppercase tracking-widest hover:bg-plasma-cyan transition-colors"
                      >
                        Reset Simulator
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Data Visualization (Only for outcomes) */}
            <div className="w-80 bg-black/30 p-8 flex flex-col">
              {isOutcome ? (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest mb-4">Lifestyle Factors</h4>
                    <div className="space-y-2">
                      {mockOutcomeData.lifestyle.map((tag: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-text-sub">
                          <div className="w-1 h-1 bg-plasma-cyan rounded-full"></div>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest mb-4">Success Requirements</h4>
                    <ul className="space-y-3">
                      {mockOutcomeData.whatItTakes.map((req: string, i: number) => (
                        <li key={i} className="text-[11px] font-mono text-text-dim leading-snug">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-6 border-t border-ghost-trace/30">
                    <div className="text-[10px] font-mono text-text-dim uppercase mb-2">5-Year Target</div>
                    <div className="text-xl font-mono text-text-main">{mockOutcomeData.year5}</div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <div className="w-12 h-12 border-2 border-dashed border-ghost-trace rounded-full animate-spin-slow"></div>
                  <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                    Decision Pending...
                  </div>
                </div>
              )}
            </div>
          </div>
        </DataTerminal>
      </motion.div>
    </div>
  );
};
