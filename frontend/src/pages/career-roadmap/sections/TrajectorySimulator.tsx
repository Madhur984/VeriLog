import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { SimulatorRightPanel } from '../../../components/SimulatorRightPanel';
import { OutcomeCard } from '../../../components/OutcomeCard';
import { SiliconPersonalityEngine } from '../../../components/SiliconPersonalityEngine';
import { storyTree, StoryNode } from '../data/storyTree';

export const TrajectorySimulator: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<StoryNode[]>([]);
  const [showArchetype, setShowArchetype] = useState(false);

  const currentNode = storyTree.find(n => n.id === currentNodeId) || storyTree[0];
  
  const handleChoice = (nextId: string) => {
    setHistory([...history, currentNode]);
    
    // Archetype reveal at depth 3
    if (history.length === 2) {
      setShowArchetype(true);
    }
    
    setCurrentNodeId(nextId);
  };

  const reset = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setShowArchetype(false);
  };

  // Map history for RightPanel
  const panelHistory = history.map(h => ({ 
    label: h.question || h.role || 'Choice' 
  }));

  // Mock outcomes based on current state
  const mockOutcomes = [
    { id: '1', role: 'VLSI Engineer', probability: currentNodeId.includes('silicon') ? 85 : 15 },
    { id: '2', role: 'DSP Engineer', probability: currentNodeId.includes('signal') ? 70 : 5 },
    { id: '3', role: 'Embedded Systems', probability: 40 },
  ];

  const fullOutcomeData = currentNode.type === 'outcome' ? {
    role: currentNode.role || 'Engineer',
    company: currentNode.company || 'Silicon Valley',
    salary: { year1: 12, year3: 25, year7: 55 },
    tags: ['High Yield', 'R&D Focus', 'Global Impact'],
    requirements: [
      'Mastery of RTL Synthesis',
      'Static Timing Analysis clearance',
      'Advanced Computer Architecture'
    ]
  } : null;

  return (
    <SectionWrapper id="sim" className="bg-observatory-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-stretch min-h-[600px]">
          <div className="flex-1 space-y-8 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {fullOutcomeData ? (
                <OutcomeCard key="outcome" outcome={fullOutcomeData} onReset={reset} />
              ) : (
                <motion.div
                  key={currentNode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.4em]">Simulator Node: {currentNode.id}</div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white leading-[0.9] tracking-tighter">
                      {currentNode.question}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {currentNode.choices?.map((choice) => (
                      <button
                        key={choice.nextId}
                        onClick={() => handleChoice(choice.nextId)}
                        className="p-6 bg-observatory-surface border border-white/5 rounded-2xl text-left hover:border-cyan-400/50 hover:bg-observatory-surface-alt transition-all group flex items-center justify-between"
                      >
                        <div className="pointer-events-none">
                          <div className="text-white font-bold mb-1 tracking-tight">{choice.label}</div>
                          <div className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{choice.description}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-all pointer-events-none">
                          →
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full md:w-[400px] bg-observatory-surface border border-white/5 rounded-2xl overflow-hidden hidden lg:block">
            <SimulatorRightPanel 
              history={panelHistory} 
              outcomes={mockOutcomes} 
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showArchetype && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <SiliconPersonalityEngine 
              choices={history.map(h => h.id)} 
              onComplete={() => setShowArchetype(false)} 
            />
          </div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};
