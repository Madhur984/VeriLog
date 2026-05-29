import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, LayoutDashboard, Target, FlaskConical,
    BarChart3, Settings, Binary, X, ChevronRight,
    BookOpen, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

/* ─── Types ────────────────────────────────────────────────────────── */

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.FC<{ className?: string }>;
    group: string;
    shortcut?: string;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    /** User-specific localStorage key for tour - passed from WorkstationHome */
    tourKey?: string;
}

/* ─── Component ───────────────────────────────────────────────────── */

export const CommandPalette: React.FC<CommandPaletteProps & { navigate: (path: string) => void }> = ({
    isOpen,
    onClose,
    navigate,
    tourKey = 'digi_tour_done',
}) => {
    const [query, setQuery] = useState('');
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const ALL_COMMANDS: CommandItem[] = [
        /* Navigation */
        {
            id: 'nav-dashboard', label: 'Go to Dashboard', description: 'Your main hub', icon: LayoutDashboard,
            group: 'Navigate', shortcut: 'G D', action: () => { navigate('/portal'); onClose(); }
        },
        {
            id: 'nav-challenges', label: 'Go to Challenges', description: 'Quests & missions', icon: Target,
            group: 'Navigate', shortcut: 'G C', action: () => { navigate('/quests'); onClose(); }
        },
        {
            id: 'nav-workbench', label: 'Open Workbench', description: 'Engineering workbench', icon: FlaskConical,
            group: 'Navigate', shortcut: 'G W', action: () => { navigate('/workbench'); onClose(); }
        },
        {
            id: 'nav-progress', label: 'View Progress', description: 'Track your learning', icon: BarChart3,
            group: 'Navigate', shortcut: 'G P', action: () => { navigate('/training'); onClose(); }
        },
        {
            id: 'nav-settings', label: 'Settings', description: 'Account & preferences', icon: Settings,
            group: 'Navigate', action: () => { navigate('/login'); onClose(); }
        },
        /* Modules */
        {
            id: 'mod-1', label: 'Number Systems & Codes', description: 'Binary, Octal, Hex · Completed', icon: Binary,
            group: 'Modules', action: () => { navigate('/portal'); onClose(); }
        },
        {
            id: 'mod-2', label: 'Logic Gates & Boolean Algebra', description: 'AND, OR, NOT, XOR · In Progress', icon: Binary,
            group: 'Modules', action: () => { navigate('/portal'); onClose(); }
        },
        {
            id: 'mod-3', label: 'Boolean Algebra', description: 'De Morgan, Simplification · In Progress', icon: Settings,
            group: 'Modules', action: () => { navigate('/portal'); onClose(); }
        },
        /* Actions */
        {
            id: 'act-tour', label: 'Start Onboarding Tour', description: 'Get a guided walkthrough', icon: Zap,
            group: 'Actions', action: () => {
                localStorage.removeItem(tourKey);
                window.location.reload();
                onClose();
            }
        },
        {
            id: 'act-darkmode', label: 'Toggle Theme', description: 'Switch light / dark mode', icon: BookOpen,
            group: 'Actions', action: () => {
                const event = new CustomEvent('toggle-theme');
                window.dispatchEvent(event);
                onClose();
            }
        },
    ];

    const filtered = query.trim()
        ? ALL_COMMANDS.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.description?.toLowerCase().includes(query.toLowerCase()) ||
            c.group.toLowerCase().includes(query.toLowerCase())
        )
        : ALL_COMMANDS;

    /* Group results */
    const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    /* Flat indexed list for keyboard nav */
    const flatList = Object.values(groups).flat();

    /* Reset state when opened */
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIdx(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    /* Keyboard navigation */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') { onClose(); return; }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx(i => Math.min(i + 1, flatList.length - 1));
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx(i => Math.max(i - 1, 0));
        }
        if (e.key === 'Enter' && flatList[selectedIdx]) {
            flatList[selectedIdx].action();
        }
    }, [isOpen, flatList, selectedIdx, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    /* Reset selected index when query changes */
    useEffect(() => { setSelectedIdx(0); }, [query]);

    /* Scroll selected item into view */
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-idx="${selectedIdx}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIdx]);

    let flatIdx = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                    />

                    {/* Palette */}
                    <motion.div
                        className="fixed top-[20vh] left-1/2 z-50 w-full max-w-[580px] -translate-x-1/2 rounded-2xl border border-white/[0.1] bg-[#0d1118] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Input row */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                            <Search className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search actions, modules, navigate..."
                                className="flex-1 bg-transparent text-[14px] text-white placeholder-slate-600 outline-none font-medium"
                            />
                            <button
                                onClick={onClose}
                                className="shrink-0 p-1 rounded-md hover:bg-white/[0.06] text-slate-600 hover:text-slate-300 transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Results */}
                        <div ref={listRef} className="max-h-[360px] overflow-y-auto overscroll-contain py-2">
                            {Object.entries(groups).length === 0 ? (
                                <div className="px-4 py-8 text-center text-slate-600 text-[13px]">No results for "{query}"</div>
                            ) : (
                                Object.entries(groups).map(([group, items]) => (
                                    <div key={group} className="mb-1">
                                        <p className="px-4 py-1.5 text-[10px] font-mono text-slate-600 uppercase tracking-widest">{group}</p>
                                        {items.map((item) => {
                                            const idx = flatIdx++;
                                            const isSelected = idx === selectedIdx;
                                            return (
                                                <button
                                                    key={item.id}
                                                    data-idx={idx}
                                                    onClick={item.action}
                                                    onMouseEnter={() => setSelectedIdx(idx)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer text-left group",
                                                        isSelected ? "bg-blue-600/10" : "hover:bg-white/[0.04]"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                                                        isSelected ? "border-blue-500/40 bg-blue-500/10" : "border-white/[0.07] bg-white/[0.03]"
                                                    )}>
                                                        <item.icon className={cn("w-3.5 h-3.5", isSelected ? "text-blue-400" : "text-slate-500")} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn("text-[13px] font-medium leading-tight", isSelected ? "text-white" : "text-slate-300")}>{item.label}</p>
                                                        {item.description && (
                                                            <p className="text-[11px] text-slate-600 mt-0.5">{item.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {item.shortcut && (
                                                            <div className="flex gap-1">
                                                                {item.shortcut.split(' ').map(k => (
                                                                    <span key={k} className="text-[10px] text-slate-600 border border-white/[0.08] rounded px-1.5 py-0.5 font-mono">{k}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <ChevronRight className={cn("w-3.5 h-3.5 transition-opacity", isSelected ? "text-slate-400 opacity-100" : "opacity-0")} />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.05] bg-white/[0.01]">
                            {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([key, label]) => (
                                <div key={key} className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-600 border border-white/[0.08] rounded px-1.5 py-0.5 font-mono">{key}</span>
                                    <span className="text-[10px] text-slate-600">{label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
