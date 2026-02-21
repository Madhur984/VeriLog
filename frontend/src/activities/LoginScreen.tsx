import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export const LoginScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Soft Ambient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl shadow-black/40">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20 rotate-3">
                            <span className="text-white font-heading font-black text-2xl">V</span>
                        </div>
                        <h1 className="text-4xl font-heading font-black text-white tracking-tight mb-3">
                            VeriLog
                        </h1>
                        <p className="text-slate-400 font-medium">
                            Educational Logic Platform
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link to="/home" className="block">
                            <Button className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-lg shadow-xl shadow-indigo-500/10 transition-all active:scale-[0.98]">
                                Get Started
                            </Button>
                        </Link>
                        <Button variant="secondary" className="w-full h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-white border-white/5 font-heading font-bold text-lg transition-all active:scale-[0.98]">
                            View Sandbox
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                            Secure Learning Environment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};