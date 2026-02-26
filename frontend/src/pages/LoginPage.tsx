import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AndGate, Switch } from '../components/Gates/CircuitComponents';
import { ShieldCheck, Zap, Cpu, Fingerprint, User } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const setFirstName = useUserStore((state) => state.setFirstName);
    const setHasSeenGreeting = useUserStore((state) => state.setHasSeenGreeting);
    const setIsNewUser = useUserStore((state) => state.setIsNewUser);
    const [level, setLevel] = useState(0);
    const [frequency, setFrequency] = useState(20);
    const [isSynced, setIsSynced] = useState(false);

    // Auth State
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isFullNameValid, setIsFullNameValid] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Level 0: Signal Sync Logic
    const TARGET_FREQ = 60;
    const TOLERANCE = 5;

    useEffect(() => {
        if (Math.abs(frequency - TARGET_FREQ) <= TOLERANCE) {
            setIsSynced(true);
            setTimeout(() => setLevel(1), 1500);
        } else {
            setIsSynced(false);
        }
    }, [frequency]);

    // Oscilloscope Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let offset = 0;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.strokeStyle = isSynced ? '#00E5FF' : '#475569';
            ctx.lineWidth = 2;

            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + Math.sin((x + offset) * (frequency / 50)) * 20;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
            offset += 2;
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();
        return () => window.cancelAnimationFrame(animationFrameId);
    }, [frequency, isSynced]);

    // Level 1: Logic Gates
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
        setIsPasswordValid(password.length >= 6);
        setIsFullNameValid(fullName.length >= 3);
    }, [email, password, fullName]);

    const handleMasterSwitch = async () => {
        const isFormValid = isEmailValid && isPasswordValid && (!isSignUp || isFullNameValid);

        if (isFormValid) {
            setIsLoading(true);
            setError(null);
            try {
                // Wrap Supabase call in a timeout to detect unreachable servers
                const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
                    Promise.race([
                        promise,
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('NETWORK_TIMEOUT')), ms)
                        ),
                    ]);

                if (isSignUp) {
                    const { data, error: signUpError } = await withTimeout(
                        supabase.auth.signUp({
                            email,
                            password,
                            options: { data: { full_name: fullName || '' } },
                        }),
                        8000
                    );
                    if (signUpError) throw signUpError;

                    setIsSwitchOn(true);
                    const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
                    setFirstName(name.split(' ')[0]);
                    setHasSeenGreeting(false);

                    if (data.session?.access_token) {
                        localStorage.setItem('supabase_token', data.session.access_token);
                        setIsNewUser(true);
                        setTimeout(() => navigate('/'), 1000);
                    } else {
                        // Supabase offline edge case — no session but user object exists
                        setIsSwitchOn(true);
                        const name = data.user?.user_metadata?.full_name || 'Explorer';
                        setFirstName(name.split(' ')[0]);
                        setHasSeenGreeting(false);
                        localStorage.setItem('supabase_token', 'offline_session');
                        setIsNewUser(true);
                        setTimeout(() => navigate('/'), 1000);
                    }
                } else {
                    const { data, error: signInError } = await withTimeout(
                        supabase.auth.signInWithPassword({ email, password }),
                        8000
                    );

                    if (signInError) throw signInError;

                    setIsSwitchOn(true);
                    const name = data.user?.user_metadata?.full_name || 'Explorer';
                    setFirstName(name.split(' ')[0]);
                    setHasSeenGreeting(false);
                    localStorage.setItem('supabase_token', data.session.access_token);
                    setIsNewUser(false);
                    setTimeout(() => navigate('/portal'), 1000);
                }
            } catch (err: any) {
                const isNetworkError =
                    err.message === 'NETWORK_TIMEOUT' ||
                    err.message === 'fetch failed' ||
                    err.message?.includes('Failed to fetch') ||
                    err.message?.includes('NetworkError') ||
                    err.cause?.code === 'UND_ERR_CONNECT_TIMEOUT';

                if (isNetworkError) {
                    // ── OFFLINE FALLBACK: Supabase unreachable, allow local access ──
                    console.warn('[AUTH] Supabase unreachable — activating offline mode');
                    setIsSwitchOn(true);
                    const name = fullName || email.split('@')[0] || 'Explorer';
                    setFirstName(name.split(' ')[0]);
                    setHasSeenGreeting(false);
                    localStorage.setItem('supabase_token', 'offline_session');
                    localStorage.setItem('offline_mode', 'true');
                    // In offline mode, treat as new user to show onboarding
                    setIsNewUser(isSignUp);
                    setTimeout(() => navigate(isSignUp ? '/' : '/portal'), 1000);
                } else {
                    console.error('Auth Error:', err);
                    setError(err.message || 'Authentication Failed.');
                    setIsSwitchOn(false);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            if (!isEmailValid) setError("Invalid Email Logic (missing @ or .domain)");
            else if (!isPasswordValid) setError("Password Protocol: Minimum 6 characters required");
            else if (isSignUp && !isFullNameValid) setError("Identify Requirement: Name must be 3+ chars");
        }
    };

    return (
        <div className="login-container">
            <div className="hardware-mesh"></div>

            <motion.div
                className={`login-card ${isSynced ? 'power-on' : ''} ${isSignUp ? 'signup-mode' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="card-header">
                    <Cpu className={`header-icon ${isSynced ? 'active' : ''}`} />
                    <h1>VERILOG <span className="dim">// {isSignUp ? 'REGISTER_USER' : 'SYSTEM_ACCESS'}</span></h1>
                </div>

                <AnimatePresence mode="wait">
                    {level === 0 && (
                        <motion.div
                            key="level0"
                            className="level-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="oscilloscope-wrapper">
                                <canvas ref={canvasRef} width={300} height={100} className="oscilloscope" />
                                <div className="freq-display">
                                    <span className="label">SIGNAL_FREQ</span>
                                    <span className="value">{frequency}Hz</span>
                                </div>
                            </div>

                            <div className="control-panel">
                                <p className="instruction">TUNE TO 60Hz UNTIL STABLE</p>
                                <input
                                    type="range"
                                    min="10"
                                    max="110"
                                    value={frequency}
                                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                                    className="freq-slider"
                                />
                            </div>
                        </motion.div>
                    )}

                    {level === 1 && (
                        <motion.div
                            key="level1"
                            className="level-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {isSignUp && (
                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <User className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="FULL_NAME_STRING"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="hardware-input"
                                        />
                                    </div>
                                    <AndGate className={`logic-gate ${isFullNameValid ? 'active' : ''}`} />
                                </div>
                            )}

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <Fingerprint className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="IDENTIFICATION_STRING"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="hardware-input"
                                    />
                                </div>
                                <AndGate className={`logic-gate ${isEmailValid ? 'active' : ''}`} />
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <ShieldCheck className="input-icon" />
                                    <input
                                        type="password"
                                        placeholder="ACCESS_KEY_ENCRYPTED"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="hardware-input"
                                    />
                                </div>
                                <AndGate className={`logic-gate ${isPasswordValid ? 'active' : ''}`} />
                            </div>

                            {error && <div className="error-message">Error: {error}</div>}

                            <div className="master-action">
                                <div className={`switch-label ${(isEmailValid && isPasswordValid && (!isSignUp || isFullNameValid)) ? 'glow' : ''}`}>
                                    {isLoading ? 'ESTABLISHING_LINK...' : (isEmailValid && isPasswordValid && (!isSignUp || isFullNameValid)) ? 'MAINTAIN_STABILITY' : 'AWAITING_LOGIC_HIGH'}
                                </div>
                                <div className="switch-wrapper">
                                    <Switch
                                        isOn={isSwitchOn}
                                        onClick={handleMasterSwitch}
                                        className={!(isEmailValid && isPasswordValid && (!isSignUp || isFullNameValid)) || isLoading ? 'disabled' : ''}
                                    />
                                </div>
                                <button className="mode-toggle" onClick={() => { setIsSignUp(!isSignUp); setError(null); }}>
                                    {isSignUp ? 'Already have access? LOG_IN' : 'New user? REQUEST_ACCESS'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="card-footer">
                    <div className="status-bit">
                        <Zap className={isSynced ? 'active' : ''} />
                        <span>SYNC: {isSynced ? 'LOCKED' : 'SEARCHING'}</span>
                    </div>
                    <div className="status-bit">
                        <div className={`led ${(isEmailValid && isPasswordValid && (!isSignUp || isFullNameValid)) ? 'on' : ''}`}></div>
                        <span>LOGIC: {(isEmailValid && isPasswordValid && (!isSignUp || isFullNameValid)) ? 'HIGH' : 'LOW'}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
