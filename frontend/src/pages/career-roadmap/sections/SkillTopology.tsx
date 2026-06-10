import React, { useState, useMemo } from 'react';
import { SkillGraph } from '../components/SkillGraph';
import { SkillGapSummary } from '../../../components/SkillGapSummary';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { Search } from 'lucide-react';

interface SkillTopologyProps {
  selectedCompany?: string | null;
  setSelectedCompany?: (company: string | null) => void;
  unlockedNodes?: string[];
  onUnlockNode?: (nodeId: string) => void;
}

export const SkillTopology: React.FC<SkillTopologyProps> = ({
  selectedCompany: propSelectedCompany,
  setSelectedCompany: propSetSelectedCompany,
  unlockedNodes,
  onUnlockNode,
}) => {
  const [localSelectedCompany, setLocalSelectedCompany] = useState<string | null>(null);
  const selectedCompany = propSelectedCompany !== undefined ? propSelectedCompany : localSelectedCompany;
  const setSelectedCompany = propSetSelectedCompany ?? setLocalSelectedCompany;
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');

  const masteredNodes = useMemo(() => {
    if (unlockedNodes) {
      const set = new Set<string>();
      unlockedNodes.forEach(node => {
        const id = node.toLowerCase().trim();
        if (id === 'digital-foundation') set.add('digital-logic');
        else if (id === 'verilog-hdl') set.add('verilog');
        else set.add(id);
      });
      return set;
    }
    return new Set(['digital-logic', 'verilog', 'computer-arch']); // Fallback
  }, [unlockedNodes]);

  return (
    <SectionWrapper id="skill-graph" className="bg-observatory-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight">SKILL TOPOLOGY</h2>
            <p className="text-text-sub font-mono text-xs uppercase tracking-widest max-w-xl">
              Analyzing the interconnected prerequisites of the modern silicon stack. 
              Switch to Target Company mode to reveal neural skill gaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="flex items-center bg-observatory-surface border border-border-soft rounded-full px-4 py-2 flex-1 md:flex-none">
              <Search size={14} className="text-text-dim mr-3 shrink-0" />
              <label htmlFor="topology-search" className="sr-only">Search topology nodes</label>
              <input
                id="topology-search"
                type="text"
                placeholder="SEARCH NODE..."
                className="bg-transparent border-none outline-none text-[11px] font-mono text-text-main placeholder-text-dim w-full md:w-48 min-w-0"
              />
            </div>
            <div className="flex gap-1 p-1 bg-observatory-surface border border-border-soft rounded-full shrink-0">
              {['2D', '3D'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as '2D' | '3D')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-signal-core text-bg-void' : 'text-text-dim hover:text-text-main'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Company Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest flex items-center mr-4">
            Target Company Mode:
          </div>
          {['nvidia', 'qualcomm', 'intel', 'isro', 'samsung-semi', 'texas-instruments'].map(company => (
            <button
              key={company}
              onClick={() => setSelectedCompany(selectedCompany === company ? null : company)}
              className={`
                px-4 py-2 rounded-full border text-[10px] font-mono uppercase tracking-widest transition-all
                ${selectedCompany === company 
                  ? 'bg-amber-400 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-observatory-surface border-border-soft text-text-dim hover:border-border-soft/80 hover:text-text-sub'
                }
              `}
            >
              {company}
            </button>
          ))}
          {selectedCompany && (
            <button 
              onClick={() => setSelectedCompany(null)}
              className="text-[10px] font-mono text-red-400 underline uppercase tracking-widest ml-4"
            >
              Clear Mode
            </button>
          )}
        </div>

        {/* The Graph Container */}
        <div className="relative group">
          <SkillGraph 
            selectedCompany={selectedCompany} 
            masteredNodes={masteredNodes}
            onNodeClick={onUnlockNode}
            viewMode={viewMode}
          />
        </div>

        {/* Neural Skill Gap Analysis */}
        {selectedCompany && (
          <SkillGapSummary 
            company={selectedCompany} 
            masteredNodes={masteredNodes}
          />
        )}
      </div>
    </SectionWrapper>
  );
};
