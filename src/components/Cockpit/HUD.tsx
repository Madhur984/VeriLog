import React from 'react';
import { ChevronRight, Flame, Trophy, User } from 'lucide-react';
import { cn } from '../../utils/cn'; // Assuming utils exists, or I will use clsx/tailwind-merge directly if needed.

interface HUDProps {
    moduleName: string;
    lessonName: string;
    streak: number;
    xp: number;
}

export const HUD: React.FC<HUDProps> = ({ moduleName, lessonName, streak, xp }) => {
    return (
        <header className="h-16 bg-void/95 border-b border-panel-border backdrop-blur-sm flex items-center justify-between px-6 z-50 sticky top-0">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center gap-2 text-text-dim text-sm font-medium">
                <span className="hover:text-terminal-green cursor-pointer transition-colors">Home</span>
                <ChevronRight size={16} />
                <span className="hover:text-terminal-green cursor-pointer transition-colors">{moduleName}</span>
                <ChevronRight size={16} />
                <span className="text-terminal-green font-bold glow-text">{lessonName}</span>
            </div>

            {/* Center: Mission Status (Optional Dynamic Text) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-panel-border/30 rounded-full border border-panel-border/50">
                    <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></span>
                    <span className="text-xs font-mono text-terminal-green uppercase tracking-widest">System Online</span>
                </div>
            </div>

            {/* Right: Gamification HUD */}
            <div className="flex items-center gap-6">
                {/* Streak */}
                <div className="flex items-center gap-2 group cursor-help" title="Current Streak">
                    <Flame className={cn("transition-all duration-300", streak > 0 ? "text-orange-500 fill-orange-500 group-hover:scale-110" : "text-gray-600")} size={20} />
                    <span className={cn("font-mono font-bold", streak > 0 ? "text-orange-500" : "text-gray-600")}>{streak}</span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-2 group cursor-help" title="Total XP">
                    <Trophy className="text-xp-gold group-hover:rotate-12 transition-transform duration-300" size={20} />
                    <span className="font-mono font-bold text-xp-gold">{xp} XP</span>
                </div>

                {/* Profile */}
                <button className="w-9 h-9 rounded bg-panel border border-panel-border hover:border-terminal-green flex items-center justify-center transition-all hover:shadow-neon-green ml-2 group">
                    <User size={18} className="text-text-dim group-hover:text-terminal-green" />
                </button>
            </div>
        </header>
    );
};
