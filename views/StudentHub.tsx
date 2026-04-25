
import React from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface StudentHubProps {
    user: User;
    onLogout: () => void;
    onNavigateTo: (view: string) => void;
}

const StudentHub: React.FC<StudentHubProps> = ({ user, onLogout, onNavigateTo }) => {
    return (
        <div className="bg-transparent text-slate-900 dark:text-white font-sans pb-4">
            <header className="px-6 pt-[calc(4.5rem+env(safe-area-inset-top))] pb-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                
                <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
                            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.2em]">Membro Experience</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter leading-none text-slate-900 dark:text-white uppercase italic">
                            OLÁ, {user.name.split(' ')[0]}<span className="text-blue-600">.</span>
                        </h1>
                    </div>
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 p-1 group-hover:border-blue-500/50 transition-all duration-500 cursor-pointer" onClick={() => onNavigateTo('profile')}>
                            <img src={user.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Profile" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-midnight shadow-lg">
                            LVL 12
                        </div>
                    </div>
                </div>

                {/* Gamification Progress */}
                <div className="mt-4 bg-midnight/5 dark:bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Evolução PG</span>
                        <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest">2,450 / 3,000</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[82%] shadow-[0_0_10px_#2563EB]"></div>
                    </div>
                </div>
            </header>

            <div className="px-6 space-y-4 pb-6">
                {/* Precision Training Section */}
                <section className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-1">Performance</h3>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">Área de Treino</h2>
                        </div>
                        <button onClick={() => onNavigateTo('training')} className="text-[12px] font-semibold text-blue-500 uppercase tracking-widest border-b border-blue-500/30 pb-1">Ver Tudo</button>
                    </div>
                    
                    <button 
                        onClick={() => onNavigateTo('training')}
                        className="w-full bg-blue-600 p-4 rounded-[28px] flex items-center justify-between group shadow-xl shadow-blue-600/20 active:scale-95 transition-all overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform">
                            <Icons.Dumbbell className="w-32 h-32" />
                        </div>
                        <div className="flex items-center space-x-6 relative z-10">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20 shadow-inner">
                                <Icons.Dumbbell className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-black text-white uppercase italic tracking-tighter">Protocolo Ativo</p>
                                <p className="text-[12px] font-medium text-blue-100 uppercase tracking-widest">Fase 02 // Hipertrofia</p>
                            </div>
                        </div>
                        <Icons.ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors relative z-10" />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard 
                            label="Frequência" 
                            value="94%" 
                            trend="UP" 
                            trendValue="+2%" 
                            icon={<Icons.Activity className="w-4 h-4" />}
                        />
                        <StatCard 
                            label="Volume" 
                            value="18.4k" 
                            trend="UP" 
                            trendValue="+1.2k" 
                            icon={<Icons.TrendingUp className="w-4 h-4" />}
                        />
                    </div>
                </section>

                {/* Experience Hub Section */}
                <section className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-1">Lifestyle</h3>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">Experience</h2>
                        </div>
                        <button onClick={() => onNavigateTo('experience')} className="text-[12px] font-semibold text-blue-500 uppercase tracking-widest border-b border-blue-500/30 pb-1">Explorar</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton 
                            onClick={() => onNavigateTo('experience')}
                            icon={<Icons.Star className="w-6 h-6" />}
                            label="Arena PG"
                            desc="Status & Conexão"
                        />
                        <ActionButton 
                            onClick={() => onNavigateTo('agenda')}
                            icon={<Icons.Calendar className="w-6 h-6" />}
                            label="Check-in"
                            desc="Sua Agenda"
                        />
                    </div>
                </section>

                {/* Evolution Shortcuts */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Seu Progresso</h3>
                    <div className="space-y-3">
                        <ProtocolItem icon={<Icons.Zap className="w-4 h-4" />} label="Avaliação Física" status="COMPLETE" />
                        <ProtocolItem icon={<Icons.Shield className="w-4 h-4" />} label="Análise Bioquímica" status="ACTIVE" />
                    </div>
                </section>

                <button 
                    onClick={onLogout}
                    className="w-full py-4 border border-red-500/20 text-red-500 text-[12px] font-bold uppercase tracking-[0.4em] active:scale-95 transition-all mt-4 rounded-2xl hover:bg-red-500/5"
                >
                    Sair com Segurança
                </button>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: string; trend: 'UP' | 'DOWN'; trendValue: string; icon: React.ReactNode }> = ({ label, value, trend, trendValue, icon }) => (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-[28px] relative overflow-hidden group hover:border-blue-500/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className={`text-[10px] font-bold ${trend === 'UP' ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                {trend === 'UP' ? '▲' : '▼'} {trendValue}
            </span>
        </div>
        <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{value}</p>
    </div>
);

const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; desc: string }> = ({ onClick, icon, label, desc }) => (
    <button 
        onClick={onClick}
        className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[28px] text-left group hover:bg-white/10 active:scale-95 transition-all"
    >
        <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-1">{label}</p>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{desc}</p>
    </button>
);

const ProtocolItem: React.FC<{ icon: React.ReactNode; label: string; status: 'ACTIVE' | 'COMPLETE' }> = ({ icon, label, status }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl group hover:border-blue-500/20 transition-all">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'COMPLETE' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {icon}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${status === 'COMPLETE' ? 'bg-green-500/10 text-green-500' : 'bg-blue-600 text-white'}`}>
            {status}
        </span>
    </div>
);

export default StudentHub;
