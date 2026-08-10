import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { simplify } from '../lib/solver/mintermSimplifier';
import { Target, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const PracticeModePanel: React.FC = () => {
  const { numVars, minterms, dontCares, solType } = useStore();
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });

  const optimalSolution = simplify(minterms, dontCares, numVars, solType);

  const toggleCell = (idx: number) => {
    setSelectedCells(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
    setFeedback({ status: 'idle', message: '' });
  };

  const handleVerifyGroup = () => {
    if (selectedCells.length === 0) {
      setFeedback({ status: 'incorrect', message: 'Select minterm cells to form a group first!' });
      return;
    }

    // Check if the selectedCells match any of the optimal groups
    const matchingGroup = optimalSolution.groups.find(g => {
      const gMinterms = g.minterms.sort();
      const sMinterms = [...selectedCells].sort();
      return gMinterms.length === sMinterms.length && gMinterms.every((val, index) => val === sMinterms[index]);
    });

    if (matchingGroup) {
      setFeedback({
        status: 'correct',
        message: `Great job! Your selection forms a valid optimal prime implicant group (${matchingGroup.binary})!`
      });
    } else {
      setFeedback({
        status: 'incorrect',
        message: 'This group selection is not an optimal prime implicant. Ensure group size is a power of 2 (1, 2, 4, 8) and rectangular/wrap-around adjacent!'
      });
    }
  };

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Target size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-text-main tracking-tight">Practice & Manual Grouping Mode</h3>
              <InfoTooltip
                title="Interactive Practice Mode"
                description="Test your K-map skills! Manually select minterm cells to construct prime implicant loops, then click verify to check if your grouping matches the optimal Quine-McCluskey solution."
                side="top"
              />
            </div>
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider mt-0.5">
              Practice Loop Selection · Compare Against Quine-McCluskey
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-text-sub font-mono">
          Click minterm cells below to manually construct a grouping loop, then test your answer:
        </p>

        {/* Minterm Chips */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 1 << numVars }).map((_, idx) => {
            const isMinterm = minterms.includes(idx);
            const isSelected = selectedCells.includes(idx);

            return (
              <button
                key={idx}
                onClick={() => toggleCell(idx)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-400 scale-105 shadow-md'
                    : isMinterm
                    ? 'bg-orange-500/15 text-orange-300 border-orange-500/30 hover:bg-orange-500/25'
                    : 'bg-bg-void text-text-dim border-border-soft opacity-50'
                }`}
              >
                m{idx} {isMinterm ? '=1' : '=0'}
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {feedback.status !== 'idle' && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
            feedback.status === 'correct' ? 'bg-green-500/15 border-green-500/30 text-green-300' : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}>
            {feedback.status === 'correct' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setSelectedCells([])}
            className="px-4 py-2 rounded-xl bg-bg-elev hover:bg-hover-bg text-text-dim text-xs font-bold transition-all"
          >
            Clear Selection
          </button>

          <button
            onClick={handleVerifyGroup}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            <CheckCircle2 size={16} />
            <span>Verify Selected Group</span>
          </button>
        </div>
      </div>
    </div>
  );
};
