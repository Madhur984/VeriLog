import React from 'react';
import { CPUBuilderPanel } from '../components/cpu/CPUBuilderPanel';

export const CPULabPage: React.FC = () => {
    return (
        <div className="h-screen w-full bg-[#0a0f18] text-white overflow-hidden">
            <CPUBuilderPanel />
        </div>
    );
};
