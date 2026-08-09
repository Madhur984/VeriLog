import React from 'react';
import { CheckCircle2, Compass, Hammer, Target } from 'lucide-react';

type Preferences = { stage: string; domain: string } | null;

interface NextActionsPlanProps {
  prefs: Preferences;
  completedActionIds: string[];
  onOpenSkills: () => void;
  onOpenPortfolio: () => void;
  onOpenOpportunities: () => void;
  onToggleComplete: (actionId: string) => void;
}

const stageLabel: Record<string, string> = {
  foundation: 'first- or second-year student', specializing: 'third-year student', placement: 'final-year student', pivot: 'graduate or career switcher',
};

const domainLabel: Record<string, string> = {
  vlsi: 'Digital Design & RTL', dv: 'Design Verification', pd: 'Physical Design & STA', embedded: 'Embedded & IoT', eda: 'EDA tools',
};

export const NextActionsPlan: React.FC<NextActionsPlanProps> = ({ prefs, completedActionIds, onOpenSkills, onOpenPortfolio, onOpenOpportunities, onToggleComplete }) => {
  if (!prefs?.stage || !prefs.domain) return null;
  const domain = domainLabel[prefs.domain] || 'your selected domain';
  const stage = stageLabel[prefs.stage] || 'ECE student';
  const actions = [
    { id: `${prefs.stage}-${prefs.domain}-learn`, title: 'Learn the prerequisite', description: `Open the ${domain} skill path and complete one foundation node this week.`, label: 'Open skill path', icon: Compass, onClick: onOpenSkills },
    { id: `${prefs.stage}-${prefs.domain}-build`, title: 'Build proof of work', description: 'Turn the next concept into a small, documented project with a README and test evidence.', label: 'Open portfolio tools', icon: Hammer, onClick: onOpenPortfolio },
    { id: `${prefs.stage}-${prefs.domain}-target`, title: 'Target one opportunity', description: 'Review internships and company requirements, then save one realistic application target.', label: 'Browse opportunities', icon: Target, onClick: onOpenOpportunities },
  ];

  return (
    <section aria-labelledby="next-actions-title" className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-signal-core/5 border-2 border-signal-core/35 shadow-brutal p-5 sm:p-6">
        <div className="flex gap-3 items-start mb-5"><CheckCircle2 className="text-signal-core shrink-0 mt-0.5" size={20} aria-hidden="true" /><div><p className="font-mono text-[11px] text-signal-core uppercase tracking-widest font-bold">Your focused roadmap</p><h2 id="next-actions-title" className="text-xl sm:text-2xl text-text-main font-bold mt-1">Next three actions for a {stage} targeting {domain}</h2></div></div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => { const Icon = action.icon; const complete = completedActionIds.includes(action.id); return <li key={action.id} className="bg-bg-base border border-edge p-4 flex flex-col"><div className="flex items-center gap-2 text-signal-core font-mono text-[11px] uppercase tracking-widest"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={15} aria-hidden="true" /></div><h3 className="text-base font-bold text-text-main mt-4">{action.title}</h3><p className="text-sm text-text-sub leading-relaxed mt-2 flex-1">{action.description}</p><button onClick={action.onClick} className="mt-5 min-h-11 text-left text-[12px] font-mono font-bold text-signal-core hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-core">{action.label} →</button><button onClick={() => onToggleComplete(action.id)} aria-pressed={complete} className="mt-2 min-h-11 text-left text-[11px] font-mono text-text-sub hover:text-text-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-core">{complete ? '✓ Completed on this device' : 'Mark complete'}</button></li>; })}
        </ol>
        <p className="mt-4 text-xs text-text-dim">Progress is saved only on this device. Clear your browser data to remove it.</p>
      </div>
    </section>
  );
};
