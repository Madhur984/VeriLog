import { Home, Zap, Award, ChevronRight } from 'lucide-react';

export const HUD = () => {
    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 select-none z-50 relative">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center text-sm font-mono text-slate-500">
                <Home className="w-4 h-4 mr-2 hover:text-sky-600 cursor-pointer transition-colors" />
                <span className="opacity-50 mx-2">/</span>
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Module 1</span>
                <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
                <span className="text-sky-600 font-bold">Logic Gates</span>
            </div>

            {/* Center: Mission Objective */}
            <div className="absolute left-1/2 -translate-x-1/2 bg-slate-50 px-6 py-1 rounded-bl-xl rounded-br-xl border-b border-l border-r border-slate-200 text-xs uppercase tracking-widest font-bold text-sky-600 shadow-md">
                Mission: Implement AND Gate
            </div>

            {/* Right: Gamification Stats */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-amber-500" title="Current Streak">
                    <Zap className="w-5 h-5 fill-current animate-pulse" />
                    <span className="font-heading font-bold text-lg text-slate-900">3</span>
                </div>

                <div className="flex items-center space-x-2 text-slate-500" title="Experience Points">
                    <Award className="w-5 h-5 text-sky-600" />
                    <span className="font-mono text-sm text-slate-700">1,250 XP</span>
                </div>

                <div className="w-8 h-8 rounded bg-gradient-to-tr from-sky-500 to-blue-600 border border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
        </header>
    );
};
