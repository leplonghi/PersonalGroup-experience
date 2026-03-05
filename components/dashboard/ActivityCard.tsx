
import React from 'react';
import { Icons } from '../../constants';
import { ClassSession } from '../../data/scheduleData';

interface ActivityCardProps {
    session: ClassSession;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ session }) => {
    const isFull = session.enrolled >= session.capacity;

    // Icon selection logic
    let Icon = Icons.Activity;
    if (session.type === 'strength' || session.type === 'hiit') Icon = Icons.Dumbbell || Icons.Activity;
    if (session.type === 'flexibility') Icon = Icons.Yoga || Icons.Leaf;
    if (session.type === 'cardio') Icon = Icons.Swimming || Icons.Activity; // Using swimming as proxy or generic

    return (
        <div className="glass-panel p-6 border-l-4 border-l-blue-600 relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-black text-blue-900 dark:text-blue-400 uppercase tracking-widest block mb-2">
                        {session.time} • {session.duration}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">
                        {session.title}
                    </h4>
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 flex items-center justify-center rounded-full text-blue-600">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        {/* Avatar placeholder */}
                        <div className="w-full h-full bg-blue-600/20 flex items-center justify-center text-[10px] font-bold text-blue-500">
                            {session.instructor.charAt(0)}
                        </div>
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-400 uppercase tracking-wider">
                        {session.instructor}
                    </span>
                </div>

                <div className="text-right">
                    <span className={`text-xs font-black uppercase tracking-widest ${isFull ? 'text-red-700' : 'text-green-800 dark:text-green-500'}`}>
                        {isFull ? 'Lotado' : `${session.capacity - session.enrolled} Vagas`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
