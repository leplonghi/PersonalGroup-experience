import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Protocol } from '../../types';
import Card from '../Card';
import PlanStatusBanner from '../PlanStatusBanner';
import FrequencyTracker from '../FrequencyTracker';
import AssessmentReminder from '../AssessmentReminder';
import { Icons } from '../../constants';
import { getLastTrainerSession } from '../../firebase';

interface StudentHomeProps {
    user: User;
    protocol: Protocol | null;
    loadingProtocol: boolean;
    activeStaff: User[];
    setShowBlackCard: (show: boolean) => void;
    onStartSession?: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
    user,
    protocol,
    loadingProtocol,
    activeStaff,
    setShowBlackCard,
    onStartSession,
}) => {
    const navigate = useNavigate();
    const [lastRecap, setLastRecap] = useState<any>(null);

    useEffect(() => {
        getLastTrainerSession(user.id).then(session => {
            if (session) {
                const rpe = (session as any).rpeGeral;
                const nota = (session as any).notaTrainer;
                setLastRecap({
                    title: rpe >= 8 ? 'Treino Destruído!' : 'Treino Concluído!',
                    message: nota || 'Continue assim, você está evoluindo!',
                    date: 'Recente',
                    rpe: rpe || 7
                });
            }
        }).catch(() => { /* sem sessão anterior, recap fica null */ });
    }, [user.id]);
    return (
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
                        <button onClick={() => navigate('/lounge')} className="text-xs font-bold text-app-muted uppercase tracking-[0.15em] mt-2 flex items-center hover:text-cobalt transition-colors group/status text-left">
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
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        navigate('/checkin');
                    }}
                    className="p-8 group border-l-4 border-l-cobalt hover:border-l-sky transition-all active:scale-[0.99] rounded-2xl bg-white relative overflow-hidden shadow-xl shadow-blue-900/5 dark:shadow-none cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-50 pointer-events-none"></div>
                    <div className="flex justify-between items-center relative z-10 pointer-events-none">
                        <div className="space-y-3 flex-1 pr-4">
                            <h4 className="text-xs font-black tracking-widest text-blue-900 uppercase">Acesso ao Studio</h4>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 flex-shrink-0 bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                    <Icons.QRCode className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 w-full max-w-[140px]">
                                    <p className="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-[0.15em] whitespace-nowrap">Mostrar Black Card</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Check-in na Catraca</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-cobalt text-white flex items-center justify-center transition-all flex-shrink-0 shadow-lg">
                            <Icons.ChevronRight className="w-5 h-5 pointer-events-none" />
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

            {/* Recap Pós-Treino (Spotify Wrapped style) */}
            {lastRecap && (
                <Card variant="flat" className="p-0 overflow-hidden relative group cursor-pointer border-none shadow-[0_15px_30px_rgba(37,99,235,0.15)] animate-in slide-in-from-top-4 duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-cobalt via-blue-600 to-indigo-800 z-0 group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0"></div>

                    <div className="relative z-10 p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Icons.Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Recap do Personal</span>
                            </div>
                            <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{lastRecap.date}</span>
                        </div>

                        <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-2">
                                {lastRecap.title} 💥
                            </h4>
                            <p className="text-[11px] font-bold text-blue-100 leading-relaxed max-w-[90%]">
                                "{lastRecap.message}"
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md border border-white/10">
                                <Icons.Activity className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">Pico de Esforço</p>
                                <p className="text-sm font-black text-white">Nível {lastRecap.rpe}/10</p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Assessment / PersonalDay  Reminder */}
            <AssessmentReminder user={user} />

            {/* Weekly Frequency Tracker */}
            <FrequencyTracker user={user} />

            {/* Quick Links: Admin, Ranking, Wearables, Support */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => navigate('/admin-requests')}
                    className="p-4 bg-surface border border-app rounded-2xl hover:brightness-110 hover:border-cobalt/30 transition-all text-left space-y-2 group shadow-sm"
                >
                    <div className="w-9 h-9 rounded-full bg-amber-600/10 flex items-center justify-center">
                        <Icons.FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] font-black text-app uppercase tracking-[0.1em] group-hover:text-amber-600 transition-colors">Administrativo</p>
                    <p className="text-[10px] text-app-muted font-bold uppercase tracking-widest">Solicitações</p>
                </button>
                <button
                    onClick={() => navigate('/support')}
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
                        onClick={() => navigate('/evolution')}
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
                        onClick={() => navigate('/timeline')}
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

            {/* 4.7. EXPERIÊNCIA PERSONAL GROUP (AMENIDADES) */}
            <section className="space-y-4">
                <div className="flex items-center space-x-2 px-1">
                    <Icons.Star className="w-4 h-4 text-amber-500" />
                    <h4 className="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.3em] leading-none">
                        Mimos & Amenidades
                    </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: Icons.Coffee, title: 'Cantinho do Café', desc: 'Frutas e snacks pós-treino' },
                        { icon: Icons.Droplet, title: 'Toalhas Premium', desc: 'Higienizadas de alto padrão' },
                        { icon: Icons.Shield, title: 'Terapias', desc: 'Fisio & Massagem disponíveis' },
                        { icon: Icons.MapPin, title: 'Estacionamento VIP', desc: 'Vagas cobertas e seguras' },
                    ].map((item, i) => (
                        <Card key={i} variant="flat" className="p-4 relative overflow-hidden bg-gradient-to-br from-surface to-surface border border-app hover:border-amber-400/30 transition-all group active:scale-[0.98]">
                            {/* Subtle accent glow */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-500/10 blur-[10px] rounded-full"></div>

                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                <item.icon className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h5 className="text-[10px] font-black tracking-widest uppercase text-app mb-1 relative z-10">{item.title}</h5>
                            <p className="text-[9px] font-bold text-app-muted leading-tight relative z-10">{item.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 5. NEXT EXPERIENCE */}
            <button
                onClick={() => navigate('/wellness')}
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
};
