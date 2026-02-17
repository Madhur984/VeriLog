import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssessmentPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl space-y-8"
            >
                <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                        <HelpCircle className="w-16 h-16 text-primary" />
                    </div>
                </div>

                <h1 className="font-heading font-extrabold text-5xl text-white tracking-tighter">
                    Aptitude Assessment
                </h1>

                <p className="font-mono text-slate-400 text-lg">
                    [ MCQ MODULE PENDING ]
                    <br />
                    The questions are being prepared by the central logic engine.
                </p>

                <div className="pt-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-8 py-3 bg-slate-900 border border-slate-700 text-slate-300 rounded-full font-bold hover:bg-slate-800 transition-colors flex items-center mx-auto"
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Return to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
