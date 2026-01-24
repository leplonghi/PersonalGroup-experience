
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
              details: 'Recomendação de repouso absoluto nas próximas 24h.'
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
              message: 'Novo Ciclo: Hipertrofia II.',
              details: 'Foco: Densidade e Cadência Controlada.'
            },
            {
              id: '5',
              userId: user.id,
              type: 'ASSESSMENT_COMPLETE',
              referenceId: 'ass_2',
              date: '10 Abr',
              message: 'Avaliação de Rotina concluída.',
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
      case 'SESSION_COMPLETE': return <Icons.Clock className="w-5 h-5" />;
      case 'ASSESSMENT_COMPLETE': return <Icons.Shield className="w-5 h-5" />;
      case 'WELLNESS_BOOKED': return <Icons.Plus className="w-5 h-5" />;
      case 'CYCLE_START': return <Icons.Chart className="w-5 h-5" />;
      case 'HEALTH_ALERT': return <Icons.Shield className="w-5 h-5" />;
      default: return <Icons.TrendingUp className="w-5 h-5" />;
    }
  };

  const getEntryColor = (type: TimelineEntryType) => {
    switch (type) {
      case 'SESSION_COMPLETE': return 'bg-blue-600 shadow-[0_0_15px_#2563EB]';
      case 'ASSESSMENT_COMPLETE': return 'bg-amber-500 shadow-[0_0_15px_#F59E0B]';
      case 'WELLNESS_BOOKED': return 'bg-emerald-500 shadow-[0_0_15px_#10B981]';
      case 'CYCLE_START': return 'bg-indigo-600 shadow-[0_0_15px_#4F46E5]';
      case 'HEALTH_ALERT': return 'bg-red-600 shadow-[0_0_15px_#DC2626]';
      default: return 'bg-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 overflow-x-hidden relative">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <main className="flex-1 px-8 pt-4 pb-32 max-w-md mx-auto w-full relative z-10">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] space-y-8 animate-pulse">
            <div className="w-12 h-12 border border-blue-600 border-t-white animate-spin"></div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">Carregando Histórico...</p>
          </div>
        ) : (
          <div className="relative">
            {/* Real Timeline Vertical Track - Tech Style */}
            <div className="absolute left-[23px] top-6 bottom-6 w-px bg-slate-200 dark:bg-white/5">
              <div className="absolute inset-0 bg-blue-600/10"></div>
            </div>

            <div className="space-y-16">
              {entries.map((entry, idx) => (
                <div key={entry.id} className="relative flex items-start group animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>

                  {/* Connector Node - Sharp */}
                  <div className={`shrink-0 w-12 h-12 z-10 flex items-center justify-center border border-black text-white transition-all duration-500 group-hover:scale-110 ${getEntryColor(entry.type)}`}>
                    {getEntryIcon(entry.type)}
                  </div>

                  {/* Content Experience */}
                  <div className="ml-8 flex-1">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">{entry.date}</span>
                      <div className="border border-slate-200 dark:border-white/10 px-3 py-0.5 bg-slate-50 dark:bg-white/5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">{entry.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className={`glass-panel p-8 border-slate-200 dark:border-white/5 transition-all duration-500 group-hover:border-blue-600/30 ${entry.type === 'HEALTH_ALERT' ? 'border-red-600/20 bg-red-600/5' : ''}`}>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight uppercase">{entry.message}</h4>
                      {entry.details && (
                        <div className="flex items-start space-x-3">
                          <div className="w-1 h-3 bg-blue-600 mt-1"></div>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                            {entry.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="p-16 text-center border-t border-white/5 relative z-10">
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] mb-4">Histórico Personal Group</p>
        <div className="flex justify-center items-center space-x-4 opacity-20">
          <div className="w-1 h-1 bg-blue-600"></div>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">Sincronizado</p>
          <div className="w-1 h-1 bg-blue-600"></div>
        </div>
      </footer>
    </div>
  );
};

export default Timeline;
