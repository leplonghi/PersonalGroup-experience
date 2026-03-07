import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { User } from '../../types';
import { Icons } from '../../constants';

interface EvolutionFlexViewProps {
    user: User;
}

export const EvolutionFlexView: React.FC<EvolutionFlexViewProps> = ({ user }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero Intro */}
            <div className="text-center px-4 pt-4 pb-2 space-y-2">
                <h2 className="text-2xl font-black text-app uppercase tracking-widest">
                    Desempenho <span className="text-amber-500">Flex</span>
                </h2>
                <p className="text-xs font-bold text-app-muted uppercase tracking-widest">6 Capacidades Fundamentais</p>
            </div>

            {/* Radar Chart Card */}
            <div className="bg-surface border border-app rounded-[32px] p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none -mr-10 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none -ml-10 -mb-20"></div>

                <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={[
                            { subject: 'Estabilidade', A: Math.min(80 + (user.stats?.totalSessions || 0) * 1.5, 98), fullMark: 100 },
                            { subject: 'Coordenação', A: Math.min(75 + (user.stats?.totalSessions || 0) * 1.2, 95), fullMark: 100 },
                            { subject: 'Agilidade', A: Math.min(70 + (user.stats?.totalSessions || 0) * 1.0, 92), fullMark: 100 },
                            { subject: 'Velocidade', A: Math.min(65 + (user.stats?.totalSessions || 0) * 0.8, 88), fullMark: 100 },
                            { subject: 'Força Din.', A: Math.min(85 + ((user.stats?.totalVolume || 0) / 1000) * 0.5, 99), fullMark: 100 },
                            { subject: 'Mobilidade', A: Math.min(72 + (user.stats?.totalSessions || 0) * 1.1, 94), fullMark: 100 },
                        ]}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Capacidade Flex"
                                dataKey="A"
                                stroke="#eab308"
                                fill="#eab308"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>

                    {/* Center Value Floating */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                            <span className="text-xl font-black text-amber-500 leading-none">
                                {Math.round(74 + Math.min((user.stats?.totalSessions || 1) * 1.1, 20))}
                            </span>
                            <span className="text-[8px] font-bold text-amber-500/80 uppercase tracking-widest mt-0.5">Score</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em] mb-4">Análise Detalhada</h4>
                {[
                    { name: 'Estabilidade', score: Math.round(Math.min(80 + (user.stats?.totalSessions || 0) * 1.5, 98)), color: 'bg-green-500', desc: 'Controle core baseado em frequência' },
                    { name: 'Coordenação', score: Math.round(Math.min(75 + (user.stats?.totalSessions || 0) * 1.2, 95)), color: 'bg-green-400', desc: 'Sincronia motora em evolução' },
                    { name: 'Força Dinâmica', score: Math.round(Math.min(85 + ((user.stats?.totalVolume || 0) / 1000) * 0.5, 99)), color: 'bg-green-400', desc: 'Força atrelada ao volume (ton)' },
                    { name: 'Agilidade', score: Math.round(Math.min(70 + (user.stats?.totalSessions || 0) * 1.0, 92)), color: 'bg-amber-400', desc: 'Mudança de direção consistente' },
                    { name: 'Velocidade', score: Math.round(Math.min(65 + (user.stats?.totalSessions || 0) * 0.8, 88)), color: 'bg-amber-500', desc: 'Potência reativa necessita foco' },
                    { name: 'Mobilidade', score: Math.round(Math.min(72 + (user.stats?.totalSessions || 0) * 1.1, 94)), color: 'bg-orange-500', desc: 'Amplitude de movimento geral' }
                ].map((cap, i) => (
                    <div key={i} className="flex flex-col bg-surface border border-app rounded-2xl p-4 gap-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-app flex items-center justify-center border border-app">
                                    <Icons.Target className="w-4 h-4 text-app-muted" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-app uppercase tracking-wide">{cap.name}</p>
                                    <p className="text-[9px] font-bold text-app-muted">{cap.desc}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-app">{cap.score}</span>
                                <span className="text-[8px] uppercase font-bold text-app-muted">Nível</span>
                            </div>
                        </div>
                        {/* Mini Progress Bar */}
                        <div className="w-full h-1 bg-app rounded-full overflow-hidden">
                            <div className={`h-full ${cap.color} rounded-full transition-all duration-1000`} style={{ width: `${cap.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
