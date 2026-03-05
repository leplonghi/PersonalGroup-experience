import React, { useState, useEffect } from 'react';
import { User, AdminRequest, AdminRequestType } from '../types';
import { Icons } from '../constants';
import { createAdminRequest, getAdminRequests, uploadProfilePhoto } from '../firebase';

interface AdminRequestsProps {
    user: User;
    onBack: () => void;
}

const requestTypes: { value: AdminRequestType; label: string; emoji: string; description: string }[] = [
    { value: 'MUDANCA_TREINO', label: 'Mudança de Treino', emoji: '🔄', description: 'Solicitar alteração no programa de treino' },
    { value: 'TRANCAMENTO', label: 'Trancamento', emoji: '🔒', description: 'Pausar matrícula com justificativa' },
    { value: 'ATESTADO', label: 'Atestado Médico', emoji: '📋', description: 'Enviar atestado para abono de faltas' },
    { value: 'REPOSICAO', label: 'Reposição / Aula Extra', emoji: '📅', description: 'Solicitar aula de reposição' },
    { value: 'OUTRO', label: 'Outro', emoji: '💬', description: 'Outras solicitações administrativas' },
];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Pendente' },
    approved: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', label: 'Aprovado' },
    rejected: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: 'Recusado' },
};

const AdminRequests: React.FC<AdminRequestsProps> = ({ user, onBack }) => {
    const [view, setView] = useState<'list' | 'new'>('list');
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [type, setType] = useState<AdminRequestType>('MUDANCA_TREINO');
    const [reason, setReason] = useState('');
    const [docFile, setDocFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const data = await getAdminRequests(user.id);
        setRequests(data);
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!reason.trim()) return;
        setSubmitting(true);
        try {
            let documentUrl: string | undefined;
            if (docFile) {
                documentUrl = await uploadProfilePhoto(user.id, docFile);
            }
            await createAdminRequest({
                userId: user.id,
                userName: user.name,
                type,
                reason,
                documentUrl,
            });
            setReason('');
            setDocFile(null);
            setView('list');
            await loadRequests();
        } catch (err) {
            console.error('Error submitting request:', err);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest">Administrativo</h1>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Solicitações</p>
                </div>
                <button
                    onClick={() => setView(view === 'list' ? 'new' : 'list')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600/20 transition-all"
                >
                    {view === 'list' ? <Icons.Plus className="w-4 h-4 text-blue-400" /> : <Icons.X className="w-4 h-4 text-slate-400" />}
                </button>
            </div>

            {view === 'new' ? (
                /* New Request Form */
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Type Selection */}
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Tipo de Solicitação</p>
                        <div className="space-y-2">
                            {requestTypes.map(rt => (
                                <button
                                    key={rt.value}
                                    onClick={() => setType(rt.value)}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all ${type === rt.value
                                            ? 'bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-lg">{rt.emoji}</span>
                                    <div className="text-left flex-1">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${type === rt.value ? 'text-blue-300' : 'text-slate-300'}`}>
                                            {rt.label}
                                        </p>
                                        <p className="text-[8px] text-slate-500 mt-0.5">{rt.description}</p>
                                    </div>
                                    {type === rt.value && (
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Icons.Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Motivo / Descrição</p>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none resize-none"
                            placeholder="Descreva o motivo da solicitação..."
                        />
                    </div>

                    {/* Document Upload */}
                    {(type === 'ATESTADO' || type === 'TRANCAMENTO') && (
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                {type === 'ATESTADO' ? 'Anexar Atestado' : 'Documento Comprobatório'}
                            </p>
                            <label className="flex items-center justify-center space-x-2 w-full py-4 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                                <Icons.Upload className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-bold text-slate-400">
                                    {docFile ? docFile.name : 'Selecionar arquivo'}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={e => setDocFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim() || submitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-lg shadow-blue-900/40 border border-blue-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Enviando...</span>
                            </div>
                        ) : 'Enviar Solicitação'}
                    </button>
                </div>
            ) : (
                /* List of Requests */
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-16 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                                <Icons.FileText className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nenhuma solicitação</p>
                            <button
                                onClick={() => setView('new')}
                                className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-blue-300 transition-colors"
                            >
                                Criar primeira solicitação →
                            </button>
                        </div>
                    ) : (
                        requests.map(req => {
                            const st = statusConfig[req.status] || statusConfig.pending;
                            const rt = requestTypes.find(r => r.value === req.type);
                            return (
                                <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{rt?.emoji || '📄'}</span>
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{rt?.label || req.type}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded border ${st.bg}`}>
                                            <span className={`text-[7px] font-black uppercase tracking-widest ${st.text}`}>{st.label}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">{req.reason}</p>
                                    {req.resolution && (
                                        <p className="text-[9px] text-blue-400 italic">Resolução: {req.resolution}</p>
                                    )}
                                    <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">
                                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString('pt-BR') : '—'}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminRequests;
