import React from 'react';
import { motion } from 'framer-motion';
import { govtInitiatives } from '../data/govtInitiatives';
import { AccessibleDialog } from './AccessibleDialog';
import { DataTerminal } from './DataTerminal';

interface GovtInitiativesModalProps { onClose: () => void; }

export const GovtInitiativesModal: React.FC<GovtInitiativesModalProps> = ({ onClose }) => (
  <AccessibleDialog onClose={onClose} labelledBy="government-initiatives-title" description="Government initiatives relevant to electronics and semiconductor careers.">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl h-[80vh]">
      <h2 id="government-initiatives-title" className="sr-only">Government strategic initiatives</h2>
      <DataTerminal title="GOVERNMENT STRATEGIC INITIATIVES" subtitle="ISM and MeitY funding pipelines" className="h-full">
        <div className="h-full overflow-y-auto p-4 sm:p-6 grid grid-cols-1 gap-5">
          {govtInitiatives.map((scheme) => (
            <article key={scheme.acronym} className="p-5 sm:p-6 border border-ghost-trace bg-matte-obsidian/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-ghost-trace/10 font-bold select-none" aria-hidden="true">{scheme.acronym}</div>
              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-1 min-w-0 space-y-4"><div className="flex flex-wrap items-center gap-3"><h3 className="text-base sm:text-lg font-mono font-bold text-text-main">{scheme.name}</h3><span className="shrink-0 px-2 py-0.5 bg-plasma-cyan text-matte-obsidian font-mono text-[10px] font-bold rounded uppercase">{scheme.status}</span></div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><dt className="text-[11px] font-mono text-text-dim uppercase tracking-widest">Agency</dt><dd className="text-text-sub font-mono text-sm">{scheme.org}</dd></div><div><dt className="text-[11px] font-mono text-text-dim uppercase tracking-widest">Budget outlay</dt><dd className="text-plasma-cyan font-mono text-sm">{scheme.budget}</dd></div></dl>
                  <div><h4 className="text-[11px] font-mono text-text-dim uppercase tracking-widest">Impact for ECE</h4><p className="text-text-sub text-sm mt-1 leading-relaxed">{scheme.forECE}</p></div>
                </div>
                <aside className="w-full md:w-64 bg-solder-mask p-4 border border-ghost-trace/50"><h4 className="text-[11px] font-mono text-text-dim uppercase tracking-widest">How to access</h4><p className="text-text-main text-sm mt-2 leading-relaxed">{scheme.howToAccess}</p><div className="mt-4 pt-4 border-t border-ghost-trace/30 flex flex-wrap gap-2">{scheme.eligibility.map((eligibility) => <span key={eligibility} className="text-[10px] font-mono text-text-dim border border-ghost-trace px-2 py-0.5 rounded">{eligibility}</span>)}</div></aside>
              </div>
            </article>
          ))}
          <button onClick={onClose} className="min-h-11 w-full py-3 border border-dashed border-ghost-trace text-text-dim font-mono text-xs uppercase tracking-[0.2em] hover:text-plasma-cyan hover:border-plasma-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma-cyan">Close</button>
        </div>
      </DataTerminal>
    </motion.div>
  </AccessibleDialog>
);
