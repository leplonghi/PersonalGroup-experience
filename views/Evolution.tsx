import React, { useState, useEffect, useCallback } from 'react';
import { User, EvolutionEntry, UserRole } from '../types';
import { Icons } from '../constants';
import { getEvolutionEntries, addEvolutionEntry, uploadEvolutionPhoto, exportToCSV } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface EvolutionProps {
    user: User;
    viewer?: User;
    onBack?: () => void;
}

const measureLabels: Record<string, string> = {
    peso: 'Peso (kg)',
    gordura: 'Gordura (%)',
    massaMagra: 'Massa Magra (kg)',
    cintura: 'Cintura (cm)',
    quadril: 'Quadril (cm)',
    bracoD: 'Braço D (cm)',
    bracoE: 'Braço E (cm)',
    coxaD: 'Coxa D (cm)',
    coxaE: 'Coxa E (cm)',
    peitoral: 'Peitoral (cm)',
};

const Evolution: React.FC<EvolutionProps> = ({ user, viewer, onBack }) => {
    const [entries, setEntries] = useState<EvolutionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'add' | 'flex'>('flex');

    // Form state
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [weight, setWeight] = useState('');
    const [fat, setFat] = useState('');
    const [lean, setLean] = useState('');
    const [measures, setMeasures] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        const data = await getEvolutionEntries(user.id);
        setEntries([...data].reverse());
        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onload = ev => setPhotoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            let photoUrl: string | undefined;
            if (photo) {
                photoUrl = await uploadEvolutionPhoto(user.id, photo, dateStr);
            }

            const numericMeasures: Record<string, number> = {};
            Object.entries(measures).forEach(([k, v]: [string, string]) => {
                if (v) numericMeasures[k] = parseFloat(v);
            });

            await addEvolutionEntry({
                userId: user.id,
                date: dateStr,
                photoUrl,
                weight: weight ? parseFloat(weight) : undefined,
                fatPercentage: fat ? parseFloat(fat) : undefined,
                leanMass: lean ? parseFloat(lean) : undefined,
                measures: Object.keys(numericMeasures).length ? numericMeasures : undefined,
                notes: notes || undefined,
            });

            // Reset
            setPhoto(null);
            setPhotoPreview(null);
            setWeight('');
            setFat('');
            setLean('');
            setMeasures({});
            setNotes('');
            setView('list');
            await loadEntries();
        } catch (err) {
            console.error('Error saving evolution:', err);
        }
        setSubmitting(false);
    };

    // Calculate deltas between 2 most recent entries
    const getDelta = (a?: number, b?: number) => {
        if (a === undefined || b === undefined) return null;
        return a - b;
    };

    const latest = entries[0];
    const prev = entries[1];

    const actualViewer = viewer || user;
    const canAdd = actualViewer.role === UserRole.CHEFE || actualViewer.role === UserRole.ADMIN;

    const handleExport = () => {
        const exportData = entries.map(e => ({
            Data: new Date(e.date).toLocaleDateString('pt-BR'),
            Peso: e.weight || '--',
            'Gordura (%)': e.fatPercentage || '--',
            'Massa Magra (kg)': e.leanMass || '--',
            ...Object.fromEntries(
                Object.entries(e.measures || {}).map(([k, v]) => [measureLabels[k] || k, v])
            )
        }));
        exportToCSV(exportData, `Evolucao_${user.name.replace(/\s/g, '_')}`);
    };

    return (
        <div className="min-h-screen bg-app space-y-6 pb-32">
            {/* Pill Segmented Control - Fixed below Global Header (h-20) */}
            <div className="sticky top-[80px] z-50 bg-app backdrop-blur-md pt-4 pb-2 px-6 shadow-sm border-b border-app font-display">
                <div className="bg-surface border border-app rounded-full p-1 flex justify-between items-center shadow-inner overflow-x-auto no-scrollbar gap-1">
                    <button
                        onClick={() => setView('flex')}
                        className={`flex-1 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-full transition-all whitespace-nowrap px-4 ${view === 'flex' ? 'bg-amber-500 text-white shadow-lg' : 'text-app-muted hover:text-app'}`}
                    >
                        Sistema Flex
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`flex-1 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-full transition-all whitespace-nowrap px-4 ${view === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-app-muted hover:text-app'}`}
                    >
                        Bio-Medidas
                    </button>
                    {canAdd && (
                        <button
                            onClick={() => setView('add')}
                            className={`flex-none text-[10px] font-black uppercase tracking-widest py-2.5 rounded-full transition-all whitespace-nowrap px-4 ${view === 'add' ? 'bg-blue-600 text-white shadow-lg' : 'text-app-muted hover:text-app'}`}
                        >
                            + Novo
                        </button>
                    )}
                </div>
            </div>

            <div className="px-6 pt-2">
                {view === 'add' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Photo Upload styled dynamically */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em]">📸 Foto de Progresso</p>
                            <label className="block cursor-pointer">
                                {photoPreview ? (
                                    <div className="relative rounded-3xl overflow-hidden border border-app shadow-lg group">
                                        <img src={photoPreview} alt="Preview" className="w-full h-56 object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">Trocar foto</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 bg-surface border-2 border-dashed border-app rounded-3xl hover:bg-surface/10 hover:border-blue-500/50 transition-all">
                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                            <Icons.Upload className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className="text-[12px] font-bold text-app-muted">Toque p/ enviar foto</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </label>
                        </div>

                        {/* Core Metrics Grid styled soft & modern */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-surface border border-app rounded-2xl p-4 text-center space-y-2">
                                <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Peso (kg)</p>
                                <input
                                    type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)}
                                    className="w-full bg-transparent text-xl font-bold text-app text-center flex-1 outline-none placeholder:text-app/20"
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="bg-surface border border-app rounded-2xl p-4 text-center space-y-2">
                                <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Gordura (%)</p>
                                <input
                                    type="number" step="0.1" value={fat} onChange={e => setFat(e.target.value)}
                                    className="w-full bg-transparent text-xl font-bold text-app text-center flex-1 outline-none placeholder:text-app/20"
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="bg-surface border border-app rounded-2xl p-4 text-center space-y-2">
                                <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Massa M.</p>
                                <input
                                    type="number" step="0.1" value={lean} onChange={e => setLean(e.target.value)}
                                    className="w-full bg-transparent text-xl font-bold text-app text-center flex-1 outline-none placeholder:text-app/20"
                                    placeholder="0.0"
                                />
                            </div>
                        </div>

                        {/* Circular/Body Measurements */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em]">📏 Circunferências</p>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(measureLabels).filter(([k]) => !['peso', 'gordura', 'massaMagra'].includes(k)).map(([key, label]) => (
                                    <div key={key} className="flex justify-between items-center bg-surface border border-app rounded-2xl p-3">
                                        <p className="text-[9px] font-bold text-app-muted uppercase tracking-widest">{label.replace(/\s*\(.*\)/, '')}</p>
                                        <input
                                            type="number" step="0.1" value={measures[key] || ''} onChange={e => setMeasures(prev => ({ ...prev, [key]: e.target.value }))}
                                            className="w-16 bg-app text-xs font-bold text-app text-center py-1.5 rounded-lg outline-none placeholder:text-app/20 focus:ring-1 focus:ring-blue-500"
                                            placeholder="--"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-black text-app-muted uppercase tracking-[0.2em]">📝 Observações</p>
                            <textarea
                                value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                className="w-full bg-surface border border-app rounded-2xl p-4 text-sm font-medium text-app placeholder:text-app-muted focus:border-blue-500/50 outline-none resize-none"
                                placeholder="Como está indo o planejamento? Digite aqui..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit} disabled={submitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50 transition-all active:scale-[0.98] mt-6"
                        >
                            {submitting ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Salvando...</span>
                                </div>
                            ) : 'Registrar Medida'}
                        </button>
                    </div>
                ) : view === 'flex' ? (
                    /* RADAR FLEX VIEW */
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
                ) : (
                    /* Track Concept List UI */
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {loading ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="text-center py-24 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                                    <Icons.TrendingUp className="w-8 h-8 text-blue-500/50" />
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nenhum registro</p>
                            </div>
                        ) : (
                            <>
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
                                            onClick={handleExport}
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
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const BiometricChart: React.FC<{
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

export default Evolution;
