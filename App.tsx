
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, View, UserRole, Protocol, Assessment, TrainingCycle, HealthStatus } from './types';
import Login from './views/Login';
import Home from './views/Home';
import Agenda from './views/Agenda';
import Profile from './views/Profile';
import ActiveSession from './views/ActiveSession';
import Wellness from './views/Wellness';
import Management from './views/Management';
import ProtocolEditor from './views/ProtocolEditor';
import AssessmentFlow from './views/AssessmentFlow';
import CycleBuilder from './views/CycleBuilder';
import Messages from './views/Messages';
import Timeline from './views/Timeline';
import CheckIn from './views/CheckIn';
import Navigation from './components/Navigation';
import Header from './components/Header';
import { saveProtocol, saveAssessment, startNewCycle, terminateCycle } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [isLoading, setIsLoading] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | undefined>(undefined);
  const [targetStudent, setTargetStudent] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleLogin = useCallback((userData: User) => {
    setUser(userData);
    if (userData.role === UserRole.CHEFE || userData.role === UserRole.ADMIN) {
      setCurrentView('MANAGEMENT');
    } else {
      setCurrentView('HOME');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setTargetStudent(null);
    setCurrentView('HOME');
  }, []);

  const handleStartSession = (student?: User) => {
    if (user?.role === UserRole.ALUNO && !user.isCheckedIn) {
      setCurrentView('CHECKIN');
      return;
    }
    if (student) setTargetStudent(student);
    else setTargetStudent(null);
    setCurrentView('SESSION');
  };

  const handleCheckInSuccess = () => {
    if (user) {
      setUser({
        ...user,
        isCheckedIn: true,
        checkInTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      setCurrentView('HOME');
    }
  };

  const handleSaveProtocol = useCallback(async (protocol: Protocol) => {
    setIsLoading(true);
    try {
      await saveProtocol(protocol);
      setCurrentView('MANAGEMENT');
    } catch (e) {
      console.error("Falha ao salvar protocolo:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFinishAssessment = async (assessment: Assessment, newStatus: HealthStatus) => {
    setIsLoading(true);
    try {
      await saveAssessment(assessment, newStatus);
      setCurrentView('MANAGEMENT');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCycle = async (cycle: TrainingCycle) => {
    setIsLoading(true);
    try {
      await startNewCycle(targetStudent?.id || user?.id || 'default', cycle);
      setCurrentView('MANAGEMENT');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNav = useMemo(() => {
    const focusViews: View[] = [
      'SESSION', 
      'WELLNESS', 
      'PROTOCOL_EDIT', 
      'ASSESSMENT', 
      'CYCLE_BUILDER', 
      'TIMELINE',
      'CHECKIN'
    ];
    return user && !focusViews.includes(currentView);
  }, [user, currentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 transition-colors">
        <div className="w-12 h-12 border-4 border-blue-50 dark:border-white/5 border-t-blue-900 dark:border-t-white rounded-full animate-spin mb-6"></div>
        <p className="text-blue-900 dark:text-white font-black tracking-widest uppercase text-[10px]">Governança em Operação...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
           <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <Home 
            user={user} 
            onStartSession={handleStartSession} 
            onGoWellness={() => setCurrentView('WELLNESS')} 
            onGoTimeline={() => setCurrentView('TIMELINE')} 
            onGoMessages={() => setCurrentView('MESSAGES')}
            onGoAgenda={() => setCurrentView('AGENDA')}
            onGoCheckIn={() => setCurrentView('CHECKIN')}
          />
        );
      case 'CHECKIN':
        return (
          <CheckIn 
            userName={user.name} 
            onSuccess={handleCheckInSuccess} 
            onCancel={() => setCurrentView('HOME')} 
          />
        );
      case 'AGENDA': return <Agenda />;
      case 'MESSAGES': return <Messages user={user} />;
      case 'TIMELINE': return <Timeline user={user} onBack={() => setCurrentView('HOME')} />;
      case 'WELLNESS': return <Wellness user={user} onBack={() => setCurrentView('HOME')} />;
      case 'PROFILE': return <Profile user={user} onLogout={handleLogout} onGoTimeline={() => setCurrentView('TIMELINE')} />;
      case 'SESSION': return <ActiveSession user={targetStudent || user} executor={user} onFinish={() => setCurrentView('HOME')} />;
      case 'MANAGEMENT':
        if (user.role === UserRole.ALUNO) return <Home user={user} onStartSession={handleStartSession} onGoWellness={() => setCurrentView('WELLNESS')} onGoTimeline={() => setCurrentView('TIMELINE')} onGoMessages={() => setCurrentView('MESSAGES')} onGoAgenda={() => setCurrentView('AGENDA')} onGoCheckIn={() => setCurrentView('CHECKIN')} />;
        return (
          <Management 
            user={user} 
            onEditProtocol={(p) => { setEditingProtocol(p); setCurrentView('PROTOCOL_EDIT'); }} 
            onStartAssessment={(s) => { setTargetStudent(s); setCurrentView('ASSESSMENT'); }} 
            onStartCycle={(s) => { setTargetStudent(s); setCurrentView('CYCLE_BUILDER'); }} 
          />
        );
      case 'CYCLE_BUILDER': return <CycleBuilder student={targetStudent!} onBack={() => setCurrentView('MANAGEMENT')} onConfirm={handleConfirmCycle} />;
      case 'ASSESSMENT': return <AssessmentFlow student={targetStudent!} chefe={user} onBack={() => setCurrentView('MANAGEMENT')} onFinish={handleFinishAssessment} />;
      case 'PROTOCOL_EDIT': return <ProtocolEditor protocol={editingProtocol} onBack={() => setCurrentView('MANAGEMENT')} onSave={handleSaveProtocol} />;
      default: return <Home user={user} onStartSession={handleStartSession} onGoWellness={() => setCurrentView('WELLNESS')} onGoTimeline={() => setCurrentView('TIMELINE')} onGoMessages={() => setCurrentView('MESSAGES')} onGoAgenda={() => setCurrentView('AGENDA')} onGoCheckIn={() => setCurrentView('CHECKIN')} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-[#020617] flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100 dark:border-white/5 transition-colors duration-500`}>
      {user && !['SESSION', 'CHECKIN'].includes(currentView) && <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      
      <main className={`flex-1 overflow-y-auto no-scrollbar pb-safe transition-all duration-300 ${showNav ? 'pb-24 pt-20' : ''}`}>
        {renderView()}
      </main>
      
      {showNav && (
        <Navigation 
          currentView={currentView} 
          setView={setCurrentView} 
          role={user.role} 
        />
      )}
    </div>
  );
};

export default App;
