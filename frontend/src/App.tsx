import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GatekeeperLanding } from './pages/GatekeeperLanding';
import { HeroExperience } from './pages/HeroExperience';
import { WorkstationHome } from './pages/WorkstationHome';
import { ModuleOneHub } from './pages/ModuleOneHub';
import { ModuleTwo } from './pages/ModuleTwo';
import { LoginPage } from './pages/LoginPage';
import { CircuitCanvas } from './simulator/CircuitCanvas';
import { MascotGuide } from './components/Bot/MascotGuide';
import { GatekeeperGame } from './pages/GatekeeperGame';
import { AssessmentPage } from './pages/AssessmentPage';
import AiLab from '@/pages/AiLab/AiLab';

// New Integrated Pages
import { TrainingCockpitPage } from './pages/TrainingCockpitPage';
import { SignalPlayground } from './pages/SignalPlayground';
import { CircuitLab } from './circuit-lab/CircuitLab';
import { VoltMonkeyIntro } from './pages/VoltMonkeyIntro';
import { WhatAreSignals } from './pages/WhatAreSignals';
import { FSMPlayground } from './pages/FSMPlayground';
import { SkillTree } from './pages/SkillTree';
import { VerilogPlayground } from './pages/VerilogPlayground';
import { BossArena } from './pages/BossArena';
import { EngineeringPortfolio } from './pages/EngineeringPortfolio';
import { LogicStudio } from './pages/LogicStudio';
import { DebugMissionPage } from './pages/DebugMissionPage';

import { TransitionProvider } from './hooks/useTransitionController';
import { TransitionOverlay } from './components/TransitionOverlay';

export default function App() {
    return (
        <BrowserRouter>
            <TransitionProvider>
                <TransitionOverlay />
                <Routes>
                    {/* Welcome / Intro */}
                    <Route path="/" element={<GatekeeperLanding />} />
                    <Route path="/hero" element={<HeroExperience />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Main Hub */}
                    <Route path="/portal" element={<WorkstationHome />} />
                    <Route path="/home" element={<WorkstationHome />} />

                    {/* Advanced Features & Lab */}
                    <Route path="/ai-lab" element={<AiLab />} />
                    <Route path="/circuit-lab" element={<CircuitLab />} />
                    <Route path="/logic-studio" element={<LogicStudio />} />
                    <Route path="/debug-mission/:id" element={<DebugMissionPage />} />
                    <Route path="/playground" element={<SignalPlayground />} />
                    <Route path="/training" element={<TrainingCockpitPage />} />
                    <Route path="/fsm" element={<FSMPlayground />} />
                    <Route path="/skill-tree" element={<SkillTree />} />
                    <Route path="/verilog" element={<VerilogPlayground />} />
                    <Route path="/boss-arena" element={<BossArena />} />
                    <Route path="/portfolio" element={<EngineeringPortfolio />} />

                    {/* Modules & Story Selection */}
                    <Route path="/module/1" element={<ModuleOneHub />} />
                    <Route path="/module/1/lab" element={<CircuitCanvas />} />
                    <Route path="/module/1/theory" element={<WhatAreSignals />} />
                    <Route path="/module/2" element={<ModuleTwo />} />

                    {/* Legacy / Game Support */}
                    <Route path="/gatekeeper" element={<GatekeeperGame />} />
                    <Route path="/assessment" element={<AssessmentPage />} />
                    <Route path="/voltmonkey" element={<VoltMonkeyIntro />} />
                    <Route path="/level/1" element={<VoltMonkeyIntro />} />

                    <Route path="*" element={<Navigate to="/portal" replace />} />
                </Routes>
                <MascotGuide />
            </TransitionProvider>
        </BrowserRouter>
    );
}