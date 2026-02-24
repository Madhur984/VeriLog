import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ActivityLevel1 } from '../activities/ActivityLevel1';

/**
 * Module1Activity — Fullscreen dedicated page for the interactive circuit lab.
 * Flow: User lands here first → completes activity → navigates to /module/1/theory
 */
export const Module1Activity: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-[#030712] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md z-30 shrink-0">
                <button
                    onClick={() => navigate('/portal')}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
                >
                    <ArrowLeft size={16} />
                    <span className="font-mono text-xs uppercase tracking-widest">Exit Lab</span>
                </button>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">Module 01</span>
                    <div className="h-4 w-px bg-slate-800" />
                    <h1 className="text-sm font-bold text-white tracking-tight">A Signal Must Return</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-8 h-1.5 rounded-full bg-[#00D2FF]" />
                        <div className="w-8 h-1.5 rounded-full bg-slate-800" />
                        <div className="w-8 h-1.5 rounded-full bg-slate-800" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">1/3</span>
                </div>
            </div>

            {/* Fullscreen Activity */}
            <div className="flex-1 min-h-0">
                <ActivityLevel1
                    onComplete={() => navigate('/module/1/theory')}
                />
            </div>
        </div>
    );
};
