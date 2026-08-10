import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Cpu, BookOpen, Briefcase, CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export interface WorkflowStage {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  sectionId: string;
  description: string;
  badge: string;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 1,
    title: 'Stage 1: Market Intelligence & Pay Bands',
    subtitle: 'Opportunity Discovery',
    icon: Compass,
    sectionId: 'market',
    description: 'Understand 2026 ECE salary tiers, hiring growth across 15+ top semiconductor MNCs, and how BitForBytes compares against traditional learning paths.',
    badge: 'ESTABLISH TARGET'
  },
  {
    id: 2,
    title: 'Stage 2: Core Domain & Die Physics',
    subtitle: 'Track Selection & Fundamentals',
    icon: Cpu,
    sectionId: 'domains',
    description: 'Explore the 6 ECE career domains (VLSI, Embedded, AI/ML, Wireless) and inspect physical 3nm FinFET microchip layers in our Die Physics Explorer.',
    badge: 'SELECT DOMAIN'
  },
  {
    id: 3,
    title: 'Stage 3: 8-Semester Hands-on Execution',
    subtitle: 'Playbooks & Interactive Labs',
    icon: BookOpen,
    sectionId: 'domain-playbooks',
    description: 'Follow semester-by-semester playbooks equipped with NPTEL/MIT open resources and launch BitForBytes browser workstations (No setup required).',
    badge: 'BUILD SKILLS'
  },
  {
    id: 4,
    title: 'Stage 4: Recruiter Portals & ATS Resume',
    subtitle: 'Placement & Job Launch',
    icon: Briefcase,
    sectionId: 'resume-compiler',
    description: 'Compile an ATS-ready semiconductor resume and launch 1-click pre-filtered job searches on Naukri, LinkedIn, and corporate career portals.',
    badge: 'GET HIRED'
  }
];

interface GuidedRoadmapWorkflowProps {
  currentStageId: number;
  onSelectStage: (stageId: number, sectionId: string) => void;
}

export const GuidedRoadmapWorkflow: React.FC<GuidedRoadmapWorkflowProps> = ({
  currentStageId,
  onSelectStage
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-matte-obsidian border-2 border-plasma-cyan/40 p-6 shadow-[0_0_30px_rgba(20,184,166,0.15)] relative overflow-hidden">
        {/* Top Banner Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-ghost-trace">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-plasma-cyan animate-pulse" />
              <span className="font-mono text-xs font-bold text-plasma-cyan uppercase tracking-widest">
                GUIDED 4-STAGE ECE PLACEMENT WORKFLOW
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-text-main mt-1">
              Your Step-by-Step Semiconductor Career Pathway
            </h3>
          </div>

          <span className="font-mono text-xs text-text-dim uppercase bg-bg-base px-3 py-1.5 border border-ghost-trace">
            STAGE {currentStageId} OF 4 ACTIVE
          </span>
        </div>

        {/* Stepper Grid (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {WORKFLOW_STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = currentStageId === stage.id;
            const isCompleted = currentStageId > stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id, stage.sectionId)}
                className={`p-4 border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? 'bg-plasma-cyan/15 border-plasma-cyan shadow-[0_0_20px_rgba(20,184,166,0.25)] text-text-main'
                    : isCompleted
                    ? 'bg-bg-base/80 border-plasma-cyan/40 text-text-sub hover:border-plasma-cyan'
                    : 'bg-bg-base/40 border-ghost-trace/60 text-text-dim hover:border-text-main/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`w-7 h-7 rounded font-mono text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-plasma-cyan text-matte-obsidian'
                        : isCompleted
                        ? 'bg-plasma-cyan/20 text-plasma-cyan border border-plasma-cyan/40'
                        : 'bg-matte-obsidian text-text-dim border border-ghost-trace'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-plasma-cyan" /> : `0${stage.id}`}
                    </span>

                    <span className="font-mono text-[9px] uppercase font-bold text-plasma-cyan tracking-wider">
                      {stage.badge}
                    </span>
                  </div>

                  <h4 className="font-mono text-xs font-bold text-text-main group-hover:text-plasma-cyan transition-colors">
                    {stage.title}
                  </h4>
                  <p className="font-mono text-[10px] text-text-dim mt-1 line-clamp-2">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-ghost-trace/40 flex items-center justify-between font-mono text-[10px] font-bold text-plasma-cyan">
                  <span>{isActive ? 'Current Phase' : 'Jump to Phase'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
