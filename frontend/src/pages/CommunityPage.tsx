import React from 'react';
import { CommunityFeed } from '../components/community/CommunityFeed';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CommunityPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[100svh] bg-slate-50 text-slate-900 overflow-x-hidden">
            <header className="h-14 border-b border-slate-200 bg-white flex items-center px-3 sm:px-6">
                <button onClick={() => navigate('/portal')} className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Portal
                </button>
            </header>
            <main>
                <CommunityFeed />
            </main>
        </div>
    );
};
