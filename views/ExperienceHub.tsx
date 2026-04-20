
import React, { useState } from 'react';
import { User, WellnessService } from '../types';
import { Icons, WELLNESS_SERVICES_DATA, CLASS_SERVICES_DATA, TRAINING_SESSIONS_DATA } from '../constants';
import { bookWellness } from '../firebase';
import Card from '../components/Card';

interface ExperienceHubProps {
  user: User;
  onBack: () => void;
}

const ExperienceHub: React.FC<ExperienceHubProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ARENA' | 'AGENDA' | 'ESSENCE'>('ARENA');
  const [agendaTab, setAgendaTab] = useState<'WELLNESS' | 'CLASSES' | 'SESSIONS'>('WELLNESS');
  const [selectedService, setSelectedService] = useState<WellnessService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('16');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'LIST' | 'SCHEDULE' | 'CONFIRM'>('LIST');

  const amenities = [
    { name: 'Valet', icon: Icons.Car },
    { name: 'Aromaterapia', icon: Icons.Leaf },
    { name: 'Wi-Fi 6', icon: Icons.Wifi },
    { name: 'Coffee Bar', icon: Icons.Coffee },
    { name: 'Luxury Spa', icon: Icons.Droplet },
    { name: 'Coworking', icon: Icons.FileText },
  ];

  const spaces = [
    { name: 'Arena Cardio', description: 'Technogym Live Experience', icon: Icons.TrendingUp },
    { name: 'Iron Zone', description: 'Elite Free Weights', icon: Icons.Dumbbell },
    { name: 'Mind & Body', description: 'Wellness & Recovery', icon: Icons.Yoga },
    { name: 'Sistema Flex', description: 'Metodologia Exclusiva', icon: Icons.Target },
  ];

  return (
    <div className="min-h-screen bg-app pb-20 relative overflow-hidden">
      <div className="precision-bg absolute inset-0 z-0 opacity-40 h-[120vh] -top-20"></div>
      
      <main className="relative z-10 px-6 pb-4 pt-[calc(4.5rem+env(safe-area-inset-top))] max-w-md mx-auto w-full space-y-5">
        <header className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Experience Center</p>
            <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Now</span>
            </div>
          </div>
          
          <div className="flex p-1 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('ARENA')}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ARENA' ? 'bg-slate-900 text-white dark:bg-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Arena
            </button>
            <button 
              onClick={() => setActiveTab('ESSENCE')}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ESSENCE' ? 'bg-slate-900 text-white dark:bg-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
            >
              A Essência
            </button>
            <button 
              onClick={() => setActiveTab('AGENDA')}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'AGENDA' ? 'bg-slate-900 text-white dark:bg-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Agenda
            </button>
          </div>
        </header>

        {activeTab === 'ARENA' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* O Espaço */}
            <section className="space-y-2">
                <div className="bg-slate-900 rounded-[32px] p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3 leading-tight">BOUTIQUE GYM<br />CONCEPT<span className="text-blue-500">.</span></h2>
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider mb-4 opacity-80">
                            Design biofílico, equipamentos de ponta Technogym e um ecossistema focado em elevar sua performance e bem-estar.
                        </p>
                        <div className="flex gap-2">
                            <span className="text-[7px] font-black text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-full uppercase tracking-widest bg-blue-500/5">Exclusive</span>
                            <span className="text-[7px] font-black text-slate-400 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest bg-white/5">Biophilic Design</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities Grid */}
            <section className="space-y-2 px-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Comodidades Exclusive</h2>
                <div className="grid grid-cols-3 gap-3">
                    {amenities.map((item, i) => (
                        <div key={i} className="aspect-square bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center p-3 group hover:border-blue-500/40 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <span className="text-[8px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter text-center">{item.name}</span>
                        </div>
                    ))}
                </div>
            </section>

             {/* Inner Spaces */}
             <section className="space-y-2 px-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ecossistema PG</h2>
                <div className="space-y-2">
                    {spaces.map((space, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all group cursor-pointer shadow-sm">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-all shadow-inner">
                                    <space.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{space.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-70 italic">{space.description}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                                <Icons.ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Location Card */}
            <section className="space-y-2 px-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Localização</h2>
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] space-y-4 shadow-sm overflow-hidden relative">
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600/5 blur-2xl rounded-full"></div>
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
                            <Icons.MapPin className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Península</h4>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-relaxed opacity-80 italic">
                                Av. Nina Rodrigues, esq. com Rua dos Jasmins<br/>
                                São Luís - Maranhão
                             </p>
                        </div>
                    </div>
                    <button className="w-full py-5 bg-slate-900 dark:bg-white/10 text-white font-black text-[9px] uppercase tracking-[0.4em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/5 relative z-10">
                        Navegar com GPS
                    </button>
                </div>
            </section>
          </div>
        )}

        {activeTab === 'ESSENCE' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Mission & Vision */}
            <section className="grid grid-cols-1 gap-3">
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] space-y-3 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                    <Icons.Target className="w-8 h-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">NOSSA MISSÃO</h3>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider italic">
                        "Proporcionar melhora efetiva na saúde, condicionamento físico e qualidade de vida de acordo com as necessidades e expectativas individuais."
                    </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] space-y-3 shadow-sm relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
                    <Icons.Shield className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">NOSSA VISÃO</h3>
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider italic">
                        Ser reconhecida como referência regional de saúde, bem-estar, inovação metodológica e capacitação profissional.
                    </p>
                </div>
            </section>

            {/* Methodology - Sistema Flex */}
            <section className="space-y-2">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">O Método</h2>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[32px] text-white space-y-4 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icons.Zap className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1.5 bg-white/20 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md">Exclusividade PG</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight mb-4">SISTEMA FLEX<br />EXCLUSIVE<span className="text-blue-300">.</span></h3>
                        <p className="text-[11px] font-medium text-blue-100 leading-relaxed uppercase tracking-widest opacity-90">
                            Uma metodologia única que integra prescrição de treinamento com suporte individualizado, garantindo que cada movimento seja otimizado para o seu DNA de performance.
                        </p>
                    </div>
                    <button className="w-full py-4 bg-white text-blue-600 font-black text-[9px] uppercase tracking-[0.4em] rounded-2xl hover:bg-slate-50 transition-all shadow-xl relative z-10">
                        Conhecer o Método
                    </button>
                </div>
            </section>

            {/* Values */}
            <section className="space-y-2 px-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Nossos Valores</h2>
                <div className="grid grid-cols-2 gap-3">
                    {['Ética', 'Valor Humano', 'Inovação', 'Comprometimento'].map((value, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[28px] flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">{value}</span>
                        </div>
                    ))}
                </div>
            </section>
          </div>
        )}

        {activeTab === 'AGENDA' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Sub-tabs for Agenda */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['WELLNESS', 'CLASSES', 'SESSIONS'].map((tab) => (
                    <button 
                         key={tab}
                         onClick={() => { setAgendaTab(tab as any); setBookingStep('LIST'); }}
                         className={`px-5 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all个人 whitespace-nowrap ${agendaTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10'}`}
                    >
                         {tab === 'WELLNESS' ? 'Spa & Recovery' : tab === 'CLASSES' ? 'Collective' : 'Treinos'}
                    </button>
                ))}
            </div>

            {agendaTab === 'WELLNESS' && (
                <div className="space-y-4">
                    {WELLNESS_SERVICES_DATA.map(service => (
                        <button 
                            key={service.id}
                            onClick={() => { setSelectedService(service as any); setBookingStep('SCHEDULE'); }}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-[32px] text-left group flex items-center gap-5 hover:border-blue-500/30 transition-all shadow-sm"
                        >
                            <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                <Icons.Leaf className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{service.name}</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic opacity-70">{service.duration} // {service.id === 'aromaterapia' ? 'Exclusive' : 'Premium'}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                                <Icons.Plus className="w-4 h-4 text-slate-300 group-hover:text-white" />
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {agendaTab === 'SESSIONS' && (
                <div className="space-y-4">
                    {TRAINING_SESSIONS_DATA.map(session => (
                        <Card key={session.id} variant="glass" className="p-6 rounded-[32px] border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Check-in Confirmado</span>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6 group-hover:text-blue-500 transition-colors">{session.title}</h4>
                                    <div className="flex items-center gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2">
                                            <Icons.Calendar className="w-4 h-4 text-blue-500" />
                                            {session.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icons.Clock className="w-4 h-4 text-blue-500" />
                                            {session.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Icons.User className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Overlay - simplified for brevity, in a real app would be full flow */}
      {bookingStep === 'SCHEDULE' && selectedService && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-end animate-in fade-in slide-in-from-bottom-full duration-500 p-4">
              <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[40px] p-8 space-y-8 pb-10 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-3">Reservar Experiência</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight">{selectedService.name}</h3>
                        </div>
                        <button onClick={() => setBookingStep('LIST')} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500/10 group transition-all">
                            <Icons.X className="w-6 h-6 text-slate-400 group-hover:text-red-500" />
                        </button>
                    </div>

                    <div className="space-y-5 relative z-10">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Disponibilidade Hoje</p>
                        <div className="grid grid-cols-4 gap-3">
                            {['08:00', '10:00', '14:00', '16:00', '18:00', '19:00', '20:00', '21:00'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setSelectedTime(t)}
                                    className={`py-3 px-1 rounded-2xl text-[10px] font-black transition-all ${selectedTime === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 border-blue-600' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border border-transparent hover:border-blue-500/30'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[32px] flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-inner">
                            <Icons.Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Notificação</p>
                            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Avisaremos 15 minutos antes.</p>
                        </div>
                    </div>

                    <button 
                        disabled={!selectedTime}
                        onClick={() => setBookingStep('CONFIRM')}
                        className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all relative z-10 ${selectedTime ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-700' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
                    >
                        Confirmar Reserva
                    </button>
              </div>
          </div>
      )}

      {bookingStep === 'CONFIRM' && (
          <div className="fixed inset-0 z-[101] bg-blue-600 flex flex-col items-center justify-center p-12 text-white animate-in zoom-in-95 duration-500">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-800 opacity-50"></div>
               <div className="relative z-10 flex flex-col items-center">
                    <div className="w-28 h-28 bg-white rounded-[40px] flex items-center justify-center text-blue-600 mb-10 shadow-3xl shadow-black/30 transform -rotate-12">
                        <Icons.Check className="w-14 h-14" />
                    </div>
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter text-center mb-6 leading-none">CHECK-IN<br />CONFIRMADO<span className="text-blue-300">!</span></h3>
                    <p className="text-[11px] font-bold uppercase tracking-[0.5em] opacity-80 mb-16 text-center">Prepare seu corpo para elevar o nível.</p>
                    <button 
                        onClick={() => { setBookingStep('LIST'); setActiveTab('AGENDA'); setAgendaTab('WELLNESS'); }}
                        className="w-full py-6 bg-slate-900 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl ring-1 ring-white/10"
                    >
                        Voltar para Agenda
                    </button>
               </div>
          </div>
      )}
    </div>
  );
};

export default ExperienceHub;
