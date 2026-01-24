import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole, Protocol, Assessment, TrainingCycle, HealthStatus } from './types';
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
import Club from './views/Club';
import Navigation from './components/Navigation';
import Header from './components/Header';
import { saveProtocol, saveAssessment, startNewCycle } from './firebase';
import { Icons } from './constants';

// Layout wraper to handle Header and Navigation visibility
const AppLayout: React.FC<{
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}> = ({ user, onLogout, onUpdateUser, isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logic to determine if Navigation should be shown
  const showNav = useMemo(() => {
    const hiddenPaths = [
      '/session',
      '/protocol-edit',
      '/assessment',
      '/cycle-builder',
      '/checkin',
      '/login'
    ];
    return user && !hiddenPaths.some(path => location.pathname.startsWith(path));
  }, [user, location.pathname]);

  // Theme toggle is now handled directly in Header component

  // Header Props Logic based on Route
  const headerProps = useMemo(() => {
    const backBtn = (path: string) => (
      <button onClick={() => navigate(path)} className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-95 transition-all">
        <Icons.ChevronRight className="w-5 h-5 rotate-180" />
      </button>
    );

    const bellBtn = (
      <button className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center relative active:scale-95 transition-all">
        <Icons.Bell className="w-5 h-5 text-white" />
        <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-red-600 shadow-[0_0_10px_#DC2626]"></div>
      </button>
    );

    const path = location.pathname;

    if (path === '/home') return {};
    if (path === '/agenda') return { title: 'Abril 2026', subtitle: 'Agenda de Treinos' };
    if (path === '/messages') return { title: 'Mensagens', subtitle: 'Central de Avisos', rightAction: bellBtn };
    if (path === '/timeline') return { title: 'Minha Jornada', subtitle: 'Histórico de Performance', leftAction: backBtn('/home') };
    if (path === '/wellness') return { title: 'Wellness Centre', subtitle: 'Recuperação Biomecânica', leftAction: backBtn('/home') };
    if (path === '/club') return { title: 'Ecossistema', subtitle: 'Personal Experience', leftAction: backBtn('/home') };
    if (path === '/profile') return { title: 'Meu Perfil', subtitle: 'Dados da Conta' };
    if (path === '/session') return {
      title: 'Sessão Ativa', // Dynamic title logic can be restored with context or query params if needed
      subtitle: 'Em Execução',
      leftAction: <div className="w-2 h-2 bg-blue-500 shadow-[0_0_15px_#3B82F6] animate-pulse ml-4"></div>
    };
    if (path === '/management') return { title: <>Gestão de <span className="text-blue-400">Pista</span></>, subtitle: 'Painel do Professor', rightAction: bellBtn };
    if (path === '/protocol-edit') return { title: 'Editar Treino', subtitle: 'Detalhes Técnicos', leftAction: backBtn('/management') };
    if (path === '/assessment') return { title: 'Avaliação', subtitle: 'Intervenção Técnica', leftAction: backBtn('/management'), rightAction: <div className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center font-black text-[10px] text-blue-400 italic">GOV</div> };
    if (path === '/cycle-builder') return { title: 'Novo Ciclo', subtitle: 'Planejamento', leftAction: backBtn('/management'), rightAction: <div className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center font-black text-[10px] text-blue-400 italic">v1.2</div> };
    if (path === '/checkin') return { title: 'Validação de Acesso', subtitle: 'Unidade Península Jardins', leftAction: backBtn('/home') };

    return {};
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-500 font-sans" style={{ background: isDarkMode ? 'var(--pg-bg-dark)' : 'var(--pg-bg-light)' }}>
      {user && location.pathname !== '/login' && <Header {...headerProps} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}

      <main className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${showNav ? 'pb-24' : ''}`}>
        <div className="max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-0 pt-28">
          <div key={location.pathname} className="animate-slide-up">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onLogin={(u) => { /* Handle login passed from App */ }} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />} />

              {/* Protected Routes */}
              {user ? (
                <>
                  <Route path="/home" element={<Home user={user} onStartSession={() => navigate('/session')} onGoWellness={() => navigate('/wellness')} onGoTimeline={() => navigate('/timeline')} onGoMessages={() => navigate('/messages')} onGoAgenda={() => navigate('/agenda')} onGoCheckIn={() => navigate('/checkin')} onGoClub={() => navigate('/club')} />} />
                  <Route path="/club" element={<Club user={user} onBack={() => navigate('/home')} />} />
                  <Route path="/agenda" element={<Agenda />} />
                  <Route path="/messages" element={<Messages user={user} />} />
                  <Route path="/timeline" element={<Timeline user={user} onBack={() => navigate('/home')} />} />
                  <Route path="/wellness" element={<Wellness user={user} onBack={() => navigate('/home')} />} />
                  <Route path="/profile" element={<Profile user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} onGoTimeline={() => navigate('/timeline')} />} />
                  <Route path="/checkin" element={<CheckIn userName={user.name} onSuccess={() => navigate('/home')} onCancel={() => navigate('/home')} />} />

                  {/* Active Session & Management */}
                  <Route path="/session" element={<ActiveSession user={user} executor={user} onFinish={() => navigate('/home')} />} />
                  <Route path="/management" element={<Management user={user} onEditProtocol={() => navigate('/protocol-edit')} onStartAssessment={() => navigate('/assessment')} onStartCycle={() => navigate('/cycle-builder')} />} />

                  {/* Management Sub-routes (Need props handling in real app) */}
                  <Route path="/protocol-edit" element={<ProtocolEditor protocol={undefined} onBack={() => navigate('/management')} onSave={async () => navigate('/management')} />} />
                  <Route path="/assessment" element={<AssessmentFlow student={user} chefe={user} onBack={() => navigate('/management')} onFinish={async () => navigate('/management')} />} />
                  <Route path="/cycle-builder" element={<CycleBuilder student={user} onBack={() => navigate('/management')} onConfirm={async () => navigate('/management')} />} />

                  <Route path="*" element={<Navigate to="/home" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </div>
        </div>
      </main>

      {showNav && user && (
        <Navigation
          role={user.role}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  // Simplified User State Persistence for Demo
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pg-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pg-theme');
    return saved ? saved === 'dark' : false; // Default to Light Mode
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('pg-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pg-user');
    }
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pg-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pg-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleLogin = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <BrowserRouter>
      <AppWrapper
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateUser={setUser}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </BrowserRouter>
  );
};

// Internal wrapper to use hooks like useNavigate inside App
const AppWrapper: React.FC<{
  user: User | null;
  onLogin: (u: User) => void;
  onLogout: () => void;
  onUpdateUser: (u: User) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}> = ({ user, onLogin, onLogout, onUpdateUser, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onLogin={(u) => { onLogin(u); }} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />} />
      <Route path="/*" element={<AppLayout user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
    </Routes>
  );
}

export default App;
