import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Star, X, CheckCircle2 } from 'lucide-react';
import { submitFeedback } from '../lib/feedback';

interface Props {
  open: boolean;
  onClose: () => void;
  pathname: string;
  /** true on course-module routes, where a Back/Next footer bar sits at the bottom. */
  inModule?: boolean;
}

/**
 * The feedback form that opens from the footer FeedbackBubble. Submissions go
 * to the `feedback` Edge Function, which saves them in Supabase and forwards
 * them to the team's OneDrive Excel sheet.
 */
export const FeedbackPanel: React.FC<Props> = ({ open, onClose, pathname, inModule }) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => textRef.current?.focus(), 80);
  }, [open]);

  // Reset to a blank form a moment after it closes, and after showing "sent".
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setMessage(''); setRating(null); setHoverRating(null); setName(''); setEmail('');
      setError(''); setSent(false);
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError('');
    try {
      await submitFeedback({ message: trimmed, rating, displayName: name.trim(), email: email.trim(), page: pathname });
      setSent(true);
      setTimeout(onClose, 1700);
    } catch (err: any) {
      setError(err?.message || 'Could not send feedback — try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="feedback-panel"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto fixed left-4 z-[400] flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-[20px] border-[3px] border-[#1B1436] bg-[#F1ECFF] font-sans shadow-[6px_6px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#0F0B1E] dark:shadow-[6px_6px_0_#7A3FD0] ${
            inModule ? 'bottom-24 lg:bottom-28' : 'bottom-4'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1B1436] bg-white px-4 py-3 dark:border-[#4A3D7A] dark:bg-[#1B1540]">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-[2.5px] border-[#1B1436] bg-[#FF7A1A] shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#7A3FD0]">
              <Send size={17} className="text-white" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-[#1B1436] dark:text-white">Feedback</div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B5E86] dark:text-[#8E80B4]">
                Help us improve BitForBytes
              </div>
            </div>
            <button
              type="button" onClick={onClose} aria-label="Close feedback form"
              className="grid h-8 w-8 place-items-center rounded-lg border-[2.5px] border-[#1B1436] bg-white text-[#1B1436] shadow-[2px_2px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[2px_2px_0_#7A3FD0]"
            >
              <X size={16} />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-2.5 px-6 py-10 text-center">
              <CheckCircle2 size={36} className="text-emerald-500" />
              <p className="text-[15px] font-bold text-[#1B1436] dark:text-white">Thanks — got it! 🎉</p>
              <p className="text-[12.5px] text-[#6B5E86] dark:text-[#8E80B4]">Your feedback helps us build a better BitForBytes.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 px-4 py-4">
              {/* Star rating */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = (hoverRating ?? rating ?? 0) >= n;
                  return (
                    <button
                      key={n} type="button" aria-label={`Rate ${n} out of 5`}
                      onClick={() => setRating(rating === n ? null : n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-0.5"
                    >
                      <Star size={20} className={filled ? 'fill-[#FF7A1A] text-[#FF7A1A]' : 'text-[#C9BEE8] dark:text-[#4A3D7A]'} />
                    </button>
                  );
                })}
                <span className="ml-1 font-mono text-[10px] text-[#6B5E86] dark:text-[#8E80B4]">optional</span>
              </div>

              <textarea
                ref={textRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's working? What's confusing? What would you fix?"
                rows={4}
                maxLength={4000}
                required
                className="w-full resize-none rounded-xl border-[2.5px] border-[#1B1436] bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[#1B1436] placeholder-[#8B7FB0] shadow-[2px_2px_0_#1B1436] outline-none focus:border-[#7A3FD0] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:text-[#E9E4FA] dark:placeholder-[#7A6DA0] dark:shadow-[2px_2px_0_#7A3FD0] dark:focus:border-[#B98BFF]"
              />

              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  maxLength={120}
                  className="min-w-0 flex-1 rounded-xl border-[2.5px] border-[#1B1436] bg-white px-3 py-2 text-[13px] text-[#1B1436] placeholder-[#8B7FB0] shadow-[2px_2px_0_#1B1436] outline-none focus:border-[#7A3FD0] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:text-[#E9E4FA] dark:placeholder-[#7A6DA0] dark:shadow-[2px_2px_0_#7A3FD0] dark:focus:border-[#B98BFF]"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email (optional)"
                  maxLength={200}
                  className="min-w-0 flex-1 rounded-xl border-[2.5px] border-[#1B1436] bg-white px-3 py-2 text-[13px] text-[#1B1436] placeholder-[#8B7FB0] shadow-[2px_2px_0_#1B1436] outline-none focus:border-[#7A3FD0] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:text-[#E9E4FA] dark:placeholder-[#7A6DA0] dark:shadow-[2px_2px_0_#7A3FD0] dark:focus:border-[#B98BFF]"
                />
              </div>

              {error && <p className="text-[12px] font-semibold text-rose-500">{error}</p>}

              <button
                type="submit" disabled={busy || !message.trim()}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] px-4 py-2.5 text-[13.5px] font-bold text-white shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-40 dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#3A2064]"
              >
                <Send size={15} /> {busy ? 'Sending…' : 'Send feedback'}
              </button>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackPanel;
