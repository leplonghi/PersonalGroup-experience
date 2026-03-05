import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface PlanStatusBannerProps {
    user: User;
}

const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({ user }) => {
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!user.planEnd) return;
        const end = new Date(user.planEnd);
        const now = new Date();
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff);
    }, [user.planEnd]);

    if (daysLeft === null) return null;

    const isExpired = daysLeft <= 0;
    const isUrgent = daysLeft > 0 && daysLeft <= 7;
    const isWarning = daysLeft > 7 && daysLeft <= 15;

    if (!isExpired && !isUrgent && !isWarning) return null;

    const config = isExpired
        ? { bg: 'from-red-600/20 to-red-900/10', border: 'border-red-500/30', text: 'text-red-800 dark:text-red-400', icon: 'text-red-400', label: 'Plano Expirado', detail: 'Renove para continuar treinando.' }
        : isUrgent
            ? { bg: 'from-amber-600/20 to-amber-900/10', border: 'border-amber-500/30', text: 'text-amber-800 dark:text-amber-300', icon: 'text-amber-400', label: `${daysLeft} dia${daysLeft > 1 ? 's' : ''} restante${daysLeft > 1 ? 's' : ''}`, detail: 'Fale na recepção para renovar.' }
            : { bg: 'from-blue-600/10 to-blue-900/5', border: 'border-blue-500/20', text: 'text-blue-800 dark:text-blue-300', icon: 'text-blue-400', label: `${daysLeft} dias restantes`, detail: 'Plano vence em breve.' };

    return (
        <div className={`relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-r ${config.bg} p-4`}>
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icons.Clock className={`w-5 h-5 ${config.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${config.text}`}>
                        {config.label}
                    </p>
                    <p className="text-[10px] text-slate-700 dark:text-slate-400 mt-1 tracking-wide font-medium">
                        {config.detail}
                    </p>
                </div>
                {isExpired && (
                    <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#EF4444] animate-pulse" />
                )}
            </div>
        </div>
    );
};

export default PlanStatusBanner;
