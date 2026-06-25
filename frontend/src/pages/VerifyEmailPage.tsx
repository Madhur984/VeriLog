import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGamificationStore } from '../stores/gamificationStore';
import { BrandMark } from '../components/Brand';
import { ThemeToggle } from '../components/ThemeToggle';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, MailCheck } from 'lucide-react';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_S = 30;

/**
 * Dedicated email-verification screen. After registering, Supabase emails a
 * 6-digit one-time code (NOT a magic link — the "Confirm signup" template must
 * use {{ .Token }}). The user types the code here; `verifyOtp` confirms the
 * address and returns a real session, which is the gate that stops sign-ups with
 * fake/unowned email addresses.
 *
 * The email (and post-verify destination) arrive via router state from the
 * register form. On a hard refresh that state is lost, so the email field
 * becomes editable as a fallback.
 */
export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setFirstName = useGamificationStore((s) => s.setFirstName);
  const setHasSeenGreeting = useGamificationStore((s) => s.setHasSeenGreeting);

  const navState = (location.state ?? {}) as { email?: string; fullName?: string; from?: string };
  const redirectTo = navState.from || '/portal';
  const hadStateEmail = Boolean(navState.email);

  const [email, setEmail] = useState(navState.email ?? '');
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const code = useMemo(() => digits.join(''), [digits]);
  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  // Focus the first box on mount (only when we already know the email).
  useEffect(() => {
    if (hadStateEmail) inputsRef.current[0]?.focus();
  }, [hadStateEmail]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const verify = async (fullCode: string) => {
    if (!emailValid) { setError('Enter the email you registered with.'); return; }
    setVerifying(true);
    setError(null);
    setNotice(null);
    try {
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: fullCode,
        type: 'signup',
      });
      if (otpError) throw otpError;

      const token = data.session?.access_token;
      if (!token) throw new Error('Verification succeeded but no session was returned. Try signing in.');

      localStorage.setItem('supabase_token', token);
      const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>;
      const name = String(meta.full_name || navState.fullName || data.user?.email || 'Explorer');
      setFirstName(name.split(' ')[0]);
      setHasSeenGreeting(false);
      setSuccess(true);
      setTimeout(() => navigate(redirectTo, { replace: true }), 1100);
    } catch (err) {
      setVerifying(false);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
      const msg = err instanceof Error ? err.message : '';
      setError(
        /expired/i.test(msg) ? 'That code has expired. Request a new one below.'
          : /invalid|incorrect|token/i.test(msg) ? 'That code is not correct. Check your email and try again.'
            : msg || 'Verification failed. Please try again.',
      );
    }
  };

  // Auto-submit once all six digits are present.
  useEffect(() => {
    if (code.length === CODE_LENGTH && !verifying && !success) verify(code);
  }, [code]);

  const setDigit = (i: number, val: string) => {
    setDigits((prev) => { const next = [...prev]; next[i] = val; return next; });
  };

  const handleChange = (i: number, raw: string) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) { setDigit(i, ''); return; }
    // Typing into a box: take the last digit, advance.
    setDigit(i, clean[clean.length - 1]);
    if (i < CODE_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[i]) { setDigit(i, ''); return; }
      if (i > 0) { inputsRef.current[i - 1]?.focus(); setDigit(i - 1, ''); }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < CODE_LENGTH - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill('');
    for (let k = 0; k < pasted.length; k++) next[k] = pasted[k];
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const resend = async () => {
    if (cooldown > 0) return;
    if (!emailValid) { setError('Enter the email you registered with first.'); return; }
    setError(null);
    setNotice(null);
    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
      if (resendError) throw resendError;
      setNotice('A fresh code is on its way. Check your inbox (and spam).');
      setCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code. Try again in a moment.');
    }
  };

  const inputCls =
    'w-full rounded-xl px-4 py-3.5 text-[15px] outline-none transition-all bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/[0.06] dark:bg-white/[0.04] dark:border-white/15 dark:text-white dark:placeholder-slate-500 dark:focus:border-white/40 dark:focus:ring-white/[0.07]';

  return (
    <div className="relative w-full min-h-[100svh] bg-white text-slate-900 antialiased font-sans overflow-hidden dark:bg-[#0A0B12] dark:text-white selection:bg-[#F97316]/20">
      <div className="pointer-events-none absolute -left-40 -top-32 h-[55vh] w-[55vh] rounded-full bg-[#F97316]/[0.06] blur-[130px] dark:bg-[#F97316]/10" />
      <div className="pointer-events-none absolute -right-28 -bottom-24 h-[45vh] w-[45vh] rounded-full bg-[#6E7BFF]/[0.06] blur-[130px] dark:bg-[#4A57FF]/10" />

      <div className="absolute top-4 right-4 z-20"><ThemeToggle /></div>

      <main className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <a href="/" className="relative mx-auto mb-6 block w-fit">
            <span className="pointer-events-none absolute inset-0 -z-10 animate-pulse rounded-full bg-[#4A57FF]/25 blur-xl" />
            <BrandMark size={54} />
          </a>

          {!success ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316] dark:bg-[#F97316]/15">
                <MailCheck size={24} />
              </div>
              <h1 className="text-center text-[27px] font-extrabold leading-tight tracking-tight">Verify your email</h1>
              <p className="mx-auto mt-2 max-w-[340px] text-center text-[14px] text-slate-500 dark:text-slate-400">
                {hadStateEmail
                  ? <>We sent a {CODE_LENGTH}-digit code to <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>. Enter it below to activate your account.</>
                  : <>Enter the email you registered with and the {CODE_LENGTH}-digit code we sent you.</>}
              </p>

              {/* Editable email fallback (when router state was lost on refresh) */}
              {!hadStateEmail && (
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" autoComplete="email"
                  className={`${inputCls} mt-6`}
                />
              )}

              {/* 6-digit segmented code input */}
              <div className="mt-6 flex justify-center gap-2.5" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    type="text" inputMode="numeric" autoComplete="one-time-code"
                    maxLength={1} value={d} disabled={verifying}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    className="h-14 w-12 rounded-xl border text-center text-[22px] font-bold outline-none transition-all bg-white border-slate-300 text-slate-900 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/[0.06] disabled:opacity-50 dark:bg-white/[0.04] dark:border-white/15 dark:text-white dark:focus:border-white/40 dark:focus:ring-white/[0.07]"
                  />
                ))}
              </div>

              {notice && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-[13px] font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {notice}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-[13px] font-medium text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </motion.div>
              )}

              <button
                type="button" onClick={() => verify(code)} disabled={code.length !== CODE_LENGTH || verifying}
                className="group/sub mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_28px_-8px_rgba(15,23,42,0.5)] transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {verifying ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <>Verify &amp; continue <ArrowRight size={16} className="transition-transform group-hover/sub:translate-x-0.5" /></>}
              </button>

              <div className="mt-5 text-center text-[13px] text-slate-500 dark:text-slate-400">
                Didn’t get it?{' '}
                <button
                  type="button" onClick={resend} disabled={cooldown > 0}
                  className="font-bold text-slate-900 underline underline-offset-2 disabled:no-underline disabled:opacity-50 dark:text-white"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5 text-center dark:border-white/10">
                <button
                  type="button" onClick={() => navigate('/login', { replace: true })}
                  className="mx-auto flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft size={14} /> Wrong email? Go back
                </button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <CheckCircle2 size={30} />
              </div>
              <h1 className="text-[24px] font-extrabold tracking-tight">Email verified</h1>
              <p className="mt-2 flex items-center gap-2 text-[14px] text-slate-500 dark:text-slate-400">
                <Loader2 size={14} className="animate-spin" /> Loading your workspace…
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
