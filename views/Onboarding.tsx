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
const semanticSteps = [
    { label: 'Boas-vindas', range: [0, 0] },
    { label: 'Seu objetivo', range: [1, 1] },
    { label: 'Sua rotina', range: [2, 5] },
    { label: 'Pronto!', range: [6, 6] }
];

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

    const handleFinish = async (skip = false) => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", user.id || user.uid || '');
            
            const updateData: any = {
                onboardingCompleto: true,
                updatedAt: new Date()
            };

            if (!skip) {
                Object.assign(updateData, {
                    preferredName: nome,
                    objetivo,
                    experiencia,
                    frequenciaSemanal: frequencia,
                    preferenciaMusical: musica,
                    limitacoes,
                });
            }

            await updateDoc(userRef, updateData);
            
            // Simulate a "Concierge processing" delay for premium feel
            setTimeout(() => {
                if (navigator.vibrate) navigator.vibrate([50, 30, 80]);
                onComplete();
                navigate('/home');
            }, skip ? 500 : 2500);
        } catch (error) {
            console.error("Erro ao salvar onboarding", error);
            if (!skip) setStep(Math.max(0, step - 1)); // fallback
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
            <header className="p-6 relative z-10 flex flex-col space-y-6 pt-10">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className={`w-10 h-10 rounded-xl bg-surface border border-app shadow-sm flex items-center justify-center text-app group transition-all hover:bg-surface/80 ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <Icons.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => handleFinish(true)}
                        className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] hover:text-cobalt transition-colors px-4 py-2"
                    >
                        Pular por agora
                    </button>
                </div>

                <div className="flex items-center justify-between px-2">
                    {semanticSteps.map((s, i) => {
                        const isActive = step >= s.range[0] && step <= s.range[1];
                        const isCompleted = step > s.range[1];
                        return (
                            <div key={i} className="flex flex-col items-center space-y-2 flex-1 relative">
                                <div className={`h-1 rounded-full transition-all duration-500 w-full px-1`}>
                                    <div className={`h-full rounded-full ${isActive ? 'bg-cobalt shadow-[0_0_10px_#2563EB]' : isCompleted ? 'bg-blue-400' : 'bg-app opacity-20'}`}></div>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors duration-500 ${isActive ? 'text-cobalt' : isCompleted ? 'text-blue-400' : 'text-app-muted opacity-40'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-32 relative z-10">
                {step === 0 && (
                    <div className="animate-reveal space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex px-3 py-1 rounded-full bg-pg-cobalt/10 text-[10px] font-black tracking-[0.2em] text-pg-cobalt uppercase border border-pg-cobalt/20">
                                Seu Momento
                            </div>
                            <h2 className="text-4xl font-display font-medium tracking-tight text-app uppercase leading-none mt-2">
                                Bem-vindo à<br />
                                <span className="text-pg-cobalt font-bold">Experiência.</span>
                            </h2>
                            <p className="text-sm font-medium text-app-muted leading-relaxed max-w-[280px]">
                                Estamos felizes em ter você aqui. Para começarmos nossa jornada, como nosso concierge deve lhe chamar?
                            </p>
                        </div>
                        <div className="pt-4 animate-scale-up" style={{ animationDelay: '0.2s' }}>
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full bg-surface/50 backdrop-blur-md border border-app rounded-pg-premium p-6 text-app text-2xl font-bold focus:outline-none focus:border-pg-cobalt/50 focus:shadow-[0_0_30px_rgba(0,182,253,0.15)] transition-all placeholder:text-app-muted/20"
                                placeholder="Seu nome ou apelido"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && nome.trim()) handleNext();
                                }}
                            />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="animate-reveal space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                O que te<br />
                                <span className="text-pg-cobalt">trouxe hoje?</span>
                            </h2>
                            <p className="text-sm font-medium text-app-muted leading-relaxed">Cada jornada na PersonalGroup é personalizada. Qual o seu foco principal?</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 pt-2">
                            {[
                                { id: 'saude', label: 'Cuidar da saúde', icon: '❤️' },
                                { id: 'condicionamento', label: 'Condicionamento', icon: '🏃' },
                                { id: 'emagrecimento', label: 'Emagrecer com saúde', icon: '⚖️' },
                                { id: 'reabilitacao', label: 'Reabilitação', icon: '🌿' },
                                { id: 'habito', label: 'Criar um hábito', icon: '✨' }
                            ].map((obj, i) => (
                                <button
                                    key={obj.id}
                                    onClick={() => handleSelection(setObjetivo, obj.id)}
                                    className={`p-5 rounded-pg-premium flex items-center space-x-4 transition-all duration-500 border animate-scale-up ${objetivo === obj.id ? 'bg-pg-cobalt border-pg-cobalt shadow-[0_10px_30px_rgba(0,182,253,0.3)] transform scale-[1.02]' : 'bg-surface/50 border-app hover:border-pg-cobalt/30'}`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <span className="text-2xl filter drop-shadow-sm">{obj.icon}</span>
                                    <span className={`text-sm font-bold uppercase tracking-wider ${objetivo === obj.id ? 'text-white' : 'text-app'}`}>{obj.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-reveal space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                Sua trajetória no<br />
                                <span className="text-pg-cobalt">Treinamento.</span>
                            </h2>
                            <p className="text-sm font-medium text-app-muted leading-relaxed">Como você se sente em relação aos exercícios hoje?</p>
                        </div>
                        <div className="space-y-3 pt-2">
                            {[
                                { id: 'iniciante', label: 'Descoberta', desc: 'Começando agora, pronto para aprender' },
                                { id: 'intermediario', label: 'Evolução', desc: 'Já tenho rotina, busco consistência' },
                                { id: 'avancado', label: 'Performance', desc: 'Foco total em resultados e técnica' }
                            ].map((exp, i) => (
                                <button
                                    key={exp.id}
                                    onClick={() => handleSelection(setExperiencia, exp.id)}
                                    className={`w-full p-6 rounded-pg-premium flex items-center justify-between transition-all duration-500 border text-left animate-scale-up ${experiencia === exp.id ? 'bg-surface border-pg-cobalt shadow-[0_10px_30px_rgba(0,182,253,0.1)]' : 'bg-transparent border-app hover:bg-surface/30'}`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div>
                                        <h4 className={`text-base font-bold uppercase tracking-wide ${experiencia === exp.id ? 'text-pg-cobalt' : 'text-app'}`}>{exp.label}</h4>
                                        <p className="text-[10px] font-medium text-app-muted uppercase tracking-widest mt-1 leading-relaxed">{exp.desc}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${experiencia === exp.id ? 'border-pg-cobalt' : 'border-app-muted/30'}`}>
                                        {experiencia === exp.id && <div className="w-3 h-3 bg-pg-cobalt rounded-full animate-scale-up"></div>}
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
                                Sua rotina<br />
                                <span className="text-cobalt">importa.</span>
                            </h2>
                            <p className="text-sm font-bold text-app-muted mb-1">Quantas vezes por semana você planeja estar conosco?</p>
                            <p className="text-[10px] font-bold text-cobalt uppercase tracking-widest animate-pulse flex items-center"><Icons.ArrowRight className="w-3 h-3 mr-1 inline" /> Toque em uma opção para avançar</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {['2 a 3x', '4x', '5x', '6x+'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => handleSelection(setFrequencia, freq)}
                                    className={`p-6 rounded-[24px] border flex flex-col items-center justify-center transition-all duration-300 ${frequencia === freq ? 'bg-cobalt border-cobalt shadow-[0_10px_20px_rgba(37,99,235,0.3)] transform scale-105' : 'bg-surface border-app hover:border-cobalt/30'}`}
                                >
                                    <span className={`text-2xl font-black ${frequencia === freq ? 'text-white' : 'text-app'}`}>{freq}</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${frequencia === freq ? 'text-white/60' : 'text-app-muted'}`}>Treinos/Semana</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                Estilo<br />
                                <span className="text-cobalt">Musical.</span>
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
                    <div className="animate-reveal space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-display font-medium tracking-tight text-app uppercase leading-none">
                                Cuidado e<br />
                                <span className="text-pg-cobalt">Bem-Estar.</span>
                            </h2>
                            <p className="text-sm font-medium text-app-muted leading-relaxed">Sua segurança é nossa prioridade. Alguma observação de saúde ou lesão que devemos saber?</p>
                        </div>
                        <div className="pt-2 animate-scale-up" style={{ animationDelay: '0.2s' }}>
                            <textarea
                                value={limitacoes}
                                onChange={e => setLimitacoes(e.target.value)}
                                className="w-full bg-surface/60 backdrop-blur-sm border border-app rounded-pg-premium p-6 text-app placeholder-app-muted/30 resize-none h-48 focus:outline-none focus:border-pg-cobalt/50 focus:shadow-[0_0_30px_rgba(0,182,253,0.1)] transition-all font-medium text-sm leading-relaxed"
                                placeholder="Conte-nos aqui. (Ex: Condromalácia, dores lombares...) ou deixe em branco se estiver tudo bem."
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
