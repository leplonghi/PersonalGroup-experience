import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { marcarExercicioSet, encerrarSessao } from '../src/services/sessionService';
import { Icons } from '../constants';
import Card from '../components/Card';
import { Info } from 'lucide-react';

export default function LiveSessionTrainer() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState<any>(null);
    const [showEndModal, setShowEndModal] = useState(false);
    const [rpe, setRpe] = useState<number>(5);
    const [nota, setNota] = useState('');

    // Weight Modal State
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
    const [weightInput, setWeightInput] = useState<string>('');

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

    const handleSetClick = (exIndex: number) => {
        if (navigator.vibrate) navigator.vibrate(20);
        setSelectedExerciseIndex(exIndex);
        setWeightInput('');
    };

    const handleConfirmWeight = async () => {
        if (selectedExerciseIndex === null || !sessionId) return;
        const peso = parseFloat(weightInput) || 0;
        await marcarExercicioSet(sessionId, selectedExerciseIndex, peso);
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        setSelectedExerciseIndex(null);
    };

    const handleQuickAdd = (amount: number) => {
        const current = parseFloat(weightInput) || 0;
        if (navigator.vibrate) navigator.vibrate(10);
        setWeightInput(Math.max(0, current + amount).toString());
    };

    const handleEndSession = async () => {
        if (!sessionId) return;
        await encerrarSessao(sessionId, rpe, nota);
        navigate('/floor-view');
    };

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-app flex flex-col items-center justify-center p-6 space-y-4">
                <Icons.Activity className="w-8 h-8 text-cobalt animate-spin" />
                <p className="text-[10px] font-black uppercase text-app-muted tracking-[0.2em]">Conectando à Sessão...</p>
            </div>
        );
    }

    // Calculate global completed sets
    let totalSets = 0;
    let doneSets = 0;

    sessionData.exercicios?.forEach((ex: any) => {
        totalSets += (ex.targetSets || 3);
        doneSets += (ex.sets?.length || 0);
    });

    const progressPercent = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

    return (
        <div className="min-h-screen bg-app flex flex-col pt-10 pb-32">
            {/* Header Sticky */}
            <div className="sticky top-0 z-40 bg-app/90 backdrop-blur-xl border-b border-app p-6 pb-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <button onClick={() => navigate('/floor-view')} className="flex items-center space-x-2 text-app-muted hover:text-app mb-2 transition-colors">
                            <Icons.ArrowLeft className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-black tracking-widest">Painel</span>
                        </button>
                        <h1 className="text-2xl font-display font-medium text-app leading-tight">
                            Treino com <br />
                            <span className="text-cobalt">{sessionData.alunoNome || 'Aluno'}</span>
                        </h1>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="inline-flex items-center space-x-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar overall */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest">Progresso Total</span>
                        <div className="text-xl font-black text-app">
                        <div className="text-xl font-black text-app">
                            <span className="text-cobalt">{doneSets}</span>
                            <span className="text-app-muted text-sm mx-1">de</span>
                            <span className="text-sm">{totalSets} concluídos</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-app">
                        <div className="h-full bg-cobalt transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Exercises Flow */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="bg-cobalt/10 border border-cobalt/30 rounded-2xl p-4 mb-2 flex items-start space-x-3 animate-pulse-slow">
                    <Info className="w-5 h-5 text-cobalt flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-app-muted leading-relaxed">
                        <strong className="text-app">Como registrar:</strong> Toque nos blocos <span className="text-cobalt bg-cobalt/10 px-1.5 py-0.5 rounded font-black uppercase tracking-wider text-[9px]">+ Set</span> abaixo para anotar os quilos (kg) que o aluno levantou logo após ele realizar a série.
                    </p>
                </div>

                <h3 className="text-[11px] font-black uppercase text-app-muted tracking-[0.2em] mb-2 flex items-center space-x-2">
                    <Icons.Activity className="w-4 h-4" />
                    <span>Bloco Atual</span>
                </h3>

                {sessionData.exercicios?.map((ex: any, idx: number) => {
                    const target = ex.targetSets || 3;
                    const done = ex.sets?.length || 0;
                    const isAllDone = done >= target;

                    return (
                        <Card key={idx} variant={isAllDone ? 'glass' : 'flat'} className={`p-5 transition-all duration-300 ${isAllDone ? 'opacity-60 border-green-500/30 bg-green-500/5' : 'border-app hover:border-cobalt/30'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`font-black uppercase tracking-wide ${isAllDone ? 'text-green-500' : 'text-app'}`}>
                                    {ex.name || ex.nome || `Exercício ${idx + 1}`}
                                </h2>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${isAllDone ? 'bg-green-500/10 text-green-500' : 'bg-surface text-app-muted'}`}>
                                    {done} de {target} concluídos
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {Array.from({ length: target }).map((_, setIdx) => {
                                    const isDone = setIdx < done;
                                    const setData = isDone ? ex.sets[setIdx] : null;

                                    return (
                                        <button
                                            key={setIdx}
                                            onClick={() => !isDone && handleSetClick(idx)}
                                            disabled={isDone}
                                            className={`py-4 rounded-[16px] flex flex-col items-center justify-center transition-all duration-300 border ${isDone
                                                ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-inner'
                                                : 'bg-surface border-app text-app-muted hover:border-cobalt/50 hover:text-cobalt active:scale-95'
                                                }`}
                                        >
                                            {isDone ? (
                                                <>
                                                    <span className="text-xl font-black leading-none mb-1">{setData?.carga}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-green-500/70">KG</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-black uppercase tracking-widest">+ Série</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* End Session Button Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-app via-app/90 to-transparent z-20 pointer-events-none">
                <button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(20);
                        setShowEndModal(true);
                    }}
                    className="w-full h-16 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-red-500 rounded-full flex items-center justify-center space-x-3 pointer-events-auto shadow-lg backdrop-blur-md transition-all active:scale-95"
                >
                    <Icons.Target className="w-5 h-5" />
                    <span className="font-black uppercase tracking-[0.15em] text-sm">Validar & Encerrar Treino</span>
                </button>
            </div>

            {/* Weight Input Custom Bottom Sheet / Modal */}
            {selectedExerciseIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-cobalt/10 flex items-center justify-center border border-cobalt/20">
                                <Icons.Activity className="w-5 h-5 text-cobalt" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-medium text-app leading-none">Carga</h3>
                                <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1">
                                    {sessionData?.exercicios?.[selectedExerciseIndex]?.name || 'Exercício'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8 py-4">
                            <div className="flex items-center justify-center space-x-4">
                                <button onClick={() => handleQuickAdd(-5)} className="w-12 h-12 rounded-full border border-app flex items-center justify-center text-app hover:text-red-400 hover:border-red-400/50 transition-all active:scale-90 font-black text-lg">-5</button>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={weightInput}
                                        onChange={(e) => setWeightInput(e.target.value)}
                                        className="w-32 bg-transparent text-center text-6xl font-black text-app tracking-tighter focus:outline-none placeholder:text-app-muted/20"
                                        placeholder="0"
                                        autoFocus
                                    />
                                    <span className="absolute -right-4 bottom-2 text-xs font-black text-cobalt uppercase tracking-widest">KG</span>
                                </div>
                                <button onClick={() => handleQuickAdd(5)} className="w-12 h-12 rounded-full border border-cobalt/30 bg-cobalt/5 flex items-center justify-center text-cobalt hover:bg-cobalt/20 transition-all active:scale-90 font-black text-lg">+5</button>
                            </div>

                            <div className="flex justify-center gap-3">
                                {[10, 20, 50].map(val => (
                                    <button onClick={() => handleQuickAdd(val)} key={val} className="px-5 py-2.5 rounded-full bg-surface border border-app text-[10px] font-black uppercase text-app-muted tracking-widest hover:border-cobalt/30 hover:text-cobalt active:scale-95 transition-all shadow-sm">
                                        +{val}kg
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-8">
                            <button
                                onClick={() => setSelectedExerciseIndex(null)}
                                className="flex-[0.8] py-4 rounded-xl border border-app text-app-muted font-black text-xs uppercase tracking-wider hover:bg-surface transition-colors active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmWeight}
                                className="flex-1 py-4 rounded-xl bg-cobalt text-white font-black text-xs uppercase tracking-wider shadow-[0_5px_20px_rgba(37,99,235,0.4)] hover:bg-sky active:scale-95 transition-all text-center flex items-center justify-center space-x-2"
                            >
                                <span>Salvar Série</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* End Modal - Premium Glassmorphism */}
            {showEndModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                    <div className="bg-surface/90 backdrop-blur-xl rounded-[32px] w-full max-w-sm overflow-hidden p-8 border border-white/10 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">

                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <Icons.Zap className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-medium text-app leading-none">Review do Treino</h3>
                                <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1">Como o aluno se saiu?</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* RPE Selector */}
                            <div>
                                <label className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-app-muted mb-3">
                                    <span>Esforço (RPE)</span>
                                    <span className={rpe >= 8 ? 'text-red-500' : 'text-cobalt'}>{rpe}/10</span>
                                </label>
                                <div className="flex justify-between items-end h-16 gap-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => {
                                        // Dynamic color logic
                                        const isSelected = rpe === v;
                                        let baseColor = 'bg-surface border-app';
                                        let selectedColor = 'bg-cobalt border-cobalt shadow-[0_0_10px_#2563EB]';

                                        if (v >= 8) selectedColor = 'bg-red-500 border-red-500 shadow-[0_0_10px_#ef4444]';
                                        else if (v >= 5) selectedColor = 'bg-amber-500 border-amber-500 shadow-[0_0_10px_#f59e0b]';

                                        // Height calculation for visual scale
                                        const height = `${30 + (v * 7)}%`;

                                        return (
                                            <button
                                                key={v}
                                                onClick={() => setRpe(v)}
                                                style={{ height }}
                                                className={`flex-1 rounded-t-lg font-black text-[10px] transition-all duration-300 border-x border-t flex items-start justify-center pt-2 ${isSelected ? `${selectedColor} text-white` : `${baseColor} text-app-muted hover:bg-surface/80`}`}
                                            >
                                                {v}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-app-muted tracking-[0.2em]">
                                    <span>Leve</span>
                                    <span>Moderado</span>
                                    <span className="text-red-500/70">Máximo</span>
                                </div>
                            </div>

                            {/* Internal Note */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-app-muted mb-3">
                                    Insight Interno (Private)
                                </label>
                                <textarea
                                    value={nota}
                                    onChange={e => setNota(e.target.value)}
                                    className="w-full bg-app/50 border border-app rounded-2xl p-4 text-sm font-medium text-app focus:ring-1 focus:ring-cobalt focus:border-cobalt focus:outline-none transition-all placeholder:text-app-muted/50 resize-none h-24"
                                    placeholder="Anotações técnicas para a próxima sessão..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 mt-8">
                            <button
                                onClick={() => setShowEndModal(false)}
                                className="flex-[0.8] py-4 rounded-xl border border-app text-app-muted font-black text-xs uppercase tracking-wider hover:bg-surface transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleEndSession}
                                className="flex-1 py-4 rounded-xl bg-cobalt text-white font-black text-xs uppercase tracking-wider shadow-[0_5px_20px_rgba(37,99,235,0.4)] hover:bg-sky active:scale-95 transition-all text-center"
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
