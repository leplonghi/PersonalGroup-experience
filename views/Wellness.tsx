
import React, { useState } from 'react';
import Card from '../components/Card';
import { User, WellnessService, WellnessBooking } from '../types';
import { Icons } from '../constants';

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

  const services: WellnessService[] = [
    { 
      id: 's1', 
      name: 'Massagem Relaxante', 
      description: 'Foco em redução de cortisol e relaxamento muscular profundo.',
      duration: '50 min',
      icon: 'leaf'
    },
    { 
      id: 's2', 
      name: 'Deep Tissue (Recuperação)', 
      description: 'Liberação de trigger points e melhora da circulação pós-treino intenso.',
      duration: '60 min',
      icon: 'shield'
    },
    { 
      id: 's3', 
      name: 'Liberação Miofascial Técnica', 
      description: 'Aumento da amplitude de movimento e redução de tensões fasciais.',
      duration: '45 min',
      icon: 'chart'
    },
    { 
      id: 's4', 
      name: 'Drenagem Linfática', 
      description: 'Redução de edema e otimização do sistema linfático.',
      duration: '50 min',
      icon: 'shield'
    }
  ];

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
    <div className="space-y-6 animate-fade-in">
      <div className="px-1">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Selecione o Serviço</h3>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Sua jornada de recuperação</p>
      </div>
      
      <div className="space-y-4">
        {services.map(service => (
          <Card 
            key={service.id}
            variant="flat"
            onClick={() => { setSelectedService(service); setStep('SCHEDULE'); }}
            className="p-6 bg-white dark:bg-[#0F172A] border-slate-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-[20px] flex items-center justify-center text-blue-600 dark:text-blue-400">
                {service.icon === 'leaf' && <Icons.Leaf className="w-7 h-7" />}
                {service.icon === 'shield' && <Icons.Shield className="w-7 h-7" />}
                {service.icon === 'chart' && <Icons.Chart className="w-7 h-7" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{service.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1 line-clamp-2 uppercase tracking-tighter">{service.description}</p>
              </div>
            </div>
            <div className="text-right ml-4">
               <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{service.duration}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-10 animate-fade-in">
      <header className="flex items-center space-x-4">
        <button onClick={() => setStep('SERVICES')} className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">{selectedService?.name}</h3>
          <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mt-1.5">{selectedService?.duration}</p>
        </div>
      </header>

      {/* Date Picker */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Escolha o Dia</h4>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {dates.map(d => (
            <button 
              key={d.day}
              onClick={() => setSelectedDate(d.day)}
              className={`min-w-[68px] h-[88px] flex flex-col items-center justify-center rounded-[24px] transition-all duration-300 ${
                selectedDate === d.day 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105' 
                  : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-white/10'
              }`}
            >
              <span className="text-[9px] font-black mb-1.5 uppercase opacity-60 tracking-widest">{d.label}</span>
              <span className="text-lg font-black tracking-tight">{d.day}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Time Picker */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Horário de Pista</h4>
        <div className="grid grid-cols-4 gap-3">
          {timeSlots.map(time => (
            <button 
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-4 rounded-2xl text-[11px] font-black transition-all border ${
                selectedTime === time 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-lg scale-105' 
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/10'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </section>

      <div className="pt-8">
        <button 
          disabled={!selectedTime || isProcessing}
          onClick={handleBooking}
          className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.25em] shadow-2xl transition-all flex items-center justify-center space-x-3 ${
            selectedTime && !isProcessing
              ? 'blue-gradient text-white shadow-blue-900/40 active:scale-95' 
              : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-700 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Icons.Calendar className="w-5 h-5" />
              <span>Confirmar Reserva</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-500 text-white rounded-[36px] flex items-center justify-center mb-10 shadow-3xl shadow-green-500/30">
        <Icons.Shield className="w-12 h-12" />
      </div>
      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">RESERVA<br/>CONFIRMADA</h3>
      <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[40px] w-full max-w-[280px] mb-12 border border-slate-100 dark:border-white/10">
         <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Seu Horário no SPA</p>
         <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-2">{selectedService?.name}</h4>
         <p className="text-base font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Dia {selectedDate} às {selectedTime}</p>
      </div>
      <button 
        onClick={onBack}
        className="w-full max-w-[280px] py-6 blue-gradient text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
      >
        Voltar à Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex flex-col animate-fade-in relative transition-colors duration-500">
      
      {/* PREMIUM HEADER - CONSISTENTE */}
      <header className="px-8 pt-14 pb-8 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl z-50 border-b border-slate-50 dark:border-white/5">
        <div>
          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-1.5">Wellness Center</p>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">Recovery & Spa</h1>
        </div>
        <button onClick={onBack} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/10 active:scale-90 transition-transform">
           <Icons.ChevronRight className="w-6 h-6 text-slate-400 rotate-180" />
        </button>
      </header>

      <div className="flex-1 px-8 py-10 pb-40 overflow-y-auto no-scrollbar">
        {/* Status Section - Always visible unless confirmed */}
        {step !== 'CONFIRM' && (
          <Card variant="flat" className="p-8 bg-slate-50 dark:bg-[#0F172A] border-none mb-12 shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessões Disponíveis</span>
              <Icons.Leaf className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">01</span>
              <span className="text-xl font-black text-slate-300 dark:text-slate-700">/ 02 exclusivas</span>
            </div>
            <div className="w-full h-1.5 bg-white dark:bg-white/5 rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-blue-600 w-[50%] rounded-full"></div>
            </div>
          </Card>
        )}

        {step === 'SERVICES' && renderServices()}
        {step === 'SCHEDULE' && renderSchedule()}
        {step === 'CONFIRM' && renderConfirm()}
      </div>
    </div>
  );
};

export default Wellness;
