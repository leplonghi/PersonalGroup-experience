import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, UserRole, Protocol, Assessment, TrainingCycle, HealthStatus } from './types';
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
const Onboarding = lazy(() => import('./views/Onboarding'));
// Shared Loader
export const PageLoader = () => (
  <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-8 h-8 border-2 border-cobalt border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[10px] font-black text-app-muted uppercase tracking-widest">Carregando...</p>
  </div>
);
import Navigation from './components/Navigation';
import Header from './components/Header';
import { saveProtocol, saveAssessment, startNewCycle, createUserDoc, toggleUserRole, getUserById } from './firebase';
import { Icons } from './constants.tsx';

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

// Layout wraper to handle Header and Navigation visibility
import { useHeaderConfig } from './hooks/useHeaderConfig'; // Note: Adjust import to be top-level if preferred, but it works here or at top

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

  const showNav = useMemo(() => !!user && location.pathname !== '/login', [user, location.pathname]);
  const showHeader = useMemo(() => !!user && location.pathname !== '/login', [user, location.pathname]);

  const headerProps = useHeaderConfig();

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-500 font-sans bg-app">
      {showHeader && (
        <Header
          {...headerProps}
          user={user || undefined}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onGoProfile={() => navigate('/profile')}
        />
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${showHeader ? 'pt-20' : ''} ${showNav ? 'pb-24' : ''}`}>
        <div className="max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-0 pt-0">
          <div key={location.pathname} className="animate-slide-up">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onLogin={async () => { }} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />} />

                {/* Protected Routes */}
                {user ? (
                  <>
                    <Route path="/home" element={<Home user={user} onStartSession={() => navigate('/session')} onGoWellness={() => navigate('/wellness')} onGoTimeline={() => navigate('/timeline')} onGoMessages={() => navigate('/messages')} onGoAgenda={() => navigate('/agenda')} onGoCheckIn={() => navigate('/checkin')} onGoClub={() => navigate('/club')} onGoEvolution={() => navigate('/evolution')} onGoAdmin={() => navigate('/admin-requests')} onGoSupport={() => navigate('/support')} onGoRanking={() => navigate('/ranking')} onGoWearables={() => navigate('/wearables')} />} />
                    <Route path="/club" element={<Club user={user} onBack={() => navigate('/home')} />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/messages" element={<Messages user={user} />} />
                    <Route path="/timeline" element={<Timeline user={user} onBack={() => navigate('/home')} />} />
                    <Route path="/wellness" element={<Wellness user={user} onBack={() => navigate('/home')} />} />
                    <Route path="/profile" element={<StudentHub user={user} onLogout={onLogout} onNavigateTo={(page) => navigate(`/${page}`)} />} />
                    <Route path="/onboarding" element={<Onboarding user={user} onComplete={() => navigate('/home')} />} />

                    {/* Active Session & Management */}
                    <Route path="/session/:studentId?" element={<SessionRoute executor={user} onFinish={() => navigate('/home')} />} />
                    <Route path="/live-session/:sessionId" element={<SessionRoute executor={user} onFinish={() => navigate('/home')} />} />
                    <Route path="/session-live" element={<SessionRoute executor={user} onFinish={() => navigate('/home')} />} />
                    <Route path="/floor-view" element={<FloorView />} />
                    <Route path="/student-briefing/:uid" element={<StudentBriefing trainer={user} />} />
                    <Route path="/management" element={<Management user={user} onEditProtocol={() => navigate('/protocol-edit')} onStartAssessment={(s) => { setSelectedStudent(s); navigate('/assessment'); }} onStartCycle={(s) => { setSelectedStudent(s); navigate('/cycle-builder'); }} onJoinSession={(s) => navigate(`/session/${s.id}`)} onViewEvolution={(s) => navigate(`/evolution/${s.id}`)} onRegisterStaff={onRegisterStaff} onToggleRole={onToggleRole} />} />

                    {/* Management Sub-routes */}
                    <Route path="/protocol-edit" element={<ProtocolEditor protocol={undefined} onBack={() => navigate('/management')} onSave={async () => navigate('/management')} />} />
                    <Route path="/assessment" element={selectedStudent ? <AssessmentFlow student={selectedStudent} chefe={user} onBack={() => navigate('/management')} onFinish={async (assessment, newStatus) => { await saveAssessment(assessment, newStatus); navigate('/management'); }} /> : <Navigate to="/management" />} />
                    <Route path="/cycle-builder" element={selectedStudent ? <CycleBuilder student={selectedStudent} onBack={() => navigate('/management')} onConfirm={async (cycle) => { if (selectedStudent) { await startNewCycle(selectedStudent.id, cycle); setSelectedStudent(null); navigate('/management'); } }} /> : <Navigate to="/management" />} />

                    {/* Frequency Dashboard */}
                    <Route path="/frequency" element={<FrequencyDashboard user={user} onBack={() => navigate('/home')} />} />

                    {/* PersonalDay */}
                    <Route path="/personal-day" element={<PersonalDay user={user} onBack={() => navigate('/home')} onComplete={() => navigate('/home')} />} />

                    {/* Etapa 5 */}
                    <Route path="/admin-requests" element={<AdminRequests user={user} onBack={() => navigate('/home')} />} />
                    <Route path="/support" element={<SupportChat user={user} onBack={() => navigate('/home')} />} />
                    <Route path="/ranking" element={<Ranking user={user} onBack={() => navigate('/home')} />} />
                    <Route path="/wearables" element={<Wearables user={user} onBack={() => navigate('/home')} />} />

                    <Route path="*" element={<Navigate to="/home" />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
              </Routes>
            </Suspense>
          </div>
        </div>
      </main>

      {showNav && user && (
        <Navigation
          role={user.role}
          isDarkMode={isDarkMode}
        />
      )}
    </div >
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  return (
    <BrowserRouter>
      <AuthShell isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
};

// AuthShell — wraps app with real Firebase Auth via useAuth hook
const AuthShell: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const { user, loading, signInWithEmail, signInWithGoogle, signUpWithEmail, signOut, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  // Show full-screen spinner while auth state is being restored
  if (loading) {
    return (
      <div className="min-h-screen bg-app grain-overlay flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.4em]">Autenticando...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleRegister = async (email: string, password: string, userData: Partial<User>) => {
    await signUpWithEmail(email, password, userData);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleCheckInSuccess = () => {
    if (user) {
      const now = new Date();
      updateLocalUser({
        ...user,
        isCheckedIn: true,
        checkInTime: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }
    navigate('/home');
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onRegister={() => navigate('/register')} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterFlow onRegister={handleRegister} onBack={() => navigate('/login')} isDarkMode={isDarkMode} />} />

        {/* CheckIn (accessible when logged in) */}
        <Route path="/checkin" element={<CheckIn userId={user?.id || ''} userName={user?.name || ''} onSuccess={handleCheckInSuccess} onCancel={() => navigate('/home')} />} />

        {/* Edit Profile */}
        <Route path="/edit-profile" element={user ? <EditProfile user={user} onBack={() => navigate('/profile')} onUpdated={(u) => { updateLocalUser(u); navigate('/profile'); }} /> : <Navigate to="/login" />} />

        {/* All other routes via AppLayout */}
        <Route path="/*" element={<AppLayout user={user} onLogout={handleLogout} onUpdateUser={updateLocalUser} onToggleRole={toggleUserRole} onRegisterStaff={async (data) => { if (data.email) await createUserDoc('staff_' + Date.now(), data as User); }} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
      </Routes>
    </Suspense>
  );
};

export default App;
