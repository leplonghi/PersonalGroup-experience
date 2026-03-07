import React, { useState } from 'react';
import { User } from '../../types';
import { Icons } from '../../constants';
import { addEvolutionEntry, uploadEvolutionPhoto } from '../../firebase';

const measureLabels: Record<string, string> = {
    peso: 'Peso (kg)',
    gordura: 'Gordura (%)',
    massaMagra: 'Massa Magra (kg)',
    cintura: 'Cintura (cm)',
    quadril: 'Quadril (cm)',
    bracoD: 'Braço D (cm)',
    bracoE: 'Braço E (cm)',
    coxaD: 'Coxa D (cm)',
    coxaE: 'Coxa E (cm)',
    peitoral: 'Peitoral (cm)',
};

interface AddEvolutionEntryProps {
    user: User;
    onSuccess: () => void;
}

export const AddEvolutionEntry: React.FC<AddEvolutionEntryProps> = ({ user, onSuccess }) => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [weight, setWeight] = useState('');
    const [fat, setFat] = useState('');
    const [lean, setLean] = useState('');
    const [measures, setMeasures] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onload = ev => setPhotoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            let photoUrl: string | undefined;
            if (photo) {
                photoUrl = await uploadEvolutionPhoto(user.id, photo, dateStr);
            }

            const numericMeasures: Record<string, number> = {};
            Object.entries(measures).forEach(([k, v]: [string, string]) => {
                if (v) numericMeasures[k] = parseFloat(v);
            });

            await addEvolutionEntry({
                userId: user.id,
                date: dateStr,
                photoUrl,
                weight: weight ? parseFloat(weight) : undefined,
                fatPercentage: fat ? parseFloat(fat) : undefined,
                leanMass: lean ? parseFloat(lean) : undefined,
                measures: Object.keys(numericMeasures).length ? numericMeasures : undefined,
                notes: notes || undefined,
            });

            onSuccess();
        } catch (err) {
            console.error('Error saving evolution:', err);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Photo Upload styled dynamically */}
            <div className="space-y-3">
                <p className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em]">📸 Foto de Progresso</p>
                <label className="block cursor-pointer">
                    {photoPreview ? (
                        <div className="relative rounded-3xl overflow-hidden border border-app shadow-lg group">
                            <img src={photoPreview} alt="Preview" className="w-full h-56 object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">Trocar foto</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-surface border-2 border-dashed border-app rounded-3xl hover:bg-surface/10 hover:border-blue-500/50 transition-all">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                <Icons.Upload className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="text-[12px] font-bold text-app-muted">Toque p/ enviar foto</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
            </div>

            {/* Core Metrics Grid styled soft & modern */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface border border-app rounded-2xl p-4 text-center space-y-2">
                    <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Peso (kg)</p>
                    <input
                        type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)}
                        className="w-full bg-transparent text-xl font-bold text-app text-center flex-1 outline-none placeholder:text-app/20"
                        placeholder="0.0"
                    />
                </div>
                <div className="bg-surface border border-app rounded-2xl p-4 text-center space-y-2">
                    <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Gordura (%)</p>
                    <input
                        type="number" step="0.1" value={fat} onChange={e => setFat(e.target.value)}
                        className="w-full bg-transparent text-xl font-bold text-app text-center flex-1 outline-none placeholder:text-app/20"
                        placeholder="0.0"
                    />
                </div>
                <div className="bg-surface border border-app rounded-2xl p-4 text-center space-y-2">
                    <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Massa M.</p>
                    <input
                        type="number" step="0.1" value={lean} onChange={e => setLean(e.target.value)}
                        className="w-full bg-transparent text-xl font-bold text-app text-center flex-1 outline-none placeholder:text-app/20"
                        placeholder="0.0"
                    />
                </div>
            </div>

            {/* Circular/Body Measurements */}
            <div className="space-y-3">
                <p className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em]">📏 Circunferências</p>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(measureLabels).filter(([k]) => !['peso', 'gordura', 'massaMagra'].includes(k)).map(([key, label]) => (
                        <div key={key} className="flex justify-between items-center bg-surface border border-app rounded-2xl p-3">
                            <p className="text-[9px] font-bold text-app-muted uppercase tracking-widest">{label.replace(/\s*\(.*\)/, '')}</p>
                            <input
                                type="number" step="0.1" value={measures[key] || ''} onChange={e => setMeasures(prev => ({ ...prev, [key]: e.target.value }))}
                                className="w-16 bg-app text-xs font-bold text-app text-center py-1.5 rounded-lg outline-none placeholder:text-app/20 focus:ring-1 focus:ring-blue-500"
                                placeholder="--"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
                <p className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em]">📝 Observações</p>
                <textarea
                    value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    className="w-full bg-surface border border-app rounded-2xl p-4 text-sm font-medium text-app placeholder:text-app-muted focus:border-blue-500/50 outline-none resize-none"
                    placeholder="Como está indo o planejamento? Digite aqui..."
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit} disabled={submitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50 transition-all active:scale-[0.98] mt-6"
            >
                {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Salvando...</span>
                    </div>
                ) : 'Registrar Medida'}
            </button>
        </div>
    );
};
