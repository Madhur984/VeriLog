/**
 * useKeyboardShortcuts.ts — Global keyboard shortcut handler
 *
 * Listens for key events and dispatches commands.
 * Ignores shortcuts when user is typing in inputs / textareas.
 */

import { useEffect, useCallback, useRef } from 'react';
import type { WorkbenchCommand } from '../data/commands';

interface ShortcutOptions {
    commands: WorkbenchCommand[];
    onCommandPalette: () => void;
    enabled?: boolean;
}

export function useKeyboardShortcuts({ commands, onCommandPalette, enabled = true }: ShortcutOptions) {
    const commandsRef = useRef(commands);
    commandsRef.current = commands;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!enabled) return;

        // Ignore when typing in form fields
        const target = e.target as HTMLElement;
        const tag = target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable) {
            return;
        }

        // Ctrl/Cmd + K → Command Palette
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            onCommandPalette();
            return;
        }

        // Ctrl/Cmd + ` → Toggle Console
        if ((e.ctrlKey || e.metaKey) && e.key === '`') {
            e.preventDefault();
            const consoleCmd = commandsRef.current.find(c => c.id === 'view-console');
            consoleCmd?.action();
            return;
        }

        // Single-key shortcuts (no modifiers except for special combos)
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            const key = e.key.toUpperCase();

            // Space → play/pause
            if (e.key === ' ') {
                e.preventDefault();
                const playCmd = commandsRef.current.find(c => c.id === 'sim-play');
                playCmd?.action();
                return;
            }

            // Delete/Backspace → delete selected
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                const delCmd = commandsRef.current.find(c => c.id === 'tool-delete');
                delCmd?.action();
                return;
            }

            // Escape → select tool
            if (e.key === 'Escape') {
                const selectCmd = commandsRef.current.find(c => c.id === 'tool-select');
                selectCmd?.action();
                return;
            }

            // Letter shortcuts
            const match = commandsRef.current.find(
                c => c.shortcut && c.shortcut.toUpperCase() === key && c.shortcut.length === 1
            );
            if (match) {
                e.preventDefault();
                match.action();
            }
        }
    }, [enabled, onCommandPalette]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
