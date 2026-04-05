import React from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface ModuleTopBarProps {
    progress: number;
}

const ModuleTopBar: React.FC<ModuleTopBarProps> = ({ progress }) => {
    return (
        <header className="h-16 border-b border-slate-200 bg-white shadow-sm px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1" />
                <span className="text-sm font-bold text-slate-400 font-mono tracking-tight">VeriQuest Engine</span>
            </div>

            <div className="flex-1 max-w-md mx-8">
                <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module Progress</span>
                    <span className="text-[10px] font-bold text-sky-600">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div 
                        className="h-full bg-sky-600 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-xs font-bold text-slate-800">Explorer</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level 1</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default ModuleTopBar;
