import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import Card from '../Card';
import { Icons } from '../../constants';

interface PersonalHomeProps {
    user: User;
}

export const PersonalHome: React.FC<PersonalHomeProps> = ({ user }) => {
    const navigate = useNavigate();
    return (
        <div className="animate-in fade-in duration-1000 space-y-8 px-6 pb-24 pt-[calc(4.5rem+env(safe-area-inset-top))]">
            <header className="space-y-2">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] leading-none opacity-50">Área do Treinador</p>
                <h2 className="text-4xl font-display font-medium tracking-tight uppercase text-deep-blue dark:text-white">Prof. {user.name.replace(/^Prof\.\s*/i, '').split(' ')[0]}<span className="text-cobalt">.</span></h2>
            </header>

            {/* LIVE STUDIO STATUS */}
            <Card variant="flat" className="p-8 border-blue-100 dark:border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="flex justify-between items-end mb-10 relative z-10 border-b border-blue-100 dark:border-white/5 pb-6">
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Visão do Studio // Península</h4>
                        <div className="flex items-center space-x-3">
                            <div className="w-2.5 h-2.5 bg-green-500 animate-pulse shadow-[0_0_10px_#22C55E]"></div>
                            <p className="text-2xl font-bold uppercase text-slate-900 dark:text-white">ALUNOS TREINANDO: <span className="text-cobalt dark:text-white">06</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Eficiência</span>
                        <p className="text-2xl font-bold text-cobalt leading-none mt-1">98.4%</p>
                    </div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="w-14 h-14 rounded-none border border-white/50 bg-card overflow-hidden hover:translate-y-[-2px] transition-transform shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student_${i + 10}`} className="w-full h-full object-cover grayscale" alt="Aluno" />
                            </div>
                        ))}
                        <div className="w-14 h-14 rounded-none border border-slate-300 dark:border-white/50 bg-cobalt flex items-center justify-center text-xs font-bold shadow-sm text-white">
                            +2
                        </div>
                    </div>
                    <div className="p-4 border border-x-0 border-b-0 border-t-0 sm:border-l border-slate-200 dark:border-white/10 bg-transparent text-right sm:text-left">
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Ocupação</p>
                        <p className="text-xs font-bold uppercase mt-1">Normal</p>
                    </div>
                </div>
            </Card>

            {/* STRATEGIC METRICS */}
            <div className="grid grid-cols-2 gap-4">
                <Card variant="blue" className="p-8 h-48 border-none relative group overflow-hidden bg-midnight">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                        <Icons.Chart className="w-32 h-32 text-blue-400" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Treinos Hoje</p>
                        <div>
                            <div className="flex items-baseline space-x-2">
                                <h4 className="text-6xl font-display font-medium tracking-tight leading-none text-white">18</h4>
                                <span className="text-xs font-bold uppercase text-white/40">/ 20</span>
                            </div>
                            <div className="mt-6 flex h-[1px] w-full bg-white/10">
                                <div className="h-full bg-blue-500 w-[90%] shadow-[0_0_10px_#3B82F6]"></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" className="p-8 h-48 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
                    <div className="h-full flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-[0.3em]">Satisfação (NPS)</p>
                        <div>
                            <h4 className="text-5xl font-display font-medium tracking-tight text-deep-blue dark:text-white">9.9</h4>
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-4">+0.2 da média</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* OPERATIONAL QUEUE */}
            <section className="space-y-6">
                <div className="flex justify-between items-center border-b border-blue-100 dark:border-white/5 pb-4">
                    <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-[0.4em]">Próximos Alunos</h4>
                    <button
                        onClick={() => navigate('/agenda')}
                        className="group flex items-center text-[10px] font-bold text-blue-500 uppercase tracking-widest"
                    >
                        Agenda Completa
                        <Icons.ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="space-y-3">
                    {['Augusto Silva', 'Maria Fernanda', 'Rafael Lima'].map((student, idx) => (
                        <Card key={idx} variant="flat" className="p-6 border-blue-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20 transition-all flex items-center justify-between group active:scale-[0.99]">
                            <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 rounded-none border border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 transition-all p-0 shadow-sm overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all bg-card" alt={student} />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <h5 className="text-lg font-bold tracking-tight uppercase">{student}</h5>
                                        {idx === 0 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></div>}
                                    </div>
                                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-2 leading-none">
                                        {idx === 0 ? 'STATUS: TREINANDO' : 'STATUS: AGUARDANDO'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold">18:00</span>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest mt-2">{idx === 0 ? 'Estação 1' : 'Chegou'}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};
