import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TransitionProvider } from './hooks/useTransitionController';
import { TransitionOverlay } from './components/TransitionOverlay';
import { migrateStorage } from './utils/storageMigration';
import { RequireAuth } from './components/RequireAuth';
import { ModuleGate } from './components/ModuleGate';
import { RouteFallback } from './components/RouteFallback';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { loadChunk } from './utils/loadChunk';
import { TourProvider } from './components/tour/TourProvider';
import { TourOverlay } from './components/tour/TourOverlay';

// Layout (eager - tiny, wraps every portal route)
import { PortalLayout } from './layouts/PortalLayout';
import { ScrollToTop } from './components/ScrollToTop';

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
const EngineeringPortfolio = named(() => import('./pages/EngineeringPortfolio'), 'EngineeringPortfolio');
const KMapLabPage = named(() => import('./pages/KMapLabPage'), 'KMapLabPage');
const HardwareLeetCodePage = named(() => import('./pages/HardwareLeetCodePage'), 'HardwareLeetCodePage');
const SkillTree = named(() => import('./pages/SkillTree'), 'SkillTree');
const BossArena = named(() => import('./pages/BossArena'), 'BossArena');
const Workbench = lazy(() => loadChunk(() => import('./pages/Workbench')));

// Playgrounds & social
const FSMPlayground = named(() => import('./pages/FSMPlayground'), 'FSMPlayground');
const VerilogPlayground = named(() => import('./pages/VerilogPlayground'), 'VerilogPlayground');
const AnalogyLibrary = named(() => import('./pages/AnalogyLibrary'), 'AnalogyLibrary');
const VerilogLibrary = named(() => import('./pages/VerilogLibrary'), 'VerilogLibrary');
const SiliconMap = named(() => import('./pages/SiliconMap'), 'SiliconMap');
const PledgePage = named(() => import('./pages/PledgePage'), 'PledgePage');
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
const SettingsPage = named(() => import('./pages/SettingsPage'), 'SettingsPage');
const ProfilePage = named(() => import('./pages/ProfilePage'), 'ProfilePage');

// Modules (the heaviest chunks - three.js / monaco / scene graphs live here)
const ModuleOne = named(() => import('./pages/ModuleOne'), 'ModuleOne');
const ModuleTwo = named(() => import('./pages/ModuleTwo'), 'ModuleTwo');
const ModuleThree = named(() => import('./pages/ModuleThree'), 'ModuleThree');
const ModuleFour = named(() => import('./pages/ModuleFour'), 'ModuleFour');
const ModuleSix = named(() => import('./pages/ModuleSix'), 'ModuleSix');
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
const BeModule1Root = named(() => import('./components/level1/be_module1_v1/BeModule1Root'), 'BeModule1Root');
const BeModule2Root = named(() => import('./components/level1/be_module2_v1/BeModule2Root'), 'BeModule2Root');
const BeModule3Root = named(() => import('./components/level1/be_module3_v1/BeModule3Root'), 'BeModule3Root');
const BeModule4Root = named(() => import('./components/level1/be_module4_v1/BeModule4Root'), 'BeModule4Root');
const BeModule5Root = named(() => import('./components/level1/be_module5_v1/BeModule5Root'), 'BeModule5Root');
/* be6-be10 transistor modules: build in progress - re-enabled once all files exist
const BeModule6Root = named(() => import('./components/level1/be_module6_v1/BeModule6Root'), 'BeModule6Root');
const BeModule7Root = named(() => import('./components/level1/be_module7_v1/BeModule7Root'), 'BeModule7Root');
const BeModule8Root = named(() => import('./components/level1/be_module8_v1/BeModule8Root'), 'BeModule8Root');
const BeModule9Root = named(() => import('./components/level1/be_module9_v1/BeModule9Root'), 'BeModule9Root');
const BeModule10Root = named(() => import('./components/level1/be_module10_v1/BeModule10Root'), 'BeModule10Root');
*/

function App() {
  useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <TransitionProvider>
      <TransitionOverlay />
      <AppErrorBoundary>
      <TourProvider>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Landing / Auth - public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Account settings + profile — need a session (real or guest) */}
          <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

          {/* Public browse + marketing */}
          <Route element={<PortalLayout />}>
            <Route path="/portal" element={<WorkstationHome />} />
            <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
            <Route path="/analogies" element={<AnalogyLibrary />} />
            <Route path="/verilog-library" element={<VerilogLibrary />} />
            <Route path="/silicon-map" element={<SiliconMap />} />
            <Route path="/pledge" element={<PledgePage />} />
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
            {/* be6-be10 transistor modules: build in progress - routes re-enabled once all files exist */}
            <Route path="/module/4" element={<ModuleFour />} />
            <Route path="/module/5" element={<Module5Root />} />
            <Route path="/module/6" element={<ModuleSix />} />
            <Route path="/module/6/:index" element={<ModuleSix />} />
            <Route path="/sandbox/verilog" element={<SandboxModule5 />} />
          </Route>

          {/* App tools & social - require a session (real or guest) */}
          <Route element={<RequireAuth><PortalLayout /></RequireAuth>}>
            <Route path="/portfolio" element={<EngineeringPortfolio />} />
            <Route path="/workbench" element={<Workbench />} />
            <Route path="/kmap-lab" element={<KMapLabPage />} />
            <Route path="/boss-arena" element={<BossArena />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="/hw-leetcode" element={<HardwareLeetCodePage />} />
            <Route path="/fsm" element={<FSMPlayground />} />
            <Route path="/verilog-playground" element={<VerilogPlayground />} />
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <TourOverlay />
      </TourProvider>
      </AppErrorBoundary>
    </TransitionProvider>
  );
}

export default App;
