import { useEffect, useRef, useState } from 'react';
import { Send, Square } from 'lucide-react';

import { cn } from '../../lib/utils';

interface Props {
    onSend: (text: string) => void;
    onCancel: () => void;
    busy: boolean;
    placeholder?: string;
}

export function ChatInput({ onSend, onCancel, busy, placeholder }: Props) {
    const [value, setValue] = useState('');
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // auto-resize
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 140) + 'px';
    }, [value]);

    const submit = () => {
        const text = value.trim();
        if (!text || busy) return;
        onSend(text);
        setValue('');
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submit();
            }}
            className="flex items-end gap-2 border-t border-slate-700/60 bg-slate-900/70 px-3 py-2.5"
        >
            <textarea
                ref={ref}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                    }
                }}
                rows={1}
                placeholder={placeholder ?? 'Ask anything about electronics…'}
                className={cn(
                    'flex-1 resize-none bg-slate-800/80 border border-slate-700/70 rounded-lg',
                    'px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500',
                    'focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30',
                    'transition-colors',
                )}
            />
            {busy ? (
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-none h-9 w-9 rounded-lg bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 flex items-center justify-center"
                    title="Stop"
                >
                    <Square className="w-4 h-4" />
                </button>
            ) : (
                <button
                    type="submit"
                    disabled={!value.trim()}
                    className={cn(
                        'flex-none h-9 w-9 rounded-lg flex items-center justify-center',
                        'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200',
                        'hover:bg-cyan-500/30 transition-colors',
                        !value.trim() && 'opacity-40 cursor-not-allowed',
                    )}
                    title="Send (Enter)"
                >
                    <Send className="w-4 h-4" />
                </button>
            )}
        </form>
    );
}
