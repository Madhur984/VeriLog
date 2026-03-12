import React, { useState } from 'react';
import { ChallengeList } from '../components/challenges/ChallengeList';
import { ChallengePanel } from '../components/challenges/ChallengePanel';
// import { HARDWARE_CHALLENGES } from '../engines/challenges/ChallengeEngine';
const HARDWARE_CHALLENGES: any[] = [];
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const HardwareLeetCodePage: React.FC = () => {
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
            <header className="h-14 shrink-0 border-b border-white/10 flex items-center px-6 bg-[#111]">
                <button onClick={() => {
                    if (activeChallengeId) setActiveChallengeId(null);
                    else navigate('/portal');
                }} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mr-4">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-lg font-bold">Hardware LeetCode</h1>
            </header>

            <div className="flex-1 overflow-auto">
                {activeChallengeId ? (
                    <ChallengePanel
                        challenge={HARDWARE_CHALLENGES.find(c => c.id === activeChallengeId)!}
                        onBack={() => setActiveChallengeId(null)}
                        onSubmit={(circuitData) => {
                            console.log('Submitted', circuitData);
                            return { passed: true, score: 100, xpEarned: 50, badges: [], passedRows: 4, totalRows: 4, failedRows: [], gatesUsed: 10, timeTaken: 5 };
                        }}
                    />
                ) : (
                    <ChallengeList
                        completedIds={[]}
                        onSelect={(challenge) => setActiveChallengeId(challenge.id)}
                    />
                )}
            </div>
        </div>
    );
};
