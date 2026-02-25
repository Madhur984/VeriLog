import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HeroExperience } from './pages/HeroExperience';
import { WorkstationHome } from './pages/WorkstationHome';
import { ModuleOneHub } from './pages/ModuleOneHub';
import { ModuleOne } from './pages/ModuleOne';
import { LoginPage } from './pages/LoginPage';
import { CircuitCanvas } from './simulator/CircuitCanvas';
import { MascotGuide } from './components/Bot/MascotGuide';
import { SignalPlayground } from './pages/SignalPlayground';
import { GatekeeperGame } from './pages/GatekeeperGame';
import { AssessmentPage } from './pages/AssessmentPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HeroExperience />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portal" element={<WorkstationHome />} />

                {/* Introductory / Legacy Modules */}
                <Route path="/playground" element={<SignalPlayground />} />
                <Route path="/gatekeeper" element={<GatekeeperGame />} />
                <Route path="/assessment" element={<AssessmentPage />} />

                {/* Module 1 Entry Point */}
                <Route path="/module/1" element={<ModuleOneHub />} />
                <Route path="/module/1/lab" element={<CircuitCanvas />} />
                <Route path="/module/1/theory" element={<ModuleOne />} />

                <Route path="*" element={<Navigate to="/portal" replace />} />
            </Routes>
            <MascotGuide />
        </BrowserRouter>
    );
}