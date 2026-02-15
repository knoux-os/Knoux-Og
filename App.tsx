
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './modules/Dashboard';
import { VideoPresentation } from './modules/VideoPresentation';
import { ModuleControl } from './components/ModuleControl';
import { AuditLogs } from './modules/AuditLogs';
import { ApplicationLifecycle } from './modules/ApplicationLifecycle';
import { DiskSpace } from './modules/DiskSpace';
import { IdentityManager } from './modules/IdentityManager';
import { KNOUX_CONFIG } from './config';
import { MODULES } from './constants';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth0();
  const [appBooting, setAppBooting] = useState(true);
  const [currentModule, setCurrentModule] = useState('dashboard');

  useEffect(() => {
    // محاكاة تشغيل النظام (Splash Screen)
    const timer = setTimeout(() => setAppBooting(false), KNOUX_CONFIG.timings.splashTimeout);
    return () => clearTimeout(timer);
  }, []);

  // إذا كان النظام لا يزال في مرحلة الـ Boot
  if (appBooting) return <SplashScreen />;

  // إذا كان Auth0 يتحقق من الجلسة
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0014] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-[#bf00ff] animate-spin" size={48} />
        <span className="text-white/40 font-display tracking-[0.2em] uppercase text-xs">Synchronizing Identity...</span>
      </div>
    );
  }

  // إذا لم يكن مسجلاً للدخول، نعرض صفحة الدخول المعدلة لـ Auth0
  if (!isAuthenticated) return <Login onLogin={() => {}} />;

  const renderModule = () => {
    try {
      switch (currentModule) {
        case 'dashboard': return <Dashboard />;
        case 'identity': return <IdentityManager />;
        case 'applications': return <ApplicationLifecycle />;
        case 'disk': return <DiskSpace />;
        case 'presentation': return <VideoPresentation />;
        case 'audit': return <AuditLogs />;
        default:
          const moduleConfig = MODULES.find(m => m.id === currentModule);
          return moduleConfig ? <ModuleControl module={moduleConfig} /> : <Dashboard />;
      }
    } catch (error) {
      console.error("Critical UI Error:", error);
      return <div className="p-10 text-center text-red-500 font-bold glass">⚠️ MODULE RENDERING CRASHED</div>;
    }
  };

  return (
    <div className="min-h-screen bg-knoux-bg-gradient text-white flex flex-col selection:bg-[#bf00ff] selection:text-white">
      <Header onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })} user={{ 
        username: user?.nickname || user?.name || 'Guardian', 
        role: 'Administrator',
        avatar: user?.picture 
      }} />
      <div className="flex flex-col lg:flex-row gap-6 p-4 pt-0 max-w-[1920px] mx-auto w-full flex-1 overflow-hidden">
        <Sidebar currentModule={currentModule} onNavigate={setCurrentModule} />
        <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar pb-10 pr-2">
          <div className="fade-in-up h-full">{renderModule()}</div>
        </main>
      </div>
      <footer className="glass m-4 p-4 flex justify-between items-center text-[10px] text-white/30 uppercase tracking-widest">
        <div>KNOUX OS GUARDIAN © 2025 • SENTINEL CORE V1</div>
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span> 
            ENCRYPTED_AUTH0_LINK_ACTIVE
          </span>
          <span>UAE-DXB-NODE-01</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
