import React from 'react';
import { User, HealthStatus } from '../../types';
import { Icons } from '../../constants';

interface VitalCardProps {
    title: string;
    value: string;
    unit: string;
    status: HealthStatus;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'stable';
    detail: string;
}

const VitalCard: React.FC<VitalCardProps> = ({ title, value, unit, status, icon, trend, detail }) => {
    const statusColor = status === 'NORMAL' ? 'text-green-500' : status === 'WARNING' ? 'text-amber-500' : 'text-red-500';
    const bgColor = status === 'NORMAL' ? 'bg-green-500/10' : status === 'WARNING' ? 'bg-amber-500/10' : 'bg-red-500/10';
    
    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 shadow-sm hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${bgColor} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center space-x-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {trend === 'up' ? <Icons.ArrowUp className="w-3 h-3 text-green-500" /> : trend === 'down' ? <Icons.ArrowDown className="w-3 h-3 text-red-500" /> : <div className="w-3 h-0.5 bg-slate-300 dark:bg-white/20 rounded-full" />}
                        <span>{trend === 'stable' ? 'Estável' : trend === 'up' ? 'Melhorando' : 'Atenção'}</span>
                    </div>
                )}
            </div>
            
            <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{value}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{unit}</span>
                </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'NORMAL' ? 'bg-green-500' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
                    <span className="text-[9px] font-black text-slate-900 dark:text-slate-100 tracking-wide uppercase">{detail}</span>
                </div>
            </div>
        </div>
    );
};

export const HealthVitalsGrid: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <VitalCard 
                title="Qualidade Sono"
                value="82"
                unit="PTS"
                status="NORMAL"
                icon={<Icons.Moon className="w-5 h-5 text-indigo-500" />}
                trend="up"
                detail="Sono Recuperador"
            />
            <VitalCard 
                title="BPM Repouso"
                value="62"
                unit="BPM"
                status="NORMAL"
                icon={<Icons.Heart className="w-5 h-5 text-red-500" />}
                trend="stable"
                detail="Ótima Condição"
            />
            <VitalCard 
                title="Nível Estresse"
                value="Médio"
                unit=""
                status="WARNING"
                icon={<Icons.Zap className="w-5 h-5 text-amber-500" />}
                trend="down"
                detail="Atenção Necessária"
            />
            <VitalCard 
                title="Pressão Art."
                value="12/8"
                unit="HG"
                status="NORMAL"
                icon={<Icons.Activity className="w-5 h-5 text-blue-500" />}
                trend="stable"
                detail="Dentro do Alvo"
            />
        </div>
    );
};
