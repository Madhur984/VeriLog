
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TrainingCockpitPage } from './pages/TrainingCockpitPage';
import { HeroExperience } from './pages/HeroExperience';
import { SignalPlayground } from './pages/SignalPlayground';
import { GatekeeperGame } from './pages/GatekeeperGame';
import { LoginPage } from './pages/LoginPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { WorkstationHome } from './pages/WorkstationHome';
import { ModuleOne } from './pages/ModuleOne';
import { MascotGuide } from './components/Bot/MascotGuide';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Intro Flow */}
                <Route path="/" element={<HeroExperience />} />
                <Route path="/playground" element={<SignalPlayground />} />
                <Route path="/gatekeeper" element={<GatekeeperGame />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Authenticated Routes */}
                <Route path="/portal" element={<WorkstationHome />} />
                <Route path="/home" element={<WorkstationHome />} />
                <Route path="/training" element={<TrainingCockpitPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/hero" element={<HeroExperience />} />
                <Route path="/module/1" element={<ModuleOne />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global floating mascot guide */}
            <MascotGuide />
        </BrowserRouter>
    );
}