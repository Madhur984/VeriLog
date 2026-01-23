
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { QuestsPage } from './pages/QuestsPage';
import { ShopPage } from './pages/ShopPage';
import { WelcomeScreen } from './components/WelcomeScreen';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<WelcomeScreen onStart={() => window.location.href = '/learn'} />} />

                {/* Protected App Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/learn" element={<LearnPage />} />
                    <Route path="/leaderboard" element={<div className="p-8 text-center text-neutral-400">Leaderboard Coming Soon</div>} />
                    <Route path="/quests" element={<QuestsPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/profile" element={<div className="p-8 text-center text-neutral-400">Profile Coming Soon</div>} />
                </Route>

                {/* Fullscreen Lesson Mode (No Sidebar) */}
                <Route path="/lesson/:id" element={<LessonPage />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}