
import React, { useState, useEffect } from 'react';
import { User, TimelineEntry, TimelineEntryType } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';
import { getTimeline } from '../firebase';

interface TimelineProps {
  user: User;
  onBack: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ user, onBack }) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const data = await getTimeline(user.id);
        if (data.length === 0) {
          setEntries([
            {
              id: '1',
              userId: user.id,
              type: 'SESSION_COMPLETE',
              referenceId: 'sess_1',
              date: 'Hoje',
              message: 'Sessão de Membros Inferiores concluída.',
              details: 'RPE Médio: 8 • Volume Total: 1.450kg'
            },
            {
              id: '2',
              userId: user.id,
              type: 'HEALTH_ALERT',
              referenceId: 'alert_1',
              date: 'Ontem',
              message: 'Alerta de Esforço: RPE 10 detectado.',
              details: 'Governança sugere repouso absoluto nas próximas 24h.'
            },
            {
              id: '3',
              userId: user.id,
              type: 'WELLNESS_BOOKED',
              referenceId: 'well_1',
              date: 'Ontem',
              message: 'Agendamento de SPA e Recuperação.',
              details: 'Confirmado para 16/04 às 15:30.'
            },
            {
              id: '4',
              userId: user.id,
              type: 'CYCLE_START',
              referenceId: 'cycle_2',
              date: '12 Abr',
              message: 'Ciclo Ativado: Hipertrofia II.',
              details: 'Foco: Densidade e Cadência Controlada.'
            },
            {
              id: '5',
              userId: user.id,
              type: 'ASSESSMENT_COMPLETE',
              referenceId: 'ass_2',
              date: '10 Abr',
              message: 'Avaliação Periódica validada.',
              details: 'Ganho de 0.8kg de Massa Magra. Status: Liberado.'
            }
          ]);
        } else {
          setEntries(data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, [user.id]);

  const getEntryIcon = (type: TimelineEntryType) => {
    switch (type) {
      case 'SESSION_COMPLETE': return <Icons.Clock className="w-4 h-4" />;
      case 'ASSESSMENT_COMPLETE': return <Icons.Shield className="w-4 h-4" />;
      case 'WELLNESS_BOOKED': return <Icons.Plus className="w-4 h-4" />;
      case 'CYCLE_START': return <Icons.Chart className="w-4 h-4" />;
      case 'HEALTH_ALERT': return <Icons.Shield className="w-4 h-4" />;
      default: return <Icons.TrendingUp className="w-4 h-4" />;
    }
  };

  const getEntryColor = (type: TimelineEntryType) => {
    switch (type) {
      case 'SESSION_COMPLETE': return 'bg-blue-900 dark:bg-blue-600 text-white';
      case 'ASSESSMENT_COMPLETE': return 'bg-amber-500 text-white';
      case 'WELLNESS_BOOKED': return 'bg-teal-500 text-white';
      case 'CYCLE_START': return 'bg-blue-600 text-white';
      case 'HEALTH_ALERT': return 'bg-red-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex flex-col animate-in fade-in duration-500 transition-colors">
      <header className="px-6 pt-14 pb-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md z-50">
        <button onClick={onBack} className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl mr-4 active:scale-90 transition-all text-slate-400 dark:text-slate-600">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="text-center flex-1 pr-10">
          <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-[0.25em]">Minha Jornada</h2>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.4em] mt-1.5 leading-none">Histórico Exclusive</p>
        </div>
      </header>

      <div className="flex-1 px-8 py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
             <div className="w-12 h-12 border-4 border-blue-50 dark:border-white/5 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">Compilando Legado...</p>
          </div>
        ) : (
          <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-100 dark:bg-white/5"></div>

            {entries.map((entry, idx) => (
              <div key={entry.id} className="relative flex items-start animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Connector Icon */}
                <div className={`shrink-0 w-10 h-10 rounded-2xl z-10 flex items-center justify-center shadow-lg border-4 border-white dark:border-[#020617] ${getEntryColor(entry.type)}`}>
                  {getEntryIcon(entry.type)}
                </div>

                {/* Content Card */}
                <div className="ml-6 flex-1 pt-1">
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em]">{entry.date}</span>
                    <span className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">{entry.type.replace('_', ' ')}</span>
                  </div>
                  <Card className={`p-6 border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-[#0F172A] ${entry.type === 'HEALTH_ALERT' ? 'border-red-100 dark:border-red-900/30 bg-red-50/20' : ''}`}>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-2 tracking-tight">{entry.message}</h4>
                    {entry.details && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic leading-relaxed uppercase tracking-tighter">
                        {entry.details}
                      </p>
                    )}
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="p-10 text-center bg-slate-50/30 dark:bg-white/5 border-t border-slate-50 dark:border-white/5">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] leading-none mb-2">Governança Técnica Exclusive</p>
        <p className="text-[8px] font-bold text-slate-200 dark:text-slate-800 uppercase tracking-[0.6em]">Dados Sincronizados e Imutáveis</p>
      </footer>
    </div>
  );
};

export default Timeline;
