import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';

/**
 * Password-recovery landing. The recovery email links here; Supabase parses the
 * recovery token from the URL into a session, then the user sets a new password
 * via updateUser(). Reachable at /reset-password (public — the user may not have
 * an app token yet when they arrive).
 */
export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Expired/used links land here with the error in the hash, e.g.
  // #error=access_denied&error_code=otp_expired&error_description=... — surface it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const desc = params.get('error_description');
    if (desc) setLinkError(desc.replace(/\+/g, ' '));
  }, []);

  // Confirm a recovery session actually exists (otherwise the link was stale).
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setHasSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!cancelled && session) setHasSession(true);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  // No (or not-yet-confirmed) recovery session: lock the form so submitting
  // can't surface a raw "Auth session missing!" error.
  const formDisabled = hasSession !== true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) throw updErr;
      setDone(true);
      setTimeout(() => navigate('/portal', { replace: true }), 1400);
    } catch (err: any) {
      setError(err.message || 'Could not update password. The recovery link may have expired.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100svh] bg-[#03050a] text-slate-200 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-[420px] bg-[#090e1a] border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">Set new password</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Choose a new password for your account.
          </p>
        </div>

        {linkError && !done && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono p-3 rounded-xl">
            {linkError}. Please{' '}
            <button type="button" onClick={() => navigate('/login')} className="underline font-bold">request a new reset link</button>.
          </div>
        )}

        {!linkError && hasSession === false && !done && (
          <div className="bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-mono p-3 rounded-xl">
            No active recovery session found. Open the reset link from your email again, or{' '}
            <button type="button" onClick={() => navigate('/login')} className="underline font-bold">request a new one</button>.
          </div>
        )}

        {done ? (
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Password updated</div>
              <p className="text-slate-400 text-xs mt-1">Redirecting you to your workspace…</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left text-sm">
            <div className="space-y-2">
              <label htmlFor="rp-pass" className="text-[13px] font-mono text-slate-400 uppercase tracking-wider font-bold block">New password</label>
              <div className="relative">
                <input
                  id="rp-pass"
                  type={show ? 'text' : 'password'}
                  required
                  minLength={6}
                  disabled={formDisabled}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#03050a] border border-slate-800 rounded-xl pl-4 pr-11 py-3.5 text-slate-200 font-mono text-[15px] placeholder-slate-700 disabled:opacity-50"
                />
                <button
                  type="button"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-confirm" className="text-[13px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Confirm password</label>
              <input
                id="rp-confirm"
                type={show ? 'text' : 'password'}
                required
                minLength={6}
                disabled={formDisabled}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-[#03050a] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 font-mono text-[15px] placeholder-slate-700 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono p-3 rounded-xl">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || formDisabled}
              className="w-full bg-white text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-[15px] disabled:opacity-50"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <>Update password <ArrowRight size={15} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
