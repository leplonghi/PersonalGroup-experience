import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface WearablesProps {
    user: User;
    onBack: () => void;
}

interface HealthMetric {
    label: string;
    value: string;
    unit: string;
    icon: string;
    trend: 'up' | 'down' | 'stable';
    color: string;
}

const Wearables: React.FC<WearablesProps> = ({ user, onBack }) => {
    const [connected, setConnected] = useState(false);
    const [platform, setPlatform] = useState<'apple' | 'google' | null>(null);

    // Simulated health data
    const healthMetrics: HealthMetric[] = connected ? [
        { label: 'Passos Hoje', value: '8.432', unit: 'passos', icon: '🚶', trend: 'up', color: 'text-green-400' },
        { label: 'Freq. Cardíaca', value: '72', unit: 'bpm', icon: '❤️', trend: 'stable', color: 'text-red-400' },
        { label: 'Calorias', value: '1.847', unit: 'kcal', icon: '🔥', trend: 'up', color: 'text-orange-400' },
        { label: 'Sono', value: '7h 23m', unit: '', icon: '😴', trend: 'up', color: 'text-indigo-400' },
        { label: 'Distância', value: '5.8', unit: 'km', icon: '📍', trend: 'up', color: 'text-blue-400' },
        { label: 'Treinos', value: '3', unit: 'esta semana', icon: '💪', trend: 'stable', color: 'text-cyan-400' },
        { label: 'VO2 Max', value: '42', unit: 'ml/kg/min', icon: '🫁', trend: 'up', color: 'text-teal-400' },
        { label: 'Variab. Cardíaca', value: '48', unit: 'ms', icon: '📊', trend: 'down', color: 'text-amber-400' },
    ] : [];

    const weeklySteps = [6200, 8100, 7400, 9300, 8432, 0, 0]; // Mon-Sun
    const maxSteps = Math.max(...weeklySteps, 1);
    const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

    const handleConnect = (p: 'apple' | 'google') => {
        setPlatform(p);
        // Simulate connection delay
        setTimeout(() => setConnected(true), 1200);
    };

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest">Wearables</h1>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Dados de Saúde</p>
                </div>
                <div className="w-10" />
            </div>

            {!connected ? (
                /* Connection Screen */
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-center py-6 space-y-3">
                        <div className="text-5xl">⌚</div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">Conectar Dispositivo</h2>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                            Sincronize seus dados de saúde para acompanhar seu progresso de forma integrada.
                        </p>
                    </div>

                    {/* Apple Health */}
                    <button
                        onClick={() => handleConnect('apple')}
                        className="w-full flex items-center space-x-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🍎</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] group-hover:text-pink-300 transition-colors">Apple Health</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">HealthKit • Apple Watch • iPhone</p>
                        </div>
                        <Icons.ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                    </button>

                    {/* Google Fit */}
                    <button
                        onClick={() => handleConnect('google')}
                        className="w-full flex items-center space-x-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">💚</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] group-hover:text-green-300 transition-colors">Google Fit</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">Wear OS • Android • Fitbit</p>
                        </div>
                        <Icons.ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors" />
                    </button>

                    {/* Garmin */}
                    <button
                        onClick={() => handleConnect('google' as any)}
                        className="w-full flex items-center space-x-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🔘</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] group-hover:text-slate-300 transition-colors">Garmin Connect</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">Garmin Watches • Index Scale</p>
                        </div>
                        <Icons.ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                    </button>

                    {/* Strava */}
                    <button
                        onClick={() => handleConnect('google' as any)}
                        className="w-full flex items-center space-x-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🏃</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] group-hover:text-orange-300 transition-colors">Strava</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">Record activities • Segments</p>
                        </div>
                        <Icons.ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
                    </button>

                    <p className="text-[8px] text-slate-600 text-center font-bold uppercase tracking-widest">
                        🔒 Seus dados são privados e seguros
                    </p>
                </div>
            ) : (
                /* Connected Dashboard */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Connection Status */}
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E] animate-pulse" />
                            <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em]">
                                {platform === 'apple' ? 'Apple Health' : 'Google Fit'} Conectado
                            </p>
                        </div>
                        <button
                            onClick={() => { setConnected(false); setPlatform(null); }}
                            className="text-[8px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                        >
                            Desconectar
                        </button>
                    </div>

                    {/* Weekly Steps Chart */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">🚶 Passos da Semana</p>
                        <div className="flex items-end justify-between h-24 space-x-2">
                            {weeklySteps.map((steps, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center space-y-1">
                                    <div
                                        className={`w-full rounded-t-md transition-all ${idx < 5 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-white/5'
                                            }`}
                                        style={{ height: `${Math.max((steps / maxSteps) * 100, 4)}%`, minHeight: 4 }}
                                    />
                                    <span className={`text-[7px] font-bold ${idx < 5 ? 'text-slate-400' : 'text-slate-600'}`}>{days[idx]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-[8px] text-slate-500 font-bold">Meta: 10.000/dia</p>
                            <p className="text-[8px] text-blue-400 font-bold">Média: {Math.round(weeklySteps.filter(s => s > 0).reduce((a, b) => a + b, 0) / weeklySteps.filter(s => s > 0).length).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Health Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {healthMetrics.map(m => (
                            <div key={m.label} className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg">{m.icon}</span>
                                    <span className={`text-[8px] font-black uppercase tracking-wider ${m.trend === 'up' ? 'text-green-400' : m.trend === 'down' ? 'text-red-400' : 'text-slate-500'
                                        }`}>
                                        {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}
                                    </span>
                                </div>
                                <div>
                                    <p className={`text-lg font-black ${m.color} tabular-nums`}>{m.value}</p>
                                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{m.unit || m.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">ℹ️ Sobre os dados</p>
                        <p className="text-[8px] text-slate-500 leading-relaxed">
                            Os dados são sincronizados automaticamente quando seu dispositivo está conectado.
                            Seu personal pode acessar essas métricas para personalizar seus treinos.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wearables;
