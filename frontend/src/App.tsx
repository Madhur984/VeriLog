import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Module1Root } from './components/level1/module1_v3/Module1Root';
import { TransitionProvider } from './hooks/useTransitionController';
import { TransitionOverlay } from './components/TransitionOverlay';

export default function App() {
    return (
        <BrowserRouter>
            <TransitionProvider>
                <TransitionOverlay />
                <Routes>
                    <Route path="/module/1" element={<Module1Root />} />
                    <Route path="/module/1/1" element={<Module1Root />} />
                    <Route path="*" element={<Navigate to="/module/1/1" replace />} />
                </Routes>
            </TransitionProvider>
        </BrowserRouter>
    );
}