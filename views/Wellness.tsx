
import React, { useState } from 'react';
import Card from '../components/Card';
import { User, WellnessService, WellnessBooking } from '../types';
import { Icons, WELLNESS_SERVICES_DATA } from '../constants';

interface WellnessProps {
  user: User;
  onBack: () => void;
}

const Wellness: React.FC<WellnessProps> = ({ user, onBack }) => {
  const [selectedService, setSelectedService] = useState<WellnessService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('16');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'SERVICES' | 'SCHEDULE' | 'CONFIRM'>('SERVICES');
  const [isProcessing, setIsProcessing] = useState(false);

  // Using real data from constants
  const services = WELLNESS_SERVICES_DATA;

  const dates = [
    { label: 'SEG', day: '15', available: true },
    { label: 'TER', day: '16', available: true, active: true },
    { label: 'QUA', day: '17', available: true },
    { label: 'QUI', day: '18', available: true },
    { label: 'SEX', day: '19', available: true },
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:30'];

  const handleBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('CONFIRM');
    }, 1500);
  };

  const renderServices = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-1 border-l-4 border-blue-600 pl-6">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Selecionar Serviço</h3>
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2 leading-none">Recuperação e Bem-estar</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map(service => {
          // Dynamic icon rendering
          const IconComponent = Icons[service.icon as keyof typeof Icons] || Icons.Leaf;

          return (
            <div
              key={service.id}
              onClick={() => { setSelectedService(service as unknown as WellnessService); setStep('SCHEDULE'); }}
              className="glass-panel p-8 group relative overflow-hidden active:scale-[0.99] transition-all border-white/5 cursor-pointer"
            >
              <div className="flex items-center space-x-6 relative z-10">
                <div className="w-14 h-14 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-blue-500 shadow-xl group-hover:border-blue-600 transition-all">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight uppercase">{service.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-3">{service.description}</p>
                  <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    <Icons.Clock className="w-3 h-3 mr-2" /> {service.duration}
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

  const renderSchedule = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex items-center space-x-6">
        <button onClick={() => setStep('SERVICES')} className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-95 transition-all">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-none">{selectedService?.name}</h3>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-3">Agendar Sessão</p>
        </div>
      </header>

      {/* Date Picker */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between px-1">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Escolha do Período</h4>
          <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">Janeiro 2026</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {dates.map(d => (
            <button
              key={d.day}
              onClick={() => setSelectedDate(d.day)}
              className={`min-w-[80px] h-24 flex flex-col items-center justify-center border transition-all duration-500 relative ${selectedDate === d.day
                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                : 'bg-white border-slate-200 text-slate-600 dark:bg-white/5 dark:text-slate-600 dark:border-white/5'
                }`}
            >
              <span className="text-[9px] font-bold mb-2 uppercase opacity-60 tracking-widest relative z-10">{d.label}</span>
              <span className="text-2xl font-bold tracking-tight relative z-10">{d.day}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Time Picker */}
      <section className="space-y-8">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] px-1">Horários Disponíveis</h4>
        <div className="grid grid-cols-4 gap-3">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-5 border text-[10px] font-bold transition-all ${selectedTime === time
                ? 'bg-white text-black border-white shadow-[0_0_20px_white] scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-800 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
                }`}
            >
              {time}
            </button>
          ))}
        </div>
      </section>

      <div className="pt-10">
        <button
          disabled={!selectedTime || isProcessing}
          onClick={handleBooking}
          className={`w-full h-20 font-black text-[11px] uppercase tracking-[0.6em] transition-all relative overflow-hidden group ${selectedTime && !isProcessing
            ? 'bg-blue-600 text-white active:scale-[0.98]'
            : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/5 cursor-not-allowed'
            }`}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <>
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
              <div className="flex items-center justify-center space-x-4 relative z-10">
                <Icons.Calendar className="w-5 h-5" />
                <span>Confirmar Reserva</span>
              </div>
            </>
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

      <button
        onClick={onBack}
        className="w-full max-w-[300px] h-20 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.6em] transition-all hover:bg-blue-500 active:scale-[0.98] shadow-2xl"
      >
        Concluir Operação
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative p-8">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <div className="flex-1 pb-40 pt-4 relative z-10 no-scrollbar overflow-y-auto">

        {/* Status Section */}
        {step !== 'CONFIRM' && (
          <div className="glass-panel p-10 border-white/10 mb-12">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Créditos Disponíveis</span>
              <Icons.Leaf className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-6xl font-bold text-slate-900 dark:text-white tracking-tight">01</span>
              <span className="text-xl font-bold text-slate-700 tracking-tight">/ 02 DISPONÍVEIS</span>
            </div>
            <div className="w-full h-1 bg-white/10 mt-10 relative">
              <div className="h-full bg-blue-600 w-[50%] shadow-[0_0_10px_#2563EB]"></div>
            </div>
          </div>
        )}

        {step === 'SERVICES' && renderServices()}
        {step === 'SCHEDULE' && renderSchedule()}
        {step === 'CONFIRM' && renderConfirm()}
      </div>
    </div>
  );
};

export default Wellness;
