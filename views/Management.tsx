
import React, { useState, useEffect } from 'react';
import { Protocol, UserRole, User } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';
import { getProtocols, getStudents, getStaff } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StudentDetailView } from '../components/management/StudentDetailView';
import { StudentRow } from '../components/management/StudentRow';
import { StaffRegistrationModal } from '../components/management/StaffRegistrationModal';
import { StaffDetailView } from '../components/management/StaffDetailView';

interface ManagementProps {
  user: User;
  onEditProtocol: (protocol?: Protocol) => void;
  onStartAssessment: (student: User) => void;
  onStartCycle: (student: User) => void;
  onJoinSession: (student: User) => void;
  onViewEvolution: (student: User) => void;
  onRegisterStaff: (data: Partial<User>) => Promise<void>;
  onToggleRole: (userId: string, currentRole: UserRole) => Promise<void>;
}

const Management: React.FC<ManagementProps> = ({ user, onEditProtocol, onStartAssessment, onStartCycle, onRegisterStaff, onToggleRole, onJoinSession, onViewEvolution }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ALUNOS' | 'EQUIPE' | 'PROTOCOLOS'>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentView, setSelectedStudentView] = useState<User | null>(null);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [showStaffReg, setShowStaffReg] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const [protocolsData, studentsData, staffData] = await Promise.all([
        getProtocols(),
        getStudents(),
        getStaff()
      ]);
      setProtocols(protocolsData);
      setStudents(studentsData);
      setStaffList(staffData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: UserRole) => {
    try {
      await onToggleRole(userId, currentRole);
      await fetchData(); // Refresh list
    } catch (e) {
      console.error('Error toggling role:', e);
    }
  };

  const onlineStudents = students.filter(s => s.isCheckedIn);

  const renderDashboardChefe = () => (
    <div className="space-y-12 animate-in fade-in duration-700 p-8 pt-10">
      {/* LIVE GYM STATUS - THE "PRESENCE" HUD */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div className="border-l-4 border-emerald-500 pl-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1 leading-none">Status Tempo Real</h4>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none flex items-center">
              No Studio Agora
              <span className="ml-3 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{onlineStudents.length} {onlineStudents.length === 1 ? 'Aluno' : 'Alunos'}</p>
        </div>

        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-6 px-1">
          {onlineStudents.length > 0 ? (
            onlineStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentForDetail(student)}
                className="min-w-[100px] flex flex-col items-center group space-y-3"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-500 p-1 group-hover:scale-105 transition-transform">
                    <img
                      src={student.avatar || student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                      className="w-full h-full rounded-full object-cover"
                      alt="Avatar"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-midnight rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight text-center truncate w-full">{student.name.split(' ')[0]}</p>
              </button>
            ))
          ) : (
            <div className="w-full py-10 bg-white/5 border border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center space-y-4">
              <Icons.Shield className="w-8 h-8 text-slate-700 opacity-20" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nenhum aluno em atividade</p>
            </div>
          )}
        </div>
      </section>

      {/* TOP STATS CARDS - OBSIDIAN HUD */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 p-8 h-48 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#22D3EE]"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Pendências</span>
          </div>
          <h4 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">
            {students.filter(s => s.needsAssessment).length}
          </h4>
          <p className="text-[9px] font-bold text-cyan-500 uppercase tracking-[0.1em] flex items-center">
            Avaliações Pendentes
          </p>
        </div>

        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 p-8 h-48 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Gerência</span>
          </div>
          <h4 className="text-6xl font-bold text-blue-600 tracking-tight tabular-nums leading-none">
            {students.length}
          </h4>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.1em] flex items-center">
            Total de Alunos
          </p>
        </div>
      </div>

      {/* LISTA COMPLETA DE ALUNOS COM STATUS DE PERSONAL DAY */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-1 leading-none">Governança</h4>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">Alunos Ativos</h3>
          </div>
        </div>

        <div className="px-2">
          <div className="relative">
            <input
              type="text"
              placeholder="PESQUISAR ALUNO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
            />
            <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredStudents.map(student => {
            const isPersonalDay = student.lastAssessmentDate &&
              (new Date().getTime() - new Date(student.lastAssessmentDate).getTime()) / (1000 * 60 * 60 * 24) >= 45;

            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-6 border transition-all hover:bg-white dark:hover:bg-white/5 ${isPersonalDay ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-200 dark:border-white/5 bg-white dark:bg-ocean/30'}`}
              >
                <div
                  className="flex items-center space-x-5 cursor-pointer flex-1"
                  onClick={() => setSelectedStudentForDetail(student)}
                >
                  <div className={`w-14 h-14 border-2 p-1 flex items-center justify-center overflow-hidden rounded-full ${student.isCheckedIn ? 'border-emerald-500' : 'border-slate-200 dark:border-white/10'}`}>
                    <img src={student.avatar || student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} className="w-full h-full object-cover rounded-full" alt="Student avatar" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">{student.name}</p>
                      {isPersonalDay && (
                        <span className="text-[8px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-sm animate-pulse whitespace-nowrap">PERSONAL DAY</span>
                      )}
                    </div>
                    <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-2 flex items-center">
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${student.isCheckedIn ? 'bg-emerald-500' : 'bg-slate-500 opacity-30'}`}></span>
                      {student.isCheckedIn ? 'Treinando Agora' : 'Offline'} • {student.currentCycle ? student.currentCycle.name : 'Sem ciclo'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onStartAssessment(student)}
                    className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-white/10 active:scale-95 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-white/5"
                    title="Nova Avaliação"
                  >
                    <Icons.TrendingUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStartCycle(student)}
                    className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-white/10 active:scale-95 text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5"
                    title="Definir Treino"
                  >
                    <Icons.Shield className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PERFORMANCE DE PISTA - SHARP OBSIDIAN */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-1 leading-none">Frequência</h4>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">Atividade Geral</h3>
          </div>
          <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center hover:translate-x-2 transition-transform">
            Detalhes <Icons.ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 p-10">
          <div className="grid grid-cols-2 gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12">
            <div className="text-center">
              <h5 className="text-4xl font-bold text-blue-600 leading-none tabular-nums">
                {Math.round((onlineStudents.length / (students.length || 1)) * 100)}%
              </h5>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-3">Taxa de Ocupação</p>
            </div>
            <div className="text-center">
              <h5 className="text-4xl font-bold text-slate-900 dark:text-white leading-none tabular-nums">
                {onlineStudents.length}
              </h5>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-3">Alunos em Treino</p>
            </div>
          </div>

          <div className="flex items-end justify-between h-40 space-x-3 px-2">
            {[30, 45, 60, 50, 80, 100, onlineStudents.length * 10].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full transition-all duration-700 ${i === 6 ? 'bg-emerald-500 shadow-[0_0_20px_#10B981]' : (i === 5 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-white/5')}`}
                  style={{ height: `${Math.max(5, h)}%` }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold text-slate-800 uppercase text-center tracking-[0.4em] mt-10">Frequência Semanal do Studio</p>
        </div>
      </section>

      {/* FAB - FLOATING ACTION BUTTON */}
      <button
        onClick={() => onEditProtocol()}
        className="fixed bottom-32 right-8 w-18 h-18 bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center active:scale-90 transition-all z-[160] hover:bg-blue-500"
      >
        <Icons.Plus className="w-8 h-8" />
      </button>

      {/* STUDENT DETAIL MODAL/PANEL */}
      {selectedStudentForDetail && (
        <StudentDetailView
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          onStartAssessment={onStartAssessment}
          onStartCycle={onStartCycle}
        />
      )}

      <div className="h-32"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative pb-32">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>
      <div className="relative z-10 no-scrollbar overflow-y-auto pt-4">
        {/* NAV TABS */}
        <div className="flex space-x-8 px-8 mb-8 border-b border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar">
          {['DASHBOARD', 'ALUNOS', 'EQUIPE', 'PROTOCOLOS']
            .filter(tab => {
              if (user.role === UserRole.PERSONAL) {
                return tab === 'DASHBOARD' || tab === 'ALUNOS';
              }
              return true;
            })
            .map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
              </button>
            ))}
        </div>

        {activeTab === 'DASHBOARD' && renderDashboardChefe()}
        {activeTab === 'ALUNOS' && (
          <div className="p-8 space-y-6">
            <header className="border-l-4 border-emerald-500 pl-4 mb-8">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Base de Dados</h4>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Todos os Alunos</h3>
            </header>

            <div className="relative mb-8">
              <input
                type="text"
                placeholder="PROCURAR POR NOME OU OBJETIVO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 py-5 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {filteredStudents.map(student => (
                <StudentRow key={student.id} student={student} onSelect={setSelectedStudentForDetail} onStartAssessment={onStartAssessment} onStartCycle={onStartCycle} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'EQUIPE' && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-end mb-8">
              <header className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Recursos Humanos</h4>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight text-balance">Gestão de Professores</h3>
              </header>
              {user.role === UserRole.ADMIN && (
                <button
                  onClick={() => setShowStaffReg(true)}
                  className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 active:scale-95 transition-all shadow-xl"
                >
                  <Icons.Plus className="w-4 h-4" />
                  <span>Registrar</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {staffList.map(staff => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-all"
                >
                  <div className="flex items-center space-x-5 cursor-pointer" onClick={() => setSelectedStaff(staff)}>
                    <img src={staff.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`} className="w-14 h-14 rounded-full" alt="Staff avatar" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{staff.name}</h4>
                      <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                        {staff.role === UserRole.CHEFE ? 'Chefe de Pista' : 'Personal Flex'}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {user.role === UserRole.ADMIN && (
                      <button
                        onClick={() => handleToggleRole(staff.id, staff.role)}
                        className="w-10 h-10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5 active:scale-95 transition-all"
                        title="Alternar Cargo"
                      >
                        <Icons.Refresh className="w-4 h-4" />
                      </button>
                    )}
                    {(user.role === UserRole.CHEFE || user.role === UserRole.ADMIN) && (
                      <button
                        className="px-4 h-10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all"
                        onClick={() => alert('Atribuição: Diária / Semanal / Mensal')}
                      >
                        Atribuir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PROTOCOLOS' && (
          <div className="p-8 space-y-8">
            <header className="border-l-4 border-slate-900 dark:border-white pl-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Metodologia</h4>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Sistemas de Treino</h3>
            </header>

            <div className="grid grid-cols-1 gap-6">
              {protocols.map(p => (
                <Card
                  key={p.id}
                  className="p-8 flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all"
                  onClick={() => (user.role === UserRole.ADMIN || user.role === UserRole.CHEFE) && onEditProtocol(p)}
                >
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{p.name}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">v{p.version} • {p.exercises.length} Exercícios</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 flex items-center justify-center rounded-none group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icons.Shield className="w-5 h-5" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {showStaffReg && (
        <StaffRegistrationModal
          onClose={() => setShowStaffReg(false)}
          onSubmit={async (data) => {
            await onRegisterStaff(data);
            setShowStaffReg(false);
          }}
        />
      )}

      {selectedStaff && (
        <StaffDetailView
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onUpdate={async (data) => {
            // update logic
            setSelectedStaff(null);
          }}
        />
      )}

      {selectedStudentForDetail && (
        <StudentDetailView
          currentUser={user}
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          onStartAssessment={onStartAssessment}
          onStartCycle={onStartCycle}
          onJoinSession={onJoinSession}
          onViewEvolution={onViewEvolution}
        />
      )}
    </div>
  );
};

export default Management;
