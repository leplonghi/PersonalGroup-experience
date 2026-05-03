import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface RankingProps {
    user: User;
    onBack: () => void;
}

interface RankedUser {
    id: string;
    name: string;
    avatar?: string;
    sessions: number;
    streak: number;
    score: number;
    isHighlight?: boolean;
}

// Mock ranking data — transforming to "Destaques"
const mockRanking: RankedUser[] = [
    { id: '1', name: 'Marina Costa', sessions: 24, streak: 12, score: 980, isHighlight: true },
    { id: '2', name: 'Rafael Mendes', sessions: 22, streak: 10, score: 920, isHighlight: true },
    { id: '3', name: 'Ana Beatriz', sessions: 21, streak: 15, score: 910, isHighlight: true },
    { id: '4', name: 'Lucas Ferreira', sessions: 20, streak: 8, score: 870, isHighlight: true },
    { id: '5', name: 'Juliana Ribeiro', sessions: 19, streak: 7, score: 840, isHighlight: true },
    { id: '6', name: 'Pedro Oliveira', sessions: 18, streak: 9, score: 810 },
    { id: '7', name: 'Camila Souza', sessions: 17, streak: 6, score: 780 },
    { id: '8', name: 'Thiago Alves', sessions: 16, streak: 5, score: 740 },
    { id: '9', name: 'Isabela Martins', sessions: 15, streak: 11, score: 720 },
    { id: '10', name: 'Gabriel Santos', sessions: 14, streak: 4, score: 690 },
];

const Ranking: React.FC<RankingProps> = ({ user, onBack }) => {
    const [period, setPeriod] = useState<'month' | 'year'>('month');
    const [myStats, setMyStats] = useState({ sessions: 0, status: 'Ativo' });

    useEffect(() => {
        // Simular stats do usuário
        setMyStats({ sessions: 12, status: 'Habitual' });
    }, [user.name, period]);

    const highlights = mockRanking.filter(r => r.isHighlight);
    const others = mockRanking.filter(r => !r.isHighlight);

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Mural da Constância</h1>
                    <p className="text-[9px] text-pg-cobalt font-black uppercase tracking-[0.4em] mt-0.5">Comunidade em Movimento</p>
                </div>
                <div className="w-10" />
            </div>

            {/* Your Status Summary */}
            <div className="bg-gradient-to-r from-pg-cobalt/20 to-pg-midnight/10 border border-pg-cobalt/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Icons.Activity className="w-12 h-12 text-pg-cobalt" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-pg-cobalt uppercase tracking-[0.2em]">Sua Jornada</p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Constância {myStats.status}</h3>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">{myStats.sessions} sessões realizadas no período</p>
                    </div>
                </div>
            </div>

            {/* Period Toggle */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                {(['month', 'year'] as const).map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${period === p ? 'bg-pg-cobalt/20 text-pg-cobalt shadow-lg' : 'text-slate-500'
                            }`}
                    >
                        {p === 'month' ? 'Este Mês' : 'Este Ano'}
                    </button>
                ))}
            </div>

            {/* Highlights Section */}
            <section className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-[1px] bg-pg-cobalt"></div>
                    <h4 className="text-[10px] font-black text-pg-cobalt uppercase tracking-[0.2em]">Destaques em Foco</h4>
                    <Icons.Sparkles className="w-3 h-3 text-pg-cobalt animate-pulse" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    {highlights.map(r => (
                        <div key={r.id} className="glass-panel p-4 border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent rounded-xl flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full border border-pg-cobalt/30 p-0.5 mb-3">
                                <div className="w-full h-full rounded-full bg-pg-midnight flex items-center justify-center text-pg-cobalt font-bold">
                                    {r.name.charAt(0)}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-1">{r.name.split(' ')[0]}</p>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-pg-cobalt/10 border border-pg-cobalt/20 rounded-full">
                                <span className="text-[8px] font-black text-pg-cobalt uppercase tracking-tighter">{r.sessions} SESSÕES</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Community List */}
            <section className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Comunidade PG</h4>
                <div className="space-y-2">
                    {others.map((r) => (
                        <div key={r.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 group hover:bg-white/[0.08] transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-pg-cobalt transition-colors font-bold text-sm">
                                    {r.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{r.name}</p>
                                    <p className="text-[8px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">{r.sessions} sessões concluídas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-pg-cobalt tabular-nums">{r.score}</p>
                                    <p className="text-[6px] text-slate-500 font-bold uppercase tracking-tighter">pts ativação</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Rewards Info */}
            <div className="glass-panel border-pg-cobalt/20 bg-pg-cobalt/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <Icons.Gift className="w-5 h-5 text-pg-cobalt" />
                    <p className="text-[10px] font-black text-pg-cobalt uppercase tracking-[0.2em]">Recompensas & Reconhecimento</p>
                </div>
                <p className="text-[9px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                    Seus pontos de ativação não servem para competir, mas para celebrar! A Personal Group oferece brindes e benefícios exclusivos para alunos que mantêm a constância. 
                    <br/><br/>
                    <span className="text-pg-cobalt font-bold">Confira as premiações vigentes na recepção da sua unidade.</span>
                </p>
            </div>
        </div>
    );
};

export default Ranking;
