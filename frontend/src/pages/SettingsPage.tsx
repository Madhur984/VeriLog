import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, LogOut, Check, Loader2, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/auth';
import { ThemeToggle } from '../components/ThemeToggle';

/**
 * Account settings — wired from the "Settings" tile in the portal DiagnosticConsole.
 *
 * Restyled to the BitForBytes neo-brutalist system (lavender substrate, white
 * cards with thick ink borders + hard offset shadows, purple accents, Space
 * Grotesk + JetBrains Mono) to match the login / "Coming Soon" pages. Theming is
 * handled purely by Tailwind `dark:` variants off the `.dark` class on <html>.
 *
 * Real Supabase users can change their display name, email and password, and sign
 * out. Guests (no real account) get their local display name plus a prompt to make
 * a real account; "Exit guest session" clears the local session and returns to login.
 */
export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

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

  // ── neo-brutalist class fragments (light + dark) ──
  const cardCls =
    'rounded-[18px] border-[3px] border-[#1B1436] bg-white shadow-[6px_6px_0_#1B1436] dark:border-[#07040F] dark:bg-[#151030] dark:shadow-[6px_6px_0_#7A3FD0]';
  const inputCls =
    'mt-2 w-full rounded-xl border-[2.5px] border-[#1B1436] bg-white px-4 py-3 text-[15px] font-medium text-[#1B1436] placeholder-[#8B7FB0] shadow-[3px_3px_0_#1B1436] outline-none transition-colors focus:border-[#7A3FD0] disabled:opacity-60 dark:border-[#07040F] dark:bg-[#0F0B1E] dark:text-white dark:placeholder-[#7A6DA0] dark:shadow-[3px_3px_0_#7A3FD0] dark:focus:border-[#B98BFF]';
  const accentBtn =
    'inline-flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] px-5 py-2.5 text-[14px] font-bold text-white shadow-[4px_4px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#1B1436] disabled:pointer-events-none disabled:opacity-60 dark:border-[#07040F] dark:shadow-[4px_4px_0_#3A2064]';
  const labelCls = 'font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5E86] dark:text-[#8E80B4]';
  const headingCls = 'text-[#1B1436] dark:text-white';
  const subCls = 'text-[#4A3F63] dark:text-[#B9AEDA]';
  const iconCls = 'text-[#7A3FD0] dark:text-[#B98BFF]';

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#F1ECFF] font-sans text-[#1B1436] transition-colors duration-300 dark:bg-[#0F0B1E] dark:text-white">
      {/* Soft top glow (matches the login / coming-soon substrate). */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[760px] bg-[radial-gradient(1200px_720px_at_50%_-12%,#E7DEFF,transparent_62%)] dark:bg-[radial-gradient(1200px_760px_at_50%_-14%,#241A45,transparent_60%)]" />

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b-[3px] border-[#1B1436] bg-[#F1ECFF]/85 px-4 py-4 backdrop-blur-md dark:border-[#07040F] dark:bg-[#0F0B1E]/85 sm:px-8">
        <button
          onClick={() => navigate('/portal')}
          className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-white px-4 py-2 text-[13px] font-bold text-[#1B1436] shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1B1436] dark:border-[#07040F] dark:bg-[#1B1440] dark:text-white dark:shadow-[3px_3px_0_#7A3FD0] dark:hover:shadow-[5px_5px_0_#7A3FD0]"
        >
          <ArrowLeft size={16} /> Portal
        </button>
        <ThemeToggle variant="minimal" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-10 sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold tracking-tight ${headingCls}`}
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
            className={`mt-5 flex items-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] px-4 py-3 text-[14px] font-semibold shadow-[4px_4px_0_#1B1436] dark:border-[#07040F] ${
              notice.kind === 'ok'
                ? 'bg-[#E7FBEA] text-[#1B1436] dark:bg-[#12331F] dark:text-emerald-200 dark:shadow-[4px_4px_0_#0FB6D6]'
                : 'bg-[#FDE7EA] text-[#B00020] dark:bg-[#3A1420] dark:text-red-300 dark:shadow-[4px_4px_0_#FF7A1A]'
            }`}
          >
            {notice.kind === 'ok' ? <Check size={16} /> : <ShieldAlert size={16} />}
            {notice.msg}
          </motion.div>
        )}

        {isGuest && (
          <div className={`mt-5 p-5 ${cardCls}`}>
            <div className={`text-[15px] font-bold ${headingCls}`}>Make it permanent</div>
            <p className={`mt-1 text-[14px] ${subCls}`}>
              Create a real account to save your progress, unlock every module, and sign in from any device.
            </p>
            <button onClick={() => navigate('/login')} className={`${accentBtn} mt-4`}>Create an account</button>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {/* Display name */}
          <section className={`p-5 sm:p-6 ${cardCls}`}>
            <div className="flex items-center gap-2">
              <User size={18} className={iconCls} />
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
              <section className={`p-5 sm:p-6 ${cardCls}`}>
                <div className="flex items-center gap-2">
                  <Mail size={18} className={iconCls} />
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

              <section className={`p-5 sm:p-6 ${cardCls}`}>
                <div className="flex items-center gap-2">
                  <Lock size={18} className={iconCls} />
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
          <section className={`p-5 sm:p-6 ${cardCls}`}>
            <div className="flex items-center gap-2">
              <LogOut size={18} className="text-[#E23A5E] dark:text-[#FF6B8A]" />
              <h2 className={`text-[16px] font-bold ${headingCls}`}>{isGuest ? 'Guest session' : 'Sign out'}</h2>
            </div>
            <p className={`mt-2 text-[14px] ${subCls}`}>
              {isGuest
                ? 'Exit guest mode and return to the login screen.'
                : 'Sign out of your account on this device.'}
            </p>
            <button
              onClick={logout}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-[#FF6B6B] px-5 py-2.5 text-[14px] font-bold text-white shadow-[4px_4px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#1B1436] dark:border-[#07040F] dark:shadow-[4px_4px_0_#5A1A1A]"
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
