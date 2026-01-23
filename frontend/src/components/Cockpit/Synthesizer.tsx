import { useState } from 'react';
import { Code2, Play } from 'lucide-react';

export const Synthesizer = () => {
    const [code, setCode] = useState(`module and_gate(
    input a,
    input b,
    output y
);

    // TODO: Implement logic here
    assign y = a & b;

endmodule`);

    return (
        <section className="flex-1 bg-panel border border-panel-border rounded-lg flex flex-col overflow-hidden relative group">
            {/* Header */}
            <div className="h-10 border-b border-panel-border flex items-center justify-between px-4 bg-void/30">
                <div className="flex items-center">
                    <Code2 size={16} className="text-signal-blue mr-2" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-dim">Synthesizer</span>
                </div>
                <div className="text-xs text-text-dim font-mono">main.v</div>
            </div>

            {/* Editor Area (Mock) */}
            <div className="flex-1 relative font-mono text-sm">
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-void/50 border-r border-panel-border text-right pr-3 pt-4 text-gray-600 select-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-transparent text-text-main p-4 pl-16 resize-none focus:outline-none leading-6 selection:bg-signal-blue/30"
                    spellCheck={false}
                />
            </div>

            {/* Run Button (Floating) */}
            <div className="absolute bottom-6 right-6">
                <button className="flex items-center gap-2 px-6 py-3 bg-terminal-green hover:bg-terminal-green/90 text-void font-bold rounded shadow-neon-green transition-all hover:scale-105 active:scale-95">
                    <Play size={18} fill="currentColor" />
                    <span>INITIATE</span>
                </button>
            </div>
        </section>
    );
};
