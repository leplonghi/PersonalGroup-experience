import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { Icons } from '../constants';

interface FrequencyTrackerProps {
    user: User;
}

const FrequencyTracker: React.FC<FrequencyTrackerProps> = ({ user }) => {
    const target = user.weeklyFrequency || 0;
    const missed = user.missedThisWeek || 0;
    const [completedThisWeek, setCompleted] = useState(0);

    useEffect(() => {
        const dayOfWeek = new Date().getDay();
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const expectedSoFar = Math.min(daysSinceMonday, target);
        const done = Math.max(0, expectedSoFar - missed);
        setCompleted(done);
    }, [target, missed]);

    if (target === 0) return null;

    const progressPct = Math.min(100, Math.round((completedThisWeek / target) * 100));
    const isBehind = missed >= 2;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl glass-panel border-white/5 p-5 space-y-5 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pg-cobalt/5 blur-3xl rounded-full"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-pg-cobalt/10 flex items-center justify-center border border-pg-cobalt/20">
                        <Icons.Activity className="w-4 h-4 text-pg-cobalt" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Frequência Semanal</h4>
                        <p className="text-[8px] font-bold text-pg-text-muted uppercase tracking-widest mt-1">Sua meta de consistência</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-white font-display tabular-nums">
                        {completedThisWeek}<span className="text-xs text-pg-text-muted mx-1">/</span>{target}
                    </span>
                </div>
            </div>

            {/* Progress bar container */}
            <div className="space-y-4 relative z-10">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
                        className={`h-full rounded-full ${isBehind
                            ? 'bg-gradient-to-r from-amber-500 to-red-500'
                            : 'bg-gradient-to-r from-pg-cobalt to-indigo-500 shadow-[0_0_10px_rgba(0,182,253,0.3)]'
                            }`}
                    />
                </div>

                {/* Day Dots */}
                <div className="flex items-center justify-between px-1">
                    {Array.from({ length: target }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${i < completedThisWeek
                                ? 'bg-pg-cobalt text-pg-midnight shadow-lg shadow-pg-cobalt/20'
                                : 'bg-white/5 text-pg-text-muted border border-white/5'
                                }`}
                        >
                            {i < completedThisWeek ? (
                                <Icons.Check className="w-4 h-4" />
                            ) : (
                                i + 1
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Premium Alert */}
            {isBehind && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                    <Icons.AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-[10px] font-bold text-red-200 tracking-wide leading-tight">
                        Atenção: Você tem {missed} {missed > 1 ? 'faltas' : 'falta'} acumulada{missed > 1 ? 's' : ''}. <br/>
                        <span className="opacity-60">Consistência é o segredo da evolução.</span>
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default FrequencyTracker;
