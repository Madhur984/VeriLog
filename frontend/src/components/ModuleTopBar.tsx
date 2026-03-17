import React from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface ModuleTopBarProps {
    progress: number;
}

const ModuleTopBar: React.FC<ModuleTopBarProps> = ({ progress }) => {
    return (
        <header className="h-16 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-100 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="h-6 w-px bg-slate-800/50 mx-1" />
                <span className="text-sm font-medium text-slate-400">VeriQuest Engine</span>
            </div>

            <div className="flex-1 max-w-md mx-8">
                <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Module Progress</span>
                    <span className="text-[10px] font-bold text-chart-cyan">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800/30 rounded-full overflow-hidden border border-slate-800/20">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-chart-cyan transition-all duration-700 ease-out shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-xs font-medium text-slate-300">Explorer</span>
                    <span className="text-[10px] text-slate-500">Level 1</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default ModuleTopBar;
