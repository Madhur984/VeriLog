import React from 'react';
import { timelineMilestones } from '../data/timeline';
import { DataTerminal } from '../components/DataTerminal';

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-6 max-w-7xl mx-auto space-y-16 scroll-mt-32">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
          UNDERGRADUATE <span className="text-plasma-cyan">TRAJECTORY</span>
        </h2>
        <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
          Career milestones from Year 1 to Senior level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {timelineMilestones.slice(0, 4).map((milestone, i) => (
          <DataTerminal 
            key={i} 
            title={milestone.year} 
            subtitle={milestone.title}
            className="h-[500px]"
          >
            <div className="p-6 flex flex-col h-full">
              <p className="text-text-sub font-mono text-xs leading-relaxed mb-8 italic">
                "{milestone.description}"
              </p>

              <div className="space-y-6 flex-1 overflow-auto pr-2 custom-scrollbar">
                <div>
                  <h4 className="text-[9px] font-mono text-plasma-cyan uppercase tracking-widest mb-3">Core Focus</h4>
                  <ul className="space-y-2">
                    {milestone.core.map((item, idx) => (
                      <li key={idx} className="text-[11px] font-mono text-text-dim flex items-start gap-2">
                        <span className="text-plasma-cyan/50 mt-1">▸</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[9px] font-mono text-accent-orange uppercase tracking-widest mb-3">Exams / Gates</h4>
                  <ul className="space-y-2">
                    {milestone.exams.map((item, idx) => (
                      <li key={idx} className="text-[11px] font-mono text-text-dim flex items-start gap-2">
                        <span className="text-accent-orange/50 mt-1">◈</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[9px] font-mono text-text-main uppercase tracking-widest mb-3">Artifacts</h4>
                  <ul className="space-y-2">
                    {milestone.projects.map((item, idx) => (
                      <li key={idx} className="text-[11px] font-mono text-text-sub flex items-start gap-2">
                        <span className="text-text-dim mt-1">●</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-ghost-trace/30">
                <div className="text-[9px] font-mono text-plasma-cyan uppercase mb-2">Phase Milestone</div>
                <div className="text-[10px] font-mono text-text-main leading-snug">
                  {milestone.milestone}
                </div>
              </div>
            </div>
          </DataTerminal>
        ))}
      </div>

      <div className="p-8 border border-ghost-trace bg-solder-mask/30 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-ghost-trace border-t-plasma-cyan animate-spin-slow" />
          <div>
            <h4 className="text-text-main font-mono text-lg uppercase tracking-widest">Alumni Sync Active</h4>
            <p className="text-text-dim font-mono text-[10px] uppercase">Trajectories monitored from 200+ global ECE entities</p>
          </div>
        </div>
        <button className="px-8 py-3 border border-plasma-cyan text-plasma-cyan font-mono text-xs uppercase tracking-widest hover:bg-plasma-cyan hover:text-matte-obsidian transition-all">
          Download Strategic Roadmap [ PDF ]
        </button>
      </div>
    </section>
  );
};
