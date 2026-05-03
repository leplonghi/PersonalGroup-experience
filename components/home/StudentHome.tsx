import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Protocol, Progresso } from '../../types';
import Card from '../Card';
import PlanStatusBanner from '../PlanStatusBanner';
import FrequencyTracker from '../FrequencyTracker';
import AssessmentReminder from '../AssessmentReminder';
import { Icons } from '../../constants';
import { useNavigate } from 'react-router-dom';

function saudacaoDoHorario(nome: string): string {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return `Bom dia, ${nome}. Prepare-se para o seu momento.`;
  if (hora >= 12 && hora < 18) return `Boa tarde, ${nome}. Como está o seu dia de cuidado?`;
  return `Boa noite, ${nome}. Finalizando o dia com excelência?`;
}

const HealthRingSummary: React.FC<{ value: number; max: number; color: string; label: string; icon: React.ReactNode }> = ({ value, max, color, label, icon }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2 group">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full health-ring" viewBox="0 0 44 44">
          <circle
            className="text-white/5"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="22"
            cy="22"
          />
          <circle
            className="health-ring-circle"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx="22"
            cy="22"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-[14px] font-black text-white font-display leading-none">{value}</p>
        <p className="text-[7px] font-bold text-pg-text-muted uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
};

const CartaoSequencia: React.FC<{ progresso?: Progresso }> = ({ progresso }) => {
  if (!progresso || progresso.diasSeguidos === 0) return null;
  return (
    <div className="rounded-pg-premium bg-pg-surface-dark border border-pg-cobalt/20 p-4 mb-3 animate-entrada-baixo">
      <p className="text-pg-text-muted text-[10px] font-black uppercase tracking-wider mb-1">
        Você está em sequência
      </p>
      <p className="text-3xl font-black text-pg-cobalt font-display uppercase tracking-tighter">
        {progresso.diasSeguidos} {progresso.diasSeguidos === 1 ? 'dia' : 'dias'} seguidos
      </p>
      {progresso.maiorSequencia > progresso.diasSeguidos && (
        <p className="text-pg-text-muted text-[9px] font-black uppercase tracking-widest mt-1">
          Seu recorde: {progresso.maiorSequencia} dias
        </p>
      )}
    </div>
  );
};

interface WorkoutCardProps {
  letra: string;
  nome: string;
  exercicios: number;
  duracaoMin: number;
  grupos: string[];
  ultimaVez?: Date;
  progresso: number;
  cor: string;
  onIniciar: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = (props) => {
  const diasAtras = props.ultimaVez
    ? Math.floor((Date.now() - props.ultimaVez.getTime()) / 86400000)
    : null;

  return (
    <div
      onClick={props.onIniciar}
      className="mx-4 mb-3 p-4 bg-white/5 border border-white/[0.08] rounded-2xl
                 cursor-pointer transition-all hover:bg-white/[0.09] hover:border-pg-cobalt/20
                 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3.5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center
                     text-lg font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${props.cor}, ${props.cor}88)` }}
        >
          {props.letra}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-white truncate">{props.nome}</div>
          <div className="text-xs text-pg-text-muted mt-0.5">
            {diasAtras !== null ? `Último: há ${diasAtras} dias` : 'Ainda não realizado'} ·{' '}
            {props.exercicios} exercícios · ~{props.duracaoMin} min
          </div>
          <div className="flex gap-1.5 flex-wrap mt-2">
            {props.grupos.map(g => (
              <span key={g} className="px-2 py-0.5 rounded-full bg-sky-500/25 border border-sky-500/35
                                        text-[10px] font-bold text-blue-300">
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="relative w-11 h-11 flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke="#00b6fd" strokeWidth="3.5"
              strokeDasharray="113"
              strokeDashoffset={113 - (113 * props.progresso / 100)}
              strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center
                          text-[10px] font-black text-pg-cobalt">
            {props.progresso}%
          </div>
        </div>
      </div>
    </div>
  );
};

interface StudentHomeProps {
    user: User;
    protocol: Protocol | null;
    loadingProtocol: boolean;
    activeStaff: User[];
    lastRecap: any;
    setShowBlackCard: (show: boolean) => void;
    onStartSession?: () => void;
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
    onGoExplore?: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
    user,
    protocol,
    loadingProtocol,
    activeStaff,
    lastRecap,
    setShowBlackCard,
    onStartSession,
    onGoClub,
    onGoAdmin,
    onGoSupport,
    onGoEvolution,
    onGoWellness,
    onGoCheckIn,
    onGoExplore,
    onGoMessages
}) => {
    const navigate = useNavigate();
    const recadosNaoLidos = user.recadosNaoLidos || 0;
    return (
        <div className="animate-in fade-in duration-1000 space-y-6 px-5 pb-32 pt-8 relative"
             style={{ background: 'linear-gradient(180deg, #010b2e 0%, #00060f 40%, #010e35 100%)' }}>

            {/* 1. PREMIUM HEADER */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-pg-cobalt uppercase tracking-[0.35em] mb-1">
                        Bom dia, {user.name.split(' ')[0]}.
                    </span>
                    <span className="text-sm font-bold text-white/80 tracking-tight leading-tight mb-1">
                        Prepare-se para<br/>o seu momento.
                    </span>
                    <h1 className="text-6xl font-black tracking-tighter leading-none text-pg-cobalt font-display uppercase">
                        {user.name.split(' ')[0]}<span className="text-pg-cobalt">.</span>
                    </h1>
                    <div className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.2em] mt-3 flex items-center text-left">
                        <Icons.MapPin className="w-3 h-3 mr-1.5 text-green-500" />
                        Unidade: Península
                    </div>
                </div>
                <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_20px_rgba(0,182,253,0.3)]">
                        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#010b2e]"></div>
                </div>
            </div>

            {/* NOTIFICAÇÕES DE RECADOS */}
            {recadosNaoLidos > 0 && (
                <button
                    onClick={() => onGoMessages ? onGoMessages() : navigate('/messages')}
                    className="w-full text-left px-4 py-3 rounded-pg-card bg-pg-cobalt/10 border border-pg-cobalt/30 text-[11px] font-bold uppercase tracking-widest text-pg-cobalt mb-1 animate-pulso-suave"
                >
                    📬 Você tem {recadosNaoLidos} {recadosNaoLidos === 1 ? 'recado novo' : 'recados novos'}
                </button>
            )}

            {/* CARTÃO DE SEQUÊNCIA */}
            <CartaoSequencia progresso={user.progresso} />

            {/* 1.5. LIFESTYLE DASHBOARD */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className="p-5 rounded-3xl border border-white/[0.06] relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-pg-cobalt/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="flex justify-between items-center mb-5">
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                        Lifestyle Summary
                    </h4>
                    <div className="px-3 py-1 rounded-full bg-pg-cobalt/10 border border-pg-cobalt/20">
                        <span className="text-[8px] font-black text-pg-cobalt uppercase tracking-widest">Maio 2026</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <HealthRingSummary 
                        value={user.progresso?.treinosNoMes || 0} 
                        max={20} 
                        color="#00b6fd" 
                        label="Treinos" 
                        icon={<Icons.Activity className="w-4 h-4" />} 
                    />
                    <HealthRingSummary 
                        value={user.progresso?.diasSeguidos || 0} 
                        max={7} 
                        color="#F59E0B" 
                        label="Dias Seguidos" 
                        icon={<Icons.Zap className="w-4 h-4" />} 
                    />
                    <HealthRingSummary 
                        value={(user.wellnessSessionsUsed || 0) < 2 ? 2 - (user.wellnessSessionsUsed || 0) : 0} 
                        max={2} 
                        color="#10B981" 
                        label="Wellness" 
                        icon={<Icons.Droplet className="w-4 h-4" />} 
                    />
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <span className="text-[9px] font-black text-amber-400/80 uppercase tracking-widest">Destaque: Consistência Imbatível</span>
                    </div>
                    <Icons.ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
            </motion.div>

            {/* ACESSO AO ESPAÇO PESSOAL */}
            <button
                onClick={() => navigate('/student-hub')}
                className="w-full p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all
                           border border-white/[0.06] hover:border-white/[0.12]"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
            >
                <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center">
                        <Icons.Star className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-white tracking-tight">Meu Espaço</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Agenda, treinadores e estatísticas</p>
                    </div>
                </div>
                <Icons.ChevronRight className="w-5 h-5 text-white/20" />
            </button>

            {/* 2. OPERATIONAL GATE (REGISTRAR CHEGADA) */}
            {!user.isCheckedIn ? (
                <button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onGoCheckIn ? onGoCheckIn() : navigate('/checkin');
                    }}
                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider mb-2
                               bg-gradient-to-r from-[#00b6fd] to-[#0088cc] text-white
                               shadow-[0_4px_24px_rgba(0,182,253,0.35)]
                               hover:shadow-[0_6px_32px_rgba(0,182,253,0.45)] hover:scale-[1.02]
                               active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                >
                    <Icons.QRCode className="w-5 h-5" />
                    <span>Registrar chegada na academia</span>
                    <Icons.ChevronRight className="w-4 h-4" />
                </button>
            ) : (
                <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-400 uppercase tracking-widest mb-2 w-fit animate-in zoom-in">
                    <Icons.Check className="w-4 h-4" />
                    <span>Você está na academia</span>
                </div>
            )}

            {/* Plan Expiration Warning */}
            <PlanStatusBanner user={user} />

            {/* Weekly Frequency Tracker */}
            <FrequencyTracker user={user} />

            {/* 3. AGENDA DO DIA */}
            <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-pg-cobalt rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">
                        Agenda do dia
                    </h4>
                </div>
                <button className="text-[10px] font-black text-pg-cobalt uppercase tracking-widest hover:brightness-125 transition-all">
                    Ver todos
                </button>
            </div>

            {user.currentCycle && (
                <div className="mb-4 p-4 rounded-2xl border border-white/[0.06] relative overflow-hidden"
                     style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pg-cobalt/5 blur-2xl rounded-full pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white leading-none">07:00</div>
                                <div className="text-[10px] font-bold text-white/40 mt-1">60 min</div>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <div className="text-xs font-black text-pg-cobalt uppercase tracking-wider mb-0.5">Superior</div>
                                <div className="text-sm font-bold text-white">{protocol?.name || 'Força e Performance'}</div>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trainer" alt="trainer" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white/50">Com Rafael N.</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-pg-cobalt/10 border border-pg-cobalt/20 text-[9px] font-black text-pg-cobalt uppercase tracking-wider">
                                Agendado
                            </span>
                            <Icons.Clock className="w-5 h-5 text-pg-cobalt/40" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-3 px-1 mb-3">
                <div className="w-1.5 h-1.5 bg-pg-cobalt rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">
                    Próximos treinos
                </h4>
            </div>

            <WorkoutCard
                letra="B"
                nome="Full Power B"
                exercicios={6}
                duracaoMin={50}
                grupos={['Costas', 'Bíceps']}
                ultimaVez={new Date(Date.now() - 2 * 86400000)}
                progresso={0}
                cor="#8B5CF6"
                onIniciar={() => onStartSession?.()}
            />
            <WorkoutCard
                letra="C"
                nome="Full Power C"
                exercicios={7}
                duracaoMin={60}
                grupos={['Pernas', 'Core']}
                progresso={0}
                cor="#10B981"
                onIniciar={() => onStartSession?.()}
            />

            {/* 4. RECAP PÓS TREINO (Spotify Wrapped style) */}
            {lastRecap && (
                <section className="space-y-4">
                    <div className="flex items-center space-x-3 px-1">
                        <Icons.Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <h4 className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em] leading-none">
                            Wrapped Diário
                        </h4>
                    </div>
                    <Card variant="cobalt" className="p-8 cursor-pointer relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="relative z-10 flex flex-col space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.4em]">Personal Feedback // {lastRecap.date}</span>
                                <div className="flex items-center bg-white/10 px-2 py-1 rounded-full border border-white/10">
                                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                                    <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Premium Insights</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-[1.1] mb-4 font-display">
                                    {lastRecap.title} 🚀
                                </h3>
                                <p className="text-[12px] font-bold text-white/80 leading-relaxed italic border-l-2 border-white/20 pl-4 py-1">
                                    "{lastRecap.message}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center space-x-4">
                                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                                        <Icons.Activity className="w-5 h-5 text-white" />
                                     </div>
                                     <div>
                                        <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Intensidade</p>
                                        <p className="text-lg font-bold text-white font-display">RPE {lastRecap.rpe}/10</p>
                                     </div>
                                </div>
                                <Icons.ChevronRight className="w-6 h-6 text-white/40 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Card>
                </section>
            )}

            {/* Assessment / PersonalDay Reminder */}
            <AssessmentReminder user={user} />

            {/* 4.5. INSIGHTS & TRENDS (DEEP HEALTH) */}
            <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-4"
            >
                <div className="flex justify-between items-end px-1">
                    <h4 className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em]">
                        Deep Health Insights
                    </h4>
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest flex items-center">
                        <Icons.TrendingUp className="w-3 h-3 mr-1" />
                        Trending Up
                    </span>
                </div>
                
                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                    {/* Highlight Card 1 */}
                    <div className="min-w-[280px] p-6 glass-panel border-white/5 relative overflow-hidden group glass-refraction shrink-0">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full"></div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Icons.Activity className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Resiliência Cardiovascular</span>
                        </div>
                        <h5 className="text-xl font-bold text-white uppercase tracking-tight font-display mb-2">Seu fôlego está evoluindo.</h5>
                        <p className="text-[10px] font-bold text-pg-text-muted leading-relaxed">
                            Seus batimentos em repouso caíram 4 BPM na última semana. Reflexo da consistência no treino A.
                        </p>
                    </div>

                    {/* Highlight Card 2 */}
                    <div className="min-w-[280px] p-6 glass-panel border-white/5 relative overflow-hidden group glass-refraction shrink-0">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full"></div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Icons.Zap className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Metabolismo Ativo</span>
                        </div>
                        <h5 className="text-xl font-bold text-white uppercase tracking-tight font-display mb-2">Peak Performance.</h5>
                        <p className="text-[10px] font-bold text-pg-text-muted leading-relaxed">
                            Você atingiu seu maior volume de carga histórica ontem na Remada Curvada. +15% de força.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* 4.5. EVOLUTION SUMMARY */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-1">
                    <h4 className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em]">
                        Performance
                    </h4>
                    <button
                        onClick={onGoEvolution}
                        className="text-[10px] font-black text-pg-cobalt uppercase tracking-widest hover:brightness-125"
                    >
                        Relatório Completo
                    </button>
                </div>
                <Card variant="glass" className="p-7 relative group hover:shadow-2xl transition-all">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-pg-cobalt/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10 grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                    <Icons.Target className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-[9px] font-black text-pg-text-muted uppercase tracking-widest">Gordura</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-pg-text-main font-display">12.4<span className="text-sm opacity-50 ml-0.5">%</span></p>
                                <div className="flex items-center text-[9px] font-black text-green-500 mt-1 uppercase tracking-tighter">
                                    <Icons.ChevronDown className="w-3 h-3 mr-0.5" />
                                    -0.8% drop
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 border-l border-white/5 pl-8">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Icons.Activity className="w-4 h-4 text-emerald-500" />
                                </div>
                                <p className="text-[9px] font-black text-pg-text-muted uppercase tracking-widest">Músculo</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-pg-text-main font-display">38.2<span className="text-sm opacity-50 ml-0.5">kg</span></p>
                                <div className="flex items-center text-[9px] font-black text-emerald-500 mt-1 uppercase tracking-tighter">
                                    <Icons.ChevronUp className="w-3 h-3 mr-0.5" />
                                    +1.2kg gain
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            {/* 4.6. PERSONAL FLEX TEAM (LIVE) */}
            <section className="space-y-4 pt-2">
                <div className="flex justify-between items-end px-1">
                    <h4 className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em]">
                        Team On-Duty // Live
                    </h4>
                    <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-full glass-surface border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[9px] font-black text-pg-text-main uppercase tracking-widest whitespace-nowrap">3 Personal Pro</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {activeStaff.length > 0 ? (
                        activeStaff.map((personal, idx) => (
                            <Card
                                key={personal.id || idx}
                                variant="glass"
                                className="p-5 relative overflow-hidden group hover:shadow-pg-cobalt/5"
                            >
                                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${idx % 2 === 0 ? 'from-pg-cobalt/10' : 'from-orange-500/10'} to-transparent blur-2xl`}></div>
                                <div className="space-y-4">
                                    <div className="flex justify-center relative">
                                        <div className="relative">
                                            <div className="w-[72px] h-[72px] rounded-2xl p-[2px] bg-gradient-to-tr from-pg-midnight-light to-pg-cobalt/30 transition-transform duration-500 group-hover:scale-110">
                                                <div className="w-full h-full rounded-2xl overflow-hidden bg-pg-midnight border border-white/10">
                                                    <img
                                                        src={personal.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${personal.name}`}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                        alt={personal.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pg-midnight rounded-full border-2 border-pg-midnight flex items-center justify-center p-0.5">
                                                <div className="w-full h-full bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-1">
                                        <h5 className="text-[12px] font-bold uppercase tracking-tight text-pg-text-main leading-tight font-display">
                                            {personal.name.split(' ')[0]} {personal.name.split(' ').slice(-1)}
                                        </h5>
                                        <p className="text-[8px] font-black text-pg-cobalt uppercase tracking-[0.2em]">Flex Specialist</p>
                                    </div>
                                    
                                    <button className="w-full py-2 bg-white/5 hover:bg-pg-cobalt/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-pg-text-muted hover:text-pg-cobalt transition-all border border-white/5 hover:border-pg-cobalt/30">
                                        Falar Agora
                                    </button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-2 py-10 glass-surface border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-3">
                            <Icons.Clock className="w-6 h-6 text-pg-text-muted" />
                            <p className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em]">Serviço Live Indisponível</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4.5. QUICK LINKS GRID */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onGoAdmin}
                    className="p-5 glass-surface border border-white/5 rounded-2xl hover:border-pg-cobalt/30 transition-all text-left space-y-3 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                        <Icons.FileText className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-pg-text-main uppercase tracking-tight font-display">Gestão</p>
                        <p className="text-[9px] font-black text-pg-text-muted uppercase tracking-widest mt-0.5">Admin & Pagamentos</p>
                    </div>
                </button>
                <button
                    onClick={onGoSupport}
                    className="p-5 glass-surface border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all text-left space-y-3 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Icons.Message className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-pg-text-main uppercase tracking-tight font-display">Concierge</p>
                        <p className="text-[9px] font-black text-pg-text-muted uppercase tracking-widest mt-0.5">Suporte 24/7</p>
                    </div>
                </button>
            </div>

            {/* 5. WELLNESS CTA */}
            <button
                onClick={onGoWellness}
                className="w-full relative overflow-hidden h-32 rounded-3xl group shadow-2xl transition-all active:scale-[0.98]"
            >
                 {/* Premium Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-indigo-600 to-pg-cobalt group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <div className="flex items-center px-8 h-full justify-between relative z-10">
                    <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 flex items-center justify-center glass-surface border border-white/20 rounded-2xl shadow-xl group-hover:rotate-12 transition-all">
                            <Icons.Droplet className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left space-y-1">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] leading-none mb-1.5">Momentos Off</p>
                            <h4 className="text-2xl font-bold tracking-tighter uppercase text-white leading-none font-display">Wellness <br/><span className="text-emerald-400">Experience</span></h4>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                        <Icons.ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </button>
        </div>
    );
};
