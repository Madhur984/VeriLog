import React, { useState } from 'react';

type TabId = 'academic' | 'systems' | 'professional';

interface TabItem {
  id: TabId;
  label: string;
  title: string;
  description: string;
  details: string[];
}

const TABS: TabItem[] = [
  {
    id: 'academic',
    label: 'Academic Foundations',
    title: 'Visualise abstract lecture physics.',
    description: 'For students navigating lecture material who require a visual, tactile model to master the physics of digital circuits. Replace manual truth tables with real-time waveform analyzers and gate debuggers.',
    details: [
      'Interactive Boolean algebra solvers',
      'Instant K-Map simplification feedback',
      'Visual logic gate state representations'
    ]
  },
  {
    id: 'systems',
    label: 'Systems Transition',
    title: 'De-abstract computer architecture.',
    description: 'For software engineers looking to break past abstraction layers and understand computer architecture deeply, from register transfer levels down to execution pipelines.',
    details: [
      'Verilog RTL module simulation models',
      'Clock signal propagation diagrams',
      'Register transfer level telemetry analysis'
    ]
  },
  {
    id: 'professional',
    label: 'Professional Expansion',
    title: 'Validate timing constraints.',
    description: 'For junior engineers and VLSI students preparing for core placement benchmarks, timing closure diagnostics, and physical macro floorplanning validation.',
    details: [
      'Propagation delay analysis metrics',
      'Setup and hold margin validation models',
      'Clock skew latency telemetry diagnostics'
    ]
  }
];

export const ForWhoDiagnosticsSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<TabId>('academic');
  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section id="documentation-section" className="w-full bg-[#0B0F19] py-24 border-b border-slate-900" aria-label="Target audience documentation tabs">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-widest block">
            // DOCUMENTATION TARGET PROFILES
          </span>
          <h2 
            className="mt-3 font-bold text-slate-100 tracking-tight leading-[1.1] uppercase"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Engineered for clarity at every level.
          </h2>
        </div>

        {/* Tab Console Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Navigation Stack (4 Columns) */}
          <nav className="md:col-span-4 flex flex-col gap-2 justify-center" aria-label="Documentation profile navigation">
            {TABS.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  aria-label={`Show ${tab.label} details`}
                  className={`w-full text-left p-4 rounded-lg border text-sm font-sans transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#090e1a] border-slate-800 text-[#22D3EE]'
                      : 'bg-transparent border-transparent text-slate-500 hover:text-slate-350 hover:border-slate-900/40'
                  }`}
                >
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Display Panel (8 Columns) */}
          <div className="md:col-span-8">
            <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-8 h-full flex flex-col justify-between shadow-lg">
              
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  ACTIVE_STAGE: {activeTab.id.toUpperCase()}
                </span>
                
                <h3 className="text-xl font-bold text-slate-100 leading-snug">
                  {activeTab.title}
                </h3>
                
                <p className="text-sm text-slate-400 leading-relaxed max-w-[65ch]">
                  {activeTab.description}
                </p>
              </div>

              {/* Bullet points detailing the target profile parameters */}
              <div className="mt-8 pt-6 border-t border-slate-900/60">
                <ul className="space-y-2 text-xs font-mono text-slate-500">
                  {activeTab.details.map((detail, idx) => (
                    <li key={idx} className="flex gap-2.5 items-center">
                      <span className="text-[#10B981] font-bold">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
