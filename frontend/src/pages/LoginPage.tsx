import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AndGate, Switch } from '../components/Gates/CircuitComponents';
import { ShieldCheck, Zap, Cpu, Fingerprint, User } from 'lucide-react';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
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
                const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
                const payload = isSignUp ? { email, password, full_name: fullName } : { email, password };

                // Assuming backend runs on 3000
                const response = await axios.post(`http://localhost:3000${endpoint}`, payload);

                if (response.data.session?.access_token || response.data.message) {
                    setIsSwitchOn(true);
                    if (response.data.session?.access_token) {
                        localStorage.setItem('supabase_token', response.data.session.access_token);
                    }
                    setTimeout(() => {
                        navigate('/home');
                    }, 1000);
                }
            } catch (err: any) {
                console.error("Auth Error details:", err);
                const responseData = err.response?.data;
                const axiosMessage = err.message;

                let errorMessage = 'Authentication Failed. Check logs.';

                if (typeof responseData === 'object' && responseData?.error) {
                    errorMessage = responseData.error;
                } else if (typeof responseData === 'string' && responseData.includes('<!DOCTYPE html>')) {
                    errorMessage = 'System Engine Error (HTML Response). Check backend.';
                } else if (axiosMessage === 'Network Error') {
                    errorMessage = 'Engine Connection Offline. Check backend status.';
                } else if (axiosMessage) {
                    errorMessage = `Protocol Error: ${axiosMessage}`;
                }

                setError(errorMessage);
                setIsSwitchOn(false);
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
