import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GatekeeperLanding } from './pages/GatekeeperLanding';
import { HeroExperience } from './pages/HeroExperience';
import { WorkstationHome } from './pages/WorkstationHome';
import { ModuleOneHub } from './pages/ModuleOneHub';
import SignalMustReturnModule from './pages/ModulePage';
import SubModule1_1 from './components/level1/SubModule1_1';
import { ModuleTwo } from './pages/ModuleTwo';
import { ModuleThree } from './pages/ModuleThree';
import { ModuleFour } from './pages/ModuleFour';
import { ModuleFive } from './pages/ModuleFive';
import { LoginPage } from './pages/LoginPage';
import { GatekeeperGame } from './pages/GatekeeperGame';
import { AssessmentPage } from './pages/AssessmentPage';
import AiLab from '@/pages/AiLab/AiLab';

// New Integrated Pages
import { SkillTree } from './pages/SkillTree';
import { BossArena } from './pages/BossArena';
import { EngineeringPortfolio } from './pages/EngineeringPortfolio';
import { LogicStudio } from './pages/LogicStudio';
import { DebugMissionPage } from './pages/DebugMissionPage';
import { TrainingCockpitPage } from './pages/TrainingCockpitPage';
import { SignalPlayground } from './pages/SignalPlayground';
import { FSMPlayground } from './pages/FSMPlayground';
import { CPULabPage } from './pages/CPULabPage';
import { HardwareLeetCodePage } from './pages/HardwareLeetCodePage';
import { VerilogPlayground } from './pages/VerilogPlayground';

import Workbench from './pages/Workbench';
import { CommunityPage } from './pages/CommunityPage';
import { PortalLayout } from './layouts/PortalLayout';

import { TransitionProvider } from './hooks/useTransitionController';
import { TransitionOverlay } from './components/TransitionOverlay';

export default function App() {
    return (
        <BrowserRouter>
            <TransitionProvider>
                <TransitionOverlay />
                <Routes>
                    {/* Public / Intro Routes (Standalone) */}
                    <Route path="/" element={<GatekeeperLanding />} />
                    <Route path="/hero" element={<HeroExperience />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Standalone Workbench (No Portal Layout) */}
                    <Route path="/workbench" element={<Workbench />} />

                    {/* Portal Routes (Wrapped in PortalLayout) */}
                    <Route element={<PortalLayout />}>
                        <Route path="/dashboard" element={<Navigate to="/portal" replace />} />
                        <Route path="/portal" element={<WorkstationHome />} />
                        <Route path="/home" element={<WorkstationHome />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/skill-tree" element={<SkillTree />} />
                        <Route path="/boss-arena" element={<BossArena />} />
                        <Route path="/portfolio" element={<EngineeringPortfolio />} />
                        
                        {/* Features & Labs with Layout */}
                        <Route path="/ai-lab" element={<AiLab />} />

                        <Route path="/logic-studio" element={<LogicStudio />} />
                        <Route path="/playground" element={<SignalPlayground />} />
                        <Route path="/training" element={<TrainingCockpitPage />} />
                        <Route path="/fsm" element={<FSMPlayground />} />
                        <Route path="/cpu-lab" element={<CPULabPage />} />
                        <Route path="/hw-leetcode" element={<HardwareLeetCodePage />} />
                        <Route path="/eda-playground" element={<VerilogPlayground />} />
                        <Route path="/progress" element={<Navigate to="/skill-tree" replace />} />
                    </Route>

                    {/* Debug Missions (Standalone) */}
                    <Route path="/debug-mission/:id" element={<DebugMissionPage />} />

                    {/* Modules & Story Selection (Standalone) */}
                    <Route path="/module/1" element={<ModuleOneHub />} />
                    <Route path="/module/1/1" element={<SubModule1_1 onComplete={() => window.location.href = '/portal'} />} />
                    <Route path="/module/signal-must-return" element={<SignalMustReturnModule />} />
                    <Route path="/module/2" element={<ModuleTwo />} />
                    <Route path="/module/3" element={<ModuleThree />} />
                    <Route path="/module/4" element={<ModuleFour />} />
                    <Route path="/module/5" element={<ModuleFive />} />

                    <Route path="/gatekeeper" element={<GatekeeperGame />} />
                    <Route path="/assessment" element={<AssessmentPage />} />

                    <Route path="*" element={<Navigate to="/portal" replace />} />
                </Routes>
            </TransitionProvider>
        </BrowserRouter>
    );
}