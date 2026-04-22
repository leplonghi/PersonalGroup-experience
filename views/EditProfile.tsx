
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

    const inputClass = `w-full bg-pg-midnight/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl shadow-inner`;
    const labelClass = `text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block`;

    return (
        <div className="min-h-screen bg-app grain-overlay relative flex flex-col pb-32">
            <div className="precision-bg absolute inset-0 z-0 opacity-30" />

            <div className="relative z-10 px-8 pt-6 pb-10 space-y-8 max-w-md mx-auto w-full">

                {/* Photo Selection Section - NEW & PREMIUM */}
                <div className="flex flex-col items-center space-y-6 pt-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-sky to-blue-400 group-hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 ring-4 ring-white dark:ring-slate-900">
                                {photoPreview
                                    ? <img src={photoPreview} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    : <div className="w-full h-full flex items-center justify-center">
                                        <Icons.User className="w-12 h-12 text-slate-500" />
                                    </div>
                                }
                            </div>
                        </div>

                        {/* Centered Upload Overlay */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPhoto}
                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploadingPhoto
                                ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <Icons.Camera className="w-6 h-6 text-white" />
                            }
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-3 w-full">
                        <div className="flex gap-2 w-full justify-center">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-blue-600/10 border border-blue-600/30 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                            >
                                <Icons.Plus className="w-3 h-3" />
                                Upload Foto
                            </button>
                            
                            {/* Option to sync from Google - simulated if photoUrl exists */}
                            {user.photoUrl && user.photoUrl !== user.avatar && (
                                <button 
                                    onClick={() => setPhotoPreview(user.photoUrl || '')}
                                    className="px-4 py-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <Icons.Activity className="w-3 h-3" />
                                    Sincronizar Google
                                </button>
                            )}
                        </div>

                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </div>

                    {/* Default Avatars */}
                    <div className="pt-4 w-full">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Expressões Wellness</p>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {PRESET_AVATARS.map((avatar, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPhotoPreview(avatar)}
                                    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-500 ${photoPreview === avatar ? 'border-blue-500 scale-125 z-10 shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20' : 'border-slate-800 opacity-60 hover:opacity-100 hover:scale-110 hover:border-blue-500/50'}`}
                                >
                                    <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                                    {photoPreview === avatar && (
                                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                            <Icons.Check className="w-4 h-4 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Common Fields */}
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Nome completo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>WhatsApp</label>
                        <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" className={inputClass} />
                    </div>
                </div>

                {/* ALUNO fields */}
                {!isPersonal && (
                    <div className="space-y-6">
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
                            <label className={labelClass}>Objetivos</label>
                            <div className="flex flex-wrap gap-2">
                                {OBJECTIVES.map(o => (
                                    <button key={o} onClick={() => setSelectedObjectives(prev => toggleArr(prev, o))}
                                        className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all ${selectedObjectives.includes(o) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>
                                        {o}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Dores / Limitações físicas</label>
                            <textarea rows={3} value={painLimitations} onChange={e => setPainLimitations(e.target.value)}
                                placeholder="Ex: dor no joelho, lombalgia..." className={`${inputClass} resize-none`} />
                        </div>
                        <div>
                            <label className={labelClass}>Histórico de lesões</label>
                            <textarea rows={3} value={injuryHistory} onChange={e => setInjuryHistory(e.target.value)}
                                placeholder="Lesões anteriores, cirurgias..." className={`${inputClass} resize-none`} />
                        </div>
                    </div>
                )}

                {/* PERSONAL fields */}
                {isPersonal && (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Mini-bio</label>
                            <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)}
                                placeholder="Conte sobre sua experiência e filosofia de treino..."
                                className={`${inputClass} resize-none`} />
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

                        <div>
                            <label className={labelClass}>Horários disponíveis</label>
                            <div className="flex flex-wrap gap-2">
                                {TIME_SLOTS.map(t => (
                                    <button key={t} onClick={() => setSelectedHours(prev => toggleArr(prev, t))}
                                        className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all ${selectedHours.includes(t) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Certificados (um por linha)</label>
                            <textarea rows={4} value={certificates} onChange={e => setCertificates(e.target.value)}
                                placeholder="Ex: CREF 000000-G/SP&#10;Especialização em Hipertrofia - 2022"
                                className={`${inputClass} resize-none`} />
                        </div>
                    </div>
                )}

                {error && <div className="bg-red-500/10 border border-red-500/30 px-4 py-3"><p className="text-xs font-bold text-red-500 uppercase tracking-wider">{error}</p></div>}
                {success && <div className="bg-green-500/10 border border-green-500/30 px-4 py-3"><p className="text-xs font-bold text-green-500 uppercase tracking-wider">{success}</p></div>}
            </div>

            {/* Footer CTA */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t border-white/5 z-[120]">
                <div className="max-w-md mx-auto">
                    <button onClick={handleSave} disabled={isLoading}
                        className="w-full h-14 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.6em] relative overflow-hidden group transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-60">
                        <div className="absolute inset-0 bg-white/10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                        <span className="relative z-10 italic">{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default EditProfile;
