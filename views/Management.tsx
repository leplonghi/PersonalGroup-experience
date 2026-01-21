
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

  // Mock de Alunos Expandido
  const managedUsers: User[] = [
    // Added missing email property to satisfy User type
    { id: 'u1', name: 'Maria Julia', email: 'maria.julia@personalgroup.com', role: UserRole.ALUNO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', healthStatus: 'WARNING', needsAssessment: true },
    // Added missing email property to satisfy User type
    { id: 'u2', name: 'Rafael F.', email: 'rafael.f@personalgroup.com', role: UserRole.ALUNO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael', healthStatus: 'CRITICAL', needsAssessment: false },
    // Added missing email property to satisfy User type
    { id: 'u3', name: 'Ana Clara', email: 'ana.clara@personalgroup.com', role: UserRole.ALUNO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', healthStatus: 'NORMAL' },
  ];

  const staffUsers = [
    { id: 'p1', name: 'João P.', role: UserRole.PERSONAL, status: 'Online', color: 'bg-green-100 text-green-600' },
    { id: 'p2', name: 'Ana L.', role: UserRole.PERSONAL, status: 'Online', color: 'bg-blue-100 text-blue-600' },
    { id: 'p3', name: 'Carlos R.', role: UserRole.PERSONAL, status: '14h', color: 'bg-slate-100 text-slate-400' },
    { id: 'p4', name: 'Beatriz M.', role: UserRole.PERSONAL, status: 'Off', color: 'bg-slate-100 text-slate-400' },
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
    <div className="space-y-8 animate-fade-in p-6">
      {/* HEADER PRINCIPAL */}
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Dashboard Chefe</h2>
          <p className="text-sm font-medium text-slate-400">Visão geral técnica e analítica.</p>
        </div>
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50 relative">
          <Icons.Bell className="w-6 h-6 text-slate-400" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      </header>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="flat" className="p-6 bg-white relative overflow-hidden group h-36 flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendentes</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <h4 className="text-4xl font-black text-slate-900">12</h4>
          </div>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tight flex items-center">
            <Icons.ExclamationCircle className="w-3 h-3 mr-1" /> Avaliações Físicas
          </p>
          <Icons.ClipboardCheck className="absolute -bottom-2 -right-2 w-20 h-20 text-slate-50 opacity-10 group-hover:scale-110 transition-transform" />
        </Card>

        <Card variant="flat" className="p-6 bg-white relative overflow-hidden group h-36 flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativos</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <h4 className="text-4xl font-black text-slate-900">84</h4>
          </div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight flex items-center">
             <Icons.Repeat className="w-3 h-3 mr-1" /> Ciclos de Treino
          </p>
          <Icons.Repeat className="absolute -bottom-2 -right-2 w-20 h-20 text-slate-50 opacity-10 group-hover:scale-110 transition-transform" />
        </Card>
      </div>

      {/* CRITICAL ALERT CARD: ESTAGNAÇÃO */}
      <Card variant="flat" className="p-6 bg-white border-l-4 border-l-red-500">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Icons.ExclamationCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-black text-slate-900">Estagnação de Alunos</h3>
          </div>
          <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-red-50 text-red-500 rounded-lg">Crítico</span>
        </div>
        
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-3xl font-black text-slate-900 leading-none">8</span>
          <p className="text-xs font-medium text-slate-400">alunos sem evolução &gt; 30 dias</p>
        </div>

        <div className="w-full h-1.5 bg-slate-50 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-red-500 w-[40%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-500">MJ</div>
              <div>
                <p className="text-xs font-black text-slate-800">Maria Julia</p>
                <p className="text-[9px] font-medium text-slate-400">Sem check-in há 12 dias</p>
              </div>
            </div>
            <Icons.Message className="w-5 h-5 text-blue-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-500">RF</div>
              <div>
                <p className="text-xs font-black text-slate-800">Rafael F.</p>
                <p className="text-[9px] font-medium text-slate-400">Carga estagnada (Supino)</p>
              </div>
            </div>
            <Icons.Message className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-t border-slate-50">
          Ver todos os 8 alunos
        </button>
      </Card>

      {/* PROTOCOLOS ATIVOS & CHART */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-lg font-black text-slate-900">Protocolos Ativos</h4>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver Relatórios</button>
        </div>
        
        <Card variant="flat" className="p-8 bg-white">
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="border-r border-slate-50 text-center">
              <h5 className="text-3xl font-black text-teal-500">92%</h5>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Adesão Média</p>
            </div>
            <div className="text-center">
              <h5 className="text-3xl font-black text-slate-900">45</h5>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Novos (7D)</p>
            </div>
          </div>

          <div className="flex items-end justify-between h-32 space-x-2 px-2">
            {[30, 45, 60, 50, 80, 100, 35].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                 <div 
                  className={`w-full rounded-lg transition-all duration-500 ${i === 5 ? 'bg-blue-600' : 'bg-blue-100'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-black text-slate-300 uppercase text-center tracking-widest mt-6">Frequência de treinos da semana atual</p>
        </Card>
      </section>

      {/* EQUIPE EM TURNO */}
      <section className="space-y-4">
        <h4 className="text-lg font-black text-slate-900">Equipe em Turno</h4>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4">
          {staffUsers.map(staff => (
            <button key={staff.id} className="min-w-[100px] bg-white p-4 rounded-[24px] border border-slate-50 flex flex-col items-center shadow-sm active:scale-95 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs mb-3 ${staff.color.split(' ')[0]} ${staff.color.split(' ')[1].replace('text-', 'text-opacity-80 text-')}`}>
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h5 className="text-[11px] font-black text-slate-900 mb-1">{staff.name}</h5>
              <p className={`text-[9px] font-bold uppercase ${staff.color.split(' ')[1]}`}>{staff.status}</p>
            </button>
          ))}
          <div className="min-w-[100px] border-2 border-dashed border-slate-100 rounded-[24px] flex items-center justify-center text-slate-200">
            <Icons.Plus className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* FAB - FLOATING ACTION BUTTON */}
      <button className="fixed bottom-28 right-6 w-16 h-16 bg-[#002B54] text-white rounded-[24px] shadow-2xl flex items-center justify-center active:scale-90 transition-all z-[160] border border-white/10">
        <Icons.Plus className="w-8 h-8" />
      </button>

      <div className="h-20"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32 safe-pt no-scrollbar overflow-y-auto">
      {renderDashboardChefe()}
    </div>
  );
};

export default Management;
