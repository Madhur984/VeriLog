import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AndGate, Switch } from '../components/Gates/CircuitComponents';
import { ShieldCheck, Zap, Cpu, Fingerprint, User } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { ElectricParticleField } from '../components/backgrounds/ElectricParticleField';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const setFirstName = useGamificationStore((state) => state.setFirstName);
    const setHasSeenGreeting = useGamificationStore((state) => state.setHasSeenGreeting);

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
                    const { data, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: { data: { full_name: fullName } }
                    });
                    if (signUpError) throw signUpError;

                    setIsSwitchOn(true);
                    const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
                    setFirstName(name.split(' ')[0]);
                    setHasSeenGreeting(false);

                    if (data.session?.access_token) {
                        localStorage.setItem('supabase_token', data.session.access_token);
                    }
                    setTimeout(() => navigate('/hero'), 1000);
                } else {
                    const { data, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (signInError) throw signInError;

                    setIsSwitchOn(true);
                    const name = data.user?.user_metadata?.full_name || fullName || 'Explorer';
                    setFirstName(name.split(' ')[0]);
                    setHasSeenGreeting(false);

                    if (data.session?.access_token) {
                        localStorage.setItem('supabase_token', data.session.access_token);
                    }
                    setTimeout(() => navigate('/hero'), 1000);
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
