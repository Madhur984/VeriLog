import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAIN_PLAYBOOKS, DomainPlaybook, RoadmapStepData } from '../data/domainRoadmaps';
import { SectionHead } from './RoadmapUI';
import { ExternalLink, Terminal, BookOpen, Cpu, Sparkles, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DomainPlaybookSectionProps {
  initialDomainId?: string;
}

export const DomainPlaybookSection: React.FC<DomainPlaybookSectionProps> = ({
  initialDomainId = 'vlsi'
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(initialDomainId);
  const [activeStep, setActiveStep] = useState<number>(1);
  const navigate = useNavigate();

  const currentPlaybook: DomainPlaybook = DOMAIN_PLAYBOOKS[selectedDomainId] || DOMAIN_PLAYBOOKS.vlsi;

  return (
    <section id="domain-playbooks" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <SectionHead
        kicker="Comprehensive Semester-by-Semester Playbooks"
        title="6 Core ECE & Semiconductor Career Playbooks"
        sub="Semester 1 through Semester 8 step-by-step guides equipped with verified NPTEL/MIT courses, books, open-source repos, direct job portals, and BitForBytes internal workstations."
      />

      {/* Domain Selection Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {Object.values(DOMAIN_PLAYBOOKS).map((playbook) => {
          const isSelected = playbook.id === selectedDomainId;
          return (
            <button
              key={playbook.id}
              onClick={() => {
                setSelectedDomainId(playbook.id);
                setActiveStep(1);
              }}
              className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all border shadow-brutal flex items-center gap-2 ${
                isSelected
                  ? 'bg-plasma-cyan text-matte-obsidian border-plasma-cyan shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'bg-bg-base text-text-sub border-ghost-trace hover:border-plasma-cyan/50 hover:text-text-main'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{playbook.title.split(' Roadmap')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Overview Card */}
      <motion.div
        key={currentPlaybook.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-bg-base border-2 border-edge shadow-brutal p-6 sm:p-8 space-y-6 mb-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-ghost-trace">
          <div>
            <div className="font-mono text-xs text-plasma-cyan uppercase tracking-widest font-bold mb-1">
              {currentPlaybook.tagline}
            </div>
            <h3 className="text-2xl sm:text-3xl font-mono font-bold text-text-main">
              {currentPlaybook.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase font-bold px-3 py-1 bg-accent-orange/10 border border-accent-orange/40 text-accent-orange">
              {currentPlaybook.outlook.toUpperCase()} DEMAND
            </span>
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 bg-matte-obsidian/40 border border-ghost-trace/40">
          <div>
            <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider">Fresher India CTC</div>
            <div className="text-lg font-mono font-bold text-text-main mt-0.5">{currentPlaybook.fresherSalaryIndia}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider">Senior (7+ Yrs) CTC</div>
            <div className="text-lg font-mono font-bold text-plasma-cyan mt-0.5">{currentPlaybook.seniorSalaryIndia}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider">Global Compensation</div>
            <div className="text-lg font-mono font-bold text-accent-orange mt-0.5">{currentPlaybook.fresherSalaryGlobal}</div>
          </div>
        </div>

        {/* Employer Badges */}
        <div>
          <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-2">Primary Recruiters in this Track</div>
          <div className="flex flex-wrap gap-2">
            {currentPlaybook.topEmployers.map((emp) => (
              <span key={emp} className="text-xs font-mono font-semibold px-2.5 py-1 bg-bg-elev border border-ghost-trace text-text-sub">
                {emp}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 7-Step Semester Timeline Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="font-mono text-xs font-bold text-text-dim uppercase tracking-widest mb-3">
            Semester Steps ({currentPlaybook.steps.length} Phases)
          </div>
          {currentPlaybook.steps.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`w-full text-left p-4 border transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-plasma-cyan/10 border-plasma-cyan text-text-main'
                    : 'bg-bg-base border-ghost-trace text-text-dim hover:border-plasma-cyan/40 hover:text-text-sub'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                    isActive ? 'bg-plasma-cyan text-matte-obsidian' : 'bg-matte-obsidian text-text-dim border border-ghost-trace'
                  }`}>
                    {s.step}
                  </span>
                  <div>
                    <div className="font-mono text-[10px] text-plasma-cyan uppercase">{s.semester}</div>
                    <div className="font-mono text-xs font-bold text-text-main line-clamp-1">{s.title}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-plasma-cyan translate-x-1' : 'text-text-dim'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentPlaybook.steps
              .filter((s) => s.step === activeStep)
              .map((s) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-bg-base border-2 border-edge shadow-brutal p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-ghost-trace">
                    <div>
                      <span className="font-mono text-xs text-plasma-cyan font-bold uppercase tracking-widest">
                        Phase {s.step} · {s.semester}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-mono font-bold text-text-main mt-1">
                        {s.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm font-mono text-text-sub leading-relaxed">
                    {s.description}
                  </p>

                  {/* Skills Pills */}
                  <div>
                    <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-2">Key Skills to Master</div>
                    <div className="flex flex-wrap gap-2">
                      {s.skills.map((sk) => (
                        <span key={sk} className="text-xs font-mono font-semibold px-2.5 py-1 bg-plasma-cyan/10 border border-plasma-cyan/30 text-plasma-cyan">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Internal BitForBytes Workstation CTA */}
                  {s.internalLab && (
                    <div className="p-4 bg-gradient-to-r from-plasma-cyan/15 to-transparent border-l-4 border-plasma-cyan border-y border-r border-ghost-trace flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="font-mono text-[9px] uppercase font-bold text-plasma-cyan tracking-widest border border-plasma-cyan/40 px-1.5 py-0.5">
                          {s.internalLab.badge}
                        </span>
                        <h5 className="font-mono font-bold text-sm text-text-main mt-1">
                          Practice directly on BitForBytes {s.internalLab.name}
                        </h5>
                      </div>
                      <button
                        onClick={() => navigate(s.internalLab!.route)}
                        className="px-4 py-2 bg-plasma-cyan text-matte-obsidian font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-brutal hover:bg-plasma-cyan/90 transition-colors"
                      >
                        <span>Launch Workstation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Verified External Learning Resources */}
                  <div className="space-y-3 pt-2">
                    <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
                      Verified Learning & Reference Resources
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {s.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target={res.isInternal ? '_self' : '_blank'}
                          rel={res.isInternal ? '' : 'noopener noreferrer'}
                          onClick={(e) => {
                            if (res.isInternal) {
                              e.preventDefault();
                              navigate(res.url);
                            }
                          }}
                          className={`p-3 border text-left transition-all flex items-start justify-between group ${
                            res.isInternal
                              ? 'bg-plasma-cyan/5 border-plasma-cyan/40 hover:border-plasma-cyan'
                              : 'bg-matte-obsidian/40 border-ghost-trace hover:border-text-main'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] text-text-dim uppercase block">
                              [{res.type.toUpperCase()}]
                            </span>
                            <span className="font-mono text-xs font-bold text-text-main group-hover:text-plasma-cyan transition-colors line-clamp-2">
                              {res.title}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-text-dim group-hover:text-plasma-cyan shrink-0 mt-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
