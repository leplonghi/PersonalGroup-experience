import React from 'react';
import { User, Protocol } from '../../types';
import Card from '../Card';
import PlanStatusBanner from '../PlanStatusBanner';
import FrequencyTracker from '../FrequencyTracker';
import AssessmentReminder from '../AssessmentReminder';
import { Icons } from '../../constants';

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
    onGoExplore
}) => {
    return (
        <div className="animate-in fade-in duration-1000 space-y-8 px-6 pb-32 pt-10">

            {/* 1. PREMIUM HEADER */}
            <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.4em] mb-2 px-1">
                            Bem-vindo de volta
                        </span>
                        <h1 className="text-5xl font-bold tracking-tight leading-none text-gradient font-display uppercase">
                            {user.name.split(' ')[0]}<span className="text-pg-cobalt">.</span>
                        </h1>
                        <button onClick={onGoClub} className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.2em] mt-3 flex items-center hover:text-pg-cobalt transition-colors group/status text-left px-1">
                            <span className="relative flex h-2 w-2 mr-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Unidade: Península
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. OPERATIONAL GATE (CHECK-IN) */}
            {!user.isCheckedIn ? (
                <Card
                    variant="glass"
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        setShowBlackCard(true);
                    }}
                    className="p-8 border-l-4 border-l-pg-cobalt shadow-lg hover:shadow-pg-cobalt/20 active:scale-[0.98]"
                >
                    <div className="flex justify-between items-center relative z-10">
                        <div className="space-y-4 flex-1">
                            <h4 className="text-[10px] font-black tracking-[0.3em] text-pg-text-muted uppercase">Acesso Digital</h4>
                            <div className="flex items-center space-x-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pg-midnight-light to-pg-midnight border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Icons.QRCode className="w-7 h-7 text-pg-cobalt drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-pg-text-main uppercase tracking-widest font-display">Meu Black Card</p>
                                    <p className="text-[9px] font-black text-pg-text-muted uppercase tracking-[0.2em] mt-1">Aproxime da Catraca</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full glass-surface border border-white/10 group-hover:bg-pg-cobalt group-hover:text-white transition-all flex items-center justify-center">
                            <Icons.ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </Card>
            ) : (
                <Card variant="glass" className="p-6 border-green-500/20 bg-green-500/5 hover:border-green-500/40">
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center space-x-5">
                            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/10">
                                <Icons.Shield className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em]">Status: Identificado</p>
                                <p className="text-xl font-bold tracking-tight uppercase text-pg-text-main font-display">Ativo no Studio</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-pg-text-muted uppercase tracking-widest">CHECK-IN</p>
                            <p className="text-2xl font-bold text-pg-cobalt font-display">{user.checkInTime || '14:30'}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Plan Expiration Warning */}
            <PlanStatusBanner user={user} />

            {/* Weekly Frequency Tracker */}
            <FrequencyTracker user={user} />

            {/* 3. DAILY WORKOUT PLAN */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3 px-1">
                    <div className="w-1.5 h-1.5 bg-pg-cobalt rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                    <h4 className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em] leading-none">
                        Agenda do Dia
                    </h4>
                </div>

                <Card variant="flat" className="relative border-white/5 p-0 overflow-hidden min-h-[380px] hover:shadow-2xl hover:shadow-pg-cobalt/10">
                    {/* Background Image Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200"
                            className="w-full h-full object-cover grayscale opacity-20 transition-transform duration-[30s] group-hover:scale-110"
                            alt="Workout"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pg-midnight via-pg-midnight/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="px-2.5 py-1 rounded bg-pg-cobalt text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-pg-cobalt/30">
                                        Treino A
                                    </span>
                                    <span className="text-[9px] font-black text-pg-cobalt uppercase tracking-[0.2em]">
                                        SUPERIOR
                                    </span>
                                </div>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tighter leading-tight font-display">
                                    Full <br />
                                    <span className="text-gradient">Power</span>
                                </h2>
                            </div>
                            <div className="text-right glass-surface p-3 rounded-2xl border border-white/10">
                                <Icons.Clock className="w-5 h-5 text-pg-cobalt mb-2 ml-auto" />
                                <p className="text-lg font-bold text-white font-display">55<span className="text-[10px] ml-1 opacity-50 uppercase">min</span></p>
                            </div>
                        </div>

                        {/* Exercise Preview List */}
                        <div className="flex-1 space-y-4 mb-8">
                             {protocol?.exercises.slice(0, 3).map((ex, i) => (
                                <div key={i} className="flex items-center justify-between glass-surface p-3.5 rounded-xl border border-white/5 hover:border-white/15 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-6 h-6 rounded-lg bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center text-[10px] font-black text-pg-cobalt">0{i+1}</div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-pg-text-main uppercase tracking-wide truncate max-w-[160px]">{ex.name}</span>
                                            <span className="text-[8px] font-black text-pg-text-muted uppercase tracking-[0.1em] mt-0.5">{ex.category || 'Força'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white px-2 py-1 bg-white/5 rounded-md border border-white/5">{ex.sets}x{ex.reps}</p>
                                    </div>
                                </div>
                             ))}
                        </div>

                        <button
                            onClick={() => onStartSession?.()}
                            disabled={!user.isCheckedIn}
                            className={`w-full h-16 bg-gradient-to-r from-pg-cobalt to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-[14px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-pg-cobalt/20 ${!user.isCheckedIn ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                        >
                            <Icons.Play className="w-5 h-5 mr-3 fill-current" />
                            {user.isCheckedIn ? 'Iniciar Sessão' : 'Check-in Pendente'}
                        </button>
                    </div>
                </Card>
            </div>

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

            {/* 4.5. EVOLUTION SUMMARY */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-1">
                    <h4 className="text-[10px] font-black text-pg-text-muted uppercase tracking-[0.3em]">
                        Performance Hub
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
