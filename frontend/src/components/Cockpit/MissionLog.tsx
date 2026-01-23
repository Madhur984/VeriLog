import { Terminal, CheckCircle2, Circle } from 'lucide-react';

export const MissionLog = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-10 bg-panel-grey border-b border-bezel-grey flex items-center px-4 font-heading text-sm text-slate-300">
                <Terminal className="w-4 h-4 mr-2 text-terminal-green" />
                MISSION LOG
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold text-white mb-4">Activity 1: The Spark</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Welcome to the training deck, Cadet. Your first task is simple: establish a power connection.
                    Route the current from the <span className="text-xp-gold">Battery</span> to the <span className="text-terminal-green">LED</span> using a wire.
                </p>

                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-signal-blue font-bold mb-2">Objectives</h3>

                    <div className="flex items-start group cursor-default">
                        <CheckCircle2 className="w-5 h-5 text-terminal-green mr-3 mt-0.5 shrink-0" />
                        <span className="text-slate-200 group-hover:text-white transition-colors line-through decoration-terminal-green/50 opacity-50">
                            Place Battery Component
                        </span>
                    </div>

                    <div className="flex items-start group cursor-default">
                        <Circle className="w-5 h-5 text-slate-500 mr-3 mt-0.5 shrink-0 group-hover:text-signal-blue transition-colors" />
                        <span className="text-slate-200 group-hover:text-white transition-colors">
                            Place LED Component
                        </span>
                    </div>

                    <div className="flex items-start group cursor-default">
                        <Circle className="w-5 h-5 text-slate-500 mr-3 mt-0.5 shrink-0 group-hover:text-signal-blue transition-colors" />
                        <span className="text-slate-200 group-hover:text-white transition-colors">
                            Route Wire Connection
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer / Hint */}
            <div className="p-4 border-t border-bezel-grey bg-deep-void/50">
                <div className="text-xs text-slate-500 mb-1">DATASTREAM INCOMING...</div>
                <div className="text-sm text-terminal-green/80 font-mono">
                    {">"} Hint: Drag components from the bottom tray.
                </div>
            </div>
        </div>
    );
};
