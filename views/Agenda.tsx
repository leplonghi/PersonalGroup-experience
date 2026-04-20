
import React, { useState } from 'react';
import Card from '../components/Card';
import { User, WellnessService, UnifiedAgendaItem } from '../types';
import { Icons, WELLNESS_SERVICES_DATA, CLASS_SERVICES_DATA, TRAINING_SESSIONS_DATA } from '../constants';
import { bookWellness } from '../firebase';

interface AgendaProps {
  user: User;
  onBack: () => void;
}

const Agenda: React.FC<AgendaProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'WELLNESS' | 'CLASSES' | 'SESSIONS'>('WELLNESS');
  const [selectedService, setSelectedService] = useState<WellnessService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('16');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'SERVICES' | 'SCHEDULE' | 'CONFIRM'>('SERVICES');
  const [isProcessing, setIsProcessing] = useState(false);

  // Data for the current tab
  const services = activeTab === 'WELLNESS' ? WELLNESS_SERVICES_DATA : CLASS_SERVICES_DATA;

  const dates = [
    { label: 'SEG', day: '15', available: true },
    { label: 'TER', day: '16', available: true, active: true },
    { label: 'QUA', day: '17', available: true },
    { label: 'QUI', day: '18', available: true },
    { label: 'SEX', day: '19', available: true },
  ];

  const timeSlots = activeTab === 'WELLNESS'
    ? ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:30']
    : ['07:00', '12:00', '18:00', '19:00', '20:00'];

  const sessionsUsed = user.wellnessSessionsUsed || 0;
  const sessionsLeft = Math.max(0, 2 - sessionsUsed);
  const quotaExceeded = sessionsUsed >= 2;

  const handleBooking = async () => {
    if (!selectedService || !selectedTime || (activeTab === 'WELLNESS' && quotaExceeded)) return;
    setIsProcessing(true);
    try {
      await bookWellness(user.id, selectedService.id, selectedService.name, `2026-01-${selectedDate}`, selectedTime);
      setStep('CONFIRM');
    } catch (err: any) {
      alert(err?.message || 'Erro ao reservar.');
    }
    setIsProcessing(false);
  };

  const renderTabs = () => (
    <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 mb-4">
      <button
        onClick={() => { setActiveTab('WELLNESS'); setStep('SERVICES'); }}
        className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'WELLNESS' ? 'bg-white dark:bg-white/10 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
      >
        Spa & Recovery
      </button>
      <button
        onClick={() => { setActiveTab('CLASSES'); setStep('SERVICES'); }}
        className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'CLASSES' ? 'bg-white dark:bg-white/10 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
      >
        Aulas
      </button>
      <button
        onClick={() => setActiveTab('SESSIONS')}
        className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'SESSIONS' ? 'bg-white dark:bg-white/10 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
      >
        Meus Treinos
      </button>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-1 border-l-4 border-blue-600 pl-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">
          {activeTab === 'WELLNESS' ? 'Selecionar Serviço' : 'Escolher Modalidade'}
        </h3>
        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2 leading-none">
          {activeTab === 'WELLNESS' ? 'Recuperação e Bem-estar' : 'Treinos em Grupo'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map(service => {
          const IconComponent = Icons[service.icon as keyof typeof Icons] || Icons.Leaf;
          const isClass = activeTab === 'CLASSES';

          return (
            <div
              key={service.id}
              onClick={() => { setSelectedService(service as unknown as WellnessService); setStep('SCHEDULE'); }}
              className="glass-panel p-4 group relative overflow-hidden active:scale-[0.99] transition-all border-white/5 cursor-pointer"
            >
              <div className="flex items-center space-x-6 relative z-10">
                <div className={`w-14 h-14 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-xl group-hover:border-blue-600 transition-all ${isClass ? 'text-orange-500' : 'text-blue-500'}`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">{service.name}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 mb-2">{service.description}</p>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      <Icons.Clock className="w-3 h-3 mr-2" /> {service.duration}
                    </div>
                    {isClass && (service as any).capacity && (
                      <div className="flex items-center text-[9px] font-bold text-orange-500 uppercase tracking-widest leading-none">
                        <Icons.Users className="w-3 h-3 mr-2" /> { (service as any).instructor }
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Icons.ChevronRight className="w-12 h-12" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPersonalSessions = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-1 border-l-4 border-blue-600 pl-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Minha Agenda</h3>
        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2 leading-none">Sessões Programadas com Trainer</p>
      </div>

      <div className="space-y-4">
        {TRAINING_SESSIONS_DATA.map(session => (
          <div key={session.id} className="glass-panel p-4 border-white/10 relative overflow-hidden group">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                    Sessão Confirmada
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight uppercase mb-2">{session.title}</h4>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    <Icons.Calendar className="w-4 h-4 mr-3 text-blue-600" /> {session.date}
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    <Icons.Clock className="w-4 h-4 mr-3 text-blue-600" /> {session.time}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 flex items-center">
                  <Icons.User className="w-3 h-3 mr-2 text-slate-300" /> {session.instructor}
                </p>
              </div>
              <div className="w-12 h-12 border border-slate-200 dark:border-white/10 flex items-center justify-center bg-slate-50 dark:bg-white/5 shadow-inner">
                <Icons.Target className="w-6 h-6 text-slate-400" />
              </div>
            </div>
            {/* Design detail */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
          </div>
        ))}

        <button className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-2 group hover:border-blue-600/50 transition-all active:scale-[0.98]">
           <Icons.Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-600 dark:group-hover:text-white transition-colors">Solicitar Nova Sessão</span>
        </button>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex items-center space-x-4">
        <button onClick={() => setStep('SERVICES')} className="w-12 h-12 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-none">{selectedService?.name}</h3>
          <p className="text-[9px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] mt-3 leading-none">Agendar Sessão</p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-baseline justify-between px-1">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Escolha do Período</h4>
          <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">Janeiro 2026</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 snap-x">
          {dates.map(d => (
            <button
              key={d.day}
              onClick={() => setSelectedDate(d.day)}
              className={`snap-center min-w-[64px] h-20 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 relative group overflow-hidden ${selectedDate === d.day
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'bg-white border-slate-200 text-slate-500 dark:bg-white/5 dark:text-slate-400 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
            >
              {selectedDate === d.day && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-30"></div>
              )}
              <span className={`text-[9px] font-bold tracking-widest mb-1 uppercase ${selectedDate === d.day ? 'text-blue-100' : 'opacity-60'}`}>{d.label}</span>
              <span className="text-xl font-black tracking-tight relative z-10 leading-none">{d.day}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] px-1">Horários Disponíveis</h4>
        <div className="grid grid-cols-4 gap-3">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-4 rounded-xl border text-[10px] font-bold transition-all relative overflow-hidden ${selectedTime === time
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 dark:bg-white/5 dark:text-slate-400 dark:border-white/10 hover:border-blue-400/50'
                }`}
            >
              <span className="relative z-10">{time}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="pt-10">
        <button
          disabled={!selectedTime || isProcessing}
          onClick={handleBooking}
          className={`w-full h-16 font-black text-[11px] uppercase tracking-[0.6em] transition-all relative overflow-hidden group ${selectedTime && !isProcessing
            ? 'bg-blue-600 text-white active:scale-[0.98]'
            : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/5 cursor-not-allowed'
            }`}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <Icons.Calendar className="w-5 h-5" />
              <span>Confirmar Reserva</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 fade-in duration-1000">
      <div className="w-32 h-32 border-4 border-blue-600 bg-white/5 flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(37,99,235,0.3)] relative">
        <div className="absolute inset-0 border border-blue-600/50 animate-ping opacity-20"></div>
        <Icons.Shield className="w-14 h-14 text-blue-600" />
      </div>
      <h3 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-10 uppercase">Reserva<br /><span className="text-blue-600">Consolidada</span></h3>
      <div className="glass-panel p-10 w-full max-w-[340px] mb-16 border-white/10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-6 leading-none">Voucher de Identidade</p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-4 uppercase">{selectedService?.name}</h4>
        <div className="flex items-center justify-center space-x-4 mt-6 text-blue-500">
          <Icons.Calendar className="w-5 h-5" />
          <p className="text-sm font-bold uppercase tracking-[0.2em]">DIA {selectedDate} • {selectedTime}</p>
        </div>
      </div>
      <button onClick={onBack} className="w-full max-w-[300px] h-20 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.6em] transition-all hover:bg-blue-500 active:scale-[0.98] shadow-2xl">
        Concluir Operação
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative px-6">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>
      <div className="flex-1 pb-40 pt-0 relative z-10 no-scrollbar overflow-y-auto">
        {step !== 'CONFIRM' && renderTabs()}

        {/* Status Quota for Wellness */}
        {step === 'SERVICES' && activeTab === 'WELLNESS' && (
          <div className="glass-panel p-4 border-white/10 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Créditos Disponíveis</span>
              <Icons.Leaf className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-3">
              <span className={`text-5xl font-bold tracking-tight ${quotaExceeded ? 'text-red-400' : 'text-slate-900 dark:text-white'}`}>0{sessionsLeft}</span>
              <span className="text-lg font-bold text-slate-700 tracking-tight">/ 02 DISPONÍVEIS</span>
            </div>
            {quotaExceeded && (
              <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-4">Cota mensal atingida — Bloqueado até próximo mês</p>
            )}
            <div className="w-full h-1 bg-white/10 mt-10 relative">
               <div className={`h-full ${quotaExceeded ? 'bg-red-500' : 'bg-blue-600'} transition-all duration-1000`} style={{ width: `${(sessionsUsed / 2) * 100}%` }}></div>
            </div>
          </div>
        )}

        {step === 'SERVICES' && activeTab !== 'SESSIONS' && renderServices()}
        {step === 'SERVICES' && activeTab === 'SESSIONS' && renderPersonalSessions()}
        {step === 'SCHEDULE' && renderSchedule()}
        {step === 'CONFIRM' && renderConfirm()}
      </div>
    </div>
  );
};

export default Agenda;
