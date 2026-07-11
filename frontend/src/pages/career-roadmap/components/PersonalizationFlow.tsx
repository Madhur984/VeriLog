import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, GraduationCap, ArrowRight, RotateCcw, Target, Sparkles } from 'lucide-react';
import { sfx } from '../utils/sfx';

interface PersonalizationFlowProps {
  onSelectPrefs: (prefs: { stage: string; domain: string }) => void;
  currentPrefs: { stage: string; domain: string } | null;
}

export const PersonalizationFlow: React.FC<PersonalizationFlowProps> = ({ onSelectPrefs, currentPrefs }) => {
  const [stage, setStage] = useState<string | null>(currentPrefs?.stage || null);
  const [domain, setDomain] = useState<string | null>(currentPrefs?.domain || null);

  const stages = [
    { id: 'foundation', label: '1st / 2nd Year', desc: 'Foundations & Digital Logic', icon: GraduationCap, color: 'text-teal-400 border-teal-500/30' },
    { id: 'specializing', label: '3rd Year', desc: 'Core Specializing & Internships', icon: Cpu, color: 'text-cyan-400 border-cyan-500/30' },
    { id: 'placement', label: '4th Year', desc: 'Placements & Core Jobs', icon: Target, color: 'text-orange-400 border-orange-500/30' },
    { id: 'pivot', label: 'Graduate / Alumni', desc: 'Pivot to Core ECE', icon: Sparkles, color: 'text-amber-400 border-amber-500/30' },
  ];

  const domainsList = [
    { id: 'vlsi', label: 'Digital Design & RTL', desc: 'Verilog, FSMs, Microarch', color: 'border-teal-500/20 text-teal-400' },
    { id: 'dv', label: 'Verification (UVM/DV)', desc: 'SystemVerilog, UVM, Testbenches', color: 'border-cyan-500/20 text-cyan-400' },
    { id: 'pd', label: 'Physical Design & STA', desc: 'Timing Analysis, Synthesis, Layout', color: 'border-emerald-500/20 text-emerald-400' },
    { id: 'embedded', label: 'Embedded & IoT', desc: 'Firmware, MCUs, RTOS, C', color: 'border-amber-500/20 text-amber-400' },
    { id: 'eda', label: 'Software / EDA Tools', desc: 'CAD Algorithms, Scripting, Tcl', color: 'border-orange-500/20 text-orange-400' },
  ];

  const handleSelectStage = (id: string) => {
    sfx.playClick();
    setStage(id);
    if (domain) {
      onSelectPrefs({ stage: id, domain });
    }
  };

  const handleSelectDomain = (id: string) => {
    sfx.playClick();
    setDomain(id);
    if (stage) {
      onSelectPrefs({ stage, domain: id });
    }
  };

  const handleReset = () => {
    sfx.playClick();
    setStage(null);
    setDomain(null);
    onSelectPrefs({ stage: '', domain: '' });
  };

  const activeDomainLabel = domainsList.find(d => d.id === domain)?.label;
  const activeStageLabel = stages.find(s => s.id === stage)?.label;

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 mb-10 bg-bg-elev border-2 border-edge shadow-brutal transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-soft/60 pb-4 mb-6 gap-4">
        <div>
          <span className="font-mono text-[10px] text-signal-core uppercase tracking-widest font-black block">
            SIGNAL PATHWAY CALIBRATION
          </span>
          <h3 className="text-xl font-bold text-text-main uppercase font-sans mt-0.5">
            Calibrate Your Custom Roadmap
          </h3>
        </div>
        {(stage || domain) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-mono text-text-dim hover:text-signal-core transition-colors"
          >
            <RotateCcw size={12} /> Clear Calibration
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Step 1: Stage Select */}
        <div>
          <label className="text-[11px] font-mono text-text-dim block mb-3 uppercase tracking-wider">
            STEP 01: Academic Year Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((s) => {
              const Icon = s.icon;
              const isSelected = stage === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStage(s.id)}
                  className={`p-4 border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-text-main text-bg-base border-edge shadow-brutal-sm scale-[1.02]'
                      : 'bg-bg-base text-text-sub border-border-soft hover:border-edge'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <Icon size={18} className={isSelected ? 'text-bg-base' : s.color.split(' ')[0]} />
                    {isSelected && (
                      <span className="text-[9px] font-mono font-bold bg-signal-core text-white px-1 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="font-bold text-sm leading-tight">{s.label}</div>
                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-bg-base/70' : 'text-text-dim'} font-mono`}>
                      {s.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Domain Select */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-[11px] font-mono text-text-dim block uppercase tracking-wider">
              STEP 02: Target Silicon Domain
            </label>
            {!stage && (
              <span className="text-[9px] font-mono text-signal-core animate-pulse">
                * Select academic year first
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {domainsList.map((d) => {
              const isSelected = domain === d.id;
              const disabled = !stage;
              return (
                <button
                  key={d.id}
                  disabled={disabled}
                  onClick={() => handleSelectDomain(d.id)}
                  className={`p-4 border-2 text-left transition-all flex flex-col justify-between ${
                    disabled
                      ? 'opacity-40 cursor-not-allowed border-border-soft/30'
                      : isSelected
                      ? 'bg-text-main text-bg-base border-edge shadow-brutal-sm scale-[1.02]'
                      : 'bg-bg-base text-text-sub border-border-soft hover:border-edge'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs leading-snug">{d.label}</div>
                    <div className={`text-[9px] mt-1.5 leading-relaxed font-mono ${isSelected ? 'text-bg-base/70' : 'text-text-dim'}`}>
                      {d.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center justify-end w-full">
                      <ArrowRight size={12} className="text-bg-base" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {stage && domain && (
        <div className="mt-6 p-4 bg-signal-core/5 border border-signal-core/20 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-text-sub leading-normal text-center sm:text-left">
            Calibration successfully compiled: <span className="text-text-main font-bold font-mono">{activeStageLabel}</span> specializing in <span className="text-teal-400 font-bold font-mono">{activeDomainLabel}</span>.
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-signal-core animate-pulse self-center" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-signal-core">LOCKED IN</span>
          </div>
        </div>
      )}
    </div>
  );
};
