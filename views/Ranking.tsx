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
}

// Mock ranking data — in production, fetched from a leaderboard collection
const mockRanking: RankedUser[] = [
    { id: '1', name: 'Marina Costa', sessions: 24, streak: 12, score: 980 },
    { id: '2', name: 'Rafael Mendes', sessions: 22, streak: 10, score: 920 },
    { id: '3', name: 'Ana Beatriz', sessions: 21, streak: 15, score: 910 },
    { id: '4', name: 'Lucas Ferreira', sessions: 20, streak: 8, score: 870 },
    { id: '5', name: 'Juliana Ribeiro', sessions: 19, streak: 7, score: 840 },
    { id: '6', name: 'Pedro Oliveira', sessions: 18, streak: 9, score: 810 },
    { id: '7', name: 'Camila Souza', sessions: 17, streak: 6, score: 780 },
    { id: '8', name: 'Thiago Alves', sessions: 16, streak: 5, score: 740 },
    { id: '9', name: 'Isabela Martins', sessions: 15, streak: 11, score: 720 },
    { id: '10', name: 'Gabriel Santos', sessions: 14, streak: 4, score: 690 },
];

const medalColors = ['from-yellow-400 to-amber-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-amber-700'];
const medalEmoji = ['🥇', '🥈', '🥉'];

const Ranking: React.FC<RankingProps> = ({ user, onBack }) => {
    const [period, setPeriod] = useState<'month' | 'year'>('month');
    const [myStats, setMyStats] = useState({ sessions: 0, rank: 0 });

    useEffect(() => {
        // Simulate finding user's position
        const myIndex = mockRanking.findIndex(r => r.name.includes(user.name.split(' ')[0]));
        if (myIndex >= 0) {
            setMyStats({ sessions: mockRanking[myIndex].sessions, rank: myIndex + 1 });
        } else {
            setMyStats({ sessions: 12, rank: 15 });
        }
    }, [user.name, period]);

    const topThree = mockRanking.slice(0, 3);
    const rest = mockRanking.slice(3);

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest">Ranking</h1>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Leaderboard</p>
                </div>
                <div className="w-10" />
            </div>

            {/* Your Position */}
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                            {myStats.rank}º
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Sua Posição</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{myStats.sessions} sessões este mês</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-white tabular-nums">{myStats.rank}º</p>
                        <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">de {mockRanking.length + 5}</p>
                    </div>
                </div>
            </div>

            {/* Period Toggle */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                {(['month', 'year'] as const).map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${period === p ? 'bg-white/10 text-blue-400' : 'text-slate-500'
                            }`}
                    >
                        {p === 'month' ? 'Este Mês' : 'Este Ano'}
                    </button>
                ))}
            </div>

            {/* Podium — Top 3 */}
            <div className="flex items-end justify-center space-x-3 pt-4">
                {[1, 0, 2].map(idx => {
                    const r = topThree[idx];
                    if (!r) return null;
                    const isFirst = idx === 0;
                    return (
                        <div key={r.id} className="flex flex-col items-center space-y-2">
                            <span className="text-2xl">{medalEmoji[idx]}</span>
                            <div className={`${isFirst ? 'w-16 h-16' : 'w-14 h-14'} rounded-full bg-gradient-to-br ${medalColors[idx]} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                                {r.name.charAt(0)}
                            </div>
                            <p className="text-[9px] font-black text-white uppercase tracking-wider text-center max-w-[70px] truncate">{r.name.split(' ')[0]}</p>
                            <div className={`${isFirst ? 'h-24 bg-gradient-to-t from-yellow-600/30 to-yellow-400/10' : idx === 1 ? 'h-16 bg-gradient-to-t from-slate-600/20 to-slate-400/5' : 'h-12 bg-gradient-to-t from-amber-700/20 to-amber-500/5'} w-20 rounded-t-xl border border-white/10 flex flex-col items-center justify-center`}>
                                <p className="text-lg font-black text-white tabular-nums">{r.score}</p>
                                <p className="text-[6px] text-slate-400 font-bold uppercase tracking-widest">pontos</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rest of ranking */}
            <div className="space-y-2">
                {rest.map((r, idx) => (
                    <div key={r.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <span className="text-[11px] font-black text-slate-500 w-6 text-center tabular-nums">{idx + 4}</span>
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                                {r.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white">{r.name}</p>
                                <p className="text-[8px] text-slate-500">{r.sessions} sessões • {r.streak} 🔥</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-slate-400 tabular-nums">{r.score}</p>
                    </div>
                ))}
            </div>

            {/* Score Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">📊 Como funciona o Score</p>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Presença', pts: '+30 pts/sessão' },
                        { label: 'Streak', pts: '+10 pts/dia consecutivo' },
                        { label: 'Avaliação', pts: '+50 pts' },
                        { label: 'Pontualidade', pts: '+5 pts' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <div>
                                <p className="text-[8px] font-bold text-white">{item.label}</p>
                                <p className="text-[7px] text-blue-400">{item.pts}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Ranking;
