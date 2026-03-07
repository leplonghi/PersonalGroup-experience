import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { subscribeAlunosPresentes } from '../src/services/sessionService';

const FloorView: React.FC = () => {
    const navigate = useNavigate();
    const [checkIns, setCheckIns] = useState<any[]>([]);

    useEffect(() => {
        const unsub = subscribeAlunosPresentes((data) => {
            setCheckIns(data);
        });
        return () => unsub();
    }, []);

    // Dividing students into groups. Since the schema may not explicitly have "emSessao", 
    // we check if they have a 'trainerNome' or 'emSessao' flag from the active session sync.
    const aguardando = checkIns.filter(c => !c.emSessao && !c.trainerNome);
    const emSessao = checkIns.filter(c => c.emSessao || c.trainerNome);

    const getEnergyColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-orange-400 text-orange-900 border-orange-400/50';
            case 'medium': return 'bg-cobalt text-blue-900 border-cobalt/50';
            case 'low': return 'bg-indigo-400 text-indigo-900 border-indigo-400/50';
            default: return 'bg-white/10 text-white border-white/20';
        }
    };

    const getEnergyIcon = (level: string) => {
        switch (level) {
            case 'high': return <Icons.Activity className="w-3 h-3 mr-1" />;
            case 'medium': return <Icons.Zap className="w-3 h-3 mr-1" />;
            case 'low': return <Icons.Moon className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    const getEnergyLabel = (level: string) => {
        switch (level) {
            case 'high': return 'Alta';
            case 'medium': return 'Normal';
            case 'low': return 'Baixa';
            default: return 'N/A';
        }
    };

    return (
        <div className="min-h-screen bg-deep-blue text-white flex flex-col font-sans relative overflow-hidden pb-24">
            {/* Background Mesh */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cobalt rounded-full blur-[150px] mix-blend-screen -translate-y-1/2 translate-x-1/3"></div>
            </div>

            <div className="pt-12 px-6 pb-6 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-cobalt/10 border border-cobalt/30 rounded-2xl flex items-center justify-center">
                            <Icons.Eye className="w-6 h-6 text-cobalt" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Visão da Pista</h1>
                            <p className="text-[10px] font-bold text-cobalt uppercase tracking-[0.2em] mt-1">{checkIns.length} alunos presentes</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="w-12 h-12 border border-white/10 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 hover:text-white transition-colors">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* AGUARDANDO ATENDIMENTO */}
                <section className="mb-10">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <h2 className="text-xs font-black text-amber-400 border border-amber-400/20 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Aguardando ({aguardando.length})</h2>
                    </div>

                    <div className="grid gap-4">
                        {aguardando.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center">
                                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Nenhum aluno aguardando</p>
                            </div>
                        ) : (
                            aguardando.map((aluno) => (
                                <div key={aluno.id} className="p-5 border-2 border-amber-400/20 bg-amber-400/5 rounded-[24px] flex flex-col transition-all hover:bg-amber-400/10 active:scale-[0.98]">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aluno.uid}`}
                                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 object-cover shrink-0"
                                            alt="Avatar"
                                        />
                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="text-lg font-bold text-white truncate">{aluno.userName || `Aluno ${aluno.uid.slice(0, 4)}`}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {aluno.energiaLevel && (
                                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center border ${getEnergyColor(aluno.energiaLevel)}`}>
                                                        {getEnergyIcon(aluno.energiaLevel)}
                                                        {getEnergyLabel(aluno.energiaLevel)}
                                                    </span>
                                                )}
                                                {aluno.limitacao && (
                                                    <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 flex items-center">
                                                        <Icons.AlertTriangle className="w-3 h-3 mr-1" />
                                                        Limitação Relatada
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/student-briefing/${aluno.uid}`)}
                                        className="w-full mt-4 h-12 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-colors shadow-lg shadow-amber-500/20"
                                    >
                                        Ver Prontuário
                                        <Icons.ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* EM SESSÃO */}
                <section>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                        <h2 className="text-xs font-black text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Em Sessão ({emSessao.length})</h2>
                    </div>

                    <div className="grid gap-4">
                        {emSessao.length === 0 ? (
                            <div className="p-8 border-[1px] border-white/5 bg-white/5 rounded-3xl text-center">
                                <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Nenhum treino em andamento</p>
                            </div>
                        ) : (
                            emSessao.map((aluno) => (
                                <div key={aluno.id} className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Icons.Check className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-white truncate">{aluno.userName || `Aluno ${aluno.uid.slice(0, 4)}`}</h3>
                                        <p className="text-[10px] text-emerald-400/70 uppercase tracking-widest font-bold mt-0.5">Com {aluno.trainerNome || 'Trainer'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FloorView;
