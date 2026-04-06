import React from 'react';
import { SignalScene }     from './components/3d/SignalScene';
import { FloatingSidebar } from './components/FloatingSidebar';
import { SceneManager }    from './SceneManager';
import './v3-style.css';

/**
 * Module1Root — The persistent premium shell.
 * SignalScene (R3F) handles high-fidelity 3D signal rendering.
 * SceneManager overlays each scene's UI on top with premium animations.
 */
export const Module1Root: React.FC = () => (
  <div
    className="module1-v3-root relative w-screen h-screen overflow-hidden select-none"
  >
    {/* Persistent 3D scene (R3F) — always alive, GPU driven */}
    <div className="absolute inset-0 pointer-events-none">
       <SignalScene />
    </div>

    {/* Floating scene index */}
    <FloatingSidebar />

    {/* Active scene overlay with 10/75/15 layout in SceneManager if possible */}
    <SceneManager />
  </div>
);
