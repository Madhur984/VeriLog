import React from 'react';
import { CommunityFeed } from '../components/community/CommunityFeed';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CommunityPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#07080C] text-slate-200">
            <header className="h-14 border-b border-white/5 flex items-center px-6">
                <button onClick={() => navigate('/portal')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Portal
                </button>
            </header>
            <main>
                <CommunityFeed />
            </main>
        </div>
    );
};
