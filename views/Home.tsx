
import React from 'react';
import { User, UserRole } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';

interface HomeProps {
  user: User;
  onStartSession?: (student?: User) => void;
  onGoWellness?: () => void;
  onGoTimeline?: () => void;
  onGoMessages?: () => void;
  onGoAgenda?: () => void;
  onGoCheckIn?: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  user, 
  onStartSession, 
  onGoWellness, 
  onGoTimeline,
  onGoMessages,
  onGoAgenda,
  onGoCheckIn
}) => {
  const renderStudentHome = () => (
    <div className="animate-slide-up flex flex-col min-h-screen">
      {/* 1. TOP GREETING & STATUS */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden">
              <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#020617] ${user.healthStatus === 'NORMAL' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">Membro Exclusive</p>
            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">{user.name}</h2>
          </div>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-sm active:scale-90 transition-all">
          <Icons.Bell className="w-6 h-6 text-slate-500" />
          <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-600 rounded-full border border-white"></div>
        </button>
      </div>

      {/* 2. CHECK-IN SECTION (INTERLIGADO) */}
      {!user.isCheckedIn ? (
        <div className="px-5 mb-8">
          <Card 
            variant="flat" 
            onClick={onGoCheckIn}
            className="p-8 border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 flex items-center justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg animate-pulse">
                <Icons.QRCode className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">Check-in na Unidade</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sincronize sua presença agora</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-blue-300" />
          </Card>
        </div>
      ) : (
        <div className="px-5 mb-8">
          <div className="bg-green-500/10 border border-green-500/20 rounded-[32px] p-6 flex items-center space-x-4">
             <div className="w-10 h-10 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Icons.Shield className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest leading-none mb-1">Presença Validada</p>
                <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Em Pista: Unidade Península</p>
             </div>
          </div>
        </div>
      )}

      {/* 3. HERO WORKOUT CARD */}
      <div className="px-5 mb-8">
        <Card variant="blue" className={`relative aspect-[4/5] p-10 flex flex-col justify-end group shadow-2xl shadow-blue-900/30 transition-all ${!user.isCheckedIn ? 'opacity-80 grayscale-[0.2]' : ''}`}>
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-[3s]" 
            alt="Workout" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002B54] via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest mb-6 border border-white/20">
              <Icons.Clock className="w-3 h-3 mr-2" />
              Sessão Sugerida: 18:00
            </div>
            
            <h3 className="text-4xl font-black text-white leading-[0.9] tracking-tighter mb-4">
              MEMBROS<br/>SUPERIORES
            </h3>
            <p className="text-blue-100/70 text-sm font-bold mb-8 uppercase tracking-widest">Protocolo Hipertrofia A2</p>
            
            <button 
              onClick={() => onStartSession?.()}
              className={`w-full py-6 bg-white text-[#002B54] rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 active:scale-[0.98] transition-all shadow-xl ${!user.isCheckedIn ? 'opacity-50' : ''}`}
            >
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-[#002B54] border-b-[5px] border-b-transparent ml-1"></div>
              <span>INICIAR GOVERNANÇA</span>
            </button>
            {!user.isCheckedIn && (
              <p className="text-white/40 text-[8px] font-black uppercase text-center mt-6 tracking-[0.2em]">Faça check-in para liberar a governança</p>
            )}
          </div>
        </Card>
      </div>

      {/* 4. QUICK METRICS */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <Card variant="flat" className="p-8 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frequência</span>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-xl">
              <Icons.TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div>
            <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">85<span className="text-lg opacity-30">%</span></h4>
            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Aderência ao Plano</p>
          </div>
        </Card>

        <Card variant="flat" className="p-8 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <Icons.Chart className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">1.4<span className="text-lg opacity-30">k</span></h4>
            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Tonelagem/Sessão</p>
          </div>
        </Card>
      </div>

      {/* 5. RECOVERY SECTION */}
      <div className="px-6 mb-12">
        <Card variant="outline" onClick={onGoWellness} className="p-8 flex items-center justify-between group active:bg-slate-50 dark:active:bg-white/5 border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-6">
            <div className="w-14 h-14 bg-[#002B54] dark:bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Icons.Leaf className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Recovery & SPA</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">1 de 2 sessões disponíveis</p>
            </div>
          </div>
          <Icons.ChevronRight className="w-5 h-5 text-slate-400" />
        </Card>
      </div>

      <div className="h-24"></div>
    </div>
  );

  const renderPersonalHome = () => (
    <div className="space-y-10 animate-slide-up p-8 pt-24 min-h-screen">
      <header>
        <p className="text-[11px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.4em] mb-2 leading-none">High Performance Team</p>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">Olá, Prof. {user.name.split(' ')[0]}</h2>
      </header>

      {/* STATUS DE PISTA PARA PERSONAL */}
      <Card variant="flat" className="p-8 bg-white border-blue-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Alunos em Pista (Presentes)</h4>
          <span className="px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-lg animate-pulse tracking-widest">Real Time</span>
        </div>
        
        <div className="flex -space-x-3">
           {['Augusto Silva', 'Maria Fernanda'].map((name, i) => (
             <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400 shadow-lg">
                {name[0]}
             </div>
           ))}
           <div className="w-12 h-12 rounded-2xl border-4 border-white bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs shadow-lg">
              +4
           </div>
        </div>
        <p className="text-[10px] font-bold text-blue-700 mt-6 uppercase tracking-widest">6 alunos aguardando governança técnica</p>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card variant="blue" className="p-8 h-48 flex flex-col justify-between shadow-2xl shadow-blue-900/20">
          <p className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest">Check-ins Hoje</p>
          <h4 className="text-6xl font-black tracking-tighter italic">18</h4>
        </Card>
        <Card variant="flat" className="p-8 h-48 flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NPS Técnico</p>
          <div className="text-center">
            <h4 className="text-5xl font-black text-blue-700 tracking-tighter">9.9</h4>
            <div className="flex justify-center mt-2 space-x-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-700"></div>)}
            </div>
          </div>
        </Card>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Agenda de Pista</h4>
          <button 
            onClick={onGoAgenda}
            className="text-[10px] font-black text-blue-700 uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
          >
            Ver Agenda
          </button>
        </div>
        
        <div className="space-y-4">
          {['Augusto Silva', 'Maria Fernanda', 'Rafael Lima'].map((student, idx) => (
            <Card key={idx} variant="flat" className="p-6 flex items-center justify-between active:scale-[0.98] transition-all relative">
              {idx === 0 && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-green-500 rounded-l-full"></div>}
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 shadow-inner">
                  {student.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="text-sm font-black text-slate-900 dark:text-white">{student}</h5>
                    {idx === 0 && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
                  </div>
                  <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mt-0.5">
                    {idx === 0 ? 'Presente na Pista' : 'Membros Inferiores'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 dark:text-white">18:00</span>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pista 02</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen">
      {user.role === UserRole.PERSONAL ? renderPersonalHome() : renderStudentHome()}
    </div>
  );
};

export default Home;
