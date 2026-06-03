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
const LandingPageContainer = React.lazy(
  () => import('./LandingPageContainer')
);

const LandingPageSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-[#03050a] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00F5FF] to-[#10B981] animate-pulse" />
      <div className="h-1 w-32 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-[#00F5FF]/30 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <Suspense fallback={<LandingPageSkeleton />}>
      <LandingPageContainer />
    </Suspense>
  );
}
