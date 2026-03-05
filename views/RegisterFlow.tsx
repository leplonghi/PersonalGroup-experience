
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User, UserRole } from '../types';

interface RegisterFlowProps {
    onRegister: (email: string, password: string, userData: Partial<User>) => Promise<void>;
    onBack: () => void;
    isDarkMode: boolean;
}

type Step = 1 | 2 | 3 | 4;

const TRAINING_PREFS = ['Musculação', 'Funcional', 'Cardio', 'HIIT', 'Pilates', 'Yoga', 'Natação'];
const OBJECTIVES = ['Hipertrofia', 'Emagrecimento', 'Saúde geral', 'Performance', 'Reabilitação', 'Condicionamento'];

const RegisterFlow: React.FC<RegisterFlowProps> = ({ onRegister, onBack, isDarkMode }) => {
    const [step, setStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1 — Credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2 — Personal data
    const [name, setName] = useState('');
    const [sex, setSex] = useState<'M' | 'F' | 'NB' | ''>('');
    const [age, setAge] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

    // Step 3 — Training profile
    const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
    const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
    const [painLimitations, setPainLimitations] = useState('');

    // Step 4 — Health & terms
    const [injuryHistory, setInjuryHistory] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const togglePref = (pref: string) => {
        setSelectedPrefs(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
    };

    const toggleObjective = (obj: string) => {
        setSelectedObjectives(prev => prev.includes(obj) ? prev.filter(o => o !== obj) : [...obj, obj]);
    };

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (!email || !password) return setError('Preencha e-mail e senha.');
            if (password.length < 6) return setError('Senha deve ter ao menos 6 caracteres.');
            if (password !== confirmPassword) return setError('Senhas não conferem.');
        }
        if (step === 2) {
            if (!name.trim()) return setError('Nome é obrigatório.');
            if (!sex) return setError('Selecione o sexo.');
        }
        if (step < 4) setStep((step + 1) as Step);
    };

    const handleFinish = async () => {
        if (!acceptedTerms) return setError('Aceite os termos para continuar.');
        setIsLoading(true);
        setError('');
        try {
            const userData: Partial<User> = {
                name,
                sex: sex as 'M' | 'F' | 'NB',
                age: age ? parseInt(age) : undefined,
                whatsapp,
                trainingPreferences: selectedPrefs,
                objectives: selectedObjectives,
                painLimitations: painLimitations || undefined,
                injuryHistory: injuryHistory || undefined,
                role: UserRole.ALUNO,
                healthStatus: 'NORMAL',
            };
            await onRegister(email, password, userData);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = `w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600`;
    const labelClass = `text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block`;

    return (
        <div className="min-h-screen bg-app grain-overlay relative flex flex-col">
            <div className="precision-bg absolute inset-0 z-0 opacity-30" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-8 pt-14 pb-6">
                <button onClick={onBack} className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center">
                    <Icons.ChevronRight className="w-4 h-4 rotate-180 text-white" />
                </button>
                <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`w-8 h-1 transition-all duration-300 ${s <= step ? 'bg-blue-600' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex-1 px-8 pb-32 space-y-8 overflow-y-auto no-scrollbar">
                {/* Step 1 — Credentials */}
                {step === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <header className="border-l-4 border-blue-600 pl-5">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Passo 1 de 4</p>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Acesso</h2>
                        </header>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>E-mail</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Senha</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mín. 6 caracteres" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Confirmar Senha</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a senha" className={inputClass} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 — Personal Data */}
                {step === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <header className="border-l-4 border-blue-600 pl-5">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Passo 2 de 4</p>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Seus Dados</h2>
                        </header>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Nome completo</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Sexo</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[{ v: 'M', l: 'Masculino' }, { v: 'F', l: 'Feminino' }, { v: 'NB', l: 'Não-binário' }].map(({ v, l }) => (
                                        <button key={v} onClick={() => setSex(v as any)}
                                            className={`py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${sex === v ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Idade</label>
                                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 28" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>WhatsApp</label>
                                    <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3 — Training Profile */}
                {step === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <header className="border-l-4 border-blue-600 pl-5">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Passo 3 de 4</p>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Perfil de Treino</h2>
                        </header>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>Preferências de treino</label>
                                <div className="flex flex-wrap gap-2">
                                    {TRAINING_PREFS.map(p => (
                                        <button key={p} onClick={() => togglePref(p)}
                                            className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all ${selectedPrefs.includes(p) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'}`}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Objetivos</label>
                                <div className="flex flex-wrap gap-2">
                                    {OBJECTIVES.map(o => (
                                        <button key={o} onClick={() => toggleObjective(o)}
                                            className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all ${selectedObjectives.includes(o) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'}`}>
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Dores ou limitações físicas</label>
                                <textarea rows={3} value={painLimitations} onChange={e => setPainLimitations(e.target.value)}
                                    placeholder="Ex: dor no joelho direito, lombalgia..."
                                    className={`${inputClass} resize-none`} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4 — Health & Terms */}
                {step === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <header className="border-l-4 border-blue-600 pl-5">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Passo 4 de 4</p>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Saúde & Termos</h2>
                        </header>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>Histórico de lesões</label>
                                <textarea rows={4} value={injuryHistory} onChange={e => setInjuryHistory(e.target.value)}
                                    placeholder="Descreva lesões anteriores, cirurgias ou condições que o personal deve saber..."
                                    className={`${inputClass} resize-none`} />
                            </div>
                            <button
                                onClick={() => setAcceptedTerms(prev => !prev)}
                                className={`w-full p-4 border flex items-start space-x-3 transition-all text-left ${acceptedTerms ? 'border-blue-600 bg-blue-600/5' : 'border-slate-200 dark:border-white/10'}`}>
                                <div className={`w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${acceptedTerms ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-white/20'}`}>
                                    {acceptedTerms && <Icons.Check className="w-3 h-3 text-white" />}
                                </div>
                                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Li e aceito os termos de uso e a política de privacidade da PersonalGroup Exclusive.
                                    Autorizo o uso dos meus dados de saúde para fins de treinamento personalizado.
                                </p>
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 px-4 py-3">
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{error}</p>
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t border-white/5 z-[120]">
                <div className="max-w-md mx-auto">
                    {step < 4 ? (
                        <button onClick={handleNext}
                            className="w-full h-14 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.6em] relative overflow-hidden group transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                            <div className="absolute inset-0 bg-white/10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                            <span className="relative z-10 italic">Continuar</span>
                        </button>
                    ) : (
                        <button onClick={handleFinish} disabled={isLoading || !acceptedTerms}
                            className={`w-full h-14 font-black text-[11px] uppercase tracking-[0.6em] relative overflow-hidden group transition-all ${acceptedTerms && !isLoading ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'}`}>
                            <span className="relative z-10 italic">{isLoading ? 'Criando conta...' : 'Criar Conta'}</span>
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default RegisterFlow;
