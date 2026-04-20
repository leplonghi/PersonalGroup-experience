
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { updateUserProfile, uploadProfilePhoto } from '../firebase';
import { Icons, PRESET_AVATARS } from '../constants';

interface EditProfileProps {
    user: User;
    onBack: () => void;
    onUpdated: (updatedUser: User) => void;
}

const TRAINING_PREFS = ['Musculação', 'Funcional', 'Cardio', 'HIIT', 'Pilates', 'Yoga', 'Natação'];
const OBJECTIVES = ['Hipertrofia', 'Emagrecimento', 'Saúde geral', 'Performance', 'Reabilitação', 'Condicionamento'];
const SPECIALTIES_PERSONAL = ['Hipertrofia', 'Reabilitação', 'Performance', 'Emagrecimento', 'Funcional', 'Mobilidade', 'Powerlifting'];
const TIME_SLOTS = ['06:00-08:00', '08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

const EditProfile: React.FC<EditProfileProps> = ({ user, onBack, onUpdated }) => {
    const isPersonal = user.role !== UserRole.ALUNO;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'plan' | 'faq'>('profile');

    const [isLoading, setIsLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Common
    const [name, setName] = useState(user.name || '');
    const [whatsapp, setWhatsapp] = useState(user.whatsapp || '');
    const [photoPreview, setPhotoPreview] = useState<string>(user.photoUrl || user.avatar || '');

    // Aluno
    const [age, setAge] = useState(String(user.age || ''));
    const [sex, setSex] = useState<'M' | 'F' | 'NB' | ''>(user.sex || '');
    const [painLimitations, setPainLimitations] = useState(user.painLimitations || '');
    const [injuryHistory, setInjuryHistory] = useState(user.injuryHistory || '');
    const [selectedPrefs, setSelectedPrefs] = useState<string[]>(user.trainingPreferences || []);
    const [selectedObjectives, setSelectedObjectives] = useState<string[]>(user.objectives || []);

    // Personal
    const [bio, setBio] = useState(user.bio || '');
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(user.specialty || []);
    const [selectedHours, setSelectedHours] = useState<string[]>(user.availableHours || []);
    const [certificates, setCertificates] = useState((user.certificates || []).join('\n'));

    const toggleArr = <T,>(arr: T[], val: T): T[] =>
        arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setPhotoPreview(preview);
        setUploadingPhoto(true);
        try {
            const url = await uploadProfilePhoto(user.id, file);
            onUpdated({ ...user, photoUrl: url, avatar: url });
        } catch {
            setError('Erro ao enviar foto. Tente novamente.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return setError('Nome é obrigatório.');
        setIsLoading(true);
        setError('');
        setSuccess('');

        const data: Partial<User> = {
            name,
            whatsapp,
            photoUrl: photoPreview,
            avatar: photoPreview,
            ...(isPersonal ? {
                bio,
                specialty: selectedSpecialties,
                availableHours: selectedHours,
                certificates: certificates.split('\n').map(c => c.trim()).filter(Boolean),
            } : {
                age: age ? parseInt(age) : undefined,
                sex: sex || undefined,
                painLimitations,
                injuryHistory,
                trainingPreferences: selectedPrefs,
                objectives: selectedObjectives,
            })
        };

        try {
            await updateUserProfile(user.id, data);
            onUpdated({ ...user, ...data });
            setSuccess('Perfil atualizado com sucesso!');
            setTimeout(onBack, 1200);
        } catch {
            setError('Erro ao salvar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = `w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600`;
    const labelClass = `text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block`;

    return (
        <div className="min-h-screen bg-app grain-overlay relative flex flex-col pb-32">
            <div className="precision-bg absolute inset-0 z-0 opacity-30" />

            <div className="relative z-[100] px-8 pt-10 pb-4">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-blue-600 transition-colors">
                        <Icons.ChevronLeft className="w-6 h-6" />
                    </button>
                    {!isPersonal && (
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 translate-y-[-2px]">
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                Perfil
                            </button>
                            <button 
                                onClick={() => setActiveTab('plan')}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'plan' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                Plano
                            </button>
                            <button 
                                onClick={() => setActiveTab('faq')}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'faq' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                FAQ
                            </button>
                        </div>
                    )}
                    <div className="w-10"></div>
                </div>

                <div className="max-w-md mx-auto w-full">
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center space-y-4 pt-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-600 bg-slate-800">
                                        {photoPreview
                                            ? <img src={photoPreview} alt={name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center">
                                                <Icons.User className="w-10 h-10 text-slate-400" />
                                            </div>
                                        }
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingPhoto}
                                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 transition-opacity hover:opacity-80">
                                        {uploadingPhoto
                                            ? <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
                                            : <Icons.Plus className="w-3 h-3 text-white" />
                                        }
                                    </button>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-2">Toque para enviar foto</p>

                                {/* Default Avatars */}
                                <div className="pt-2 w-full max-w-[280px]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Ou escolha um avatar</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {PRESET_AVATARS.map((avatar, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setPhotoPreview(avatar)}
                                                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${photoPreview === avatar ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/30' : 'border-slate-800 opacity-70 hover:opacity-100 hover:scale-105 hover:border-blue-500/50'}`}
                                            >
                                                <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Forms */}
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>Nome completo</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>WhatsApp</label>
                                    <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" className={inputClass} />
                                </div>

                                {!isPersonal && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Idade</label>
                                                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="28" className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Sexo</label>
                                                <div className="flex gap-2">
                                                    {[{ v: 'M', l: 'M' }, { v: 'F', l: 'F' }, { v: 'NB', l: 'NB' }].map(({ v, l }) => (
                                                        <button key={v} onClick={() => setSex(v as any)}
                                                            className={`flex-1 py-3 border text-[10px] font-black uppercase transition-all ${sex === v ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}>
                                                            {l}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Preferências de treino</label>
                                            <div className="flex flex-wrap gap-2">
                                                {TRAINING_PREFS.map(p => (
                                                    <button key={p} onClick={() => setSelectedPrefs(prev => toggleArr(prev, p))}
                                                        className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all ${selectedPrefs.includes(p) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Dores / Limitações</label>
                                            <textarea rows={2} value={painLimitations} onChange={e => setPainLimitations(e.target.value)} className={`${inputClass} resize-none`} />
                                        </div>
                                    </>
                                )}

                                {isPersonal && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelClass}>Mini-bio</label>
                                            <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className={`${inputClass} resize-none`} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Especialidades</label>
                                            <div className="flex flex-wrap gap-2">
                                                {SPECIALTIES_PERSONAL.map(s => (
                                                    <button key={s} onClick={() => setSelectedSpecialties(prev => toggleArr(prev, s))}
                                                        className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all ${selectedSpecialties.includes(s) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'plan' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card p-8 rounded-[40px] shadow-sm">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Meu Plano</h3>
                                        <p className="text-[10px] text-cobalt font-bold uppercase tracking-widest">Premium Membership</p>
                                    </div>
                                    <div className="p-3 bg-cobalt/10 rounded-2xl text-cobalt">
                                        <Icons.CreditCard className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between py-4 border-b border-app">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Ativo</span>
                                    </div>
                                    <div className="flex justify-between py-4 border-b border-app">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</span>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">12 OUT 2026</span>
                                    </div>
                                    <div className="flex justify-between py-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</span>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">R$ 590,00 /mês</span>
                                    </div>
                                </div>

                                <button className="w-full mt-10 py-5 bg-slate-900 dark:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-slate-800 transition-all">
                                    Gerenciar Assinatura
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {[
                                { q: 'Como agendo meu wellness day?', a: 'Você pode agendar diretamente pela aba Exclusive no seu hub, uma vez por mês conforme seu plano.' },
                                { q: 'Posso mudar de personal?', a: 'Sim, entre em contato com a recepção ou solicite via chat para analisarmos a agenda.' },
                                { q: 'Como funciona o sistema de XP?', a: 'Cada treino concluído e avaliado gera XP. Suba de nível para desbloquear mimos e descontos exclusivos.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-card p-6 rounded-3xl">
                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{item.q}</p>
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <div className="mt-8 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-2xl"><p className="text-xs font-bold text-red-500 uppercase tracking-wider">{error}</p></div>}
                    {success && <div className="mt-8 bg-green-500/10 border border-green-500/30 px-4 py-3 rounded-2xl"><p className="text-xs font-bold text-green-500 uppercase tracking-wider">{success}</p></div>}
                </div>
            </div>

            {/* Footer CTA */}
            {activeTab === 'profile' && (
                <footer className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t border-white/5 z-[120]">
                    <div className="max-w-md mx-auto">
                        <button onClick={handleSave} disabled={isLoading}
                            className="w-full h-14 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.6em] relative overflow-hidden group transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-60">
                            <div className="absolute inset-0 bg-white/10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                            <span className="relative z-10 italic">{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default EditProfile;
