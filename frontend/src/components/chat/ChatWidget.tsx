import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    MessageCircle,
    RefreshCw,
    Sparkles,
    Trash2,
    Video,
    VideoOff,
    X,
} from 'lucide-react';

import { cn } from '../../lib/utils';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useChat } from './useChat';

const SUGGESTED_PROMPTS = [
    'Explain a 2-to-1 multiplexer with a truth table.',
    'How is a D flip-flop different from a JK flip-flop?',
    'Walk me through K-map minimization for a 4-variable function.',
    'Write Verilog for a 4-bit ripple-carry adder.',
];

export function ChatWidget() {
    const {
        open,
        setOpen,
        messages,
        busy,
        videoMode,
        setVideoMode,
        sendMessage,
        cancel,
        clear,
        requestVideoFor,
        health,
        refreshHealth,
    } = useChat();

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages, open]);

    const llmOk = !!health?.llm?.ok && !!health?.llm?.model_pulled;
    const videoOk = !!health?.video_renderer?.available;
    const storeOk = !!health?.vector_store?.ok;
    const docs = health?.vector_store?.documents ?? 0;

    return (
        <>
            {/* Launcher button */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        key="launcher"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => setOpen(true)}
                        className="fixed bottom-5 right-5 z-[9000] flex items-center gap-2 rounded-full bg-cyan-500/95 hover:bg-cyan-400 text-slate-900 shadow-xl shadow-cyan-500/40 px-4 py-3 font-semibold"
                        aria-label="Open VeriQuest Tutor"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">Ask Tutor</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className={cn(
                            'fixed bottom-5 right-5 z-[9000] w-[min(420px,calc(100vw-2rem))]',
                            'h-[min(640px,calc(100vh-2rem))] flex flex-col',
                            'rounded-2xl border border-cyan-400/30 bg-slate-950/95 backdrop-blur',
                            'shadow-2xl shadow-cyan-500/20 overflow-hidden',
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-700/60 bg-slate-900/80">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-cyan-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-100">
                                    VeriQuest Tutor
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">
                                    Local LLM · {docs.toLocaleString()} chunks indexed
                                </div>
                            </div>

                            {/* Video toggle */}
                            <button
                                onClick={() => videoOk && setVideoMode((v: boolean) => !v)}
                                disabled={!videoOk}
                                className={cn(
                                    'flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-colors',
                                    !videoOk
                                        ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                                        : videoMode
                                            ? 'bg-fuchsia-500/15 border-fuchsia-400/50 text-fuchsia-200'
                                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200',
                                )}
                                title={
                                    videoOk
                                        ? 'When on, each answer also renders a short tutorial video'
                                        : 'Video renderer not set up (optional feature)'
                                }
                            >
                                {videoMode && videoOk ? (
                                    <Video className="w-3 h-3" />
                                ) : (
                                    <VideoOff className="w-3 h-3" />
                                )}
                                Video
                            </button>

                            <button
                                onClick={() => clear()}
                                className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                                title="Clear conversation"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Health banner */}
                        {health && (!llmOk || !storeOk || (videoMode && !videoOk)) && (
                            <div className="flex items-start gap-2 px-3 py-2 bg-amber-500/10 border-b border-amber-400/30 text-[11px] text-amber-200">
                                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-none" />
                                <div className="flex-1">
                                    {!llmOk && (
                                        <p>
                                            {health.llm.error ?? 'Model not loaded.'}{' '}
                                            <span className="text-amber-300/90">
                                                Model:{' '}
                                                <code className="bg-amber-500/20 px-1 rounded">
                                                    {health.llm.default_model}
                                                </code>
                                                {' '}
                                                — it auto-downloads on first chat (a few minutes the first time).
                                            </span>
                                        </p>
                                    )}
                                    {!storeOk && (
                                        <p>
                                            Vector store unreachable: {health.vector_store.error}
                                        </p>
                                    )}
                                    {storeOk && docs === 0 && (
                                        <p>
                                            No content indexed yet. Run{' '}
                                            <code className="bg-amber-500/20 px-1 rounded">
                                                python -m chatbot.ingest
                                            </code>
                                            .
                                        </p>
                                    )}
                                    {videoMode && !videoOk && (
                                        <p>
                                            Video renderer unavailable: {health.video_renderer.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={refreshHealth}
                                    className="flex-none text-amber-200 hover:text-amber-100"
                                    title="Re-check"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* Messages */}
                        <div
                            ref={listRef}
                            className="flex-1 overflow-y-auto py-2 bg-gradient-to-b from-slate-950/30 to-slate-950"
                        >
                            {messages.length === 0 ? (
                                <EmptyState onPick={(p) => sendMessage(p)} />
                            ) : (
                                messages.map((m) => (
                                    <ChatMessage
                                        key={m.id}
                                        message={m}
                                        onRequestVideo={requestVideoFor}
                                        videoModeEnabled={videoMode}
                                    />
                                ))
                            )}
                        </div>

                        <ChatInput onSend={sendMessage} onCancel={cancel} busy={busy} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
    return (
        <div className="px-4 py-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">VeriQuest Tutor</h3>
            <p className="mt-1 text-[12px] text-slate-500">
                Trained on this project + B.Tech electronics. Toggle{' '}
                <span className="text-fuchsia-300">Video</span> in the header to also get a short tutorial clip.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-1.5 text-left">
                {SUGGESTED_PROMPTS.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPick(p)}
                        className="text-[12px] text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/40 rounded-lg px-3 py-2 transition-colors"
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}
