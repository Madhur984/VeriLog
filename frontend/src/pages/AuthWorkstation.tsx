import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { startGuestSession, isAuthenticated } from '../lib/auth';
import { ArrowRight, CheckCircle2, Loader2, UserCircle2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { BrandMark } from '../components/Brand';
import { ThemeToggle } from '../components/ThemeToggle';
import './AuthWorkstation.css';

type AuthMode = 'SIGN_IN' | 'REGISTER' | 'RECOVER';

// Rotating value props shown under the headline (sign-in / register).
const TAGLINES = [
  'From logic gates to a working CPU.',
  'Write your first real Verilog.',
  '90+ interactive labs, zero installs.',
  'Learn by building, not memorizing.',
];

/**
 * Clean, centered auth screen modelled on brilliant.org/welcome — a single
 * column on a plain surface that adapts to light or dark mode via `dark:`
 * variants. All Supabase sign-in / sign-up / recovery / OAuth / guest logic is
 * preserved; only the visual shell is minimal now.
 */
export const AuthWorkstation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setFirstName = useGamificationStore((state) => state.setFirstName);
  const setHasSeenGreeting = useGamificationStore((state) => state.setHasSeenGreeting);
  const redirectTo = (location.state as { from?: string } | null)?.from || '/portal';

  const [mode, setMode] = useState<AuthMode>('SIGN_IN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [showGuest, setShowGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  // Already signed in (real or guest)? The login screen isn't for you — go where
  // you were headed (state.from), or your profile by default.
  useEffect(() => {
    if (isAuthenticated()) {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/profile', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cycle the rotating tagline.
  useEffect(() => {
    const t = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 2800);
    return () => clearInterval(t);
  }, []);

  const guestNameTrimmed = guestName.trim();
  const isGuestNameValid = guestNameTrimmed.length >= 2 && guestNameTrimmed.length <= 32;

  // Terminal verification logs based on mode.
  const getLogsForMode = () => {
    if (mode === 'RECOVER') {
      return [
        'Secure connection established.',
        'Initiating password recovery protocol...',
        'Generating secure password reset token...',
        'Sending recovery link to email...',
        'Recovery request dispatched.',
      ];
    }
    return [
      'Secure connection established.',
      'Verifying your credentials...',
      'Loading your personalized dashboard...',
      'Syncing curriculum progress...',
      'Workspace ready.',
    ];
  };

  const initializationLogs = getLogsForMode();

  // Step generator loop for loading animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= initializationLogs.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, mode]);

  // ── Password Strength calculation ──
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return { score, label: 'Empty', color: '#94a3b8' };
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    let label = 'Weak';
    let color = '#F97316';
    if (score === 3) { label = 'Medium'; color = '#F59E0B'; }
    else if (score === 4) { label = 'Strong'; color = '#10B981'; }
    return { score, label, color };
  };

  const { score: strengthScore, label: strengthLabel, color: strengthColor } = calculatePasswordStrength(password);

  // ── Auth handlers (real Supabase integration) ──
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'RECOVER') {
        const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${siteUrl}/reset-password`,
        });
        if (resetError) throw resetError;
        setAuthSuccess(false);
      } else if (mode === 'REGISTER') {
        if (fullName.length < 3) {
          setError('Name must be at least 3 characters.');
          setIsLoading(false);
          return;
        }
        const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: `${siteUrl}/portal` },
        });
        if (signUpError) throw signUpError;

        const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
        const token = data.session?.access_token;
        if (token) {
          localStorage.setItem('supabase_token', token);
          setFirstName(name.split(' ')[0]);
          setHasSeenGreeting(false);
          setAuthSuccess(true);
          setTimeout(() => navigate(redirectTo, { replace: true }), 1200);
        } else {
          setIsLoading(false);
          setError('Account created! Check your email to verify, then sign in.');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        const name = data.user?.user_metadata?.full_name || 'Explorer';
        const token = data.session?.access_token;
        if (token) {
          localStorage.setItem('supabase_token', token);
          setFirstName(name.split(' ')[0]);
          setHasSeenGreeting(false);
          setAuthSuccess(true);
          setTimeout(() => navigate(redirectTo, { replace: true }), 1200);
        } else {
          setIsLoading(false);
          setError('Could not establish a session. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Auth Error details:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    if (!isGuestNameValid) {
      setError('Guest name is required (2–32 characters).');
      return;
    }
    setError(null);
    startGuestSession(guestNameTrimmed);
    setFirstName(guestNameTrimmed.split(' ')[0]);
    setHasSeenGreeting(false);
    navigate(redirectTo, { replace: true });
  };

  const handleOAuthLogin = async (provider: 'google' | 'linkedin' | 'github') => {
    setError(null);
    setIsLoading(true);
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${siteUrl}/portal` },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      console.error(`${provider} OAuth Error:`, err);
      setError(err.message || `Failed to initiate ${provider} authentication.`);
      setIsLoading(false);
    }
  };

  // ── shared class fragments (light + dark) ──
  const inputCls =
    'w-full rounded-xl px-4 py-3.5 text-[15px] outline-none transition-all bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/[0.06] dark:bg-white/[0.04] dark:border-white/15 dark:text-white dark:placeholder-slate-500 dark:focus:border-white/40 dark:focus:ring-white/[0.07]';
  const oauthCls =
    'flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[14px] font-semibold transition-all active:scale-[0.98] bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm dark:bg-white/[0.04] dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/[0.08] dark:hover:border-white/25';

  const headline =
    mode === 'SIGN_IN' ? 'Welcome back'
    : mode === 'REGISTER' ? 'Create a free profile to start learning'
    : 'Reset your password';
  const subhead =
    mode === 'SIGN_IN' ? 'Log in to pick up right where you left off.'
    : mode === 'REGISTER' ? 'Free forever. No credit card, no installs.'
    : "Enter your email and we'll send you a reset link.";
  const submitLabel =
    mode === 'SIGN_IN' ? 'Sign in' : mode === 'REGISTER' ? 'Sign up' : 'Send reset link';

  return (
    <div className="auth-workstation-root relative w-full min-h-[100svh] bg-white text-slate-900 antialiased font-sans overflow-hidden dark:bg-[#0A0B12] dark:text-white selection:bg-[#F97316]/20">
      {/* Soft ambience */}
      <div className="pointer-events-none absolute -left-40 -top-32 h-[55vh] w-[55vh] rounded-full bg-[#F97316]/[0.06] blur-[130px] dark:bg-[#F97316]/10" />
      <div className="pointer-events-none absolute -right-28 -bottom-24 h-[45vh] w-[45vh] rounded-full bg-[#6E7BFF]/[0.06] blur-[130px] dark:bg-[#4A57FF]/10" />

      {/* Dotted texture — fades away behind the form so the centre stays clean */}
      <div
        className="pointer-events-none absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at center, transparent 35%, black 85%)',
          maskImage: 'radial-gradient(ellipse 60% 60% at center, transparent 35%, black 85%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at center, transparent 35%, black 85%)',
          maskImage: 'radial-gradient(ellipse 60% 60% at center, transparent 35%, black 85%)',
        }}
      />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <main className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.div
                key="auth-entry"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Logo + headline */}
                <a href="/" className="relative mx-auto mb-6 block w-fit">
                  <span className="pointer-events-none absolute inset-0 -z-10 animate-pulse rounded-full bg-[#4A57FF]/25 blur-xl" />
                  <BrandMark size={54} />
                </a>
                <h1 className="text-center text-[27px] font-extrabold leading-tight tracking-tight">
                  {headline}
                </h1>
                <div className="mt-2 flex h-6 items-center justify-center overflow-hidden text-center text-[14px] text-slate-500 dark:text-slate-400">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mode === 'RECOVER' ? 'recover' : tagIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="block"
                    >
                      {mode === 'RECOVER' ? subhead : TAGLINES[tagIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-500">
                  <span className="tracking-tight text-[#F59E0B]">★★★★★</span>
                  Loved by ECE students across India
                </div>

                {/* OAuth */}
                {mode !== 'RECOVER' && (
                  <div className="mt-7 space-y-3">
                    <button id="auth-google-oauth" type="button" onClick={() => handleOAuthLogin('google')} className={oauthCls}>
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button id="auth-linkedin-oauth" type="button" onClick={() => handleOAuthLogin('linkedin')} className={oauthCls}>
                        <svg className="w-4 h-4 text-[#0A66C2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </button>
                      <button id="auth-github-oauth" type="button" onClick={() => handleOAuthLogin('github')} className={oauthCls}>
                        <svg className="w-4 h-4 flex-shrink-0 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                      </button>
                    </div>
                  </div>
                )}

                {/* Divider */}
                {mode !== 'RECOVER' && (
                  <div className="relative my-6 flex items-center justify-center">
                    <div className="absolute h-px w-full bg-slate-200 dark:bg-white/10" />
                    <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-[#0A0B12] dark:text-slate-500">or</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                  {mode === 'REGISTER' && (
                    <input
                      id="auth-fullname" type="text" required value={fullName}
                      onChange={(e) => setFullName(e.target.value)} placeholder="Your name"
                      className={inputCls}
                    />
                  )}

                  <div className="relative">
                    <input
                      id="auth-email" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                      className={`${inputCls} pr-11`}
                    />
                    <span
                      title={emailValid ? 'Looks good' : 'Use your university or personal email'}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${emailValid ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      {emailValid ? <CheckCircle2 size={16} /> : <HelpCircle size={16} />}
                    </span>
                  </div>

                  {mode !== 'RECOVER' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          id="auth-password" type={showPassword ? 'text' : 'password'} required value={password}
                          onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={6}
                          className={`${inputCls} pr-11`}
                        />
                        <button
                          type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {mode === 'SIGN_IN' && (
                        <div className="text-right">
                          <button
                            type="button" onClick={() => { setMode('RECOVER'); setError(null); }}
                            className="text-[13px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      {mode === 'REGISTER' && password.length > 0 && (
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-slate-400">Password strength</span>
                            <span style={{ color: strengthColor }}>{strengthLabel}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[0, 1, 2, 3].map((index) => (
                              <div key={index} className="h-1 rounded-full bg-slate-200 dark:bg-white/10 transition-all duration-300"
                                style={{ backgroundColor: index < strengthScore ? strengthColor : undefined }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="auth-error-shake rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    id="auth-submit-btn" type="submit"
                    className="group/sub mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_28px_-8px_rgba(15,23,42,0.5)] transition-all hover:bg-slate-800 hover:shadow-[0_14px_32px_-8px_rgba(15,23,42,0.55)] active:scale-[0.99] dark:bg-white dark:text-slate-900 dark:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.25)] dark:hover:bg-slate-100"
                  >
                    {submitLabel}
                    <ArrowRight size={16} className="transition-transform group-hover/sub:translate-x-0.5" />
                  </button>
                </form>

                {/* Fine print (register) */}
                {mode === 'REGISTER' && (
                  <p className="mt-3 text-center text-[12px] leading-relaxed text-slate-400 dark:text-slate-500">
                    By clicking Sign up, you agree to our Terms and Privacy Policy.
                  </p>
                )}

                {/* Toggle */}
                <p className="mt-6 text-center text-[14px] text-slate-500 dark:text-slate-400">
                  {mode === 'RECOVER' ? (
                    <>Remembered it? <button type="button" onClick={() => { setMode('SIGN_IN'); setError(null); }} className="font-bold text-slate-900 underline underline-offset-2 dark:text-white">Sign in</button></>
                  ) : mode === 'SIGN_IN' ? (
                    <>New here? <button type="button" onClick={() => { setMode('REGISTER'); setError(null); }} className="font-bold text-slate-900 underline underline-offset-2 dark:text-white">Create a profile</button></>
                  ) : (
                    <>Existing user? <button type="button" onClick={() => { setMode('SIGN_IN'); setError(null); }} className="font-bold text-slate-900 underline underline-offset-2 dark:text-white">Sign in</button></>
                  )}
                </p>

                {/* Guest */}
                {mode !== 'RECOVER' && (
                  <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
                    {!showGuest ? (
                      <button
                        type="button" onClick={() => setShowGuest(true)}
                        className="mx-auto flex items-center justify-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        <UserCircle2 size={15} /> Just looking? Continue as guest
                      </button>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="relative">
                          <UserCircle2 size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            id="auth-guest-name" type="text" placeholder="Your name" value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && isGuestNameValid) handleGuestLogin(); }}
                            maxLength={32} autoComplete="nickname"
                            className={`${inputCls} pl-10`}
                          />
                        </div>
                        <button
                          id="auth-guest-btn" type="button" onClick={handleGuestLogin} disabled={!isGuestNameValid}
                          className="w-full rounded-full border border-dashed border-slate-300 py-3 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                        >
                          Continue as guest
                        </button>
                        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">Guest progress is saved in this browser only.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              /* ═══ LOADING ═══ */
              <motion.div
                key="auth-loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="min-h-[340px] font-mono text-[13px]"
              >
                <a href="/" className="mx-auto mb-6 block w-fit"><BrandMark size={44} /></a>
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10 dark:text-slate-500">
                  <span>Setting up your workspace</span>
                  <span className="flex items-center gap-1.5 text-[#F97316]"><Loader2 size={11} className="animate-spin" /> Loading</span>
                </div>
                <div className="space-y-2.5 text-slate-500 dark:text-slate-400">
                  {initializationLogs.slice(0, loadingStep + 1).map((log, index) => {
                    const isDone = log.includes('ready') || log.includes('established') || log.includes('dispatched') || log.includes('delivered');
                    return (
                      <motion.div
                        initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
                        key={index}
                        className={`crypto-log-line leading-relaxed ${isDone ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}`}
                      >
                        {isDone ? '✓ ' : '→ '}{log}
                      </motion.div>
                    );
                  })}
                  {loadingStep < initializationLogs.length - 1 && (
                    <span className="terminal-cursor font-bold text-[#F97316]">▌</span>
                  )}
                </div>

                {loadingStep === initializationLogs.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-500/25 dark:bg-emerald-500/10 ${authSuccess ? 'success-card' : ''}`}
                  >
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {mode === 'RECOVER' ? 'Recovery link dispatched' : (authSuccess ? 'Signed in, redirecting...' : 'Check your email')}
                      </div>
                      <p className="font-sans text-xs leading-normal text-slate-500 dark:text-slate-400">
                        {mode === 'RECOVER'
                          ? 'We sent a password reset link to your email. Open it to recover your account.'
                          : (authSuccess ? 'Your workspace is ready. Loading your dashboard now.' : 'We sent a verification link to your email. Open it to finish setting up your account.')}
                      </p>
                      {mode === 'RECOVER' && (
                        <button
                          type="button" onClick={() => { setIsLoading(false); setMode('SIGN_IN'); setError(null); }}
                          className="pt-1 text-xs font-bold text-[#EA580C] hover:underline"
                        >
                          ← Return to sign in
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
