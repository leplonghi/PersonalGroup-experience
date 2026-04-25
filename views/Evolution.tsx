import React, { useState, useEffect, useCallback } from 'react';
import { User, EvolutionEntry, UserRole } from '../types';
import { Icons } from '../constants';
import { getEvolutionEntries, exportToCSV } from '../firebase';
import { AddEvolutionEntry } from '../components/evolution/AddEvolutionEntry';
import { EvolutionFlexView } from '../components/evolution/EvolutionFlexView';
import { EvolutionMetricsView } from '../components/evolution/EvolutionMetricsView';
interface EvolutionProps {
    user: User;
    viewer?: User;
    onBack?: () => void;
}


const Evolution: React.FC<EvolutionProps> = ({ user, viewer, onBack }) => {
    const [entries, setEntries] = useState<EvolutionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'add' | 'flex'>('flex');

    const loadEntries = useCallback(async () => {
        setLoading(true);
        const data = await getEvolutionEntries(user.id);
        setEntries([...data].reverse());
        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    const actualViewer = viewer || user;
    const canAdd = actualViewer.role === UserRole.CHEFE || actualViewer.role === UserRole.ADMIN;

    const handleExport = () => {
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
            <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-50 bg-app backdrop-blur-md pt-4 pb-2 px-6 shadow-sm border-b border-app font-display">
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
                    <AddEvolutionEntry
                        user={user}
                        onSuccess={async () => {
                            setView('list');
                            await loadEntries();
                        }}
                    />
                ) : view === 'flex' ? (
                    <EvolutionFlexView user={user} />
                ) : (
                    <EvolutionMetricsView
                        entries={entries}
                        loading={loading}
                        onExport={handleExport}
                    />
                )}
            </div>
        </div>
    );
};

export default Evolution;
