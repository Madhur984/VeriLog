import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.tsx'
import './index.css'
// Side-effect import: installs the axios auth interceptor at startup so
// every request automatically carries the active session token.
import './lib/http'
import { initSessionSync } from './lib/sessionSync'

// Bridge Supabase sessions (OAuth / email-verify / password-recovery redirects)
// into the localStorage token the auth gate reads. Must run before first render.
initSessionSync()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <MotionConfig reducedMotion="user">
                <App />
            </MotionConfig>
        </BrowserRouter>
    </React.StrictMode>,
)

// PWA: Registration for Offline & Home Screen Integration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(err => {
      console.log("CRITICAL ERROR: Service Worker Registration Protocol Failure", err);
    });
  });
}