/**
 * VoltMonkeyPanel.tsx — Floating hint panel with conversational UI
 */

import { useState, useCallback, useEffect } from 'react';
import { voltMonkey, type VoltMonkeyHint, type HintContext } from '../engines/voltMonkeyEngine';
import './voltmonkey.css';

interface Props {
    missionId?: string;
    circuitState?: {
        nodeCount: number;
        edgeCount: number;
        hasClosedLoop: boolean;
    };
}

export function VoltMonkeyPanel({ missionId, circuitState }: Props) {
    const [messages, setMessages] = useState<VoltMonkeyHint[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);

    // Initial greeting
    useEffect(() => {
        const greeting = voltMonkey.getGreeting();
        setMessages([greeting]);
    }, []);

    const askForHint = useCallback(() => {
        const context: HintContext = {
            missionId,
            attemptCount,
            circuitState,
        };

        const hint = voltMonkey.getHint(context);
        setMessages((prev) => [...prev.slice(-4), hint]); // Keep last 5 messages
        setAttemptCount((a) => a + 1);
    }, [missionId, attemptCount, circuitState]);

    const askForAdvice = useCallback(() => {
        const context: HintContext = {
            attemptCount,
            circuitState,
        };
        const advice = voltMonkey.getCircuitAdvice(context);
        setMessages((prev) => [...prev.slice(-4), advice]);
    }, [attemptCount, circuitState]);

    const celebrate = useCallback(() => {
        const msg = voltMonkey.getCelebration();
        setMessages((prev) => [...prev.slice(-4), msg]);
    }, []);

    return (
        <>
            {/* Toggle button */}
            <button
                className="vm-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                title="VoltMonkey Assistant"
            >
                <span className="vm-toggle-avatar">🐵</span>
                {messages.length > 0 && !isExpanded && (
                    <span className="vm-toggle-badge" />
                )}
            </button>

            {/* Panel */}
            {isExpanded && (
                <div className="vm-panel">
                    <div className="vm-header">
                        <span className="vm-header-avatar">🐵</span>
                        <span className="vm-header-name">VoltMonkey</span>
                        <span className="vm-header-tag">Lab Companion</span>
                        <button
                            className="vm-header-close"
                            onClick={() => setIsExpanded(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="vm-messages">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`vm-message vm-message--${msg.mood}`}
                            >
                                <span className="vm-message-emoji">{msg.emoji}</span>
                                <span className="vm-message-text">{msg.text}</span>
                                {msg.level > 0 && (
                                    <span className="vm-message-level">
                                        Hint L{msg.level}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="vm-actions">
                        <button className="vm-action-btn vm-action-btn--hint" onClick={askForHint}>
                            💡 Hint
                        </button>
                        <button className="vm-action-btn vm-action-btn--advice" onClick={askForAdvice}>
                            🔍 Analyze Circuit
                        </button>
                        <button className="vm-action-btn vm-action-btn--celebrate" onClick={celebrate}>
                            🎉 I Solved It!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
