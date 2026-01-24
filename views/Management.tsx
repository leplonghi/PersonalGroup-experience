
import React, { useState, useEffect } from 'react';
import { Protocol, UserRole, User } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';
import { getProtocols } from '../firebase';

interface ManagementProps {
  user: User;
  onEditProtocol: (protocol?: Protocol) => void;
  onStartAssessment: (student: User) => void;
  onStartCycle: (student: User) => void;
}

const Management: React.FC<ManagementProps> = ({ user, onEditProtocol, onStartAssessment, onStartCycle }) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');

  const managedUsers: User[] = [
    { id: 'u1', name: 'Maria Julia', email: 'maria.julia@personalgroup.com', role: UserRole.ALUNO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', healthStatus: 'WARNING', needsAssessment: true },
    { id: 'u2', name: 'Rafael F.', email: 'rafael.f@personalgroup.com', role: UserRole.ALUNO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael', healthStatus: 'CRITICAL', needsAssessment: false },
    { id: 'u3', name: 'Ana Clara', email: 'ana.clara@personalgroup.com', role: UserRole.ALUNO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', healthStatus: 'NORMAL' },
  ];

  const staffUsers = [
    { id: 'p1', name: 'João P.', role: UserRole.PERSONAL, status: 'Online', color: 'bg-blue-600' },
    { id: 'p2', name: 'Ana L.', role: UserRole.PERSONAL, status: 'Online', color: 'bg-blue-600' },
    { id: 'p3', name: 'Carlos R.', role: UserRole.PERSONAL, status: '14h', color: 'bg-ocean' },
    { id: 'p4', name: 'Beatriz M.', role: UserRole.PERSONAL, status: 'Off', color: 'bg-midnight' },
  ];

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const data = await getProtocols();
        setProtocols(data.length ? data : []);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchProtocols();
  }, []);

  const renderDashboardChefe = () => (
    <div className="space-y-12 animate-in fade-in duration-700 p-8 pt-10">
      {/* TOP STATS CARDS - OBSIDIAN HUD */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 p-8 h-48 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-amber-500 shadow-[0_0_10px_#F59E0B]"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Pendências</span>
          </div>
          <h4 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">12</h4>
          <p className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.1em] flex items-center">
            Avaliações Pendentes
          </p>
        </div>

        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 p-8 h-48 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Operacionais</span>
          </div>
          <h4 className="text-6xl font-bold text-blue-600 tracking-tight tabular-nums leading-none">84</h4>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.1em] flex items-center">
            Alunos Ativos
          </p>
        </div>
      </div>

      {/* CRITICAL ALERT CARD: ESTAGNAÇÃO - SHARP OBSIDIAN */}
      <div className="bg-red-50 dark:bg-white/5 border-l-4 border-red-600 p-10 space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Icons.ExclamationCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">Alunos em Atenção</h3>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 border border-red-600 text-red-600">Atenção</span>
        </div>

        <div className="flex items-baseline space-x-3">
          <span className="text-5xl font-bold text-slate-900 dark:text-white leading-none tabular-nums">08</span>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alunos que precisam de suporte</p>
        </div>

        <div className="w-full h-1 bg-slate-200 dark:bg-white/5">
          <div className="h-full bg-red-600 w-[40%] shadow-[0_0_15px_#DC2626]"></div>
        </div>

        <div className="space-y-4">
          {managedUsers.filter(u => u.healthStatus !== 'NORMAL').map(student => (
            <div key={student.id} className="flex items-center justify-between p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-ocean/30">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 border border-slate-200 dark:border-white/10 p-1">
                  <img src={student.avatar} className="w-full h-full grayscale" alt="" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">{student.name}</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2">{student.healthStatus === 'CRITICAL' ? 'Requer Contato' : 'Avaliação Necessária'}</p>
                </div>
              </div>
              <button className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-white/10 active:scale-95 text-blue-500">
                <Icons.Message className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full py-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em] border-t border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
          Ver Lista Completa
        </button>
      </div>

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
              <h5 className="text-4xl font-bold text-blue-600 leading-none tabular-nums">92%</h5>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-3">Presentes</p>
            </div>
            <div className="text-center">
              <h5 className="text-4xl font-bold text-slate-900 dark:text-white leading-none tabular-nums">45</h5>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-3">Novos Alunos</p>
            </div>
          </div>

          <div className="flex items-end justify-between h-40 space-x-3 px-2">
            {[30, 45, 60, 50, 80, 100, 35].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full transition-all duration-700 ${i === 5 ? 'bg-blue-600 shadow-[0_0_20px_#2563EB]' : 'bg-slate-200 dark:bg-white/5 group-hover:bg-blue-200 dark:group-hover:bg-white/10'}`}
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold text-slate-800 uppercase text-center tracking-[0.4em] mt-10">Frequência Semanal do Studio</p>
        </div>
      </section>

      {/* EQUIPE EM TURNO */}
      <section className="space-y-8">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] px-2 leading-none border-l-4 border-blue-600 pl-4">Equipe</h4>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-6 px-1">
          {staffUsers.map(staff => (
            <button key={staff.id} className="min-w-[130px] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 flex flex-col items-center group transition-all">
              <div className={`w-16 h-16 border border-slate-200 dark:border-white/10 p-1 mb-5 group-hover:border-blue-600 transition-all`}>
                <div className="w-full h-full bg-slate-100 dark:bg-midnight flex items-center justify-center font-bold text-xs text-slate-900 dark:text-white uppercase">
                  {staff.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <h5 className="text-[12px] font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight leading-none">{staff.name}</h5>
              <p className={`text-[9px] font-bold uppercase text-blue-500 tracking-widest`}>{staff.status}</p>
            </button>
          ))}
          <div className="min-w-[130px] border border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-800 hover:text-blue-500 hover:border-blue-600 transition-all">
            <Icons.Plus className="w-8 h-8" />
          </div>
        </div>
      </section>

      {/* FAB - FLOATING ACTION BUTTON */}
      <button className="fixed bottom-32 right-8 w-18 h-18 bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center active:scale-90 transition-all z-[160] hover:bg-blue-500">
        <Icons.Plus className="w-8 h-8" />
      </button>

      <div className="h-32"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative pb-32">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <div className="relative z-10 no-scrollbar overflow-y-auto pt-4">

        {renderDashboardChefe()}
      </div>
    </div>
  );
};

export default Management;
