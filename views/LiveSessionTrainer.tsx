import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { marcarExercicioSet, encerrarSessao } from '../src/services/sessionService';
import { Check, LogOut } from 'lucide-react';

export default function LiveSessionTrainer() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState<any>(null);
    const [showEndModal, setShowEndModal] = useState(false);
    const [rpe, setRpe] = useState<number>(5);
    const [nota, setNota] = useState('');

    useEffect(() => {
        if (!sessionId) return;
        const unsub = onSnapshot(doc(db, 'sessions', sessionId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.status === 'DONE') {
                    navigate('/floor-view');
                } else {
                    setSessionData({ id: docSnap.id, ...data });
                }
            }
        });
        return () => unsub();
    }, [sessionId, navigate]);

    const handleSetClick = async (exIndex: number) => {
        const pesoString = window.prompt("Carga usada (kg):", "0");
        if (pesoString !== null) {
            const peso = parseFloat(pesoString) || 0;
            await marcarExercicioSet(sessionId!, exIndex, peso);
            if (navigator.vibrate) navigator.vibrate(30);
        }
    };

    const handleEndSession = async () => {
        if (!sessionId) return;
        await encerrarSessao(sessionId, rpe, nota);
        navigate('/floor-view');
    };

    if (!sessionData) {
        return <div className="p-4 text-white">Carregando sessão...</div>;
    }

    // Calculate global completed sets
    let totalSets = 0;
    let doneSets = 0;

    sessionData.exercicios?.forEach((ex: any) => {
        totalSets += (ex.targetSets || 3);
        doneSets += (ex.sets?.length || 0);
    });

    return (
        <div className="min-h-screen bg-[#021141] text-white p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold">{sessionData.alunoNome || 'Aluno'}</h1>
                    <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>AO VIVO</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-300">Sets totais</div>
                    <div className="text-lg font-bold">
                        <span className="text-blue-400">{doneSets}</span> / {totalSets}
                    </div>
                </div>
            </div>

            {/* Exercises */}
            <div className="space-y-4 pb-24">
                {sessionData.exercicios?.map((ex: any, idx: number) => {
                    const target = ex.targetSets || 3;
                    const done = ex.sets?.length || 0;

                    return (
                        <div key={idx} className="bg-[#1e2a4a] p-4 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-lg">{ex.name || ex.nome || `Exercício ${idx + 1}`}</h2>
                                <span className="text-sm bg-slate-800 px-2 py-1 rounded text-slate-300">
                                    {done}/{target} sets
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: target }).map((_, setIdx) => {
                                    const isDone = setIdx < done;
                                    const setData = isDone ? ex.sets[setIdx] : null;

                                    return (
                                        <button
                                            key={setIdx}
                                            onClick={() => !isDone && handleSetClick(idx)}
                                            disabled={isDone}
                                            className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${isDone
                                                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                                }`}
                                        >
                                            {isDone ? (
                                                <>
                                                    <Check className="w-5 h-5 mb-1" />
                                                    <span className="text-xs font-bold">{setData?.carga}kg</span>
                                                </>
                                            ) : (
                                                <span className="font-medium">Set {setIdx + 1}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* End Session Button Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#021141] to-transparent bg-opacity-90">
                <button
                    onClick={() => setShowEndModal(true)}
                    className="w-full bg-red-500/90 hover:bg-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Encerrar Sessão</span>
                </button>
            </div>

            {/* End Modal */}
            {showEndModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e2a4a] rounded-2xl w-full max-w-sm overflow-hidden p-6 border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-white mb-2">Finalizar Sessão</h3>
                        <p className="text-slate-300 text-sm mb-6">Avalie o desempenho de {sessionData.alunoNome || 'do aluno'}</p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-300 mb-2">RPE (Esforço 1-10)</label>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setRpe(v)}
                                        className={`py-2 rounded-lg font-bold text-center border transition-colors ${rpe === v
                                                ? 'bg-blue-500 border-blue-400 text-white'
                                                : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            <div className="text-center mt-3 text-sm font-semibold">
                                {rpe === 10 ? 'RPE 10 - Esforço Máximo 🔴' : `RPE Selecionado: ${rpe}`}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nota Interna (Trainer)</label>
                            <textarea
                                value={nota}
                                onChange={e => setNota(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-500"
                                rows={3}
                                placeholder="Observações técnicas, dores sentidas, etc."
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowEndModal(false)}
                                className="flex-[0.8] py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEndSession}
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                            >
                                Confirmar e Encerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
