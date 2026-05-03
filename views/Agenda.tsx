
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

  const jumpToTab = (tab: 'WELLNESS' | 'CLASSES' | 'SESSIONS') => {
    setActiveTab(tab);
    setStep('SERVICES');
  };

  const renderTabs = () => (
    <div className="flex p-1 bg-white/5 rounded-xl border border-white/[0.06] mb-6">
      <button
        onClick={() => { setActiveTab('WELLNESS'); setStep('SERVICES'); }}
        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'WELLNESS' ? 'bg-white/10 text-pg-cobalt shadow-sm' : 'text-white/40 hover:text-white/70'}`}
      >
        Bem-estar
      </button>
      <button
        onClick={() => { setActiveTab('CLASSES'); setStep('SERVICES'); }}
        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'CLASSES' ? 'bg-white/10 text-pg-cobalt shadow-sm' : 'text-white/40 hover:text-white/70'}`}
      >
        Aulas em grupo
      </button>
      <button
        onClick={() => setActiveTab('SESSIONS')}
        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'SESSIONS' ? 'bg-white/10 text-pg-cobalt shadow-sm' : 'text-white/40 hover:text-white/70'}`}
      >
        Meus Treinos
      </button>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-1 border-l-4 border-pg-cobalt pl-4">
        <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
          {activeTab === 'WELLNESS' ? 'Escolher serviço' : 'Escolher aula'}
        </h3>
        <p className="text-[9px] font-bold text-pg-cobalt uppercase tracking-[0.3em] mt-2 leading-none">
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
              className="p-4 rounded-2xl border border-white/[0.06] group relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
            >
              <div className="flex items-center space-x-6 relative z-10">
                <div className={`w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shadow-xl group-hover:border-pg-cobalt/50 transition-all ${isClass ? 'text-orange-400' : 'text-pg-cobalt'}`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-white tracking-tight uppercase">{service.name}</h4>
                  <p className="text-[11px] text-white/50 mt-1 mb-2">{service.description}</p>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">
                      <Icons.Clock className="w-3 h-3 mr-2" /> {service.duration}
                    </div>
                    {isClass && (service as any).capacity && (
                      <div className="flex items-center text-[9px] font-bold text-orange-400 uppercase tracking-widest leading-none">
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
      <div className="px-1 border-l-4 border-pg-cobalt pl-4">
        <h3 className="text-xl font-bold text-white tracking-tight uppercase">Minha Agenda</h3>
        <p className="text-[9px] font-bold text-pg-cobalt uppercase tracking-[0.3em] mt-2 leading-none">Sessões Programadas com Trainer</p>
      </div>

      <div className="space-y-4">
        {TRAINING_SESSIONS_DATA.map(session => (
          <div key={session.id} className="p-4 rounded-2xl border border-white/[0.06] relative overflow-hidden group"
               style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="px-3 py-1 bg-pg-cobalt/10 border border-pg-cobalt/20 text-pg-cobalt text-[9px] font-black uppercase tracking-widest rounded-full">
                    Agendado ✓
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight uppercase mb-2">{session.title}</h4>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                    <Icons.Calendar className="w-4 h-4 mr-3 text-pg-cobalt" /> {session.date}
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                    <Icons.Clock className="w-4 h-4 mr-3 text-pg-cobalt" /> {session.time}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-6 flex items-center">
                  <Icons.User className="w-3 h-3 mr-2 text-white/20" /> {session.instructor}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 shadow-inner">
                <Icons.Target className="w-6 h-6 text-white/30" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-pg-cobalt/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
          </div>
        ))}

        <button className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-2 group hover:border-pg-cobalt/30 transition-all active:scale-[0.98]">
           <Icons.Plus className="w-5 h-5 text-white/20 group-hover:text-pg-cobalt transition-colors" />
           <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">Solicitar Nova Sessão</span>
        </button>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex items-center space-x-4">
        <button onClick={() => setStep('SERVICES')} className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-95 transition-all">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight uppercase leading-none">{selectedService?.name}</h3>
          <p className="text-[9px] font-bold text-pg-cobalt uppercase tracking-[0.3em] mt-3 leading-none">Agendar Sessão</p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-baseline justify-between px-1">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Escolha do Período</h4>
          <span className="text-[8px] font-bold text-pg-cobalt uppercase tracking-widest">Janeiro 2026</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 snap-x">
          {dates.map(d => (
            <button
              key={d.day}
              onClick={() => setSelectedDate(d.day)}
              className={`snap-center min-w-[64px] h-20 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 relative group overflow-hidden ${selectedDate === d.day
                ? 'bg-pg-cobalt border-pg-cobalt text-white shadow-lg shadow-pg-cobalt/30 scale-105'
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
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
        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] px-1">Horários Disponíveis</h4>
        <div className="grid grid-cols-4 gap-3">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-4 rounded-xl border text-[10px] font-bold transition-all relative overflow-hidden ${selectedTime === time
                ? 'bg-pg-cobalt border-pg-cobalt text-white shadow-md shadow-pg-cobalt/30 scale-[1.02]'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-pg-cobalt/40'
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
          className={`w-full h-16 font-black text-[11px] uppercase tracking-[0.6em] transition-all relative overflow-hidden group rounded-2xl ${selectedTime && !isProcessing
            ? 'bg-pg-cobalt text-white active:scale-[0.98]'
            : 'bg-white/5 text-white/30 border border-white/[0.06] cursor-not-allowed'
            }`}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin mx-auto"></div>
          ) : (
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <Icons.Calendar className="w-5 h-5" />
              <span>Agendar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 fade-in duration-1000">
      <div className="w-32 h-32 rounded-3xl border-4 border-pg-cobalt bg-white/5 flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(0,182,253,0.3)] relative">
        <div className="absolute inset-0 border border-pg-cobalt/50 animate-ping opacity-20 rounded-3xl"></div>
        <Icons.Shield className="w-14 h-14 text-pg-cobalt" />
      </div>
      <h3 className="text-5xl font-bold text-white tracking-tight leading-none mb-10 uppercase">Sessão<br /><span className="text-pg-cobalt">agendada! ✓</span></h3>
      <div className="p-10 w-full max-w-[340px] mb-16 rounded-3xl border border-white/[0.06]"
           style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6 leading-none">Voucher de Identidade</p>
        <h4 className="text-lg font-bold text-white leading-tight mb-4 uppercase">{selectedService?.name}</h4>
        <div className="flex items-center justify-center space-x-4 mt-6 text-pg-cobalt">
          <Icons.Calendar className="w-5 h-5" />
          <p className="text-sm font-bold uppercase tracking-[0.2em]">DIA {selectedDate} • {selectedTime}</p>
        </div>
      </div>
      <button onClick={onBack} className="w-full max-w-[300px] h-20 bg-pg-cobalt text-white font-black text-[11px] uppercase tracking-[0.6em] transition-all hover:bg-pg-cobalt/80 active:scale-[0.98] shadow-2xl rounded-2xl">
        Concluir Operação
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-5 pb-32 space-y-6 animate-in fade-in duration-700"
         style={{ background: 'linear-gradient(180deg, #010b2e 0%, #00060f 40%, #010e35 100%)' }}>

      {/* Header */}
      <div className="pt-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Agenda<span className="text-pg-cobalt">.</span></h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mt-1">Seus compromissos e bem-estar</p>
        </div>
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Icons.ChevronLeft className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => jumpToTab('WELLNESS')}
          className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
            <Icons.Droplet className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white">Wellness</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Spa e recuperação</p>
        </button>

        <button
          onClick={() => jumpToTab('CLASSES')}
          className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3">
            <Icons.Users className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-sm font-bold text-white">Aulas</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Coletivas</p>
        </button>

        <button
          onClick={() => jumpToTab('SESSIONS')}
          className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
        >
          <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
            <Icons.Target className="w-5 h-5 text-pg-cobalt" />
          </div>
          <p className="text-sm font-bold text-white">Treinos</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Meus agendados</p>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {step !== 'CONFIRM' && renderTabs()}

        {/* Status Quota for Wellness */}
        {step === 'SERVICES' && activeTab === 'WELLNESS' && (
          <div className="p-6 rounded-3xl border border-white/[0.06] mb-6 relative overflow-hidden"
               style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold text-pg-cobalt uppercase tracking-[0.3em] block mb-1">Seu Momento Wellness</span>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {quotaExceeded 
                    ? "Cota do mês completa!" 
                    : sessionsUsed === 0 
                      ? "Você tem 2 sessões este mês" 
                      : "Você ainda tem 1 sessão!"}
                </h4>
              </div>
              <Icons.Leaf className={`w-8 h-8 ${quotaExceeded ? 'text-white/20' : 'text-pg-cobalt animate-pulse'}`} />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-2">
                {[1, 2].map((i) => (
                  <div 
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-[#010b2e] flex items-center justify-center ${
                      i <= sessionsUsed ? 'bg-pg-cobalt text-[#010b2e]' : 'bg-white/5 text-white/20'
                    }`}
                  >
                    {i <= sessionsUsed ? <Icons.Check className="w-5 h-5" /> : <Icons.Circle className="w-4 h-4" />}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/40 font-medium italic">
                {quotaExceeded 
                  ? "Aproveite seus resultados e relaxe." 
                  : "Reserve um tempo para cuidar de você."}
              </p>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <div className={`h-full ${quotaExceeded ? 'bg-white/20' : 'bg-pg-cobalt'} transition-all duration-1000`} style={{ width: `${(sessionsUsed / 2) * 100}%` }}></div>
            </div>
            
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pg-cobalt/5 blur-2xl rounded-full"></div>
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
