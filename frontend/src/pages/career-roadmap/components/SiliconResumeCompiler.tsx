import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, Award, Cpu, Sparkles, Download, ExternalLink, ArrowRight, RefreshCw } from 'lucide-react';
import { DOMAIN_PLAYBOOKS } from '../data/domainRoadmaps';

export interface ResumeProfile {
  domainId: string;
  semester: number;
  completedLabs: string[];
  cgpaRange: string;
  targetCompany: string;
}

export const LAB_OPTIONS = [
  { id: 'verilog-playground', label: 'Verilog RTL Playground (FSMs, Combinational Logic)' },
  { id: 'logic-studio', label: 'Logic Studio (Transistors, Gates, Circuit Minimization)' },
  { id: 'kmap-lab', label: 'K-Map Minimizer & Boolean Optimization' },
  { id: 'workbench', label: 'RISC-V CPU Architecture Simulator' },
  { id: 'interview-prep', label: 'VLSI Setup/Hold & Timing Analysis Drills' },
  { id: 'ai-lab', label: 'Edge AI & NPU Accelerator Modeling' },
];

export const SiliconResumeCompiler: React.FC = () => {
  const [profile, setProfile] = useState<ResumeProfile>({
    domainId: 'vlsi',
    semester: 6,
    completedLabs: ['verilog-playground', 'logic-studio', 'kmap-lab', 'workbench'],
    cgpaRange: '8.0 - 9.0',
    targetCompany: 'NVIDIA',
  });

  const [copied, setCopied] = useState<boolean>(false);

  const activePlaybook = DOMAIN_PLAYBOOKS[profile.domainId] || DOMAIN_PLAYBOOKS.vlsi;

  // Calculate dynamic ATS Score
  const labScore = (profile.completedLabs.length / LAB_OPTIONS.length) * 50;
  const semesterScore = Math.min((profile.semester / 8) * 30, 30);
  const cgpaScore = profile.cgpaRange.includes('8.0') || profile.cgpaRange.includes('9.0') ? 20 : 10;
  const atsScore = Math.round(labScore + semesterScore + cgpaScore);

  // Dynamic ATS Bullet Points
  const generateResumeBullets = () => {
    const bullets: string[] = [];

    if (profile.domainId === 'vlsi') {
      bullets.push(`• Designed and synthesized parameterized Verilog HDL modules (FSMs, UART, AXI-Lite) using Cadence/Synopsys EDA flows.`);
      bullets.push(`• Modeled a 5-stage pipelined RISC-V RV32I CPU core with hazard detection, branch prediction, and forwarding units.`);
      bullets.push(`• Conducted Static Timing Analysis (STA) on 5nm process node standard cell libraries, resolving setup/hold time violations.`);
      bullets.push(`• Completed 4+ hands-on chip design workstations on BitForBytes Platform with 100% verified testbench coverage.`);
    } else if (profile.domainId === 'embedded') {
      bullets.push(`• Developed bare-metal C firmware for STM32 Microcontrollers (ARM Cortex-M4) utilizing FreeRTOS tasks, mutexes, and queues.`);
      bullets.push(`• Implemented CAN-bus and SPI communication drivers for automotive sensor telemetry in alignment with AUTOSAR standards.`);
      bullets.push(`• Built custom Linux kernel device drivers for GPIO/I2C peripherals on Raspberry Pi / Embedded Linux platforms.`);
    } else if (profile.domainId === 'aiml') {
      bullets.push(`• Optimized PyTorch CNN/Transformer models via INT8 quantization and TensorRT for deployment on NVIDIA Jetson Edge devices.`);
      bullets.push(`• Designed a hardware-accelerated Matrix Multiplication (GEMM) systolic array in Verilog for TPU/NPU workloads.`);
    } else {
      bullets.push(`• Architected robust digital signals processing (DSP) pipelines using MATLAB and GNU Radio for 5G SDR transceivers.`);
      bullets.push(`• Implemented FIR/IIR filtering algorithms and FFT acceleration in C++ with low latency constraint validation.`);
    }

    return bullets;
  };

  const bullets = generateResumeBullets();

  const handleCopyBullets = () => {
    const textToCopy = bullets.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="resume-compiler" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <div className="text-center space-y-3 mb-12">
        <span className="font-mono text-[10px] text-plasma-cyan uppercase tracking-[0.25em] font-bold block">
          AUTOMATED CAREER COMPILER
        </span>
        <h2 className="text-3xl sm:text-5xl font-mono font-bold text-text-main tracking-tight uppercase">
          Silicon <span className="text-plasma-cyan">Resume</span> & ATS Scorecard
        </h2>
        <p className="text-text-sub text-sm max-w-3xl mx-auto font-mono leading-relaxed">
          Configure your academic semester, target semiconductor domain, and completed BitForBytes workstations to generate a recruiter-grade ATS resume block with instant bullet points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Controls Box */}
        <div className="lg:col-span-5 bg-bg-base border-2 border-edge shadow-brutal p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-ghost-trace">
            <Cpu className="w-5 h-5 text-plasma-cyan" />
            <h3 className="font-mono font-bold text-base text-text-main uppercase">
              Student Configuration
            </h3>
          </div>

          {/* Target Domain Selector */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-text-dim uppercase tracking-wider block">Target ECE Domain</label>
            <select
              value={profile.domainId}
              onChange={(e) => setProfile({ ...profile, domainId: e.target.value })}
              className="w-full p-3 bg-matte-obsidian border border-ghost-trace text-text-main font-mono text-xs focus:border-plasma-cyan outline-none"
            >
              {Object.values(DOMAIN_PLAYBOOKS).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Current Academic Semester */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-text-dim uppercase tracking-wider block">Academic Semester (Sem {profile.semester})</label>
            <input
              type="range"
              min="1"
              max="8"
              value={profile.semester}
              onChange={(e) => setProfile({ ...profile, semester: parseInt(e.target.value) })}
              className="w-full accent-plasma-cyan cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-text-dim">
              <span>Sem 1 (1st Yr)</span>
              <span>Sem 4 (2nd Yr)</span>
              <span>Sem 8 (4th Yr)</span>
            </div>
          </div>

          {/* Target Corporation */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-text-dim uppercase tracking-wider block">Target Semiconductor Employer</label>
            <select
              value={profile.targetCompany}
              onChange={(e) => setProfile({ ...profile, targetCompany: e.target.value })}
              className="w-full p-3 bg-matte-obsidian border border-ghost-trace text-text-main font-mono text-xs focus:border-plasma-cyan outline-none"
            >
              <option value="NVIDIA">NVIDIA (GPU / AI Accelerators)</option>
              <option value="Intel">Intel Corporation (x86 / Process Tech)</option>
              <option value="Qualcomm">Qualcomm (Snapdragon / 5G Modem)</option>
              <option value="AMD">AMD (Zen Core / RDNA Architecture)</option>
              <option value="Texas Instruments">Texas Instruments (Analog & Embedded)</option>
              <option value="Synopsys">Synopsys (EDA & Physical Design)</option>
            </select>
          </div>

          {/* BitForBytes Workstations Completed */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-text-dim uppercase tracking-wider block">Completed BitForBytes Workstations</label>
            <div className="space-y-2">
              {LAB_OPTIONS.map((lab) => {
                const checked = profile.completedLabs.includes(lab.id);
                return (
                  <label key={lab.id} className="flex items-start gap-2.5 p-2 bg-matte-obsidian/40 border border-ghost-trace/40 cursor-pointer hover:border-plasma-cyan/40">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfile({ ...profile, completedLabs: [...profile.completedLabs, lab.id] });
                        } else {
                          setProfile({ ...profile, completedLabs: profile.completedLabs.filter((id) => id !== lab.id) });
                        }
                      }}
                      className="mt-0.5 accent-plasma-cyan cursor-pointer"
                    />
                    <span className="font-mono text-xs text-text-sub select-none">{lab.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* ATS Scorecard & Resume Output Box */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live ATS Scorecard Banner */}
          <div className="bg-bg-base border-2 border-edge shadow-brutal p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <span className="font-mono text-xs font-bold text-plasma-cyan uppercase tracking-widest block">
                ATS RECRUITMENT MATCH SCORE
              </span>
              <h3 className="text-3xl font-mono font-bold text-text-main mt-1">
                {atsScore}% <span className="text-xs text-text-dim font-normal">Match for {profile.targetCompany}</span>
              </h3>
              <p className="text-xs font-mono text-text-sub mt-1">
                {atsScore >= 80 ? '🔥 Exceptional candidate profile for core technical shortlisting!' : '⚡ Complete 2 more workstations to unlock 85%+ recruiter visibility.'}
              </p>
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-plasma-cyan bg-matte-obsidian flex flex-col items-center justify-center shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.25)]">
              <span className="font-mono text-2xl font-bold text-plasma-cyan">{atsScore}</span>
              <span className="font-mono text-[9px] text-text-dim uppercase">/ 100 PTS</span>
            </div>
          </div>

          {/* Resume Bullet Points Output Container */}
          <div className="bg-bg-base border-2 border-edge shadow-brutal p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-ghost-trace">
              <div>
                <span className="font-mono text-[10px] text-accent-orange uppercase font-bold tracking-widest block">
                  ATS RESUME PROJECT BULLET POINTS
                </span>
                <h4 className="font-mono font-bold text-lg text-text-main mt-0.5">
                  Copy-Ready Bullet Points ({profile.targetCompany})
                </h4>
              </div>

              <button
                onClick={handleCopyBullets}
                className="px-4 py-2 bg-plasma-cyan text-matte-obsidian font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-brutal hover:bg-plasma-cyan/90 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-matte-obsidian" /> : <Copy className="w-4 h-4 text-matte-obsidian" />}
                <span>{copied ? 'Copied!' : 'Copy to Resume'}</span>
              </button>
            </div>

            <div className="space-y-3 bg-matte-obsidian p-4 border border-ghost-trace font-mono text-xs text-text-sub leading-relaxed">
              {bullets.map((bullet, idx) => (
                <div key={idx} className="p-2.5 bg-bg-base/60 border border-ghost-trace/40 text-text-main flex items-start gap-2.5">
                  <span className="text-plasma-cyan font-bold select-none">•</span>
                  <span>{bullet.substring(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-text-dim">
              <span className="flex items-center gap-1.5 text-plasma-cyan">
                <Sparkles className="w-4 h-4" />
                Optimized for Workday, Taleo, & Greenhouse ATS Crawlers
              </span>

              <span className="text-text-sub">
                Target Role: <strong className="text-text-main">{activePlaybook.title.split(' Roadmap')[0]} Engineer</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
