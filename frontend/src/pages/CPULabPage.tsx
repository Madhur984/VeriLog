import React from 'react';
import { CPUBuilderPanel } from '../components/cpu/CPUBuilderPanel';

export const CPULabPage: React.FC = () => {
    return (
        <div className="h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
            <CPUBuilderPanel />
        </div>
    );
};
