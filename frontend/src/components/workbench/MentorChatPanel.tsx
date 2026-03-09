/**
 * MentorChatPanel.tsx — Unified chat UI for all AI mentors
 *
 * Displays mentor messages with avatar, emotion indicators,
 * progressive hint levels, and action buttons.
 */

import { useRef, useEffect, memo } from 'react';
import type { MentorMessage, MentorPersonality, EmotionState } from '../../mentors/MentorFramework';

interface MentorChatPanelProps {
    personality: MentorPersonality;
    messages: MentorMessage[];
    emotion: EmotionState;
    onRequestHint: () => void;
}

const EMOTION_ICONS: Record<EmotionState, string> = {
    neutral: '😐',
    happy: '😊',
    thinking: '🤔',
    excited: '🤩',
    concerned: '😟',
    teaching: '🧑‍🏫',
    celebrating: '🎉',
};

const HINT_LEVEL_STYLES: Record<string, { bg: string; border: string; label: string }> = {
    nudge: { bg: 'rgba(107, 114, 128, 0.06)', border: 'rgba(107, 114, 128, 0.12)', label: 'NUDGE' },
    hint: { bg: 'rgba(0, 212, 255, 0.04)', border: 'rgba(0, 212, 255, 0.1)', label: 'HINT' },
    explanation: { bg: 'rgba(245, 158, 11, 0.04)', border: 'rgba(245, 158, 11, 0.1)', label: 'EXPLAIN' },
    solution: { bg: 'rgba(16, 185, 129, 0.04)', border: 'rgba(16, 185, 129, 0.1)', label: 'SOLUTION' },
};

export const MentorChatPanel = memo(({ personality, messages, emotion, onRequestHint }: MentorChatPanelProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages.length]);

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
        }}>
            {/* Mentor Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderBottom: `1px solid ${personality.accentColor}20`,
                background: `${personality.accentColor}06`,
            }}>
                {/* Avatar */}
                <span style={{ fontSize: 18 }}>{personality.avatar}</span>

                {/* Name & Title */}
                <div>
                    <div style={{ color: personality.accentColor, fontWeight: 600, fontSize: 11 }}>
                        {personality.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>
                        {personality.title}
                    </div>
                </div>

                <div style={{ flex: 1 }} />

                {/* Emotion */}
                <span style={{ fontSize: 14 }} title={`Feeling: ${emotion}`}>
                    {EMOTION_ICONS[emotion]}
                </span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{
                flex: 1,
                overflow: 'auto',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}>
                {messages.length === 0 && (
                    <div style={{
                        color: 'rgba(255,255,255,0.1)',
                        textAlign: 'center',
                        padding: 20,
                        fontSize: 10,
                    }}>
                        {personality.name} is ready to help...
                    </div>
                )}

                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} accentColor={personality.accentColor} />
                ))}
            </div>

            {/* Input Area */}
            <div style={{
                display: 'flex',
                gap: 6,
                padding: '6px 10px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
            }}>
                <button
                    onClick={onRequestHint}
                    style={{
                        flex: 1,
                        background: `${personality.accentColor}10`,
                        border: `1px solid ${personality.accentColor}25`,
                        color: personality.accentColor,
                        fontSize: 10,
                        padding: '5px 12px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 100ms',
                    }}
                >
                    💡 Ask for a Hint
                </button>
            </div>
        </div>
    );
});

MentorChatPanel.displayName = 'MentorChatPanel';

// ─── Message Bubble ──────────────────────────────────────────────────────

const MessageBubble = memo(({ message, accentColor }: { message: MentorMessage; accentColor: string }) => {
    const levelStyle = HINT_LEVEL_STYLES[message.hintLevel] || HINT_LEVEL_STYLES.nudge;

    return (
        <div style={{
            background: levelStyle.bg,
            border: `1px solid ${levelStyle.border}`,
            borderRadius: 6,
            padding: '8px 10px',
            position: 'relative',
        }}>
            {/* Hint Level Badge */}
            <span style={{
                position: 'absolute',
                top: -6,
                right: 8,
                fontSize: 7,
                padding: '1px 5px',
                borderRadius: 3,
                background: levelStyle.border,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.08em',
                fontWeight: 600,
            }}>
                {levelStyle.label}
            </span>

            {/* Message Text */}
            <div style={{
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
            }}>
                {message.text}
            </div>

            {/* Actions */}
            {message.actions && message.actions.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    {message.actions.map((action, i) => (
                        <button key={i} style={{
                            background: `${accentColor}10`,
                            border: `1px solid ${accentColor}20`,
                            color: accentColor,
                            fontSize: 9,
                            padding: '2px 8px',
                            borderRadius: 3,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}>
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Timestamp */}
            <div style={{
                color: 'rgba(255,255,255,0.1)',
                fontSize: 8,
                marginTop: 4,
                textAlign: 'right',
            }}>
                {new Date(message.timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';
