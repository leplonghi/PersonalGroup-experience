import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import ActivityCard from '../components/dashboard/ActivityCard';
import TrainerRow from '../components/dashboard/TrainerRow';
import StatWidget from '../components/dashboard/StatWidget';
import { gymSchedule, trainerAvailability } from '../data/scheduleData';

interface StudentHubProps {
    user: User;
    onLogout: () => void;
    onNavigateTo: (view: string) => void;
}

type ScheduleFilter = 'Hoje' | 'Amanhã' | 'Todos';

const FILTERS: ScheduleFilter[] = ['Hoje', 'Amanhã', 'Todos'];

const StudentHub: React.FC<StudentHubProps> = ({ user, onLogout, onNavigateTo }) => {
    const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('Hoje');

    const firstName = user.name.split(' ')[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    const filteredSessions = gymSchedule.filter(s =>
        scheduleFilter === 'Todos' ? true : s.date === scheduleFilter
    );

    const availableTrainers = trainerAvailability.filter(t => t.status === 'available').length;

    return (
        <div className="bg-app min-h-screen text-slate-900 dark:text-white font-sans pb-8 precision-bg">

            {/* ── HEADER ── */}
            <header className="px-5 pt-[calc(4rem+env(safe-area-inset-top))] pb-4 relative overflow-hidden">
                {/* ambient glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-24 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex justify-between items-start mb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">
                                {greeting}
                            </span>
                        </div>
                        <h1 className="text-[2.2rem] font-black tracking-[-0.04em] leading-none text-slate-900 dark:text-white uppercase italic">
                            {firstName}<span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                            Membro Experience · Nível 12
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigateTo('profile')}
                        className="relative group flex-shrink-0"
                        aria-label="Ir para perfil"
                    >
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 transition-all duration-300">
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg border border-midnight tracking-wider">
                            LVL 12
                        </div>
                    </button>
                </div>

                {/* XP Progress */}
                <div className="relative z-10 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Evolução PG</span>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.15em]">2.450 / 3.000 XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_12px_#2563EB80] transition-all duration-1000"
                            style={{ width: '82%' }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Elite Member</span>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">→ Black Card</span>
                    </div>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="px-5 space-y-6">

                {/* ── STAT WIDGETS ── */}
                <section>
                    <SectionHeader
                        eyebrow="Semana Atual"
                        title="Performance"
                        action="Ver Evolução"
                        onAction={() => onNavigateTo('evolution')}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <StatWidget
                            label="Frequência"
                            value="94%"
                            subtext="+2% vs mês"
                            icon="Activity"
                            trend="up"
                            color="blue"
                            onClick={() => onNavigateTo('frequency')}
                        />
                        <StatWidget
                            label="Carga Total"
                            value="18.4k"
                            subtext="+1.2k kg"
                            icon="TrendingUp"
                            trend="up"
                            color="green"
                        />
                        <StatWidget
                            label="Sessões"
                            value="6 / 8"
                            subtext="Esta semana"
                            icon="Calendar"
                            color="blue"
                            onClick={() => onNavigateTo('agenda')}
                        />
                        <StatWidget
                            label="Trainers"
                            value={`${availableTrainers} livres`}
                            subtext="Disponíveis agora"
                            icon="Users"
                            color={availableTrainers > 0 ? 'green' : 'red'}
                        />
                    </div>
                </section>

                {/* ── ACTIVE PROTOCOL CTA ── */}
                <button
                    onClick={() => onNavigateTo('training')}
                    className="w-full relative overflow-hidden rounded-[24px] p-5 flex items-center justify-between group active:scale-[0.98] transition-all duration-200 shadow-xl shadow-blue-600/15"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)' }}
                    aria-label="Protocolo Ativo"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -right-6 -bottom-6 opacity-[0.08] group-hover:scale-110 transition-transform duration-500">
                        <Icons.Dumbbell className="w-36 h-36 text-white" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Icons.Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.25em] mb-0.5">
                                Protocolo Ativo
                            </p>
                            <p className="text-lg font-black text-white uppercase italic tracking-tight leading-none">
                                Fase 02 · Hipertrofia
                            </p>
                            <p className="text-[10px] font-semibold text-blue-200/80 uppercase tracking-widest mt-1">
                                Semana 3 · 6 exercícios
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Icons.ChevronRight className="w-5 h-5 text-white" />
                    </div>
                </button>

                {/* ── GYM SCHEDULE ── */}
                <section>
                    <SectionHeader
                        eyebrow="Grade de Aulas"
                        title="Agenda"
                        action="Reservar"
                        onAction={() => onNavigateTo('agenda')}
                    />

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-4">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setScheduleFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                                    scheduleFilter === f
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-blue-500/30'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {filteredSessions.length === 0 ? (
                        <div className="glass-panel p-6 text-center">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Nenhuma aula disponível
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSessions.map(session => (
                                <ActivityCard key={session.id} session={session} />
                            ))}
                        </div>
                    )}
                </section>

                {/* ── TRAINER AVAILABILITY ── */}
                <section>
                    <SectionHeader
                        eyebrow="Personal Trainers"
                        title="Disponibilidade"
                        action="Agendar"
                        onAction={() => onNavigateTo('agenda')}
                    />
                    <div className="space-y-2">
                        {trainerAvailability.map(trainer => (
                            <TrainerRow key={trainer.id} trainer={trainer} />
                        ))}
                    </div>
                </section>

                {/* ── WELLNESS STATUS ── */}
                <section>
                    <SectionHeader
                        eyebrow="Estado de Saúde"
                        title="Wellness PG"
                        action="Ver Histórico"
                        onAction={() => onNavigateTo('wellness')}
                    />
                    <div className="glass-panel p-5 relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center relative">
                                <Icons.Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-midnight" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic leading-none">Equilibrado</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Último check-in: Hoje, 08:30</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['Sono', 'Hidratação', 'Stress'].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">{item}</p>
                                    <div className="flex justify-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(dot => (
                                            <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= (i === 1 ? 5 : 4) ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── REPORTS SECTION ── */}
                <section>
                    <SectionHeader
                        eyebrow="Relatórios Mensais"
                        title="Evolução & Planos"
                        action="Baixar PDF"
                        onAction={() => {}}
                    />
                    <div className="space-y-3">
                        <div className="glass-panel p-5 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                                    <Icons.FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Avaliação Física Março</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Disponível para leitura</p>
                                </div>
                            </div>
                            <Icons.ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        
                        <div className="glass-panel p-5 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-500">
                                    <Icons.ClipboardList className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Plano Alimentar V.2</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atualizado há 2 dias</p>
                                </div>
                            </div>
                            <Icons.ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </div>
                </section>

                {/* ── QUICK ACTIONS ── */}
                <section>
                    <SectionHeader eyebrow="Atalhos" title="Explorar" />
                    <div className="grid grid-cols-2 gap-3">
                        <QuickAction
                            icon={<Icons.Star className="w-5 h-5" />}
                            label="Arena PG"
                            desc="Status & Conexão"
                            onClick={() => onNavigateTo('experience')}
                            accent="blue"
                        />
                        <QuickAction
                            icon={<Icons.Activity className="w-5 h-5" />}
                            label="Check-in"
                            desc="Presença Digital"
                            onClick={() => onNavigateTo('checkin')}
                            accent="indigo"
                        />
                        <QuickAction
                            icon={<Icons.TrendingUp className="w-5 h-5" />}
                            label="Ranking"
                            desc="Top Membros"
                            onClick={() => onNavigateTo('ranking')}
                            accent="blue"
                        />
                        <QuickAction
                            icon={<Icons.Shield className="w-5 h-5" />}
                            label="Avaliação"
                            desc="Progresso Físico"
                            onClick={() => onNavigateTo('assessment')}
                            accent="indigo"
                        />
                    </div>
                </section>

                {/* ── LOGOUT ── */}
                <button
                    onClick={onLogout}
                    className="w-full py-4 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] active:scale-95 transition-all rounded-2xl hover:bg-red-500/5"
                >
                    Sair com Segurança
                </button>
            </div>
        </div>
    );
};

/* ── SUB-COMPONENTS ── */

interface SectionHeaderProps {
    eyebrow: string;
    title: string;
    action?: string;
    onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, action, onAction }) => (
    <div className="flex justify-between items-end mb-3 px-0.5">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">{eyebrow}</p>
            <h2 className="text-lg font-black italic uppercase tracking-tight text-slate-900 dark:text-white leading-none">{title}</h2>
        </div>
        {action && onAction && (
            <button
                onClick={onAction}
                className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] border-b border-blue-500/30 pb-0.5 hover:text-blue-400 transition-colors"
            >
                {action}
            </button>
        )}
    </div>
);

interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    desc: string;
    onClick: () => void;
    accent: 'blue' | 'indigo';
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, desc, onClick, accent }) => {
    const accentClass = accent === 'blue'
        ? 'text-blue-500 bg-blue-500/10 border-blue-500/20'
        : 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';

    return (
        <button
            onClick={onClick}
            className="p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-[20px] text-left group hover:border-blue-500/30 active:scale-95 transition-all duration-200"
            aria-label={label}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${accentClass} group-hover:scale-110 transition-transform duration-200`}>
                {icon}
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                {label}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{desc}</p>
        </button>
    );
};

export default StudentHub;
