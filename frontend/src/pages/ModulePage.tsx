import { useState } from 'react';
import { GraduationCap, Microscope, Puzzle, Lightbulb, Play } from 'lucide-react';
import ModuleSidebar from '@/components/ModuleSidebar';
import ModuleTopBar from '@/components/ModuleTopBar';
import ModuleContent from '@/components/ModuleContent';

const SignalMustReturnModule = () => {
    const [activeSection, setActiveSection] = useState('Circuit Discovery Lab');
    const [progress] = useState(0);

    const sections = [
        {
            title: 'ENGAGE',
            icon: <Play size={18} />,
            items: ['Circuit Discovery Lab']
        },
        {
            title: 'THEORY',
            icon: <GraduationCap size={18} />,
            items: ['Signal Propagation', 'Core Loop Rule', 'Return Physics', 'Signal Integrity']
        },
        {
            title: 'LAB',
            icon: <Microscope size={18} />,
            items: ['Signal Flow Experiment', 'Advanced Signal Lab']
        },
        {
            title: 'CHALLENGE',
            icon: <Puzzle size={18} />,
            items: ['Loop Knowledge Quiz', 'Structural Matching', 'Conceptual Synthesis', 'System Diagnosis']
        },
        {
            title: 'RECAP',
            icon: <Lightbulb size={18} />,
            items: ['Summary & Achievements', 'Module Preview', 'Open Sandbox']
        }
    ];

    const handleSelectSection = (item: string) => {
        setActiveSection(item);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200">
            {/* Main Layout */}
            <div className="flex">
                {/* Left Sidebar - Fixed */}
                <aside className="w-72 h-screen sticky top-0 z-20 overflow-y-auto border-r border-slate-200 bg-white shadow-sm">
                    <ModuleSidebar 
                        moduleTitle="Signal Must Return" 
                        sections={sections} 
                        activeItem={activeSection}
                        onSelectItem={handleSelectSection}
                    />
                </aside>

                {/* Right Content Area */}
                <main className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Top Bar - Sticky */}
                    <div className="sticky top-0 z-10 w-full">
                        <ModuleTopBar progress={progress} />
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-10 scroll-smooth">
                        <div className="max-w-4xl mx-auto">
                            <ModuleContent activeSection={activeSection} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SignalMustReturnModule;
