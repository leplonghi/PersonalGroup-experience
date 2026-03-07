import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface OnboardingProps {
    user: User;
    onComplete: () => void;
}

const steps = ['Welcome', 'Objetivos', 'Frequência', 'Saúde'];

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const [nome, setNome] = useState(user.name || '');
    const [objetivo, setObjetivo] = useState<string>('');
    const [frequencia, setFrequencia] = useState<string>('');
    const [limitacoes, setLimitacoes] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            await handleFinish();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", user.id || user.uid || '');
            await updateDoc(userRef, {
                objetivo,
                frequenciaSemanal: frequencia,
                limitacoes,
                onboardingCompleto: true,
                updatedAt: new Date()
            });
            navigator.vibrate?.([50, 30, 80]);
            onComplete();
            navigate('/home');
        } catch (error) {
            console.error("Erro ao salvar onboarding", error);
        } finally {
            setLoading(false);
        }
    };

    const isNextDisabled = () => {
        if (step === 0 && !nome.trim()) return true;
        if (step === 1 && !objetivo) return true;
        if (step === 2 && !frequencia) return true;
        return loading;
    };

    return (
        <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 relative">
            {/* Header / Progress */}
            <header className="p-6 relative z-10 flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <Icons.ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-cobalt shadow-[0_0_8px_#2563EB]' : i < step ? 'w-4 bg-blue-400' : 'w-2 bg-white/10'}`}></div>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center px-6 pb-24 relative z-10">
                {step === 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-white uppercase">
                                Bem-vindo ao <br /><span className="text-cobalt">Personal Group</span>
                            </h2>
                            <p className="text-sm text-blue-200">Vamos configurar seu perfil para a melhor experiência.</p>
                        </div>
                        <div className="space-y-4 pt-4">
                            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Como gostaria de ser chamado?</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-lg focus:outline-none focus:border-cobalt/50 transition-colors"
                                placeholder="Seu nome"
                            />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-white uppercase">
                                Seu <span className="text-cobalt">Objetivo</span>
                            </h2>
                            <p className="text-sm text-blue-200">Escolha seu foco principal no momento.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {[
                                { id: 'hipertrofia', label: 'Hipertrofia', icon: '💪' },
                                { id: 'forca', label: 'Força', icon: '🏋️' },
                                { id: 'resistencia', label: 'Resistência', icon: '🏃' },
                                { id: 'emagrecimento', label: 'Emagrecimento', icon: '🔥' },
                                { id: 'saude', label: 'Saúde Geral', icon: '❤️' },
                                { id: 'mobilidade', label: 'Mobilidade', icon: '🧘' }
                            ].map((obj) => (
                                <button
                                    key={obj.id}
                                    onClick={() => setObjetivo(obj.id)}
                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${objetivo === obj.id ? 'bg-cobalt/20 border-cobalt shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <span className="text-3xl">{obj.icon}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${objetivo === obj.id ? 'text-white' : 'text-slate-400'}`}>{obj.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-white uppercase">
                                Sua <span className="text-cobalt">Frequência</span>
                            </h2>
                            <p className="text-sm text-blue-200">Quantas vezes pretende treinar por semana?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {['3x', '4x', '5x', '6x+'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => setFrequencia(freq)}
                                    className={`p-6 rounded-xl border flex items-center justify-center transition-all ${frequencia === freq ? 'bg-cobalt/20 border-cobalt shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <span className={`text-2xl font-black ${frequencia === freq ? 'text-white' : 'text-slate-400'}`}>{freq}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-white uppercase">
                                Alguma <span className="text-cobalt">Restrição?</span>
                            </h2>
                            <p className="text-sm text-blue-200">Opcional. Conte-nos sobre dores crônicas ou lesões.</p>
                        </div>
                        <div className="pt-2">
                            <textarea
                                value={limitacoes}
                                onChange={e => setLimitacoes(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 resize-none h-40 focus:outline-none focus:border-cobalt/50 transition-colors"
                                placeholder="Descreva aqui (ex: Condromalácia patelar)"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Fixes Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight via-midnight/90 to-transparent z-20">
                <button
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-black uppercase tracking-widest transition-all ${isNextDisabled() ? 'bg-slate-800 text-slate-500' : 'bg-cobalt text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500'}`}
                >
                    <span>{step === steps.length - 1 ? (loading ? 'Salvando...' : 'Concluir') : 'Avançar'}</span>
                    {!loading && <Icons.ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
