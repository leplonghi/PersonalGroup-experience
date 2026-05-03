import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, UserRole, Protocol } from './types';
import { useAuth } from './hooks/useAuth';

// Lazy loading views for performance
const Login = lazy(() => import('./views/Login'));
const RegisterFlow = lazy(() => import('./views/RegisterFlow'));
const EditProfile = lazy(() => import('./views/EditProfile'));
const Home = lazy(() => import('./views/Home'));
const Agenda = lazy(() => import('./views/Agenda'));
const Profile = lazy(() => import('./views/Profile'));
const StudentHub = lazy(() => import('./views/StudentHub'));
const ActiveSession = lazy(() => import('./views/ActiveSession'));
const Wellness = lazy(() => import('./views/Wellness'));
const Management = lazy(() => import('./views/Management'));
const ProtocolEditor = lazy(() => import('./views/ProtocolEditor'));
const AssessmentFlow = lazy(() => import('./views/AssessmentFlow'));
const CycleBuilder = lazy(() => import('./views/CycleBuilder'));
const Messages = lazy(() => import('./views/Messages'));
const Timeline = lazy(() => import('./views/Timeline'));
const CheckIn = lazy(() => import('./views/CheckIn'));
const Club = lazy(() => import('./views/Club'));
const FrequencyDashboard = lazy(() => import('./views/FrequencyDashboard'));
const PersonalDay = lazy(() => import('./views/PersonalDay'));
const AdminRequests = lazy(() => import('./views/AdminRequests'));
const Evolution = lazy(() => import('./views/Evolution'));
const SupportChat = lazy(() => import('./views/SupportChat'));
const Ranking = lazy(() => import('./views/Ranking'));
const Wearables = lazy(() => import('./views/Wearables'));
const FloorView = lazy(() => import('./views/FloorView'));
const StudentBriefing = lazy(() => import('./views/StudentBriefing'));
const Explore = lazy(() => import('./views/Explore'));
const Onboarding = lazy(() => import('./views/Onboarding'));
const Comunidade = lazy(() => import('./views/Comunidade'));
const ImportacaoAlunos = lazy(() => import('./views/ImportacaoAlunos'));

import Navigation from './components/Navigation';
import Header from './components/Header';
import { saveProtocol, saveAssessment, startNewCycle, createUserDoc, toggleUserRole, getUserById } from './firebase';
import { Icons } from './constants.tsx';
import { useHeaderConfig } from './hooks/useHeaderConfig';

// Shared Loader
export const PageLoader = () => (
  <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6 animate-reveal">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-pg-cobalt/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-pg-cobalt border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-bold text-pg-cobalt uppercase tracking-[0.3em] animate-pulse">Personal Group</p>
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <p className="text-[10px] font-bold text-pg-text-muted uppercase tracking-[0.2em]">Exclusividade Digital</p>
    </div>
  </div>
);

// Session Route Wrapper to handle student selection for staff
const SessionRoute: React.FC<{ executor: User; onFinish: () => void }> = ({ executor, onFinish }) => {
  const { studentId } = useParams();
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!studentId);

  useEffect(() => {
    if (studentId) {
      getUserById(studentId).then(s => {
        setStudent(s);
        setLoading(false);
      });
    } else {
      setStudent(executor);
      setLoading(false);
    }
  }, [studentId, executor]);

  if (loading) return <PageLoader />;
  if (!student) return <Navigate to="/home" />;

  return <ActiveSession user={student} executor={executor} onFinish={onFinish} />;
};

// Evolution Route Wrapper to handle student selection for staff
const EvolutionRoute: React.FC<{ viewer: User }> = ({ viewer }) => {
  const { studentId } = useParams();
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!studentId);
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      getUserById(studentId).then(s => {
        setStudent(s);
        setLoading(false);
      });
    } else {
      setStudent(viewer);
      setLoading(false);
    }
  }, [studentId, viewer]);

  if (loading) return <PageLoader />;
  if (!student) return <Navigate to="/home" />;

  return <Evolution user={student} viewer={viewer} onBack={() => navigate(-1)} />;
};

const AppLayout: React.FC<{
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onRegisterStaff: (data: Partial<User>) => Promise<void>;
  onToggleRole: (userId: string, currentRole: UserRole) => Promise<UserRole>;
  isDarkMode: boolean;
  toggleTheme: () => void;
}> = ({ user, onLogout, onUpdateUser, isDarkMode, toggleTheme, onRegisterStaff, onToggleRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Auto-redirect to Onboarding for Alunos
  useEffect(() => {
    if (user && user.role === UserRole.ALUNO && !user.onboardingCompleto && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const showNav = useMemo(() => !!user && !['/login', '/register', '/checkin', '/onboarding'].includes(location.pathname), [user, location.pathname]);
  const showHeader = useMemo(() => !!user && !['/login', '/register', '/onboarding', '/checkin'].includes(location.pathname), [user, location.pathname]);

  const headerProps = useHeaderConfig();

  return (
    <div className="min-h-screen flex flex-col relative bg-app selection:bg-pg-cobalt/20">
      <div className="grain-overlay opacity-[0.03] pointer-events-none" />
      
      {showHeader && (
        <Header
          {...headerProps}
          user={user || undefined}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onGoProfile={() => {
            if (user?.role === UserRole.ALUNO) {
              navigate('/student-hub');
            } else {
              navigate('/profile');
            }
          }}
        />
      )}

      <main className={`flex-1 flex flex-col transition-all duration-300 ${showHeader ? 'pt-20' : ''} ${showNav ? 'pb-24' : ''} relative z-10`}>
        <div className="w-full max-w-[480px] mx-auto min-h-full">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/home" element={user ? <Home user={user} onStartSession={() => navigate('/session')} onGoWellness={() => navigate('/wellness')} onGoTimeline={() => navigate('/timeline')} onGoMessages={() => navigate('/messages')} onGoAgenda={() => navigate('/agenda')} onGoCheckIn={() => navigate('/checkin')} onGoClub={() => navigate('/club')} onGoEvolution={() => navigate('/evolution')} onGoAdmin={() => navigate('/admin-requests')} onGoSupport={() => navigate('/support')} onGoRanking={() => navigate('/ranking')} onGoWearables={() => navigate('/wearables')} onGoExplore={() => navigate('/explore')} onGoComunidade={() => navigate('/comunidade')} /> : <Navigate to="/login" />} />
                <Route path="/comunidade" element={user ? <Comunidade user={user} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
                <Route path="/club" element={<Club user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/agenda" element={user ? <Agenda user={user} onBack={() => navigate('/home')} /> : <Navigate to="/login" />} />
                <Route path="/messages" element={<Messages user={user!} />} />
                <Route path="/timeline" element={<Timeline user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/wellness" element={<Wellness user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/evolution/:studentId?" element={<EvolutionRoute viewer={user!} />} />
                <Route path="/profile" element={<Profile user={user!} onLogout={onLogout} onUpdateUser={onUpdateUser} onGoTimeline={() => navigate('/timeline')} />} />
                <Route path="/student-hub" element={user ? <StudentHub user={user} onLogout={onLogout} onNavigateTo={(v) => navigate(`/${v}`)} /> : <Navigate to="/login" />} />
                <Route path="/onboarding" element={<Onboarding user={user!} onComplete={() => navigate('/home')} />} />

                {/* Active Session & Management */}
                <Route path="/session/:studentId?" element={<SessionRoute executor={user!} onFinish={() => navigate('/home')} />} />
                <Route path="/management" element={<Management user={user!} onEditProtocol={() => navigate('/protocol-edit')} onStartAssessment={(s) => { setSelectedStudent(s); navigate('/assessment'); }} onStartCycle={(s) => { setSelectedStudent(s); navigate('/cycle-builder'); }} onJoinSession={(s) => navigate(`/session/${s.id}`)} onViewEvolution={(s) => navigate(`/evolution/${s.id}`)} onRegisterStaff={onRegisterStaff} onToggleRole={onToggleRole} />} />

                {/* Management Sub-routes */}
                <Route path="/protocol-edit" element={<ProtocolEditor protocol={undefined} onBack={() => navigate('/management')} onSave={async () => navigate('/management')} />} />
                <Route path="/assessment" element={selectedStudent ? <AssessmentFlow student={selectedStudent} chefe={user!} onBack={() => navigate('/management')} onFinish={async (assessment, newStatus) => { await saveAssessment(assessment, newStatus); navigate('/management'); }} /> : <Navigate to="/management" />} />
                <Route path="/cycle-builder" element={selectedStudent ? <CycleBuilder student={selectedStudent} onBack={() => navigate('/management')} onConfirm={async (cycle) => { if (selectedStudent) { await startNewCycle(selectedStudent.id, cycle); setSelectedStudent(null); navigate('/management'); } }} /> : <Navigate to="/management" />} />

                <Route path="/frequency" element={<FrequencyDashboard user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/personal-day" element={<PersonalDay user={user!} onBack={() => navigate('/home')} onComplete={() => navigate('/home')} />} />
                <Route path="/admin-requests" element={<AdminRequests user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/support" element={<SupportChat user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/ranking" element={<Ranking user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/wearables" element={<Wearables user={user!} onBack={() => navigate('/home')} />} />
                <Route path="/explore" element={user ? <Explore user={user} /> : <Navigate to="/login" />} />
                <Route path="/floor-view" element={<FloorView />} />
                <Route path="/admin/importar" element={user?.role === UserRole.ADMIN ? <ImportacaoAlunos /> : <Navigate to="/home" />} />

                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </Suspense>
        </div>
      </main>

      {showNav && user && (
        <Navigation
          role={user.role}
          isDarkMode={isDarkMode}
          recadosNaoLidos={user?.recadosNaoLidos}
        />
      )}
    </div >
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('pg-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  return (
    <BrowserRouter>
      <AuthShell isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
};

const AuthShell: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const { user, loading, signInWithEmail, signInWithGoogle, signUpWithEmail, signOut, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background academia com gradiente escuro */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/gym-background.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div className="flex flex-col items-center space-y-8 animate-reveal z-10 px-6">
          {/* Logo Personal Group */}
          <img
            src="/personalgroup-logo.png"
            alt="Personal Group"
            className="w-40 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,182,253,0.4)]"
          />

          <div className="relative">
            <div className="w-20 h-20 border-[3px] border-white/10 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-[3px] border-pg-cobalt border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 rounded-2xl bg-pg-cobalt/10 border border-pg-cobalt/20 backdrop-blur-md animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tighter text-white font-display drop-shadow-lg">PERSONAL GROUP</h2>
            <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.6em]">Premium Network</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckInSuccess = () => {
    if (user) {
      updateLocalUser({
        ...user,
        isCheckedIn: true,
        checkInTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }
    navigate('/home');
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onLogin={signInWithEmail} onGoogleLogin={signInWithGoogle} onRegister={() => navigate('/register')} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterFlow onRegister={signUpWithEmail} onBack={() => navigate('/login')} isDarkMode={isDarkMode} />} />
        <Route path="/checkin" element={<CheckIn userId={user?.id || ''} userName={user?.name || ''} onSuccess={handleCheckInSuccess} onCancel={() => navigate('/home')} />} />
        <Route path="/edit-profile" element={user ? <EditProfile user={user} onBack={() => navigate('/profile')} onUpdated={(u) => { updateLocalUser(u); navigate('/profile'); }} /> : <Navigate to="/login" />} />
        <Route path="/*" element={<AppLayout user={user} onLogout={signOut} onUpdateUser={updateLocalUser} onToggleRole={toggleUserRole} onRegisterStaff={async (data) => { if (data.email) await createUserDoc('staff_' + Date.now(), data as User); }} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
      </Routes>
    </Suspense>
  );
};

export default App;
