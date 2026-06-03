import React, { useState, useMemo } from 'react';
import { domains } from '../data/domains';
import { DataTerminal } from '../components/DataTerminal';
import { MasteryBadge } from '../components/MasteryBadge';
import { MasteryQuizModal } from '../components/MasteryQuizModal';
import { SkillGraph } from '../components/SkillGraph';
import { SkillGapSummary } from '../../../components/SkillGapSummary';
import { COMPANY_SKILL_MAP } from '../../../data/companySkillMap';

interface SkillGraphSectionProps {
  unlockedNodes: string[];
  quizScores: Record<string, number>;
  onUnlockNode: (id: string) => void;
  onUpdateScore: (domainId: string, score: number) => void;
}

export const SkillGraphSection: React.FC<SkillGraphSectionProps> = ({
  unlockedNodes,
  quizScores,
  onUnlockNode: _onUnlockNode,
  onUpdateScore
}) => {
  const [activeDomain, setActiveDomain] = useState(domains[0]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  const unlockedNodesSet = useMemo(() => new Set(unlockedNodes), [unlockedNodes]);

  return (
    <section id="skill-graph" className="py-24 px-6 max-w-7xl mx-auto space-y-12 scroll-mt-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
            Skill <span className="text-plasma-cyan">Topology</span>
          </h2>
          <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
            Domain Mastery & Pre-requisite Mapping
          </p>
        </div>
        <div className="flex gap-4">
          {viewMode === 'graph' && (
            <select
              value={selectedCompany || ''}
              onChange={(e) => setSelectedCompany(e.target.value || null)}
              className="bg-matte-obsidian border border-ghost-trace rounded-lg px-4 py-1.5 font-mono text-[10px] uppercase text-text-sub outline-none focus:border-plasma-cyan/50"
            >
              <option value="">Full Topology</option>
              {Object.keys(COMPANY_SKILL_MAP).map(c => (
                <option key={c} value={c}>{c.toUpperCase()} Requirements</option>
              ))}
            </select>
          )}
          <div className="flex p-1 bg-solder-mask border border-ghost-trace rounded-lg">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest rounded transition-all ${viewMode === 'list' ? 'bg-plasma-cyan text-matte-obsidian' : 'text-text-dim hover:text-text-sub'}`}
            >
              Intelligence
            </button>
            <button 
              onClick={() => setViewMode('graph')}
              className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest rounded transition-all ${viewMode === 'graph' ? 'bg-plasma-cyan text-matte-obsidian' : 'text-text-dim hover:text-text-sub'}`}
            >
              Trajectory Graph
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto">
        {viewMode === 'list' ? (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[750px]">
            {/* Domain Explorer Side Panel */}
            <div className="lg:col-span-4 space-y-4 flex flex-col">
              <DataTerminal title="DOMAIN INTELLIGENCE" className="flex-1">
                <div className="divide-y divide-ghost-trace/30">
                  {domains.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => setActiveDomain(domain)}
                      className={`
                        w-full p-6 text-left transition-all relative group
                        ${activeDomain.id === domain.id ? 'bg-plasma-cyan/5' : 'hover:bg-text-main/5'}
                      `}
                    >
                      {activeDomain.id === domain.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-plasma-cyan shadow-cyan-glow" />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-mono text-sm uppercase tracking-wider ${activeDomain.id === domain.id ? 'text-plasma-cyan' : 'text-text-sub'}`}>
                          {domain.name}
                        </h4>
                        <MasteryBadge score={quizScores[domain.id] || 0} size="sm" />
                      </div>
                      <div className="flex gap-3 text-[10px] font-mono text-text-dim uppercase tracking-tighter">
                        <span>{domain.salary}</span>
                        <span>•</span>
                        <span>{domain.growth}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </DataTerminal>

              <button
                onClick={() => setShowQuiz(true)}
                className="w-full py-6 bg-matte-obsidian border border-plasma-cyan/50 text-plasma-cyan font-mono text-sm font-bold uppercase tracking-[0.3em] hover:bg-plasma-cyan hover:text-matte-obsidian transition-all group"
              >
                Run Mastery Calibration
                <span className="block text-[9px] font-normal opacity-70 group-hover:opacity-100">Unlock {activeDomain.name} Tier 2 Nodes</span>
              </button>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-8">
              <DataTerminal 
                title={`${activeDomain.name.toUpperCase()} RECON`} 
                subtitle="Strategic Roadmap & Resources"
                className="h-full"
              >
                <div className="p-8 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest">Executive Summary</h3>
                    <p className="text-text-main font-mono text-lg leading-relaxed max-w-2xl">
                      {activeDomain.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest">Roadmap Sequence</h3>
                      <div className="space-y-4">
                        {activeDomain.roadmap.map((step, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-6 h-6 border border-ghost-trace flex items-center justify-center font-mono text-[10px] text-text-dim">
                              0{i+1}
                            </div>
                            <span className="text-text-sub font-mono text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest">Arsenal / Resources</h3>
                      <div className="space-y-3">
                        {activeDomain.resources.map((res, i) => (
                          <a 
                            key={i} 
                            href={res.url} 
                            className="flex items-center justify-between p-3 border border-ghost-trace/50 hover:border-plasma-cyan/50 group transition-all"
                          >
                            <span className="text-text-dim font-mono text-xs group-hover:text-text-main">{res.name}</span>
                            <span className="text-plasma-cyan font-mono text-[9px]">[ LINK ]</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-ghost-trace/30">
                    <h3 className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest mb-6">Core Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDomain.skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-solder-mask border border-ghost-trace text-text-sub font-mono text-xs uppercase tracking-wider">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </DataTerminal>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12 space-y-8">
            <SkillGraph 
              selectedCompany={selectedCompany}
              masteredNodes={unlockedNodesSet}
            />
            {selectedCompany && (
              <SkillGapSummary 
                company={selectedCompany}
                masteredNodes={unlockedNodesSet}
              />
            )}
          </div>
        )}
      </div>

      {showQuiz && (
        <MasteryQuizModal
          domainId={activeDomain.id}
          onClose={() => setShowQuiz(false)}
          onComplete={(score) => {
            onUpdateScore(activeDomain.id, score);
            setShowQuiz(false);
          }}
        />
      )}
    </section>
  );
};
