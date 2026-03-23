import { motion } from 'framer-motion';

interface SidebarProps {
  active: number;
  sections: string[];
  completedScreens: string[];
  scrollTo: (index: number) => void;
  memory?: any;
}

const SECTION_LABELS: Record<string, string> = {
  system_boot: "System Boot",
  signal_feel: "Signal Feel",
  signal_meaning: "Meaning",
  signal_loop: "Loop",
  signal_processing: "Processing",
  real_world_signals: "Real World",
  signal_definition: "Definition",
  signal_parameters: "Parameters",
  signal_types: "Taxonomy",
  basic_signals: "Basic Signals",
  analog_digital: "Analog vs Digital",
  signal_transform: "Manipulation",
  embedded_circuit_lab: "Circuit Lab",
  insight_lock: "Insight Lock",
  signal_assignment: "Assignment",
  final_insight: "Final Insight",
  module_transition: "Transition"
};

export const Sidebar: React.FC<SidebarProps> = ({ 
    active, 
    sections, 
    completedScreens, 
    scrollTo,
    memory 
}) => {
  const signal = memory?.userSignal || { amplitude: 0.5, frequency: 2 };
  if (active < 0) return null;

  return (
    <div className="fixed left-0 top-0 w-[80px] h-screen bg-black/20 border-r border-white/5 flex flex-col items-center py-12 z-50 transition-all duration-500 pointer-events-none">
        {/* Progress Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/5" />
        
        <nav className="flex flex-col gap-4 pointer-events-auto">
            {sections.map((id, i) => {
                const isActive = active === i;
                const isCompleted = completedScreens.includes(id);

                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(i)}
                    className={`
                      relative w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center group
                      ${isActive ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : isCompleted ? 'border-[var(--accent-primary)]/40 text-white/40 mb-2' : 'border-white/5 text-white/10 hover:border-white/20 mb-2'}
                    `}
                  >
                    {/* TOOLTIP / LABEL */}
                    <div className={`
                        absolute left-16 px-4 py-2 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 transition-all duration-300 pointer-events-none whitespace-nowrap
                        ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-2'}
                    `}>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-[3px] text-white">
                            {SECTION_LABELS[id] || id.replace(/_/g, ' ')}
                        </span>
                        {isActive && (
                            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-black border-l border-b border-white/10 rotate-45" />
                        )}
                    </div>

                    {/* MINI WAVE PREVIEW */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-60 transition-opacity overflow-hidden rounded-full">
                        <svg className="w-full h-8 px-1" viewBox="0 0 40 20">
                            <path 
                                d={`M 0 10 ${Array.from({ length: 15 }).map((_, j) => {
                                    const x = (j / 15) * 40;
                                    const y = 10 + Math.sin(x * 0.4 * signal.frequency) * (signal.amplitude * 8);
                                    return `L ${x} ${y}`;
                                }).join(' ')}`}
                                fill="none"
                                stroke={isActive ? "var(--accent-primary)" : "white"}
                                strokeWidth="1"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {isActive ? (
                        <motion.div layoutId="active-nav-dot" className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary)] z-10" />
                    ) : (
                        <div className={`w-1.5 h-1.5 rounded-full z-10 ${isCompleted ? 'bg-[var(--accent-primary)]/40' : 'bg-white/10'}`} />
                    )}
                  </button>
                );
            })}
        </nav>

        {/* System Stats (Compact) */}
        <div className="flex flex-col items-center gap-1 opacity-20 hover:opacity-100 transition-opacity mt-4 py-4 border-t border-white/5">
            <span className="text-[6px] font-mono text-white/40 uppercase">V-CORE</span>
            <span className="text-[8px] font-bold text-[var(--accent-primary)]">{Math.round((active / (sections.length - 1)) * 100)}%</span>
        </div>
    </div>
  );
};
