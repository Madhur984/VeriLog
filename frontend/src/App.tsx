import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TransitionProvider } from './hooks/useTransitionController';
import { TransitionOverlay } from './components/TransitionOverlay';
import { migrateStorage } from './utils/storageMigration';

// Layout
import { PortalLayout } from './layouts/PortalLayout';

// Core Pages
import LandingPage from './pages/landing';
import { LoginPage } from './pages/LoginPage';
import { HeroExperience } from './pages/HeroExperience';
import { WorkstationHome } from './pages/WorkstationHome';
import { EngineeringPortfolio } from './pages/EngineeringPortfolio';
import { KMapLabPage } from './pages/KMapLabPage';
import { HardwareLeetCodePage } from './pages/HardwareLeetCodePage';
import { SkillTree } from './pages/SkillTree';
import { BossArena } from './pages/BossArena';

// Modules (Level 1-5)
import { ModuleOne } from './pages/ModuleOne';
import { ModuleTwo } from './pages/ModuleTwo';
import { ModuleThree } from './pages/ModuleThree';
import { ModuleFour } from './pages/ModuleFour';
import { ModuleSix } from './pages/ModuleSix';
import { SandboxModule5 } from './pages/SandboxModule5';

// Component-based Routes
import { Module1Root } from './components/level1/module1_v4/Module1Root';
import { Module5Root } from './components/level1/module5_v4/Module5Root';
import { DsdModule1Root } from './components/level1/dsd_module1_v1/DsdModule1Root';
import { DsdModule2Root } from './components/level1/dsd_module2_v1/DsdModule2Root';
import { DsdModule3Root } from './components/level1/dsd_module3_v1/DsdModule3Root';
import { DsdModule4Root } from './components/level1/dsd_module4_v1/DsdModule4Root';
import { DsdModule5Root } from './components/level1/dsd_module5_v1/DsdModule5Root';
import { BeModule1Root } from './components/level1/be_module1_v1/BeModule1Root';
import { BeModule2Root } from './components/level1/be_module2_v1/BeModule2Root';
import { BeModule3Root } from './components/level1/be_module3_v1/BeModule3Root';
import { BeModule4Root } from './components/level1/be_module4_v1/BeModule4Root';
import { BeModule5Root } from './components/level1/be_module5_v1/BeModule5Root';

// Special default exports
import Workbench from './pages/Workbench';

// Extra Playgrounds & Features
import { FSMPlayground } from './pages/FSMPlayground';
import { VerilogPlayground } from './pages/VerilogPlayground';
import { SignalPlayground } from './pages/SignalPlayground';
import { LogicStudio } from './pages/LogicStudio';
import { QuestsPage } from './pages/QuestsPage';
import { ActivityPage } from './pages/ActivityPage';
import { CommunityPage } from './pages/CommunityPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { DebugMissionPage } from './pages/DebugMissionPage';
import { GatekeeperGame } from './pages/GatekeeperGame';
import CareerRoadmapPage from './pages/career-roadmap/index';

function App() {
  useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <TransitionProvider>
      <TransitionOverlay />
      <Routes>
        {/* Landing / Auth / Entry */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hero" element={<HeroExperience />} />

        {/* Portal Layout Wrapper — Shared UI and Navigation Context */}
        <Route element={<PortalLayout />}>
          <Route path="/portal" element={<WorkstationHome />} />
          <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
          <Route path="/portfolio" element={<EngineeringPortfolio />} />
          <Route path="/workbench" element={<Workbench />} />
          <Route path="/kmap-lab" element={<KMapLabPage />} />
          <Route path="/boss-arena" element={<BossArena />} />
          <Route path="/skill-tree" element={<SkillTree />} />
          <Route path="/hw-leetcode" element={<HardwareLeetCodePage />} />
          
          {/* Playgrounds & Studios */}
          <Route path="/fsm" element={<FSMPlayground />} />
          <Route path="/verilog-playground" element={<VerilogPlayground />} />
          <Route path="/signal-playground" element={<SignalPlayground />} />
          <Route path="/logic-studio" element={<LogicStudio />} />
          
          {/* Social & Persistence Features */}
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/activities" element={<ActivityPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/debug-mission" element={<DebugMissionPage />} />
          <Route path="/gatekeeper-game" element={<GatekeeperGame />} />

          {/* Core Modules Hierarchy */}
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
          <Route path="/module/4" element={<ModuleFour />} />
          <Route path="/module/5" element={<Module5Root />} />
          <Route path="/module/6" element={<ModuleSix />} />
          <Route path="/module/6/:index" element={<ModuleSix />} />
          <Route path="/sandbox/verilog" element={<SandboxModule5 />} />
        </Route>

        {/* Fallback Redirect to Portal */}
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </TransitionProvider>
  );
}

export default App;