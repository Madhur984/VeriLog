import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoltMonkey } from './VoltMonkey';
import { SpeechBubble } from './SpeechBubble';
import { useBotBrain } from './botBrain';
import type { BotTrigger } from './botDialogue';

// ═══════════════════════════════════════════════════════════════
// BotCompanion — Orchestrator for the lab mascot
// Renders VoltMonkey + SpeechBubble driven by useBotBrain.
// Export `dispatch` via ref so CircuitCanvas can fire events.
// ═══════════════════════════════════════════════════════════════

export interface BotCompanionRef {
    dispatch: (trigger: BotTrigger) => void;
}

interface BotCompanionProps {
    /** Size of the character */
    size?: 'sm' | 'md' | 'lg';
    /** Exposed ref so parent can call dispatch */
    companionRef?: React.MutableRefObject<BotCompanionRef | null>;
    /** Layout: 'fixed' sits bottom-right, 'inline' is in document flow */
    layout?: 'fixed' | 'inline';
}

export const BotCompanion: React.FC<BotCompanionProps> = ({
    size = 'md',
    companionRef,
    layout = 'fixed',
}) => {
    const bot = useBotBrain();

    // Expose dispatch to parent via ref
    React.useEffect(() => {
        if (companionRef) {
            companionRef.current = { dispatch: bot.dispatch };
        }
    }, [companionRef, bot.dispatch]);

    const containerStyle: React.CSSProperties = layout === 'fixed'
        ? {
            position: 'fixed',
            bottom: 28,
            right: 28,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            zIndex: 50,
            pointerEvents: 'none',
        }
        : {
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
        };

    return (
        <div style={containerStyle}>
            {/* Speech bubble — appears to the left of the bot */}
            <AnimatePresence>
                {bot.visible && bot.line && (
                    <motion.div
                        key={bot.line.id}
                        initial={{ opacity: 0, x: 12, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 12, scale: 0.92 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <SpeechBubble
                            body={bot.line.text}
                            tone={bot.tone}
                            placement="right"
                            typingSpeed={bot.line.typingSpeed}
                            visible={bot.visible}
                            actions={bot.line.quickReplies?.map(label => ({
                                label,
                                primary: false,
                                onClick: () => bot.dismiss(),
                            }))}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Character */}
            <div style={{ pointerEvents: 'auto' }}>
                <VoltMonkey
                    state={bot.animation}
                    size={size}
                    onClick={() => {
                        if (bot.visible) bot.dismiss();
                        else bot.dispatch('idle_10s');
                    }}
                />
            </div>
        </div>
    );
};
