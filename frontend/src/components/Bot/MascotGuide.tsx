import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MessagesSquare } from 'lucide-react';
import { VoltMonkey } from './VoltMonkey';
import { SpeechBubble } from './SpeechBubble';
import { BotChat } from './BotChat';
import { useBotBrain } from './botBrain';
import { CelebrationFX } from './CelebrationFX';

/* ═══════════════════════════════════════════════════════════════════
   MascotGuide — Brain-powered floating VoltMonkey companion
   ──────────────────────────────────────────────────────────────────
   • Bottom-right corner, always visible
   • Brain-driven: mood/dialogue/animation from useBotBrain()
   • Auto-collapse: speech bubble closes after 8s unless interacted
   • Auto-expand: re-opens on major events (level complete, streak)
   • Dismiss logic: "Later" minimizes, reappears on next major event
   • Eye cursor tracking on hover
   • Pulse glow when new dialogue available
   • CelebrationFX on major events
   ═══════════════════════════════════════════════════════════════ */

interface MascotGuideProps {
    onStartTour?: () => void;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({ onStartTour }) => {
    const [expanded, setExpanded] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [eyeTarget, setEyeTarget] = useState<{ x: number; y: number } | null>(null);
    const fabRef = useRef<HTMLDivElement>(null);
    const autoCollapseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const brain = useBotBrain();

    /* ── Auto collapse after 8 seconds ────────────────────────── */
    const startAutoCollapse = useCallback(() => {
        if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);
        autoCollapseRef.current = setTimeout(() => {
            setExpanded(false);
        }, 8_000);
    }, []);

    const cancelAutoCollapse = useCallback(() => {
        if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);
    }, []);

    /* ── Auto-expand on new hints (major events) ──────────────── */
    useEffect(() => {
        if (brain.isNewHint && !dismissed && !chatOpen) {
            setExpanded(true);
            startAutoCollapse();
        }
    }, [brain.isNewHint, brain.dialogue, dismissed, chatOpen, startAutoCollapse]);

    /* ── Override dismiss on celebration events ────────────────── */
    useEffect(() => {
        if (brain.shouldCelebrate) {
            setDismissed(false);
            setExpanded(true);
            cancelAutoCollapse();
        }
    }, [brain.shouldCelebrate, cancelAutoCollapse]);

    /* ── Reset dismissed on route change ──────────────────────── */
    useEffect(() => {
        setDismissed(false);
    }, [brain.currentPage]);

    /* ── Eye cursor tracking ──────────────────────────────────── */
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!fabRef.current) return;
        const rect = fabRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        const norm = Math.min(dist, maxDist) / maxDist;
        setEyeTarget({
            x: (dx / (dist || 1)) * norm,
            y: (dy / (dist || 1)) * norm,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setEyeTarget(null);
    }, []);

    /* ── Build speech bubble actions ──────────────────────────── */
    const actions = React.useMemo(() => {
        const list: { label: string; onClick: () => void; primary?: boolean }[] = [];

        if (onStartTour && (brain.currentPage.startsWith('/portal') || brain.currentPage.startsWith('/home'))) {
            list.push({ label: '🗺️ Tour', onClick: onStartTour, primary: true });
        }

        list.push({ label: '💬 Ask Me', onClick: () => { setExpanded(false); setChatOpen(true); } });
        list.push({
            label: 'Later',
            onClick: () => {
                setExpanded(false);
                setDismissed(true);
                cancelAutoCollapse();
            },
        });

        return list;
    }, [onStartTour, brain.currentPage, cancelAutoCollapse]);

    if (dismissed && !brain.shouldCelebrate) return null;

    return (
        <>
            {/* ── Celebration Effects ── */}
            <CelebrationFX
                active={brain.shouldCelebrate}
                onComplete={brain.dismissCelebration}
            />

            {/* ── BotChat Panel ── */}
            <BotChat open={chatOpen} onClose={() => setChatOpen(false)} />

            <div
                style={{
                    position: 'fixed', bottom: 24, right: 24,
                    zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* ── Speech Bubble (expanded) ── */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            onMouseEnter={cancelAutoCollapse}
                            onMouseLeave={startAutoCollapse}
                        >
                            <SpeechBubble
                                title="VoltMonkey"
                                body={brain.dialogue || "I'm here if you need anything."}
                                placement="bottom"
                                accent={brain.shouldCelebrate ? '#F5C518' : '#22C55E'}
                                actions={actions}
                                visible
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── FAB Row: Chat Toggle + Mascot ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Chat toggle */}
                    <motion.button
                        onClick={() => setChatOpen(o => !o)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: chatOpen
                                ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                                : 'rgba(255,255,255,0.05)',
                            border: chatOpen ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: chatOpen ? '0 0 16px rgba(34,197,94,0.3)' : 'none',
                            transition: 'all 0.3s',
                        }}
                    >
                        <MessagesSquare style={{
                            width: 18, height: 18,
                            color: chatOpen ? 'white' : 'rgba(148,163,184,0.6)',
                        }} />
                    </motion.button>

                    {/* Mascot FAB — premium character, no hard circle */}
                    <motion.div
                        ref={fabRef}
                        onClick={() => {
                            setExpanded(prev => !prev);
                            if (!expanded) startAutoCollapse();
                        }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Soft glowing aura behind mascot */}
                        <motion.div
                            animate={{
                                opacity: expanded ? [0.35, 0.5, 0.35] : [0.15, 0.25, 0.15],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                inset: -14,
                                borderRadius: '50%',
                                background: brain.shouldCelebrate
                                    ? 'radial-gradient(circle, rgba(245,197,24,0.35) 0%, rgba(245,197,24,0.08) 50%, transparent 70%)'
                                    : brain.mood === 'alert'
                                        ? 'radial-gradient(circle, rgba(255,107,53,0.35) 0%, rgba(255,107,53,0.08) 50%, transparent 70%)'
                                        : 'radial-gradient(circle, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.08) 50%, transparent 70%)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Pulse glow ring — shows when new hint available */}
                        {!expanded && !chatOpen && brain.isNewHint && (
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute', inset: -8,
                                    borderRadius: '50%',
                                    border: brain.shouldCelebrate
                                        ? '2px solid #F5C518'
                                        : brain.mood === 'alert'
                                            ? '2px solid #FF6B35'
                                            : '2px solid #22C55E',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}

                        {/* Mascot character container — NO hard circle boundary */}
                        <div style={{
                            width: 96, height: 96,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            filter: expanded
                                ? 'drop-shadow(0 0 16px rgba(34,197,94,0.25)) drop-shadow(0 8px 24px rgba(0,0,0,0.35))'
                                : 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                            transition: 'filter 0.3s',
                        }}>
                            <VoltMonkey
                                state={brain.monkeyState}
                                size="sm"
                                eyeTarget={eyeTarget}
                            />
                        </div>

                        {/* Notification dot */}
                        {!expanded && brain.isNewHint && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    position: 'absolute', top: 2, right: 2,
                                    width: 16, height: 16, borderRadius: '50%',
                                    background: brain.mood === 'alert' ? '#FF6B35' : '#22C55E',
                                    border: '2px solid #0D1118',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 8px rgba(34,197,94,0.4)',
                                }}
                            >
                                <MessageCircle style={{ width: 8, height: 8, color: 'white' }} />
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
};
