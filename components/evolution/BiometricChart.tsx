import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { EvolutionEntry } from '../../types';

export const BiometricChart: React.FC<{
    entries: EvolutionEntry[];
    dataKey: string;
    secondaryKey?: string;
    color: string;
    secondaryColor?: string;
}> = ({ entries, dataKey, secondaryKey, color, secondaryColor }) => {
    // Recharts expects chronological order
    const data = [...entries].reverse().map(e => ({
        date: new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        [dataKey]: (e as any)[dataKey],
        ...(secondaryKey ? { [secondaryKey]: (e as any)[secondaryKey] } : {})
    }));

    if (secondaryKey) {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold' }}
                        dy={10}
                    />
                    <RechartsTooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorPrimary)" />
                    <Area type="monotone" dataKey={secondaryKey} stroke={secondaryColor} strokeWidth={2} fillOpacity={1} fill="url(#colorSecondary)" />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold' }}
                    dy={10}
                />
                <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
