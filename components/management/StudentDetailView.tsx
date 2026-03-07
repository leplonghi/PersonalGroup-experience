import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { Icons } from '../../constants';
import { getEvolutionEntries } from '../../firebase';

export const StudentDetailView: React.FC<{
    currentUser: User;
    student: User;
    onClose: () => void;
    onStartAssessment: (student: User) => void;
    onStartCycle: (student: User) => void;
    onJoinSession: (student: User) => void;
    onViewEvolution: (student: User) => void;
}> = ({ currentUser, student, onClose, onStartAssessment, onStartCycle, onJoinSession, onViewEvolution }) => {
    const [evolutionData, setEvolutionData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const entries = await getEvolutionEntries(student.id);
                setEvolutionData(entries.reverse()); // Chronological for charts
            } catch (error) {
                console.error("Error fetching evolution:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [student.id]);

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-midnight rounded-t-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[95vh]">
                <div className="p-8 relative overflow-y-auto no-scrollbar">
                    <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors z-20">
                        <Icons.X className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center text-center mt-4">
                        <div className={`w-24 h-24 rounded-full border-4 p-1 mb-6 ${student.isCheckedIn ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-slate-200 dark:border-white/10'}`}>
                            <img src={student.avatar || student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} className="w-full h-full rounded-full" alt="Student profile" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{student.name}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">{student.role}</p>
                        {student.isCheckedIn && (
                            <div className="mt-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ativo no Studio</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Status Saúde</p>
                            <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${student.healthStatus === 'NORMAL' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase italic">{student.healthStatus || 'NORMAL'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Frequência</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase italic">3 / Semana</p>
                        </div>
                    </div>

                    {student.isCheckedIn && (
                        <div className="mt-8">
                            <button
                                onClick={() => { onClose(); onJoinSession(student); }}
                                className="w-full h-16 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center space-x-4 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                            >
                                <Icons.Play className="w-4 h-4" />
                                <span>Intervir / Acompanhar Sessão</span>
                            </button>
                        </div>
                    )}

                    {currentUser.role !== UserRole.PERSONAL ? (
                        <div className="mt-8 space-y-4">
                            <button
                                onClick={() => { onClose(); onStartAssessment(student); }}
                                className="w-full h-16 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center space-x-4 shadow-lg active:scale-95 transition-all"
                            >
                                <Icons.TrendingUp className="w-4 h-4" />
                                <span>Nova Avaliação / Biometria</span>
                            </button>
                            <button
                                onClick={() => { onClose(); onViewEvolution(student); }}
                                className="w-full h-16 bg-surface border border-app text-app font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center space-x-4 active:scale-95 transition-all"
                            >
                                <Icons.TrendingUp className="w-4 h-4" />
                                <span>Ver Evolução Completa</span>
                            </button>
                            <button
                                onClick={() => { onClose(); onStartCycle(student); }}
                                className="w-full h-16 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center space-x-4 active:scale-95 transition-all"
                            >
                                <Icons.Shield className="w-4 h-4" />
                                <span>Ajustar Ciclo de Treino</span>
                            </button>
                        </div>
                    ) : (
                        <div className="mt-10 space-y-8">
                            <header className="border-l-4 border-amber-500 pl-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Acompanhamento</h4>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Execução do Dia</h3>
                            </header>

                            <div className="space-y-4">
                                {(student.currentCycle?.blocks?.[0]?.exercises || []).map((ex, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 flex items-center justify-between group">
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{ex.name}</h4>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Série: {ex.recommendedSets}x{ex.recommendedReps}</p>
                                        </div>
                                        <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:border-amber-500 group-hover:text-amber-500 transition-all">
                                            <Icons.Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {!student.currentCycle && (
                                    <div className="py-10 text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nenhuma série prescrita.</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => alert('Atendimento Finalizado')}
                                className="w-full h-16 bg-amber-500 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center space-x-4 shadow-lg active:scale-95 transition-all"
                            >
                                <Icons.Check className="w-4 h-4" />
                                <span>Encerrar Sessão</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="h-12 shrink-0"></div>
            </div>
        </div>
    );
};
