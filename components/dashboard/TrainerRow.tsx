
import React from 'react';
import { TrainerSlot } from '../../data/scheduleData';

interface TrainerRowProps {
    trainer: TrainerSlot;
}

const TrainerRow: React.FC<TrainerRowProps> = ({ trainer }) => {
    const isAvailable = trainer.status === 'available';

    return (
        <div className="flex items-center space-x-4 p-4 glass-panel border-white/5 hover:border-blue-500/30 transition-all group">
            <div className="relative">
                <div className="w-12 h-12 bg-slate-800 rounded-full overflow-hidden border border-white/10 group-hover:border-blue-500 transition-colors">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            <div className="flex-1">
                <h5 className="text-sm font-bold text-sky-950 dark:text-white uppercase tracking-wider leading-none">
                    {trainer.name}
                </h5>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mt-1">
                    {trainer.specialty}
                </p>
            </div>

            <div className="text-right">
                {isAvailable ? (
                    <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-600 dark:text-slate-400 block uppercase tracking-widest">Disponível em:</span>
                        <div className="flex space-x-1 justify-end">
                            {trainer.availableTimes.slice(0, 2).map(time => (
                                <span key={time} className="bg-blue-600/10 text-blue-500 text-[9px] font-bold px-1.5 py-0.5 rounded-sm border border-blue-600/20">
                                    {time}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded-sm border border-red-500/20">
                        Ocupado
                    </span>
                )}
            </div>
        </div>
    );
};

export default TrainerRow;
