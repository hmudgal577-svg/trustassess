import React, { useState } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import DemoMode from './components/DemoMode';
import { DemoProvider } from './context/DemoContext';
import './motion-overrides.css';

import Dashboard from './pages/Dashboard';
import LiveAssessment from './pages/LiveAssessment';
import Candidates from './pages/Candidates';
import Centres from './pages/Centres';
import Incidents from './pages/Incidents';
import Recovery from './pages/Recovery';
import Monitoring from './pages/Monitoring';
import Audit from './pages/Audit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import CandidateView from './pages/CandidateView';

function AnimatedRoutes({ onDemoMode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard onDemoMode={onDemoMode} />} />
        <Route path="/live-assessment" element={<LiveAssessment />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/centres" element={<Centres />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} />
      <div className="main-area">
        <Topbar
          onToggle={() => setCollapsed(c => !c)}
          onDemoMode={() => setShowDemo(true)}
        />
        <AnimatedRoutes onDemoMode={() => setShowDemo(true)} />
      </div>
      <AnimatePresence>
        {showDemo && <DemoMode key="demo" onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/candidate-view" element={<CandidateView />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}
