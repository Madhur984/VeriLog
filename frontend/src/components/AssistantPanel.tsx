import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X, Sparkles, Compass, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { askAssistant, type AssistantMsg } from '../lib/assistant';
import { getPageContext } from '../lib/pageContext';

const BASE = import.meta.env.BASE_URL;
const FACE = `${BASE}mascot/happy.png`;

interface Props {
  open: boolean;
  onClose: () => void;
  pathname: string;
  inModule?: boolean;
  /** Global configuration for navigation behavior */
  autoNavigate?: boolean;
  openInNewTab?: boolean;
}

export interface NavigationPayload {
  type: 'navigate';
  path: string;
  message?: string;
  confidence?: number;
}

const SUGGESTIONS = ['Summarise this page', 'Take me to verilog playground', 'Explain logic gates', 'Go to course portal'];
const FALLBACK = "Hey, I'm VoltMonkey ⚡ — ask me anything about this page or the curriculum!";

/** Safely parses navigation JSON from assistant responses. */
export function parseNavigationPayload(content: string): NavigationPayload | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*"type"\s*:\s*"navigate"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.type === 'navigate' && typeof parsed.path === 'string') {
        return parsed as NavigationPayload;
      }
    }
  } catch {
    /* Non-JSON text content */
  }
  return null;
}

/** Resolves relative vs absolute paths */
export function normalizePath(path: string): { isExternal: boolean; url: string } {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return { isExternal: true, url: path };
  }
  return { isExternal: false, url: path.startsWith('/') ? path : `/${path}` };
}

/** Component rendered when a Navigation Action is received */
const NavigationResponseCard: React.FC<{
  nav: NavigationPayload;
  autoNavigateConfig?: boolean;
  openInNewTabConfig?: boolean;
}> = ({ nav, autoNavigateConfig = true, openInNewTabConfig = false }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(autoNavigateConfig ? 2 : null);
  const [redirected, setRedirected] = useState(false);
  const { isExternal, url } = normalizePath(nav.path);

  const executeNavigation = () => {
    setRedirected(true);
    if (isExternal || openInNewTabConfig) {
      window.open(url, openInNewTabConfig ? '_blank' : '_self');
    } else {
      navigate(url);
    }
  };

  useEffect(() => {
    if (!autoNavigateConfig || redirected) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          executeNavigation();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoNavigateConfig, redirected, url]);

  return (
    <div className="space-y-2 rounded-xl border-[2px] border-[#1B1436] bg-white p-3 shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:shadow-[3px_3px_0_#7A3FD0]">
      <div className="flex items-center gap-2 font-bold text-[#1B1436] dark:text-white">
        <Compass size={18} className="text-[#7A3FD0] dark:text-[#B98BFF]" />
        <span>{nav.message || `Navigating to ${nav.path}...`}</span>
      </div>

      {nav.confidence && (
        <div className="text-[11px] font-semibold text-[#6B5E86] dark:text-[#8E80B4]">
          Match Confidence: {Math.round(nav.confidence * 100)}%
        </div>
      )}

      {/* Auto-Navigation Toast Indicator */}
      {autoNavigateConfig && countdown !== null && !redirected && (
        <div className="flex items-center gap-2 rounded-lg bg-[#F1ECFF] px-2.5 py-1.5 text-[12px] font-medium text-[#7A3FD0] dark:bg-[#2A1F52] dark:text-[#B98BFF]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7A3FD0] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7A3FD0]"></span>
          </span>
          <span>Redirecting automatically in {countdown}s...</span>
        </div>
      )}

      {redirected && (
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={14} /> Redirecting now!
        </div>
      )}

      {/* Manual Fallback Action Button */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={executeNavigation}
          className="flex items-center gap-1.5 rounded-lg border-[2px] border-[#1B1436] bg-[#7A3FD0] px-3 py-1.5 text-[12px] font-bold text-white shadow-[2px_2px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:shadow-[2px_2px_0_#3A2064]"
        >
          <span>Go there</span>
          {isExternal ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
        </button>

        {autoNavigateConfig && !redirected && (
          <button
            type="button"
            onClick={() => setCountdown(null)}
            className="rounded-lg border-[1.5px] border-slate-300 px-2.5 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel Auto-Redirect
          </button>
        )}
      </div>
    </div>
  );
};

export const AssistantPanel: React.FC<Props> = ({
  open,
  onClose,
  pathname,
  inModule,
  autoNavigate = true,
  openInNewTab = false
}) => {
  const [messages, setMessages] = useState<AssistantMsg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqId = useRef(0);
  const lastSummarised = useRef('');

  const pushDelta = (delta: string) =>
    setMessages((m) => {
      if (!m.length) return [{ role: 'assistant', content: delta }];
      const copy = [...m];
      const i = copy.length - 1;
      if (copy[i].role === 'assistant') copy[i] = { ...copy[i], content: copy[i].content + delta };
      return copy;
    });

  const fillLastIfEmpty = (text: string) =>
    setMessages((m) => {
      const copy = [...m];
      const i = copy.length - 1;
      if (i >= 0 && copy[i].role === 'assistant') copy[i] = { ...copy[i], content: copy[i].content || text };
      return copy;
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (!open || lastSummarised.current === pathname) return;
    lastSummarised.current = pathname;
    const myId = ++reqId.current;
    const mine = () => reqId.current === myId;
    setBusy(true);
    setMessages([{ role: 'assistant', content: '' }]);
    askAssistant({ messages: [], pageContext: getPageContext(pathname), mode: 'summary', onDelta: (d) => { if (mine()) pushDelta(d); } })
      .catch(() => {})
      .finally(() => { if (mine()) { fillLastIfEmpty(FALLBACK); setBusy(false); setTimeout(() => inputRef.current?.focus(), 50); } });
  }, [open, pathname]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    const base: AssistantMsg[] = [...messages.filter((m) => m.content), { role: 'user', content: q }];
    setMessages([...base, { role: 'assistant', content: '' }]);
    setBusy(true);
    const myId = ++reqId.current;
    const mine = () => reqId.current === myId;
    try {
      await askAssistant({ messages: base, pageContext: getPageContext(pathname), mode: 'chat', onDelta: (d) => { if (mine()) pushDelta(d); } });
      if (mine()) fillLastIfEmpty("Hmm, I blanked for a second — try asking that again? ⚡");
    } catch (e: any) {
      if (mine()) fillLastIfEmpty(`⚠️ ${e?.message || 'I could not reach my brain just now. Try again in a moment.'}`);
    } finally {
      if (mine()) {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  const visible = messages.filter((m) => m.content);
  const waiting = busy && !messages[messages.length - 1]?.content;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="assistant-panel"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto fixed right-4 z-[70] flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-[20px] border-[3px] border-[#1B1436] bg-[#F1ECFF] font-sans shadow-[6px_6px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#0F0B1E] dark:shadow-[6px_6px_0_#7A3FD0] ${
            inModule ? 'bottom-24 lg:bottom-28' : 'bottom-4'
          }`}
          style={{ height: 'min(72vh, 540px)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1B1436] bg-white px-4 py-3 dark:border-[#4A3D7A] dark:bg-[#1B1540]">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border-[2.5px] border-[#1B1436] bg-[#F1ECFF] shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:shadow-[3px_3px_0_#7A3FD0]">
              <img src={FACE} alt="VoltMonkey" draggable={false} className="h-8 w-8 select-none object-contain" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[15px] font-bold text-[#1B1436] dark:text-white">
                VoltMonkey <Sparkles size={13} className="text-[#FF7A1A]" />
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B5E86] dark:text-[#8E80B4]">AI study buddy & navigator</div>
            </div>
            <button
              type="button" onClick={onClose} aria-label="Close assistant"
              className="grid h-8 w-8 place-items-center rounded-lg border-[2.5px] border-[#1B1436] bg-white text-[#1B1436] shadow-[2px_2px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[2px_2px_0_#7A3FD0]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {visible.map((m, i) => {
              const navPayload = m.role === 'assistant' ? parseNavigationPayload(m.content) : null;

              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[88%] font-sans text-[13.5px] leading-relaxed">
                    {navPayload ? (
                      <NavigationResponseCard
                        nav={navPayload}
                        autoNavigateConfig={autoNavigate}
                        openInNewTabConfig={openInNewTab}
                      />
                    ) : (
                      <div
                        className={`whitespace-pre-wrap rounded-2xl border-[2.5px] border-[#1B1436] px-3.5 py-2.5 shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#7A3FD0] ${
                          m.role === 'user'
                            ? 'bg-[#7A3FD0] font-medium text-white'
                            : 'bg-white text-[#1B1436] dark:bg-[#1B1540] dark:text-[#E9E4FA]'
                        }`}
                      >
                        {m.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {waiting && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border-[2.5px] border-[#1B1436] bg-white px-4 py-3 shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:shadow-[3px_3px_0_#7A3FD0]">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-2 w-2 rounded-full bg-[#7A3FD0] dark:bg-[#B98BFF]"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion chips */}
            {!busy && visible.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s} type="button" onClick={() => send(s)}
                    className="rounded-full border-[2px] border-[#1B1436] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1B1436] shadow-[2px_2px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[2px_2px_0_#7A3FD0]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t-[3px] border-[#1B1436] bg-white px-3 py-3 dark:border-[#4A3D7A] dark:bg-[#1B1540]"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask VoltMonkey anything…"
              className="min-w-0 flex-1 rounded-xl border-[2.5px] border-[#1B1436] bg-white px-3.5 py-2.5 text-[14px] text-[#1B1436] placeholder-[#8B7FB0] shadow-[2px_2px_0_#1B1436] outline-none focus:border-[#7A3FD0] dark:border-[#4A3D7A] dark:bg-[#0F0B1E] dark:text-white dark:placeholder-[#7A6DA0] dark:shadow-[2px_2px_0_#7A3FD0] dark:focus:border-[#B98BFF]"
            />
            <button
              type="submit" disabled={busy || !input.trim()} aria-label="Send"
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] text-white shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-y-[2px] active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-40 dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#3A2064]"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssistantPanel;
