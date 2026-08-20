import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from './hooks/useTransitionController';
import { TransitionOverlay } from './components/TransitionOverlay';
import { migrateStorage } from './utils/storageMigration';
import { RequireAuth, RequireAccount } from './components/RequireAuth';
import { LandingOrPortal } from './components/LandingOrPortal';
import { ModuleGate } from './components/ModuleGate';
import { RouteFallback } from './components/RouteFallback';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { loadChunk } from './utils/loadChunk';

// Layout (eager - tiny, wraps every portal route)
import { PortalLayout } from './layouts/PortalLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { SeoManager } from './components/SeoManager';
import { EngagementTracker } from './components/EngagementTracker';
import { ConsentBanner } from './components/ConsentBanner';

// Floating mascot (bottom-right, site-wide) — lazy so Rive's runtime stays off first paint
const MascotWidget = lazy(() => loadChunk(() => import('./components/MascotWidget')));
const FeedbackBubble = lazy(() => loadChunk(() => import('./components/FeedbackBubble')));

/**
 * Every route below is code-split via React.lazy, so the browser only downloads
 * the chunk for the page actually being opened (instead of the whole app in one
 * giant bundle). `named` adapts our named exports to lazy's default-export API.
 */
const named = (loader: () => Promise<any>, key: string) =>
  lazy(() => loadChunk(loader).then((m) => ({ default: m[key] })));

// Core pages
const LandingPage = lazy(() => loadChunk(() => import('./pages/landing')));
const LoginPage = named(() => import('./pages/LoginPage'), 'LoginPage');
const WorkstationHome = named(() => import('./pages/WorkstationHome'), 'WorkstationHome');
const CareerRoadmapPage = lazy(() => loadChunk(() => import('./pages/career-roadmap/index')));
const LibraryPage = lazy(() => loadChunk(() => import('./pages/library/index')));
const EngineeringPortfolio = named(() => import('./pages/EngineeringPortfolio'), 'EngineeringPortfolio');
const KMapLabPage = named(() => import('./pages/KMapLabPage'), 'KMapLabPage');
const HardwareLeetCodePage = named(() => import('./pages/HardwareLeetCodePage'), 'HardwareLeetCodePage');
const SkillTree = named(() => import('./pages/SkillTree'), 'SkillTree');
const BossArena = named(() => import('./pages/BossArena'), 'BossArena');
const Workbench = lazy(() => loadChunk(() => import('./pages/Workbench')));

// Playgrounds & social
const FSMPlayground = named(() => import('./pages/FSMPlayground'), 'FSMPlayground');
const VerilogJudge = named(() => import('./pages/VerilogJudge'), 'VerilogJudge');
const VerilogSandbox = named(() => import('./pages/VerilogSandbox'), 'VerilogSandbox');
const AnalogyLibrary = named(() => import('./pages/AnalogyLibrary'), 'AnalogyLibrary');
const VerilogLibrary = named(() => import('./pages/VerilogLibrary'), 'VerilogLibrary');
const InterviewPrep = lazy(() => loadChunk(() => import('./pages/InterviewPrep')));
const SiliconMap = named(() => import('./pages/SiliconMap'), 'SiliconMap');
const PledgePage = named(() => import('./pages/PledgePage'), 'PledgePage');
const PrivacyPolicyPage = named(() => import('./pages/PrivacyPolicyPage'), 'PrivacyPolicyPage');
const TermsPage = named(() => import('./pages/TermsPage'), 'TermsPage');
const SignalPlayground = named(() => import('./pages/SignalPlayground'), 'SignalPlayground');
const LogicStudio = named(() => import('./pages/LogicStudio'), 'LogicStudio');
const QuestsPage = named(() => import('./pages/QuestsPage'), 'QuestsPage');
const ActivityPage = named(() => import('./pages/ActivityPage'), 'ActivityPage');
const CommunityPage = named(() => import('./pages/CommunityPage'), 'CommunityPage');
const DebugMissionPage = named(() => import('./pages/DebugMissionPage'), 'DebugMissionPage');
const GatekeeperGame = named(() => import('./pages/GatekeeperGame'), 'GatekeeperGame');
const AiLab = lazy(() => loadChunk(() => import('./pages/AiLab/AiLab')));
const SiliconSecrets = named(() => import('./pages/SiliconSecrets'), 'SiliconSecrets');
const ResetPasswordPage = named(() => import('./pages/ResetPasswordPage'), 'ResetPasswordPage');
const VerifyEmailPage = named(() => import('./pages/VerifyEmailPage'), 'VerifyEmailPage');
const SettingsPage = named(() => import('./pages/SettingsPage'), 'SettingsPage');
const ProfilePage = named(() => import('./pages/ProfilePage'), 'ProfilePage');
const NotFoundPage = named(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// Modules (the heaviest chunks - three.js / monaco / scene graphs live here)
const ModuleOne = named(() => import('./pages/ModuleOne'), 'ModuleOne');
const ModuleTwo = named(() => import('./pages/ModuleTwo'), 'ModuleTwo');
const ModuleThree = named(() => import('./pages/ModuleThree'), 'ModuleThree');
const ModuleFour = named(() => import('./pages/ModuleFour'), 'ModuleFour');
const SandboxModule5 = named(() => import('./pages/SandboxModule5'), 'SandboxModule5');
const Module1Root = named(() => import('./components/level1/module1_v4/Module1Root'), 'Module1Root');
const Module5Root = named(() => import('./components/level1/module5_v4/Module5Root'), 'Module5Root');
const DsdModule1Root = named(() => import('./components/level1/dsd_module1_v1/DsdModule1Root'), 'DsdModule1Root');
const DsdModule2Root = named(() => import('./components/level1/dsd_module2_v1/DsdModule2Root'), 'DsdModule2Root');
const DsdModule3Root = named(() => import('./components/level1/dsd_module3_v1/DsdModule3Root'), 'DsdModule3Root');
const DsdModule4Root = named(() => import('./components/level1/dsd_module4_v1/DsdModule4Root'), 'DsdModule4Root');
const DsdModule5Root = named(() => import('./components/level1/dsd_module5_v1/DsdModule5Root'), 'DsdModule5Root');
const DsdModule6Root = named(() => import('./components/level1/dsd_module6_v1/DsdModule6Root'), 'DsdModule6Root');
const DsdModule7Root = named(() => import('./components/level1/dsd_module7_v1/DsdModule7Root'), 'DsdModule7Root');
const DsdModule8Root = named(() => import('./components/level1/dsd_module8_v1/DsdModule8Root'), 'DsdModule8Root');
const DsdModule9Root = named(() => import('./components/level1/dsd_module9_v1/DsdModule9Root'), 'DsdModule9Root');
const DsdModule10Root = named(() => import('./components/level1/dsd_module10_v1/DsdModule10Root'), 'DsdModule10Root');
const DsdModule11Root = named(() => import('./components/level1/dsd_module11_v1/DsdModule11Root'), 'DsdModule11Root');
const DsdModule12Root = named(() => import('./components/level1/dsd_module12_v1/DsdModule12Root'), 'DsdModule12Root');
const DsdModule13Root = named(() => import('./components/level1/dsd_module13_v1/DsdModule13Root'), 'DsdModule13Root');
const DsdModule14Root = named(() => import('./components/level1/dsd_module14_v1/DsdModule14Root'), 'DsdModule14Root');
const DsdModule15Root = named(() => import('./components/level1/dsd_module15_v1/DsdModule15Root'), 'DsdModule15Root');
const DsdModule16Root = named(() => import('./components/level1/dsd_module16_v1/DsdModule16Root'), 'DsdModule16Root');
const DsdModule17Root = named(() => import('./components/level1/dsd_module17_v1/DsdModule17Root'), 'DsdModule17Root');
const DsdModule18Root = named(() => import('./components/level1/dsd_module18_v1/DsdModule18Root'), 'DsdModule18Root');
const DsdModule19Root = named(() => import('./components/level1/dsd_module19_v1/DsdModule19Root'), 'DsdModule19Root');
const DsdModule20Root = named(() => import('./components/level1/dsd_module20_v1/DsdModule20Root'), 'DsdModule20Root');
const DsdModule21Root = named(() => import('./components/level1/dsd_module21_v1/DsdModule21Root'), 'DsdModule21Root');
const DsdModule22Root = named(() => import('./components/level1/dsd_module22_v1/DsdModule22Root'), 'DsdModule22Root');
const DsdModule23Root = named(() => import('./components/level1/dsd_module23_v1/DsdModule23Root'), 'DsdModule23Root');
const DsdModule24Root = named(() => import('./components/level1/dsd_module24_v1/DsdModule24Root'), 'DsdModule24Root');
const DsdModule25Root = named(() => import('./components/level1/dsd_module25_v1/DsdModule25Root'), 'DsdModule25Root');
const DsdModule26Root = named(() => import('./components/level1/dsd_module26_v1/DsdModule26Root'), 'DsdModule26Root');
const DsdModule27Root = named(() => import('./components/level1/dsd_module27_v1/DsdModule27Root'), 'DsdModule27Root');
// Sequential Logic track (dsd/28+)
const DsdModule28Root = named(() => import('./components/level1/dsd_module28_v1/DsdModule28Root'), 'DsdModule28Root');
const DsdModule29Root = named(() => import('./components/level1/dsd_module29_v1/DsdModule29Root'), 'DsdModule29Root');
const DsdModule30Root = named(() => import('./components/level1/dsd_module30_v1/DsdModule30Root'), 'DsdModule30Root');
const DsdModule31Root = named(() => import('./components/level1/dsd_module31_v1/DsdModule31Root'), 'DsdModule31Root');
const DsdModule32Root = named(() => import('./components/level1/dsd_module32_v1/DsdModule32Root'), 'DsdModule32Root');
const DsdModule33Root = named(() => import('./components/level1/dsd_module33_v1/DsdModule33Root'), 'DsdModule33Root');
const DsdModule34Root = named(() => import('./components/level1/dsd_module34_v1/DsdModule34Root'), 'DsdModule34Root');
const DsdModule35Root = named(() => import('./components/level1/dsd_module35_v1/DsdModule35Root'), 'DsdModule35Root');
const DsdModule36Root = named(() => import('./components/level1/dsd_module36_v1/DsdModule36Root'), 'DsdModule36Root');
const DsdModule37Root = named(() => import('./components/level1/dsd_module37_v1/DsdModule37Root'), 'DsdModule37Root');
const DsdModule38Root = named(() => import('./components/level1/dsd_module38_v1/DsdModule38Root'), 'DsdModule38Root');
const DsdModule39Root = named(() => import('./components/level1/dsd_module39_v1/DsdModule39Root'), 'DsdModule39Root');
const DsdModule40Root = named(() => import('./components/level1/dsd_module40_v1/DsdModule40Root'), 'DsdModule40Root');
const DsdModule41Root = named(() => import('./components/level1/dsd_module41_v1/DsdModule41Root'), 'DsdModule41Root');
const DsdModule42Root = named(() => import('./components/level1/dsd_module42_v1/DsdModule42Root'), 'DsdModule42Root');
const BeModule1Root = named(() => import('./components/level1/be_module1_v1/BeModule1Root'), 'BeModule1Root');
const BeModule2Root = named(() => import('./components/level1/be_module2_v1/BeModule2Root'), 'BeModule2Root');
const BeModule3Root = named(() => import('./components/level1/be_module3_v1/BeModule3Root'), 'BeModule3Root');
const BeModule4Root = named(() => import('./components/level1/be_module4_v1/BeModule4Root'), 'BeModule4Root');
const BeModule5Root = named(() => import('./components/level1/be_module5_v1/BeModule5Root'), 'BeModule5Root');
const BeModule6Root = named(() => import('./components/level1/be_module6_v1/BeModule6Root'), 'BeModule6Root');
const BeModule7Root = named(() => import('./components/level1/be_module7_v1/BeModule7Root'), 'BeModule7Root');
const BeModule8Root = named(() => import('./components/level1/be_module8_v1/BeModule8Root'), 'BeModule8Root');
const BeModule9Root = named(() => import('./components/level1/be_module9_v1/BeModule9Root'), 'BeModule9Root');
const BeModule10Root = named(() => import('./components/level1/be_module10_v1/BeModule10Root'), 'BeModule10Root');

function App() {
  useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <TransitionProvider>
      <TransitionOverlay />
      <AppErrorBoundary>
      <SeoManager />
      {/* Times every route site-wide; ModuleGate deliberately no longer does. */}
      <EngagementTracker />
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Landing / Auth - public */}
          {/* Returning visitors (real login or guest) skip the marketing page
              and go straight to the portal; "/?stay=1" still shows it. */}
          <Route path="/" element={<LandingOrPortal><LandingPage /></LandingOrPortal>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Account settings + profile — need a session (real or guest) */}
          <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

          {/* Public browse + marketing */}
          <Route element={<PortalLayout />}>
            <Route path="/portal" element={<WorkstationHome />} />
            <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
            {/* Question papers need a real account — a guest session is one
                click and anonymous, so it would gate nothing. */}
            <Route path="/library" element={<RequireAccount><LibraryPage /></RequireAccount>} />
            <Route path="/analogies" element={<AnalogyLibrary />} />
            <Route path="/verilog-library" element={<VerilogLibrary />} />
            <Route path="/verilog-sandbox" element={<VerilogSandbox />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/silicon-map" element={<SiliconMap />} />
            <Route path="/pledge" element={<PledgePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            {/* Flagship interactive tools — public so search engines can index them
                and anonymous visitors can try them (no personal data, localStorage only) */}
            <Route path="/verilog-playground" element={<VerilogJudge />} />
            <Route path="/workbench" element={<Workbench />} />
            <Route path="/kmap-lab" element={<KMapLabPage />} />
          </Route>

          {/* Course modules - first 5 free for anyone; 6th requires login */}
          <Route element={<ModuleGate><PortalLayout /></ModuleGate>}>
            <Route path="/module/1" element={<Module1Root />} />
            <Route path="/module/1/1" element={<ModuleOne />} />
            <Route path="/module/2" element={<ModuleTwo />} />
            <Route path="/module/3" element={<ModuleThree />} />
            <Route path="/dsd/1" element={<DsdModule1Root />} />
            <Route path="/dsd/1/:chapter" element={<DsdModule1Root />} />
            <Route path="/dsd/2" element={<DsdModule2Root />} />
            <Route path="/dsd/2/:chapter" element={<DsdModule2Root />} />
            <Route path="/dsd/3" element={<DsdModule3Root />} />
            <Route path="/dsd/3/:chapter" element={<DsdModule3Root />} />
            <Route path="/dsd/4" element={<DsdModule4Root />} />
            <Route path="/dsd/4/:chapter" element={<DsdModule4Root />} />
            <Route path="/dsd/5" element={<DsdModule5Root />} />
            <Route path="/dsd/5/:chapter" element={<DsdModule5Root />} />
            <Route path="/dsd/6" element={<DsdModule6Root />} />
            <Route path="/dsd/6/:chapter" element={<DsdModule6Root />} />
            <Route path="/dsd/7" element={<DsdModule7Root />} />
            <Route path="/dsd/7/:chapter" element={<DsdModule7Root />} />
            <Route path="/dsd/8" element={<DsdModule8Root />} />
            <Route path="/dsd/8/:chapter" element={<DsdModule8Root />} />
            <Route path="/dsd/9" element={<DsdModule9Root />} />
            <Route path="/dsd/9/:chapter" element={<DsdModule9Root />} />
            <Route path="/dsd/10" element={<DsdModule10Root />} />
            <Route path="/dsd/10/:chapter" element={<DsdModule10Root />} />
            <Route path="/dsd/11" element={<DsdModule11Root />} />
            <Route path="/dsd/11/:chapter" element={<DsdModule11Root />} />
            <Route path="/dsd/12" element={<DsdModule12Root />} />
            <Route path="/dsd/12/:chapter" element={<DsdModule12Root />} />
            <Route path="/dsd/13" element={<DsdModule13Root />} />
            <Route path="/dsd/13/:chapter" element={<DsdModule13Root />} />
            <Route path="/dsd/14" element={<DsdModule14Root />} />
            <Route path="/dsd/14/:chapter" element={<DsdModule14Root />} />
            <Route path="/dsd/15" element={<DsdModule15Root />} />
            <Route path="/dsd/15/:chapter" element={<DsdModule15Root />} />
            <Route path="/dsd/16" element={<DsdModule16Root />} />
            <Route path="/dsd/16/:chapter" element={<DsdModule16Root />} />
            <Route path="/dsd/17" element={<DsdModule17Root />} />
            <Route path="/dsd/17/:chapter" element={<DsdModule17Root />} />
            <Route path="/dsd/18" element={<DsdModule18Root />} />
            <Route path="/dsd/18/:chapter" element={<DsdModule18Root />} />
            <Route path="/dsd/19" element={<DsdModule19Root />} />
            <Route path="/dsd/19/:chapter" element={<DsdModule19Root />} />
            <Route path="/dsd/20" element={<DsdModule20Root />} />
            <Route path="/dsd/20/:chapter" element={<DsdModule20Root />} />
            <Route path="/dsd/21" element={<DsdModule21Root />} />
            <Route path="/dsd/21/:chapter" element={<DsdModule21Root />} />
            <Route path="/dsd/22" element={<DsdModule22Root />} />
            <Route path="/dsd/22/:chapter" element={<DsdModule22Root />} />
            <Route path="/dsd/23" element={<DsdModule23Root />} />
            <Route path="/dsd/23/:chapter" element={<DsdModule23Root />} />
            <Route path="/dsd/24" element={<DsdModule24Root />} />
            <Route path="/dsd/24/:chapter" element={<DsdModule24Root />} />
            <Route path="/dsd/25" element={<DsdModule25Root />} />
            <Route path="/dsd/25/:chapter" element={<DsdModule25Root />} />
            <Route path="/dsd/26" element={<DsdModule26Root />} />
            <Route path="/dsd/26/:chapter" element={<DsdModule26Root />} />
            <Route path="/dsd/27" element={<DsdModule27Root />} />
            <Route path="/dsd/27/:chapter" element={<DsdModule27Root />} />
            <Route path="/dsd/28" element={<DsdModule28Root />} />
            <Route path="/dsd/28/:chapter" element={<DsdModule28Root />} />
            <Route path="/dsd/29" element={<DsdModule29Root />} />
            <Route path="/dsd/29/:chapter" element={<DsdModule29Root />} />
            <Route path="/dsd/30" element={<DsdModule30Root />} />
            <Route path="/dsd/30/:chapter" element={<DsdModule30Root />} />
            <Route path="/dsd/31" element={<DsdModule31Root />} />
            <Route path="/dsd/31/:chapter" element={<DsdModule31Root />} />
            <Route path="/dsd/32" element={<DsdModule32Root />} />
            <Route path="/dsd/32/:chapter" element={<DsdModule32Root />} />
            <Route path="/dsd/33" element={<DsdModule33Root />} />
            <Route path="/dsd/33/:chapter" element={<DsdModule33Root />} />
            <Route path="/dsd/34" element={<DsdModule34Root />} />
            <Route path="/dsd/34/:chapter" element={<DsdModule34Root />} />
            <Route path="/dsd/35" element={<DsdModule35Root />} />
            <Route path="/dsd/35/:chapter" element={<DsdModule35Root />} />
            <Route path="/dsd/36" element={<DsdModule36Root />} />
            <Route path="/dsd/36/:chapter" element={<DsdModule36Root />} />
            <Route path="/dsd/37" element={<DsdModule37Root />} />
            <Route path="/dsd/37/:chapter" element={<DsdModule37Root />} />
            <Route path="/dsd/38" element={<DsdModule38Root />} />
            <Route path="/dsd/38/:chapter" element={<DsdModule38Root />} />
            <Route path="/dsd/39" element={<DsdModule39Root />} />
            <Route path="/dsd/39/:chapter" element={<DsdModule39Root />} />
            <Route path="/dsd/40" element={<DsdModule40Root />} />
            <Route path="/dsd/40/:chapter" element={<DsdModule40Root />} />
            <Route path="/dsd/41" element={<DsdModule41Root />} />
            <Route path="/dsd/41/:chapter" element={<DsdModule41Root />} />
            <Route path="/dsd/42" element={<DsdModule42Root />} />
            <Route path="/dsd/42/:chapter" element={<DsdModule42Root />} />
            <Route path="/basic-electronics/1" element={<BeModule1Root />} />
            <Route path="/basic-electronics/1/:chapter" element={<BeModule1Root />} />
            <Route path="/basic-electronics/2" element={<BeModule2Root />} />
            <Route path="/basic-electronics/2/:chapter" element={<BeModule2Root />} />
            <Route path="/basic-electronics/3" element={<BeModule3Root />} />
            <Route path="/basic-electronics/3/:chapter" element={<BeModule3Root />} />
            <Route path="/basic-electronics/4" element={<BeModule4Root />} />
            <Route path="/basic-electronics/4/:chapter" element={<BeModule4Root />} />
            <Route path="/basic-electronics/5" element={<BeModule5Root />} />
            <Route path="/basic-electronics/5/:chapter" element={<BeModule5Root />} />
            <Route path="/basic-electronics/6" element={<BeModule6Root />} />
            <Route path="/basic-electronics/6/:chapter" element={<BeModule6Root />} />
            <Route path="/basic-electronics/7" element={<BeModule7Root />} />
            <Route path="/basic-electronics/7/:chapter" element={<BeModule7Root />} />
            <Route path="/basic-electronics/8" element={<BeModule8Root />} />
            <Route path="/basic-electronics/8/:chapter" element={<BeModule8Root />} />
            <Route path="/basic-electronics/9" element={<BeModule9Root />} />
            <Route path="/basic-electronics/9/:chapter" element={<BeModule9Root />} />
            <Route path="/basic-electronics/10" element={<BeModule10Root />} />
            <Route path="/basic-electronics/10/:chapter" element={<BeModule10Root />} />
            <Route path="/module/4" element={<ModuleFour />} />
            <Route path="/module/5" element={<Module5Root />} />
            <Route path="/sandbox/verilog" element={<SandboxModule5 />} />
          </Route>

          {/* App tools & social - require a session (real or guest) */}
          <Route element={<RequireAuth><PortalLayout /></RequireAuth>}>
            <Route path="/portfolio" element={<EngineeringPortfolio />} />
            <Route path="/boss-arena" element={<BossArena />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="/hw-leetcode" element={<HardwareLeetCodePage />} />
            <Route path="/fsm" element={<FSMPlayground />} />
            <Route path="/signal-playground" element={<SignalPlayground />} />
            <Route path="/logic-studio" element={<LogicStudio />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/activities" element={<ActivityPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/debug-mission" element={<DebugMissionPage />} />
            <Route path="/debug-mission/:id" element={<DebugMissionPage />} />
            <Route path="/gatekeeper-game" element={<GatekeeperGame />} />
            <Route path="/ai-lab" element={<AiLab />} />
            <Route path="/silicon-secrets" element={<SiliconSecrets />} />
          </Route>

          {/* Fallback — branded 404 with a clear way back (no silent redirect) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {/* Floating VoltMonkey mascot, bottom-right on every page (renders nothing until /mascot.riv exists) */}
      <Suspense fallback={null}>
        <MascotWidget />
      </Suspense>
      {/* Floating feedback bubble, bottom-left on every page — quiet after one tease */}
      <Suspense fallback={null}>
        <FeedbackBubble />
      </Suspense>
      {/* Cookie-consent banner (Google Consent Mode v2) — shows once until answered */}
      <ConsentBanner />
      </AppErrorBoundary>
    </TransitionProvider>
  );
}

export default App;
