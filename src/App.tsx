import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import StudentManagement from './components/Students/StudentManagement';
import ClassManagement from './components/Classes/ClassManagement';
import FinanceManagement from './components/Finance/FinanceManagement';
import AcademicManagement from './components/Academic/AcademicManagement';
import TeacherManagement from './components/Teachers/TeacherManagement';
import Settings from './components/Settings/Settings';
import ScheduleManagement from './components/Schedule/ScheduleManagement';

const AppContent: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogin = async (credentials: { email: string; password: string; rememberMe: boolean }) => {
    const success = await login(credentials.email, credentials.password, credentials.rememberMe);
    if (!success) {
      // L'erreur sera gérée par le composant LoginPage
      return false;
    }
    return true;
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      case 'students':
        return (
          <ProtectedRoute requiredPermission="students">
            <StudentManagement />
          </ProtectedRoute>
        );
      case 'classes':
        return (
          <ProtectedRoute requiredPermission="classes">
            <ClassManagement />
          </ProtectedRoute>
        );
      case 'finance':
        return (
          <ProtectedRoute requiredPermission="finance">
            <FinanceManagement />
          </ProtectedRoute>
        );
      case 'academic':
        return (
          <ProtectedRoute requiredPermission="academic">
            <AcademicManagement />
          </ProtectedRoute>
        );
      case 'teachers':
        return (
          <ProtectedRoute requiredPermission="teachers">
            <TeacherManagement />
          </ProtectedRoute>
        );
      case 'settings':
        return (
          <ProtectedRoute requiredPermission="settings">
            <Settings />
          </ProtectedRoute>
        );
      case 'schedule':
        return (
          <ProtectedRoute requiredPermission="schedule">
            <ScheduleManagement />
          </ProtectedRoute>
        );
      default:
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar 
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
      />
      
      {/* Overlay for mobile */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
        />
        
        <main className="p-4 sm:p-6">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;