import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface FrequencyTrackerProps {
    user: User;
}

const FrequencyTracker: React.FC<FrequencyTrackerProps> = ({ user }) => {
    const target = user.weeklyFrequency || 0;
    const missed = user.missedThisWeek || 0;

    // Count check-ins this week (simplified: use checkedIn status + missedThisWeek)
    const [completedThisWeek, setCompleted] = useState(0);

    useEffect(() => {
        // In a real scenario we'd query checkins for this week.
        // For now, derive from target minus missed (clamp to 0)
        const dayOfWeek = new Date().getDay(); // 0=Sun
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        // Rough estimate: days passed so far this week * (target/5)
        const expectedSoFar = Math.min(daysSinceMonday, target);
        const done = Math.max(0, expectedSoFar - missed);
        setCompleted(done);
    }, [target, missed]);

    if (target === 0) return null;

    const progressPct = Math.min(100, Math.round((completedThisWeek / target) * 100));
    const isBehind = missed >= 2;

    return (
        <div className="rounded-xl border border-blue-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Icons.Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-[0.2em]">
                        Frequência Semanal
                    </span>
                </div>
                <span className="text-[11px] font-black text-blue-800 dark:text-blue-400 tabular-nums">
                    {completedThisWeek}/{target}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${isBehind
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-cobalt to-sky'
                        }`}
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            {/* Dots */}
            <div className="flex items-center justify-between">
                {Array.from({ length: target }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${i < completedThisWeek
                            ? 'bg-cobalt text-white shadow-cobalt'
                            : 'bg-white/10 dark:bg-white/5 text-slate-600 dark:text-slate-500 border border-blue-100 dark:border-white/10'
                            }`}
                    >
                        {i < completedThisWeek ? (
                            <Icons.Check className="w-3.5 h-3.5" />
                        ) : (
                            i + 1
                        )}
                    </div>
                ))}
            </div>

            {/* Alert */}
            {isBehind && (
                <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mt-1">
                    <Icons.ExclamationCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-[9px] font-bold text-amber-300 tracking-wide">
                        Você tem {missed} falta{missed > 1 ? 's' : ''} esta semana. Mantenha a regularidade!
                    </p>
                </div>
            )}
        </div>
    );
};

export default FrequencyTracker;
