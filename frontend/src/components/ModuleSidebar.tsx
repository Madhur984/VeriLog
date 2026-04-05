import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarSection {
    title: string;
    icon: React.ReactNode;
    items: string[];
}

interface ModuleSidebarProps {
    moduleTitle: string;
    sections: SidebarSection[];
    activeItem: string;
    onSelectItem: (item: string) => void;
}

const ModuleSidebar: React.FC<ModuleSidebarProps> = ({ moduleTitle, sections, activeItem, onSelectItem }) => {
    return (
        <div className="p-6">
            <div className="mb-10 mt-2">
                <h1 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-sky-500 tracking-tight">
                    {moduleTitle}
                </h1>
                <div className="h-0.5 w-12 bg-sky-600 mt-2 rounded-full shadow-sm" />
            </div>

            <nav className="space-y-8">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-2">
                            {section.icon}
                            {section.title}
                        </div>
                        <ul className="space-y-1">
                            {section.items.map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => onSelectItem(item)}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 group relative overflow-hidden",
                                            activeItem === item 
                                                ? "text-sky-600 bg-sky-50 font-bold shadow-sm" 
                                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                        )}
                                    >
                                        {/* Active Indicator Glow */}
                                        {activeItem === item && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-600 rounded-r-full shadow-sm" />
                                        )}
                                        <span className="relative z-10">{item}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="mt-20 pt-6 border-t border-slate-200">
                <div className="px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Current Concept</p>
                    <p className="text-sm font-bold text-slate-800">{activeItem}</p>
                </div>
            </div>
        </div>
    );
};

export default ModuleSidebar;
