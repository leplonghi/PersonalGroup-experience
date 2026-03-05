import React, { useState, useEffect, useCallback } from 'react';
import { User, FrequencyReport, CheckInRecord } from '../types';
import { getFrequencyReport, exportToCSV } from '../firebase';
import { Icons } from '../constants';

interface FrequencyDashboardProps {
    user: User;
    onBack: () => void;
}

type Period = 'week' | 'month' | 'year';

const FrequencyDashboard: React.FC<FrequencyDashboardProps> = ({ user, onBack }) => {
    const [period, setPeriod] = useState<Period>('month');
    const [report, setReport] = useState<FrequencyReport | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const r = await getFrequencyReport(user.id, period);
            setReport(r);
        } catch (err) {
            console.error('Error fetching report:', err);
        }
        setLoading(false);
    }, [user.id, period]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleExport = () => {
        if (!report) return;
        const rows = report.checkIns.map(ci => ({
            Data: new Date(ci.timestamp).toLocaleDateString('pt-BR'),
            Hora: new Date(ci.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            Método: ci.method,
            Unidade: ci.gymId
        }));
        exportToCSV(rows, `frequencia_${period}_${user.name.replace(/\s/g, '_')}`);
    };

    const periodLabels: Record<Period, string> = {
        week: 'Semanal',
        month: 'Mensal',
        year: 'Anual'
    };

    // Generate simple bar chart data for last 7 days / 4 weeks / 12 months
    const getChartBars = (): { label: string; value: number; max: number }[] => {
        if (!report) return [];
        const checkIns = report.checkIns;

        if (period === 'week') {
            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const counts = new Array(7).fill(0);
            checkIns.forEach(ci => {
                const d = new Date(ci.timestamp).getDay();
                counts[d]++;
            });
            return days.map((label, i) => ({ label, value: counts[i], max: 3 }));
        }

        if (period === 'month') {
            const now = new Date();
            const weeks = [1, 2, 3, 4];
            const counts = new Array(4).fill(0);
            checkIns.forEach(ci => {
                const d = new Date(ci.timestamp);
                const weekIdx = Math.min(3, Math.floor((d.getDate() - 1) / 7));
                counts[weekIdx]++;
            });
            return weeks.map((w, i) => ({ label: `S${w}`, value: counts[i], max: 7 }));
        }

        // year
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const counts = new Array(12).fill(0);
        checkIns.forEach(ci => {
            const m = new Date(ci.timestamp).getMonth();
            counts[m]++;
        });
        return months.map((label, i) => ({ label, value: counts[i], max: 25 }));
    };

    const bars = getChartBars();
    const maxBar = bars.reduce((m, b) => Math.max(m, b.max), 1);

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest">Frequência</h1>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Relatório de Presença</p>
                </div>
                <button onClick={handleExport} disabled={!report || loading} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600/20 transition-all disabled:opacity-30">
                    <Icons.Save className="w-4 h-4 text-blue-400" />
                </button>
            </div>

            {/* Period Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {(['week', 'month', 'year'] as Period[]).map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.25em] transition-all ${period === p
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {periodLabels[p]}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : report ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-2xl font-black text-white tabular-nums">{report.totalSessions}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Presenças</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className={`text-2xl font-black tabular-nums ${report.attendanceRate >= 80 ? 'text-green-400' : report.attendanceRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                {report.attendanceRate}%
                            </p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Aderência</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-2xl font-black text-red-400 tabular-nums">{report.noShows}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Faltas</p>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            Distribuição — {periodLabels[period]}
                        </p>
                        <div className="flex items-end justify-between gap-1" style={{ height: 120 }}>
                            {bars.map((bar, i) => {
                                const heightPct = maxBar > 0 ? Math.max(4, (bar.value / maxBar) * 100) : 4;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[8px] font-black text-white tabular-nums">{bar.value || ''}</span>
                                        <div className="w-full relative rounded-t-sm overflow-hidden" style={{ height: `${heightPct}%`, minHeight: 3 }}>
                                            <div className={`absolute inset-0 bg-gradient-to-t ${bar.value > 0 ? 'from-blue-600 to-blue-400' : 'from-white/5 to-white/5'} rounded-t-sm transition-all duration-500`} />
                                        </div>
                                        <span className="text-[7px] font-bold text-slate-500">{bar.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Check-ins */}
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            Últimos Check-ins
                        </p>
                        {report.checkIns.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                                <p className="text-[10px] text-slate-500 font-bold">Nenhum check-in no período.</p>
                            </div>
                        ) : (
                            report.checkIns.slice(0, 10).map((ci, idx) => (
                                <div key={idx} className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                                        <Icons.Shield className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-white truncate">
                                            {new Date(ci.timestamp).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                                        </p>
                                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                            {new Date(ci.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {ci.method}
                                        </p>
                                    </div>
                                    <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                                        <span className="text-[7px] font-black text-green-400 uppercase tracking-widest">OK</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] hover:bg-blue-600/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Icons.Save className="w-4 h-4" />
                        Exportar CSV — {periodLabels[period]}
                    </button>
                </>
            ) : null}
        </div>
    );
};

export default FrequencyDashboard;
