import React from 'react';
import { User } from '../../types';
import { Icons } from '../../constants';

export const StudentRow: React.FC<{
    currentUser: User;
    student: User;
    onSelect: (u: User) => void;
    onStartAssessment: (u: User) => void;
    onStartCycle: (u: User) => void;
}> = ({ currentUser, student, onSelect, onStartAssessment, onStartCycle }) => {
    const isPersonalDay = student.lastAssessmentDate &&
        (new Date().getTime() - new Date(student.lastAssessmentDate).getTime()) / (1000 * 60 * 60 * 24) >= 45;

    return (
        <div
            className={`flex items-center justify-between p-6 border transition-all hover:bg-white dark:hover:bg-white/5 ${isPersonalDay ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-200 dark:border-white/5 bg-white dark:bg-ocean/30'}`}
        >
            <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => onSelect(student)}>
                <div className={`w-14 h-14 border-2 p-1 flex items-center justify-center overflow-hidden rounded-full ${student.isCheckedIn ? 'border-emerald-500' : 'border-slate-200 dark:border-white/10'}`}>
                    <img src={student.avatar || student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} className="w-full h-full object-cover rounded-full" alt="Student" />
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">{student.name}</p>
                        {isPersonalDay && (
                            <span className="text-[8px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-sm animate-pulse whitespace-nowrap">PERSONAL DAY</span>
                        )}
                    </div>
                    <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-2 flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${student.isCheckedIn ? 'bg-emerald-500' : 'bg-slate-500 opacity-30'}`}></span>
                        {student.isCheckedIn ? 'Treinando Agora' : 'Offline'} • {student.currentCycle ? `Protocolo: ${student.currentCycle.name}` : 'Sem protocolo definido'}
                        {student.lastCheckIn && ` • Último treino: ${new Date(student.lastCheckIn.seconds * 1000).toLocaleDateString('pt-BR')}`}
                    </p>
                </div>
            </div>
            {currentUser.role !== 'PERSONAL' && (
                <div className="flex space-x-2">
                    <button onClick={() => onStartAssessment(student)} className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-white/10 active:scale-95 text-cyan-500" title="Avaliação">
                        <Icons.TrendingUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => onStartCycle(student)} className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-white/10 active:scale-95 text-blue-500" title="Treino">
                        <Icons.Shield className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
