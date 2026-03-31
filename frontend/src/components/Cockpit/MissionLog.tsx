import { Terminal, CheckCircle2, Circle } from 'lucide-react';

export const MissionLog = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 font-heading text-sm text-slate-600 uppercase tracking-wider">
                <Terminal className="w-4 h-4 mr-2 text-sky-600" />
                MISSION LOG
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Activity 1: The Spark</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Welcome to the training deck, Cadet. Your first task is simple: establish a power connection.
                    Route the current from the <span className="text-amber-600 font-bold">Battery</span> to the <span className="text-sky-600 font-bold">LED</span> using a wire.
                </p>

                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-sky-600 font-bold mb-2">Objectives</h3>

                    <div className="flex items-start group cursor-default">
                        <CheckCircle2 className="w-5 h-5 text-sky-600 mr-3 mt-0.5 shrink-0" />
                        <span className="text-slate-700 group-hover:text-slate-900 transition-colors line-through decoration-sky-600/50 opacity-50">
                            Place Battery Component
                        </span>
                    </div>

                    <div className="flex items-start group cursor-default">
                        <Circle className="w-5 h-5 text-slate-300 mr-3 mt-0.5 shrink-0 group-hover:text-sky-600 transition-colors" />
                        <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                            Place LED Component
                        </span>
                    </div>

                    <div className="flex items-start group cursor-default">
                        <Circle className="w-5 h-5 text-slate-300 mr-3 mt-0.5 shrink-0 group-hover:text-sky-600 transition-colors" />
                        <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                            Route Wire Connection
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer / Hint */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="text-xs text-slate-400 mb-1">DATASTREAM INCOMING...</div>
                <div className="text-sm text-sky-700 font-mono">
                    {">"} Hint: Drag components from the bottom tray.
                </div>
            </div>
        </div>
    );
};
