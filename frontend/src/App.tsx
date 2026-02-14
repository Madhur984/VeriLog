
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TrainingCockpitPage } from './pages/TrainingCockpitPage';
import { HeroExperience } from './pages/HeroExperience';
import { SignalPlayground } from './pages/SignalPlayground';
import { GatekeeperGame } from './pages/GatekeeperGame';
import { LoginPage } from './pages/LoginPage';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Entry Activity */}
                <Route path="/" element={<GatekeeperGame />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Main Experience Routes */}
                <Route path="/home" element={<HeroExperience />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/lesson/:id" element={<LessonPage />} />

                {/* Legacy / Direct Routes */}
                <Route path="/hero" element={<HeroExperience />} />
                <Route path="/training" element={<TrainingCockpitPage />} />
                <Route path="/playground" element={<SignalPlayground />} />
                <Route path="/gatekeeper" element={<GatekeeperGame />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}