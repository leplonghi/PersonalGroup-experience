
import React, { useState } from 'react';
import { Icons } from '../constants';

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
  const [selectedDay, setSelectedDay] = useState('16');

  const days = [
    { label: 'SEG', day: '15', past: true },
    { label: 'TER', day: '16', active: true },
    { label: 'QUA', day: '17' },
    { label: 'QUI', day: '18' },
    { label: 'SEX', day: '19' },
    { label: 'SAB', day: '20' },
  ];

  const sessions: AgendaSession[] = [
    { time: '07:00', label: 'Personal Treino', type: 'TREINO', status: 'Concluído', instructor: 'Prof. Ricardo', location: 'Pista 02' },
    { time: '09:00', label: 'Reavaliação Bio.', type: 'AVALIACAO', status: 'Confirmado', instructor: 'Coord. Felipe', location: 'Lab 01' },
    { time: '11:00', label: 'Vaga Livre', type: 'LIVRE', status: 'Disponível' },
    { time: '15:30', label: 'Wellness SPA', type: 'WELLNESS', status: 'Pendente', instructor: 'Dra. Ana', location: 'SPA 03' },
    { time: '18:00', label: 'Personal Treino', type: 'TREINO', status: 'Confirmado', instructor: 'Prof. Ricardo', location: 'Pista 02' },
  ];

  const timeSlots = [
    '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
  ];

  const getSessionForTime = (time: string) => {
    return sessions.find(s => s.time.startsWith(time.split(':')[0]));
  };

  const getStyleForType = (type: SessionType) => {
    switch (type) {
      case 'TREINO': return 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white';
      case 'AVALIACAO': return 'bg-amber-600 border-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.2)] text-white';
      case 'WELLNESS': return 'bg-emerald-600 border-emerald-500 shadow-[0_0_20px_rgba(5,150,105,0.2)] text-white';
      case 'LIVRE': return 'bg-slate-50 border border-dashed border-slate-300 dark:bg-white/5 dark:border-white/10 text-slate-500';
      default: return 'bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10 text-slate-900 dark:text-white';
    }
  };

  const handleBooking = (time: string) => {
    alert(`Iniciando reserva de protocolo para: ${time}`);
  };

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <div className="relative z-10 pt-4 px-8 pb-32 max-w-md mx-auto w-full">

        {/* Weekly Strip - Sharp Precision */}
        <div className="flex space-x-2 mb-16 overflow-x-auto no-scrollbar">
          {days.map((item, idx) => (
            <button
              key={idx}
              onClick={() => !item.past && setSelectedDay(item.day)}
              className={`min-w-[70px] h-24 flex flex-col items-center justify-center border transition-all duration-500 ${item.day === selectedDay
                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] relative z-10'
                : item.past
                  ? 'bg-slate-50 border-transparent text-slate-400 dark:bg-white/5 dark:text-slate-500 opacity-40'
                  : 'bg-white border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/5 dark:text-slate-500 hover:border-blue-500/30'
                }`}
            >
              <span className={`text-[8px] font-black tracking-widest mb-2 uppercase ${item.day === selectedDay ? 'text-white' : 'opacity-40'}`}>{item.label}</span>
              <span className="text-2xl font-black tracking-tighter italic leading-none">{item.day}</span>
            </button>
          ))}
        </div>

        {/* Main Agenda Timeline */}
        <div className="space-y-4">
          {timeSlots.map((time, idx) => {
            const session = getSessionForTime(time);
            const hour = parseInt(time.split(':')[0]);
            const isPast = hour < 12;

            return (
              <div key={idx} className={`flex group transition-all duration-300 ${isPast ? 'opacity-30' : ''}`}>
                <div className="w-16 pt-3 flex flex-col items-center">
                  <span className={`text-[10px] font-black tracking-tighter italic ${session ? 'text-blue-500' : 'text-slate-700'}`}>
                    {time}
                  </span>
                  <div className="flex-1 w-[1px] bg-slate-200 dark:bg-white/5 my-4"></div>
                </div>

                <div className="flex-1 pb-6">
                  {session ? (
                    <div className={`${getStyleForType(session.type)} border p-6 relative group transition-all cursor-pointer overflow-hidden active:scale-[0.99]`}>
                      <div className="flex justify-between items-center relative z-10">
                        <div>
                          <h4 className="text-lg font-black tracking-tight leading-none uppercase italic">{session.label}</h4>
                          {session.type !== 'LIVRE' ? (
                            <div className="flex flex-col space-y-2 mt-4">
                              <span className="text-[9px] font-black uppercase tracking-widest flex items-center opacity-80">
                                <Icons.User className="w-3 h-3 mr-2 text-blue-300" /> {session.instructor}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-widest flex items-center opacity-60">
                                <Icons.MapPin className="w-3 h-3 mr-2" /> {session.location}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[9px] font-black opacity-60 mt-3 uppercase tracking-[0.2em] italic">Disponível para Reserva</p>
                          )}
                        </div>

                        {session.type === 'LIVRE' ? (
                          <button
                            onClick={() => handleBooking(time)}
                            className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center shadow-[0_0_15px_#2563EB] active:scale-90 transition-transform"
                          >
                            <Icons.Plus className="w-5 h-5" />
                          </button>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className={`text-[8px] font-black px-3 py-1 border uppercase tracking-widest ${session.status === 'Concluído' ? 'border-white/20 bg-white/10 text-white' : 'bg-white text-slate-900 border-slate-200'}`}>
                              {session.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center px-4">
                      <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
