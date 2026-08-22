import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X, Sparkles, ArrowRight } from 'lucide-react';
import { askAssistant, type AssistantMsg } from '../lib/assistant';
import { getPageContext } from '../lib/pageContext';
import { MODULE_LABELS, moduleLabel } from '../lib/moduleHistory';
import { getRouteMeta } from '../lib/routeMeta';
import ChatMarkdown from './ChatMarkdown';

const BASE = import.meta.env.BASE_URL;
const FACE = `${BASE}mascot/happy.png`;

interface Props {
  open: boolean;
  onClose: () => void;
  pathname: string;
  /** true on course-module routes, where a Back/Next footer bar sits at the bottom. */
  inModule?: boolean;
}

const SUGGESTIONS = ['Summarise this page', 'Give me a hint', 'Explain this simply', 'Take me to the K-Map Lab'];

/**
 * Non-module destinations VoltMonkey is allowed to send a student to. Mirrors
 * the SITE MAP in the backend's prompt (backend/src/voltmonkey/siteMap.ts) —
 * a model can always
 * hallucinate a plausible-looking path, and a redirect into a 404 is a much
 * worse experience than no redirect, so every target is checked against a real
 * route before we offer the button.
 */
const NAV_PAGES = new Set([
  '/', '/portal', '/profile', '/settings', '/career-roadmap', '/silicon-map', '/silicon-secrets',
  '/library', '/analogies', '/verilog-library', '/verilog-playground', '/hw-leetcode', '/workbench',
  '/kmap-lab', '/logic-studio', '/signal-playground', '/fsm', '/boss-arena', '/gatekeeper-game',
  '/debug-mission', '/interview-prep', '/community', '/ai-lab', '/pledge',
]);

/** A real, linkable destination? Returns its human label, or null to ignore it. */
function resolveNavTarget(path: string): string | null {
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const moduleId = clean.replace(/^\//, '');
  if (MODULE_LABELS[moduleId]) return moduleLabel(moduleId);
  if (NAV_PAGES.has(clean)) return getRouteMeta(clean).label;
  return null;
}
const FALLBACK = "Hey, I'm VoltMonkey ⚡ — ask me anything about this page or the curriculum!";

/**
 * VoltMonkey's chat panel — a neo-brutalist assistant window that opens from the
 * mascot. On open it streams an AI summary of the current page; students can
 * then ask curriculum questions. All model calls go through the VoltMonkey
 * Express backend (backend/src/voltmonkey/), which keeps provider keys
 * server-side and streams the reply token-by-token.
 */
export const AssistantPanel: React.FC<Props> = ({ open, onClose, pathname, inModule }) => {
  const [messages, setMessages] = useState<AssistantMsg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqId = useRef(0); // only the latest request may write to state
  const lastSummarised = useRef(''); // route we've already summarised
  const navigate = useNavigate();
  // A pending "go here?" offer from VoltMonkey. Deliberately NOT an automatic
  // redirect: yanking a student off the page they're reading — mid-lesson, on a
  // model's guess — is hostile. One tap, their choice.
  const [navTo, setNavTo] = useState<{ path: string; label: string } | null>(null);

  const offerNav = (path: string) => {
    const label = resolveNavTarget(path);
    if (label) setNavTo({ path, label });
  };

  const goNav = () => {
    if (!navTo) return;
    const to = navTo.path;
    setNavTo(null);
    onClose();
    navigate(to);
  };

  // Append a streamed chunk to the last (assistant) message.
  const pushDelta = (delta: string) =>
    setMessages((m) => {
      if (!m.length) return [{ role: 'assistant', content: delta }];
      const copy = [...m];
      const i = copy.length - 1;
      if (copy[i].role === 'assistant') copy[i] = { ...copy[i], content: copy[i].content + delta };
      return copy;
    });

  // Replace the last assistant message's content only if it's still empty (used
  // for graceful error/fallback text after a failed stream).
  const fillLastIfEmpty = (text: string) =>
    setMessages((m) => {
      const copy = [...m];
      const i = copy.length - 1;
      if (i >= 0 && copy[i].role === 'assistant') copy[i] = { ...copy[i], content: copy[i].content || text };
      return copy;
    });

  // Auto-scroll to the newest content.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  // On open (and on route change while open), stream a fresh page summary once.
  // Deps are ONLY [open, pathname] — depending on state we set inside (busy /
  // summarised) would re-run the effect, cancel its own in-flight request, and
  // leave the panel stuck on the typing dots forever.
  useEffect(() => {
    if (!open || lastSummarised.current === pathname) return;
    lastSummarised.current = pathname;
    const myId = ++reqId.current;
    const mine = () => reqId.current === myId;
    setBusy(true);
    setMessages([{ role: 'assistant', content: '' }]);
    askAssistant({ messages: [], pageContext: getPageContext(pathname), mode: 'summary', onDelta: (d) => { if (mine()) pushDelta(d); } })
      .catch(() => { /* fall through to the fallback in finally */ })
      .finally(() => { if (mine()) { fillLastIfEmpty(FALLBACK); setBusy(false); setTimeout(() => inputRef.current?.focus(), 50); } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pathname]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    const base: AssistantMsg[] = [...messages.filter((m) => m.content), { role: 'user', content: q }];
    setMessages([...base, { role: 'assistant', content: '' }]);
    setBusy(true);
    setNavTo(null);
    const myId = ++reqId.current;
    const mine = () => reqId.current === myId;
    try {
      await askAssistant({
        messages: base,
        pageContext: getPageContext(pathname),
        mode: 'chat',
        onDelta: (d) => { if (mine()) pushDelta(d); },
        onNavigate: (p) => { if (mine()) offerNav(p); },
      });
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
          className={`pointer-events-auto fixed right-4 z-[400] flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-[20px] border-[3px] border-[#1B1436] bg-[#F1ECFF] font-sans shadow-[6px_6px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#0F0B1E] dark:shadow-[6px_6px_0_#7A3FD0] ${
            inModule ? 'bottom-24 lg:bottom-28' : 'bottom-4'
          }`}
          style={{ height: 'min(72svh, 540px)' }}
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
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B5E86] dark:text-[#8E80B4]">AI study buddy</div>
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
            {visible.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl border-[2.5px] border-[#1B1436] px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#7A3FD0] ${
                    m.role === 'user'
                      ? 'bg-[#7A3FD0] font-medium text-white'
                      : 'bg-white text-[#1B1436] dark:bg-[#1B1540] dark:text-[#E9E4FA]'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <ChatMarkdown text={m.content} />
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Navigation offer — VoltMonkey found a page; the student decides. */}
            <AnimatePresence>
              {navTo && !busy && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="flex justify-start"
                >
                  <button
                    type="button"
                    onClick={goNav}
                    aria-label={`Go to ${navTo.label}`}
                    className="group inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-[#1B1436] bg-[#FF7A1A] px-4 py-2 text-white shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-y-[2px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#7A3FD0]"
                  >
                    <span className="text-[13px] font-bold">Go there</span>
                    <ArrowRight size={15} className="flex-shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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

            {/* Suggestion chips (only before the student has asked anything) */}
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
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
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
