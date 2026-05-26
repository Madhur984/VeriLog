import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, FileText, Play, Sparkles, User, Video } from 'lucide-react';

import { cn } from '../../lib/utils';
import { videoFileUrl } from './api';
import type { ChatMessage as ChatMessageT } from './useChat';

interface Props {
    message: ChatMessageT;
    onRequestVideo: (id: string) => void;
    videoModeEnabled: boolean;
}

const STATUS_LABEL: Record<NonNullable<ChatMessageT['videoStatus']>, string> = {
    queued: 'Queued',
    rendering_storyboard: 'Writing storyboard',
    rendering_slides: 'Rendering slides',
    rendering_audio: 'Synthesizing voice',
    composing: 'Composing video',
    done: 'Ready',
    error: 'Failed',
};

export function ChatMessage({ message, onRequestVideo, videoModeEnabled }: Props) {
    const [showCites, setShowCites] = useState(false);
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={cn(
                'flex gap-2 px-3 py-2',
                isUser ? 'justify-end' : 'justify-start',
            )}
        >
            {!isUser && (
                <div className="flex-none w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                </div>
            )}

            <div className={cn('max-w-[82%] flex flex-col gap-2', isUser && 'items-end')}>
                <div
                    className={cn(
                        'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
                        isUser
                            ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-100 rounded-br-md'
                            : 'bg-slate-800/60 border border-slate-700/60 text-slate-100 rounded-bl-md',
                        message.errored && 'border-red-500/60 text-red-200 bg-red-950/30',
                    )}
                >
                    {message.content || (message.streaming ? 'Thinking…' : ' ')}
                    {message.streaming && (
                        <span className="inline-block w-1 h-3.5 align-middle ml-0.5 bg-cyan-300 animate-pulse" />
                    )}
                </div>

                {/* Citations */}
                {!isUser && message.citations && message.citations.length > 0 && (
                    <div className="w-full">
                        <button
                            onClick={() => setShowCites((v) => !v)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                            <FileText className="w-3 h-3" />
                            {message.citations.length} source
                            {message.citations.length === 1 ? '' : 's'}
                            <ChevronDown
                                className={cn(
                                    'w-3 h-3 transition-transform',
                                    showCites && 'rotate-180',
                                )}
                            />
                        </button>
                        {showCites && (
                            <ul className="mt-1.5 space-y-1.5 text-[11px] text-slate-400">
                                {message.citations.map((c, i) => (
                                    <li
                                        key={`${c.source_path}-${i}`}
                                        className="rounded-md border border-slate-700/60 bg-slate-900/40 px-2 py-1.5"
                                    >
                                        <div className="flex items-center justify-between gap-2 font-mono text-cyan-300/80">
                                            <span className="truncate">{c.title}</span>
                                            <span className="flex-none text-slate-500">
                                                {(c.similarity * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-slate-400 line-clamp-2">
                                            {c.snippet}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Video panel */}
                {!isUser && !message.streaming && !message.errored && (
                    <VideoPanel
                        message={message}
                        onRequestVideo={onRequestVideo}
                        videoModeEnabled={videoModeEnabled}
                    />
                )}
            </div>

            {isUser && (
                <div className="flex-none w-7 h-7 rounded-full bg-slate-700/60 border border-slate-600/60 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
            )}
        </motion.div>
    );
}

function VideoPanel({
    message,
    onRequestVideo,
    videoModeEnabled,
}: {
    message: ChatMessageT;
    onRequestVideo: (id: string) => void;
    videoModeEnabled: boolean;
}) {
    const status = message.videoStatus;

    // Manual-opt-in button removed — header toggle is the single entry point
    // and is itself disabled when the renderer isn't available.
    if (!status) {
        return null;
    }

    if (!status) return null;

    if (status === 'done' && message.videoUrl) {
        return (
            <div className="w-full rounded-lg overflow-hidden border border-cyan-400/30 bg-black/60">
                <video
                    src={videoFileUrl(message.videoUrl)}
                    controls
                    playsInline
                    className="w-full max-h-72"
                />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="w-full rounded-md border border-red-500/40 bg-red-950/30 text-[11px] text-red-200 px-2 py-1.5">
                Video render failed: {message.videoError ?? 'unknown error'}
                <button
                    onClick={() => onRequestVideo(message.id)}
                    className="ml-2 underline hover:text-red-100"
                >
                    Retry
                </button>
            </div>
        );
    }

    const pct = Math.round((message.videoProgress ?? 0) * 100);
    return (
        <div className="w-full rounded-md border border-cyan-400/30 bg-slate-900/50 px-2.5 py-2">
            <div className="flex items-center justify-between text-[11px] text-cyan-300">
                <span className="flex items-center gap-1.5">
                    <Play className="w-3 h-3 animate-pulse" />
                    {STATUS_LABEL[status]}
                </span>
                <span className="text-slate-400">{pct}%</span>
            </div>
            <div className="mt-1 h-1 w-full bg-slate-800 rounded overflow-hidden">
                <div
                    className="h-full bg-cyan-400 transition-all"
                    style={{ width: `${Math.max(5, pct)}%` }}
                />
            </div>
            {message.videoMessage && (
                <p className="mt-1 text-[10px] text-slate-500 truncate">
                    {message.videoMessage}
                </p>
            )}
        </div>
    );
}
