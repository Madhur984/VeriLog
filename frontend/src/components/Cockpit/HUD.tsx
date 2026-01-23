import { Home, Zap, Award, ChevronRight } from 'lucide-react';

export const HUD = () => {
    return (
        <header className="h-14 bg-deep-void border-b border-bezel-grey flex items-center justify-between px-6 select-none z-50 relative">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center text-sm font-mono text-slate-400">
                <Home className="w-4 h-4 mr-2 hover:text-terminal-green cursor-pointer transition-colors" />
                <span className="opacity-50 mx-2">/</span>
                <span className="hover:text-white cursor-pointer">Module 1</span>
                <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
                <span className="text-terminal-green font-bold text-glow-green">Logic Gates</span>
            </div>

            {/* Center: Mission Objective */}
            <div className="absolute left-1/2 -translate-x-1/2 bg-panel-grey px-6 py-1 rounded-bl-xl rounded-br-xl border-b border-l border-r border-bezel-grey text-xs uppercase tracking-widest font-bold text-signal-blue shadow-lg">
                Mission: Implement AND Gate
            </div>

            {/* Right: Gamification Stats */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-xp-gold" title="Current Streak">
                    <Zap className="w-5 h-5 fill-current animate-pulse" />
                    <span className="font-heading font-bold text-lg">3</span>
                </div>

                <div className="flex items-center space-x-2 text-slate-300" title="Experience Points">
                    <Award className="w-5 h-5 text-signal-blue" />
                    <span className="font-mono text-sm">1,250 XP</span>
                </div>

                <div className="w-8 h-8 rounded bg-gradient-to-tr from-terminal-green to-signal-blue border border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
        </header>
    );
};
