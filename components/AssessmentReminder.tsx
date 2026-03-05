import React from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import { getDaysUntilReassessment, checkReassessmentDue, checkPersonalDayDue } from '../firebase';

interface AssessmentReminderProps {
    user: User;
    onSchedule?: () => void;
}

const AssessmentReminder: React.FC<AssessmentReminderProps> = ({ user, onSchedule }) => {
    const needsInitial = user.needsAssessment && !user.lastAssessmentDate;
    const reassessmentDue = checkReassessmentDue(user.lastAssessmentDate);
    const personalDayDue = checkPersonalDayDue(user.lastAssessmentDate);
    const daysLeft = getDaysUntilReassessment(user.lastAssessmentDate);

    if (!needsInitial && !reassessmentDue && !personalDayDue) return null;

    const config = needsInitial
        ? {
            gradient: 'from-cyan-600/20 to-cyan-900/10',
            border: 'border-cyan-500/30',
            iconColor: 'text-cyan-400',
            titleColor: 'text-cyan-800 dark:text-cyan-300',
            title: 'Avaliação Física Inicial',
            detail: 'Agende sua primeira avaliação para começar o programa.',
            cta: 'Agendar Avaliação',
            pulse: true
        }
        : reassessmentDue
            ? {
                gradient: 'from-amber-600/20 to-amber-900/10',
                border: 'border-amber-500/30',
                iconColor: 'text-amber-400',
                titleColor: 'text-amber-800 dark:text-amber-300',
                title: 'Reavaliação Necessária',
                detail: '90 dias desde sua última avaliação. Hora de medir seu progresso!',
                cta: 'Agendar Reavaliação',
                pulse: true
            }
            : {
                gradient: 'from-blue-600/15 to-blue-900/5',
                border: 'border-blue-500/20',
                iconColor: 'text-blue-400',
                titleColor: 'text-blue-800 dark:text-blue-300',
                title: 'PersonalDay 🎉',
                detail: '45 dias desde sua avaliação! Seu dia exclusivo com consultoria personalizada.',
                cta: 'Ver Detalhes',
                pulse: false
            };

    return (
        <div className={`relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-r ${config.gradient} p-4`}>
            <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icons.ClipboardCheck className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <div>
                        <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${config.titleColor}`}>
                            {config.title}
                        </p>
                        <p className="text-[10px] text-slate-700 dark:text-slate-400 mt-1 tracking-wide leading-relaxed font-medium">
                            {config.detail}
                        </p>
                    </div>

                    {daysLeft !== null && !needsInitial && !reassessmentDue && (
                        <p className="text-[9px] text-slate-800 dark:text-slate-500 font-black uppercase tracking-widest">
                            Próxima reavaliação em {daysLeft} dias
                        </p>
                    )}

                    {onSchedule && (
                        <button
                            onClick={onSchedule}
                            className="text-[10px] font-black text-blue-800 dark:text-blue-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors mt-1"
                        >
                            {config.cta} →
                        </button>
                    )}
                </div>

                {config.pulse && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_#F59E0B] animate-pulse flex-shrink-0 mt-2" />
                )}
            </div>
        </div>
    );
};

export default AssessmentReminder;
