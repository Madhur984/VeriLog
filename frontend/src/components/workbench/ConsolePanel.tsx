/**
 * ConsolePanel.tsx — Log viewer for simulation events, errors, signal changes
 *
 * Auto-scrolls to latest message. Supports log levels and timestamps.
 */

import { useState, useRef, useEffect, useCallback, memo } from 'react';

export interface ConsoleMessage {
    id: number;
    timestamp: number;
    level: 'info' | 'warn' | 'error' | 'signal' | 'sim';
    text: string;
}

const LEVEL_COLORS: Record<ConsoleMessage['level'], string> = {
    info: 'rgba(255,255,255,0.5)',
    warn: '#F59E0B',
    error: '#EF4444',
    signal: '#10B981',
    sim: '#00D4FF',
};

const LEVEL_PREFIX: Record<ConsoleMessage['level'], string> = {
    info: 'INF',
    warn: 'WRN',
    error: 'ERR',
    signal: 'SIG',
    sim: 'SIM',
};

let msgCounter = 0;
const globalMessages: ConsoleMessage[] = [];
const listeners: Set<() => void> = new Set();

/** Push a message to the console (call from anywhere) */
export function consoleLog(level: ConsoleMessage['level'], text: string) {
    globalMessages.push({
        id: ++msgCounter,
        timestamp: Date.now(),
        level,
        text,
    });
    // Keep last 500
    if (globalMessages.length > 500) globalMessages.splice(0, globalMessages.length - 500);
    listeners.forEach(fn => fn());
}

function formatTime(ts: number): string {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

export const ConsolePanel = memo(() => {
    const [messages, setMessages] = useState<ConsoleMessage[]>([...globalMessages]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // Subscribe to global messages
    useEffect(() => {
        const update = () => setMessages([...globalMessages]);
        listeners.add(update);
        return () => { listeners.delete(update); };
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, autoScroll]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setAutoScroll(scrollHeight - scrollTop - clientHeight < 40);
    }, []);

    const clearConsole = useCallback(() => {
        globalMessages.length = 0;
        setMessages([]);
    }, []);

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: 8,
                padding: '4px 8px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                alignItems: 'center',
            }}>
                <button
                    onClick={clearConsole}
                    style={{
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: 9,
                        padding: '2px 8px',
                        borderRadius: 3,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                    }}
                >
                    Clear
                </button>
                <span style={{ flex: 1 }} />
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 9 }}>
                    {messages.length} entries
                </span>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '4px 0',
                }}
            >
                {messages.length === 0 && (
                    <div style={{
                        padding: '12px 8px',
                        color: 'rgba(255,255,255,0.15)',
                        textAlign: 'center',
                        fontSize: 10,
                    }}>
                        No messages yet. Simulation events will appear here.
                    </div>
                )}
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            gap: 8,
                            padding: '1px 8px',
                            lineHeight: '18px',
                            borderLeft: `2px solid ${LEVEL_COLORS[msg.level]}`,
                            background: msg.level === 'error' ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                        }}
                    >
                        <span style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0, fontSize: 10 }}>
                            {formatTime(msg.timestamp)}
                        </span>
                        <span style={{
                            color: LEVEL_COLORS[msg.level],
                            fontWeight: 600,
                            flexShrink: 0,
                            fontSize: 9,
                            minWidth: 24,
                        }}>
                            {LEVEL_PREFIX[msg.level]}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', wordBreak: 'break-word' }}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});

ConsolePanel.displayName = 'ConsolePanel';
