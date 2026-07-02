import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, LogOut, Check, Loader2, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/auth';
import { useColorScheme } from '../hooks/useColorScheme';
import { ThemeToggle } from '../components/ThemeToggle';

/**
 * Account settings — wired from the "Settings" tile in the portal DiagnosticConsole.
 *
 * Real Supabase users can change their display name, email and password, and sign
 * out. Guests (no real account) get their local display name plus a prompt to make
 * a real account; "Exit guest session" clears the local session and returns to login.
 */
export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const session = getSession();
  const isGuest = session.kind === 'guest';

  const [name, setName] = useState(session.displayName ?? '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(!isGuest);

  // Per-section saving + result state so each card gives its own feedback.
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  useEffect(() => {
    if (isGuest) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error || !data.user) {
        // Stale Supabase session (e.g. expired refresh token): every save
        // would fail, so clear it and send the user back to login.
        clearSession();
        navigate('/login', { replace: true });
        return;
      }
      setEmail(data.user.email ?? '');
      const fullName = (data.user.user_metadata?.full_name as string) || '';
      if (fullName) setName(fullName);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [isGuest, navigate]);

  const flash = (kind: 'ok' | 'err', msg: string) => {
    setNotice({ kind, msg });
    window.clearTimeout((flash as any)._t);
    (flash as any)._t = window.setTimeout(() => setNotice(null), 4000);
  };

  const saveName = async () => {
    if (name.trim().length < 2) { flash('err', 'Name needs at least 2 characters.'); return; }
    setSavingName(true);
    try {
      if (isGuest) {
        try { localStorage.setItem('guest_name', name.trim()); } catch { /* ignore */ }
        flash('ok', 'Name updated.');
      } else {
        const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
        if (error) throw error;
        flash('ok', 'Name updated.');
      }
    } catch (e: any) {
      flash('err', e?.message || 'Could not update your name.');
    } finally {
      setSavingName(false);
    }
  };

  const saveEmail = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { flash('err', 'Enter a valid email.'); return; }
    setSavingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser(
        { email: email.trim() },
        { emailRedirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/settings` },
      );
      if (error) throw error;
      flash('ok', 'Confirmation links sent to both your current and new email. Open both to finish the change.');
    } catch (e: any) {
      flash('err', e?.message || 'Could not update your email.');
    } finally {
      setSavingEmail(false);
    }
  };

  const savePassword = async () => {
    if (password.length < 6) { flash('err', 'Password needs at least 6 characters.'); return; }
    setSavingPwd(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword('');
      flash('ok', 'Password changed.');
    } catch (e: any) {
      flash('err', e?.message || 'Could not change your password.');
    } finally {
      setSavingPwd(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      // On a network failure the server-side sign-out can fail while the local
      // sb-* session survives; clear it locally so the boot bridge cannot
      // silently sign the user back in on the next load.
      if (error) { await supabase.auth.signOut({ scope: 'local' }); }
    } catch { /* ignore */ }
    clearSession();
    navigate('/login', { replace: true });
  };

  // ── theme tokens ──
  const pageBg = isLight
    ? 'radial-gradient(ellipse 120% 90% at 50% 0%, #DDE4EC 0%, #EEF1F5 75%)'
    : 'radial-gradient(ellipse 120% 90% at 50% 0%, #0d1526 0%, #06090f 80%)';
  const cardStyle: React.CSSProperties = {
    background: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(7,10,18,0.92)',
    border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(59,130,246,0.18)',
    boxShadow: isLight
      ? '0 18px 44px rgba(15,23,42,0.10), 0 0 0 1px rgba(15,23,42,0.04)'
      : '0 24px 60px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.03)',
  };
  const labelCls = `text-[11px] font-black uppercase tracking-[0.2em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`;
  const inputCls = `mt-2 w-full rounded-xl px-4 py-3 text-[15px] font-medium outline-none transition-colors ${
    isLight
      ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-sky-500 focus:bg-white'
      : 'bg-white/[0.04] border border-white/10 text-slate-100 focus:border-blue-500'
  }`;
  const accentBtn = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-bold transition-all active:scale-[0.98] disabled:opacity-60 ${
    isLight ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-blue-600 text-white hover:bg-blue-500'
  }`;
  const headingCls = isLight ? 'text-slate-900' : 'text-white';
  const subCls = isLight ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className="min-h-[100svh] w-full font-sans transition-colors duration-300" style={{ background: pageBg }}>
      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-bg-elev"
        style={{ borderBottom: isLight ? '1px solid rgba(15,23,42,0.08)' : '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => navigate('/portal')}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
            isLight
              ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              : 'bg-white/[0.05] border border-white/10 text-slate-200 hover:bg-white/10'
          }`}
        >
          <ArrowLeft size={16} /> Portal
        </button>
        <ThemeToggle variant="minimal" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 sm:px-8 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-extrabold tracking-tight ${headingCls}`}
        >
          Settings
        </motion.h1>
        <p className={`mt-1 text-[15px] ${subCls}`}>
          {isGuest ? 'You are browsing as a guest.' : 'Manage your account and how you sign in.'}
        </p>

        {/* Notice banner */}
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold ${
              notice.kind === 'ok'
                ? (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25')
                : (isLight ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-rose-500/10 text-rose-300 border border-rose-500/25')
            }`}
          >
            {notice.kind === 'ok' ? <Check size={16} /> : <ShieldAlert size={16} />}
            {notice.msg}
          </motion.div>
        )}

        {isGuest && (
          <div className="mt-5 rounded-2xl p-5" style={cardStyle}>
            <div className={`text-[15px] font-bold ${headingCls}`}>Make it permanent</div>
            <p className={`mt-1 text-[14px] ${subCls}`}>
              Create a real account to save your progress, unlock every module, and sign in from any device.
            </p>
            <button onClick={() => navigate('/login')} className={`${accentBtn} mt-4`}>Create an account</button>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {/* Display name */}
          <section className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
            <div className="flex items-center gap-2">
              <User size={18} className={isLight ? 'text-sky-600' : 'text-blue-400'} />
              <h2 className={`text-[16px] font-bold ${headingCls}`}>Display name</h2>
            </div>
            <label className={`mt-4 block ${labelCls}`}>Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <div className="mt-4">
              <button onClick={saveName} disabled={savingName} className={accentBtn}>
                {savingName ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save name
              </button>
            </div>
          </section>

          {/* Email + password — real accounts only */}
          {!isGuest && (
            <>
              <section className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
                <div className="flex items-center gap-2">
                  <Mail size={18} className={isLight ? 'text-sky-600' : 'text-blue-400'} />
                  <h2 className={`text-[16px] font-bold ${headingCls}`}>Email</h2>
                </div>
                <label className={`mt-4 block ${labelCls}`}>Email address</label>
                <input
                  className={inputCls} type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={loading ? 'Loading…' : 'you@example.com'} disabled={loading}
                />
                <p className={`mt-2 text-[12px] ${subCls}`}>Changing this sends confirmation links to both your current and new address. You must open both to complete the change.</p>
                <div className="mt-4">
                  <button onClick={saveEmail} disabled={savingEmail || loading} className={accentBtn}>
                    {savingEmail ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Update email
                  </button>
                </div>
              </section>

              <section className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
                <div className="flex items-center gap-2">
                  <Lock size={18} className={isLight ? 'text-sky-600' : 'text-blue-400'} />
                  <h2 className={`text-[16px] font-bold ${headingCls}`}>Password</h2>
                </div>
                <label className={`mt-4 block ${labelCls}`}>New password</label>
                <input
                  className={inputCls} type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters"
                />
                <div className="mt-4">
                  <button onClick={savePassword} disabled={savingPwd} className={accentBtn}>
                    {savingPwd ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Change password
                  </button>
                </div>
              </section>
            </>
          )}

          {/* Session */}
          <section className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
            <div className="flex items-center gap-2">
              <LogOut size={18} className={isLight ? 'text-rose-600' : 'text-rose-400'} />
              <h2 className={`text-[16px] font-bold ${headingCls}`}>{isGuest ? 'Guest session' : 'Sign out'}</h2>
            </div>
            <p className={`mt-2 text-[14px] ${subCls}`}>
              {isGuest
                ? 'Exit guest mode and return to the login screen.'
                : 'Sign out of your account on this device.'}
            </p>
            <button
              onClick={logout}
              className={`mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-bold transition-colors ${
                isLight
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/25 hover:bg-rose-500/20'
              }`}
            >
              <LogOut size={15} /> {isGuest ? 'Exit guest session' : 'Log out'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
