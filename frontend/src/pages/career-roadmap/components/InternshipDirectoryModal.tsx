import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { internships, Internship } from '../data/internships';
import { AccessibleDialog } from './AccessibleDialog';
import { DataTerminal } from './DataTerminal';
import { trackCareerEvent } from '../../../lib/careerAnalytics';

interface InternshipDirectoryModalProps { onClose: () => void; }

export const InternshipDirectoryModal: React.FC<InternshipDirectoryModalProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<Internship['category'] | 'all'>('all');
  const filtered = filter === 'all' ? internships : internships.filter((item) => item.category === filter);

  return (
    <AccessibleDialog onClose={onClose} labelledBy="internship-directory-title" description="Browse internship and research opportunity links.">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl h-[80vh]">
        <h2 id="internship-directory-title" className="sr-only">Global internship directory</h2>
        <DataTerminal title="GLOBAL INTERNSHIP DIRECTORY" subtitle={`${filtered.length} opportunities catalogued`} className="h-full">
          <div className="flex flex-col h-full">
            <div className="px-4 sm:px-6 py-4 border-b border-ghost-trace flex flex-wrap gap-2 sm:gap-4 bg-matte-obsidian/30">
              {(['all', 'india', 'international', 'research'] as const).map((value) => (
                <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`min-h-11 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest border focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma-cyan ${filter === value ? 'border-plasma-cyan text-plasma-cyan bg-plasma-cyan/10' : 'border-ghost-trace text-text-dim hover:text-text-sub'}`}>
                  {value}
                </button>
              ))}
              <button onClick={onClose} className="ml-auto min-h-11 px-2 text-text-dim hover:text-text-main font-mono text-[11px] uppercase tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma-cyan">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((item) => (
                <article key={item.name} className="p-5 border border-ghost-trace bg-matte-obsidian/20 hover:border-plasma-cyan/50 transition-colors">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div><h3 className="text-text-main font-mono font-bold uppercase tracking-tight">{item.name}</h3><p className="text-plasma-cyan font-mono text-[11px] uppercase mt-1">{item.org}</p></div>
                    <span className="px-2 py-0.5 border border-ghost-trace text-[10px] font-mono text-text-dim rounded uppercase">{item.category}</span>
                  </div>
                  <dl className="space-y-2 mb-4 text-[12px] font-mono">
                    <div className="flex justify-between gap-4"><dt className="text-text-dim">Stipend</dt><dd className="text-text-sub text-right">{item.stipend}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-text-dim">Duration</dt><dd className="text-text-sub text-right">{item.duration}</dd></div>
                  </dl>
                  {item.roles && <div className="flex flex-wrap gap-2 pt-3 border-t border-ghost-trace/30">{item.roles.map((role) => <span key={role} className="text-[10px] font-mono text-plasma-cyan/70 bg-plasma-cyan/5 px-2 py-0.5 rounded">{role}</span>)}</div>}
                  <div className="mt-4 pt-4 flex justify-between items-center gap-3 border-t border-ghost-trace/30">
                    <span className="text-[10px] font-mono text-text-dim italic">Conversion: {item.conversionRate || 'Not published'}</span>
                    {item.applicationUrl ? <a href={item.applicationUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackCareerEvent('internship_apply_clicked', { organisation: item.org, category: item.category })} className="inline-flex items-center gap-1 text-[11px] font-mono text-plasma-cyan underline uppercase tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma-cyan">Open official page <ExternalLink size={12} aria-hidden="true" /></a> : <span className="text-[10px] font-mono text-text-dim">Application link unavailable</span>}
                  </div>
                  {item.lastVerified && <p className="mt-2 text-[10px] font-mono text-text-dim">Link checked: {item.lastVerified}</p>}
                </article>
              ))}
            </div>
          </div>
        </DataTerminal>
      </motion.div>
    </AccessibleDialog>
  );
};
