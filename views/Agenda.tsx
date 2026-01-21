
import React, { useState } from 'react';
import Card from '../components/Card';
import { Icons, COLORS } from '../constants';

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
      case 'TREINO': return 'bg-[#002B54] dark:bg-blue-600 text-white shadow-blue-900/10';
      case 'AVALIACAO': return 'bg-amber-600 text-white shadow-amber-600/10';
      case 'WELLNESS': return 'bg-rose-600 text-white shadow-rose-600/10';
      case 'LIVRE': return 'bg-white dark:bg-white/5 border-2 border-dashed border-slate-100 dark:border-white/10 text-slate-500 shadow-none';
      default: return 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white';
    }
  };

  const handleBooking = (time: string) => {
    alert(`Iniciando reserva para o horário: ${time}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
      {/* Header with Monthly Context */}
      <div className="px-6 pt-10 pb-6 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 dark:border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-none tracking-tight">Abril 2024</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">Unidade Jardins</p>
          </div>
          <button className="w-10 h-10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/10 active:scale-95 transition-all">
            <Icons.Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly Strip */}
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar py-2">
          {days.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => !item.past && setSelectedDay(item.day)}
              className={`flex-1 min-w-[54px] h-[72px] flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                item.day === selectedDay 
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xl shadow-blue-600/20 scale-105' 
                : item.past 
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-700 border border-slate-100 dark:border-transparent' 
                  : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 active:bg-slate-50'
              }`}
            >
              <span className={`text-[9px] font-black tracking-widest mb-1 ${item.day === selectedDay ? 'opacity-80' : 'opacity-60'}`}>{item.label}</span>
              <span className="text-lg font-black tracking-tight">{item.day}</span>
              {item.day === '16' && !item.active && <div className="w-1 h-1 bg-blue-600 dark:bg-white rounded-full mt-1"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Agenda Timeline */}
      <div className="px-6 py-8 space-y-2">
        {timeSlots.map((time, idx) => {
          const session = getSessionForTime(time);
          const hour = parseInt(time.split(':')[0]);
          const isPast = hour < 14; 

          return (
            <div key={idx} className="flex group min-h-[4.5rem]">
              {/* Time Column */}
              <div className="w-12 pt-1 flex flex-col items-center">
                <span className={`text-[10px] font-black ${isPast ? 'text-slate-300 dark:text-slate-800' : 'text-slate-900 dark:text-white/40'} tracking-tighter`}>
                  {time}
                </span>
                <div className="flex-1 w-[1px] bg-slate-100 dark:bg-white/5 my-2"></div>
              </div>

              {/* Slot Content */}
              <div className="flex-1 pb-4">
                {session ? (
                  <Card 
                    className={`${getStyleForType(session.type)} border-none p-4 relative group hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden shadow-sm`}
                  >
                    {session.type !== 'LIVRE' && (
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Icons.Clock className="w-12 h-12" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black tracking-tight">{session.label}</h4>
                        {session.type !== 'LIVRE' ? (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[9px] font-bold opacity-80 uppercase">{session.instructor}</span>
                            <span className="w-0.5 h-0.5 bg-current opacity-40"></span>
                            <span className="text-[9px] font-bold opacity-80 uppercase">{session.location}</span>
                          </div>
                        ) : (
                          <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wider">Toque para Reservar</p>
                        )}
                      </div>
                      
                      {session.type === 'LIVRE' ? (
                        <button 
                          onClick={() => handleBooking(time)}
                          className="w-8 h-8 bg-[#002B54] dark:bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform border border-white/20"
                        >
                          <Icons.Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${session.status === 'Concluído' ? 'bg-white/20 text-white' : 'bg-white text-[#002B54] dark:text-blue-600'}`}>
                          {session.status}
                        </span>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="h-full flex items-center px-2">
                    <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-24"></div>
    </div>
  );
};

export default Agenda;