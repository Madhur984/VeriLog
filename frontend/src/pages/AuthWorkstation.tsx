import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { startGuestSession } from '../lib/auth';
import { ArrowRight, CheckCircle2, Loader2, UserCircle2, Eye, EyeOff } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import './AuthWorkstation.css';

type AuthMode = 'SIGN_IN' | 'REGISTER' | 'RECOVER';

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [authSuccess, setAuthSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic transition states for tilt engine
  const [transitionState, setTransitionState] = useState<'idle' | 'tilting' | 'resetting'>('idle');
  const [isGyroActive, setIsGyroActive] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const guestNameTrimmed = guestName.trim();
  const isGuestNameValid = guestNameTrimmed.length >= 2 && guestNameTrimmed.length <= 32;

  // Clean, dynamic terminal verification logs based on mode
  const getLogsForMode = () => {
    if (mode === 'RECOVER') {
      return [
        "Secure connection established.",
        "Initiating password recovery protocol...",
        "Generating secure password reset token...",
        "Sending recovery link to email...",
        "Recovery request dispatched."
      ];
    }
    return [
      "Secure connection established.",
      "Verifying your credentials...",
      "Loading your personalized dashboard...",
      "Syncing curriculum progress...",
      "Workspace ready."
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

  // ── Particle Canvas Background Animation ──
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(75, Math.floor((canvas.width * canvas.height) / 16000));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.8,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Pull toward mouse if active
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.x += (dx / dist) * force * 0.35;
            p.y += (dy / dist) * force * 0.35;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.fill();
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 115) * 0.07;
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw faint lines to cursor if close
      if (mouseRef.current.active) {
        particles.forEach((p) => {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(p.x, p.y);
            const alpha = (1 - dist / 160) * 0.1;
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeaveGlobal = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    document.addEventListener('mouseleave', handleMouseLeaveGlobal);

    resizeCanvas();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseleave', handleMouseLeaveGlobal);
    };
  }, []);

  // ── Touch / Gyroscope Parallax Fallback ──
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (transitionState === 'tilting') return;
      if (!cardRef.current) return;

      const beta = e.beta;
      const gamma = e.gamma;
      if (beta === null || gamma === null) return;

      // Check if gyroscope values are actively firing and changing
      if (Math.abs(beta) > 0.1 || Math.abs(gamma) > 0.1) {
        setIsGyroActive(true);
      }

      // Constrain tilt based on a natural 45-degree hand angle
      const rotateX = (Math.max(-25, Math.min(25, beta - 45)) * -0.25).toFixed(2);
      const rotateY = (Math.max(-25, Math.min(25, gamma)) * 0.25).toFixed(2);

      cardRef.current.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`;
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [transitionState]);

  // ── Password Strength calculation ──
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return { score, label: 'Empty', color: '#64748b' };
    
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    let label = 'Weak';
    let color = '#FF5F1F'; // Orange
    if (score === 3) {
      label = 'Medium';
      color = '#FBBC05'; // Yellow
    } else if (score === 4) {
      label = 'Secure';
      color = '#10B981'; // Green
    }

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

        setAuthSuccess(false); // Keeps display showing the custom check-email message
        // Steps run automatically through useEffect step generator
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
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${siteUrl}/login`,
          },
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
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
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
        options: {
          redirectTo: `${siteUrl}/portal`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      console.error(`${provider} OAuth Error:`, err);
      setError(err.message || `Failed to initiate ${provider} authentication.`);
      setIsLoading(false);
    }
  };

  // ── Premium Hardware-Accelerated 3D Tilt Engine ──

  const handle3DTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    setTransitionState('tilting');

    const box = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;

    const rotateX = (y * -14).toFixed(2);
    const rotateY = (x * 14).toFixed(2);

    cardRef.current.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const reset3DTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
    setTransitionState('resetting');

    resetTimeoutRef.current = setTimeout(() => {
      setTransitionState('idle');
    }, 600);
  };

  return (
    <div className="auth-workstation-root w-full min-h-screen bg-[#03050a] text-slate-200 antialiased font-sans flex flex-col justify-center items-center p-6 relative select-none overflow-hidden">

      {/* GPU Interactive Particle Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Precision architectural layout background grid */}
      <div className="absolute inset-0 auth-grid-texture z-0" />

      {/* ═══ THREE-DIMENSIONAL SPATIAL CONTAINER CARD ═══ */}
      <div
        ref={cardRef}
        onMouseMove={handle3DTilt}
        onMouseLeave={reset3DTilt}
        className={`w-full max-w-[460px] auth-glass-substrate border border-slate-900 rounded-2xl p-8 md:p-10 space-y-6 z-10 will-change-transform ${
          transitionState === 'idle' && !isGyroActive ? 'auth-idle-float' : ''
        } ${
          transitionState === 'tilting' ? 'is-tilting' : ''
        } ${
          transitionState === 'resetting' ? 'is-resetting' : ''
        }`}
      >
        <AnimatePresence mode="wait">
          {!isLoading ? (

            /* ═══ SIGN-IN / REGISTER / RECOVERY FORM ═══ */
            <motion.div
              key="auth-entry"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="space-y-2 text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase">
                  {mode === 'SIGN_IN' && 'Welcome back'}
                  {mode === 'REGISTER' && 'Create account'}
                  {mode === 'RECOVER' && 'Reset password'}
                </h1>
                <p className="text-[15px] text-slate-400 font-normal leading-relaxed">
                  {mode === 'RECOVER' 
                    ? 'Enter your email address to receive a secure password recovery link.'
                    : 'Sign in to track your learning paths and hardware simulation workspace.'
                  }
                </p>
              </div>

              {/* ═══ OAUTH SSO STACK (Google, LinkedIn, GitHub side-by-side) ═══ */}
              {mode !== 'RECOVER' && (
                <div className="space-y-3 text-left">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase block">
                    Continue with
                  </span>

                  <div className="grid grid-cols-3 gap-2.5 text-xs font-bold">
                    {/* Google */}
                    <button
                      id="auth-google-oauth"
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      className="auth-oauth-btn w-full bg-[#03050a] border border-slate-800 rounded-xl px-3 py-3 flex items-center justify-center gap-1.5 text-slate-350 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="truncate">Google</span>
                    </button>

                    {/* LinkedIn */}
                    <button
                      id="auth-linkedin-oauth"
                      type="button"
                      onClick={() => handleOAuthLogin('linkedin')}
                      className="auth-oauth-btn w-full bg-[#03050a] border border-slate-800 rounded-xl px-3 py-3 flex items-center justify-center gap-1.5 text-slate-350 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-[#0A66C2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="truncate">LinkedIn</span>
                    </button>

                    {/* GitHub */}
                    <button
                      id="auth-github-oauth"
                      type="button"
                      onClick={() => handleOAuthLogin('github')}
                      className="auth-oauth-btn w-full bg-[#03050a] border border-slate-800 rounded-xl px-3 py-3 flex items-center justify-center gap-1.5 text-slate-350 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span className="truncate">GitHub</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Minimal divider */}
              {mode !== 'RECOVER' && (
                <div className="relative flex items-center justify-center font-mono text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                  <div className="absolute w-full h-px bg-slate-900" />
                  <span className="relative bg-[#090e1a] px-3">or</span>
                </div>
              )}

              {/* ═══ FORM ═══ */}
              <form onSubmit={handleFormSubmit} className="space-y-5 text-left text-sm">
                {/* Full name — register only */}
                {mode === 'REGISTER' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label htmlFor="auth-fullname" className="text-[13px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1.5">
                      Full name
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="auth-input-field w-full bg-[#03050a] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 font-mono text-[15px] placeholder-slate-700"
                    />
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label htmlFor="auth-email" className="text-[13px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1.5">
                    Email address
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="auth-input-field w-full bg-[#03050a] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 font-mono text-[15px] placeholder-slate-700"
                  />
                </div>

                {/* Password field - sign-in/register only */}
                {mode !== 'RECOVER' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="auth-password" className="text-[13px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        Password
                      </label>
                      {mode === 'SIGN_IN' && (
                        <button
                          type="button"
                          onClick={() => { setMode('RECOVER'); setError(null); }}
                          className="text-xs text-[#00F5FF]/85 hover:text-[#00F5FF] font-medium hover:underline focus:outline-none"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    
                    <div className="relative">
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="auth-input-field w-full bg-[#03050a] border border-slate-800 rounded-xl pl-4 pr-11 py-3.5 text-slate-200 font-mono text-[15px] placeholder-slate-700"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none cursor-pointer flex items-center justify-center"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator — register only */}
                    {mode === 'REGISTER' && password.length > 0 && (
                      <div className="space-y-1.5 pt-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider">
                          <span className="text-slate-500">Security strength:</span>
                          <span style={{ color: strengthColor }}>{strengthLabel}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[0, 1, 2, 3].map((index) => (
                            <div
                              key={index}
                              className="h-1 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor:
                                  index < strengthScore
                                    ? strengthColor
                                    : 'rgba(255, 255, 255, 0.05)',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="auth-error-shake bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono p-3 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  id="auth-submit-btn"
                  type="submit"
                  className="auth-submit-btn w-full bg-white text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-[15px]"
                >
                  <span>
                    {mode === 'RECOVER' ? 'Send recovery link' : 'Continue with email'}
                  </span>
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Guest access — sign-in/register only */}
              {mode !== 'RECOVER' && (
                <div className="space-y-3">
                  <div className="relative flex items-center justify-center font-mono text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                    <div className="absolute w-full h-px bg-slate-900" />
                    <span className="relative bg-[#090e1a] px-3">or try as guest</span>
                  </div>

                  <div className="relative">
                    <UserCircle2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    <input
                      id="auth-guest-name"
                      type="text"
                      placeholder="Your name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isGuestNameValid) handleGuestLogin();
                      }}
                      className="auth-input-field w-full bg-[#03050a] border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 text-slate-200 font-mono text-[15px] placeholder-slate-700"
                      maxLength={32}
                      autoComplete="nickname"
                    />
                  </div>

                  <button
                    id="auth-guest-btn"
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={!isGuestNameValid}
                    className="auth-oauth-btn w-full bg-[#03050a] border border-dashed border-slate-800/80 px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 font-mono text-sm font-bold text-slate-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title={
                      isGuestNameValid
                        ? 'Continue as guest. Progress saved locally only.'
                        : 'Enter a name (2–32 chars) to continue'
                    }
                  >
                    <UserCircle2 size={14} />
                    <span>Continue as guest</span>
                  </button>
                  <p className="text-[11px] text-slate-500 font-mono text-center tracking-wide">
                    Guest progress is saved in this browser only.
                  </p>
                </div>
              )}

              {/* Toggle row */}
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500 font-medium">
                {mode === 'RECOVER' ? (
                  <>
                    <span>Remembered your password?</span>
                    <button
                      id="auth-mode-toggle"
                      type="button"
                      onClick={() => { setMode('SIGN_IN'); setError(null); }}
                      className="text-[#00F5FF] font-bold hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    <span>{mode === 'SIGN_IN' ? "New to the workspace?" : "Already have an account?"}</span>
                    <button
                      id="auth-mode-toggle"
                      type="button"
                      onClick={() => { setMode(mode === 'SIGN_IN' ? 'REGISTER' : 'SIGN_IN'); setError(null); }}
                      className="text-[#00F5FF] font-bold hover:underline cursor-pointer"
                    >
                      {mode === 'SIGN_IN' ? 'Create an account' : 'Sign in'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>

          ) : (

            /* ═══ LIVELY LOADING SCREEN ═══ */
            <motion.div
              key="auth-loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-left font-mono text-xs space-y-6 min-h-[360px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-500 text-[10px] border-b border-slate-900 pb-2 uppercase tracking-widest font-bold">
                  <span>Setting up your workspace</span>
                  <div className="flex items-center gap-1.5 text-[#FF5F1F]">
                    <Loader2 size={11} className="animate-spin" />
                    <span>Loading</span>
                  </div>
                </div>

                {/* Clean, satisfying live update rows */}
                <div className="space-y-2.5 text-slate-400">
                  {initializationLogs.slice(0, loadingStep + 1).map((log, index) => {
                    const isDone = log.includes('ready') || log.includes('established') || log.includes('dispatched') || log.includes('delivered');
                    return (
                      <motion.div
                        initial={{ opacity: 0, x: -3 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        key={index}
                        className={`leading-relaxed crypto-log-line ${isDone ? 'text-emerald-400 font-bold' : ''}`}
                      >
                        {isDone ? '✓ ' : '→ '}{log}
                      </motion.div>
                    );
                  })}
                  {/* Blinking cursor */}
                  {loadingStep < initializationLogs.length - 1 && (
                    <span className="terminal-cursor text-[#00F5FF] font-bold">▌</span>
                  )}
                </div>
              </div>

              {/* Success block */}
              {loadingStep === initializationLogs.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3 text-sm ${authSuccess ? 'success-card' : ''}`}
                >
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                      {mode === 'RECOVER' 
                        ? 'Recovery link dispatched' 
                        : (authSuccess ? 'Signed in — redirecting...' : 'Check your email')
                      }
                    </div>
                    <p className="font-sans text-slate-400 leading-normal text-xs">
                      {mode === 'RECOVER'
                        ? 'We sent a password reset token link to your email address. Open it to recover your credentials.'
                        : (authSuccess
                          ? 'Your workspace is ready. Loading your dashboard now.'
                          : 'We sent a verification link to your email address. Open it to finish setting up your account.'
                        )
                      }
                    </p>
                    {mode === 'RECOVER' && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsLoading(false);
                            setMode('SIGN_IN');
                            setError(null);
                          }}
                          className="text-xs font-mono font-bold text-[#00F5FF] hover:underline cursor-pointer"
                        >
                          ← Return to Sign In
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
