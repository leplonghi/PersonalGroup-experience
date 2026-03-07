
import React, { useState, useEffect } from 'react';
import { User, UserRole, Protocol } from '../types';
import Card from '../components/Card';
import PlanStatusBanner from '../components/PlanStatusBanner';
import FrequencyTracker from '../components/FrequencyTracker';
import AssessmentReminder from '../components/AssessmentReminder';
import { Icons } from '../constants';
import { getProtocolById, subscribeToActiveStaff } from '../firebase';

interface HomeProps {
  user: User;
  onStartSession?: (student?: User) => void;
  onGoWellness?: () => void;
  onGoTimeline?: () => void;
  onGoMessages?: () => void;
  onGoAgenda?: () => void;
  onGoCheckIn?: () => void;
  onGoClub?: () => void;
  onGoEvolution?: () => void;
  onGoAdmin?: () => void;
  onGoSupport?: () => void;
  onGoRanking?: () => void;
  onGoWearables?: () => void;
}

const Home: React.FC<HomeProps> = ({
  user,
  onStartSession,
  onGoWellness,
  onGoTimeline,
  onGoMessages,
  onGoAgenda,
  onGoCheckIn,
  onGoClub,
  onGoEvolution,
  onGoAdmin,
  onGoSupport,
  onGoRanking,
  onGoWearables
}) => {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loadingProtocol, setLoadingProtocol] = useState(false);
  const [activeStaff, setActiveStaff] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToActiveStaff((staff) => {
      setActiveStaff(staff);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user.currentCycle?.protocolId) {
      setLoadingProtocol(true);
      getProtocolById(user.currentCycle.protocolId)
        .then(setProtocol)
        .finally(() => setLoadingProtocol(false));
    }
  }, [user.currentCycle?.protocolId]);

  const renderStudentHome = () => (
    <div className="animate-in fade-in duration-1000 space-y-8 px-6 pb-24 pt-6">

      {/* 1. PREMIUM HEADER */}
      <div className="flex flex-col space-y-0.5 pt-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xs font-black text-app-muted uppercase tracking-[0.2em] mb-2">
              Olá, bom te ver
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-none text-app uppercase">
              {user.name.split(' ')[0]}<span className="text-cobalt">.</span>
            </h1>
            <button onClick={onGoClub} className="text-xs font-bold text-app-muted uppercase tracking-[0.15em] mt-2 flex items-center hover:text-cobalt transition-colors group/status text-left">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_#22C55E] group-hover/status:animate-ping"></span>
              Unidade: Península
            </button>
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL GATE (CHECK-IN) */}
      {!user.isCheckedIn ? (
        <Card
          variant="elevated"
          onClick={onGoCheckIn}
          className="p-8 group border-l-4 border-l-cobalt hover:border-l-sky transition-all active:scale-[0.99] rounded-2xl bg-white relative overflow-hidden shadow-xl shadow-blue-900/5 dark:shadow-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-50"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-3 flex-1 pr-4">
              <h4 className="text-xs font-black tracking-widest text-blue-900 uppercase">Check-in</h4>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex-shrink-0 bg-blue-100/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icons.QRCode className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 w-full max-w-[140px]">
                  <div className="h-3 w-full bg-blue-100 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/30 animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <p className="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-[0.15em] mt-3 whitespace-nowrap">Confirmar Presença</p>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
              <Icons.ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ) : (
        <div className="glass-panel border-green-500/20 p-6 flex justify-between items-center group overflow-hidden relative bg-green-50/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-3xl rounded-full"></div>
          <div className="flex items-center space-x-5 z-10">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Icons.Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Check-in Confirmado</p>
              <p className="text-lg font-bold tracking-tight uppercase text-slate-950">Studio Península</p>
            </div>
          </div>
          <div className="text-right z-10">
            <p className="text-xs font-black text-slate-800 dark:text-slate-400 uppercase tracking-widest">ENTRADA</p>
            <p className="text-xl font-bold text-blue-950 dark:text-white">{user.checkInTime || '14:30'}</p>
          </div>
        </div>
      )}

      {/* Plan Expiration Warning */}
      <PlanStatusBanner user={user} />

      {/* Assessment / PersonalDay  Reminder */}
      <AssessmentReminder user={user} />

      {/* Weekly Frequency Tracker */}
      <FrequencyTracker user={user} />

      {/* Quick Links: Admin, Ranking, Wearables, Support */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onGoAdmin}
          className="p-4 bg-surface border border-app rounded-2xl hover:brightness-110 hover:border-cobalt/30 transition-all text-left space-y-2 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-full bg-amber-600/10 flex items-center justify-center">
            <Icons.FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] font-black text-app uppercase tracking-[0.1em] group-hover:text-amber-600 transition-colors">Administrativo</p>
          <p className="text-[10px] text-app-muted font-bold uppercase tracking-widest">Solicitações</p>
        </button>
        <button
          onClick={onGoSupport}
          className="p-4 bg-surface border border-app rounded-2xl hover:brightness-110 hover:border-green-500/30 transition-all text-left space-y-2 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-full bg-green-600/10 flex items-center justify-center">
            <Icons.Message className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-[11px] font-black text-app uppercase tracking-[0.1em] group-hover:text-green-600 transition-colors">Suporte</p>
          <p className="text-[10px] text-app-muted font-bold uppercase tracking-widest">Central de Ajuda</p>
        </button>
      </div>

      {/* 2.5. EVOLUTION SUMMARY */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.3em]">
            Sua Evolução
          </h4>
          <button
            onClick={onGoEvolution}
            className="text-[10px] font-black text-cobalt uppercase tracking-widest hover:underline"
          >
            Ver Histórico
          </button>
        </div>
        <Card
          variant="flat"
          className="p-6 bg-gradient-to-br from-cobalt to-sky text-white border-none rounded-2xl shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Icons.TrendingUp className="w-24 h-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Icons.Activity className="w-5 h-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">Desempenho Geral</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Gordura Corporal</p>
                <p className="text-2xl font-black">12.4<span className="text-sm ml-1">%</span></p>
                <div className="flex items-center text-[10px] font-black text-green-300 mt-1 uppercase">
                  <Icons.ChevronUp className="w-3 h-3 mr-1 rotate-180" />
                  -0.8% esse mês
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Massa Muscular</p>
                <p className="text-2xl font-black">38.2<span className="text-sm ml-1">kg</span></p>
                <div className="flex items-center text-[10px] font-black text-green-300 mt-1 uppercase">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  +1.2kg esse mês
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>


      {/* 2.7. PERSONAL FLEX TEAM (LIVE) */}
      <section className="space-y-4 pt-2">
        <div className="flex justify-between items-end px-1">
          <h4 className="text-[11px] font-black text-blue-950 dark:text-slate-400 uppercase tracking-[0.3em]">
            Personal Flex // Ao Vivo
          </h4>
          <div className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black text-green-800 uppercase tracking-widest whitespace-nowrap">3 Disponíveis agora</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeStaff.length > 0 ? (
            activeStaff.map((personal, idx) => (
              <Card
                key={personal.id || idx}
                variant="flat"
                className="p-4 relative overflow-hidden border border-blue-200/50 dark:border-blue-500/20 bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900/30 dark:via-blue-950/20 dark:to-blue-950/10 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Accent Color Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${idx % 2 === 0 ? 'from-orange-400 to-orange-500' : 'from-emerald-400 to-emerald-500'}`}></div>

                <div className="space-y-3">
                  {/* Avatar */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-br ${idx % 2 === 0 ? 'from-orange-400 to-orange-500' : 'from-emerald-400 to-emerald-500'} group-hover:scale-105 transition-transform duration-300`}>
                        <img
                          src={personal.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${personal.name}&backgroundColor=dbeafe`}
                          className="w-full h-full rounded-2xl object-cover bg-white"
                          alt={personal.name}
                        />
                      </div>
                      {/* Status Dot */}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${idx % 2 === 0 ? 'bg-orange-500' : 'bg-emerald-500'} rounded-full flex items-center justify-center border-2 border-white dark:border-blue-950`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h5 className={`text-xs font-black uppercase tracking-tight text-center ${idx % 2 === 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'} leading-tight`}>
                    {personal.name.split(' ')[0]} {personal.name.split(' ').slice(-1)}
                  </h5>

                  {/* Specialty tag if available */}
                  <div className="flex items-center justify-center space-x-1.5 px-2 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50">
                    <Icons.Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-black text-blue-900 dark:text-blue-300 tracking-wide uppercase">
                      Flex Pro
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-8 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <Icons.Clock className="w-6 h-6 text-slate-500" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nenhum professor no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. DAILY WORKOUT PLAN */}
      <div className="relative group overflow-hidden animate-slide-up space-y-4">

        <div className="flex items-center space-x-4 px-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <h4 className="text-[11px] font-black text-blue-950 dark:text-slate-400 uppercase tracking-[0.3em] leading-none">
            Seu Planejamento de Hoje
          </h4>
        </div>

        <Card variant="flat" className="relative border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all p-0 overflow-hidden min-h-[360px] group-hover:shadow-2xl">
          {/* Background Image with Strong Dark Overlay for Contrast */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-[20s]"
              alt="Background"
            />
            <div className="absolute inset-0 bg-white/95 dark:bg-blue-950/90 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-100 dark:from-midnight via-transparent to-transparent opacity-80"></div>
          </div>

          <div className="relative z-10 p-8 flex flex-col h-full justify-between">

            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center py-1 px-2 rounded bg-blue-600 dark:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest shadow-[0_0_10px_#2563EB]">
                    Treino A
                  </span>
                  <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Semana 03
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  Superior <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200">Completo</span>
                </h2>
              </div>
              <div className="text-right">
                <div className="w-10 h-10 border border-slate-300 dark:border-white/20 rounded-full flex items-center justify-center text-slate-900 dark:text-white mb-1 ml-auto">
                  <Icons.Clock className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">55<span className="text-[9px] align-top ml-0.5">MIN</span></p>
              </div>
            </div>

            {/* Exercise List Preview */}
            <div className="my-6 bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center mb-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <p className="text-[9px] font-bold text-blue-700 dark:text-blue-200 uppercase tracking-widest">Sequência Principal</p>
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  {protocol ? `${protocol.exercises.length} Exercícios` : 'Carregando...'}
                </p>
              </div>
              {loadingProtocol ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-slate-200 dark:bg-white/5 rounded w-full"></div>
                  ))}
                </div>
              ) : protocol ? (
                protocol.exercises.slice(0, 4).map((ex, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold text-blue-700 dark:text-blue-300">{i + 1}</span>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider truncate max-w-[150px]">{ex.name}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-wider">{ex.sets}x {ex.reps}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-500 italic">Nenhum protocolo ativo. Consulte seu professor.</p>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => onStartSession?.()}
                disabled={!user.isCheckedIn}
                className={`flex-1 h-16 bg-cobalt hover:bg-sky text-white font-black text-[13px] uppercase tracking-[0.25em] rounded-full flex items-center justify-center transition-all shadow-[0_10px_20px_rgba(0,182,253,0.3)] group-hover:translate-y-[-2px] ${!user.isCheckedIn ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <Icons.Play className="w-4 h-4 mr-2 fill-current" />
                {user.isCheckedIn ? 'Iniciar Agora' : 'Check-in Necessário'}
              </button>
            </div>

          </div>
        </Card>
      </div>

      {/* 4. PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Frequência', val: '85', unit: '%', icon: Icons.TrendingUp, color: 'text-green-500', trend: 'Regular' },
          { label: 'Volume Total', val: '1.4', unit: 'ton', icon: Icons.Chart, color: 'text-blue-500', trend: 'Alto' }
        ].map((m, i) => (
          <Card key={i} variant="flat" className="p-6 transition-colors relative group hover:shadow-lg border-app bg-surface">
            <div className={`absolute top-4 right-4 text-[9px] font-black tracking-widest ${m.trend === 'Alto' ? 'text-cobalt' : 'text-green-600'}`}>{m.trend}</div>
            <div className="space-y-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${i === 0 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest">{m.label}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-app">{m.val}</span>
                  <span className="text-sm font-bold text-app-muted ml-1">{m.unit}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-app rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${i === 0 ? 'w-[85%] bg-green-500' : 'w-[65%] bg-cobalt'}`}></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 4.5 SUA JORNADA */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h4 className="text-[11px] font-black text-blue-950 dark:text-slate-400 uppercase tracking-[0.3em]">
            Sua Jornada
          </h4>
          <button
            onClick={onGoClub}
            className="text-[10px] font-black text-cobalt uppercase tracking-widest hover:underline"
          >
            Ver Tudo
          </button>
        </div>
        <div className="space-y-3">
          {[
            { date: 'Hoje', title: 'Treino A - Superior', trainer: 'Paulo H.', status: 'Concluído' },
            { date: 'Avaliando', title: 'Avaliação Flex', trainer: 'Sofia M.', status: 'Finalizado' },
            { date: 'Semana Passada', title: 'Treino B - Inferior', trainer: 'Carlos R.', status: 'Concluído' }
          ].map((item, idx) => (
            <Card key={idx} variant="flat" className="p-4 border-slate-200 dark:border-white/5 hover:border-cobalt/30 transition-all flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <Icons.Check className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest">{item.title}</h5>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.date} • {item.trainer}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                {item.status}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. NEXT EXPERIENCE */}
      <button
        onClick={onGoWellness}
        className="w-full group relative overflow-hidden h-24 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all active:scale-[0.99]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all"></div>
        <div className="flex items-center px-8 h-full justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-blue-600 transition-all">
              <Icons.Leaf className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.3em] mb-1 leading-none">Precisa Relaxar?</p>
              <h4 className="text-xl font-bold tracking-tight uppercase text-white leading-none">Agendar Massagem</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold text-blue-200 tracking-[0.1em] uppercase">Créditos //</span>
            <p className="text-sm font-bold text-white">01 Disponível</p>
          </div>
        </div>
      </button>
    </div>
  );

  const renderPersonalHome = () => (
    <div className="animate-in fade-in duration-1000 space-y-8 px-6 pb-24 pt-10">
      <header className="space-y-2">
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] leading-none opacity-50">Área do Treinador</p>
        <h2 className="text-4xl font-display font-medium tracking-tight uppercase text-deep-blue dark:text-white">Prof. {user.name.replace(/^Prof\.\s*/i, '').split(' ')[0]}<span className="text-cobalt">.</span></h2>
      </header>

      {/* LIVE STUDIO STATUS */}
      <Card variant="flat" className="p-8 border-blue-100 dark:border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-end mb-10 relative z-10 border-b border-blue-100 dark:border-white/5 pb-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Visão do Studio // Península</h4>
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-green-500 animate-pulse shadow-[0_0_10px_#22C55E]"></div>
              <p className="text-2xl font-bold uppercase text-slate-900 dark:text-white">ALUNOS TREINANDO: <span className="text-cobalt dark:text-white">06</span></p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Eficiência</span>
            <p className="text-2xl font-bold text-cobalt leading-none mt-1">98.4%</p>
          </div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-14 h-14 rounded-none border border-white/50 bg-card overflow-hidden hover:translate-y-[-2px] transition-transform shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student_${i + 10}`} className="w-full h-full object-cover grayscale" alt="Aluno" />
              </div>
            ))}
            <div className="w-14 h-14 rounded-none border border-slate-300 dark:border-white/50 bg-cobalt flex items-center justify-center text-xs font-bold shadow-sm text-white">
              +2
            </div>
          </div>
          <div className="p-4 border border-x-0 border-b-0 border-t-0 sm:border-l border-slate-200 dark:border-white/10 bg-transparent text-right sm:text-left">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Ocupação</p>
            <p className="text-xs font-bold uppercase mt-1">Normal</p>
          </div>
        </div>
      </Card>

      {/* STRATEGIC METRICS */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="blue" className="p-8 h-48 border-none relative group overflow-hidden bg-midnight">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
            <Icons.Chart className="w-32 h-32 text-blue-400" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Treinos Hoje</p>
            <div>
              <div className="flex items-baseline space-x-2">
                <h4 className="text-6xl font-display font-medium tracking-tight leading-none text-white">18</h4>
                <span className="text-xs font-bold uppercase text-white/40">/ 20</span>
              </div>
              <div className="mt-6 flex h-[1px] w-full bg-white/10">
                <div className="h-full bg-blue-500 w-[90%] shadow-[0_0_10px_#3B82F6]"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="flat" className="p-8 h-48 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
          <div className="h-full flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-[0.3em]">Satisfação (NPS)</p>
            <div>
              <h4 className="text-5xl font-display font-medium tracking-tight text-deep-blue dark:text-white">9.9</h4>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-4">+0.2 da média</p>
            </div>
          </div>
        </Card>
      </div>

      {/* OPERATIONAL QUEUE */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-blue-100 dark:border-white/5 pb-4">
          <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-[0.4em]">Próximos Alunos</h4>
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
                <div className="w-14 h-14 rounded-none border border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 transition-all p-0 shadow-sm overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all bg-card" alt={student} />
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
                <p className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest mt-2">{idx === 0 ? 'Estação 1' : 'Chegou'}</p>
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
