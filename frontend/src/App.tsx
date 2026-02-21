
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TrainingCockpitPage } from './pages/TrainingCockpitPage';
import { HeroExperience } from './pages/HeroExperience';
import { SignalPlayground } from './pages/SignalPlayground';
import { GatekeeperGame } from './pages/GatekeeperGame';
import { LoginPage } from './pages/LoginPage';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { AssessmentPage } from './pages/AssessmentPage';

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
                <Route path="/home" element={<HeroExperience />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/lesson/:id" element={<LessonPage />} />
                <Route path="/training" element={<TrainingCockpitPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/hero" element={<HeroExperience />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}