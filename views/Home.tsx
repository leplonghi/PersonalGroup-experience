
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
  onGoClub?: () => void;
}

const Home: React.FC<HomeProps> = ({
  user,
  onStartSession,
  onGoWellness,
  onGoTimeline,
  onGoMessages,
  onGoAgenda,
  onGoCheckIn,
  onGoClub
}) => {
  const renderStudentHome = () => (
    <div className="animate-in fade-in duration-1000 space-y-8 px-6 pb-24 pt-6 grain-overlay">

      {/* 1. ASYMMETRIC PRECISION HEADER */}
      <div className="flex flex-col space-y-0.5 pt-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-3">
              Bem-vindo ao Personal Group
            </span>
            <h1 className="text-5xl font-bold tracking-tight leading-none">
              {user.name.split(' ')[0]}<span className="text-blue-600">.</span>
            </h1>
            <button onClick={onGoClub} className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center hover:text-blue-500 transition-colors group/status text-left">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_#22C55E] group-hover/status:animate-ping"></span>
              Minha Unidade: Península
            </button>
          </div>
          <div className="relative group">
            <div className="w-20 h-20 rounded-sm p-0.5 bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 group-hover:border-blue-500/50 transition-all duration-700 shadow-2xl">
              <img src={user.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Identity" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-[10px] font-bold shadow-lg">
              9/10
            </div>
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL GATE (CHECK-IN) */}
      {!user.isCheckedIn ? (
        <Card
          variant="outline"
          onClick={onGoCheckIn}
          className="p-8 scanline-effect border-slate-200 dark:border-white/10 group hover:border-blue-500/30 transition-all active:scale-[0.99]"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-[0.3em] opacity-50">Check-in</h4>
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 border border-blue-200 dark:border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                  <Icons.QRCode className="w-8 h-8 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                </div>
                <div>
                  <div className="h-4 w-48 bg-blue-100 dark:bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.5em] mt-3">Toque para realizar Check-in...</p>
                </div>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-all" />
          </div>
        </Card>
      ) : (
        <div className="glass-panel border-green-500/20 p-6 flex justify-between items-center group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl rounded-full"></div>
          <div className="flex items-center space-x-5 z-10">
            <div className="w-12 h-12 border border-green-500/30 flex items-center justify-center">
              <Icons.Shield className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Check-in Confirmado</p>
              <p className="text-lg font-bold tracking-tight uppercase text-white">Studio Península</p>
            </div>
          </div>
          <div className="text-right z-10">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ENTRADA</p>
            <p className="text-xl font-bold">{user.checkInTime || '14:30'}</p>
          </div>
        </div>
      )}

      {/* 2.5. SISTEMA FLEX IDENTITY */}
      <Card variant="flat" className="relative overflow-hidden group border-blue-100 dark:border-white/5 bg-white dark:bg-slate-900/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="p-8 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.3em] mb-2 block">
                Metodologia Exclusiva
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">
                Sistema <span className="text-yellow-500">Flex</span>
              </h2>
            </div>
            <Icons.Star className="w-6 h-6 text-yellow-500 opacity-50" />
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-lg">
            Acompanhamento multiprofissional para desenvolver todas as suas capacidades físicas.
            Estabilidade, mobilidade, força e bem-estar em um só lugar.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Treinos Personalizados</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Avaliação Constante</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Saúde Integral</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Equipe Multidisciplinar</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. HERO PROTOCOL - TYPOGRAPHIC BRUTALISM */}
      <div className="relative group overflow-hidden animate-slide-up">
        <Card variant="flat" className="relative h-[280px] border-white/5 hover:border-white/10 transition-all p-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[20s]"
            alt="Workout"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent"></div>

          <div className="absolute top-8 right-8 flex flex-col items-end">
            <span className="text-[9px] font-bold text-blue-500 tracking-[0.3em]">SEU TREINO</span>
            <div className="text-2xl font-bold mt-1">A2 // 04</div>
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-6xl font-extrabold tracking-tighter leading-none text-white overflow-hidden">
                <span className="block translate-y-2 group-hover:translate-y-0 transition-transform duration-500">MEMBROS</span>
                <span className="block text-blue-600 translate-y-3 group-hover:translate-y-0 transition-transform duration-700 delay-75">SUPERIORES</span>
              </h2>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center">
                <span className="w-3 h-0.5 bg-blue-600 mr-2"></span>
                Foco Hipertrofia
              </p>
              <div className="flex items-center text-xs font-bold">
                <Icons.Clock className="w-4 h-4 mr-2 text-blue-500" /> 55:00
              </div>
            </div>

            <button
              onClick={() => onStartSession?.()}
              disabled={!user.isCheckedIn}
              className={`h-16 w-full relative group/btn overflow-hidden transition-all duration-500 ${!user.isCheckedIn ? 'opacity-30' : 'hover:scale-[1.02]'}`}
            >
              <div className="absolute inset-0 bg-blue-600 flex items-center justify-center group-hover/btn:bg-blue-500 transition-colors">
                <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white">Começar Treino</span>
              </div>
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
            </button>
          </div>
        </Card>
      </div>

      {/* 4. PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Frequência', val: '85', unit: '%', icon: Icons.TrendingUp, color: 'text-green-500', trend: 'Regular' },
          { label: 'Volume Total', val: '1.4', unit: 'ton', icon: Icons.Chart, color: 'text-blue-500', trend: 'Alto' }
        ].map((m, i) => (
          <Card key={i} variant="flat" className="p-6 border-blue-100 dark:border-white/5 hover:bg-blue-50/50 dark:hover:bg-white/[0.02] transition-colors relative group">
            <div className="absolute top-4 right-4 text-[8px] font-black text-slate-600 tracking-widest">{m.trend}</div>
            <div className="space-y-6">
              <div className="w-10 h-10 border border-white/5 flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:border-white/20 transition-all">
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{m.label}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{m.val}</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">{m.unit}</span>
                </div>
              </div>
              <div className="w-full h-[1px] bg-white/5 relative">
                <div className={`absolute top-0 left-0 h-full ${i === 0 ? 'w-[85%] bg-green-500' : 'w-[65%] bg-blue-600'} shadow-[0_0_10px_currentColor]`}></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 5. NEXT EXPERIENCE */}
      <button
        onClick={onGoWellness}
        className="w-full group relative overflow-hidden h-24 border border-blue-100 dark:border-white/10 hover:border-blue-500/30 transition-all active:scale-[0.99]"
      >
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-white/[0.02] group-hover:bg-blue-600/5 transition-colors"></div>
        <div className="flex items-center px-8 h-full justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-blue-600 transition-all">
              <Icons.Leaf className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-1 leading-none">Relaxamento</p>
              <h4 className="text-xl font-bold tracking-tight uppercase text-app dark:text-white leading-none">Reservar Wellness</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold text-slate-500 tracking-[0.1em] uppercase">Créditos //</span>
            <p className="text-sm font-bold text-app dark:text-white">01 Disponível</p>
          </div>
        </div>
      </button>
    </div>
  );

  const renderPersonalHome = () => (
    <div className="animate-in fade-in duration-1000 space-y-8 px-6 pb-24 pt-10">
      <header className="space-y-2">
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] leading-none opacity-50">Área do Treinador</p>
        <h2 className="text-5xl font-bold tracking-tight uppercase">Prof. <span className="text-blue-600">{user.name.split(' ')[0]}</span></h2>
      </header>

      {/* LIVE STUDIO STATUS */}
      <Card variant="flat" className="p-8 border-blue-100 dark:border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-end mb-10 relative z-10 border-b border-blue-100 dark:border-white/5 pb-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Visão do Studio // Península</h4>
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-green-500 animate-pulse shadow-[0_0_10px_#22C55E]"></div>
              <p className="text-2xl font-bold uppercase">ALUNOS TREINANDO: <span className="text-app dark:text-white">06</span></p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Eficiência</span>
            <p className="text-2xl font-bold text-blue-500 leading-none mt-1">98.4%</p>
          </div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-14 h-14 rounded-sm border-[3px] border-app bg-card overflow-hidden hover:translate-y-[-4px] transition-transform">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student_${i + 10}`} className="w-full h-full object-cover grayscale" alt="Aluno" />
              </div>
            ))}
            <div className="w-14 h-14 border-[3px] border-app bg-blue-600 flex items-center justify-center text-xs font-bold shadow-xl">
              +2
            </div>
          </div>
          <div className="p-4 border border-app bg-card">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ocupação</p>
            <p className="text-xs font-bold uppercase mt-1">Normal</p>
          </div>
        </div>
      </Card>

      {/* STRATEGIC METRICS */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="blue" className="p-8 h-48 border-none relative group overflow-hidden bg-blue-600">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Icons.Chart className="w-32 h-32" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Treinos Hoje</p>
            <div>
              <div className="flex items-baseline space-x-2">
                <h4 className="text-7xl font-bold tracking-tight leading-none text-white">18</h4>
                <span className="text-xs font-bold uppercase text-white/40">/ 20</span>
              </div>
              <div className="mt-6 flex h-[2px] w-full bg-white/20">
                <div className="h-full bg-white w-[90%] shadow-[0_0_10px_white]"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="flat" className="p-8 h-48 border-blue-100 dark:border-white/10 hover:bg-blue-50/50 dark:hover:bg-white/[0.02] transition-all group">
          <div className="h-full flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em]">Satisfação (NPS)</p>
            <div>
              <h4 className="text-6xl font-bold tracking-tight text-app dark:text-white">9.9</h4>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-4">+0.2 da média</p>
            </div>
          </div>
        </Card>
      </div>

      {/* OPERATIONAL QUEUE */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-blue-100 dark:border-white/5 pb-4">
          <h4 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.4em]">Próximos Alunos</h4>
          <button
            onClick={onGoAgenda}
            className="group flex items-center text-[10px] font-bold text-blue-500 uppercase tracking-widest"
          >
            Agenda Completa
            <Icons.ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-3">
          {['Augusto Silva', 'Maria Fernanda', 'Rafael Lima'].map((student, idx) => (
            <Card key={idx} variant="flat" className="p-6 border-blue-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20 transition-all flex items-center justify-between group active:scale-[0.99]">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 border border-white/10 group-hover:border-blue-500/50 transition-all p-0.5">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={student} />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h5 className="text-lg font-bold tracking-tight uppercase">{student}</h5>
                    {idx === 0 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></div>}
                  </div>
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-2 leading-none">
                    {idx === 0 ? 'STATUS: TREINANDO // UNIDADE A1' : 'STATUS: AGUARDANDO // UNIDADE A1'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">18:00</span>
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-2">{idx === 0 ? 'Estação 1' : 'Chegou'}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-app transition-colors duration-1000">
      <div className="precision-bg min-h-screen">
        {user.role === UserRole.PERSONAL ? renderPersonalHome() : renderStudentHome()}
      </div>
    </div>
  );
};

export default Home;
