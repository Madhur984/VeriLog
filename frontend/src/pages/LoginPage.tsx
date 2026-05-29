import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { startGuestSession } from '../lib/auth';
import { AndGate, Switch } from '../components/Gates/CircuitComponents';
import { ShieldCheck, Zap, Cpu, Fingerprint, User, UserCircle2 } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { ElectricParticleField } from '../components/backgrounds/ElectricParticleField';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setFirstName = useGamificationStore((state) => state.setFirstName);
    const setHasSeenGreeting = useGamificationStore((state) => state.setHasSeenGreeting);

    // Post-login destination - RequireAuth puts the original URL in state.from.
    const redirectTo = (location.state as { from?: string } | null)?.from || '/portal';

    // Auth State
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [guestName, setGuestName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const guestNameTrimmed = guestName.trim();
    const isGuestNameValid = guestNameTrimmed.length >= 2 && guestNameTrimmed.length <= 32;

    const handleGuestLogin = () => {
        if (!isGuestNameValid) {
            setError('Guest username is required (2-32 characters)');
            return;
        }
        setError(null);
        startGuestSession(guestNameTrimmed);
        setFirstName(guestNameTrimmed.split(' ')[0]);
        setHasSeenGreeting(false);
        navigate(redirectTo, { replace: true });
    };

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isFullNameValid, setIsFullNameValid] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    // Validate inputs
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
                if (isSignUp) {
                    // The verification email's confirm link redirects here. Use the
                    // real deployed origin (or VITE_SITE_URL) instead of whatever
                    // Supabase's dashboard "Site URL" defaults to (was localhost).
                    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                    const { data, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { full_name: fullName },
                            emailRedirectTo: `${siteUrl}/login`,
                        }
                    });
                    if (signUpError) throw signUpError;

                    const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
                    const token = data.session?.access_token;
                    if (token) {
                        // Confirmation OFF: a session is returned immediately - persist + enter.
                        localStorage.setItem('supabase_token', token);
                        setIsSwitchOn(true);
                        setFirstName(name.split(' ')[0]);
                        setHasSeenGreeting(false);
                        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
                    } else {
                        // Confirmation ON: no session yet. Don't fake a login (else the user
                        // lands on /portal but reverts to "Sign in" on the next reload).
                        setIsSwitchOn(false);
                        setError('Account created. Check your email to verify, then sign in.');
                    }
                } else {
                    const { data, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (signInError) throw signInError;

                    const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
                    const token = data.session?.access_token;
                    if (token) {
                        localStorage.setItem('supabase_token', token);
                        setIsSwitchOn(true);
                        setFirstName(name.split(' ')[0]);
                        setHasSeenGreeting(false);
                        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
                    } else {
                        // Successful call but no session token - treat as not logged in.
                        setIsSwitchOn(false);
                        setError('Could not establish a session. Please try again.');
                    }
                }
            } catch (err: any) {
                console.error('Auth Error details:', err);
                const errorMessage = err.message || 'Authentication Failed.';
                setError(errorMessage);
                setIsSwitchOn(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            if (!isEmailValid) setError('Invalid Email Logic (missing @ or .domain)');
            else if (!isPasswordValid) setError('Password Protocol: Minimum 6 characters required');
            else if (isSignUp && !isFullNameValid) setError('Identify Requirement: Name must be 3+ chars');
        }
    };

    return (
        <div className="login-container">
            <ElectricParticleField />

            <motion.div
                className={`login-card power-on ${isSignUp ? 'signup-mode' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="card-header">
                    <Cpu className="header-icon active" />
                    <h1>VERILOG <span className="dim">// {isSignUp ? 'REGISTER_USER' : 'SYSTEM_ACCESS'}</span></h1>
                </div>

                <motion.div
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

                        {/* Guest entry - bypasses Supabase entirely. No persistence beyond localStorage. */}
                        <div className="guest-divider">
                            <span>OR</span>
                        </div>
                        <div className="guest-name-row">
                            <UserCircle2 size={16} className="guest-name-icon" />
                            <input
                                type="text"
                                placeholder="GUEST_USERNAME (required)"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && isGuestNameValid) handleGuestLogin();
                                }}
                                className="guest-name-input"
                                maxLength={32}
                                autoComplete="nickname"
                            />
                        </div>
                        <button
                            type="button"
                            className="guest-button"
                            onClick={handleGuestLogin}
                            disabled={isLoading || !isGuestNameValid}
                            title={
                                isGuestNameValid
                                    ? 'Continue as guest. Progress saved locally only.'
                                    : 'Enter a guest username (2-32 chars) to continue'
                            }
                        >
                            <UserCircle2 size={18} />
                            <span>BYPASS_AUTH // GUEST_MODE</span>
                        </button>
                        <p className="guest-hint">
                            Guest progress lives in this browser only.
                        </p>
                    </div>
                </motion.div>

                <div className="card-footer">
                    <div className="status-bit">
                        <Zap className="active" />
                        <span>SYNC: LOCKED</span>
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
