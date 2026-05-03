
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Icons } from '../constants';
import { HealthVitalsGrid } from '../components/health/HealthVitalsGrid';

interface HealthPortfolioProps {
    user: User;
    onBack?: () => void;
}

const HealthPortfolio: React.FC<HealthPortfolioProps> = ({ user, onBack }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-midnight space-y-6 pb-32">
            {/* Header Hero */}
            <div className="px-5 pt-10 pb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                
                <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em]">Gestão Personalizada</span>
                        <h1 className="text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white uppercase italic">
                            Portfólio de<br />Saúde<span className="text-blue-600">.</span>
                        </h1>
                    </div>
                    <button 
                        onClick={onBack || (() => navigate('/home'))}
                        className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <Icons.ChevronLeft className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Health Score Banner */}
            <div className="px-5">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-950 rounded-[32px] p-6 shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay group-hover:opacity-20 transition-opacity" />
                    <div className="absolute top-0 right-0 p-4">
                        <Icons.ShieldCheck className="w-12 h-12 text-white/10" />
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Desempenho de Vitalidade</p>
                            <div className="flex items-baseline space-x-1.5">
                                <span className="text-5xl font-black text-white tracking-tighter italic">94</span>
                                <span className="text-[10px] font-bold text-white/60">/ 100</span>
                            </div>
                            <p className="text-xs font-bold text-blue-100/80 pt-4 max-w-[220px] leading-relaxed">
                                Sua saúde está em um patamar excepcional. Continue o protocolo atual.
                            </p>
                        </div>
                        
                        <div className="w-24 h-24 relative">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-white/10"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 * (1 - 0.94)}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    className="text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Icons.Zap className="w-6 h-6 text-white/30 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="px-5 space-y-5">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Marcadores Vitais</h2>
                    <span className="text-[9px] font-bold text-blue-500 uppercase italic">Sync: Real-time</span>
                </div>
                <HealthVitalsGrid user={user} />
            </div>

            {/* Biometric Status */}
            <div className="px-5">
                <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Status Biométrico</h3>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Última atualização: Hoje 09:42</p>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                            <Icons.Activity className="w-3 h-3 text-blue-600 dark:text-blue-500 animate-pulse" />
                            <span className="text-[8px] font-black text-blue-600 dark:text-blue-500 tracking-widest uppercase">Online</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        <BiometricItem label="Peso" value="78.4" unit="kg" trend="-1.2" color="red" />
                        <BiometricItem label="Gordura" value="14.2" unit="%" trend="-0.8" color="green" />
                        <BiometricItem label="M. Magra" value="62.8" unit="kg" trend="+0.4" color="green" />
                    </div>
                    
                    {/* Tiny trend sparkline placeholder */}
                    <div className="h-16 w-full bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-end px-4 pb-4 space-x-2">
                        {[40, 60, 45, 70, 55, 80, 75, 95].map((h, i) => (
                            <div 
                                key={i} 
                                style={{ height: `${h}%` }}
                                className={`flex-1 rounded-sm ${i === 7 ? 'bg-blue-600' : 'bg-blue-600/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Assessment Timeline Shortcut */}
            <div className="px-5 pb-12">
                <button
                    onClick={() => navigate('/timeline')}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] p-5 flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center space-x-5">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-500">
                            <Icons.Calendar className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Histórico de Avaliações</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Última realizada há 45 dias</p>
                        </div>
                    </div>
                    <Icons.ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
            </div>
        </div>
    );
};

const BiometricItem: React.FC<{ label: string; value: string; unit: string; trend: string; color: 'red' | 'green' }> = ({ label, value, unit, trend, color }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{value}<span className="text-[10px] ml-1 uppercase">{unit}</span></p>
        <div className={`text-[10px] font-bold ${color === 'red' ? 'text-red-500' : 'text-green-500'}`}>{trend}{unit}</div>
    </div>
);

export default HealthPortfolio;
