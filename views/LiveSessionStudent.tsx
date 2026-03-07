import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { subscribeSessaoAtiva } from '../src/services/sessionService';

const motivacionais = [
    "Bora monstro! Nada te para hoje! 🦍",
    "Mais um set na conta, evolução garantida! 🔥",
    "Sem dor, sem glória. Pra cima! 🚀",
    "Carga lá no alto, técnica sempre perfeita! 🎯",
    "Esse esforço a mais é o que muda o jogo! 💎"
];

export default function LiveSessionStudent() {
    const { user } = useAuth();
    const [sessionData, setSessionData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const prevDoneCountRef = useRef(0);

    useEffect(() => {
        if (!user) return;
        const unsub = subscribeSessaoAtiva(user.id, (sessao) => {
            if (sessao) {
                setSessionData(sessao);

                let doneSets = 0;
                sessao.exercicios?.forEach((ex: any) => {
                    doneSets += (ex.sets?.length || 0);
                });

                // Verifica se houve novo set
                if (doneSets > prevDoneCountRef.current && prevDoneCountRef.current > 0) {
                    const msg = motivacionais[Math.floor(Math.random() * motivacionais.length)];
                    setMessage(msg);
                    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

                    setTimeout(() => {
                        setMessage('');
                    }, 4000);
                }

                prevDoneCountRef.current = doneSets;
            } else {
                setSessionData(null);
            }
        });

        return () => unsub();
    }, [user]);

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#021141] to-[#0a1628] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse border border-blue-500/20">
                    <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(0,182,253,0.5)]">🏋️</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-3">Aguardando sessão</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-[280px]">Seu trainer vai iniciar em breve. Prepare seu equipamento!</p>
            </div>
        );
    }

    let totalSets = 0;
    let doneSets = 0;

    sessionData.exercicios?.forEach((ex: any) => {
        totalSets += (ex.targetSets || 3);
        doneSets += (ex.sets?.length || 0);
    });

    const progresso = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021141] to-[#0a1628] text-white p-4 relative overflow-hidden">
            {/* Mensagem motivacional no topo aparecendo */}
            {message && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 text-center animate-in slide-in-from-top-4 fade-in duration-300">
                    {message}
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-8 mt-10">
                <div>
                    <div className="text-sm text-slate-400 mb-1">Trainer Ativo</div>
                    <h1 className="text-2xl font-bold">{sessionData.personalNome || 'Personal'}</h1>
                </div>
                <div className="inline-flex items-center space-x-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-500/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>AO VIVO</span>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-10 bg-[#1e2a4a]/30 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-slate-300 font-medium">Progresso do Treino</span>
                    <span className="text-xl font-bold text-[#00b6fd]">{doneSets} <span className="text-sm text-slate-500 font-normal">/ {totalSets} sets</span></span>
                </div>
                <div className="h-4 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-[#00b6fd] to-blue-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,182,253,0.5)]"
                        style={{ width: `${progresso}%` }}
                    />
                </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4 pb-20">
                {sessionData.exercicios?.map((ex: any, idx: number) => {
                    const target = ex.targetSets || 3;
                    const done = ex.sets?.length || 0;
                    const isCompleted = done >= target;

                    return (
                        <div
                            key={idx}
                            className={`bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border transition-colors ${isCompleted ? 'border-green-500/30' : 'border-slate-700/80'
                                }`}
                        >
                            <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
                                <span>{ex.name || ex.nome || `Exercício ${idx + 1}`}</span>
                                {isCompleted && (
                                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded">
                                        Concluído
                                    </span>
                                )}
                            </h3>

                            {/* Barras de série */}
                            <div className="flex space-x-2 mb-2">
                                {Array.from({ length: target }).map((_, setIdx) => {
                                    const isDone = setIdx < done;
                                    return (
                                        <div
                                            key={setIdx}
                                            className={`h-2.5 flex-1 rounded-full transition-colors duration-500 ease-in-out ${isDone ? 'bg-[#00b6fd] shadow-[0_0_8px_rgba(0,182,253,0.6)]' : 'bg-slate-700/70'
                                                }`}
                                        />
                                    );
                                })}
                            </div>

                            {/* Histórico do exercício logado */}
                            {done > 0 && target > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-700/40 flex space-x-3 overflow-x-auto pb-1 hide-scrollbar">
                                    {ex.sets?.map((set: any, sIdx: number) => (
                                        <div
                                            key={sIdx}
                                            className="bg-[#1e2a4a] px-3 py-2 rounded-lg whitespace-nowrap text-sm flex items-center space-x-2 border border-slate-700/50"
                                        >
                                            <span className="text-slate-400">Set {sIdx + 1}:</span>
                                            <span className="font-bold text-[#00b6fd] text-base">{set.carga}kg</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
