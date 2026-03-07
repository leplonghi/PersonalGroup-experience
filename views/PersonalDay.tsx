import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import { updateUserProfile } from '../firebase';

interface PersonalDayProps {
    user: User;
    onBack: () => void;
    onComplete: () => void;
}

const satisfactionQuestions = [
    { id: 'progress', label: 'Satisfação com o progresso', emoji: '📈' },
    { id: 'trainer', label: 'Qualidade do acompanhamento', emoji: '👨‍🏫' },
    { id: 'equipment', label: 'Equipamentos e estrutura', emoji: '🏋️' },
    { id: 'ambience', label: 'Ambiente e limpeza', emoji: '✨' },
    { id: 'schedule', label: 'Flexibilidade de horários', emoji: '⏰' },
    { id: 'overall', label: 'Satisfação geral', emoji: '⭐' },
];

const PersonalDay: React.FC<PersonalDayProps> = ({ user, onBack, onComplete }) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState('');
    const [step, setStep] = useState<'intro' | 'survey' | 'done'>('intro');
    const [saving, setSaving] = useState(false);

    const allRated = satisfactionQuestions.every(q => ratings[q.id] !== undefined);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            // Save the PersonalDay survey to user profile
            await updateUserProfile(user.id, {
                lastAssessmentDate: new Date().toISOString(), // Reset the cycle
            });
            setStep('done');
            setTimeout(onComplete, 2500);
        } catch (err) {
            console.error('Error saving PersonalDay:', err);
        }
        setSaving(false);
    };

    const renderStars = (questionId: string) => {
        const current = ratings[questionId] || 0;
        return (
            <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        onClick={() => setRatings(prev => ({ ...prev, [questionId]: star }))}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${star <= current
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 scale-110'
                            : 'bg-white/5 text-slate-600 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <span className="text-sm font-black">{star}</span>
                    </button>
                ))}
            </div>
        );
    };

    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-app flex flex-col items-center justify-center p-8 space-y-8">
                <div className="text-center space-y-4">
                    <div className="text-6xl">🎉</div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">PersonalDay</h1>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.4em]">
                        Seu dia exclusivo de consultoria
                    </p>
                    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                        Parabéns, <strong className="text-white">{user.name.split(' ')[0]}</strong>!
                        45 dias de treino completados. Hoje é seu PersonalDay — um momento
                        para avaliar seu progresso e planejar os próximos passos.
                    </p>
                </div>

                <button
                    onClick={() => setStep('survey')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-lg shadow-blue-900/40 border border-blue-400/20 transition-all"
                >
                    Começar Avaliação
                </button>

                <button onClick={onBack} className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hover:text-slate-300 transition-colors">
                    Fazer depois
                </button>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <div className="min-h-screen bg-app flex flex-col items-center justify-center p-8 space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Icons.Check className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Obrigado!</h2>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.4em]">PersonalDay Concluído</p>
                <p className="text-sm text-slate-400 text-center max-w-xs">
                    Sua avaliação foi registrada. Seu personal receberá o feedback para personalizar ainda mais seus treinos.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <h2 className="text-lg font-black text-white uppercase tracking-widest">PersonalDay</h2>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Questionário de Satisfação</p>
                </div>
                <div className="w-10" />
            </div>

            {/* Questions */}
            <div className="space-y-5">
                {satisfactionQuestions.map(q => (
                    <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">{q.emoji}</span>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{q.label}</p>
                        </div>
                        {renderStars(q.id)}
                    </div>
                ))}
            </div>

            {/* Feedback */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">💬 Comentário (opcional)</p>
                <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none resize-none"
                    placeholder="Conte como está sendo sua experiência..."
                />
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!allRated || saving}
                className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-lg shadow-blue-900/40 border border-blue-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {saving ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Salvando...</span>
                    </div>
                ) : 'Enviar Avaliação'}
            </button>

            {!allRated && (
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">
                    Avalie todos os itens para enviar
                </p>
            )}
        </div>
    );
};

export default PersonalDay;
