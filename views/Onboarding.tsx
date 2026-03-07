import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Icons } from '../constants';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface OnboardingProps {
    user: User;
    onComplete: () => void;
}

const steps = ['Welcome', 'Objetivos', 'Experiência', 'Frequência', 'Vibe', 'Saúde', 'Preparando'];

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    // Form State
    const [nome, setNome] = useState(user.name?.split(' ')[0] || '');
    const [objetivo, setObjetivo] = useState<string>('');
    const [experiencia, setExperiencia] = useState<string>('');
    const [frequencia, setFrequencia] = useState<string>('');
    const [musica, setMusica] = useState<string>('');
    const [limitacoes, setLimitacoes] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Auto-advance on Final Step
    useEffect(() => {
        if (step === steps.length - 1) {
            handleFinish();
        }
    }, [step]);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        }
    };

    const handleSelection = (setter: any, value: any) => {
        if (navigator.vibrate) navigator.vibrate(20);
        setter(value);
        setTimeout(() => handleNext(), 350);
    };

    const handleBack = () => {
        if (step > 0 && step < steps.length - 1) setStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", user.id || user.uid || '');
            await updateDoc(userRef, {
                preferredName: nome,
                objetivo,
                experiencia,
                frequenciaSemanal: frequencia,
                preferenciaMusical: musica,
                limitacoes,
                onboardingCompleto: true,
                updatedAt: new Date()
            });
            // Simulate a "Concierge processing" delay for premium feel
            setTimeout(() => {
                if (navigator.vibrate) navigator.vibrate([50, 30, 80]);
                onComplete();
                navigate('/home');
            }, 2500);
        } catch (error) {
            console.error("Erro ao salvar onboarding", error);
            setStep(step - 1); // fallback
            setLoading(false);
        }
    };

    const isNextDisabled = () => {
        if (step === 0 && !nome.trim()) return true;
        if (step === 1 && !objetivo) return true;
        if (step === 2 && !experiencia) return true;
        if (step === 3 && !frequencia) return true;
        if (step === 4 && !musica) return true;
        return loading;
    };

    if (step === steps.length - 1) {
        return (
            <div className="min-h-screen bg-app flex flex-col items-center justify-center p-6 transition-colors duration-1000 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10 blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-1000">
                    <div className="w-24 h-24 rounded-full border border-blue-500/30 flex items-center justify-center relative bg-surface shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                        <Icons.LogoSymbol className="w-10 h-10 object-contain animate-pulse opacity-80" />
                        {/* Orbiting spinner */}
                        <div className="absolute inset-[-4px] border-2 border-transparent border-t-blue-500 border-l-blue-400 rounded-full animate-spin"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-medium text-app uppercase tracking-widest mb-2">
                            Preparando <span className="text-cobalt">o Studio</span>
                        </h2>
                        <p className="text-sm text-app-muted font-bold tracking-wider">Ajustando sua Experiência Personal Group...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app flex flex-col transition-colors duration-700 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-20"></div>

            {/* Header / Progress */}
            <header className="p-6 relative z-10 flex items-center justify-between pt-10">
                <button
                    onClick={handleBack}
                    className={`w-12 h-12 rounded-full bg-surface border border-app shadow-sm flex items-center justify-center text-app group transition-all hover:bg-surface/80 ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <Icons.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex space-x-1.5 p-1 bg-surface border border-app rounded-full">
                    {steps.slice(0, steps.length - 1).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-cobalt shadow-[0_0_10px_#2563EB]' : i < step ? 'w-4 bg-blue-400' : 'w-2 bg-app opacity-20'}`}></div>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-32 relative z-10">
                {step === 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        <div className="space-y-3">
                            <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 text-[10px] font-black tracking-[0.2em] text-cobalt uppercase border border-blue-500/20">
                                Passo 1
                            </span>
                            <h2 className="text-4xl font-display font-medium tracking-tight text-app uppercase leading-none mt-2">
                                Prazer em<br />
                                <span className="text-cobalt">Conhecer.</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted">Estamos honrados em ter você na Personal Group. Como o nosso Concierge deve lhe chamar?</p>
                        </div>
                        <div className="pt-4">
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full bg-surface/50 backdrop-blur-md border border-app rounded-[24px] p-6 text-app text-2xl font-bold focus:outline-none focus:border-cobalt/50 focus:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all placeholder:text-app-muted/30"
                                placeholder="Seu nome ou apelido"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && nome.trim()) handleNext();
                                }}
                            />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                Qual a sua<br />
                                <span className="text-cobalt">Missão?</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted mb-1">Nosso Sistema Flex é guiado por métricas. Escolha seu objetivo principal.</p>
                            <p className="text-[10px] font-bold text-cobalt uppercase tracking-widest animate-pulse flex items-center"><Icons.ArrowRight className="w-3 h-3 mr-1 inline" /> Toque em uma opção para avançar</p>
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
                                    onClick={() => handleSelection(setObjetivo, obj.id)}
                                    className={`p-5 rounded-[20px] flex flex-col items-center justify-center space-y-3 transition-all duration-300 border ${objetivo === obj.id ? 'bg-cobalt border-cobalt shadow-[0_10px_20px_rgba(37,99,235,0.3)] transform scale-105' : 'bg-surface border-app hover:border-cobalt/30'}`}
                                >
                                    <span className="text-3xl filter drop-shadow-sm">{obj.icon}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${objetivo === obj.id ? 'text-white' : 'text-app'}`}>{obj.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                E a sua<br />
                                <span className="text-cobalt">Bagagem?</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted mb-1">Como você avalia sua experiência com treinamento físico?</p>
                            <p className="text-[10px] font-bold text-cobalt uppercase tracking-widest animate-pulse flex items-center"><Icons.ArrowRight className="w-3 h-3 mr-1 inline" /> Toque em uma opção para avançar</p>
                        </div>
                        <div className="space-y-3 pt-2">
                            {[
                                { id: 'iniciante', label: 'Iniciante', desc: 'Preciso de orientação do zero' },
                                { id: 'intermediario', label: 'Intermediário', desc: 'Já treino, mas sem consistência' },
                                { id: 'avancado', label: 'Avançado', desc: 'Treino regrado, busco alta performance' }
                            ].map((exp) => (
                                <button
                                    key={exp.id}
                                    onClick={() => handleSelection(setExperiencia, exp.id)}
                                    className={`w-full p-5 rounded-[24px] flex items-center justify-between transition-all duration-300 border text-left ${experiencia === exp.id ? 'bg-surface border-cobalt shadow-[0_10px_20px_rgba(37,99,235,0.1)]' : 'bg-transparent border-app hover:bg-surface/50'}`}
                                >
                                    <div>
                                        <h4 className={`text-base font-black uppercase tracking-wide ${experiencia === exp.id ? 'text-cobalt' : 'text-app'}`}>{exp.label}</h4>
                                        <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1">{exp.desc}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${experiencia === exp.id ? 'border-cobalt' : 'border-app-muted'}`}>
                                        {experiencia === exp.id && <div className="w-3 h-3 bg-cobalt rounded-full"></div>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                Ritual na<br />
                                <span className="text-cobalt">Península.</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted mb-1">Quantos dias na semana sua agenda permite foco total?</p>
                            <p className="text-[10px] font-bold text-cobalt uppercase tracking-widest animate-pulse flex items-center"><Icons.ArrowRight className="w-3 h-3 mr-1 inline" /> Toque em uma opção para avançar</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {['2 a 3x', '4x', '5x', '6x+'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => handleSelection(setFrequencia, freq)}
                                    className={`p-6 rounded-[24px] border flex items-center justify-center transition-all duration-300 ${frequencia === freq ? 'bg-cobalt border-cobalt shadow-[0_10px_20px_rgba(37,99,235,0.3)] transform scale-105' : 'bg-surface border-app hover:border-cobalt/30'}`}
                                >
                                    <span className={`text-2xl font-black ${frequencia === freq ? 'text-white' : 'text-app'}`}>{freq}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                A Sua<br />
                                <span className="text-cobalt">Vibe Musical.</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted mb-1">Nossos horários são curados. Qual estilo te leva além da falha?</p>
                            <p className="text-[10px] font-bold text-cobalt uppercase tracking-widest animate-pulse flex items-center"><Icons.ArrowRight className="w-3 h-3 mr-1 inline" /> Toque em uma opção para avançar</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {[
                                { id: 'eletronica', label: 'Eletrônica' },
                                { id: 'rock', label: 'Rock/Metal' },
                                { id: 'hiphop', label: 'Hip-Hop/Rap' },
                                { id: 'pop', label: 'Pop/Hits' },
                                { id: 'brasilidades', label: 'Brasilidades' },
                                { id: 'indiferente', label: 'Tanto faz' }
                            ].map((music) => (
                                <button
                                    key={music.id}
                                    onClick={() => handleSelection(setMusica, music.id)}
                                    className={`p-4 rounded-[20px] flex items-center justify-center transition-all border ${musica === music.id ? 'bg-surface border-cobalt shadow-[0_0_15px_rgba(37,99,235,0.1)] text-cobalt' : 'bg-transparent border-app hover:bg-surface/50 text-app'}`}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest">{music.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                Cuidado e<br />
                                <span className="text-cobalt">Atenção.</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted">Confidencial. Existe alguma lesão, dor crônica ou recomendação médica?</p>
                        </div>
                        <div className="pt-2">
                            <textarea
                                value={limitacoes}
                                onChange={e => setLimitacoes(e.target.value)}
                                className="w-full bg-surface/80 border border-app rounded-[24px] p-6 text-app placeholder-app-muted/50 resize-none h-48 focus:outline-none focus:border-cobalt/50 focus:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all font-medium text-sm leading-relaxed"
                                placeholder="Conte para o seu treinador. Ex: 'Condromalácia no joelho direito' ou apenas deixe em branco se estiver 100%."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Fixes Action */}
            <div className="fixed bottom-0 left-0 right-0 p-8 pt-16 bg-gradient-to-t from-app via-app/90 to-transparent z-20 pointer-events-none">
                <button
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    className={`w-full h-16 rounded-full flex items-center justify-center space-x-3 font-black uppercase tracking-[0.2em] text-sm transition-all pointer-events-auto shadow-lg
                        ${isNextDisabled() ? 'bg-surface border border-app text-app-muted opacity-50' : 'bg-cobalt text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] hover:bg-sky active:scale-95'}`}
                >
                    <span>{step === steps.length - 2 ? 'Finalizar Curadoria' : 'Avançar'}</span>
                    {!isNextDisabled() && <Icons.ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
