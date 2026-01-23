
import { ScrollText, Lightbulb } from 'lucide-react';

export const MissionLog = () => {
    return (
        <aside className="w-[20%] min-w-[250px] bg-panel border border-panel-border rounded-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-10 border-b border-panel-border flex items-center px-4 bg-void/30">
                <ScrollText size={16} className="text-terminal-green mr-2" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-dim">Mission Log</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <h2 className="text-xl font-bold text-text-main mb-4">Implement an AND Gate</h2>
                <p className="text-text-dim text-sm leading-relaxed mb-6">
                    Captain, we need to secure the airlock. The mechanism requires TWO signals to be active simultaneously to engage the lock.
                </p>

                <div className="p-4 bg-void/50 border border-panel-border rounded mb-6">
                    <h3 className="text-xs font-mono text-signal-blue mb-2 uppercase">Objective</h3>
                    <ul className="list-disc list-inside text-sm text-text-dim space-y-1">
                        <li>Declare module <code className="text-signal-magenta">and_gate</code></li>
                        <li>Assign output <code className="text-signal-cyan">y</code></li>
                        <li>Use bitwise AND operator <code className="text-signal-orange">&</code></li>
                    </ul>
                </div>

                {/* Hint Button */}
                <button className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-text-dim hover:text-terminal-green border border-dashed border-panel-border hover:border-terminal-green rounded transition-all group">
                    <Lightbulb size={16} className="group-hover:text-xp-gold transition-colors" />
                    <span>Request Intel (Hint)</span>
                </button>
            </div>
        </aside>
    );
};
