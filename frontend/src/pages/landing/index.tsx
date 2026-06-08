import React, { Suspense } from 'react';

/**
 * ENHANCEMENT 4: Code-Splitting Architecture
 * 
 * Uses React.lazy to create an explicit code-split boundary for the
 * landing page container. This ensures the heavy landing page bundle
 * (framer-motion, canvas renderer, FAQ accordion) is only loaded
 * when the user actually navigates to this route.
 * 
 * The loading fallback renders a minimal skeleton that matches the
 * landing page's dark void background to prevent layout flash.
 */
const BrilliantHome = React.lazy(
  () => import('./BrilliantHome')
);

const LandingPageSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-white dark:bg-[#0A0B12] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <img src="/logo.png" alt="" className="w-9 h-9 animate-pulse" />
      <div className="h-1 w-32 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-[#2E32FF]/40 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <Suspense fallback={<LandingPageSkeleton />}>
      <BrilliantHome />
    </Suspense>
  );
}
