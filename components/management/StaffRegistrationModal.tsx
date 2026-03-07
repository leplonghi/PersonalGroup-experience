import React, { useState } from 'react';
import { UserRole } from '../../types';

export const StaffRegistrationModal: React.FC<{ onClose: () => void; onSubmit: (data: any) => Promise<void> }> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', specialty: '' });
    const [loading, setLoading] = useState(false);

    return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white dark:bg-midnight p-10 space-y-8 animate-in zoom-in duration-300">
                <header className="border-l-4 border-blue-600 pl-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">RH Exclusive</h4>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Registrar Professor</h3>
                </header>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Completo</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-blue-600"
                            placeholder="Ex: Carlos Silva"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail Corporativo</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 text-sm font-bold text-slate-900 dark:text-white lowercase tracking-widest focus:outline-none focus:border-blue-600"
                            placeholder="personal@pg.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Especialidade Principal</label>
                        <select
                            value={formData.specialty}
                            onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-blue-600 appearance-none"
                        >
                            <option value="">Selecione...</option>
                            <option value="MUSCULAÇÃO">Musculação</option>
                            <option value="CARDIO">Cardiovascular</option>
                            <option value="FUNCIONAL">Funcional</option>
                            <option value="MOBILIDADE">Mobilidade</option>
                        </select>
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button onClick={onClose} className="flex-1 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
                    <button
                        disabled={!formData.name || !formData.email || loading}
                        onClick={async () => {
                            setLoading(true);
                            await onSubmit({ ...formData, role: UserRole.PERSONAL });
                            setLoading(false);
                        }}
                        className="flex-1 py-5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
