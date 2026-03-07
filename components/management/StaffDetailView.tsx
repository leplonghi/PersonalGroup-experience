import React from 'react';
import { User, UserRole } from '../../types';
import { Icons } from '../../constants';

export const StaffDetailView: React.FC<{ staff: User; onClose: () => void; onUpdate: (data: any) => void }> = ({ staff, onClose, onUpdate }) => {
    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-midnight rounded-t-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center space-x-6">
                        <img src={staff.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`} className="w-20 h-20 rounded-full border-2 border-blue-600 p-1" alt="Staff profile" />
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{staff.name}</h3>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-3">Personal Flex</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400"><Icons.X className="w-6 h-6" /></button>
                </div>

                {/* FLEX CAPABILITIES SECTION */}
                <section className="space-y-8">
                    <header className="border-l-4 border-blue-600 pl-4">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Sistema Flex</h4>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Capacidades Técnicas</h3>
                    </header>

                    <div className="space-y-6">
                        {['Anatomia Palpactória', 'Biomecânica Aplicada', 'Prescrição Clínica', 'Engajamento Exclusive'].map(cap => (
                            <div key={cap} className="bg-slate-50 dark:bg-white/5 p-6 border border-slate-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{cap}</span>
                                    <span className="text-xs font-black text-blue-600 italic">Level 4</span>
                                </div>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map(lvl => (
                                        <div key={lvl} className={`flex-1 h-1.5 ${lvl <= 4 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                        Calibrar Professor
                    </button>
                </section>

                <div className="h-20"></div>
            </div>
        </div>
    );
};
