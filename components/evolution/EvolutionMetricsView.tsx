import React from 'react';
import { User, EvolutionEntry } from '../../types';
import { Icons } from '../../constants';
import { BiometricChart } from './BiometricChart';

interface EvolutionMetricsViewProps {
    entries: EvolutionEntry[];
    loading: boolean;
    onExport: () => void;
}

export const EvolutionMetricsView: React.FC<EvolutionMetricsViewProps> = ({ entries, loading, onExport }) => {
    // Calculate deltas between 2 most recent entries
    const getDelta = (a?: number, b?: number) => {
        if (a === undefined || b === undefined) return null;
        return a - b;
    };

    const latest = entries[0];
    const prev = entries[1];

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center py-24 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                        <Icons.TrendingUp className="w-8 h-8 text-blue-500/50" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nenhum registro</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero Card like the Calories Chart */}
            {latest && (
                <div className="bg-surface border border-app rounded-[32px] p-6 relative overflow-hidden mb-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none -mr-10 -mt-10"></div>

                    <div className="mb-4 relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest">Peso Atual</p>
                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <span className="text-[9px] font-black text-blue-400 uppercase">Resumo</span>
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-1">
                            <h2 className="text-4xl font-black text-app tracking-tight">{latest.weight ?? '--'}</h2>
                            <span className="text-xs font-bold text-app-muted">kg</span>
                        </div>

                        {prev?.weight && getDelta(latest.weight, prev.weight) !== null && (
                            <p className={`text-[10px] font-bold mt-2 ${getDelta(latest.weight, prev.weight)! < 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {getDelta(latest.weight, prev.weight)! > 0 ? '↗ +' : '↘ '}{getDelta(latest.weight, prev.weight)?.toFixed(1)}kg desde a última
                            </p>
                        )}
                    </div>

                    <div className="mt-8 h-32 w-full relative opacity-90">
                        <BiometricChart entries={entries} dataKey="weight" color="#3b82f6" />
                    </div>
                </div>
            )}

            {/* Secondary Stats / Evolution Chart Grid */}
            {latest && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface border border-app rounded-[24px] p-5 hover:bg-surface/50 transition-colors">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <span className="text-[10px]">🔥</span>
                                </div>
                                <p className="text-[9px] font-bold text-app-muted uppercase tracking-widest">Gordura</p>
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-black text-app">{latest.fatPercentage ?? '--'}<span className="text-[10px] text-app-muted ml-0.5 font-bold">%</span></p>
                                {prev?.fatPercentage && (
                                    <span className={`text-[9px] font-bold mb-1 ${getDelta(latest.fatPercentage, prev.fatPercentage)! < 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {getDelta(latest.fatPercentage, prev.fatPercentage)! > 0 ? '↗' : '↘'} {Math.abs(getDelta(latest.fatPercentage, prev.fatPercentage)!)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-surface border border-app rounded-[24px] p-5 hover:bg-surface/50 transition-colors">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <span className="text-[10px]">💪</span>
                                </div>
                                <p className="text-[9px] font-bold text-app-muted uppercase tracking-widest">M. Magra</p>
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-black text-app">{latest.leanMass ?? '--'}<span className="text-[10px] text-app-muted ml-0.5 font-bold">kg</span></p>
                                {prev?.leanMass && (
                                    <span className={`text-[9px] font-bold mb-1 ${getDelta(latest.leanMass, prev.leanMass)! > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {getDelta(latest.leanMass, prev.leanMass)! > 0 ? '↗' : '↘'} {Math.abs(getDelta(latest.leanMass, prev.leanMass)!)}kg
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Composition Chart */}
                    <div className="bg-surface border border-app rounded-[28px] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black text-app-muted uppercase tracking-widest">Composição Corporal</h4>
                            <div className="flex space-x-3">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-[8px] font-bold text-app-muted uppercase">Muscular</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-[8px] font-bold text-app-muted uppercase">Gordura</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-40 w-full">
                            <BiometricChart
                                entries={entries}
                                dataKey="leanMass"
                                secondaryKey="fatPercentage"
                                color="#3b82f6"
                                secondaryColor="#ef4444"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* History Timeline List */}
            <div className="pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-black text-app uppercase tracking-[0.2em]">Histórico de Medidas</h3>
                    <button
                        onClick={onExport}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-surface border border-app rounded-lg hover:bg-surface/10 transition-all group"
                    >
                        <Icons.Download className="w-3 h-3 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">Planilha CSV</span>
                    </button>
                </div>
                <div className="space-y-4">
                    {entries.map((entry, idx) => (
                        <div key={entry.id || idx} className="bg-surface border border-app rounded-[28px] p-4 flex items-center space-x-4 hover:bg-surface/50 transition-colors relative">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-blue-500/10 z-10 relative">
                                    <span className="text-blue-400 font-bold text-sm tracking-tighter">{entries.length - idx}</span>
                                </div>
                                {/* Connecting Line between timeline items */}
                                {idx < entries.length - 1 && (
                                    <div className="absolute top-12 left-1/2 -ml-[1px] w-[2px] h-[36px] bg-gradient-to-b from-blue-500/30 to-transparent -z-0"></div>
                                )}
                            </div>
                            <div className="flex-1 py-1">
                                <p className="text-[13px] font-bold text-app mb-2">
                                    {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {entry.weight && <span className="bg-app border border-app text-[9px] font-bold text-app-muted px-2 py-1 rounded-[8px] uppercase tracking-wider">{entry.weight} kg</span>}
                                    {entry.fatPercentage && <span className="bg-app border border-app text-[9px] font-bold text-app-muted px-2 py-1 rounded-[8px] uppercase tracking-wider">{entry.fatPercentage}% Gord.</span>}
                                </div>
                            </div>
                            {entry.photoUrl && (
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-app">
                                    <img src={entry.photoUrl} alt="Progress" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
