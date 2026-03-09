/**
 * CommandPalette.tsx — Fuzzy-search command launcher (Ctrl+K)
 *
 * Professional command palette inspired by VS Code / Figma.
 * Displays categorized commands with shortcut hints.
 */

import { useState, useCallback, useEffect, useRef, memo } from 'react';
import type { WorkbenchCommand } from '../../data/commands';

interface CommandPaletteProps {
    commands: WorkbenchCommand[];
    isOpen: boolean;
    onClose: () => void;
}

function fuzzyMatch(query: string, text: string): boolean {
    const lower = text.toLowerCase();
    const q = query.toLowerCase();
    let qi = 0;
    for (let i = 0; i < lower.length && qi < q.length; i++) {
        if (lower[i] === q[qi]) qi++;
    }
    return qi === q.length;
}

const CATEGORY_LABELS: Record<string, string> = {
    gate: 'Components',
    tool: 'Tools',
    simulation: 'Simulation',
    view: 'View',
    navigation: 'Navigation',
};

const CATEGORY_ORDER = ['simulation', 'gate', 'tool', 'view', 'navigation'];

export const CommandPalette = memo(({ commands, isOpen, onClose }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Filter commands
    const filtered = query
        ? commands.filter(c => fuzzyMatch(query, c.label) || fuzzyMatch(query, c.category))
        : commands;

    // Group by category
    const grouped = CATEGORY_ORDER
        .map(cat => ({
            category: cat,
            label: CATEGORY_LABELS[cat] || cat,
            items: filtered.filter(c => c.category === cat),
        }))
        .filter(g => g.items.length > 0);

    // Flat list for keyboard navigation
    const flatItems = grouped.flatMap(g => g.items);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Scroll selected into view
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const executeCommand = useCallback((cmd: WorkbenchCommand) => {
        onClose();
        // Defer so the palette closes first
        requestAnimationFrame(() => cmd.action());
    }, [onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = flatItems[selectedIndex];
            if (cmd) executeCommand(cmd);
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [flatItems, selectedIndex, executeCommand, onClose]);

    if (!isOpen) return null;

    let flatIndex = -1;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                }}
            />

            {/* Palette */}
            <div
                style={{
                    position: 'fixed',
                    top: '15%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 520,
                    maxHeight: '60vh',
                    background: '#0d1117',
                    border: '1px solid rgba(0, 212, 255, 0.15)',
                    borderRadius: 8,
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 212, 255, 0.08)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Input */}
                <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                }}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command..."
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#e6edf3',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 14,
                            caretColor: '#00d4ff',
                        }}
                    />
                </div>

                {/* Results */}
                <div ref={listRef} style={{ overflow: 'auto', maxHeight: '50vh' }}>
                    {grouped.length === 0 && (
                        <div style={{
                            padding: '20px 16px',
                            color: 'rgba(255,255,255,0.3)',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 12,
                            textAlign: 'center',
                        }}>
                            No matching commands
                        </div>
                    )}

                    {grouped.map(group => (
                        <div key={group.category}>
                            {/* Category Header */}
                            <div style={{
                                padding: '6px 16px',
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 9,
                                letterSpacing: '0.12em',
                                color: 'rgba(0, 212, 255, 0.4)',
                                textTransform: 'uppercase',
                                background: 'rgba(0, 212, 255, 0.02)',
                            }}>
                                {group.label}
                            </div>

                            {/* Commands */}
                            {group.items.map(cmd => {
                                flatIndex++;
                                const isSelected = flatIndex === selectedIndex;
                                const idx = flatIndex;
                                return (
                                    <div
                                        key={cmd.id}
                                        data-index={idx}
                                        onClick={() => executeCommand(cmd)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                            background: isSelected ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                                            transition: 'background 80ms',
                                        }}
                                    >
                                        <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{cmd.icon}</span>
                                        <span style={{
                                            flex: 1,
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            fontSize: 13,
                                            color: isSelected ? '#e6edf3' : 'rgba(255,255,255,0.6)',
                                        }}>
                                            {cmd.label}
                                        </span>
                                        {cmd.shortcut && (
                                            <span style={{
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                fontSize: 10,
                                                color: 'rgba(0, 212, 255, 0.35)',
                                                padding: '2px 6px',
                                                border: '1px solid rgba(0, 212, 255, 0.12)',
                                                borderRadius: 3,
                                            }}>
                                                {cmd.shortcut}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer hint */}
                <div style={{
                    padding: '6px 16px',
                    borderTop: '1px solid rgba(0, 212, 255, 0.06)',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    gap: 12,
                }}>
                    <span>↑↓ navigate</span>
                    <span>↵ execute</span>
                    <span>esc close</span>
                </div>
            </div>
        </>
    );
});

CommandPalette.displayName = 'CommandPalette';
