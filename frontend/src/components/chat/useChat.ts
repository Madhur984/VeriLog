import { useCallback, useEffect, useRef, useState } from 'react';

import {
    type ChatCitation,
    type ChatHealth,
    type VideoJob,
    fetchHealth,
    fetchVideoJob,
    startVideoJob,
    streamChat,
} from './api';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    citations?: ChatCitation[];
    streaming?: boolean;
    errored?: boolean;
    videoJobId?: string;
    videoUrl?: string | null;
    videoStatus?: VideoJob['status'];
    videoMessage?: string;
    videoProgress?: number;
    videoError?: string | null;
}

const STORAGE_KEY = 'veriquest-tutor:state:v1';

interface PersistedState {
    messages: ChatMessage[];
    videoMode: boolean;
    open: boolean;
    sessionId: string | null;
}

function loadState(): PersistedState {
    if (typeof window === 'undefined') {
        return { messages: [], videoMode: false, open: false, sessionId: null };
    }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) throw new Error('no state');
        const parsed = JSON.parse(raw) as PersistedState;
        return {
            messages: Array.isArray(parsed.messages) ? parsed.messages : [],
            videoMode: !!parsed.videoMode,
            open: !!parsed.open,
            sessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
        };
    } catch {
        return { messages: [], videoMode: false, open: false, sessionId: null };
    }
}

function persist(state: PersistedState) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // swallow quota errors
    }
}

function uid(): string {
    return Math.random().toString(36).slice(2, 10);
}

export function useChat() {
    const initial = loadState();
    const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
    const [videoMode, setVideoMode] = useState<boolean>(initial.videoMode);
    const [open, setOpen] = useState<boolean>(initial.open);
    const [sessionId, setSessionId] = useState<string | null>(initial.sessionId);
    const [busy, setBusy] = useState(false);
    const [health, setHealth] = useState<ChatHealth | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const pollTimers = useRef<Record<string, number>>({});

    useEffect(() => {
        persist({ messages, videoMode, open, sessionId });
    }, [messages, videoMode, open, sessionId]);

    const refreshHealth = useCallback(async () => {
        try {
            setHealth(await fetchHealth());
        } catch {
            setHealth(null);
        }
    }, []);

    useEffect(() => {
        if (open) refreshHealth();
    }, [open, refreshHealth]);

    const stopPolling = useCallback((messageId: string) => {
        const t = pollTimers.current[messageId];
        if (t) {
            window.clearTimeout(t);
            delete pollTimers.current[messageId];
        }
    }, []);

    const updateMessage = useCallback(
        (id: string, patch: Partial<ChatMessage>) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
            );
        },
        [],
    );

    const pollVideo = useCallback(
        (messageId: string, jobId: string) => {
            const tick = async () => {
                try {
                    const job = await fetchVideoJob(jobId);
                    updateMessage(messageId, {
                        videoStatus: job.status,
                        videoMessage: job.message,
                        videoProgress: job.progress,
                        videoUrl: job.video_url ?? null,
                        videoError: job.error ?? null,
                    });
                    if (job.status === 'done' || job.status === 'error') {
                        stopPolling(messageId);
                        return;
                    }
                } catch (e) {
                    updateMessage(messageId, {
                        videoError: (e as Error).message,
                        videoStatus: 'error',
                    });
                    stopPolling(messageId);
                    return;
                }
                pollTimers.current[messageId] = window.setTimeout(tick, 2500);
            };
            tick();
        },
        [stopPolling, updateMessage],
    );

    const launchVideo = useCallback(
        async (messageId: string, topic: string, answerHint?: string) => {
            try {
                updateMessage(messageId, {
                    videoStatus: 'queued',
                    videoMessage: 'Queued.',
                    videoProgress: 0,
                    videoError: null,
                });
                const job = await startVideoJob({
                    topic,
                    answer: answerHint,
                });
                updateMessage(messageId, { videoJobId: job.job_id });
                pollVideo(messageId, job.job_id);
            } catch (e) {
                updateMessage(messageId, {
                    videoStatus: 'error',
                    videoError: (e as Error).message,
                });
            }
        },
        [pollVideo, updateMessage],
    );

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || busy) return;

            // Build conversation history (only user/assistant text, exclude streaming flags).
            const history = messages
                .filter((m) => m.role === 'user' || m.role === 'assistant')
                .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

            const userMsg: ChatMessage = { id: uid(), role: 'user', content: text };
            const botMsg: ChatMessage = {
                id: uid(),
                role: 'assistant',
                content: '',
                streaming: true,
                citations: [],
            };
            setMessages((prev) => [...prev, userMsg, botMsg]);
            setBusy(true);

            const ctrl = new AbortController();
            abortRef.current = ctrl;
            let finalText = '';

            try {
                for await (const evt of streamChat(text, history, ctrl.signal, sessionId)) {
                    if (evt.type === 'session') {
                        setSessionId(evt.session_id);
                    } else if (evt.type === 'citations') {
                        updateMessage(botMsg.id, { citations: evt.citations });
                    } else if (evt.type === 'delta') {
                        finalText += evt.delta;
                        updateMessage(botMsg.id, { content: finalText });
                    } else if (evt.type === 'error') {
                        updateMessage(botMsg.id, {
                            content: finalText || `⚠️ ${evt.error}`,
                            errored: true,
                            streaming: false,
                        });
                        setBusy(false);
                        return;
                    } else if (evt.type === 'done') {
                        updateMessage(botMsg.id, { streaming: false });
                    }
                }
            } catch (e) {
                if ((e as Error).name !== 'AbortError') {
                    updateMessage(botMsg.id, {
                        content: finalText || `⚠️ ${(e as Error).message}`,
                        errored: true,
                        streaming: false,
                    });
                }
            } finally {
                setBusy(false);
            }

            if (
                videoMode &&
                !ctrl.signal.aborted &&
                health?.video_renderer?.available
            ) {
                launchVideo(botMsg.id, text, finalText);
            }
        },
        [busy, health, launchVideo, messages, sessionId, updateMessage, videoMode],
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setBusy(false);
    }, []);

    const clear = useCallback(() => {
        cancel();
        Object.keys(pollTimers.current).forEach((k) => stopPolling(k));
        setMessages([]);
        setSessionId(null);
    }, [cancel, stopPolling]);

    const requestVideoFor = useCallback(
        (messageId: string) => {
            const m = messages.find((x) => x.id === messageId);
            if (!m) return;
            // Use the preceding user message as the topic.
            const idx = messages.findIndex((x) => x.id === messageId);
            const userPrev = [...messages.slice(0, idx)].reverse().find((x) => x.role === 'user');
            const topic = userPrev?.content ?? m.content.slice(0, 120);
            launchVideo(messageId, topic, m.content);
        },
        [launchVideo, messages],
    );

    return {
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
    };
}
