import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { GymConfig } from '../types';
import { getGymConfig, isGymOpen } from '../firebase';

type SessionType = 'TREINO' | 'AVALIACAO' | 'WELLNESS' | 'LIVRE';

interface AgendaSession {
  time: string;
  label: string;
  type: SessionType;
  status: string;
  duration?: string;
  instructor?: string;
  location?: string;
}

const Agenda: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(16);
  const [currentMonth, setCurrentMonth] = useState(0); // January 2026
  const [gymConfig, setGymConfig] = useState<GymConfig | null>(null);
  const [gymStatus, setGymStatus] = useState<{ open: boolean; closeAt?: string; reason?: string }>({ open: true });

  useEffect(() => {
    getGymConfig().then(cfg => {
      setGymConfig(cfg);
      setGymStatus(isGymOpen(cfg));
    });
  }, []);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDayHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Generate calendar days for current month
  const generateMonthDays = () => {
    const daysInMonth = 31; // January
    const firstDayOfMonth = 3; // Wednesday (0 = Sunday)
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: i === 16,
        isSelected: i === selectedDay,
        isPast: i < 16,
        hasEvents: [7, 9, 11, 15, 16, 18].includes(i)
      });
    }

    return days;
  };

  const sessions: AgendaSession[] = [
    { time: '07:00', label: 'Treino Personal', type: 'TREINO', status: 'Concluído', instructor: 'Prof. Ricardo', location: 'Pista 02' },
    { time: '09:00', label: 'Reavaliação Bio.', type: 'AVALIACAO', status: 'Confirmado', instructor: 'Coord. Felipe', location: 'Lab 01' },
    { time: '11:00', label: 'Horário Livre', type: 'LIVRE', status: 'Disponível' },
    { time: '15:30', label: 'Wellness', type: 'WELLNESS', status: 'Pendente', instructor: 'Dra. Ana', location: 'SPA 03' },
    { time: '18:00', label: 'Treino Personal', type: 'TREINO', status: 'Confirmado', instructor: 'Prof. Ricardo', location: 'Pista 02' },
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00'
  ];

  // Check if a time slot is within gym operating hours for the selected day
  const isTimeSlotOpen = (time: string) => {
    if (!gymConfig) return true;
    const dow = new Date(2026, currentMonth, selectedDay).getDay();
    let hours = gymConfig.hours.weekdays;
    if (dow === 6) hours = gymConfig.hours.saturday;
    else if (dow === 0) hours = gymConfig.hours.sunday;
    return time >= hours.open && time < hours.close;
  };

  const getSessionForTime = (time: string) => {
    return sessions.find(s => s.time.startsWith(time.split(':')[0]));
  };

  const getIconForType = (type: SessionType) => {
    switch (type) {
      case 'TREINO': return Icons.Dumbbell;
      case 'AVALIACAO': return Icons.Activity;
      case 'WELLNESS': return Icons.Leaf;
      case 'LIVRE': return Icons.Plus;
      default: return Icons.Calendar;
    }
  };

  const getStyleForType = (type: SessionType) => {
    switch (type) {
      case 'TREINO': return 'bg-gradient-to-r from-blue-600 to-blue-500 border-l-4 border-blue-700';
      case 'AVALIACAO': return 'bg-gradient-to-r from-cyan-600 to-cyan-500 border-l-4 border-cyan-700';
      case 'WELLNESS': return 'bg-gradient-to-r from-emerald-500 to-emerald-400 border-l-4 border-emerald-600';
      case 'LIVRE': return 'bg-white dark:bg-white/5 border-l-4 border-dashed border-blue-300 dark:border-white/20';
      default: return 'bg-slate-100 dark:bg-white/5 border-l-4 border-slate-300';
    }
  };

  const monthDays = generateMonthDays();

  return (
    <div className="min-h-screen bg-app flex transition-colors duration-500">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      {/* Google Calendar Style Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-white/5 border-r border-slate-200 dark:border-white/10 relative z-10 p-4 overflow-y-auto">
        {/* Mini Calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-blue-950 dark:text-white uppercase">
              {monthNames[currentMonth]}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentMonth(m => m - 1)}
                className="w-7 h-7 rounded-full hover:bg-blue-50 dark:hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <Icons.ChevronLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => setCurrentMonth(m => m + 1)}
                className="w-7 h-7 rounded-full hover:bg-blue-50 dark:hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <Icons.ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </div>

          {/* Compact Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDayHeaders.map((day, idx) => (
              <div key={idx} className="text-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Compact Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((dayInfo, idx) => (
              <button
                key={idx}
                onClick={() => dayInfo.day && setSelectedDay(dayInfo.day)}
                disabled={!dayInfo.isCurrentMonth || dayInfo.isPast}
                className={`aspect-square rounded-full text-[11px] font-semibold transition-all relative flex items-center justify-center ${!dayInfo.isCurrentMonth
                  ? 'text-transparent cursor-default'
                  : dayInfo.isSelected
                    ? 'bg-blue-600 text-white'
                    : dayInfo.isToday
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 font-bold'
                      : dayInfo.isPast
                        ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        : 'text-blue-900 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10'
                  }`}
              >
                {dayInfo.day}
                {dayInfo.hasEvents && dayInfo.isCurrentMonth && !dayInfo.isSelected && (
                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
            Meus Calendários
          </div>
          <button className="w-full px-3 py-2 rounded-lg text-left text-sm font-semibold text-blue-900 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
            Treinos
          </button>
          <button className="w-full px-3 py-2 rounded-lg text-left text-sm font-semibold text-blue-900 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
            Wellness
          </button>
          <button className="w-full px-3 py-2 rounded-lg text-left text-sm font-semibold text-blue-900 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-cyan-600"></div>
            Avaliações
          </button>
        </div>
      </aside>

      {/* Main Calendar View */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Bar */}
        <header className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-blue-950 dark:text-white">
                {new Date(2026, currentMonth, selectedDay).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              {/* Gym Status Indicator */}
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${gymStatus.open ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${gymStatus.open ? 'bg-green-500 shadow-[0_0_6px_#22C55E]' : 'bg-red-500 shadow-[0_0_6px_#EF4444]'}`} />
                <span>{gymStatus.open ? `Aberto até ${gymStatus.closeAt || '22:00'}` : 'Fechado'}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg text-xs font-bold text-blue-900 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/10 transition-all">
              Hoje
            </button>
          </div>
        </header>

        {/* Timeline View */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            {timeSlots.map((time, idx) => {
              const session = getSessionForTime(time);
              const Icon = session ? getIconForType(session.type) : Icons.Clock;
              const slotOpen = isTimeSlotOpen(time);

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-[5rem_1fr] border-t border-slate-200/50 dark:border-white/5 transition-opacity ${slotOpen ? '' : 'opacity-30'}`}
                  style={{ minHeight: '4rem' }}
                >
                  {/* Time Label */}
                  <div className="pt-2 pr-4 text-right">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {time}
                    </span>
                  </div>

                  {/* Event Area */}
                  <div className="py-2 pr-6 relative">
                    {session ? (
                      <div className={`
                        rounded-lg p-3 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md
                        ${getStyleForType(session.type)}
                      `}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`p-1 rounded ${session.type === 'LIVRE'
                                ? 'bg-blue-100 dark:bg-white/10 text-blue-600'
                                : 'bg-white/20 text-slate-900 dark:text-white'
                                }`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <h4 className={`text-sm font-bold truncate ${session.type === 'LIVRE'
                                ? 'text-blue-950 dark:text-slate-300'
                                : 'text-slate-900 dark:text-white'
                                }`}>
                                {session.label}
                              </h4>
                            </div>
                            {session.instructor && (
                              <p className={`text-[10px] font-semibold truncate ${session.type === 'LIVRE'
                                ? 'text-blue-700 dark:text-blue-400'
                                : 'text-slate-800 dark:text-white/80'
                                }`}>
                                {session.time} • {session.instructor} • {session.location}
                              </p>
                            )}
                          </div>
                          {session.type !== 'LIVRE' && (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase whitespace-nowrap ${session.status === 'Concluído'
                              ? 'bg-emerald-500/30 text-slate-900 dark:text-white' :
                              session.status === 'Confirmado'
                                ? 'bg-white/20 text-slate-900 dark:text-white' :
                                'bg-amber-500/30 text-amber-900 dark:text-amber-50'
                              }`}>
                              {session.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current time indicator */}
          <div className="absolute left-20 right-6 pointer-events-none" style={{ top: '35%' }}>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-midnight shadow-lg z-10"></div>
              <div className="flex-1 h-0.5 bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
