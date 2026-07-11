import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { startGuestSession, getSession } from '../lib/auth';
import { ArrowRight, CheckCircle2, Loader2, UserCircle2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { BrandMark } from '../components/Brand';
import { ThemeToggle } from '../components/ThemeToggle';
import './AuthWorkstation.css';

type AuthMode = 'SIGN_IN' | 'REGISTER' | 'RECOVER';

// Supabase provider ids -> human labels. LinkedIn MUST be 'linkedin_oidc'
// (the plain 'linkedin' provider is deprecated and rejected by Supabase).
type OAuthProvider = 'google' | 'linkedin_oidc' | 'github';
const OAUTH_LABEL: Record<OAuthProvider, string> = {
  google: 'Google',
  linkedin_oidc: 'LinkedIn',
  github: 'GitHub',
};

// Where to land after an OAuth round-trip (location.state does not survive
// the full-page redirect to the provider, so it is stashed here).
const POSTAUTH_KEY = 'postauth_redirect';

// Rotating value props shown under the headline (sign-in / register).
const TAGLINES = [
  'From logic gates to a working CPU.',
  'Write your first real Verilog.',
  '90+ interactive labs, zero installs.',
  'Learn by building, not memorizing.',
];

// Quick trust stats shown under the card (mirrors the coming-soon countdown units).
const STATS: { n: string; l: string; c: string }[] = [
  { n: '90+', l: 'Labs', c: '#7A3FD0' },
  { n: '0', l: 'Installs', c: '#0FB6D6' },
  { n: '100%', l: 'Free', c: '#FF7A1A' },
];

// Community links (same handles as the "Coming Soon" page).
const SOCIALS: { label: string; href: string; hoverCls: string; icon: React.ReactNode }[] = [
  {
    label: 'Discord', href: 'https://discord.gg/NugcR5UXp', hoverCls: 'hover:bg-[#5865F2] hover:text-white',
    icon: (<svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor"><path d="M20.317 4.369a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.369a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>),
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/bit_for_bytes/', hoverCls: 'hover:bg-[#E1306C] hover:text-white',
    icon: (<svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>),
  },
  {
    label: 'LinkedIn', href: 'https://www.linkedin.com/company/bitforbytes/', hoverCls: 'hover:bg-[#0A66C2] hover:text-white',
    icon: (<svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>),
  },
];

/**
 * Auth screen restyled to match the BitForBytes "Coming Soon" page — a
 * neo-brutalist card (thick ink border + hard offset shadow) on a lavender
 * substrate with floating sticker shapes, a stats strip and community links.
 * Adapts to light/dark via `dark:` variants. All Supabase sign-in / sign-up /
 * recovery / OAuth / guest logic is preserved unchanged.
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
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);
  // Which OAuth providers the Supabase project actually has enabled.
  // null = settings not loaded yet (or fetch failed) -> hide the OAuth block.
  const [oauthEnabled, setOauthEnabled] = useState<{
    google: boolean;
    linkedin_oidc: boolean;
    github: boolean;
  } | null>(null);

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  // True while the email/password form is mid-flight; lets the OAuth listener
  // below stand down so the form flow keeps its own success animation.
  const formBusyRef = useRef(false);

  // Already signed in with a REAL account? The login screen isn't for you — go
  // where you were headed (state.from), or your profile by default. Guests are
  // deliberately allowed to stay: they come here to upgrade to a real account,
  // and bouncing them back would ping-pong with ModuleGate's locked-route
  // redirect. If supabase-js finished an OAuth return before this effect ran,
  // honor the stashed POSTAUTH_KEY destination (and clean it up) too.
  useEffect(() => {
    if (getSession().kind === 'supabase') {
      const stash = localStorage.getItem(POSTAUTH_KEY);
      if (stash) localStorage.removeItem(POSTAUTH_KEY);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || stash || '/profile', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ask GoTrue which OAuth providers are actually enabled so the buttons
  // appear/disappear automatically with the dashboard config. Until the
  // settings load (or if the fetch fails), the OAuth block stays hidden so a
  // click can never land on a raw 400 page from a disabled provider.
  useEffect(() => {
    let cancelled = false;
    fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY } })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const external = json?.external as Record<string, unknown> | undefined;
        if (cancelled || !external) return;
        setOauthEnabled({
          google: external.google === true,
          linkedin_oidc: external.linkedin_oidc === true,
          github: external.github === true,
        });
      })
      .catch(() => {
        /* leave null -> OAuth block stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Completes OAuth sign-ins. Google/LinkedIn/GitHub return here via a full-page
  // redirect with the session in the URL; supabase-js parses it and fires
  // SIGNED_IN, at which point we adopt the token, greet by name and move on.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (formBusyRef.current) return;
      if (event !== 'SIGNED_IN' || !session?.access_token) return;
      localStorage.setItem('supabase_token', session.access_token);
      const meta = (session.user?.user_metadata ?? {}) as Record<string, unknown>;
      const name = String(meta.full_name || meta.name || session.user?.email || 'Explorer');
      setFirstName(name.split(' ')[0]);
      setHasSeenGreeting(false);
      const dest = localStorage.getItem(POSTAUTH_KEY) || redirectTo;
      localStorage.removeItem(POSTAUTH_KEY);
      navigate(dest, { replace: true });
    });
    return () => sub.subscription.unsubscribe();
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
    setNotice(null);
    setIsLoading(true);
    formBusyRef.current = true;
    // An email/password (or recovery) submit owns its own redirect; clear any
    // stash left by an abandoned OAuth attempt so it can't override it.
    localStorage.removeItem(POSTAUTH_KEY);

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
          formBusyRef.current = false;
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;

        const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
        const token = data.session?.access_token;
        if (token) {
          // Email confirmation disabled in the dashboard -> account usable now.
          localStorage.setItem('supabase_token', token);
          setFirstName(name.split(' ')[0]);
          setHasSeenGreeting(false);
          setAuthSuccess(true);
          setTimeout(() => navigate(redirectTo, { replace: true }), 1200);
        } else if (data.user && (data.user.identities?.length ?? 0) === 0) {
          // Enumeration-protected response: this email already has an account.
          setIsLoading(false);
          formBusyRef.current = false;
          setError('This email is already registered. Try signing in instead.');
        } else {
          // Confirmation is ON: no session yet. Send the user to the dedicated
          // page to enter the 6-digit code we just emailed them.
          navigate('/verify-email', { replace: true, state: { email, fullName, from: redirectTo } });
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
          formBusyRef.current = false;
          setError('Could not establish a session. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Auth Error details:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
      formBusyRef.current = false;
    }
  };

  const handleGuestLogin = () => {
    if (!isGuestNameValid) {
      setError('Guest name is required (2–32 characters).');
      return;
    }
    setError(null);
    setNotice(null);
    // Drop any destination stashed by an abandoned OAuth attempt so it can't
    // hijack this guest redirect.
    localStorage.removeItem(POSTAUTH_KEY);
    startGuestSession(guestNameTrimmed);
    setFirstName(guestNameTrimmed.split(' ')[0]);
    setHasSeenGreeting(false);
    navigate(redirectTo, { replace: true });
  };

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setError(null);
    setNotice(null);
    setIsLoading(true);
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      // The provider round-trip is a full page reload; stash the destination
      // and come back to /login, where the SIGNED_IN listener finishes up.
      localStorage.setItem(POSTAUTH_KEY, redirectTo);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${siteUrl}/login` },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      console.error(`${OAUTH_LABEL[provider]} OAuth Error:`, err);
      // The redirect never happened; don't leave a dangling stash behind.
      localStorage.removeItem(POSTAUTH_KEY);
      setError(err.message || `Could not start ${OAUTH_LABEL[provider]} sign-in.`);
      setIsLoading(false);
    }
  };

  // ── neo-brutalist class fragments (light + dark) ──
  const inputCls =
    'w-full rounded-xl border-[2.5px] border-[#1B1436] bg-white px-4 py-3 text-[15px] text-[#1B1436] placeholder-[#8B7FB0] shadow-[3px_3px_0_#1B1436] outline-none transition-colors focus:border-[#7A3FD0] dark:border-[#4A3D7A] dark:bg-[#0F0B1E] dark:text-white dark:placeholder-[#7A6DA0] dark:shadow-[3px_3px_0_#7A3FD0] dark:focus:border-[#B98BFF]';
  const oauthCls =
    'flex w-full items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-white px-4 py-2.5 text-[14px] font-bold text-[#1B1436] shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[3px_3px_0_#7A3FD0] dark:hover:shadow-[5px_5px_0_#7A3FD0] dark:active:shadow-[1px_1px_0_#7A3FD0]';
  const submitCls =
    'group/sub mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] py-3.5 text-[15px] font-bold text-white shadow-[4px_4px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[4px_4px_0_#3A2064]';
  const cardCls =
    'relative rounded-[20px] border-[3px] border-[#1B1436] bg-white shadow-[6px_6px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#151030] dark:shadow-[6px_6px_0_#7A3FD0]';
  const chipCls =
    'grid place-items-center overflow-hidden border-[2.5px] border-[#1B1436] bg-white shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[4px_4px_0_#7A3FD0]';

  // OAuth buttons render only for providers the project has enabled; while the
  // settings are unknown (null) everything stays hidden.
  const showGoogle = oauthEnabled?.google === true;
  const showLinkedIn = oauthEnabled?.linkedin_oidc === true;
  const showGitHub = oauthEnabled?.github === true;
  const anyOAuth = showGoogle || showLinkedIn || showGitHub;

  // Secondary providers render in a grid beneath the full-width Google button.
  // Only the ones enabled in the Supabase dashboard are included.
  const secondaryOAuth = ([
    showLinkedIn && { provider: 'linkedin_oidc' as OAuthProvider, label: 'LinkedIn', icon: (
      <svg className="w-4 h-4 text-[#0A66C2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ) },
    showGitHub && { provider: 'github' as OAuthProvider, label: 'GitHub', icon: (
      <svg className="w-4 h-4 flex-shrink-0 text-[#1B1436] dark:text-white" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ) },
  ].filter(Boolean)) as { provider: OAuthProvider; label: string; icon: React.ReactNode }[];

  // Headline split so the last word gets the purple highlight (like "Coming Soon").
  const headlineParts =
    mode === 'SIGN_IN' ? { pre: 'Welcome ', hl: 'back' }
    : mode === 'REGISTER' ? { pre: 'Create your ', hl: 'profile' }
    : { pre: 'Reset your ', hl: 'password' };
  const subhead =
    mode === 'SIGN_IN' ? 'Log in to pick up right where you left off.'
    : mode === 'REGISTER' ? 'Free forever. No credit card, no installs.'
    : "Enter your email and we'll send you a reset link.";
  const submitLabel =
    mode === 'SIGN_IN' ? 'Sign in' : mode === 'REGISTER' ? 'Sign up' : 'Send reset link';

  return (
    <div className="auth-workstation-root nb-auth relative w-full min-h-[100svh] font-sans text-[#1B1436] antialiased overflow-x-hidden dark:text-white selection:bg-[#FFE24D] selection:text-[#1B1436]">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Decorative floating sticker shapes in the empty margins (desktop only). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block">
        <span className="nb-float absolute left-[8%] top-[16%] h-12 w-12 rounded-2xl border-[3px] border-[#1B1436] bg-[#FFE24D] shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A]" style={{ animationDelay: '0s' }} />
        <span className="nb-float absolute right-[9%] top-[24%] h-10 w-10 rounded-full border-[3px] border-[#1B1436] bg-[#0FB6D6] shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A]" style={{ animationDelay: '1.2s' }} />
        <span className="nb-float absolute left-[13%] bottom-[16%] h-11 w-11 rounded-2xl border-[3px] border-[#1B1436] bg-[#FF7A1A] shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A]" style={{ animationDelay: '0.6s' }} />
        <span className="nb-float absolute right-[12%] bottom-[22%] h-9 w-9 rounded-lg border-[3px] border-[#1B1436] bg-[#9A54E6] shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A]" style={{ animationDelay: '1.8s' }} />
      </div>

      <main className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-14">
        <div className="w-full max-w-[440px]">
          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.div
                key="auth-entry"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Hero card */}
                <section className={`${cardCls} px-6 pb-8 pt-11 text-center`}>
                  {/* Floating logo sticker popping out of the card */}
                  <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2">
                    <span className={`nb-float ${chipCls} h-[72px] w-[72px] rounded-2xl`}>
                      <BrandMark size={44} />
                    </span>
                  </div>

                  <h1 className="mt-1 text-[28px] font-bold leading-[1.08] tracking-tight text-[#1B1436] dark:text-white">
                    {headlineParts.pre}
                    <span className="text-[#7A3FD0] dark:text-[#B98BFF]">{headlineParts.hl}</span>
                  </h1>

                  <div className="mt-2 flex h-6 items-center justify-center overflow-hidden text-[14px] text-[#4A3F63] dark:text-[#B9AEDA]">
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

                  <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6B5E86] dark:text-[#8E80B4]">
                    <span className="text-[#FF7A1A]">★★★★★</span>
                    Loved by ECE students across India
                  </div>

                  {/* OAuth (only providers enabled in the Supabase dashboard) */}
                  {mode !== 'RECOVER' && anyOAuth && (
                    <div className="mt-7 space-y-3 text-left">
                      {showGoogle && (
                        <button id="auth-google-oauth" type="button" onClick={() => handleOAuthLogin('google')} className={oauthCls}>
                          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Continue with Google
                        </button>
                      )}
                      {secondaryOAuth.length > 0 && (
                        <div className={`grid gap-3 ${secondaryOAuth.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {secondaryOAuth.map(({ provider, label, icon }) => (
                            <button key={provider} id={`auth-${provider}-oauth`} type="button" onClick={() => handleOAuthLogin(provider)} className={oauthCls}>
                              {icon}
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Divider (only when OAuth options are shown above the form) */}
                  {mode !== 'RECOVER' && anyOAuth && (
                    <div className="relative my-6 flex items-center justify-center">
                      <div className="absolute h-[2px] w-full bg-[#1B1436]/15 dark:bg-white/15" />
                      <span className="relative bg-white px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[#6B5E86] dark:bg-[#151030] dark:text-[#8E80B4]">or</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleFormSubmit} className={`${mode !== 'RECOVER' && !anyOAuth ? 'mt-7 ' : ''}space-y-3.5 text-left`}>
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
                        onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                        className={`${inputCls} pr-11`}
                      />
                      <span
                        title={emailValid ? 'Looks good' : 'Use your university or personal email'}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${emailValid ? 'text-emerald-500' : 'text-[#8B7FB0] dark:text-[#7A6DA0]'}`}
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
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7FB0] hover:text-[#1B1436] dark:text-[#7A6DA0] dark:hover:text-white"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {mode === 'SIGN_IN' && (
                          <div className="text-right">
                            <button
                              type="button" onClick={() => { setMode('RECOVER'); setError(null); setNotice(null); }}
                              className="text-[13px] font-semibold text-[#6B5E86] hover:text-[#7A3FD0] dark:text-[#B9AEDA] dark:hover:text-white"
                            >
                              Forgot password?
                            </button>
                          </div>
                        )}

                        {mode === 'REGISTER' && password.length > 0 && (
                          <div className="space-y-1.5 pt-0.5">
                            <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wide">
                              <span className="text-[#6B5E86] dark:text-[#8E80B4]">Password strength</span>
                              <span style={{ color: strengthColor }}>{strengthLabel}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[0, 1, 2, 3].map((index) => (
                                <div key={index} className="h-2 rounded-full border-[1.5px] border-[#1B1436] bg-white transition-all duration-300 dark:border-[#4A3D7A] dark:bg-[#0F0B1E]"
                                  style={{ backgroundColor: index < strengthScore ? strengthColor : undefined }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {notice && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border-[2.5px] border-[#1B1436] bg-[#E7FBEA] px-3 py-2.5 text-[13px] font-semibold text-[#1B1436] shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#12331F] dark:text-emerald-200 dark:shadow-[3px_3px_0_#0FB6D6]"
                      >
                        {notice}
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="auth-error-shake rounded-xl border-[2.5px] border-[#1B1436] bg-[#FDE7EA] px-3 py-2.5 text-[13px] font-semibold text-[#B00020] shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#3A1420] dark:text-red-300 dark:shadow-[3px_3px_0_#FF7A1A]"
                      >
                        {error}
                      </motion.div>
                    )}

                    <button id="auth-submit-btn" type="submit" className={submitCls}>
                      {submitLabel}
                      <ArrowRight size={16} className="transition-transform group-hover/sub:translate-x-0.5" />
                    </button>
                  </form>

                  {/* Fine print (register) */}
                  {mode === 'REGISTER' && (
                    <p className="mt-3 text-[12px] leading-relaxed text-[#6B5E86] dark:text-[#8E80B4]">
                      By clicking Sign up, you agree to our Terms and Privacy Policy.
                    </p>
                  )}

                  {/* Toggle */}
                  <p className="mt-6 text-[14px] text-[#4A3F63] dark:text-[#B9AEDA]">
                    {mode === 'RECOVER' ? (
                      <>Remembered it? <button type="button" onClick={() => { setMode('SIGN_IN'); setError(null); setNotice(null); }} className="font-bold text-[#7A3FD0] underline underline-offset-2 dark:text-[#B98BFF]">Sign in</button></>
                    ) : mode === 'SIGN_IN' ? (
                      <>New here? <button type="button" onClick={() => { setMode('REGISTER'); setError(null); setNotice(null); }} className="font-bold text-[#7A3FD0] underline underline-offset-2 dark:text-[#B98BFF]">Create a profile</button></>
                    ) : (
                      <>Existing user? <button type="button" onClick={() => { setMode('SIGN_IN'); setError(null); setNotice(null); }} className="font-bold text-[#7A3FD0] underline underline-offset-2 dark:text-[#B98BFF]">Sign in</button></>
                    )}
                  </p>

                  {/* Guest */}
                  {mode !== 'RECOVER' && (
                    <div className="mt-6 border-t-[2.5px] border-dashed border-[#1B1436]/20 pt-5 dark:border-white/15">
                      {!showGuest ? (
                        <button
                          type="button" onClick={() => setShowGuest(true)}
                          className="mx-auto flex items-center justify-center gap-2 text-[13px] font-semibold text-[#6B5E86] hover:text-[#7A3FD0] dark:text-[#B9AEDA] dark:hover:text-white"
                        >
                          <UserCircle2 size={15} /> Just looking? Continue as guest
                        </button>
                      ) : (
                        <div className="space-y-2.5 text-left">
                          <div className="relative">
                            <UserCircle2 size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7FB0] dark:text-[#7A6DA0]" />
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
                            className="w-full rounded-xl border-[2.5px] border-dashed border-[#1B1436] py-3 text-[14px] font-bold text-[#1B1436] transition-colors hover:bg-[#F1ECFF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/25 dark:text-white dark:hover:bg-white/[0.06]"
                          >
                            Continue as guest
                          </button>
                          <p className="text-center font-mono text-[11px] text-[#6B5E86] dark:text-[#8E80B4]">Guest progress is saved in this browser only.</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Trust stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {STATS.map((s) => (
                    <div key={s.l} className="rounded-xl border-[2.5px] border-[#1B1436] bg-white px-2 py-3 text-center shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#151030] dark:shadow-[3px_3px_0_#7A3FD0]">
                      <div className="font-mono text-[22px] font-bold leading-none tabular-nums" style={{ color: s.c }}>{s.n}</div>
                      <div className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B5E86] dark:text-[#8E80B4]">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Community links */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className={`grid h-10 w-10 place-items-center rounded-xl border-[2.5px] border-[#1B1436] bg-white text-[#1B1436] shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[3px_3px_0_#7A3FD0] ${s.hoverCls}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>

                <footer className="mt-5 text-center font-mono text-[12px] text-[#6B5E86] dark:text-[#8E80B4]">
                  © 2026 BitForBytes · learn to design real chips
                </footer>
              </motion.div>
            ) : (
              /* ═══ LOADING ═══ */
              <motion.div
                key="auth-loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <section className={`${cardCls} px-6 py-7 font-mono text-[13px]`}>
                  <div className="mb-4 flex items-center justify-between border-b-[2.5px] border-[#1B1436]/15 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#6B5E86] dark:border-white/10 dark:text-[#8E80B4]">
                    <span>Setting up your workspace</span>
                    <span className="flex items-center gap-1.5 text-[#FF7A1A]"><Loader2 size={11} className="animate-spin" /> Loading</span>
                  </div>
                  <div className="space-y-2.5 text-[#4A3F63] dark:text-[#B9AEDA]">
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
                      <span className="terminal-cursor font-bold text-[#FF7A1A]">▌</span>
                    )}
                  </div>

                  {loadingStep === initializationLogs.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 flex items-start gap-3 rounded-xl border-[2.5px] border-[#1B1436] bg-[#E7FBEA] p-4 text-sm shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#12331F] dark:shadow-[3px_3px_0_#0FB6D6] ${authSuccess ? 'success-card' : ''}`}
                    >
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          {mode === 'RECOVER' ? 'Recovery link dispatched' : (authSuccess ? 'Signed in, redirecting...' : 'Account created')}
                        </div>
                        <p className="font-sans text-xs leading-normal text-[#4A3F63] dark:text-[#B9AEDA]">
                          {mode === 'RECOVER'
                            ? 'We sent a password reset link to your email. Open it to recover your account.'
                            : (authSuccess ? 'Your workspace is ready. Loading your dashboard now.' : 'Your account is ready. You can sign in now.')}
                        </p>
                        {mode === 'RECOVER' && (
                          <button
                            type="button" onClick={() => { setIsLoading(false); setMode('SIGN_IN'); setError(null); setNotice(null); }}
                            className="pt-1 text-xs font-bold text-[#7A3FD0] hover:underline dark:text-[#B98BFF]"
                          >
                            ← Return to sign in
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
