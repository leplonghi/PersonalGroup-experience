
import React from 'react';
import { Icons } from '../../constants';

interface StatWidgetProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon?: keyof typeof Icons;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'green' | 'yellow' | 'red';
    onClick?: () => void;
}

const StatWidget: React.FC<StatWidgetProps> = ({ label, value, subtext, icon = 'Activity', trend, color = 'blue', onClick }) => {
    const IconComponent = Icons[icon] || Icons.Activity;

    const colorMap = {
        blue: 'text-blue-500 border-blue-500 bg-blue-500',
        green: 'text-pg-success border-pg-success bg-pg-success',
        yellow: 'text-pg-warning border-pg-warning bg-pg-warning',
        red: 'text-red-500 border-red-500 bg-red-500'
    }

    return (
        <div
            onClick={onClick}
            className={`glass-panel p-5 relative overflow-hidden group transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-95 hover:border-blue-500/30' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-black text-slate-800 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 ${colorMap[color].split(' ')[0]}`}>
                    <IconComponent className="w-4 h-4" />
                </div>
            </div>

            <div className="flex items-baseline space-x-1 mt-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none">{value}</h3>
                {trend && (
                    <span className={`text-[11px] font-black uppercase ml-2 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
                        {trend === 'up' ? '▲' : '▼'}
                    </span>
                )}
            </div>

            {subtext && (
                <p className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mt-1.5">{subtext}</p>
            )}

            {/* Background decoration */}
            <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-5 blur-xl ${colorMap[color].split(' ')[2]}`}></div>
        </div>
    );
};

export default StatWidget;
