
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import { gymSchedule, availableTrainers, assessmentHistory } from '../data/scheduleData';
import ActivityCard from '../components/dashboard/ActivityCard';
import TrainerRow from '../components/dashboard/TrainerRow';
import StatWidget from '../components/dashboard/StatWidget';

interface StudentHubProps {
    user: User;
    onLogout: () => void;
    onNavigateTo: (view: string) => void;
}

const StudentHub: React.FC<StudentHubProps> = ({ user, onLogout, onNavigateTo }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'trainers'>('overview');

    // Derived state
    const nextClass = gymSchedule[0];
    const lastAssessment = assessmentHistory[assessmentHistory.length - 1];

    return (
        <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 relative pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none"></div>

            {/* Header */}
            <header className="relative z-10 px-6 pt-6 pb-8 bg-deep-blue shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 border border-white/10 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight leading-none">
                                Olá, {user.name.split(' ')[0]}
                            </h2>
                            <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">
                                Membro Exclusive
                            </p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <StatWidget
                        label="Deep Health"
                        value={lastAssessment.result.toUpperCase()}
                        subtext="Última Análise"
                        icon="Activity"
                        color="green"
                        onClick={() => onNavigateTo('wellness')}
                    />
                    <StatWidget
                        label="Próximo Treino"
                        value="HOJE"
                        subtext={nextClass.time}
                        icon="Dumbbell"
                        color="blue"
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="relative z-10 px-6 space-y-8 flex-1 overflow-y-auto no-scrollbar">

                {/* Quick Actions (Wellness Call to Action) */}
                <section>
                    <div
                        onClick={() => onNavigateTo('wellness')}
                        className="w-full p-6 glass-panel border-l-4 border-l-laser relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all"
                    >
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Wellness Day</h3>
                                <p className="text-[10px] text-blue-100/70 uppercase tracking-widest mt-1">
                                    Agende sua recuperação
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-laser/10 rounded-full flex items-center justify-center text-laser border border-laser/30">
                                <Icons.Leaf className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-laser/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </section>

                {/* Today's Schedule */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Agenda Hoje</h3>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest cursor-pointer hover:text-white">Ver Tudo</span>
                    </div>
                    <div className="space-y-3">
                        {gymSchedule.slice(0, 2).map(session => (
                            <ActivityCard key={session.id} session={session} />
                        ))}
                    </div>
                </section>

                {/* Trainers Available */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Personal Trainers</h3>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Ao Vivo</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {availableTrainers.map(trainer => (
                            <TrainerRow key={trainer.id} trainer={trainer} />
                        ))}
                    </div>
                </section>

                {/* Reports & Docs */}
                <section className="space-y-4 pb-10">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Meus Relatórios</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-panel p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <Icons.ClipboardCheck className="w-8 h-8 text-blue-500/80" />
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center">Avaliações Físicas</span>
                        </div>
                        <div className="glass-panel p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <Icons.FileText className="w-8 h-8 text-blue-500/80" />
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center">Planos de Treino</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentHub;
