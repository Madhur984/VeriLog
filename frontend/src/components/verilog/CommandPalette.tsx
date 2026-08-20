/**
 * CommandPalette — UI/UX master plan §5.3.
 *
 * One searchable action list bound to ⌘K / Ctrl+K. This is what makes the
 * workspace feel keyboard-native rather than a collection of buttons: every
 * top-bar action, every panel toggle, and every problem in the bank is
 * reachable without the mouse and without knowing where it lives on screen.
 *
 * The fuzzy match is subsequence-based (the letters appear in order, not
 * necessarily adjacently), which is what makes "gcnt" find "Gray Code Counter".
 * Scoring favours consecutive runs and word-boundary hits so exact prefixes
 * still win, and the list stays honest about *why* something matched by
 * showing its section.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, CornerDownLeft } from 'lucide-react';

export interface Command {
  id: string;
  label: string;
  /** Grouping shown as a dim suffix — "Problem", "Panel", "Theme", "Run". */
  section: string;
  /** Extra text the matcher considers but does not display. */
  keywords?: string;
  /** Rendered right-aligned, e.g. "⌘↵". */
  shortcut?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;
  run: () => void;
}

/**
 * Subsequence score, or -1 for no match. Higher is better.
 * Consecutive characters and word-boundary starts are worth more, so a prefix
 * match outranks letters scattered across the string.
 */
export function fuzzyScore(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  let score = 0;
  let hi = 0;
  let run = 0;
  for (let ni = 0; ni < n.length; ni++) {
    const ch = n[ni];
    const found = h.indexOf(ch, hi);
    if (found === -1) return -1;
    // Word-boundary hits (start of string, or after a space/underscore/dash).
    const boundary = found === 0 || /[\s_\-/]/.test(h[found - 1]);
    run = found === hi ? run + 1 : 0;
    score += 1 + run * 2 + (boundary ? 3 : 0);
    hi = found + 1;
  }
  // Prefer shorter haystacks when scores tie — "Wire" over "Wire Reduction".
  return score - h.length * 0.01;
}

export const CommandPalette: React.FC<{
  open: boolean;
  onClose: () => void;
  commands: Command[];
}> = ({ open, onClose, commands }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return commands.slice(0, 60);
    return commands
      .map((c) => ({ c, s: fuzzyScore(`${c.label} ${c.section} ${c.keywords ?? ''}`, query.trim()) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 60)
      .map((r) => r.c);
  }, [commands, query]);

  useEffect(() => { setActive(0); }, [query]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { setActive((i) => Math.min(results.length - 1, i + 1)); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setActive((i) => Math.max(0, i - 1)); e.preventDefault(); }
    else if (e.key === 'Enter') {
      const cmd = results[active];
      if (cmd) { onClose(); cmd.run(); }
      e.preventDefault();
    } else if (e.key === 'Escape') { onClose(); e.preventDefault(); }
  }, [results, active, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="vj-scope fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: 'rgba(2,6,23,0.55)', backdropFilter: 'blur(2px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl"
        style={{ borderColor: 'var(--vj-border-strong)', background: 'var(--vj-surface-2)' }}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2 border-b px-3.5 py-3"
             style={{ borderColor: 'var(--vj-border)' }}>
          <Search size={16} style={{ color: 'var(--vj-text-dim)' }} aria-hidden />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Run a command or jump to a problem…"
            aria-label="Search commands"
            aria-controls="vj-cmd-list"
            aria-activedescendant={results[active] ? `vj-cmd-${results[active].id}` : undefined}
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
            style={{ color: 'var(--vj-text)' }}
          />
          <kbd className="rounded px-1.5 py-0.5 text-[10px]"
               style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-text-dim)' }}>esc</kbd>
        </div>

        <ul ref={listRef} id="vj-cmd-list" role="listbox" className="max-h-[52vh] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-3.5 py-6 text-center text-[13px]" style={{ color: 'var(--vj-text-dim)' }}>
              Nothing matches “{query}”.
            </li>
          )}
          {results.map((c, i) => {
            const Icon = c.icon;
            const on = i === active;
            return (
              <li
                key={c.id}
                id={`vj-cmd-${c.id}`}
                data-idx={i}
                role="option"
                aria-selected={on}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => { e.preventDefault(); onClose(); c.run(); }}
                className="mx-1 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2"
                style={on ? { background: 'var(--vj-surface-4)' } : undefined}
              >
                {Icon
                  ? <Icon size={14} className="shrink-0"
                          style={{ color: on ? 'var(--vj-info)' : 'var(--vj-text-dim)' }} />
                  : <span className="w-3.5 shrink-0" />}
                <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: 'var(--vj-text)' }}>
                  {c.label}
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide"
                      style={{ color: 'var(--vj-text-dim)' }}>{c.section}</span>
                {c.shortcut && (
                  <kbd className="shrink-0 rounded px-1.5 py-0.5 text-[10px]"
                       style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-text-dim)' }}>
                    {c.shortcut}
                  </kbd>
                )}
                {on && <CornerDownLeft size={12} className="shrink-0"
                                       style={{ color: 'var(--vj-text-dim)' }} aria-hidden />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
};
